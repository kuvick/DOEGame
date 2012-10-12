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
static var buildingPrefabs:Transform[]; 
var buildingPrefab0 : Transform; 
var buildingPrefab1 : Transform;
var buildingPrefab2 : Transform; 
var buildingPrefab3 : Transform;
var buildingPrefab4 : Transform; 
var buildingPrefab5 : Transform;
var buildingPrefab6 : Transform; 
var buildingPrefab7 : Transform;

static var changeBuilding : int = 0;

static var gridObject:GameObject;
static var grid:HexagonGrid;
 

function Awake()
{
	buildingPrefabs = new Transform[8];
	//setting up the buildings prefab array
	buildingPrefabs[0] = buildingPrefab0;
	buildingPrefabs[1] = buildingPrefab1;
	buildingPrefabs[2] = buildingPrefab2;
	buildingPrefabs[3] = buildingPrefab3;
	buildingPrefabs[4] = buildingPrefab4;
	buildingPrefabs[5] = buildingPrefab5;
	buildingPrefabs[6] = buildingPrefab6;
	buildingPrefabs[7] = buildingPrefab7;
	
	gridObject = GameObject.Find("HexagonGrid");
	grid = gridObject.GetComponent("HexagonGrid") as HexagonGrid;
}

static function Place(position: Vector3, isPreplaced: boolean){

	if (changeBuilding > 7) {
		return;
	} else {
	
		var build: Transform;
		
		var coordinate : Vector2 = grid.worldToTileCoordinates( position.x, position.y);
		Debug.Log("Placing.........");
		
		if( !isPreplaced )
		{
			if( locationIsBuildable(coordinate) )
			{
				build = Instantiate(buildingPrefabs[changeBuilding], position, Quaternion.identity);
				build.tag = "Building";
				build.gameObject.AddComponent("MeshRenderer");		
			
				Database.addBuildingToGrid(buildingPrefabs[changeBuilding].name, new Vector3(coordinate.x, coordinate.y, 0), "Tile Type", build.gameObject, isPreplaced, "", "");
			}
			else
			{
				Debug.Log("You cannot build here! Location is marked unbuildable.");
			}
		}
		else
		{
			build = Instantiate(buildingPrefabs[changeBuilding], position, Quaternion.identity);
			build.tag = "Building";
			build.gameObject.AddComponent("MeshRenderer");
			
			Database.addBuildingToGrid(buildingPrefabs[changeBuilding].name, new Vector3(coordinate.x, coordinate.y, 0), "Tile Type", build.gameObject, isPreplaced, "", "");
		}

	}
}



static function locationIsBuildable( coordinate : Vector3 ) : boolean {
	Debug.Log("Coordinates: " + coordinate);
	var thisTile : Tile;
	thisTile = grid.getTile( coordinate.x, coordinate.y );
	return thisTile.buildable;
}