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
private static var linkUIRef : LinkUI;
public static var resourceSetters : List.<BuildingResourceSetter>;

private static var unitSelected : boolean = false;

function Start () {
	if (Application.loadedLevelName == "LevelEditor")
	{
		isEditor = true;
		var guiObj : GameObject = GameObject.Find("GUI System");
		mainMenuRef = guiObj.GetComponent(MainMenu);
		buildingMenuRef = guiObj.GetComponent(BuildingMenu);
		editorMenuRef = guiObj.GetComponent(EditorMenu);
		resourceSetters = new List.<BuildingResourceSetter>();
	}
	else
	{
		isEditor = false;
		inspectionDisplayRef = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
		linkUIRef = GameObject.Find("Main Camera").GetComponent(LinkUI);//GameObject.Find("Main Camera").GetComponent(LinkUI);
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

// Handles the initial click event, changing building indicators appropriately
static function HandleFirstClick(position : Vector2)
{
	if (paused || inspectionDisplayRef.MouseOnDisplay())//CheckObjSelected(position))
		return;
	
	/*var buildPos = HexagonGrid.GetPositionToBuild(position);
	var buildPosCoord = HexagonGrid.worldToTileCoordinates(buildPos.x, buildPos.z);
	var buildingIndex = Database.findBuildingIndex(new Vector3(buildPosCoord.x, buildPosCoord.y, 0.0));
	if (buildingIndex != -1){
		var building: GameObject;
		building = Database.getBuildingAtIndex(buildingIndex);
		ModeController.setSelectedBuilding(building);
	} */
	var tempCollider : Collider = CheckObjSelected(position);
	
	if (tempCollider)
	{
		Debug.Log("collided" + tempCollider.name);
		if (tempCollider.name.Equals("ResourceRing"))
		{
			ModeController.setSelectedBuilding(tempCollider.transform.parent.gameObject);
			linkUIRef.HighlightTiles();
		}
		else
			tempCollider.SendMessage("OnSelected", null, SendMessageOptions.DontRequireReceiver);
	}
	else
		ModeController.setSelectedBuilding(null);
	
}

// returns true if unit is not selected and building linking should be used
static function HandleFirstClick(obj : Collider) : boolean
{
	var buildingObject : GameObject = obj.transform.parent.gameObject;
	ModeController.setSelectedBuilding(buildingObject);
	var buildingOnGrid : BuildingOnGrid = Database.getBuildingOnGrid(buildingObject.transform.position);
	
	if (obj.name.Contains(" "))
	{
		UnitManager.DeselectUnits();
		if (obj.tag == ("OptionalLink"))
			linkUIRef.SetSelectedOutIndex(-1);
		else
		{
			//var outputIndex : int = buildingOnGrid.outputLinkedTo.IndexOf(parseInt(obj.name.Split(" "[0])[1]));
			var outputIndex : int = buildingOnGrid.FindLinkIndex(parseInt(obj.name.Split(" "[0])[1]), buildingOnGrid.allOutputs);
			linkUIRef.SetSelectedOutIndex(outputIndex);
		}
		linkUIRef.SetLinkCaseOverride(true);
	}
	else
	{
		linkUIRef.SetLinkCaseOverride(false);
	}

	if (!buildingOnGrid.unitSelected)
	{
		linkUIRef.HighlightTiles();
		return true;
	}
	else
		return false;
}

// will determine what to do with the tap at the given point
static function HandleTapAtPoint(obj : Collider) {//position: Vector2){
	unitSelected = false;
	
	if (!obj)
		ModeController.setSelectedBuilding(null);
		//return;
	linkUIRef.HighlightTiles();
	var selBuilding : GameObject = ModeController.getSelectedBuilding();
	if(selBuilding)
	{
		//Debug.Log(selBuilding + " " + ModeController.getPreviousBuilding());
		var unitBuilding : BuildingOnGrid = Database.getBuildingOnGridAtIndex(Database.getBuildingIndex(selBuilding));
			// if tapping the same building again, select appropriate unit
		if (selBuilding == ModeController.getPreviousBuilding())
			unitSelected = UnitManager.CycleSelectedUnit(unitBuilding);
		// reset unit index if a different building is tapped
		else
			unitBuilding.selectedUnitIndex = -1;
		if(selBuilding.name == "BuildingSite" && !isEditor)
		{
			var buildingSiteScript: BuildingSiteScript = selBuilding.GetComponent(BuildingSiteScript);
			buildingSiteScript.OpenBuildingMenu();
		}

	 }
	/*else
		ModeController.setSelectedBuilding(null);*/
	
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
	//linkUIRef.HighlightTiles();
	/*if (isEditor)
		editorMenuRef.DoAction(buildPosCoord);*/
	if(!unitSelected)
		UnitManager.DeselectUnits();
}

private static function CheckObjSelected (position : Vector2) : Collider
{
	if (inspectionDisplayRef.MouseOnDisplay())
		return null;
	var hit : RaycastHit;
	var ray : Ray = Camera.main.ScreenPointToRay (Vector3(position.x, position.y, 0.0f));
	/*if (*/Physics.Raycast(ray, hit, 1000);//)
	/*{
		hit.collider.SendMessage("OnSelected", null, SendMessageOptions.DontRequireReceiver);
		Debug.Log("collided" + hit.collider.name);
		return true;
	}
	return false;*/
	return hit.collider;
}

// for level editor only
private static function CheckResourceSetters(pos : Vector2) : boolean
{
	for (var i : int = 0; i < resourceSetters.Count; i++)
	{
		if (resourceSetters[i].MouseOnGUI(pos))
			return true;
	}
	return false;
}

static function HandleReleaseAtPoint(position: Vector2)//, relType : DragType)
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
	//linkUIRef.ResetLinkVariables();
	linkUIRef.HighlightTiles();
}

static function HandleReleaseAtPoint(obj : Collider)
{
	if (!obj)
		ModeController.setSelectedBuilding(null);
	else
	{
		if (obj.name == "ResourceRing")
		{
			var building : GameObject = obj.transform.parent.gameObject;
			if (building.name != "BuildingSite")
				ModeController.setSelectedInputBuilding(building);
		}
	}
	linkUIRef.HighlightTiles();
}