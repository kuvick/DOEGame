/**********************************************************
ToolBar.js

Description: Sets up toolbar above along with building menu. 
Used mouse click events for now which will be changed to 
touch while deploying for mobile device.
Tip: Click on Building menu button to toggle visibility of 
building menu window.

Note: Attach the script to Main Camera.

Author: Ajinkya Waghulde

AUG 7 : added requisition system, may need to move the GUI to another script
Also changed "end turn" to wait
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

private var mainWindow;
private var dropDownWindow;


var scrollPosition : Vector2 = Vector2.zero;		// used for scrollbar for building menu

static private var requisitionSystem : RequisitionSystem;

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
	
	requisitionSystem = GameObject.Find("Database").GetComponent("RequisitionSystem");
}

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
	
	undoButton = Rect (0,Screen.height - 50,100,50);	// *** added by K, puts undo button in bottom left corner
}

function OnGUI() 
{
	//showWindow = false;

	mainWindow = GUI.Window (0, toolbarWindow, ToolbarWindowFunc, "DOE Gaming Project");
	
	if(showWindow)
		dropDownWindow = GUI.Window (1, buildingMenuWindow, BuildingMenuFunc, "Building Menu");
	/*
	for(var i=0; i<10; i++){		
		if(!btnTextureArray[i]){
        	Debug.LogError("Missing button texture !");
        	return;
    	}
    }
    */
        						
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
		requisitionSystem.spendRequisition( 1 );	// spend 1 requisition to wait
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
	
	// *** added by K, requisition system info
	GUI.Label(Rect(Screen.width/7, Screen.height - 40, Screen.width/2 + 50, 40), "Requisition: "
	+ requisitionSystem.currentRequisitionPoints
	+ " Pollution: " + requisitionSystem.pollutionLevel
	+ " Is Storming: " + requisitionSystem.isStorming
	+ " Next Storm (Days): " + requisitionSystem.turnsTilStorm );
	

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
        
        
        /*
        if(GUI.Button(Rect(5, 20, 90, 90),  btnTexture1))
        {
        	PlaceBuilding.changeBuilding = 0;
        	showWindow = false;
        }
        GUI.Label(Rect(100, 20, 150, 90), "Prototype Building 1\nInput: sample text\nOutput: sample text");
 
        if(GUI.Button(Rect(5, 115, 90, 90), btnTexture2))
        {
        	PlaceBuilding.changeBuilding = 1;
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
        */
        
        //scrollPosition = GUI.BeginScrollView (Rect (0,0,toolBarWidth - 100,toolBarHeight), scrollPosition, Rect (0, 0, 220, 220));
        
        
        
        // Added a scroll bar for when there are multiple buildings; need to find a way to disable the panning of the camera while scrolling
        scrollPosition = GUI.BeginScrollView (Rect (5,25,toolBarWidth - 25 , toolBarHeight - 50), scrollPosition, Rect (0, 0, toolBarWidth - 75, toolBarHeight), false, true);
        
        for(var i =0; i<6; i++){
        	if(GUI.Button(Rect(5, 20 + (95*i), 90, 90), btnTextureArray[i])){
        		PlaceBuilding.changeBuilding = i;
        		showWindow = false;
        	}

        	GUI.Label(Rect(100, 20 + (95*i), 200, 90 * i), 	Database.buildings[i].buildingName 
        												+ "\n"
        												+ "INPUT: " + Database.buildings[i].inputName
        												+ " [" + Database.buildings[i].inputNum + "]"
        												+ "\n"
        												+ "OUTPUT: " + Database.buildings[i].outputName
        												+ " [" + Database.buildings[i].outputNum + "]");

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
	if (toolbarWindow.Contains(mousePos) || (showWindow && buildingMenuWindow.Contains(mousePos)) || undoButton.Contains(mousePos)) {					// *** K added undo button
		return (false);
	} else {
		return (true);
	}
}