/**********************************************************
GUIManager.js

Description: Responsible for the control flow between the Main Menu, the Pause Menu and the Intel Menu.

Note: Attach the script to Main Camera.

Author: Ajinkya Waghulde
**********************************************************/

// Import
import System.Collections.Generic;

// Singleton instance
private static var gm_instance:GUIManager = null;

// Game Management Booleans
private var isPaused : boolean = false;
private var pauseMenuOpen:boolean;
private var intelMenuOpen:boolean; 			// Determines if the event list is opened or not
private var mainMenuOpen : boolean;
private var savedMainMenuOpen : boolean; 	// Current mainMenuOpen status saved
private var showWindow : boolean = false;

// Game Name
public static var currLevel : String = "Prototype - Level1";	// added by Derrick, used to keep track of the current level for game menu and score screen

// Skins for GUI components
public var mainMenuSkin:GUISkin;			// GUISkin component for the main menu, set in Inspector
public var pauseMenuSkin:GUISkin;			// GUISkin component for the game menu, set in Inspector
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

// Main Menu Variables
private var mainMenuList:List.<Rect>;				
private var pauseMenuButton:Rect;   				
private var waitButton:Rect; 						
private var undoButton:Rect;						
private var intelButton:Rect; 						

private var hexButtonHeightPercent:float = 0.2;		// Width of a Main Menu button as a percent of height
private var hexButtonPadding:float;
private var scoreFontHeightPercent:float = 0.04;	// Height of the score font as a percentage of screen height
private var menuFontHeightPercent:float = 0.03;		// Height of the menu font as a percentage of screen height

private var hexButtonHeight:float;					// Width of a Main Menu button in actual pixels
private var scoreFontHeight:float;					// Height of the score font in pixels
private var menuFontHeight:float;					// Height of the menu font in pixels

// Main Menu Textures
private var undoTexture:Texture;					
private var waitTexture:Texture;					
private var intelTexture:Texture;					

public var undoTextureNeutral:Texture;				
public var undoTextureClicked:Texture;				
public var waitTextureNeutral:Texture;				
public var waitTextureClicked:Texture;				
public var intelTextureNeutral:Texture;				
public var intelTextureClicked:Texture;				

// Event List Variables
private var eventList:EventLinkedList;

private var intelMenuScrollRect:Rect; 				
private var intelMenuScrollPos:Vector2;

private var intelMenuBGRect:Rect; 					
private var intelMenuCloseRect:Rect;				
private var intelMenuContentRect:Rect; 				

private var intelMenuIconRect:Rect;
private var intelMenuDescriptionRect:Rect;
private var intelMenuTurnsRect:Rect;
private var intelMenuNodeRect:Rect;

private var intelMenuPaddingPercent:float = 0.02;
private var intelMenuCloseWidthPercent:float = 0.12;
private var intelMenuNodeWidthPercent:float	= 0.12;
private var intelMenuFontHeightPercent:float = 0.03;

private var intelMenuPadding:float;
private var intelMenuCloseWidth:float;
private var intelMenuNodeWidth:float;
private var intelMenuFontHeight:float;

// Pause Menu Variables		
private var pauseMenuBackground:Rect;
private var pauseMenuTitle:Rect;
private var resumeGameButton:Rect;
private var levelSelectButton:Rect;
private var restartLevelButton:Rect;
private var startScreenButton:Rect;
private var saveExitButton:Rect;	

private var pauseMenuGroupHeightPercent:float = 0.3;			// Height of the entire menu as a percentage of screen height
private var pauseMenuButtonHeightPercent:float = 0.16;			// Height of each button as a percentage of screen height
private var pauseMenuButtonRatio:float = 4;						// Width to height ratio of the button texture (for accurate sclaing)
private var pauseMenuButtonOffsetPercent:float = 0.8;			// The "height" of the button used for positioning to account for whitespace in the textures

private var pauseMenuButtonTextOffsetXPercent:float = -0.18;	// Offset X of the button text so it's aligned according to the mockup
private var pauseMenuButtonTextOffsetYPercent:float = 0.43;		// Offset Y of the button text so it's aligned according to the mockup

private var pauseMenuTitleOffsetXPercent:float = 0.11;			// Offset X of the meny title so it's aligned according to the mockup
private var pauseMenuTitleOffsetYPercent:float = -0.5;			// Offset Y of the meny title so it's aligned according to the mockup

private var pauseMenuTitleHeightPercent:float = 0.09;			// Height of the font of the title as a percentage of screen height
private var pauseMenuFontHeightPercent:float = 0.04;			// Height of the font of the buttons as a percentage of screen height

