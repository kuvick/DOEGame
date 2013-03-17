/*
 DefaultBuildings.js
 Original script by Katharine Uvick
 
 Used to set the values of the default buildings.


*/

@script ExecuteInEditMode()

#pragma strict


public var defaultBuildings : DefaultBuildingData[];

/*

	NOTE: the two classes were created because Arrays will not
	appear in the inspector, and to change all of these data types
	would involve a massive change in the database.


*/


class DefaultBuildingData
{
	var buildingName = "nameOfBuilding";

	var unallocatedInputs : ResourceType[];
	var unallocatedOutputs : ResourceType[];
	var optionalOutput : ResourceType;
	
	var requisitionCost : int;
	
	var pollutionOutput : int;
}// end of DefaultBuildingData

class BuildingOnGridData
{

	var buildingName = "nameOfBuilding";
	
	var unallocatedInputs : ResourceType[];
	var unallocatedOutputs : ResourceType[];
	
	var optionalOutput : ResourceType;
	
	var isActive : boolean = false;
	
	var coordinate : Vector3 = new Vector3(0,0,0);
	var tileType = "tileType";
	var buildingPointer: GameObject;
	
	//var neededUpgrade : UpgradeType;
	var heldUpgrade : UpgradeType;
	
	var requisitionCost : int;
	var pollutionOutput : int;
	var unit : UnitType = UnitType.None;
	var idea : String = "";
	var hasEvent : boolean = false;
	
}// end of BuildingOnGridData



// The following scripts convert one data type into another:

public function convertDefaultBuildingDataIntoBuilding( defaultBuilding : DefaultBuildingData ) : Building
{
	var databaseBuilding : Building = new Building();

	databaseBuilding.buildingName = defaultBuilding.buildingName;
	
	for (var tempVar : ResourceType in defaultBuilding.unallocatedInputs)//String in defaultBuilding.inputName)
	{
		databaseBuilding.unallocatedInputs.Add(tempVar);//inputName.Push(tempVar);
	}

	
	for (var tempVar : ResourceType in defaultBuilding.unallocatedOutputs)//String in defaultBuilding.outputName)
	{
		databaseBuilding.unallocatedOutputs.Add(tempVar);
	}
	
	databaseBuilding.optionalOutput = defaultBuilding.optionalOutput;
	
	databaseBuilding.requisitionCost = defaultBuilding.requisitionCost;
	databaseBuilding.pollutionOutput = defaultBuilding.pollutionOutput;	
	
	return databaseBuilding;
	
}// end of convertDefaultBuildingDataIntoBuilding

public function convertBuildingOnGridDataIntoBuildingOnGrid( buildingData : BuildingOnGridData ): BuildingOnGrid
{
	var buildingOnGrid : BuildingOnGrid = new BuildingOnGrid();
	
	buildingOnGrid.buildingName = buildingData.buildingName;
	
	for (var tempVar : ResourceType in buildingData.unallocatedInputs)
	{
		buildingOnGrid.unallocatedInputs.Add(tempVar);
	}
	
	for (var tempVar : ResourceType in buildingData.unallocatedOutputs)
	{
		buildingOnGrid.unallocatedOutputs.Add(tempVar);
	}
	
	buildingOnGrid.optionalOutput = buildingData.optionalOutput;
	
	buildingOnGrid.requisitionCost = buildingData.requisitionCost;
	buildingOnGrid.pollutionOutput = buildingData.pollutionOutput;
	buildingOnGrid.isActive = buildingData.isActive;
	buildingOnGrid.coordinate = buildingData.coordinate;
	buildingOnGrid.tileType = buildingData.tileType;
	buildingOnGrid.buildingPointer = buildingData.buildingPointer;
	buildingOnGrid.heldUpgrade = buildingData.heldUpgrade;
	//buildingOnGrid.neededUpgrade = buildingData.neededUpgrade;
	buildingOnGrid.unit = buildingData.unit;
	buildingOnGrid.idea = buildingData.idea;
	buildingOnGrid.hasEvent = buildingData.hasEvent;
	
	
	
	return buildingOnGrid;
}// end of convertBuildingOnGridDataIntoBuildingOnGrid

public function convertDefaultBuildingIntoBuildingOnGrid( defaultBuildingName : String ) : BuildingOnGridData
{
	var defaultBuilding : DefaultBuildingData = new DefaultBuildingData();
	
	// Search for specified building in defaultBuildings array
	for (var buildingFromArray : DefaultBuildingData in defaultBuildings)
	{
		if(buildingFromArray.buildingName == defaultBuildingName )
		{
			defaultBuilding = buildingFromArray;
		}
    }

	var buildingOnGrid : BuildingOnGridData = new BuildingOnGridData();
	
	
	buildingOnGrid.buildingName = defaultBuilding.buildingName;

	buildingOnGrid.unallocatedInputs = defaultBuilding.unallocatedInputs;
	buildingOnGrid.unallocatedOutputs = defaultBuilding.unallocatedOutputs;
	buildingOnGrid.optionalOutput = defaultBuilding.optionalOutput;
	buildingOnGrid.requisitionCost = defaultBuilding.requisitionCost;
	buildingOnGrid.pollutionOutput = defaultBuilding.pollutionOutput;
	
	return buildingOnGrid;
	

}// end of convertDefaultBuildingIntoBuildingOnGrid

// Function to be used by the database to create an array of
// default buildings
public function createDefaultBuildingArray(): Array
{
	var defaultBuildingArray : Array = new Array();
	var tempBuilding : Building;
	
	
	for (var defaultBuildingData : DefaultBuildingData in defaultBuildings)
	{
		tempBuilding = new Building();
		tempBuilding = convertDefaultBuildingDataIntoBuilding( defaultBuildingData );
		defaultBuildingArray.Push(tempBuilding);
	}
	
	return defaultBuildingArray;
}// end of createDefaultBuildingArray