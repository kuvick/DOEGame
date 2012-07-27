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
var btnTexture1 : Texture; 
var btnTexture2 : Texture;
var btnTexture3 : Texture; 
var btnTexture4 : Texture;
var btnTexture5 : Texture; 

public static var showWindow : boolean = false;

//need to replace text with GUI texture (if needed)
private var toolbarStrings : String[] = ["Main Menu", "Restart Level", "Buildings", "End Turn"];
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

private var mainWindow;
private var dropDownWindow;

function Start(){
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
}

function OnGUI() 
{
	//showWindow = false;

	mainWindow = GUI.Window (0, toolbarWindow, ToolbarWindowFunc, "DOE Gaming Project");
	
	if(showWindow)
		dropDownWindow = GUI.Window (1, buildingMenuWindow, BuildingMenuFunc, "Building Menu");
		
	if (!btnTexture1 || !btnTexture2 || !btnTexture3 || !btnTexture4 || !btnTexture5) {
        Debug.LogError("Missing button texture !");
        return;
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
		toolbarInt = -1;
		break;
		
		//Buildings menu
		case 2:
		Debug.Log("building menu");		
		ToggleBuildingWindowVisibility();
		toolbarInt = -1;
		break;
		
		//End turn
		case 3:
		Debug.Log("end turn");
		toolbarInt = -1;
		break;
		
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
        
        /*buildingMenuInt = GUILayout.Toolbar (
        								buildingMenuInt, 
        								buildingMenuStrings);
        */
        
        if(GUI.Button(Rect(5, 20, 90, 90),  btnTexture1))
        {
        	HexagonGrid.changeBuilding = 0;
        	showWindow = false;
        }
        GUI.Label(Rect(100, 20, 150, 90), "Prototype Building 1\nInput: sample text\nOutput: sample text");
 
        if(GUI.Button(Rect(5, 115, 90, 90), btnTexture2))
        {
        	HexagonGrid.changeBuilding = 1;
        	showWindow = false;
        }                
        GUI.Label(Rect(100, 115, 150, 90), "Prototype Building 2\nInput: sample text\nOutput: sample text");
        
        if(GUI.Button(Rect(5, 210, 90, 90), btnTexture3))
        {
        	showWindow = false;
        }   
        GUI.Label(Rect(100, 210, 150, 90), "Prototype Building 3\nInput: sample text\nOutput: sample text");
        
        if(GUI.Button(Rect(5, 305, 90, 90), btnTexture4))
        {
        	showWindow = false;
        }
        GUI.Label(Rect(100, 305, 150, 90), "Prototype Building 4\nInput: sample text\nOutput: sample text");
           
        if(GUI.Button(Rect(5, 400, 90, 90), btnTexture5))
        {
        	showWindow = false;
        }
        GUI.Label(Rect(100, 400, 150, 90), "Prototype Building 5\nInput: sample text\nOutput: sample text");
        
}

function ToggleBuildingWindowVisibility()
{
	if(showWindow == false)
		showWindow = true;
	else
		showWindow = false;
}