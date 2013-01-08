/**********************************************************
ToolBar.js

Description: Sets up toolbar above along with building menu. 
Used mouse click events for now which will be changed to 
touch while deploying for mobile device.
Tip: Click on Building menu button to toggle visibility of 
building menu window.

Note: Attach the script to Main Camera.

Author: Ajinkya Waghulde
**********************************************************/

//Variables
private var toolbarInt : int = -1;
private var buildingMenuInt : int = -1;
private var isPaused : boolean = false;

//Note: textures will be assigned from unity inspector.
var btnTextureArray : Texture[] = new Texture[10];
var btnTexture0 : Texture; 
var btnTexture1 : Texture; 
var btnTexture2 : Texture;
var btnTexture3 : Texture; 
var btnTexture4 : Texture;
var btnTexture5 : Texture; 
var btnTexture6 : Texture; 
var btnTexture7 : Texture;
var btnTexture8 : Texture; 
var btnTexture9 : Texture;

public static var showWindow : boolean = false;

// added by Derrick, used to keep track of the current level for game menu and score screen
public static var currLevel : String = "Prototype - Level1";

//need to replace text with GUI texture (if needed)
private var toolbarStrings : String[] = ["Main Menu", "Restart Level", "Buildings", "Wait"];
private var buildingMenuStrings : String[] = ["Building1", "Building2", "Building3", "Building4", "Building5"];

// Padding as a percent of total screen size in that direction
private var sidePaddingPercent = .01; // the space between all gui elements and the left and right side of the screen
private var topPaddingPercent = .01;
// height of the window as a percentage of the screen's height
private var windowHeightPercent = .2;
// The tool bar for buildings as a perecentage of screen size in that direction
private var toolBarWidthPercent = .3;
private var toolBarHeightPercent = 1 - (topPaddingPercent + windowHeightPercent); // make the toolbar fill up the screen space below the menu

private var screenWidth: float;
private var screenHeight: float;
private var sidePadding: float;
private var topPadding: float;
private var windowHeight: float;
private var toolBarWidth: float;
private var toolBarHeight: float;

private var toolBarTopLeftX: float;
private var toolBarTopLeftY: float;

// The actual gui elements to fill
public static var toolbarWindow : Rect;
public static var buildingMenuWindow : Rect;

public static var undoButton : Rect;		//*** added by K

public static var gameMenuButton : Rect;   // added by D for game menu

private var showToolbar : boolean;
private var savedShowToolbar : boolean; //Current showToolbar status saved

//EVENT LIST VARIABLES
public static var eventList : EventLinkedList;
public static var eventListUsed : boolean; //Determines if the event list is opened or not

public static var eventListRect : Rect; //Button for toggling the event list
public static var eventListBGRect : Rect; //Background for the event list
private var eventListTurnRect : Rect; //Current turn label
private var eventListScrollRect : Rect; //For the positions of the scroll bars
private var eventListContentRect : Rect; //For the content area
private var eventFacebookPostRect : Rect;
private var eventFacebookLoginRect : Rect;

private var eventListScrollPos : Vector2;
///////////////////////

private var mainWindow;
private var dropDownWindow;
private var eventListWindow;


var scrollPosition : Vector2 = Vector2.zero;		// used for scrollbar for building menu

function Awake(){
	btnTextureArray[0] = btnTexture0;
	btnTextureArray[1] = btnTexture1;
	btnTextureArray[2] = btnTexture2;
	btnTextureArray[3] = btnTexture3;
	btnTextureArray[4] = btnTexture4;
	btnTextureArray[5] = btnTexture5;
	btnTextureArray[6] = btnTexture6;
	btnTextureArray[7] = btnTexture7;
	btnTextureArray[8] = btnTexture8;
	btnTextureArray[9] = btnTexture9;
}

