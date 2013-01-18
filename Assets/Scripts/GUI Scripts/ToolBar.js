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

// Game Management Booleans
private var isPaused : boolean = false;
private var gameMenuOpen:boolean;
private var eventListUsed:boolean; 			// Determines if the event list is opened or not
private var showToolbar : boolean;
private var savedShowToolbar : boolean; 	// Current showToolbar status saved
private var showWindow : boolean = false;

// Game Name
public static var currLevel : String = "Prototype - Level1";	// added by Derrick, used to keep track of the current level for game menu and score screen

// Skins for GUI components
public var toolBarSkin:GUISkin;				// GUISkin component for the tool bar, set in Inspector
public var gameMenuSkin:GUISkin;			// GUISkin component for the game menu, set in Inspector
public var intelLeftSkin:GUISkin;			// GUISkin component for the event icon, set in Inspector
public var intelBorderSkin:GUISkin;			// GUISkin component for the event border, set in Inspector
public var intelRightSkin:GUISkin;			// GUISkin component for the event turns, set in Inspector

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

// Tool Bar Variables
private var ToolBarList:List.<Rect>;		// Stores all the Main Menu elements for easy iteration
private var gameMenuButton:Rect;   			// Added by D for toggling the Game Menu
private var waitButton:Rect; 				// Added by F for Waiting
private var undoButton:Rect;				// Added by K for Undoing
private var intelButton:Rect; 				// Added by F for toggling the Intel Menu

private var hexButtonHeightPercent:float = 0.2;	// Width of a Main Menu button as a percent of height
private var scoreFontHeightPercent:float = 0.04;	// Height of the font as a percentage of screen height
private var menuFontHeightPercent:float = 0.03;	// Height of the font as a percentage of screen height
private var hexButtonPadding:float;

private var hexButtonHeight:float;			// Width of a Main Menu button in actual pixels
private var scoreFontHeight:float;			// Height of the font in pixels
private var menuFontHeight:float;			// Height of the font in pixels

// Toolbar Textures
private var undoTexture:Texture;					// Texture to display for the undo button
private var waitTexture:Texture;					// Texture to display for the wait button
private var intelTexture:Texture;					// Texture to display for the intel button

public var undoTextureNeutral:Texture;				// Texture for the undo button when unclicked
public var undoTextureClicked:Texture;				// Texture for the undo button when clicked
public var waitTextureNeutral:Texture;				// Texture for the wait button when unclicked
public var waitTextureClicked:Texture;				// Texture for the wait button when clicked
public var intelTextureNeutral:Texture;				// Texture for the intel button when unclicked
public var intelTextureClicked:Texture;				// Texture for the intel button when clicked

// Event List Variables
private var eventList:EventLinkedList;

private var eventListScrollRect:Rect; 		// For the positions of the scroll bars
private var eventListScrollPos:Vector2;

private var eventListBGRect:Rect; 			// Background for the event list
private var eventListCloseRect:Rect;		// Close the menu
private var eventListContentRect:Rect; 		// For the content area

private var eventListIconRect:Rect;
private var eventListDescriptionRect:Rect;
private var eventListTurnsRect:Rect;
private var eventListNodeRect:Rect;

private var eventListSidePaddingPercent:float = 0.02;
private var eventListTopPaddingPercent:float = 0.04;
private var eventListCloseWidthPercent:float = 0.12;
private var eventListNodeWidthPercent:float	= 0.12;
private var eventListFontHeightPercent:float = 0.03;

private var eventListSidePadding:float;
private var eventListTopPadding:float;
private var eventListCloseWidth:float;
private var eventListNodeWidth:float;
private var eventListFontHeight:float;

// Game Menu Variables
private var gameMenuList:List.<Rect>;		// Stores all the Game Menu elements for easy iteration
private var resumeGameButton:Rect;
private var levelSelectButton:Rect;
private var restartLevelButton:Rect;
private var startScreenButton:Rect;
private var saveExitButton:Rect;	

private var gameMenuButtonHeightPercent:float = 0.1;
private var gameMenuButtonWidthPercent:float = 0.2;
private var gameMenuButtonHeight:float;
private var gameMenuButtonWidth:float;

// Potentially Outdated Variables
private var windowHeightPercent = .2;		// height of the window as a percentage of the screen's height
private var toolBarWidth: float;
private var toolBarHeight: float;

