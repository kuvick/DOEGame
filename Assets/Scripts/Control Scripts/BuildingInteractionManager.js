#pragma strict

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
private static var objSelected : boolean = false;

function Start () {

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

// will determine what to do with the tap at the given point
static function HandleTapAtPoint(position: Vector2){
	// check if the click is on a building
	if(paused || objSelected) return;

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
		ModeController.setSelectedBuilding(building);
		if(building.name == "BuildingSite")
		{
			var buildingSiteScript: BuildingSiteScript = building.GetComponent(BuildingSiteScript);
			buildingSiteScript.OpenBuildingMenu();
		}
	} else {
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
		*/
			Debug.Log("Not placing building, set to link");
			GameObject.Find("ModeController").GetComponent(ModeController).switchTo(GameState.EXPLORE);
			PlaceBuilding.changeBuilding = 8; //set it out of scope to be caught by PlaceBuilding
		//}
	}
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
}

public static function SetObjSelected (selected : boolean)
{
	objSelected = selected;
}