function Start(){
	showToolbar = true;
	savedShowToolbar = showToolbar;
	
	var leftX = ScreenSettingsManager.instance.verticalBarWidth;
	var topY = ScreenSettingsManager.instance.horizontalBarHeight;

	// Need to determine screen size and density at start time for accurate reading
	screenWidth = ScreenSettingsManager.instance.screenWidth;
	screenHeight = ScreenSettingsManager.instance.screenHeight;
	sidePadding = screenWidth*sidePaddingPercent;
	topPadding = screenHeight*topPaddingPercent;
	windowHeight = screenHeight*windowHeightPercent;
	toolBarWidth = screenWidth*toolBarWidthPercent;
	toolBarHeight = screenHeight-windowHeight-(topPadding*2);
	
	toolBarTopLeftX = screenWidth-sidePadding-toolBarWidth + leftX;
	toolBarTopLeftY = windowHeight + topPadding + topY;
	
	toolbarWindow = RectFactory.NewRect(.01,.01,.98,.3);
	buildingMenuWindow = RectFactory.NewRect(.7,.32,.3,.68);
	undoButton = RectFactory.NewRect(0,.85);// *** added by K, puts undo button in bottom left corner
	gameMenuButton = RectFactory.NewRect(0,.7);// *** added by D, puts game menu button in bottom left corner above undo and intel system
	
	//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
	eventListRect = RectFactory.NewRect(0,.55);
	eventListBGRect = Rect(50, 50, screenWidth - 100, screenHeight - 100);
	eventListTurnRect = Rect(eventListBGRect.x + eventListBGRect.width - 60, eventListBGRect.y + 10, 50, 50);
	eventListScrollRect = Rect(eventListBGRect.x + 10, eventListTurnRect.y + eventListTurnRect.height + 10, eventListBGRect.width - 10, eventListBGRect.height - eventListTurnRect.height * 2 - 20);
	eventListContentRect = Rect(0, 0, eventListBGRect.width - eventListScrollRect.x - eventListBGRect.x, 1000);
	
	
	eventList = new EventLinkedList();
	var bE1:BuildingEvent = new BuildingEvent();
	bE1.description = "Game started.";
	bE1.type = 0;
	bE1.time = 1;
	var bE2:BuildingEvent = new BuildingEvent();
	bE2.description = "The Coal Mine needs new equipment to continue to ship out coal.";
	bE2.type = 1;
	bE2.time = 22;
	var bE3:BuildingEvent = new BuildingEvent();
	bE3.description = "The local Waste Disposal Facility is willing to help fund our project!.";
	bE3.type = 0;
	bE3.time = 19;
	var bE4:BuildingEvent = new BuildingEvent();
	bE4.description = "A Manager is looking to make his next career move.";
	bE4.type = 0;
	bE4.time = 15;
	var bE5:BuildingEvent = new BuildingEvent();
	bE5.description = "A new Researcher is about to graduate from the University.";
	bE5.type = 0;
	bE5.time = 12;
	var bE6:BuildingEvent = new BuildingEvent();
	bE6.description = "The factory is going to shut down if they don't get cheaper fuel.";
	bE6.type = 1;
	bE6.time = 8;
	
	eventList.InsertNode(bE1);
	eventList.InsertNode(bE2);
	eventList.InsertNode(bE3);
	eventList.InsertNode(bE4);
	eventList.InsertNode(bE5);
	eventList.InsertNode(bE6);
	
	eventListUsed = false;
	
	Debug.Log("eventList.length = " + eventList.GetSize()); //Print the length just in case
	Debug.Log("level " + Application.loadedLevelName);
	currLevel = Application.loadedLevelName; // added by Derrick, sets the current level on load
}

function OnGUI() 
{
	//Draw Event List button
	if(GUI.Button(eventListRect, "Event List"))
	{
		Debug.Log("Event List clicked");
		if(eventListUsed)
		{
			eventListUsed = false;
			showToolbar = savedShowToolbar;
			savedShowToolbar = showToolbar;
		}
		else
		{
			eventListUsed = true;
			savedShowToolbar = showToolbar;
			showToolbar = false;	
		}
	}


	if(showToolbar)
	{
		mainWindow = GUI.Window (0, toolbarWindow, ToolbarWindowFunc, "DOE Gaming Project");
		
		if(showWindow)
		{
			dropDownWindow = GUI.Window (1, buildingMenuWindow, BuildingMenuFunc, "Building Menu");
			if(ModeController.getCurrentMode() != GameState.EXPLORE)
				ModeController.setCurrentMode(GameState.EXPLORE);
		}
		
		switch(toolbarInt)
		{
			//Main menu
			case 0:
			Debug.Log("main menu");
			Application.LoadLevel ("StartScreen");
			toolbarInt = -1;
			break;
			
			//Restart level
			case 1:
			Debug.Log("restart level");
			Application.LoadLevel (currLevel);  
			toolbarInt = -1;
			break;
			
			//Buildings menu
			case 2:
			Debug.Log("building menu");		
			ToggleBuildingWindowVisibility();
			toolbarInt = -1;
			break;
			
			//Wait
			case 3:
			Debug.Log("wait");
			toolbarInt = -1;
			IntelSystem.addTurn();
			break;
		}
		
		// *** added by K, the undo button
		if(GUI.Button(undoButton, "Undo"))
		{
			var data:Database = GameObject.Find("Database").GetComponent("Database");
			var didUndo = data.undo();
			if(didUndo)
				Debug.Log("Undo Successful!");
			else
				Debug.Log("Undo Failed!");
		}
		
		// *** added by K, IntelSystem Info
		GUI.Label(RectFactory.NewRect(.21,.95), "Current Turn: " + IntelSystem.currentTurn);
		
		// Added by Derrick, Draws score, need to add functionality to pull from where score is being stored
		GUI.Label(RectFactory.NewRect(.21,.9), "Score: "); // + Database.?
	}
	
	// added by Derrick, the game menu button
	// updated by Bomin
	if(GUI.Button(gameMenuButton, "Game Menu"))
	{
		Debug.Log("game menu opened");
		Debug.Log(isPaused);
		if(!isPaused){ isPaused = true; GameMenu.pauseGame(); }
		else { isPaused = false; GameMenu.resumeGame(); }
	}
	
	if(eventListUsed)
	{
		//Background box
		GUI.Box(eventListBGRect, "Intelligence Reports");
		
		//Current turn label
		GUI.Button(eventListTurnRect, IntelSystem.currentTurn.ToString());
		
		//Scroll bar
		eventListScrollPos = GUI.BeginScrollView(
			eventListScrollRect,
			eventListScrollPos,
			eventListContentRect
			);
			
		//Array of events
		var buildingEventRect : Rect;
		var tempPos : int;
		var currentYStart : int;
		var currNode : EventNode = eventList.head;
		var i : int = 0;
		while(currNode != null)
		{
			currentYStart = i * 50 + (i + 1) * 5;
			
			//Draw Icon
        	buildingEventRect = Rect(5, currentYStart, 50, 50);
        	GUI.Button(buildingEventRect, "Icon");
        	
        	//Description
        	tempPos = eventListContentRect.x + eventListContentRect.width - 60;
        	buildingEventRect = Rect(60, currentYStart, tempPos, 50);
        	GUI.Button(buildingEventRect, currNode.data.description);

        	//Turn
        	buildingEventRect = Rect(tempPos + 65, currentYStart, 50, 50);
        	GUI.Button(buildingEventRect, currNode.data.time.ToString());
			
			currNode = currNode.next;
			++i;
		}
		
    	GUI.EndScrollView();
	}
}

