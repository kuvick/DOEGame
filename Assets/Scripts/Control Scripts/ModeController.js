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
static public var selectedBuilding : GameObject = null;
static public var selectedInputBuilding : GameObject = null;  //Only used for Drag Link System
private var buildings:GameObject[];
private var linkMode:GameObject;
private var object:String;
private var previousBuildingLength:int;
private var mouseOverGUI:boolean;
public var defaultColors:Color[];			//stores the default color of all buildings



enum GameState{ EXPLORE, LINK, INTEL}; // The states that can currently exist in the game


function Awake()
{
	Debug.Log("Setting the mode controller to exploration state");
	currentMode = GameState.EXPLORE; // set the state initially to exploration
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
	buildings = curBuildings;
}

function ReplaceBuilding (replacement : BuildingReplacement)
{
	buildings[replacement.buildingIndex] = replacement.buildingObject;
}

function BuildingClicked():boolean
{
	return (selectedBuilding != null);
}

function switchTo(mode:int){
	switch(mode)
	{
		case GameState.LINK:
			currentMode = GameState.LINK;
			break;
			
		case GameState.EXPLORE:
			//DisplayLinkRange.RestoreColors();
			//DisplayLinkRange.DestroyRangeTiles();
			//DisplayLinkRange.ClearSelection();
			selectedBuilding = null;
			currentMode = GameState.EXPLORE;
			break;
		
		case GameState.INTEL:
			currentMode = GameState.INTEL;
		
		/***************To be expanded
		case "build":
		***************/
	}
	
}

static function setCurrentMode(state:int)
{
	currentMode = state;
}

static function getSelectedBuilding(){
	return selectedBuilding;
}

static function setSelectedBuilding(selected:GameObject)
{
	selectedBuilding = selected;
}

static function getSelectedInputBuilding()
{
	return selectedInputBuilding;
}

static function setSelectedInputBuilding(selected: GameObject)
{
	selectedInputBuilding = selected;
}

static function getCurrentMode(){
	return currentMode;
}

function MouseOverGUI(){
	return mouseOverGUI;
}