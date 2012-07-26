#pragma strict
/*
ModeController.js
Author: Justin

Description: Switches between Explore Mode and Link Mode. Link mode is activated
when a building is clicked. Explore Mode is activated when the cancel button is clicked.
Link Mode shows a selected buildings link range as well as links between buildings.


Requirements: -Must be attatched to its own object, ModeController
			  -Buildings must be tagged "Building"
			  
Notes: Only switches between link and explore mode. Functionality for switching
to build mode can be added later.
*/


private static var currentMode:String;
private var selectedBuilding:GameObject;
private var buildings:GameObject[];
private var database:Database;
private var linkMode:GameObject;
private var object:String;
public var defaultColors:Color[];			//stores the default color of all buildings


function Awake(){
	currentMode = "explore";
	linkMode = GameObject.Find("LinkMode");
	linkMode.active = false;
}

function Start () {
	database = GameObject.Find("Database").GetComponent(Database);
	buildings = gameObject.FindGameObjectsWithTag("Building");
	
}

function Update () {
	if(BuildingClicked()){
		currentMode = "link";
		switchTo(currentMode);
	}
	else if(currentMode == "link" && linkMode.GetComponent(LinkUI).cancelLinkMode){
		currentMode = "explore";
		switchTo(currentMode);
	}
}

function BuildingClicked():boolean{
	var hit : RaycastHit;
    var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
      
    if (Physics.Raycast (ray, hit, 1000.0))
    {
    	var target = hit.collider.gameObject;
      	
      	if(Input.GetMouseButtonDown(0)){
	    	if(target.tag == "Building"){ 
	      		selectedBuilding = target;
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
			activateLinks();
			linkMode.active = true;
			break;
			
		case "explore":
			linkMode.GetComponent(DisplayLinkRange).restoreColors();
			clearLinks();
			linkMode.active = false;
			break;
	}
	
}

//These functions handle link visibility when switching between modes
function activateLinks(){
	for(var b = 0; b < buildings.length; b++){
		var building:GameObject = buildings[b];
		var links:LineRenderer[] = building.GetComponentsInChildren.<LineRenderer>(true);
		
		for(var i = 0; i < links.length; i++){
			links[i].active = true;
		}
	}
}

function clearLinks(){
	for(var b = 0; b < buildings.length; b++){
		var building:GameObject = buildings[b];
		var links:LineRenderer[] = building.GetComponentsInChildren.<LineRenderer>();
		
		for(var i = 0; i < links.length; i++){
			links[i].active = false;
		}
	}
}

function getSelectedBuilding(){
	return selectedBuilding;
}

function getCurrentMode(){
	return currentMode;
}