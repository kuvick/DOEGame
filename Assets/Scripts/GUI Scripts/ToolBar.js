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
private var showToolbar : boolean;
private var savedShowToolbar : boolean; 	// Current showToolbar status saved

private var squareButtonWidthPercent = 0.12;// Width of a Main Menu button as a percent of height
private var squareButtonWidth;				// Width of a Main Menu button in actual pixels

public static var gameMenuButton:Rect;   	// Added by D for toggling the Game Menu
public static var waitButton:Rect; 		// Added by F for Waiting
public static var undoButton:Rect;		// Added by K for Undoing
public static var intelButton:Rect; 		// Added by F for toggling the Intel Menu

public var scoreSkin:GUISkin;				// GUISkin component, set in Inspector
private var fontHeightPercent = 0.03;		// Height of the font as a percentage of screen height
private var fontHeight;						// Height of the font in pixels

// Event List Variables
public static var eventList:EventLinkedList;
public static var eventListUsed:boolean; 	// Determines if the event list is opened or not
public static var eventListRect:Rect; 	// Button for toggling the event list
public static var eventListBGRect:Rect; 	// Background for the event list

private var eventListCloseRect:Rect;		// Close the menu
private var eventListScrollRect:Rect; 	// For the positions of the scroll bars
private var eventListContentRect:Rect; 	// For the content area
private var eventFacebookPostRect:Rect;
private var eventFacebookLoginRect:Rect;
private var eventListScrollPos:Vector2;

// Game Menu Variables
private var gameMenuOpen:boolean;
private var gameMenuButtonHeightPercent:float = 0.1;
private var gameMenuButtonWidthPercent:float = 0.2;
private var gameMenuButtonHeight:float;
private var gameMenuButtonWidth:float;

private var resumeGameButton:Rect;
private var levelSelectButton:Rect;
private var restartLevelButton:Rect;
private var startScreenButton:Rect;
private var saveExitButton:Rect;

// Potentially Outdated Variables
private var windowHeightPercent = .2;	// height of the window as a percentage of the screen's height
private var windowHeight: float;
private var toolBarWidth: float;
private var toolBarHeight: float;

private var toolBarTopLeftX: float;
private var toolBarTopLeftY: float;

public static var showWindow : boolean = false;

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

function InitializeMainMenu()
{
	showToolbar = true;
	savedShowToolbar = showToolbar;
	
	squareButtonWidth = squareButtonWidthPercent * screenHeight;
	squareButtonPadding = squareButtonWidthPercent * screenHeight;
	var totalButtonPadding = squareButtonWidth + sidePadding;
	
	gameMenuButton = new Rect(verticalBarWidth + sidePadding, horizontalBarHeight + sidePadding, squareButtonWidth, squareButtonWidth);											// Added by D, modified by F, puts Game Menu button in top left hand corner				
	waitButton = new Rect(verticalBarWidth + sidePadding, screenHeight - (2 * totalButtonPadding) - horizontalBarHeight, squareButtonWidth, squareButtonWidth);					// Added by F, puts Wait button at bottom left corner above undo button	
	undoButton = new Rect(verticalBarWidth + 5 * sidePadding, screenHeight - totalButtonPadding - horizontalBarHeight, squareButtonWidth , squareButtonWidth);						// Added by K, modified by F, puts Undo button at bottom left corner	
	intelButton = new Rect(verticalBarWidth + screenWidth - totalButtonPadding, screenHeight - totalButtonPadding - horizontalBarHeight, squareButtonWidth, squareButtonWidth); 	// Added by F, puts Intel button at bottom right corner 

	fontHeight = fontHeightPercent * screenHeight;
}

function InitializeGameMenu()
{
	gameMenuOpen = false;
	gameMenuButtonHeight = screenHeight * gameMenuButtonHeightPercent;
	gameMenuButtonWidth = screenWidth * gameMenuButtonWidthPercent;
	resumeGameButton = new Rect(verticalBarWidth + (screenWidth - gameMenuButtonWidth)/2, horizontalBarHeight + screenHeight * 0.4, gameMenuButtonWidth, gameMenuButtonHeight); 
	levelSelectButton = new Rect(resumeGameButton.x, horizontalBarHeight + resumeGameButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight); 
	restartLevelButton = new Rect(resumeGameButton.x, horizontalBarHeight + levelSelectButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
	startScreenButton = new Rect(resumeGameButton.x, horizontalBarHeight + restartLevelButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
	saveExitButton = new Rect(resumeGameButton.x, horizontalBarHeight + startScreenButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
}

function InitializeIntelMenu()
{
	//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
	eventListRect = RectFactory.NewRect(0,.55);
	eventListBGRect = Rect(verticalBarWidth + 50, 50, screenWidth - 100, screenHeight - 100);
	eventListCloseRect = Rect(eventListBGRect.x + eventListBGRect.width - 60, eventListBGRect.y + 10, 50, 50);
	eventListScrollRect = Rect(eventListBGRect.x + 10, eventListCloseRect.y + eventListCloseRect.height + 10, eventListBGRect.width - 10, eventListBGRect.height - eventListCloseRect.height * 2 - 20);
	eventListContentRect = Rect(0, 0, eventListBGRect.width - 30, 1000);
	
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