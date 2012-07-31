#pragma strict
/*
ModeController.js
Author: Justin

Description: Switches between Explore Mode and Link Mode. Link mode is activated
when a building is clicked. Explore Mode is activated when the cancel button is clicked.
Link Mode shows a selected buildings link range as well as links between buildings.


Requirements: -Must be attatched to its own object, ModeController
			  -Buildings must be tagged "Building"
			  -Terrain must belong to Terrain layer (8)
			  
Notes: Only switches between link and explore mode. Functionality for switching
to build mode can be added later.
*/


private static var currentMode:String;
private var selectedBuilding:GameObject;
private var buildings:GameObject[];
private var database:Database;
private var linkMode:GameObject;
private var object:String;
private var mouseOverGUI:boolean;
public var defaultColors:Color[];			//stores the default color of all buildings


function Awake(){
	currentMode = "explore";
	linkMode = GameObject.Find("LinkMode");
	linkMode.active = false;
}

function Start () {
	database = GameObject.Find("Database").GetComponent(Database);
	buildings = gameObject.FindGameObjectsWithTag("Building");
	mouseOverGUI = false;
}

function Update () {
	if(BuildingClicked()){
		currentMode = "link";
		switchTo(currentMode);
	}
	else if(currentMode == "link" && linkMode.GetComponent(LinkUI).CancelLinkMode()){
		currentMode = "explore";
		switchTo(currentMode);
	}
}

function BuildingClicked():boolean{
	if(Input.GetMouseButtonDown(0)){
		var hit : RaycastHit;
    	var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
    	
    	//layer mask ignores Terrain and Ignore Raycast layers
    	var layerMask = 1 << 8 | 1 << 2;
    	layerMask = ~layerMask;
    	
    	if(currentMode == "link"){
			mouseOverGUI = gameObject.Find("LinkMode").GetComponent(LinkUI).MouseOverLinkGUI();
		}
      
    	if (Physics.Raycast (ray, hit, 1000.0, layerMask)){
    		var target = hit.collider.gameObject;
	    	if(target.tag == "Building" && !mouseOverGUI){ 
	      		selectedBuilding = target;
	      		
	      		Debug.Log("Clicked Building");
	      		
	      		return true;
	      	}
	  	}
	}
	return false;
}

function switchTo(mode:String){
	switch(mode)
	{
		case "link":
			linkMode.active = true;
			break;
			
		case "explore":
			linkMode.GetComponent(DisplayLinkRange).restoreColors();
			linkMode.active = false;
			break;
			
		/***************To be expanded
		case "build":
		***************/
		
	}
	
}

function getSelectedBuilding(){
	return selectedBuilding;
}

function getCurrentMode(){
	return currentMode;
}

function MouseOverGUI(){
	return mouseOverGUI;
}