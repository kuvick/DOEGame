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

// Import
import System.Collections.Generic;

// Singleton instance
private static var tb_instance:ToolBar = null;

// Game Management Variables
private var isPaused : boolean = false;
public static var currLevel : String = "Prototype - Level1";	// added by Derrick, used to keep track of the current level for game menu and score screen

// Button Textures. Textures will be assigned in the inspector
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

// Padding as a percent of total screen size in that direction
private var sidePaddingPercent = .01; // the space between all gui elements and the left and right side of the screen
private var topPaddingPercent = .02;

// Screen width and height
private var screenWidth: float;
private var screenHeight: float;

// Padding on top/bottom and sides as pixels
private var sidePadding: float;
private var topPadding: float;

// Bars to account for resolution differences
private var horizontalBarHeight:float;
private var verticalBarWidth:float;

// Main Menu Variables
private var mainMenuList:List.<Rect>;		// Stores all the Main Menu elements for easy iteration
private var gameMenuButton:Rect;   			// Added by D for toggling the Game Menu
private var waitButton:Rect; 				// Added by F for Waiting
private var undoButton:Rect;				// Added by K for Undoing
private var intelButton:Rect; 				// Added by F for toggling the Intel Menu

private var squareButtonWidthPercent = 0.12;// Width of a Main Menu button as a percent of height
private var squareButtonWidth;				// Width of a Main Menu button in actual pixels

private var showToolbar : boolean;
private var savedShowToolbar : boolean; 	// Current showToolbar status saved

private var fontHeightPercent = 0.03;		// Height of the font as a percentage of screen height
private var fontHeight;						// Height of the font in pixels

public var scoreSkin:GUISkin;				// GUISkin component, set in Inspector

// Event List Variables
private var eventList:EventLinkedList;
private var eventListUsed:boolean; 			// Determines if the event list is opened or not

private var eventListScrollRect:Rect; 		// For the positions of the scroll bars
private var eventListScrollPos:Vector2;

private var eventListBGRect:Rect; 			// Background for the event list
private var eventListCloseRect:Rect;		// Close the menu
private var eventListContentRect:Rect; 		// For the content area

private var eventListIconRect:Rect;
private var eventListDescriptionRect:Rect;
private var eventListTurnsRect:Rect;

private var eventListSidePaddingPercent:float = 0.03;
private var eventListTopPaddingPercent:float = 0.04;
private var eventListSidePadding:float;
private var eventListTopPadding:float;

private var eventListClosePercent:float	= 0.06;
private var eventListCloseWidth:float;

// Game Menu Variables
private var gameMenuList:List.<Rect>;		// Stores all the Game Menu elements for easy iteration
private var resumeGameButton:Rect;
private var levelSelectButton:Rect;
private var restartLevelButton:Rect;
private var startScreenButton:Rect;
private var saveExitButton:Rect;	

private var gameMenuOpen:boolean;
private var gameMenuButtonHeightPercent:float = 0.1;
private var gameMenuButtonWidthPercent:float = 0.2;
private var gameMenuButtonHeight:float;
private var gameMenuButtonWidth:float;

// Potentially Outdated Variables
private var windowHeightPercent = .2;		// height of the window as a percentage of the screen's height
private var windowHeight: float;
private var toolBarWidth: float;
private var toolBarHeight: float;

private var toolBarTopLeftX: float;
private var toolBarTopLeftY: float;

private var showWindow : boolean = false;

private var toolbarStrings : String[] = ["Main Menu", "Restart Level", "Buildings", "Wait"];
private var buildingMenuStrings : String[] = ["Building1", "Building2", "Building3", "Building4", "Building5"];

private var toolbarInt : int = -1;
private var buildingMenuInt : int = -1;

private var mainWindow;
private var dropDownWindow;
private var eventListWindow;

public static var toolbarWindow : Rect;
public static var buildingMenuWindow : Rect;

