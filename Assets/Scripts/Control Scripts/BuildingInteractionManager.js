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

function Start () {

}

// will determine what to do with the tap at the given point
static function HandleTapAtPoint(position: Vector2){
	// check if the click is on a building
	var buildPos = HexagonGrid.GetPositionToBuild(position);
	var buildingIndex = Database.findBuildingIndex(buildPos);
	if (buildingIndex != -1){
		Debug.Log("Tap on building");
		var buildings = Database.getBuildingsOnGrid();
		var building: GameObject;
		building = Database.getBuildingAtIndex(buildingIndex);
		DisplayLinkRange.HighlightBuildingsInRange(building);
	} else {
		// As of right now it will just place a building in future development it will need to determine if a building is already there before placing a new one
		if (tapMode == TapType.Place){
			PlaceBuilding.Place(buildPos, false);
		}
	}
}
