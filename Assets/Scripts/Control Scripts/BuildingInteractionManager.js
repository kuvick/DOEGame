#pragma strict
import System.Collections.Generic;
/*
	BuildingInteractionManager.js
	
	This will handle taps and drags given by the user when they revole around interacting with buildings.
	
	The manager will take some type of input from the InputController and be responsible for determining what to do with that and calling 
	the appropriate scripts
*/

// Based on what setting the user has set in the gui, these will determine what to do with a tap
enum TapType {
	Place, // Try and place a new building
	Information, // give information on a structure
	Delete // remove the given structure
}

public static var tapMode = TapType.Place;
private static var paused : boolean = false;

// level editor variables
private static var isEditor : boolean = false;
private static var mainMenuRef : MainMenu;
private static var buildingMenuRef : BuildingMenu;
private static var editorMenuRef : EditorMenu;
private static var inspectionDisplayRef : InspectionDisplay;
public static var resourceSetters : List.<BuildingResourceSetter>;

private static var unitSelected : boolean = false;

function Start () {
	if (Application.loadedLevelName == "LevelEditor")
	{
		isEditor = true;
		mainMenuRef = GameObject.Find("GUI System").GetComponent(MainMenu);
		buildingMenuRef = GameObject.Find("GUI System").GetComponent(BuildingMenu);
		editorMenuRef = GameObject.Find("GUI System").GetComponent(EditorMenu);
		resourceSetters = new List.<BuildingResourceSetter>();
	}
	else
	{
		isEditor = false;
		inspectionDisplayRef = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
	}
}

function OnPauseGame()
{
	paused = true;
}

function OnResumeGame()
{
	yield WaitForEndOfFrame();
	paused = false;
}

static function PointOnBuilding(position : Vector2)
{
	var buildPos = HexagonGrid.GetPositionToBuild(position);
	var buildPosCoord = HexagonGrid.worldToTileCoordinates(buildPos.x, buildPos.z);
	//var buildPos = HexagonGrid.GetPositionToBuild(buildPosCoord);
	//var buildingIndex = Database.findBuildingIndex(buildPos);
	var buildingIndex = Database.findBuildingIndex(new Vector3(buildPosCoord.x, buildPosCoord.y, 0.0));
	var building : GameObject = null;
	if(buildingIndex != -1)
	{		
		building = Database.getBuildingAtIndex(buildingIndex);
	}
	return building;
}

// will determine what to do with the tap at the given point
static function HandleTapAtPoint(position: Vector2){
	// check if the click is on a building
	if(paused || CheckObjSelected(position) || (isEditor && CheckResourceSetters(position))) return;
	
	var buildPos = HexagonGrid.GetPositionToBuild(position);
	var buildPosCoord = HexagonGrid.worldToTileCoordinates(buildPos.x, buildPos.z);
	var buildingIndex = Database.findBuildingIndex(new Vector3(buildPosCoord.x, buildPosCoord.y, 0.0));
	unitSelected = false;
	if (buildingIndex != -1){
		Debug.Log("Tap on building");
		var buildings : List.<BuildingOnGrid> = Database.getBuildingsOnGrid();
		var building: GameObject;
		building = Database.getBuildingAtIndex(buildingIndex);
		ModeController.setSelectedBuilding(building);
		
		if (ModeController.getSelectedBuilding() == ModeController.getPreviousBuilding())
		{
			var unitBuilding : BuildingOnGrid = buildings[buildingIndex];
			Debug.Log(unitBuilding.selectedUnitIndex + "same" + unitBuilding.units.Count);
			if (unitBuilding.selectedUnitIndex < unitBuilding.units.Count)
			{
			//if (unitBuilding.units[unitBuilding.selectedUnitIndex])
			unitBuilding.units[unitBuilding.selectedUnitIndex].OnDeselect();
			if (unitBuilding.selectedUnitIndex < unitBuilding.units.Count - 1)
				unitBuilding.selectedUnitIndex++;
			else
				unitBuilding.selectedUnitIndex = 0;
			//if (unitBuilding.units[unitBuilding.selectedUnitIndex])
			unitBuilding.units[unitBuilding.selectedUnitIndex].OnSelected();
			unitSelected = true;
			}
		}
		if(building.name == "BuildingSite" && !isEditor)
		{
			var buildingSiteScript: BuildingSiteScript = building.GetComponent(BuildingSiteScript);
			buildingSiteScript.OpenBuildingMenu();
		}

	} 
	else
		ModeController.setSelectedBuilding(null);
	
	/*
	else {
		/*
		
		Others need to check whether or not this should be entirely cut out...it's for the old place building function
		for when you could just place things on the grid.
		
		Debug.Log("Current mode: " + ModeController.getCurrentMode());
		// As of right now it will just place a building in future development it will need to determine if a building is already there before placing a new one
		if (tapMode == TapType.Place && ModeController.currentMode == GameState.EXPLORE){
			PlaceBuilding.Place(buildPos, false);
		}
		else
		{
		
			Debug.Log("Not placing building, set to link");
			GameObject.Find("ModeController").GetComponent(ModeController).switchTo(GameState.EXPLORE);
			PlaceBuilding.changeBuilding = 8; //set it out of scope to be caught by PlaceBuilding
			/*if (isEditor)
			{
				buildingMenuRef.SetEditorSelectedTile(buildPosCoord);
				mainMenuRef.RecieveEvent(EventTypes.BUILDING);
			}*/
		//}
	//}
	
	if (isEditor)
		editorMenuRef.DoAction(buildPosCoord);
	if(!unitSelected)
		UnitManager.DeselectUnits();
}

private static function CheckObjSelected (position : Vector2) : boolean
{
	if (inspectionDisplayRef.MouseOnDisplay())
		return false;
	var hit : RaycastHit;
	var ray : Ray = Camera.main.ScreenPointToRay (Vector3(position.x, position.y, 0.0f));
	if (Physics.Raycast(ray, hit, 1000))
	{
		hit.collider.SendMessage("OnSelected", null, SendMessageOptions.DontRequireReceiver);
		Debug.Log("collided" + hit.collider.name);
		return true;
	}
	return false;
}

private static function CheckResourceSetters(pos : Vector2) : boolean
{
	for (var i : int = 0; i < resourceSetters.Count; i++)
	{
		if (resourceSetters[i].MouseOnGUI(pos))
			return true;
	}
	return false;
}

static function HandleReleaseAtPoint(position: Vector2)
{
	var buildPos = HexagonGrid.GetPositionToBuild(position);
	var buildPosCoord = HexagonGrid.worldToTileCoordinates(buildPos.x, buildPos.z);
	//var buildPos = HexagonGrid.GetPositionToBuild(buildPosCoord);
	//var buildingIndex = Database.findBuildingIndex(buildPos);
	var buildingIndex = Database.findBuildingIndex(new Vector3(buildPosCoord.x, buildPosCoord.y, 0.0));
	
	if (buildingIndex != -1){
		//Debug.Log("Tap on building");
		var buildings = Database.getBuildingsOnGrid();
		var building: GameObject;
		building = Database.getBuildingAtIndex(buildingIndex);
		if(building.name != "BuildingSite")
		{
			ModeController.setSelectedInputBuilding(building);
		}
	}
	else
		ModeController.setSelectedBuilding(null);
}