function Update()
{
	var currNode : EventNode = eventList.head;
	while(currNode != null)
{
		currNode = currNode.next;
	}
}

//Note: window id is 0 for toolbar
function ToolbarWindowFunc (windowID : int) {              
        toolbarInt = GUI.Toolbar (Rect (10, 20, toolbarWindow.width - 20, toolbarWindow.height - 25), 
        						  toolbarInt, 
        						  toolbarStrings);
}

//Note: window id is 1 for building menu
function BuildingMenuFunc (windowID : int) {
        
        var data:Database = GameObject.Find("Database").GetComponent("Database");
        
        // Added a scroll bar for when there are multiple buildings; need to find a way to disable the panning of the camera while scrolling
        scrollPosition = GUI.BeginScrollView (Rect (5,25,toolBarWidth - 25 , toolBarHeight - 50), scrollPosition, Rect (0, 0, toolBarWidth - 75, toolBarHeight + 75), false, true);
        
        for(var i =0; i<6; i++)
        {
        	if(GUI.Button(Rect(5, 20 + (95*i), 90, 90), btnTextureArray[i]))
        	{
        		PlaceBuilding.changeBuilding = i;
        		showWindow = false;
        	}

        	GUI.Label(Rect(100, 20 + (95*i), 200, 90), 	data.buildings[i].buildingName 
        												+ "\n"
        												+ "INPUT: " + data.buildings[i].inputName
        												+ " [" + data.buildings[i].inputNum + "]"
        												+ "\n"
        												+ "OUTPUT: " + data.buildings[i].outputName
        												+ " [" + data.buildings[i].outputNum + "]");
        											

		}
		
		GUI.EndScrollView ();
}

function ToggleBuildingWindowVisibility(){
	showWindow = !showWindow;
}

// Helper function to determine if the given point on the screen is on a gui element
static function NotOnGui(screenInputPosistion: Vector2){	
	// since gui coordinates and screen coordinates differ, we need to convert the mouse position into the toolbar's rectangle gui coordinates
	var mousePos: Vector2;
	mousePos.x = screenInputPosistion.x;
	mousePos.y = Screen.height-screenInputPosistion.y;
	
	if(toolbarWindow.Contains(mousePos) || (showWindow && buildingMenuWindow.Contains(mousePos)) || undoButton.Contains(mousePos) || eventListRect.Contains(mousePos) ||
	(eventListUsed && eventListBGRect.Contains(mousePos)))
	{
		return (false);
	}
	else
	{
		return (true);
	}
}


/////////////// Pause Functions ///////////////// (Bomin)
function OnPauseGame()
{
	showToolbar = false;
	savedShowToolbar = showToolbar;
}

function OnResumeGame()
{
	showToolbar = true;
	savedShowToolbar = showToolbar;
}
///////////////////////////////////////////////// (Bomin)