private var buildingMenuStrings : String[] = ["Building1", "Building2", "Building3", "Building4", "Building5"];
private var buildingMenuInt : int = -1;
public static var buildingMenuWindow : Rect;

public static var toolbarWindow : Rect;

private var toolBarWidthPercent = .3;												// The tool bar for buildings as a perecentage of screen size in that direction
private var toolBarHeightPercent = 1 - (topPaddingPercent + windowHeightPercent); 	// make the toolbar fill up the screen space below the menu

var scrollPosition : Vector2 = Vector2.zero;		// used for scrollbar for building menu

static var buildingMenuOpen;

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
	
	buildingMenuOpen = false;
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
	InitializeToolBar();
	InitializeGameMenu();
	InitializeIntelMenu();
	
	// Log screen dimensions
	Debug.Log("Screen Width: " + screenWidth);
	Debug.Log("Screen Height: " + screenHeight);
	
	// Log level name and set current level, added by Derrick
	Debug.Log("level " + Application.loadedLevelName);
	currLevel = Application.loadedLevelName; 
	
	/*
	// Claculate necessary numbers for creating a consistent layout
	windowHeight = screenHeight*windowHeightPercent;
	toolBarWidth = screenWidth*toolBarWidthPercent;
	toolBarHeight = screenHeight-windowHeight-(topPadding*2);
	
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
	
function InitializeToolBar()
{
	hexButtonHeight = hexButtonHeightPercent * screenHeight;
	var totalButtonPadding : float = hexButtonHeight + sidePadding;
	
	scoreFontHeight = scoreFontHeightPercent * screenHeight;
	toolBarSkin.label.fontSize = scoreFontHeight;
	
	menuFontHeight = menuFontHeightPercent * screenHeight;
	toolBarSkin.button.fontSize = menuFontHeight;
	
	gameMenuButton = Rect(verticalBarWidth + sidePadding, horizontalBarHeight + sidePadding, hexButtonHeight, hexButtonHeight);														
	waitButton = Rect(verticalBarWidth + sidePadding, horizontalBarHeight + screenHeight - (1.7 * totalButtonPadding), hexButtonHeight, hexButtonHeight);						
	var undoButtonPos:Vector2 = HexCalc(Vector2(waitButton.x, waitButton.y), hexButtonHeight, 3);
	undoButton = Rect(undoButtonPos.x, undoButtonPos.y, hexButtonHeight , hexButtonHeight);																					
	intelButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, horizontalBarHeight + screenHeight - totalButtonPadding, hexButtonHeight, hexButtonHeight); 	

	ToolBarList = new List.<Rect>();
	ToolBarList.Add(gameMenuButton);
	ToolBarList.Add(waitButton);
	ToolBarList.Add(undoButton);
	ToolBarList.Add(intelButton);
	
	showToolbar = true;
	savedShowToolbar = showToolbar;
}

function InitializeGameMenu()
{
	gameMenuButtonHeight = screenHeight * gameMenuButtonHeightPercent;
	gameMenuButtonWidth = screenWidth * gameMenuButtonWidthPercent;

	resumeGameButton =	Rect(verticalBarWidth + sidePadding, horizontalBarHeight + sidePadding, hexButtonHeight, hexButtonHeight);	
	levelSelectButton = Rect(verticalBarWidth + (screenWidth - gameMenuButtonWidth)/2, horizontalBarHeight + screenHeight * 0.4, gameMenuButtonWidth, gameMenuButtonHeight); 
	restartLevelButton = Rect(levelSelectButton.x, levelSelectButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
	startScreenButton = Rect(levelSelectButton.x, restartLevelButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
	saveExitButton = Rect(levelSelectButton.x, startScreenButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);

	gameMenuList = new List.<Rect>();
	gameMenuList.Add(resumeGameButton);
	gameMenuList.Add(levelSelectButton);
	gameMenuList.Add(restartLevelButton);
	gameMenuList.Add(startScreenButton);
	gameMenuList.Add(saveExitButton);
}

function InitializeIntelMenu()
{
	eventListSidePadding = eventListSidePaddingPercent * screenWidth;
	eventListTopPadding = eventListTopPaddingPercent * screenHeight;
	eventListCloseWidth = eventListCloseWidthPercent * screenHeight;
	eventListNodeWidth = eventListNodeWidthPercent * screenHeight;
	
	eventListFontHeight = eventListFontHeightPercent * screenHeight;
	intelLeftSkin.button.fontSize = eventListFontHeight;;
	intelBorderSkin.button.fontSize = eventListFontHeight;;
    intelRightSkin.button.fontSize = eventListFontHeight;;
	
	//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
	eventListBGRect = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
	eventListCloseRect = Rect(eventListBGRect.x + eventListBGRect.width - eventListCloseWidth - sidePadding, eventListBGRect.y + sidePadding, eventListCloseWidth, eventListCloseWidth);
	eventListScrollRect = Rect(eventListBGRect.x + sidePadding, eventListCloseRect.y + eventListCloseRect.height + sidePadding, eventListBGRect.width - 2 * sidePadding, eventListBGRect.height - eventListCloseRect.height - (2 * sidePadding));
	eventListContentRect = Rect(0, 0, eventListScrollRect.width - 2 * eventListSidePadding, 1000);
	
	eventListIconRect = Rect(eventListSidePadding, 0, eventListNodeWidth, eventListNodeWidth);
	eventListDescriptionRect = Rect(eventListIconRect.x + eventListNodeWidth, 0, eventListContentRect.width - 2.5 * eventListNodeWidth, eventListNodeWidth);
	eventListTurnsRect = Rect(eventListDescriptionRect.x + eventListDescriptionRect.width, 0, eventListNodeWidth, eventListNodeWidth);
    
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
	if(showToolbar)		{DrawToolBar();}
	if(isPaused)		{DrawGameMenu();}
	if(eventListUsed)	{DrawIntelMenu();}
}

/*
	Draws the Main Menu.
	
	Buttons:
		Game Menu - Opens the Game Menu
		Wait - Advances the game a single turn
		Undo - Undoes the last action
		Intel - Opens the Intel screen
	
	Whenever a submenu is opened, the Main Menu is hidden in order to prevent conflicting clicks
*/
function DrawToolBar()
{   
	GUI.skin = toolBarSkin;
	
	// Set icon textures to default
	waitTexture = waitTextureNeutral;
	undoTexture = undoTextureNeutral;
	intelTexture = intelTextureNeutral;
	
	// Calculate the mouse position
	var mousePos:Vector2;
	mousePos.x = Input.mousePosition.x;
	mousePos.y = Screen.height - Input.mousePosition.y;
	
	// Calculate any touches
	// TODO: Test whether this code block actually works with touch controls
	var touchPos:Vector2;
	for (var i = 0; i < Input.touchCount; ++i) 
	{
        if (Input.GetTouch(i).phase == TouchPhase.Began) 
        {
        	touchPos = Input.GetTouch(i).position;
        }
    }
    
    // If the mouse or the finger is hovering/tapping one of the buttons, change the button's texture
	if (waitButton.Contains(mousePos) || waitButton.Contains(touchPos))
	{
		waitTexture = waitTextureClicked;
	}
	
	if (undoButton.Contains(mousePos) || undoButton.Contains(touchPos))
	{
		undoTexture = undoTextureClicked;
	}
	
	if (intelButton.Contains(mousePos) || intelButton.Contains(touchPos))
	{
		intelTexture = intelTextureClicked;
	}
	
	// Draw the buttons and respond to interaction
	if(GUI.Button(gameMenuButton, "Menu"))
	{
		Debug.Log("Game Menu button clicked");
		if(!isPaused)
		{ 
			Debug.Log("Game is paused");
			isPaused = true; 
			savedShowToolbar = showToolbar;
			showToolbar = false;
			ModeController.setCurrentMode(GameState.PAUSE);
		}
	}
	
	if(GUI.Button(waitButton, waitTexture))
	{
		Debug.Log("Wait button clicked");
		IntelSystem.addTurn();
	}
	
	if(GUI.Button(undoButton, undoTexture))
	{
		Debug.Log("Debug button clicked");
		var data:Database = GameObject.Find("Database").GetComponent("Database");
		var didUndo = data.undo();
		if(didUndo)
		{
			IntelSystem.subtractTurn();
			Debug.Log("Undo Successful!");
		}
		else
			Debug.Log("Undo Failed!");
	}
	
	if(GUI.Button(intelButton, intelTexture))
	{
		Debug.Log("Intel button clicked");
		if(!eventListUsed)
		{
			eventListUsed = true;
			savedShowToolbar = showToolbar;
			showToolbar = false;	
			ModeController.setCurrentMode(GameState.INTEL);
		}
	}
	
	// Draw the score and label
	GUI.Label(Rect(verticalBarWidth + screenWidth - sidePadding, horizontalBarHeight + sidePadding, 0, 0), "0000000");
	GUI.Label(Rect(verticalBarWidth + screenWidth - sidePadding, horizontalBarHeight + (2 * sidePadding) + scoreFontHeight, 0, 0), "Turn: " + IntelSystem.currentTurn);
}

