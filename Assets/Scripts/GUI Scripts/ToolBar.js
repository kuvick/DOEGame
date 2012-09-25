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

//need to replace text with GUI texture (if needed)
private var toolbarStrings : String[] = ["Main Menu", "Restart Level", "Buildings", "Wait"];
private var buildingMenuStrings : String[] = ["Building1", "Building2", "Building3", "Building4", "Building5"];

// Padding as a percent of total screen size in that direction
private var sidePaddingPercent = 1; // the space between all gui elements and the left and right side of the screen
private var topPaddingPercent = 1;
// height of the window as a percentage of the screen's height
private var windowHeightPercent = 20;
// The tool bar for buildings as a perecentage of screen size in that direction
private var toolBarWidthPercent = 30;
private var toolBarHeightPercent = 100 - (topPaddingPercent + windowHeightPercent); // make the toolbar fill up the screen space below the menu

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

private var showToolbar : boolean;

//EVENT LIST VARIABLES
class gameEvent
{
	var icon : String;
	var description : String;
	var positive : boolean;
	var turn : int;
}
public static var eventList : gameEvent[];
private var eventListUsed : boolean;

public static var eventListRect : Rect; //Button for toggling the event list
private var eventListBGRect : Rect; //Background for the event list
private var eventListTurnRect : Rect; //Current turn label
private var eventListScrollRect : Rect; //For the positions of the scroll bars
private var eventListContentRect : Rect; //For the content area

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

	// Need to determine screen size and density at start time for accurate reading
	screenWidth = Screen.width;
	screenHeight = Screen.height;
	sidePadding = screenWidth*(sidePaddingPercent/100.0);
	topPadding = screenHeight*(topPaddingPercent/100.0);
	windowHeight = screenHeight*(windowHeightPercent/100.0);
	toolBarWidth = screenWidth*(toolBarWidthPercent/100.0);
	toolBarHeight = screenHeight*(toolBarHeightPercent/100.0);
	
	toolBarTopLeftX = screenWidth-sidePadding-toolBarWidth;
	toolBarTopLeftY = screenHeight-toolBarHeight;
	
	toolbarWindow = Rect(sidePadding, topPadding, screenWidth-(2*sidePadding), windowHeight);
	buildingMenuWindow = Rect (toolBarTopLeftX, toolBarTopLeftY, toolBarWidth, toolBarHeight);
	
	undoButton = Rect (0,Screen.height - 50,100,50);	// *** added by K, puts undo button in bottom left corner
	
	//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
	eventListRect = Rect(0, Screen.height - 100, 100, 50);
	eventListBGRect = Rect(50, 50, screenWidth - 100, screenHeight - 100);
	eventListTurnRect = Rect(eventListBGRect.x + eventListBGRect.width - 60, eventListBGRect.y + 10, 50, 50);
	eventListScrollRect = Rect(eventListBGRect.x + 10, eventListTurnRect.y + eventListTurnRect.height + 10, eventListBGRect.width - 10, eventListBGRect.height - eventListTurnRect.height * 2 - 20);
	eventListContentRect = Rect(0, 0, eventListBGRect.width - eventListScrollRect.x - eventListBGRect.x, 1000);
	
	eventList = new Array();
	var gE1:gameEvent = new gameEvent();
	gE1.description = "Game started.";
	gE1.positive = true;
	gE1.turn = 1;
	var gE2:gameEvent = new gameEvent();
	gE2.description = "The Coal Mine needs new equipment to continue to ship out coal.";
	gE2.positive = false;
	gE2.turn = 22;
	var gE3:gameEvent = new gameEvent();
	gE3.description = "The local Waste Disposal Facility is willing to help fund our project!.";
	gE3.positive = true;
	gE3.turn = 19;
	var gE4:gameEvent = new gameEvent();
	gE4.description = "A Manager is looking to make his next career move.";
	gE4.positive = true;
	gE4.turn = 15;
	var gE5:gameEvent = new gameEvent();
	gE5.description = "A new Researcher is about to graduate from the University.";
	gE5.positive = true;
	gE5.turn = 12;
	var gE6:gameEvent = new gameEvent();
	gE6.description = "The factory is going to shut down if they don't get cheaper fuel.";
	gE6.positive = false;
	gE6.turn = 8;
	
	eventList = new Array(gE1, gE2, gE3, gE4, gE5, gE6);
	
	eventListUsed = false;
	
	Debug.Log("eventList.length = " + eventList.Length); //Print the length just in case
}

function OnGUI() 
{
	//showWindow = false;

	if(showToolbar)
	{
		mainWindow = GUI.Window (0, toolbarWindow, ToolbarWindowFunc, "DOE Gaming Project");
		
		if(showWindow)
		{
			dropDownWindow = GUI.Window (1, buildingMenuWindow, BuildingMenuFunc, "Building Menu");
		}
		
			switch(toolbarInt)
		{
			//Main menu
			case 0:
			Debug.Log("main menu");
			toolbarInt = -1;
			break;
			
			//Restart level
			case 1:
			Debug.Log("restart level");
			Application.LoadLevel (0);  
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
		GUI.Label(Rect(Screen.width/7, Screen.height - 40, Screen.width/2 + 50, 40), "Current Turn: "
		+ IntelSystem.currentTurn);
	}
	
	//Draw Event List button
	if(GUI.Button(eventListRect, "Event List"))
	{
		Debug.Log("Event List clicked");
		if(eventListUsed)
		{
			eventListUsed = false;
			showToolbar = true;
		}
		else
		{
			eventListUsed = true;
			showToolbar = false;
		}
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
		var gameEventRect : Rect;
		var tempPos : int;
		var currentYStart : int;
		for(var i : int = 0; i < eventList.length; ++i)
		{
			//This works but the first event should be at the bottom and not top. See below
			currentYStart = i * 50 + (i + 1) * 5;
			//This does it in the right order (first event is on the bottom) but it causes the content to be at the very bottom... not sure how to fix this
			//currentYStart = eventListContentRect.height - ((i + 1) * 50) - ((i + 1) * 5);
		
        	//Draw Icon
        	gameEventRect = Rect(5, currentYStart, 50, 50);
        	GUI.Button(gameEventRect, "Icon");
        	
        	//Description
        	tempPos = eventListContentRect.x + eventListContentRect.width - 60;
        	gameEventRect = Rect(60, currentYStart, tempPos, 50);
        	GUI.Button(gameEventRect, eventList[i].description);

        	//Turn
        	gameEventRect = Rect(tempPos + 65, currentYStart, 50, 50);
        	GUI.Button(gameEventRect, eventList[i].turn.ToString());

    	}
    	
    	GUI.EndScrollView();
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

function ToggleBuildingWindowVisibility()
{
	showWindow = !showWindow;
}

// Helper function to determine if the given point on the screen is on a gui element
static function NotOnGui(screenInputPosistion: Vector2){	
	// since gui coordinates and screen coordinates differ, we need to convert the mouse position into the toolbar's rectangle gui coordinates
	var mousePos: Vector2;
	mousePos.x = screenInputPosistion.x;
	mousePos.y = Screen.height-screenInputPosistion.y;
	if (toolbarWindow.Contains(mousePos) || (showWindow && buildingMenuWindow.Contains(mousePos)) || undoButton.Contains(mousePos) || eventListRect.Contains(mousePos)) {					// *** K added undo button
		return (false);
	} else {
		return (true);
	}
}