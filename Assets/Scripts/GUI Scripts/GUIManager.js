/**********************************************************
GUIManager.js

Description: 

	GUIManager is responsible for: 
	- Drawing active GUIControls 
	- Passing on messages (as GUIEvents) from other classes to GUIControls
	- Recieving responses (as GUIEvents) from GUIControls and passing them back to the other scripts
	- Determining which GUIControls should be displayed when
	
	It is a Singleton, and should only be accessed by other classes through its
	static getter function, Instance(). GUIManager persists between scenes, so its Prefab
	should be added to every scene. A switch block in Start() determines which GUIControls
	will be displayed first depending on the scene name.
	
	All GUIControls should be placed in the same GameObject
	as GUIManager, declared as a variable, and with additional lines 
	in Start() to get the GUIControl from the components list and call its Initialize() function.
	
	When a GUIControl should be displayed, add it to the list of active controls. 
	When it needs to be hidden, remove it from the list.

Author: Francis Yuan
**********************************************************/
#pragma strict

import System.Collections.Generic;

// Persistent Singleton
private static var gm_instance:GUIManager = null;
private static var exists = false;

// GUIControls list and message queues
private var activeControls:List.<GUIControl>;
private var uiMessages:Queue.<GUIEvent>;
private var uiResponses:Queue.<GUIEvent>;
private var currentMessage:GUIEvent;
private var currentResponse:GUIEvent;

// GUIControl components
// All GUIControls must be components in the same GameObject as GUIManager
private var startMenu:StartMenu;
private var loading:Loading;
private var mainMenu:MainMenu;
private var marquee:StatusMarquee;
private var pauseMenu:PauseMenu;
private var intelMenu:IntelMenu;
private var buildingMenu:BuildingMenu;

// Delete this later when BuildingMenu is done
static var buildingMenuOpen;

/*
	GUIManager is a Singleton, all duplicate copies of it will be destroyed on Awake() 
	and only the first initialization of it will remain.
*/
public function Awake () 
{
	if(!exists)
	{
		DontDestroyOnLoad(this);
		exists = true;
	}
	else
	{	
		Destroy(this.gameObject);
	}
}

/*
	Returns an instance of the GUIManager, if any exists. If not, an instance will be created.
*/
public static function Instance():GUIManager
{
	// Search for an instance of Main Menu
    if (gm_instance == null) 
    {
        gm_instance =  FindObjectOfType(typeof (GUIManager)) as GUIManager;
    }

    // If it is still null, create a new instance
    if (gm_instance == null) 
    {
        var obj:GameObject = new GameObject("GUIManager");
        gm_instance = obj.AddComponent(typeof (GUIManager)) as GUIManager;
        Debug.Log("Could not locate an ToolBar object. ToolBar was generated automaticly.");
    }

    return gm_instance;
}

/*
	Initializes all variables and gets GUIControl components from the same
	GameObject that GUIManager is a component of.
*/
public function Start () 
{
	activeControls = new List.<GUIControl>();
	
	uiMessages = new Queue.<GUIEvent>();
	uiResponses = new Queue.<GUIEvent>();
	
	currentMessage = new GUIEvent();
	currentResponse = new GUIEvent();
	
	// Get GUIControls
	startMenu = GetComponent(StartMenu);
	loading = GetComponent(Loading);
	mainMenu = GetComponent(MainMenu);
	marquee = GetComponent(StatusMarquee);
	pauseMenu = GetComponent(PauseMenu);
	intelMenu = GetComponent(IntelMenu);
	buildingMenu = GetComponent(BuildingMenu);
	
	// Initialize all GUIControls;
	startMenu.Initialize();
	loading.Initialize();
	mainMenu.Initialize();
	marquee.Initialize();
	pauseMenu.Initialize();
	intelMenu.Initialize();
	buildingMenu.Initialize();
	
	// Add GUIControls to the activeControls list depending on the scene
	switch (Application.loadedLevelName)
	{
		case "StartScreen":
			activeControls.Add(startMenu);
			break;
			
		case "LoadingScreen":
			activeControls.Add(loading);
			loading.DelayLoad(4);
			break;
			
		case "DOEGame":
			//activeControls.Add(buildingMenu);
			activeControls.Add(mainMenu);
			activeControls.Add(marquee);
			break;
	}
}

