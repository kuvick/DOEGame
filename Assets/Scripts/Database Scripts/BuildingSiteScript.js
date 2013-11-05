#pragma strict

/*
BuildingSiteScript.js
Initially by Katharine Uvick

This contains the bare bones needed by an individual building site...and
probably eventually set it up so it doesn't need its own building data
component.

*/

private var buildingSiteLocation : Vector3;
private var buildingData : BuildingData;
private var mainMenu : MainMenu;
public var buildingMenu : BuildingMenu;

function Start ()
{
	buildingData = gameObject.GetComponent(BuildingData);
	buildingSiteLocation = buildingData.buildingData.coordinate;
	var guiObj : GameObject = GameObject.Find("GUI System");
	mainMenu = guiObj.GetComponent(MainMenu);
	buildingMenu = guiObj.GetComponent(BuildingMenu);
}

// Returns the location/coordinates of the building site
public function GetLocation() : Vector3
{
	return buildingSiteLocation;
}


// Used by the BuildingInteractionManager, when it identifies the selected building
// as a building site to open the Building Menu. Tells the main menu to open
// the building site menu and gives the building site menu its location.
function OpenBuildingMenu()
{
	buildingMenu.MakeCurrentSite(gameObject);
	mainMenu.RecieveEvent(EventTypes.BUILDING);
}