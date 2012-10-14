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


static public var currentMode:GameState;
static public var selectedBuilding:GameObject = null;
private var buildings:GameObject[];
private var linkMode:GameObject;
private var object:String;
private var previousBuildingLength:int;
private var mouseOverGUI:boolean;
public var defaultColors:Color[];			//stores the default color of all buildings

enum GameState{ EXPLORE, LINK }; // The states that can currently exist in the game


function Awake()
{
	Debug.Log("Setting the mode controller to exploration state");
	currentMode = GameState.EXPLORE; // set the state initially to exploration
	
	/*if(!GameObject.Find("LinkMode"))
		Debug.Log("LinkMode object does not exist!"); return;
	
	linkMode = GameObject.Find("LinkMode");
	linkMode.active = false;*/
}

function Start () 
{
	buildings = gameObject.FindGameObjectsWithTag("Building");
	previousBuildingLength = buildings.Length;
	mouseOverGUI = false;
}

function Update () 
{
	if(BuildingClicked() && GameState.EXPLORE) //If a building is clicked, set the mode to link
	{
		Debug.Log("Switching to link since building was clicked");
		//currentMode = GameState.LINK;
		//this.switchTo(currentMode);
	}
	else if(currentMode == GameState.LINK && LinkUI.CancelLinkMode()) // Once the user cancels out of link mode, switch back to explore
	{
		//currentMode = GameState.EXPLORE;
		//LinkUI.cancelLinkMode = false;
		selectedBuilding = null;
		switchTo(currentMode);
	}
}

function UpdateBuildingCount(curBuildings:GameObject[]):void
{
	Debug.Log("Sucessfully broadcasted update building count from ModeController.js");
	buildings = curBuildings;
}

function BuildingClicked():boolean
{
	return (selectedBuilding != null);

	/*if(Input.GetMouseButtonDown(0)){
		var hit : RaycastHit;
    	var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
    	
    	//layer mask ignores Terrain and Ignore Raycast layers
    	var layerMask = 1 << 8 | 1 << 2;
    	layerMask = ~layerMask;
    	
    	if(currentMode == GameState.LINK)
    	{
			mouseOverGUI = LinkUI.MouseOverLinkGUI();
		}
      
    	if (Physics.Raycast (ray, hit, 1000.0, layerMask)){
    		var target = hit.collider.gameObject;
	    	if(target.tag == "Building" && !mouseOverGUI){ 
	      		selectedBuilding = target;
	      		
	      		Debug.Log("Clicked Building: " + target.name);
	      		
	      		return true;
	      	}
	  	}
	  	
	  	Debug.Log("Raycast did not hit building");
	}
	return false;*/
}

function switchTo(mode:int){
	switch(mode)
	{
		case GameState.LINK:
			currentMode = GameState.LINK;
			//linkMode.active = true;
			break;
			
		case GameState.EXPLORE:
			DisplayLinkRange.restoreColors();
			currentMode = GameState.EXPLORE;
			//linkMode.active = false;
			break;
			
		/***************To be expanded
		case "build":
		***************/
		
	}
	
}

static function setCurrentMode(state:int)
{
	currentMode = state;
}

static function setSelectedBuilding(selected:GameObject)
{
	selectedBuilding = selected;
	Debug.Log("Selected building is: " + selected.name);
}

static function getSelectedBuilding(){
	return selectedBuilding;
}

static function getCurrentMode(){
	return currentMode;
}

function MouseOverGUI(){
	return mouseOverGUI;
}