/*
	Update involves 3 steps:
		1. Send every message in the message queue to all active GUIControls
		2. Recieve responses from every active GUIControl and put them in the response queue
		3. Respond to any events in the response queue
*/
public function Update() 
{
	// Send out every message in the message queue to all the active controls
	while (uiMessages.Count > 0)
	{
		currentMessage = uiMessages.Dequeue();
		for (var i:int = 0; i < activeControls.Count; i++)
		{
			activeControls[i].RecieveEvent(currentMessage);
		}
	}
	
	// Recieve responses from every active control and add them to the response queue
	for (var j:int = 0; j < activeControls.Count; j++)
	{
		uiResponses.Enqueue(activeControls[j].GiveResponse());
	}
	
	// Responds to every message in the response queue
	while (uiResponses.Count > 0)
	{
		RespondTo(uiResponses.Dequeue());
	}
}

/*
	Draws every active GUIControl
*/
public function OnGUI()
{
	for(var i:int = 0; i < activeControls.Count; i++)
	{
		activeControls[i].Render();
	}
}

/*
	Called by other classes to add a message to the message queue
*/
public function RecieveEvent(e:GUIEvent)
{
	uiMessages.Enqueue(e);
}

/*
	A switch block that handles all possible responses from GUIControls.
*/
private function RespondTo(response:GUIEvent)
{
	switch (response.type)
	{
		// Non-unique responses
		case EventTypes.MAIN:
			ClearControls();
			activeControls.Add(mainMenu);
			activeControls.Add(marquee);
			break;
		case EventTypes.LEVELSELECT:
			Application.LoadLevel("LevelSelectScreen");
			break;
		
		// Start Menu responses
		case EventTypes.RESUME:
			ClearControls();
			Application.LoadLevel("LoadingScreen");
			activeControls.Add(loading);
			loading.DelayLoad(3);
			break;
		case EventTypes.NEWGAME:
			ClearControls();
			Application.LoadLevel("LoadingScreen");
			activeControls.Add(loading);
			loading.DelayLoad(3);
			break;
		case EventTypes.FACEBOOK:
			break;
		case EventTypes.QUIT:
			Application.Quit();
		
		// Loading responses
		case EventTypes.DONELOADING:
			ClearControls();
			Application.LoadLevel("DOEGame");
			activeControls.Add(mainMenu);
			activeControls.Add(marquee);
			break;
			
		// Main Menu responses
		case EventTypes.PAUSE:
			ClearControls();
			activeControls.Add(pauseMenu);
			break;
		case EventTypes.INTEL:
			ClearControls();
			activeControls.Add(intelMenu);
			activeControls.Add(marquee);
			break;
		case EventTypes.WAIT:
			break;
		case EventTypes.UNDO:
			break;
			
		// Pause Menu responses
		case EventTypes.RESTART:
			Application.LoadLevel(Application.loadedLevel);
			ClearControls();
			activeControls.Add(mainMenu);
			activeControls.Add(marquee);
			break;
		case EventTypes.STARTMENU:
			Application.LoadLevel("StartScreen");
			ClearControls();
			activeControls.Add(startMenu);
			startMenu.SetSplash(false);
			break;
		case EventTypes.SAVEQUIT:
			Application.Quit();
			break;
			
		// Intel Menu responses
	}
}

/*
	Clears every control from the list of active controls
*/
private function ClearControls()
{
	for (var i:int = 0; i < activeControls.Count; i++)
	{
		activeControls[i].ClearResponse();
	}
	activeControls.Clear();
}

/*
	Determines whether or not an input position is hovering over some part of a GUIControl.
*/
public function NotOnGUI(screenInputPosition: Vector2):boolean
{
	// Convert mouse coordinates (bottom left registration) to screen coordinates (top left registration)
	var inputPos: Vector2;
	inputPos.x = screenInputPosition.x;
	inputPos.y = Screen.height - screenInputPosition.y;
	
	for (var i:int = 0; i < activeControls.Count; i++)
	{
		if (activeControls[i].InputOverControl(inputPos))
		{
			return false;
		}
	}
	
	return true;
}