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
public var intelSkin:GUISkin;				// GUISkin component for the intel list, set in Inspector

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

private var squareButtonWidthPercent = 0.2;// Width of a Main Menu button as a percent of height
private var scoreFontHeightPercent = 0.04;	// Height of the font as a percentage of screen height
private var menuFontHeightPercent = 0.04;	// Height of the font as a percentage of screen height
private var squareButtonPadding : float;

private var squareButtonWidth:float;				// Width of a Main Menu button in actual pixels
private var scoreFontHeight:float;				// Height of the font in pixels
private var menuFontHeight:float;					// Height of the font in pixels

// Game Menu Textures
public var undoTexture:Texture;				// Texture for the undo button
public var waitTexture:Texture;				// Texture for the wait button
public var intelTexture:Texture;			// Texture for the intel button

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
private var eventListBGRatio = 2.3;

private var eventListSidePadding:float;
private var eventListTopPadding:float;
private var eventListCloseWidth:float;
private var eventListNodeWidth:float;
private var eventListFontHeight:float;
private var eventListBGSideBorder;

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

// Building Variables
private var buildingMenuStrings : String[] = ["Building1", "Building2", "Building3", "Building4", "Building5"];
private var buildingMenuInt : int = -1;
public static var buildingMenuWindow : Rect;
private var dropDownWindow;
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
	InitializeToolBar();
	InitializeGameMenu();
	InitializeIntelMenu();
	
	// Log level name and set current level, added by Derrick
	Debug.Log("level " + Application.loadedLevelName);
	currLevel = Application.loadedLevelName; 
	
	/*
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
	squareButtonWidth = squareButtonWidthPercent * screenHeight;
	squareButtonPadding = squareButtonWidthPercent * screenHeight;
	var totalButtonPadding : float = squareButtonWidth + sidePadding;
	
	scoreFontHeight = scoreFontHeightPercent * screenHeight;
	toolBarSkin.label.fontSize = scoreFontHeight;
	
	menuFontHeight = menuFontHeightPercent * screenHeight;
	toolBarSkin.button.fontSize = menuFontHeight;
	
	gameMenuButton = Rect(verticalBarWidth + sidePadding, horizontalBarHeight + sidePadding, squareButtonWidth, squareButtonWidth);											// Added by D, modified by F, puts Game Menu button in top left hand corner				
	waitButton = Rect(verticalBarWidth + sidePadding, screenHeight - (2 * totalButtonPadding) - horizontalBarHeight, squareButtonWidth, squareButtonWidth);					// Added by F, puts Wait button at bottom left corner above undo button	
	undoButton = Rect(verticalBarWidth + 5 * sidePadding, screenHeight - totalButtonPadding - horizontalBarHeight, squareButtonWidth , squareButtonWidth);						// Added by K, modified by F, puts Undo button at bottom left corner	
	intelButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, screenHeight - totalButtonPadding - horizontalBarHeight, squareButtonWidth, squareButtonWidth); 	// Added by F, puts Intel button at bottom right corner 

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
	eventListCloseWidth = eventListCloseWidthPercent * screenHeight;
	eventListNodeWidth = eventListNodeWidthPercent * screenHeight;
	
	eventListSideBorder = (eventListNodeWidth * eventListBGRatio)/2 - 1;
	intelSkin.button.border.left = eventListSideBorder;
	intelSkin.button.border.right = eventListSideBorder;
	
	eventListFontHeight = eventListFontHeightPercent * screenHeight;
	intelSkin.button.fontSize = eventListFontHeight;
	intelSkin.label.fontSize = eventListFontHeight;
	intelSkin.box.fontSize = eventListFontHeight;
	
	//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
	eventListBGRect = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
	eventListCloseRect = Rect(eventListBGRect.x + eventListBGRect.width - eventListCloseWidth - sidePadding, eventListBGRect.y + sidePadding, eventListCloseWidth, eventListCloseWidth);
	eventListScrollRect = Rect(eventListBGRect.x + sidePadding, eventListCloseRect.y + eventListCloseRect.height + sidePadding, eventListBGRect.width - 2 * sidePadding, eventListBGRect.height - eventListCloseRect.height - (2 * sidePadding));
	eventListContentRect = Rect(0, 0, eventListScrollRect.width - 2 * eventListSidePadding, 1000);
	
	eventListDescriptionRect = Rect(eventListSidePadding, 0, eventListContentRect.width - eventListNodeWidth/2, eventListNodeWidth);
	eventListIconRect = Rect(eventListDescriptionRect.x + eventListNodeWidth * 0.05, 0, eventListNodeWidth, eventListNodeWidth);
	eventListTurnsRect = Rect(eventListDescriptionRect.x + eventListDescriptionRect.width - eventListNodeWidth * 1.05, 0, eventListNodeWidth, eventListNodeWidth);
    
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
	
	/*
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
function DrawToolBar()
{
	// Set the current GUI's skin to the scoreSkin variable
	GUI.skin = toolBarSkin;
	
	// added by Derrick, the game menu button
	// updated by Bomin, F
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
	
	// Score
	GUI.Label(Rect(verticalBarWidth + screenWidth - sidePadding, horizontalBarHeight + sidePadding, 0, 0), "Score: ");
	// Turns
	GUI.Label(Rect(verticalBarWidth + screenWidth - sidePadding, horizontalBarHeight + (2 * sidePadding) + scoreFontHeight, 0, 0), "Turn: " + IntelSystem.currentTurn);
}

function DrawGameMenu()
{
	if (GUI.Button(resumeGameButton, "Resume"))
	{
		Debug.Log("Game is unpaused");
		isPaused = false; 
		showToolbar = savedShowToolbar;
		savedShowToolbar = showToolbar;	
		ModeController.setCurrentMode(GameState.EXPLORE);
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
	
	GUI.skin = intelSkin;
		
	//Array of events
	var currentHeight : int;
	var currNode : EventNode = eventList.head;
	var i : int = 0;
	
	while(currNode != null)
	{
		currentHeight = (i * eventListNodeWidth * 0.82);
		
		eventListIconRect.y = currentHeight;
		eventListTurnsRect.y = currentHeight;
		eventListDescriptionRect.y = currentHeight;
		eventListNodeRect.y = currentHeight;
		
		GUI.Button(eventListDescriptionRect, currNode.data.description);
    	GUI.Label(eventListIconRect, "Icon");
    	GUI.Label(eventListTurnsRect, currNode.data.time.ToString());
		
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
        
       // scrollPosition = GUI.BeginScrollView (Rect (5,25,toolBarWidth - 25 , toolBarHeight - 50), scrollPosition, Rect (0, 0, toolBarWidth - 75, toolBarHeight + 75), false, true);
        
        for(var i =0; i<6; i++)
        {
        	if(GUI.Button(Rect(5, 20 + (95*i), 90, 90), btnTextureArray[i]))
        	{
        		PlaceBuilding.changeBuilding = i;
        		showWindow = false;
        	}
		}
		
		GUI.EndScrollView ();
}

function ToggleBuildingWindowVisibility(){
	showWindow = !showWindow;
}

// Helper function to determine if the given point on the screen is on a gui element
function NotOnGui(screenInputPosition: Vector2):boolean{	
	
	// Since gui coordinates and screen coordinates differ, we need to convert the mouse position into the toolbar's rectangle gui coordinates
	var mousePos: Vector2;
	mousePos.x = screenInputPosition.x;
	mousePos.y = Screen.height-screenInputPosition.y;
	
	if(	NotOnToolBar(screenInputPosition) &&
		NotOnGameMenu(screenInputPosition) &&
		!(eventListUsed && eventListBGRect.Contains(mousePos)))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function NotOnToolBar(screenInputPosition:Vector2):boolean
{
	if (!isPaused)
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
	else
	{
		return true;
	}
}

function NotOnGameMenu(screenInputPosition:Vector2):boolean
{
	if (isPaused)
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
	else
	{
		return true;
	}
}

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