private var toolBarWidthPercent = .3;												// The tool bar for buildings as a perecentage of screen size in that direction
private var toolBarHeightPercent = 1 - (topPaddingPercent + windowHeightPercent); 	// make the toolbar fill up the screen space below the menu

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
	// Store window dimensions and calculate padding
	screenWidth = ScreenSettingsManager.instance.screenWidth;
	screenHeight = ScreenSettingsManager.instance.screenHeight;
	sidePadding = screenWidth * sidePaddingPercent;
	topPadding = screenHeight * topPaddingPercent;
	horizontalBarHeight = ScreenSettingsManager.instance.horizontalBarHeight;
	verticalBarWidth = ScreenSettingsManager.instance.verticalBarWidth;

	// Initialize all menus
	InitializeMainMenu();
	InitializeGameMenu();
	InitializeIntelMenu();
	
	// Log level name and set current level, added by Derrick
	Debug.Log("level " + Application.loadedLevelName);
	currLevel = Application.loadedLevelName; 
	
	/*
	// Claculate necessary numbers for creating a consistent layout
	var leftX = ScreenSettingsManager.instance.verticalBarWidth;
	var topY = ScreenSettingsManager.instance.horizontalBarHeight;
	
	windowHeight = screenHeight*windowHeightPercent;
	toolBarWidth = screenWidth*toolBarWidthPercent;
	toolBarHeight = screenHeight-windowHeight-(topPadding*2);
	
	toolBarTopLeftX = screenWidth-sidePadding-toolBarWidth + leftX;
	toolBarTopLeftY = windowHeight + topPadding + topY;
	
	toolbarWindow = RectFactory.NewRect(.01,.01,.98,.3);
	buildingMenuWindow = RectFactory.NewRect(.7,.32,.3,.68);
	*/
}

public static function GetInstance():ToolBar
{
	// Search for an instance of Toolbar
    if (tb_instance == null) 
    {
        tb_instance =  FindObjectOfType(typeof (ToolBar)) as ToolBar;
    }

    // If it is still null, create a new instance
    if (tb_instance == null) 
    {
        var obj:GameObject = new GameObject("ToolBar");
        tb_instance = obj.AddComponent(typeof (ToolBar)) as ToolBar;
        Debug.Log("Could not locate an ToolBar object. ToolBar was generated automaticly.");
    }

    return tb_instance;
}
	
function InitializeMainMenu()
{
	squareButtonWidth = squareButtonWidthPercent * screenHeight;
	squareButtonPadding = squareButtonWidthPercent * screenHeight;
	var totalButtonPadding = squareButtonWidth + sidePadding;
	fontHeight = fontHeightPercent * screenHeight;
	
	gameMenuButton = Rect(verticalBarWidth + sidePadding, horizontalBarHeight + sidePadding, squareButtonWidth, squareButtonWidth);											// Added by D, modified by F, puts Game Menu button in top left hand corner				
	waitButton = Rect(verticalBarWidth + sidePadding, screenHeight - (2 * totalButtonPadding) - horizontalBarHeight, squareButtonWidth, squareButtonWidth);					// Added by F, puts Wait button at bottom left corner above undo button	
	undoButton = Rect(verticalBarWidth + 5 * sidePadding, screenHeight - totalButtonPadding - horizontalBarHeight, squareButtonWidth , squareButtonWidth);						// Added by K, modified by F, puts Undo button at bottom left corner	
	intelButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, screenHeight - totalButtonPadding - horizontalBarHeight, squareButtonWidth, squareButtonWidth); 	// Added by F, puts Intel button at bottom right corner 

	mainMenuList = new List.<Rect>();
	mainMenuList.Add(gameMenuButton);
	mainMenuList.Add(waitButton);
	mainMenuList.Add(undoButton);
	mainMenuList.Add(intelButton);
	
	showToolbar = true;
	savedShowToolbar = showToolbar;
}