private var pauseMenuButtonHeight:float;
private var pauseMenuButtonWidth:float;
private var pauseMenuButtonOffset:float;
private var pauseMenuButtonTextOffsetY:float;
private var pauseMenuButtonTextOffsetX:float;
private var pauseMenuTitleOffsetX:float;
private var pauseMenuTitleOffsetY:float;
private var pauseMenuTitleHeight:float;
private var pauseMenuFontHeight:float;

// Building Menu Variables
private var windowHeightPercent = .2;			// height of the window as a percentage of the screen's height
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
	InitializeMainMenu();
	InitializePauseMenu();
	InitializeIntelMenu();
	
	// Log screen dimensions
	Debug.Log("Screen Width: " + screenWidth);
	Debug.Log("Screen Height: " + screenHeight);
	
	// Log level name and set current level, added by Derrick
	Debug.Log("level " + Application.loadedLevelName);
	currLevel = Application.loadedLevelName; 
}


function OnGUI() 
{
	if(mainMenuOpen)		{DrawMainMenu();}
	if(pauseMenuOpen)		{DrawPauseMenu();}
	if(intelMenuOpen)		{DrawIntelMenu();}
}

function Update()
{
	var currNode : EventNode = eventList.head;
	while(currNode != null)
	{
		currNode = currNode.next;
	}
}
	
function InitializeMainMenu()
{
	hexButtonHeight = hexButtonHeightPercent * screenHeight;
	var totalButtonPadding : float = hexButtonHeight + sidePadding;
	
	scoreFontHeight = scoreFontHeightPercent * screenHeight;
	mainMenuSkin.label.fontSize = scoreFontHeight;
	
	menuFontHeight = menuFontHeightPercent * screenHeight;
	mainMenuSkin.button.fontSize = menuFontHeight;
	
	pauseMenuButton = Rect(verticalBarWidth + sidePadding, horizontalBarHeight + sidePadding, hexButtonHeight, hexButtonHeight);														
	waitButton = Rect(verticalBarWidth + sidePadding, horizontalBarHeight + screenHeight - (1.7 * totalButtonPadding), hexButtonHeight, hexButtonHeight);						
	var undoButtonPos:Vector2 = HexCalc(Vector2(waitButton.x, waitButton.y), hexButtonHeight, 3);
	undoButton = Rect(undoButtonPos.x, undoButtonPos.y, hexButtonHeight , hexButtonHeight);																					
	intelButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, horizontalBarHeight + screenHeight - totalButtonPadding, hexButtonHeight, hexButtonHeight); 	

	mainMenuList = new List.<Rect>();
	mainMenuList.Add(pauseMenuButton);
	mainMenuList.Add(waitButton);
	mainMenuList.Add(undoButton);
	mainMenuList.Add(intelButton);
	
	mainMenuOpen = true;
	savedMainMenuOpen = mainMenuOpen;
}

function InitializePauseMenu()
{
	pauseMenuButtonHeight = pauseMenuButtonHeightPercent* screenHeight;
	pauseMenuButtonWidth = pauseMenuButtonHeight * pauseMenuButtonRatio;
	pauseMenuButtonOffset = pauseMenuButtonOffsetPercent * pauseMenuButtonHeight;
	
	pauseMenuButtonTextOffsetY = pauseMenuButtonTextOffsetYPercent * pauseMenuButtonHeight;
	pauseMenuButtonTextOffsetX = pauseMenuButtonTextOffsetXPercent * pauseMenuButtonWidth;
	pauseMenuTitleOffsetX = pauseMenuTitleOffsetXPercent * pauseMenuButtonWidth;
	pauseMenuTitleOffsetY = pauseMenuTitleOffsetYPercent * pauseMenuButtonHeight;
	
	pauseMenuTitleHeight = pauseMenuTitleHeightPercent * screenHeight;
	pauseMenuFontHeight = pauseMenuFontHeightPercent * screenHeight;
	
	pauseMenuSkin.label.fontSize = pauseMenuTitleHeight;
	pauseMenuSkin.button.fontSize = pauseMenuFontHeight;
	pauseMenuSkin.button.contentOffset.x = pauseMenuButtonTextOffsetX;
	pauseMenuSkin.button.contentOffset.y = pauseMenuButtonTextOffsetY;
	
	pauseMenuBackground = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
	resumeGameButton =	Rect(verticalBarWidth + sidePadding, horizontalBarHeight + sidePadding, hexButtonHeight, hexButtonHeight);	
	levelSelectButton = Rect(verticalBarWidth + (screenWidth - pauseMenuButtonWidth)/2, horizontalBarHeight + screenHeight * pauseMenuGroupHeightPercent, pauseMenuButtonWidth, pauseMenuButtonHeight); 
	restartLevelButton = Rect(levelSelectButton.x, levelSelectButton.y + pauseMenuButtonOffset, pauseMenuButtonWidth, pauseMenuButtonHeight);
	startScreenButton = Rect(levelSelectButton.x, restartLevelButton.y + pauseMenuButtonOffset, pauseMenuButtonWidth, pauseMenuButtonHeight);
	saveExitButton = Rect(levelSelectButton.x, startScreenButton.y + pauseMenuButtonOffset, pauseMenuButtonWidth, pauseMenuButtonHeight);
	pauseMenuTitle = Rect(levelSelectButton.x + pauseMenuTitleOffsetX, levelSelectButton.y + pauseMenuTitleOffsetY, 0, 0);
}

