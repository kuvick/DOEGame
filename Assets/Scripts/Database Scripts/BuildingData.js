/*
BuildingData.js
Original Script by Katharine Uvick

This will contain the basic data for level designers to use
to edit the information of building.

Will load the default information from the DefaultBuildingEditor.
To reset to defaults, you must delete that building and create a
new instance.


For reference, the BuildingOnGridData class:AssetModificationProcessor





*/

#pragma strict

@script ExecuteInEditMode()


	
private var firstLoad : boolean = true;

class BuildingResource extends System.Object{
	public var name:String;
	public var num:int;
}
var buildingData:BuildingOnGridData;
var buildingName = "nameOfBuilding";

var outputs:BuildingResource[];
var inputs:BuildingResource[];
var inputName : String[];
var inputNum : int[];

var outputName : String[];
var outputNum : int[];

var optionalOutputName : String[];
var optionalOutputNum : int[];

var isActive : boolean = false;
var coordinate : Vector3 = new Vector3(0,0,0);

//var linkedTo = new Array(); game assumes level designers will not need to pre-link buildings

var requisitionCost : int;
var pollutionOutput : int;
var unit : UnitType = UnitType.None;
var idea : String = "";
var event : String = "";
var buildingEvent:BuildingEvent;
	


// This function temporarily loads a database
/*function Start ()
{
	thisBuilding = gameObject;
	var replaceName : String = thisBuilding.name.Replace("(Clone)", "");
	thisBuilding.name = replaceName;

	if(loadDefaultData)
	{
		buildingData = new BuildingOnGridData();
		defaultBuildingsScript = GameObject.Find("Database").GetComponent("DefaultBuildings");
		buildingData = defaultBuildingsScript.convertDefaultBuildingIntoBuildingOnGrid( gameObject.name );		//MAKE SURE THE NAME OF THE GAME OBJECT IS THE BUILDING NAME
	}
	buildingData.coordinate = HexagonGrid.worldToTileCoordinates(thisBuilding.transform.position.x, thisBuilding.transform.position.z);
	buildingData.buildingPointer = thisBuilding;	// points to the GameObject to which the script is attached.
}// end of start

function Update()
{
	// If the application is not playing, will update the building's coordinates when moved...hopefully.
	if(!Application.isPlaying)
	{
	    buildingData.coordinate = HexagonGrid.worldToTileCoordinates(thisBuilding.transform.position.x, thisBuilding.transform.position.z);
	}
	
}// end of update
*/
function Update()
{
	// If the application is not playing, will update the building's coordinates when moved...hopefully.
	if(!Application.isPlaying)
	{

	    gameObject.transform.position = HexagonGrid.tileToWorldCoordinatesCentered(coordinate.x, coordinate.y);
	}
	
}