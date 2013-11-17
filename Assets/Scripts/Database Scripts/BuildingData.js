/*
BuildingData.js
Original Script by Katharine Uvick

This will contain the basic data for level designers to use
to edit the information of building.

Will load the default information from the DefaultBuildingEditor.
To reset to defaults, you must delete that building and create a
new instance.


For reference, the BuildingOnGridData class:AssetModificationProcessor


class BuildingOnGridData
{

	var buildingName = "nameOfBuilding";

	var inputName : String[];
	var inputNum : int[];
	
	var outputName : String[];
	var outputNum : int[];
	
	var optionalOutputName : String[];
	var optionalOutputNum : int[];
	
	var isActive : boolean = false;
	
	var coordinate : Vector3 = new Vector3(0,0,0);
	var tileType = "tileType";
	var buildingPointer: GameObject;
	
	//var linkedTo = new Array(); game assumes level designers will not need to pre-link buildings
	
	var requisitionCost : int;
	var pollutionOutput : int;
	var unit : UnitType = UnitType.None;
	var idea : String = "";
	var event : String = "";
	
}// end of BuildingOnGridData



*/

#pragma strict

@script ExecuteInEditMode()

	public var buildingData : BuildingOnGridData;
	private var thisBuilding : GameObject;
	public var loadDefaultData : boolean = false;	// be sure to set false before the game starts, else it might replace the changed data
	
	private var firstLoad : boolean = false;
	private var centerOffset : Vector3 = new Vector3(HexagonGrid.tileHalfWidth, 0, HexagonGrid.tileHalfHeight); // add to tile-to-world coordinate to get center of tile

// This function temporarily loads a database
function Start ()
{
	loadDefaultData = false;

	thisBuilding = gameObject;
	var replaceName : String = thisBuilding.name.Replace("(Clone)", "");
	thisBuilding.name = replaceName;

	/*if(loadDefaultData)
	{
		buildingData = new BuildingOnGridData();
		defaultBuildingsScript = GameObject.Find("Database").GetComponent(DefaultBuildings);
		buildingData = defaultBuildingsScript.convertDefaultBuildingIntoBuildingOnGrid( gameObject.name );		//MAKE SURE THE NAME OF THE GAME OBJECT IS THE BUILDING NAME
	}*/
	buildingData.coordinate = HexagonGrid.worldToTileCoordinates(thisBuilding.transform.position.x, thisBuilding.transform.position.z);
	buildingData.buildingPointer = thisBuilding;	// points to the GameObject to which the script is attached.
	//CenterBuilding();
}// end of start

function Update()
{
	// If the application is not playing, will update the building's coordinates when moved...hopefully.
	if(!Application.isPlaying)
	{
	    buildingData.coordinate = HexagonGrid.worldToTileCoordinates(thisBuilding.transform.position.x, thisBuilding.transform.position.z);
	    CenterBuilding();
	}
	
}// end of update

// positions the building at the center of the current tile
private function CenterBuilding()
{
	var worldCoord = HexagonGrid.TileToWorldCoordinates(buildingData.coordinate.x, buildingData.coordinate.y);
	worldCoord += centerOffset;
	gameObject.transform.position = worldCoord;
}

//Moved from DefaultBuilding.js, converts this BuildingOnGridData into a BuildinOnGrid class.
public function convertBuildingOnGridDataIntoBuildingOnGrid(): BuildingOnGrid
{
	var buildingOnGrid : BuildingOnGrid = new BuildingOnGrid();
	
	buildingOnGrid.buildingName = buildingData.buildingName;
	
	for (var i : int = 0; i < buildingData.unallocatedInputs.length; i++)//var tempVar : ResourceType in buildingData.unallocatedInputs)
	{
		buildingOnGrid.unallocatedInputs.Add(buildingData.unallocatedInputs[i]);//tempVar);
	}
	
	for (i = 0; i < buildingData.unallocatedOutputs.length; i++)//var tempVar : ResourceType in buildingData.unallocatedOutputs)
	{
		buildingOnGrid.unallocatedOutputs.Add(buildingData.unallocatedOutputs[i]);//tempVar);
	}
	
	buildingOnGrid.optionalOutput = buildingData.optionalOutput;
	
	buildingOnGrid.premadeLinks = buildingData.premadeLinks;
	
	buildingOnGrid.requisitionCost = buildingData.requisitionCost;
	buildingOnGrid.pollutionOutput = buildingData.pollutionOutput;
	buildingOnGrid.isActive = buildingData.isActive;
	buildingOnGrid.coordinate = buildingData.coordinate;
	buildingOnGrid.tileType = buildingData.tileType;
	buildingOnGrid.buildingPointer = buildingData.buildingPointer;
	buildingOnGrid.heldUpgradeID = buildingData.heldUpgrade;
	buildingOnGrid.heldUpgradeTooltip = buildingData.heldUpgradeTooltip;
	/*buildingOnGrid.heldUpgradeTooltipText = buildingData.heldUpgradeTooltipText;
	buildingOnGrid.heldUpgradeTooltipPic = buildingData.heldUpgradeTooltipPic;*/
	//buildingOnGrid.neededUpgrade = buildingData.neededUpgrade;
	buildingOnGrid.unit = buildingData.unit;
	buildingOnGrid.idea = buildingData.idea;
	buildingOnGrid.hasEvent = buildingData.hasEvent;
	
	buildingOnGrid.tooltip = buildingData.tooltip;
	buildingOnGrid.hasTooltipTrigger = buildingData.hasTooltipTrigger;
	//buildingOnGrid.isPriorityTooltip = buildingData.isPriorityTooltip;
	/*buildingOnGrid.tooltipText = buildingData.tooltipText;
	buildingOnGrid.tooltipPic = buildingData.tooltipPic;*/
	
	return buildingOnGrid;
}// end of convertBuildingOnGridDataIntoBuildingOnGrid
