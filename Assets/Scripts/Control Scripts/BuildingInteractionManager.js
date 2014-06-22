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
private static var tutorialPointers : TutorialPointers;
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
		tutorialPointers = GameObject.Find("GUI System").GetComponent(TutorialPointers);
		var terrain : Terrain = Terrain.activeTerrain;
		if (terrain)
			terrain.collider.enabled = false;
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
		if (tempCollider.name.Equals("ClickCollider"))//ResourceRing"))
		{
			ModeController.setSelectedBuilding(tempCollider.transform.parent.gameObject);
			linkUIRef.HighlightTiles(ResourceType.None);
		}
		else
			tempCollider.SendMessage("OnSelected", null, SendMessageOptions.DontRequireReceiver);
	}
	else
		ModeController.setSelectedBuilding(null);
	
}

// returns true if unit is not selected and building linking should be used
static function HandleFirstClick(obj : Collider) : DragMode
{
	var buildingObject : GameObject = obj.transform.parent.gameObject;
	ModeController.setSelectedBuilding(buildingObject);
	var buildingOnGrid : BuildingOnGrid = Database.getBuildingOnGrid(buildingObject.transform.position);
	var pointer : TutorialArrow = tutorialPointers.GetCurrentArrow();
	
	// camera drag if building is not active or, if a tutorial pointer is active it is not the correct building
	//if (!buildingOnGrid.isActive || (pointer != null && buildingOnGrid.buildingPointer != pointer.buildingOne))
	//Modified to allow more freedom of player choice in tutorials (GPC 4/22/14)
	if (!buildingOnGrid.isActive)
		return DragMode.Cam;
	
	var outputBuilding:BuildingOnGrid = Database.getBuildingOnGridFromGO(buildingObject);
	var realloaction:boolean = false;
	var resourceSelected : ResourceType = ResourceType.None;
	
	if (obj.name.Contains(" "))
	{
		UnitManager.DeselectUnits();
		var useOpt:boolean = false;
		if (obj.tag == ("OptionalLink"))
		{
			linkUIRef.SetSelectedOutIndex(-1);
			useOpt = true;
		}
		else
		{
			//var outputIndex : int = buildingOnGrid.outputLinkedTo.IndexOf(parseInt(obj.name.Split(" "[0])[1]));
			var outputIndex : int = buildingOnGrid.FindLinkIndex(parseInt(obj.name.Split(" "[0])[1]), buildingOnGrid.allOutputs);
			linkUIRef.SetSelectedOutIndex(outputIndex);
		}
		linkUIRef.SetLinkCaseOverride(true); // LINK REALLOCATION
		var pSystem: LinkParticleSystem = obj.GetComponent(LinkParticleSystem);
		pSystem.SelectLink(true);
		blinkingReallocatedLink = obj.gameObject;
		if(!useOpt)
		{
			outputBuilding.allOutputs[outputIndex].icon.SelectForReallocation();
			pSystem.setResourceIcon(outputBuilding.allOutputs[outputIndex].icon);
			resourceSelected = outputBuilding.allOutputs[outputIndex].resource;
		}
		else
		{
			outputBuilding.optOutput.icon.SelectForReallocation();
			resourceSelected = outputBuilding.optOutput.resource;
			pSystem.setResourceIcon(outputBuilding.optOutput.icon);
		}
		
		realloaction = true;
		
	}
	else
	{
		linkUIRef.SetLinkCaseOverride(false);
	}

	if (!buildingOnGrid.unitSelected)
	{	
		//Debug.Log(outputBuilding.unit + " " + outputBuilding.optOutput + " " + outputBuilding.buildingName);
	
		// If all outputs are allocated and there is no optional output, and the link wasn't selected, go to camera drag:
		if( !realloaction && (outputBuilding.unallOutputs.Count <= 0))
		{
			// if there is no optional output:
			if(outputBuilding.optOutput.resource == ResourceType.None)
				return DragMode.Cam;
			// if there is optional output:
			else
			{	
				//When it is fixed and allocated
				if((outputBuilding.unit == UnitType.Worker && outputBuilding.optOutput.linkedTo != -1))
					return DragMode.Cam;
				//when it is not fixed 
				else if(!outputBuilding.optionalOutputFixed)
					return DragMode.Cam;
				// it is fixed and unallocated:
				else
				{
					linkUIRef.HighlightTiles(ResourceType.None);
					return DragMode.Link;
				}
			}//inner if
		}//outer if
		// when all output has not been allocated and/or the link was selected:
		else
		{
			linkUIRef.HighlightTiles(resourceSelected);
			return DragMode.Link;
		}
	}
	else
		return DragMode.Unit;
}

private static var blinkingReallocatedLink:GameObject = null;

// will determine what to do with the tap at the given point
static function HandleTapAtPoint(obj : Collider) {//position: Vector2){
	unitSelected = false;
	
	if (!obj)
		ModeController.setSelectedBuilding(null);
		//return;
	if (!obj || obj.tag != "Unit")
		linkUIRef.HighlightTiles(ResourceType.None);
	else if (obj.tag == "Unit")
		unitSelected = true;
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
	{
		ModeController.setSelectedBuilding(null);
	}
	//linkUIRef.ResetLinkVariables();
	linkUIRef.HighlightTiles(ResourceType.None);
}

static function HandleReleaseAtPoint(obj : Collider)
{
	//var pointer : TutorialArrow = tutorialPointers.GetCurrentArrow();
	
	//Seeing if we can phase this out. GPC 4/21/14
	//if (!obj || (pointer != null && obj.transform.parent.gameObject != pointer.buildingTwo))
	if (!obj) //LINK REALLOCATION FOR WHEN NO NEW LINK RESULTS
	{
		ModeController.setSelectedBuilding(null);
	}
	else
	{
		if (obj.name == "ClickCollider")//ResourceRing")
		{
			var building : GameObject = obj.transform.parent.gameObject;
			
			if (building.name != "BuildingSite")
				ModeController.setSelectedInputBuilding(building);
		}
	}
	
	if(blinkingReallocatedLink != null)
	{
		var pSystem: LinkParticleSystem = blinkingReallocatedLink.GetComponent(LinkParticleSystem);
		pSystem.SelectLink(false);
		blinkingReallocatedLink = null;
	}
	linkUIRef.HighlightTiles(ResourceType.None);
}