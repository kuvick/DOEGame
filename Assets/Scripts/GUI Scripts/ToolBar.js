/**********************************************************
ToolBar.js

Description: Sets up toolbar above along with building menu. 
Used mouse click events for now which will be changed to 
touch while deploying for mobile device.

Author: Ajinkya Waghulde
**********************************************************/


//Variables
var toolbarInt : int = -1;
var buildingMenuInt : int = -1;
var btnTexture1 : Texture; 
var btnTexture2 : Texture;
var btnTexture3 : Texture; 
var btnTexture4 : Texture;
var btnTexture5 : Texture; 

//need to replace text with GUI texture (if needed)
var toolbarStrings : String[] = ["Main Menu", "Restart Level", "Buildings", "End Turn"];
var buildingMenuStrings : String[] = ["Building1", "Building2", "Building3", "Building4", "Building5"];

//set for PC screen, need to change for iphone
var toolbarWindow : Rect = Rect (30, 10, 1300, 60);
var buildingMenuWindow : Rect = Rect (50, 100, 120, 500);

function OnGUI() 
{

	toolbarWindow = GUI.Window (0, toolbarWindow, ToolbarWindowFunc, "DOE Gaming Project");
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
        
        toolbarInt = GUILayout.Toolbar (//new Rect(5, 20, toolbarWindow.width  - 10, toolbarWindow.height - 25), 
        								toolbarInt, 
        								toolbarStrings);
        

}

//Note: window id is 1 for building menu
function BuildingMenuFunc (windowID : int) {
        
        /*buildingMenuInt = GUILayout.Toolbar (
        								buildingMenuInt, 
        								buildingMenuStrings);
        */
        
        
        GUI.Button(Rect(5, 15, 90, 90),  btnTexture1);
        GUI.Label(Rect(100, 15, 150, 90), "Prototype Building 1\nInput\nOutput");
 
        GUI.Button(Rect(5, 117, 90, 90), btnTexture2);
        GUI.Label(Rect(100, 117, 150, 90), "Prototype Building 2\nInput\nOutput");
        
        GUI.Button(Rect(5, 219, 90, 90), btnTexture3);
        GUI.Label(Rect(100, 219, 150, 90), "Prototype Building 3\nInput\nOutput");
        
        GUI.Button(Rect(5, 321, 90, 90), btnTexture4);
        GUI.Label(Rect(100, 321, 150, 90), "Prototype Building 4\nInput\nOutput");
           
        GUI.Button(Rect(5, 423, 90, 90), btnTexture5);
        GUI.Label(Rect(100, 423, 150, 90), "Prototype Building 5\nInput\nOutput");
        
}
