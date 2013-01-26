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
	if(paused) return;


	var buildPosCoord:Vector3 = (GameObject.Find("HexagonGrid").GetComponent("HexagonGrid") as HexagonGrid).getSelectedTileCoordinates();
	//var buildPos = HexagonGrid.GetPositionToBuild(buildPosCoord);
	Debug.Log("Clicked position: " + buildPosCoord);

	var buildingData: BuildingData = Database.instance.getBuildingDataAtCoordinate(buildPosCoord);
	
	if (buildingData != null){
		var building:GameObject = buildingData.gameObject;
		
		
		ModeController.selectedBuilding = building;
		if(building.name != "BuildingSite"){
			//needs fixing or i dont understand purpose as the link range still draws with this commented out 1/25/2013 -stephen
			//DisplayLinkRange.HighlightBuildingsInRange(building);
		}
		else
		{
			Debug.Log("found buildingsite, opening menu");
			var buildingSiteScript: BuildingSiteScript = building.GetComponent("BuildingSiteScript");
			buildingSiteScript.OpenBuildingMenu(position);
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
//			PlaceBuilding.changeBuilding = 8; //set it out of scope to be caught by PlaceBuilding
		//}
	}
}
