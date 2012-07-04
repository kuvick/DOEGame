/**********************************************************
ToolBar.js

Description: Sets up toolbar above along with building menu. 
Used mouse click events for now which will be changed to 
touch while deploying for mobile device.
Tip: Click on Building menu button to toggle visibility of 
building menu window.

Author: Ajinkya Waghulde
**********************************************************/


//Variables
private var toolbarInt : int = -1;
private var buildingMenuInt : int = -1;
var btnTexture1 : Texture; 
var btnTexture2 : Texture;
var btnTexture3 : Texture; 
var btnTexture4 : Texture;
var btnTexture5 : Texture; 

private var showWindow : boolean = false;

//need to replace text with GUI texture (if needed)
private var toolbarStrings : String[] = ["Main Menu", "Restart Level", "Buildings", "End Turn"];
private var buildingMenuStrings : String[] = ["Building1", "Building2", "Building3", "Building4", "Building5"];

//set for PC screen, need to change for iphone
private var toolbarWindow : Rect = Rect (50, 10, Screen.width - 100, 80);
private var buildingMenuWindow : Rect //= Rect (0, 10, 250, 520);
										= Rect (50 + (3*toolbarWindow.width/4), 
											    15 + toolbarWindow.height, 
											    toolbarWindow.width/4, 
											    Screen.height - 100);

function OnGUI() 
{

	//showWindow = false;

	toolbarWindow = GUI.Window (0, toolbarWindow, ToolbarWindowFunc, "DOE Gaming Project");
	
	if(showWindow)
		buildingMenuWindow = GUI.Window (1, buildingMenuWindow, BuildingMenuFunc, "Building Menu");
	
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
        
        //Note: Values hardcoded, will be set as per screen resolution later
        GUI.Button(Rect(5, 20, 90, 90),  btnTexture1);
        GUI.Label(Rect(100, 20, 150, 90), "Prototype Building 1\nInput: sample text\nOutput: sample text");
 
        GUI.Button(Rect(5, 115, 90, 90), btnTexture2);
        GUI.Label(Rect(100, 115, 150, 90), "Prototype Building 2\nInput: sample text\nOutput: sample text");
        
        GUI.Button(Rect(5, 210, 90, 90), btnTexture3);
        GUI.Label(Rect(100, 210, 150, 90), "Prototype Building 3\nInput: sample text\nOutput: sample text");
        
        GUI.Button(Rect(5, 305, 90, 90), btnTexture4);
        GUI.Label(Rect(100, 305, 150, 90), "Prototype Building 4\nInput: sample text\nOutput: sample text");
           
        GUI.Button(Rect(5, 400, 90, 90), btnTexture5);
        GUI.Label(Rect(100, 400, 150, 90), "Prototype Building 5\nInput: sample text\nOutput: sample text");
        
}

function ToggleBuildingWindowVisibility()
{
	if(showWindow == false)
		showWindow = true;
	else
		showWindow = false;
}