/*
	Draws the Game Menu.
	
	Buttons:
		Resume - Closes the game menu
		Level Select - Loads the Level Selection Screen
		Restart - Restarts the current level
		Save & Exit - Saves progress and exits the program
*/
function DrawGameMenu()
{
	GUI.skin = toolBarSkin;
	if (GUI.Button(resumeGameButton, "Resume"))
	{
		Debug.Log("Game is unpaused");
		isPaused = false; 
		showToolbar = savedShowToolbar;
		savedShowToolbar = showToolbar;	
		ModeController.setCurrentMode(GameState.EXPLORE);
	}
	
	GUI.skin = gameMenuSkin;
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

/*
	Draws all the buttons in the Intel Menu.
	
	Buttons:
		Event - Each event is a button
		Close - Closes the Intel Menu
	
*/
function DrawIntelMenu()
{
	GUI.Box(eventListBGRect, "");
	
	GUI.skin = toolBarSkin;
	
	// Closes the event list
	if (GUI.Button(eventListCloseRect, "X"))
	{
		eventListUsed = false;
		showToolbar = savedShowToolbar;
		savedShowToolbar = showToolbar;
		ModeController.setCurrentMode(GameState.EXPLORE);
	}
	
	// Scroll bar
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
		currentHeight = (i * eventListNodeWidth * 0.78);
		
		eventListIconRect.y = currentHeight;
		eventListTurnsRect.y = currentHeight;
		eventListDescriptionRect.y = currentHeight;
		eventListNodeRect.y = currentHeight;
		
		GUI.skin = intelLeftSkin;
    	GUI.Button(eventListIconRect, "Icon");
    	
		GUI.skin = intelBorderSkin;
		GUI.Button(eventListDescriptionRect, currNode.data.description);
		
    	GUI.skin = intelRightSkin;
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
	mousePos.y = Screen.height - screenInputPosition.y;
	
	if(	NotOnToolBar(screenInputPosition) ||
		NotOnGameMenu(screenInputPosition) ||
		(eventListUsed && eventListBGRect.Contains(mousePos)) ||
		buildingMenuOpen)
	{
		return (true);
	}
	else
	{
		return (false);
	}
}

function NotOnToolBar(screenInputPosition:Vector2):boolean
{
	var mousePos:Vector2;
	mousePos.x = screenInputPosition.x;
	mousePos.y = Screen.height - screenInputPosition.y;
	
	for (var i = 0; i < ToolBarList.Count; i++)
	{
		if (ToolBarList[i].Contains(mousePos))
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

/*
	Helper function that finds the position of a hexagon bordering an equivalent base hexagon
	 
	Parameters:
		position - The top left hand corner of the bounding box of the base hexagon
		length - The length of a side of the bounding box of the base hexagon
		side - The side that borders the base hexagon, starting from the top right side at 1, moving clockwise around the hexagon
		
	Return:
		A Vector2 object describing the top left hand corner of the bounding box of a hexagon
		that borders the base hexagon
		
	Note:
		Assumes the hexagon is pointing upwards		
*/
function HexCalc(position:Vector2, length:float, side:int):Vector2
{
	var angle = (90 - (side * 60) + 30) * Mathf.PI/180;
	var offsetLength = length * 0.85;
	var sin = Mathf.Sin(angle) * offsetLength;
	var cos = Mathf.Cos(angle) * offsetLength;
	
	var newPosition:Vector2 = Vector2(position.x + cos, position.y - sin);
	
	return newPosition;
}

public function OnPauseGame()
{
	showToolbar = false;
	savedShowToolbar = showToolbar;
}

public function OnResumeGame()
{
	showToolbar = true;
	savedShowToolbar = showToolbar;
}