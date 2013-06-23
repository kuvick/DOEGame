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
//private var marquee:StatusMarquee;
private var pauseMenu:PauseMenu;
private var intelMenu:IntelMenu;
private var buildingMenu:BuildingMenu;
private var levelSelectMenu:LevelSelectMenu;
private var scoreMenu:ScoreMenu;
private var failureMenu:FailureMenu;
private var metricMenu:MetricMenu;
private var contactsMenu:ContactsMenu;
private var codexMenu:CodexMenu;
private var contactInspectorMenu:ContactInspectorMenu;
//private var popUpMessageDisplay:PopUpMessageDisplay;

// Delete this later when BuildingMenu is done
static var buildingMenuOpen;

private var intelSystem : IntelSystem;
private var database: Database;

public var thisIsALevel : boolean = false;

private var inputNotOnOtherGUI : boolean = true;
private var UndoPressed : int = 0;

public static var addLevel : boolean = false;
public static var levelToAdd : String;

/*
	GUIManager is a Singleton, all duplicate copies of it will be destroyed on Awake() 
	and only the first initialization of it will remain.
*/
public function Awake () 
{
	/*
	This is temporarily removed to allow for the transition between scenes
	
	if(!exists)
	{
		DontDestroyOnLoad(this);
		exists = true;
	}
	else
	{	
		Destroy(this.gameObject);
	}
	*/
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

// Since the GUIManager is present throughtout, this prevents the searching
// for the Intel System and such before it is on a level.
public function LoadLevelReferences()
{
	Debug.Log("Loading Database and Intel System ref into GUIManager");
	intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
	database = GameObject.Find("Database").GetComponent(Database);
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
	//marquee = GetComponent(StatusMarquee);
	pauseMenu = GetComponent(PauseMenu);
	intelMenu = GetComponent(IntelMenu);
	buildingMenu = GetComponent(BuildingMenu);
	levelSelectMenu = GetComponent(LevelSelectMenu);
	scoreMenu = GetComponent(ScoreMenu);
	failureMenu = GetComponent(FailureMenu);
	metricMenu = GetComponent(MetricMenu);
	contactsMenu = GetComponent(ContactsMenu);
	codexMenu = GetComponent(CodexMenu);
	contactInspectorMenu = GetComponent(ContactInspectorMenu);
	//popUpMessageDisplay = GetComponent(PopUpMessageDisplay);
	
	// Add GUIControls to the activeControls list depending on the scene
	switch (Application.loadedLevelName)
	{
		case "StartScreen":
			//AddGUIToControls(startMenu);
			AddGUIToControls(contactsMenu);
			break;
		
		case "LevelSelectScreen":
			AddGUIToControls(levelSelectMenu);
			break;
			
		case "LoadingScreen":
			AddGUIToControls(loading);
			//loading.DelayLoad(4);
			SetupLoading();
			break;		
		// temporary for unit testing purposes	
		case "UnitTest":
			//activeControls.Add(buildingMenu);
			AddGUIToControls(mainMenu);
			//AddGUIToControls(marquee);
			break;
	}
	
	if(thisIsALevel)
	{
		AddGUIToControls(mainMenu);
		//AddGUIToControls(marquee);
		//AddGUIToControls(popUpMessageDisplay);
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
	
	if(!activeControls.Contains(pauseMenu)
		&& !activeControls.Contains(intelMenu)
		&& !activeControls.Contains(buildingMenu)
		&& activeControls.Contains(mainMenu))
	{
		if(intelSystem != null)
			intelSystem.renderEvents();
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
			AddGUIToControls(mainMenu);
			//AddGUIToControls(marquee);
			break;
		case EventTypes.LEVELSELECT:
			Application.LoadLevel("LevelSelectScreen");
			
			ClearControls();
			AddGUIToControls(levelSelectMenu);
			break;
		case EventTypes.BUILDING:
			ClearControls();
			AddGUIToControls(buildingMenu);
			//AddGUIToControls(marquee);
			break;
		
		// Start Menu responses
		case EventTypes.RESUME:
			ClearControls();
			Application.LoadLevel("LoadingScreen");
			AddGUIToControls(loading);
			//loading.DelayLoad(3);
			SetupLoading();
			break;
		case EventTypes.NEWGAME:
			ClearControls();
			Application.LoadLevel("LoadingScreen");
			AddGUIToControls(loading);
			//loading.DelayLoad(3);
			SetupLoading();
			break;
		case EventTypes.FACEBOOK:
			break;
		case EventTypes.QUIT:
			Application.Quit();
		
		// Loading responses
		case EventTypes.DONELOADING:
			ClearControls();
			AddGUIToControls(mainMenu);
			//AddGUIToControls(marquee);
			var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
			Application.LoadLevel(nextLevel.nextLevel);
			break;
			
		// Main Menu responses
		case EventTypes.PAUSE:
			ClearControls();
			AddGUIToControls(pauseMenu);
			break;
		case EventTypes.METRIC:
			if(database.m_display.GatherData(intelSystem.currentLevelName))
			{
				database.m_display.AnalyzeData();
			}
			metricMenu.Initialize();
				
			ClearControls();
			AddGUIToControls(metricMenu);
			break;
		case EventTypes.INTEL:
			ClearControls();
			AddGUIToControls(intelMenu);
			//AddGUIToControls(marquee);
			break;
		case EventTypes.WAIT:
			if(intelSystem != null)
				intelSystem.addTurn();				
			else
				Debug.Log("Intel System not loaded yet");
			database.UndoStack.Add(UndoType.Wait);
			database.Save("Wait");
			ClearControls();
			AddGUIToControls(mainMenu);
			//AddGUIToControls(marquee);
			break;
		case EventTypes.UNDO:
			if(database.undo())
			{					
				intelSystem.subtractTurn();
				UndoPressed++;				
			}			
			ClearControls();
			AddGUIToControls(mainMenu);
			//AddGUIToControls(marquee);
			break;
			
		// Pause Menu responses
		case EventTypes.RESTART:
			Application.LoadLevel(Application.loadedLevel);
			ClearControls();
			AddGUIToControls(mainMenu);
			//AddGUIToControls(marquee);
			break;
		case EventTypes.STARTMENU:
			Application.LoadLevel("StartScreen");
			ClearControls();
			AddGUIToControls(startMenu);
			startMenu.SetSplash(false);
			break;
		case EventTypes.SAVEQUIT:
			Application.Quit();
			break;
			
		// Intel Menu responses
		
		// Score Menu responses
		case EventTypes.SCORESCREEN:
			//Application.LoadLevel("ScoreScreen");
			//database.SaveMetrics();
			GUIManager.addLevel = true;
			GUIManager.levelToAdd = Application.loadedLevelName;
						
			RecordEndGameData();
			
			ClearControls();
			AddGUIToControls(scoreMenu);
			break;
		case EventTypes.FAILUREMENU:
			RecordEndGameData();
		
			ClearControls();
			AddGUIToControls(failureMenu);
			break;
		case EventTypes.CONTACTSMENU:
			ClearControls();
			AddGUIToControls(contactsMenu);
			break;
		case EventTypes.CONTACTINPECTIONMENU:
			contactInspectorMenu.SetContact(contactsMenu.currentContact);
			ClearControls();
			AddGUIToControls(contactInspectorMenu);
			break;
		case EventTypes.CODEXMENU:
			ClearControls();
			AddGUIToControls(codexMenu);
			break;
	}
}

private function SetupLoading()
{
	loading.GetNewJob();
	loading.DelayLoad(5);
}

private function RecordEndGameData()
{

	database.metrics.EndGame = new EndGameData(
								intelSystem.getPrimaryScore() + intelSystem.getOptionalScore(),
								intelSystem.totalEvents,
								intelSystem.events.Count + intelSystem.linkedEvents.Count,
								intelSystem.currentTurn,
								UndoPressed);
																											
	System.IO.Directory.CreateDirectory(Path.Combine(Application.dataPath, "Metrics/" + intelSystem.currentLevelName + "/LINK"));													
	System.IO.Directory.CreateDirectory(Path.Combine(Application.dataPath, "Metrics/" + intelSystem.currentLevelName + "/END"));													
	System.IO.Directory.CreateDirectory(Path.Combine(Application.dataPath, "Metrics/" + intelSystem.currentLevelName + "/TURN"));													
	database.metrics.SaveEndGame(Path.Combine(Application.dataPath, "Metrics/" + intelSystem.currentLevelName + "/END/"));
	database.metrics.SaveLink(Path.Combine(Application.dataPath, "Metrics/" + intelSystem.currentLevelName + "/LINK/"));
	database.metrics.SaveTurn(Path.Combine(Application.dataPath, "Metrics/" + intelSystem.currentLevelName + "/TURN/"));
	
	UndoPressed = 0;
	intelSystem.totalEvents = 0;
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

public function NotOnOtherGUI()
{
	return inputNotOnOtherGUI;
}

public function SetNotOnOtherGUI(b : boolean)
{
	inputNotOnOtherGUI = b;
}

public function AddGUIToControls(guiControlToAdd : GUIControl){
	if (!guiControlToAdd.isInitialized){
		guiControlToAdd.Initialize();
	}
	guiControlToAdd.OnOpen();
	activeControls.Add(guiControlToAdd);
}

public function AddContact(){
	//popUpMessageDisplay.AddMessage(new ContactUnlocked(contactsMenu.contacts[0]));
}

public function AddTimedControl(timedControlToAdd : TimedControl){
	
}