function InitializeGameMenu()
{
	gameMenuButtonHeight = screenHeight * gameMenuButtonHeightPercent;
	gameMenuButtonWidth = screenWidth * gameMenuButtonWidthPercent;
	
	resumeGameButton = Rect(verticalBarWidth + (screenWidth - gameMenuButtonWidth)/2, horizontalBarHeight + screenHeight * 0.4, gameMenuButtonWidth, gameMenuButtonHeight); 
	levelSelectButton = Rect(resumeGameButton.x, horizontalBarHeight + resumeGameButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight); 
	restartLevelButton = Rect(resumeGameButton.x, horizontalBarHeight + levelSelectButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
	startScreenButton = Rect(resumeGameButton.x, horizontalBarHeight + restartLevelButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
	saveExitButton = Rect(resumeGameButton.x, horizontalBarHeight + startScreenButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);

	gameMenuList = new List.<Rect>();
	gameMenuList.Add(resumeGameButton);
	gameMenuList.Add(levelSelectButton);
	gameMenuList.Add(restartLevelButton);
	gameMenuList.Add(startScreenButton);
	gameMenuList.Add(saveExitButton);
	
	gameMenuOpen = false;
}

function InitializeIntelMenu()
{
	eventListSidePadding = eventListSidePaddingPercent * screenWidth;
	eventListTopPadding = eventListTopPaddingPercent * screenHeight;
	eventListCloseWidth = eventListClosePercent * screenHeight;
	
	//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
	eventListBGRect = Rect(verticalBarWidth + eventListSidePadding, eventListTopPadding, screenWidth - (2 * eventListSidePadding), screenHeight - (2 * eventListTopPadding));
	eventListCloseRect = Rect(eventListBGRect.x + eventListBGRect.width - eventListCloseWidth - sidePadding, eventListBGRect.y + sidePadding, eventListCloseWidth, eventListCloseWidth);
	eventListScrollRect = Rect(eventListBGRect.x + sidePadding, eventListCloseRect.y + eventListCloseRect.height + sidePadding, eventListBGRect.width - 2 * sidePadding, eventListBGRect.height - eventListCloseRect.height - (2 * sidePadding));
	eventListContentRect = Rect(0, 0, eventListScrollRect.width - 8 * sidePadding, 1000);
	
	eventListIconRect = Rect(0, 0, eventListCloseWidth, eventListCloseWidth);
	eventListDescriptionRect = Rect(eventListCloseWidth + sidePadding/2, eventListCloseWidth, eventListContentRect.width - eventListCloseWidth, eventListCloseWidth);
	eventListTurnsRect = Rect(eventListDescriptionRect.x + eventListDescriptionRect.width + sidePadding/2, 0, eventListCloseWidth, eventListCloseWidth);
   
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
}

function OnGUI() 
{
	if(showToolbar)		{DrawMainMenu();}
	if(isPaused)		{DrawGameMenu();}
	if(eventListUsed)	{DrawIntelMenu();}
	
	/*
		mainWindow = GUI.Window (0, toolbarWindow, ToolbarWindowFunc, "DOE Gaming Project");
		
		if(showWindow)
		{
			dropDownWindow = GUI.Window (1, buildingMenuWindow, BuildingMenuFunc, "Building Menu");
			if(ModeController.getCurrentMode() != GameState.EXPLORE)
				ModeController.setCurrentMode(GameState.EXPLORE);
		}
		
		switch(toolbarInt)
		{	
			//Buildings menu
			case 2:
			Debug.Log("building menu");		
			ToggleBuildingWindowVisibility();
			toolbarInt = -1;
			break;
	*/
}

/*
	Draws all the buttons in the Main Menu.
	
	Buttons:
		Game Menu - Opens the Game Menu
		Wait - Advances the game a single turn
		Undo - Undoes the last action
		Intel - Opens the Intel screen
	
	Whenever a submenu is opened, the Main Menu is hidden in order to prevent conflicting clicks
*/
function DrawMainMenu()
{
	// added by Derrick, the game menu button
	// updated by Bomin, F
	if(GUI.Button(gameMenuButton, "Game Menu"))
	{
		Debug.Log("Game Menu button clicked");
		if(!isPaused)
		{ 
			Debug.Log("Game is paused");
			isPaused = true; 
			savedShowToolbar = showToolbar;
			showToolbar = false;
		}
	}
	
	// Added by F
	// Advances the game a single turn
	if(GUI.Button(waitButton, "Wait"))
	{
		Debug.Log("Wait button clicked");
		IntelSystem.addTurn();
	}
	
	// *** added by K, the undo button
	if(GUI.Button(undoButton, "Undo"))
	{
		Debug.Log("Debug button clicked");
		var data:Database = GameObject.Find("Database").GetComponent("Database");
		var didUndo = data.undo();
		if(didUndo)
			Debug.Log("Undo Successful!");
		else
			Debug.Log("Undo Failed!");
	}
	
	// Added by F
	// Toggles the intel menu
	if(GUI.Button(intelButton, "Intel"))
	{
		Debug.Log("Intel button clicked");
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
	
	// Set the font size of the label style of the scoreSkin variable
	scoreSkin.label.fontSize = fontHeight;
	// Set the current GUI's skin to the scoreSkin variable
	GUI.skin = scoreSkin;
	
	// Added by Derrick, Draws score, need to add functionality to pull from where score is being stored
	// Modified by F
	GUI.Label(Rect(verticalBarWidth + screenWidth - sidePadding, horizontalBarHeight + sidePadding, 0, 0), "Score: "); // + Database.?
	
	// *** added by K, IntelSystem Info
	// Modified by F
	GUI.Label(Rect(verticalBarWidth + screenWidth - sidePadding, horizontalBarHeight + (2 * sidePadding) + fontHeight, 0, 0), "Turn: " + IntelSystem.currentTurn);
}

function DrawGameMenu()
{
	if (GUI.Button(resumeGameButton, "Resume"))
	{
		Debug.Log("Game is unpaused");
		isPaused = false; 
		showToolbar = savedShowToolbar;
		savedShowToolbar = showToolbar;	
	}
	if (GUI.Button(levelSelectButton, "Level Select"))
	{
		Application.LoadLevel("LevelSelectScreen");
	}
	if (GUI.Button(restartLevelButton, "Restart"))
	{
		Application.LoadLevel(currLevel);  
	}
	if (GUI.Button(startScreenButton, "Start Screen"))
	{
		// TODO: Saves progress and returns to the starting screen
		Application.LoadLevel ("StartScreen");
	}
	if (GUI.Button(saveExitButton, "Save & Exit"))
	{
		// TODO: Closes game app and saves progress 
		Application.Quit();	
	}
}

function DrawIntelMenu()
{
	//Background box
	GUI.Box(eventListBGRect, "Intelligence Reports");
	
	// Closes the event list
	if (GUI.Button(eventListCloseRect, "X"))
	{
		eventListUsed = false;
		showToolbar = savedShowToolbar;
		savedShowToolbar = showToolbar;
	}
	
	//Scroll bar
	eventListScrollPos = GUI.BeginScrollView
	(
		eventListScrollRect,
		eventListScrollPos,
		eventListContentRect
	);
		
	//Array of events
	var currentHeight : int;
	var currNode : EventNode = eventList.head;
	var i : int = 0;
	
	while(currNode != null)
	{
		currentHeight = (i * eventListCloseWidth) + (i * sidePadding/2);
		
		//Draw Icon
		eventListIconRect.y = currentHeight;
    	GUI.Button(eventListIconRect, "Icon");
    	
    	//Description
    	eventListDescriptionRect.y = currentHeight;
    	GUI.Button(eventListDescriptionRect, currNode.data.description);

    	//Turn
    	eventListTurnsRect.y = currentHeight;
    	GUI.Button(eventListTurnsRect, currNode.data.time.ToString());
		
		currNode = currNode.next;
		++i;
	}
	GUI.EndScrollView();
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

			//Debug.Log("Building: at index " + i);
			//GUI.Label(Rect(100, 20 + (95*i), 200, 90 * i), buildingMenuStrings[i]);
			/*
        	GUI.Label(Rect(100, 20 + (95*i), 200, 90), 	data.buildings[i].buildingName 
        												+ "\n"
        												+ "INPUT: " + data.buildings[i].inputName
        												+ " [" + data.buildings[i].inputNum + "]"
        												+ "\n"
        												+ "OUTPUT: " + data.buildings[i].outputName
        												+ " [" + data.buildings[i].outputNum + "]");
        											*/

		}
		
		GUI.EndScrollView ();
}

function ToggleBuildingWindowVisibility(){
	showWindow = !showWindow;
}

// Helper function to determine if the given point on the screen is on a gui element
function NotOnGui(screenInputPosition: Vector2):boolean{	
	// since gui coordinates and screen coordinates differ, we need to convert the mouse position into the toolbar's rectangle gui coordinates
	var mousePos: Vector2;
	mousePos.x = screenInputPosition.x;
	mousePos.y = Screen.height-screenInputPosition.y;
	
	if(	NotOnMainMenu(screenInputPosition) ||
		NotOnGameMenu(screenInputPosition) ||
		(eventListUsed && eventListBGRect.Contains(mousePos)))
	{
		return (false);
	}
	else
	{
		return (true);
	}
}

function NotOnMainMenu(screenInputPosition:Vector2):boolean
{
	var mousePos:Vector2;
	mousePos.x = screenInputPosition.x;
	mousePos.y = Screen.height - screenInputPosition.y;
	
	for (var i = 0; i < mainMenuList.Count; i++)
	{
		if (mainMenuList[i].Contains(mousePos))
		{
			return false;
		}
	}
	return true;
}

function NotOnGameMenu(screenInputPosition:Vector2):boolean
{
	var mousePos:Vector2;
	mousePos.x = screenInputPosition.x;
	mousePos.y = Screen.height - screenInputPosition.y;

	for (var i = 0; i < gameMenuList.Count; i++)
	{
		if (gameMenuList[i].Contains(mousePos))
		{
			return false;
		}
	}
	return true;
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