function InitializeIntelMenu()
{
	intelMenuPadding = intelMenuPaddingPercent * screenWidth;
	intelMenuCloseWidth = intelMenuCloseWidthPercent * screenHeight;
	intelMenuNodeWidth = intelMenuNodeWidthPercent * screenHeight;
	
	intelMenuFontHeight = intelMenuFontHeightPercent * screenHeight;
	intelLeftSkin.button.fontSize = intelMenuFontHeight;;
	intelBorderSkin.button.fontSize = intelMenuFontHeight;;
    intelRightSkin.button.fontSize = intelMenuFontHeight;;
	
	//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
	intelMenuBGRect = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
	intelMenuCloseRect = Rect(intelMenuBGRect.x + intelMenuBGRect.width - intelMenuCloseWidth - sidePadding, intelMenuBGRect.y + sidePadding, intelMenuCloseWidth, intelMenuCloseWidth);
	intelMenuScrollRect = Rect(intelMenuBGRect.x + sidePadding, intelMenuCloseRect.y + intelMenuCloseRect.height + sidePadding, intelMenuBGRect.width - 2 * sidePadding, intelMenuBGRect.height - intelMenuCloseRect.height - (2 * sidePadding));
	intelMenuContentRect = Rect(0, 0, intelMenuScrollRect.width - 2 * intelMenuPadding, 1000);
	
	intelMenuIconRect = Rect(intelMenuPadding, 0, intelMenuNodeWidth, intelMenuNodeWidth);
	intelMenuDescriptionRect = Rect(intelMenuIconRect.x + intelMenuNodeWidth, 0, intelMenuContentRect.width - 2.5 * intelMenuNodeWidth, intelMenuNodeWidth);
	intelMenuTurnsRect = Rect(intelMenuDescriptionRect.x + intelMenuDescriptionRect.width, 0, intelMenuNodeWidth, intelMenuNodeWidth);
    
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
	
	intelMenuOpen = false;
	Debug.Log("eventList.length = " + eventList.GetSize()); //Print the length just in case
}


/*
	Draws the Main Menu.
	
	Buttons:
		Pause Menu - Opens the Pause Menu
		Wait - Advances the game a single turn
		Undo - Undoes the last action
		Intel - Opens the Intel screen
	
	Whenever a submenu is opened, the Main Menu is hidden in order to prevent conflicting clicks
*/
function DrawMainMenu()
{   
	GUI.skin = mainMenuSkin;
	
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
	if(GUI.Button(pauseMenuButton, "Menu"))
	{
		PlayButtonPress(1);
		Debug.Log("Pause Menu button clicked");
		if(!isPaused)
		{ 
			Debug.Log("Game is paused");
			isPaused = true; 
			pauseMenuOpen = true;
			savedMainMenuOpen = mainMenuOpen;
			mainMenuOpen = false;
			ModeController.setCurrentMode(GameState.PAUSE);
		}
	}
	
	if(GUI.Button(waitButton, waitTexture))
	{
		PlayButtonPress(1);
		Debug.Log("Wait button clicked");
		IntelSystem.addTurn();
	}
	
	if(GUI.Button(undoButton, undoTexture))
	{
		PlayButtonPress(1);
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
		PlayButtonPress(1);
		Debug.Log("Intel button clicked");
		if(!intelMenuOpen)
		{
			intelMenuOpen = true;
			savedMainMenuOpen = mainMenuOpen;
			mainMenuOpen = false;	
			ModeController.setCurrentMode(GameState.INTEL);
		}
	}
	
	// Draw the score and label
	GUI.Label(Rect(verticalBarWidth + screenWidth - sidePadding, horizontalBarHeight + sidePadding, 0, 0), "0000000");
	GUI.Label(Rect(verticalBarWidth + screenWidth - sidePadding, horizontalBarHeight + (2 * sidePadding) + scoreFontHeight, 0, 0), "Turn: " + IntelSystem.currentTurn);
}

