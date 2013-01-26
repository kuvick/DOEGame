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
//static var buildingPrefabs:Transform[];
var buildingPrefab0 : Transform; 
var buildingPrefab1 : Transform;
var buildingPrefab2 : Transform; 
var buildingPrefab3 : Transform;
var buildingPrefab4 : Transform; 
var buildingPrefab5 : Transform;
var buildingPrefab6 : Transform; 
var buildingPrefab7 : Transform;
static var cannotPlace: int = 0;
static var changeBuilding : int = 0;

static var gridObject:GameObject;
static var grid:HexagonGrid;

static var buildingPrefabs:GameObject[];

public var buildingSitePrefabsFolder : String;	// the level designer specifies the name of the folder, where the prefabs are located for the building sites

function Awake()
{
	// Loading the prefabs from the Resources folder
	var defaultBuildingScript : DefaultBuildings = GameObject.Find("Database").GetComponent("DefaultBuildings");
	var defaultBuildingList : DefaultBuildingData[] = defaultBuildingScript.defaultBuildings;
	var size: int = defaultBuildingList.Length;	
	var rawPrefabs : Object[] =  Resources.LoadAll(buildingSitePrefabsFolder);
	buildingPrefabs = new GameObject[rawPrefabs.Length];
	
	var i : int = 0;
	for (var prefab : GameObject in rawPrefabs)
	{
		buildingPrefabs[i] = prefab;
		Debug.Log(buildingPrefabs[i].ToString());
		i++;
	}
	
	
	gridObject = GameObject.Find("HexagonGrid");
	grid = gridObject.GetComponent("HexagonGrid") as HexagonGrid;
}

static function Place(position: Vector3, isPreplaced: boolean){

	if (changeBuilding > buildingPrefabs.Length - 1) 
	{
		return;
	} 
	else {
	
		var build: Transform;
		
		
		Debug.Log("Position Received: " + position);
		var coordinate : Vector2 = grid.worldToTileCoordinates( position.x, position.z);
		Debug.Log("Placing.........Coordinates are: " + coordinate);
		
		if( !isPreplaced )
		{
			if( locationIsBuildable(coordinate) )
			{
				build = Instantiate(buildingPrefabs[changeBuilding].transform, position, Quaternion.identity);
				build.tag = "Building";
				build.gameObject.AddComponent("MeshRenderer");		
				cannotPlace = 0;
				Database.addBuildingToGrid(buildingPrefabs[changeBuilding].name, new Vector3(Mathf.Abs(coordinate.x), Mathf.Abs(coordinate.y), 0), "Tile Type", build.gameObject, isPreplaced, "", "");
			}
			else
			{
				Debug.Log("You cannot build here! Location is marked unbuildable.");
				cannotPlace = 1;
				Debug.Log("set cannotplace to 1");
			}
		}
		else
		{
			build = Instantiate(buildingPrefabs[changeBuilding].transform, position, Quaternion.identity);
			build.tag = "Building";
			build.gameObject.AddComponent("MeshRenderer");
			
			Database.addBuildingToGrid(buildingPrefabs[changeBuilding].name, new Vector3(Mathf.Abs(coordinate.x), Mathf.Abs(coordinate.y), 0), "Tile Type", build.gameObject, isPreplaced, "", "");
		}

	}
}

function OnGUI()
{

if (cannotPlace==1)
	{
	GUI.contentColor = Color.red;
	GUI.backgroundColor = Color.black;
	Debug.Log("trying to print");
	GUI.Label(Rect(Screen.width/2 - 85, Screen.height - 100, Screen.width/2 + 50, 60), "You cannot place that building there!");
	//cannotPlace = 0;
	}
}

static function locationIsBuildable( coordinate : Vector3 ) : boolean {
	
	Debug.Log("Coordinates: " + coordinate);
	var thisTile : Tile;
	thisTile = grid.getTile( Mathf.Abs(coordinate.x), Mathf.Abs(coordinate.y) );
	return thisTile.buildable;
	
	//return true;
}