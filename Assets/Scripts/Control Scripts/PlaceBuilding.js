/**********************************************************
PlaceBuilding.js

Description: Script to place a gameobject (building) on the 
terrain.
Status: incomplete, this code needs to be integrated/ code can 
be used in other script.

Note:

Author: Ajinkya Waghulde
**********************************************************/

// for placing a building on terrain
static var buildingPrefabs = new Array(); 
var buildingPrefab0 : Transform; 
var buildingPrefab1 : Transform;
var buildingPrefab2 : Transform; 
var buildingPrefab3 : Transform;
var buildingPrefab4 : Transform; 
var buildingPrefab5 : Transform;
var buildingPrefab6 : Transform; 
var buildingPrefab7 : Transform;

static var changeBuilding : int = 0;

function Awake()
{
	//setting up the buildings prefab array
	buildingPrefabs[0] = buildingPrefab0;
	buildingPrefabs[1] = buildingPrefab1;
	buildingPrefabs[2] = buildingPrefab2;
	buildingPrefabs[3] = buildingPrefab3;
	buildingPrefabs[4] = buildingPrefab4;
	buildingPrefabs[5] = buildingPrefab5;
	buildingPrefabs[6] = buildingPrefab6;
	buildingPrefabs[7] = buildingPrefab7;
}

static function Place(position: Vector3){
	if (changeBuilding > 7) {
		Debug.LogError("HexagonGrid.js: changeBuilding = " + changeBuilding + " . Value not recorded");
	} else {
		var build = Instantiate(buildingPrefabs[changeBuilding], HexagonGrid.GetPositionToBuild(position), Quaternion.identity);
	}
}