/*
	Draws the Pause Menu.
	
	Buttons:
		Resume - Closes the game menu
		Level Select - Loads the Level Selection Screen
		Restart - Restarts the current level
		Save & Exit - Saves progress and exits the program
*/
function DrawPauseMenu()
{
	GUI.skin = pauseMenuSkin;
	GUI.Box(pauseMenuBackground, "");
	GUI.Label(pauseMenuTitle, "PAUSE");

	if (GUI.Button(levelSelectButton, "level select"))
	{
		PlayButtonPress(1);
		Application.LoadLevel("LevelSelectScreen");
	}
	
	if (GUI.Button(restartLevelButton, "restart"))
	{
		PlayButtonPress(2);
		
		Application.LoadLevel(currLevel);  
	}
	
	if (GUI.Button(startScreenButton, "start screen"))
	{
		PlayButtonPress(1);
		// TODO: Saves progress and returns to the starting screen
		Application.LoadLevel ("StartScreen");
	}
	
	if (GUI.Button(saveExitButton, "save and quit"))
	{
		PlayButtonPress(2);
		// TODO: Closes game app and saves progress 
		Application.Quit();	
	}
	
	GUI.skin = mainMenuSkin;
	if (GUI.Button(resumeGameButton, "Resume"))
	{
		PlayButtonPress(2);
		Debug.Log("Game is unpaused");
		isPaused = false; 
		pauseMenuOpen = false;
		mainMenuOpen = savedMainMenuOpen;
		savedMainMenuOpen = mainMenuOpen;	
		ModeController.setCurrentMode(GameState.EXPLORE);
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
	GUI.Box(intelMenuBGRect, "");
	
	GUI.skin = mainMenuSkin;
	
	// Closes the event list
	if (GUI.Button(intelMenuCloseRect, "X"))
	{
		PlayButtonPress(1);
		intelMenuOpen = false;
		mainMenuOpen = savedMainMenuOpen;
		savedMainMenuOpen = mainMenuOpen;
		ModeController.setCurrentMode(GameState.EXPLORE);
	}
	
	// Scroll bar
	intelMenuScrollPos = GUI.BeginScrollView
	(
		intelMenuScrollRect,
		intelMenuScrollPos,
		intelMenuContentRect
	);
		
	//Array of events
	var currentHeight : int;
	var currNode : EventNode = eventList.head;
	var i : int = 0;
	
	while(currNode != null)
	{
		currentHeight = (i * intelMenuNodeWidth * 0.78);
		
		intelMenuIconRect.y = currentHeight;
		intelMenuTurnsRect.y = currentHeight;
		intelMenuDescriptionRect.y = currentHeight;
		intelMenuNodeRect.y = currentHeight;
		
		GUI.skin = intelLeftSkin;
    	GUI.Button(intelMenuIconRect, "Icon");
    	
		GUI.skin = intelBorderSkin;
		GUI.Button(intelMenuDescriptionRect, currNode.data.description);
		
    	GUI.skin = intelRightSkin;
    	GUI.Button(intelMenuTurnsRect, currNode.data.time.ToString());
		
		currNode = currNode.next;
		++i;
	}
	GUI.EndScrollView();
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
	PlayButtonPress(1);
	showWindow = !showWindow;
}

public static function GetInstance():GUIManager
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

// Helper function to determine if the given point on the screen is on a gui element
function NotOnGui(screenInputPosition: Vector2):boolean{	
	// since gui coordinates and screen coordinates differ, we need to convert the mouse position into the toolbar's rectangle gui coordinates
	var mousePos: Vector2;
	mousePos.x = screenInputPosition.x;
	mousePos.y = Screen.height - screenInputPosition.y;
	
	if(	NotOnMainMenu(screenInputPosition) ||
		(pauseMenuOpen && pauseMenuBackground.Contains(mousePos)) ||
		(intelMenuOpen && intelMenuBGRect.Contains(mousePos)) ||
		buildingMenuOpen)
	{
		return (true);
	}
	else
	{
		return (false);
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
	mainMenuOpen = false;
	savedMainMenuOpen = mainMenuOpen;
}

public function OnResumeGame()
{
	mainMenuOpen = true;
	savedMainMenuOpen = mainMenuOpen;
}

public function IsPaused()
{
	return isPaused;
}

//Plays the Audio for the Button Press
//sounderNumber is which button press sound to play (1 or 2)
function PlayButtonPress(soundNumber)
{
	//GameObject.Find("AudioSource Object").GetComponent(AudioSourceSetup).playButtonClick(soundNumber);
}