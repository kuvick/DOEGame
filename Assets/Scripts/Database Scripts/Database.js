#pragma strict
import System.Collections.Generic;

/*
Database.js
Originally by Katharine Uvick

This script stores data regarding the buildings in a level, 
and contains functions that alter the relationship between these
buildings (e.g., linking, adding a building to the grid via
a building site, etc). Also contains functionality to undo
these actions by the player.

Should be attached to GameObject called Database.

Search for sections:
[Variables]
[Functions]
	[Startup Function]
	[Building and Info Access Functions]
	[Linking Functions]
	[Building Activation Functions]
	[Building Site Functions]
	[Undo Functions]
	[Potentially Obsolete Functions]
	[Unit Functions]
	[Broadcast Functions]
	[Metric and Serialization Functions]
[Enums]
[Classes]

*/


//*********************************************************************************************************************
// [Variables] ********************************************************************************************************


static public var playtestID : String = "";

public static var buildingsOnGrid : List.<BuildingOnGrid>;	// Contains all buildings on the grid in the level

static public var TILE_RANGE = 3; // The amount of tiles a building has in range, can be specific to building later on

//Undo-related variables:
static public var UndoStack : List.<UndoType>;
//List holding information pertaining to links. When they were created, and which building they are attached to.
static public var linkList: List.<LinkTurnNode>;
//List holding information pertaining to adds. A reference to the building site, as well as the object that replaced it.
static public var addList: List.<AddTurnNode>;
static var grid:HexagonGrid;


// Ref. of other scripts:
static var intelSystem : IntelSystem;
private var drawLinks : DrawLinks;
private var display : InspectionDisplay;
private static var linkUIRef : LinkUI;


private var buildingWithUnitActivatedScore : int = 20;

//Metric Variables
public var metrics : MetricContainer;
public var m_display : MetricDisplay;

public var level_s : LevelSerializer;

public var buildingIndicatorPrefab : GameObject;

//*********************************************************************************************************************
// [Functions] ********************************************************************************************************

//*******************************************
// [Startup Function] ***********************
function Start()
{
	var guiObj : GameObject = GameObject.Find("GUI System");
	// Telling the GUISystem to get the references to scripts specific to the level:
	var manager : GUIManager = guiObj.GetComponent(GUIManager);
	manager.LoadLevelReferences();
	var mainMenu : MainMenu = guiObj.GetComponent(MainMenu);
	mainMenu.LoadLevelReferences();
	var buildMenu : BuildingMenu = guiObj.GetComponent(BuildingMenu);
	buildMenu.LoadLevelReferences();
	
	
	// Finding script references needed by the database:
	display = guiObj.GetComponent(InspectionDisplay);	
	var cameraObj : GameObject = GameObject.Find("Main Camera");
	drawLinks = cameraObj.GetComponent(DrawLinks);
	linkUIRef = cameraObj.GetComponent(LinkUI);
	grid = GameObject.Find("HexagonGrid").GetComponent(HexagonGrid);
	


	// Gathering the data from the buildings on the grid:
	buildingsOnGrid = new List.<BuildingOnGrid>();
	var tempBuildingData : BuildingData;
	var tempBuilding : BuildingOnGrid;

	var buildingObjects : GameObject[] = GameObject.FindGameObjectsWithTag("Building");
	var index :int = 0;
	
	for (index = 0; index < buildingObjects.length; index++)
	{
		// Gets the building's data, converts it into the proper class,
		tempBuilding = new BuildingOnGrid();
		tempBuildingData = buildingObjects[index].GetComponent(BuildingData);
		tempBuilding = tempBuildingData.convertBuildingOnGridDataIntoBuildingOnGrid();
		
		// Create the building's highlight hexagon
		tempBuilding.highlighter = grid.CreateHighlightHexagon(tempBuilding.coordinate);
		/*var tempIndicator : GameObject = Instantiate(buildingIndicatorPrefab, Vector3(0,5,0), Quaternion.identity);
		tempIndicator.transform.parent = buildingObjects[index].transform;
		tempIndicator.transform.localPosition = Vector3(0,5,0);*/
		tempBuilding.indicator = buildingObjects[index].GetComponentInChildren(BuildingIndicator);
		
		//GPC 11/23 this line was throwing errors, commented out
//		tempBuilding.indicator.SetState(IndicatorState.Neutral);
		
		// Generates resource icons:
		linkUIRef.GenerateBuildingResourceIcons(tempBuilding);
		for (var j : int = 0; j < tempBuilding.premadeLinks.length; j++)
			linkUIRef.AddPremadeLink(tempBuilding.premadeLinks[j], buildingObjects[index]);
		
		// Adds building to the list
		buildingsOnGrid.Add(tempBuilding);
		BroadcastBuildingUpdate();
		//Debug.Log(tempBuilding.buildingName + " was added to the grid at " + tempBuilding.coordinate.x + "," + tempBuilding.coordinate.y);
	}
	//linkUIRef.GeneratePremadeLinks();
	// Gets the reference to the intel system, creases lists related to undo variables
	intelSystem = gameObject.GetComponent(IntelSystem);
	linkList = new List.<LinkTurnNode>();
	addList = new List.<AddTurnNode>();
	UndoStack = new List.<UndoType>();
	
	// Metric data:
	/*metrics = new MetricContainer();
	m_display = new MetricDisplay();*/
	
	if (playtestID == ""){
		playtestID = GenerateID();
	}
	
	// Determines wheter buildings can be activated at the start of the game
	for (var i : int = 0; i < buildingsOnGrid.Count; i++)
		activateBuilding(i, false);
		
	// Level Serialization
	/*level_s = new LevelSerializer();
	WriteLevel();*/
	
	// sets highlight tiles
	linkUIRef.HighlightTiles();
}

//*******************************************
// [Building and Info Access Functions] *****

/*

The findBuildingIndex function is used to identify the index
of the building in the buildingsOnGrid array based on a
given coordinate.

*/
static public function findBuildingIndex( coordinate:Vector3 ): int
{
	//var index = 0;

	for (var index : int = 0; index < buildingsOnGrid.Count; index++)//var placedBuilding : BuildingOnGrid in buildingsOnGrid)
	{
		//Debug.Log("coordinate: " + coordinate + " building coord: " + placedBuilding.coordinate);
		if(coordinate == buildingsOnGrid[index].coordinate)//placedBuilding.coordinate)
		{
			//Debug.Log("Found match at " + index);
			return index;
		}
		
		//index++;
	}
	return -1;			// will return -1 if there is no building at the
						// given coordinate, to be used as a check as
						// needed if there is no building at the given
						// coordinate
								
	
}// end of findBuildingIndex

static public function findBuildingIndex (build : BuildingOnGrid) : int {
	//var index = 0;

	for (var index = 0; index < buildingsOnGrid.Count; index++)//var placedBuilding : BuildingOnGrid in buildingsOnGrid)
	{
		//Debug.Log("coordinate: " + coordinate + " building coord: " + placedBuilding.coordinate);
		if(build == buildingsOnGrid[index])//placedBuilding)
		{
			//Debug.Log("Found match at " + index);
			return index;
		}
		
		//index++;
	}
	return -1;	
}

static public function getBuildingAtIndex(index: int):GameObject{
	var toReturn : BuildingOnGrid = buildingsOnGrid[index];
	return (toReturn.buildingPointer);
}

static public function getBuildingOnGridAtIndex(index: int):BuildingOnGrid{
	if (index < buildingsOnGrid.Count)
		return buildingsOnGrid[index];
	return null;
}

static public function getBuildingsOnGrid() : List.<BuildingOnGrid>{
	return (buildingsOnGrid);
}

static public function getBuildingOnGrid(coordinate:Vector3):BuildingOnGrid
{
	// If z is not zero, must have recieved its world position rather than coordinate
	// Also, no coordinates will be negative, so correction by absolute value
	//Debug.Log("Coordinate: " + coordinate);
	if(coordinate.z != 0)
	{
		var tempCoord : Vector2 = grid.worldToTileCoordinates( coordinate.x, coordinate.z);
		coordinate = new Vector3( Mathf.Abs(tempCoord.x), Mathf.Abs(tempCoord.y), 0);
		//Debug.Log("Changing coordinate to: " + coordinate);
	}
	
	var index : int = findBuildingIndex(coordinate);
	
	if(index > -1)
		return buildingsOnGrid[index];
	else
	{
		Debug.Log("Building not found at " + coordinate);
		return null;	// if it returns -1, then it could not find the building
	}
}

static public function checkForResource(building : BuildingOnGrid, rt : ResourceType) : boolean
{

	for(var i : int = 0; i < building.unallocatedInputs.Count; i++)
	{
		if(building.unallocatedInputs[i] == rt)
		{
			GUI.enabled= true;
			building.highlighter.renderer.material.color = new Color(0,1,1,.5);
			return true;
		}
	}
	
	for(var j : int = 0; j < building.allocatedInputs.Count; j++)
	{
		if(building.allocatedInputs[j] == rt)
		{	
			GUI.enabled= true;
			building.highlighter.renderer.material.color = new Color(0,1,1,.5);
			return true;
		}
	}
	
	return false;
}

static function copyBuildingOnGrid( copyFrom:BuildingOnGrid, copyTo:BuildingOnGrid )
{
	copyTo.buildingName = copyFrom.buildingName;
	
	copyTo.unallocatedInputs.Clear();
	copyTo.unallocatedInputs.AddRange(copyFrom.unallocatedInputs);
	copyTo.allocatedInputs.Clear();
	copyTo.allocatedInputs.AddRange(copyFrom.allocatedInputs);
	
	copyTo.unallocatedOutputs.Clear();
	copyTo.unallocatedOutputs.AddRange(copyFrom.unallocatedOutputs);
	copyTo.allocatedOutputs.Clear();
	copyTo.allocatedOutputs.AddRange(copyFrom.allocatedOutputs);
	
	copyTo.optionalOutput = copyFrom.optionalOutput;
	copyTo.optionalOutputAllocated = copyFrom.optionalOutputAllocated;
	copyTo.optionalOutputFixed = copyFrom.optionalOutputFixed;
	copyTo.optionalOutputIcon = copyFrom.optionalOutputIcon;

	copyTo.isActive = copyFrom.isActive;
	copyTo.coordinate = copyFrom.coordinate;
	copyTo.tileType = copyFrom.tileType;

	copyTo.inputLinkedTo.Clear();
	copyTo.inputLinkedTo.AddRange(copyTo.inputLinkedTo);
	copyTo.outputLinkedTo.Clear();
	copyTo.outputLinkedTo.AddRange(copyTo.outputLinkedTo);
	
	copyTo.requisitionCost = copyFrom.requisitionCost;
	copyTo.pollutionOutput = copyFrom.pollutionOutput;
	
	copyTo.unit = copyFrom.unit;
	copyTo.idea = copyFrom.idea;
	copyTo.hasEvent = copyFrom.hasEvent;
	
	copyTo.heldUpgradeID = copyFrom.heldUpgradeID;
	copyTo.heldUpgradeTooltip = copyFrom.heldUpgradeTooltip;
	
	copyTo.hasTooltipTrigger = copyFrom.hasTooltipTrigger;
	copyTo.tooltip = copyFrom.tooltip;
	/*copyTo.tooltipText = copyFrom.tooltipText;
	copyTo.tooltipPic = copyFrom.tooltipPic;*/
} // end of copyBuildingOnGrid


//*******************************************
// [Linking Functions] **********************


/*

The linkBuildings function is to be used to check if the buildings used for
output and input contain the desired resource to be linked, and then proceeds
to decrease the resource amount for the input and output by one

NOTE: for this database, for buildings on the grid, the number of resources a
building has for input/output indicate non-linked, avaliable resources. Thus
when an input has been reduced to zero, all of its needs have been met (linked
to an output), and when output is reduced to zero, all of its output is
currently being used.

ALSO, the function assumes the two buildings are close enough to be linked,
and that the output building is active (this can be checked as needed using
another function listed later on, although for distance that will have to be
another check)

*/
public function linkBuildings(outputBuildingIndex:int, inputBuildingIndex:int, resourceName:ResourceType, usedOptionalOutput : boolean) : boolean//hasOptionalOutput:boolean):boolean
{
	var outputBuilding : BuildingOnGrid = buildingsOnGrid[outputBuildingIndex];
	var inputBuilding : BuildingOnGrid = buildingsOnGrid[inputBuildingIndex];
	
	var hasResource = false;
	
	if (usedOptionalOutput)
	{
		if (outputBuilding.optionalOutput == resourceName && !outputBuilding.optionalOutputAllocated
			&& inputBuilding.unallocatedInputs.Contains(resourceName))
			hasResource = true;
	}
	else
	{
		if (inputBuilding.unallocatedInputs.Contains(resourceName) && outputBuilding.unallocatedOutputs.Contains(resourceName))
			hasResource = true;

		// Used for link reallocation, shifts over to the OverloadLink function
		// If the input has already been allocated and there is an avaliable unallocated output:
		else if (inputBuilding.allocatedInputs.Contains(resourceName) && outputBuilding.unallocatedOutputs.Contains(resourceName))
		{
			hasResource = true;
			OverloadLink (outputBuildingIndex, inputBuildingIndex, 0, resourceName, false, false);	
			return true;
		}
		// Whether the input has been allocated or not, if the output has not been allocated:
		else if (inputBuilding.allocatedInputs.Contains(resourceName) && outputBuilding.allocatedOutputs.Contains(resourceName))
		{
			hasResource = true;
			OverloadLink (outputBuildingIndex, inputBuildingIndex, 0, resourceName, false, true);	
			return true;
		}
		else if (inputBuilding.unallocatedInputs.Contains(resourceName) && outputBuilding.allocatedOutputs.Contains(resourceName))
			Debug.Log("Need to set up a case where input is unallocated and output is allocated");
		
		
			
	}
    
    // If the resource has been found in both buildings,
    // decrease the amount and add the index of the other building
    // in the linkedTo array.
    if(hasResource)
    {
    
    	//adding for undo:
    	var tempOutputBuilding: BuildingOnGrid = new BuildingOnGrid();
		var tempInputBuilding: BuildingOnGrid = new BuildingOnGrid();
		
		var tempFoundIndex : int;
		var tempIcon : ResourceIcon;
	
		copyBuildingOnGrid(buildingsOnGrid[outputBuildingIndex], tempOutputBuilding);
		copyBuildingOnGrid(buildingsOnGrid[inputBuildingIndex], tempInputBuilding);
	
		//Obsolete Undo Code
		//previousBuildings.Add("EndOfLink");	
		//previousBuildings.Add(tempInputBuilding);
		//previousBuildings.Add(inputBuildingIndex);
		//previousBuildings.Add(tempOutputBuilding);
		//previousBuildings.Add(outputBuildingIndex);
		//previousBuildings.Add("Link");
		//numberOfUndos++;
		//cleanUpPreviousBuildings();
		
		//****************

    	if(usedOptionalOutput)
    	{
		    outputBuilding.optionalOutputAllocated = true;
		    outputBuilding.optionalOutputLinkedTo = inputBuildingIndex;
		    outputBuilding.optionalOutputIcon.SetAllocated(true);
    	}
    	else
    	{
		    outputBuilding.allocatedOutputs.Add(resourceName);
		    
		    tempFoundIndex = outputBuilding.unallocatedOutputs.IndexOf(resourceName);
		    outputBuilding.unallocatedOutputs.Remove(resourceName);
		    outputBuilding.outputLinkedTo.Add(inputBuildingIndex);
		    
		    tempIcon = outputBuilding.unallocatedOutputIcons[tempFoundIndex];
		    outputBuilding.unallocatedOutputIcons.Remove(tempIcon);
		    tempIcon.SetAllocated(true);
		    outputBuilding.allocatedOutputIcons.Add(tempIcon);
		    tempIcon.SetIndex(outputBuilding.allocatedOutputIcons.Count - 1);
	    }
	    
	    inputBuilding.allocatedInputs.Add(resourceName);
	    tempFoundIndex = inputBuilding.unallocatedInputs.IndexOf(resourceName);
		inputBuilding.unallocatedInputs.Remove(resourceName);
		inputBuilding.inputLinkedTo.Add(outputBuildingIndex);
		
		tempIcon = inputBuilding.unallocatedInputIcons[tempFoundIndex];
		inputBuilding.unallocatedInputIcons.Remove(tempIcon);
		tempIcon.SetAllocated(true);
		inputBuilding.allocatedInputIcons.Add(tempIcon);
		tempIcon.SetIndex(inputBuilding.allocatedInputIcons.Count - 1);
	    
	    buildingsOnGrid[outputBuildingIndex] = outputBuilding;
		buildingsOnGrid[inputBuildingIndex] = inputBuilding;
		activateBuilding(inputBuildingIndex, true);
		
		//Stores links into list organized by when they were created	
		var tempNode : LinkTurnNode = new LinkTurnNode();
		tempNode.b1 = inputBuilding.buildingPointer;
		tempNode.b1Coord = inputBuilding.coordinate;
		tempNode.b2 = outputBuilding.buildingPointer;
		tempNode.b2Coord = outputBuilding.coordinate;
		tempNode.turnCreated = intelSystem.currentTurn + 1;
		tempNode.type = resourceName;
		tempNode.usedOptionalOutput = usedOptionalOutput;
		linkList.Add(tempNode);
		
		SoundManager.Instance().PlayLinkMade(resourceName);
		
		UndoStack.Add(UndoType.Link);
		
		intelSystem.addTurn();	// NEW: Intel System
		intelSystem.comboSystem.incrementComboCount();
		intelSystem.incrementScore(true, intelSystem.comboSystem.comboScoreBasePoints);
		//metrics.addLinkData(new LinkData("Link", intelSystem.currentTurn, findBuildingIndex(inputBuilding), inputBuilding.buildingName, findBuildingIndex(outputBuilding), outputBuilding.buildingName, -1, -1));
		//metrics.addLinkData(new LinkData("Link", intelSystem.currentTurn, inputBuilding.coordinate, inputBuilding.buildingName, outputBuilding.coordinate, outputBuilding.buildingName, new Vector3(-100,0,0), new Vector3(-100,0,0)));
		//Save("Building Link");
		SetBuildingResourceActive(outputBuilding.allocatedOutputIcons, false);
		
		//Debug.Log("Index used for deactivate: " + outputBuildingIndex);
		if(inputBuilding.deactivatedInputs.Contains(inputBuilding.inputLinkedTo.IndexOf(outputBuildingIndex)))
			inputBuilding.deactivatedInputs.Remove(inputBuilding.inputLinkedTo.IndexOf(outputBuildingIndex));
		
    }
    else
    {
    	Debug.Log("Unable to link buildings due to unmatched or missing resource");
    }
    
    // If the building is activated and has an event, sends a message to the intel system
	/*if(activateBuilding( inputBuildingIndex ) && inputBuilding.hasEvent)
    {
    	intelSystem.buildingActivated(inputBuilding.buildingPointer);
    }*/
    
    return hasResource;

}// End of linkBuildings

// Used for the overload type of link reallocation.
public function OverloadLink (outputBuildingIndex:int, inputBuildingIndex:int, selectedInIndex : int, 
	resourceName:ResourceType, usedOptionalOutput : boolean, allocatedOutSelected : boolean) : int
{
	var outputBuilding : BuildingOnGrid = buildingsOnGrid[outputBuildingIndex]; // get the output building on grid
	var inputBuilding : BuildingOnGrid = buildingsOnGrid[inputBuildingIndex]; // get the input building on grid
	var inputIndex : int = inputBuilding.allocatedInputs.IndexOf(resourceName);
	var oldOutputBuildingIndex : int = inputBuilding.inputLinkedTo[inputIndex];//selectedInIndex]; // save the old output building index
	var oldOutputBuilding : BuildingOnGrid = buildingsOnGrid[oldOutputBuildingIndex]; // get the old output building on grid
	var hasResource = false;	
	
	if (oldOutputBuildingIndex == outputBuildingIndex)
	{
		Debug.Log("Overload failed");
		return -1;
	}
	
	var outputList : List.<ResourceType>;
	
	if (allocatedOutSelected)
		outputList = outputBuilding.allocatedOutputs;
	else
		outputList = outputBuilding.unallocatedOutputs;
	
	// Check whether the resource is valid
	if (usedOptionalOutput)
	{
		if (outputBuilding.optionalOutput == resourceName && !outputBuilding.optionalOutputAllocated
			&& inputBuilding.allocatedInputs[selectedInIndex] == resourceName)
			hasResource = true;
	}
	else
	{
		if (inputBuilding.allocatedInputs.Contains(resourceName) && outputList.Contains(resourceName))
			hasResource = true;
	}
	
	// if resource is valid
	if (hasResource)
	{
		var tempFoundIndex : int;
		var tempIcon : ResourceIcon;
		
		if(usedOptionalOutput)
    	{
		    outputBuilding.optionalOutputAllocated = true;
		    outputBuilding.optionalOutputLinkedTo = inputBuildingIndex;
		    outputBuilding.optionalOutputIcon.SetAllocated(true);
    	}
    	// move the resource from the output building's unallocated list to allocated
    	else if (!allocatedOutSelected)
    	{
		    outputBuilding.allocatedOutputs.Add(resourceName);
		    tempFoundIndex = outputBuilding.unallocatedOutputs.IndexOf(resourceName);
		    outputBuilding.unallocatedOutputs.Remove(resourceName);
		    outputBuilding.outputLinkedTo.Add(inputBuildingIndex); // add the link to the output building
		    
		    tempIcon = outputBuilding.unallocatedOutputIcons[tempFoundIndex];
		    outputBuilding.unallocatedOutputIcons.Remove(tempIcon);
		    tempIcon.SetAllocated(true);
		    outputBuilding.allocatedOutputIcons.Add(tempIcon);
		    tempIcon.SetIndex(outputBuilding.allocatedOutputIcons.Count - 1);
	    }
	    
	    // swap the resource from the allocated list back into the unallocated list of the old output building
	    // and remove the link
	    var oldOutIndex : int = oldOutputBuilding.outputLinkedTo.IndexOf(inputBuildingIndex);
	    if (oldOutIndex > -1)
	    {
		    oldOutputBuilding.unallocatedOutputs.Add(resourceName);
		    oldOutputBuilding.allocatedOutputs.RemoveAt(oldOutIndex);
		    oldOutputBuilding.outputLinkedTo.RemoveAt(oldOutIndex);
		    
		    tempIcon = oldOutputBuilding.allocatedOutputIcons[oldOutIndex];
		    oldOutputBuilding.allocatedOutputIcons.Remove(tempIcon);
		    tempIcon.SetAllocated(false);
		    oldOutputBuilding.unallocatedOutputIcons.Add(tempIcon);
		    tempIcon.SetIndex(oldOutputBuilding.unallocatedOutputIcons.Count - 1);
	    }
	    else
	    {
	    	oldOutputBuilding.optionalOutputAllocated = false;
	    	oldOutputBuilding.optionalOutputLinkedTo = -1;
	    	oldOutputBuilding.optionalOutputIcon.SetAllocated(false);
	    }
	    
		inputBuilding.inputLinkedTo[inputIndex] = outputBuildingIndex; // swap in the new output building index for the input's links
		
		buildingsOnGrid[outputBuildingIndex] = outputBuilding;
		buildingsOnGrid[inputBuildingIndex] = inputBuilding;
		
		//Debug.Log("Index used for deactivate: " + oldOutputBuildingIndex);
		if(inputBuilding.deactivatedInputs.Contains(inputBuilding.inputLinkedTo.IndexOf(outputBuildingIndex)))
			inputBuilding.deactivatedInputs.Remove(inputBuilding.inputLinkedTo.IndexOf(outputBuildingIndex));
			
		if(inputBuilding.deactivatedInputs.Contains(inputBuilding.inputLinkedTo.IndexOf(oldOutputBuildingIndex)))
			inputBuilding.deactivatedInputs.Remove(inputBuilding.inputLinkedTo.IndexOf(oldOutputBuildingIndex));
		
		activateBuilding(inputBuildingIndex, true);
		Debug.Log("End of link overload");
		
		//Stores links into list organized by when they were created	
		var tempNode : LinkTurnNode = new LinkTurnNode();
		tempNode.b1 = inputBuilding.buildingPointer;
		tempNode.b1Coord = inputBuilding.coordinate;
		tempNode.b2 = outputBuilding.buildingPointer;
		tempNode.b2Coord = outputBuilding.coordinate;
		tempNode.b3 = oldOutputBuilding.buildingPointer;
		tempNode.b3Coord = oldOutputBuilding.coordinate;
		tempNode.turnCreated = intelSystem.currentTurn + 1;
		tempNode.type = resourceName;
		tempNode.usedOptionalOutput = usedOptionalOutput;
		linkList.Add(tempNode);		
		
		UndoStack.Add(UndoType.Overload);		
		if (!allocatedOutSelected)
		{						
			UnitManager.CheckUnitPathsBroken();
			intelSystem.addTurn();
			intelSystem.comboSystem.incrementComboCount();
			intelSystem.incrementScore(true, intelSystem.comboSystem.comboScoreBasePoints);
			//metrics.addLinkData(new LinkData("Overload", intelSystem.currentTurn, findBuildingIndex(inputBuilding), inputBuilding.buildingName, findBuildingIndex(outputBuilding), outputBuilding.buildingName, findBuildingIndex(oldOutputBuilding), -1));
			//metrics.addLinkData(new LinkData("Overload", intelSystem.currentTurn, inputBuilding.coordinate, inputBuilding.buildingName, outputBuilding.coordinate, outputBuilding.buildingName, oldOutputBuilding.coordinate, new Vector3(-100,0,0)));
			//Save("Overload Link");
		}
	}
	
	//Debug.Log("Finished Overriding...inputlinkedto list");
	//printOutIntLists(buildingsOnGrid[inputBuildingIndex].inputLinkedTo, true);
	
	if (hasResource)
		return oldOutputBuildingIndex;//hasResource;
	Debug.Log("Overload failed");
	return -1;
}

// Used for the chain break type of link reallocation
public function ChainBreakLink (outputBuildingIndex:int, inputBuildingIndex:int, selectedOutIndex : int, 
	resourceName:ResourceType, usedOptionalOutput : boolean, allocatedInSelected : boolean) : int
{
	var outputBuilding : BuildingOnGrid = buildingsOnGrid[outputBuildingIndex]; // get the output building on grid
	var inputBuilding : BuildingOnGrid = buildingsOnGrid[inputBuildingIndex]; // get the input building on grid
	var oldInputBuildingIndex : int;
	if (usedOptionalOutput)
		oldInputBuildingIndex = outputBuilding.optionalOutputLinkedTo;
	else
		oldInputBuildingIndex = outputBuilding.outputLinkedTo[selectedOutIndex]; // save the old input building index
	var oldInputBuilding : BuildingOnGrid = buildingsOnGrid[oldInputBuildingIndex]; // get the old input building on grid
	var hasResource = false;
	var inputList : List.<ResourceType>;
	
	if (oldInputBuildingIndex == inputBuildingIndex)
	{
		Debug.Log("Chain break failed");
		return -1;
	}
	
	if (allocatedInSelected)
		inputList = inputBuilding.allocatedInputs;
	else
		inputList = inputBuilding.unallocatedInputs;
	
	// check whether resource is valid
	if (usedOptionalOutput)
	{
		if (outputBuilding.optionalOutput == resourceName //&& !outputBuilding.optionalOutputAllocated
			&& inputList.Contains(resourceName))
			hasResource = true;
			Debug.Log("used optional");
	}
	else
	{
		if (inputList.Contains(resourceName) && outputBuilding.allocatedOutputs[selectedOutIndex] == resourceName)
			hasResource = true;
	}
	
	// if resource is valid
	if (hasResource)
	{
		var tempFoundIndex : int;
		var tempIcon : ResourceIcon;
		
		// move the resource from the inputs unallocated list to allocated list
		if (!allocatedInSelected)
		{
		    inputBuilding.allocatedInputs.Add(resourceName);
		    tempFoundIndex = inputBuilding.unallocatedInputs.IndexOf(resourceName);
			inputBuilding.unallocatedInputs.Remove(resourceName);
			inputBuilding.inputLinkedTo.Add(outputBuildingIndex); // add the link to the input building
			
			tempIcon = inputBuilding.unallocatedInputIcons[tempFoundIndex];
			inputBuilding.unallocatedInputIcons.Remove(tempIcon);
			tempIcon.SetAllocated(true);
			inputBuilding.allocatedInputIcons.Add(tempIcon);
			tempIcon.SetIndex(inputBuilding.allocatedInputIcons.Count - 1);
		}
	    
	    // swap the resource from the allocated list back into the unallocated list of the old input building
	    // and remove the link.  Deactivate the chain of all output linked buildings
	    var oldInIndex : int = oldInputBuilding.inputLinkedTo.IndexOf(outputBuildingIndex);
	    oldInputBuilding.unallocatedInputs.Add(resourceName);
	    oldInputBuilding.allocatedInputs.RemoveAt(oldInIndex);
	    oldInputBuilding.inputLinkedTo.RemoveAt(oldInIndex);
	    if (usedOptionalOutput)
	    	DeactivateChain(outputBuilding.optionalOutputLinkedTo, -1);
	    else
	    	DeactivateChain(outputBuilding.outputLinkedTo[selectedOutIndex], -1);
	    
	    tempIcon = oldInputBuilding.allocatedInputIcons[oldInIndex];
	    oldInputBuilding.allocatedInputIcons.Remove(tempIcon);
	    tempIcon.SetAllocated(false);
	    oldInputBuilding.unallocatedInputIcons.Add(tempIcon);
	    tempIcon.SetIndex(oldInputBuilding.unallocatedInputIcons.Count - 1);
	    
		//outputBuilding.outputLinkedTo[selectedOutIndex] = inputBuildingIndex; // swap in the new input building index for the output's links
		if (usedOptionalOutput)
		{
			outputBuilding.optionalOutputLinkedTo = inputBuildingIndex;
		}
		else
		{
			outputBuilding.allocatedOutputs.RemoveAt(selectedOutIndex);
			outputBuilding.allocatedOutputs.Add(resourceName);
			outputBuilding.outputLinkedTo.RemoveAt(selectedOutIndex);
			outputBuilding.outputLinkedTo.Add(inputBuildingIndex);
		}
		
		buildingsOnGrid[outputBuildingIndex] = outputBuilding;
		buildingsOnGrid[inputBuildingIndex] = inputBuilding;
		activateBuilding(inputBuildingIndex, true);
		Debug.Log("End of link chain break");
		
		//Stores links into list organized by when they were created	
		var tempNode : LinkTurnNode = new LinkTurnNode();
		tempNode.b1 = inputBuilding.buildingPointer;
		tempNode.b1Coord = inputBuilding.coordinate;
		tempNode.b2 = outputBuilding.buildingPointer;
		tempNode.b2Coord = outputBuilding.coordinate;
		tempNode.b3 = oldInputBuilding.buildingPointer;
		tempNode.b3Coord = oldInputBuilding.coordinate;
		tempNode.turnCreated = intelSystem.currentTurn + 1;
		tempNode.type = resourceName;
		tempNode.usedOptionalOutput = usedOptionalOutput;		
		if(allocatedInSelected)
			tempNode.OverloadChainBreak = true;		
		
		linkList.Add(tempNode);						
		
		//Debug.Log("Index used for deactivate: " + outputBuildingIndex);
		if(inputBuilding.deactivatedInputs.Contains(inputBuilding.inputLinkedTo.IndexOf(outputBuildingIndex)))
			inputBuilding.deactivatedInputs.Remove(inputBuilding.inputLinkedTo.IndexOf(outputBuildingIndex));
		
		
		UndoStack.Add(UndoType.Chain);
		
		//If the Chain Break was the result of an Overload/Chain Break combo: Do not add another turn
//		if(!allocatedInOutSelected)
		UnitManager.CheckUnitPathsBroken();
			intelSystem.addTurn();
			intelSystem.comboSystem.incrementComboCount();
			intelSystem.incrementScore(true, intelSystem.comboSystem.comboScoreBasePoints);
			//metrics.addLinkData(new LinkData("Link", intelSystem.currentTurn, findBuildingIndex(inputBuilding), inputBuilding.buildingName, findBuildingIndex(outputBuilding), outputBuilding.buildingName, -1, findBuildingIndex(oldInputBuilding)));
			//metrics.addLinkData(new LinkData("Link", intelSystem.currentTurn, inputBuilding.coordinate, inputBuilding.buildingName, outputBuilding.coordinate, outputBuilding.buildingName, new Vector3(-100,0,0), oldInputBuilding.coordinate));
			//Save("Chainbreak");

	}
	
	if (hasResource)
		return oldInputBuildingIndex;//hasResource;
	Debug.Log("Chain break failed");
	return -1;
}

public function DeactivateLink(buildingIndex : int, linkedToIndex : int)
{
	drawLinks.SetLinkTexture(buildingIndex, linkedToIndex, false);
	DeactivateChain(linkedToIndex, buildingIndex);
}

// Recursively deactivates all of the buildings in the chain of output links
public function DeactivateChain (buildingIndex : int, parentIndex : int)
{
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	// if the building is active, deactivate it
	if (building.isActive)
		toggleActiveness(buildingIndex);
	SetBuildingResourceActive(building.unallocatedInputIcons, false);
    SetBuildingResourceActive(building.unallocatedOutputIcons, false);
    SetBuildingResourceActive(building.allocatedInputIcons, false);
    SetBuildingResourceActive(building.allocatedOutputIcons, false);
    building.indicator.SetState(IndicatorState.Neutral);
    if (building.optionalOutputIcon)
    	building.optionalOutputIcon.SetActive(false);
	if (parentIndex >= 0)
	{
	
	
		/*
		Debug.Log("Building " + building.buildingName + " with Index " + findBuildingIndex(building) + "\n" +
				 "Parent " + buildingsOnGrid[parentIndex].buildingName +  "\n" + 
				 "Deactivation Code: " + building.inputLinkedTo.IndexOf(parentIndex));
				 
		if(building.inputLinkedTo.IndexOf(parentIndex) < 0)
		{
			Debug.LogError("Parent Index less than 0...printing contents of inputLinkedTo for " + building.buildingName);
			printOutIntLists(building.inputLinkedTo, true);
		}
		*/
		
		// If it is -1, it technically didn't find it in the inputLinkedTo, most likely due to the fact the input has been redirected
		if(building.inputLinkedTo.IndexOf(parentIndex) >= 0)
		{
			building.deactivatedInputs.Add(building.inputLinkedTo.IndexOf(parentIndex));
			Debug.Log(findBuildingIndex(building) + ": " +  building.buildingName + " deactivated output to " + parentIndex + ", with value of " + building.inputLinkedTo.IndexOf(parentIndex));
		}
		
	}
	// change all output links' colors to reflect deactivation
	for (var i : int in building.outputLinkedTo)
	{
		//DrawLinks.SetLinkColor(buildingIndex, i, Color.gray);
		if (!buildingsOnGrid[i].deactivatedInputs.Contains(buildingsOnGrid[i].inputLinkedTo.IndexOf(buildingIndex)))
		{
			drawLinks.SetLinkTexture(buildingIndex, i, false);
			DeactivateChain(i, buildingIndex);
		}
	}
	Debug.Log("Deactivate Chain");
	UnitManager.CheckUnitsActive();
}



// Function seems to only be used for the undo function, to add a link that may have been removed.
function AddLink(inputBuilding : BuildingOnGrid, outputBuilding : BuildingOnGrid, lastIndex : int)
{
	//var linkUIRef : LinkUI = GameObject.FindWithTag("MainCamera").GetComponent(LinkUI);				
	var tempFoundIndex : int;
	var tempIcon : ResourceIcon;
					
	if(outputBuilding.optionalOutput == linkList[lastIndex].type && 
				outputBuilding.optionalOutputAllocated == false &&
				outputBuilding.optionalOutputLinkedTo == -1)
	{
		outputBuilding.optionalOutputAllocated = true;
		outputBuilding.optionalOutputLinkedTo = findBuildingIndex(inputBuilding);
		outputBuilding.optionalOutputIcon.SetAllocated(true);	
	}
	else
	{
		tempFoundIndex = outputBuilding.unallocatedOutputs.IndexOf(linkList[lastIndex].type);
		outputBuilding.unallocatedOutputs.Remove(linkList[lastIndex].type);	
		outputBuilding.allocatedOutputs.Add(linkList[lastIndex].type);
		outputBuilding.outputLinkedTo.Add(findBuildingIndex(inputBuilding));
		
		tempIcon = outputBuilding.unallocatedOutputIcons[tempFoundIndex];
		outputBuilding.unallocatedOutputIcons.Remove(tempIcon);
		tempIcon.SetAllocated(true);
		outputBuilding.allocatedOutputIcons.Add(tempIcon);
		tempIcon.SetIndex(outputBuilding.allocatedOutputIcons.Count - 1);
	}
	tempFoundIndex = inputBuilding.unallocatedInputs.IndexOf(linkList[lastIndex].type);
	//Link B1 to B3
	inputBuilding.unallocatedInputs.Remove(linkList[lastIndex].type);	
	//outputBuilding.unallocatedOutputs.Remove(linkList[lastIndex].type);	
	
	inputBuilding.allocatedInputs.Add(linkList[lastIndex].type);
	//outputBuilding.allocatedOutputs.Add(linkList[lastIndex].type);
	
	inputBuilding.inputLinkedTo.Add(findBuildingIndex(outputBuilding));
	//outputBuilding.outputLinkedTo.Add(findBuildingIndex(inputBuilding));
	
	tempIcon = inputBuilding.unallocatedInputIcons[tempFoundIndex];
	inputBuilding.unallocatedInputIcons.Remove(tempIcon);
	tempIcon.SetAllocated(true);
	inputBuilding.allocatedInputIcons.Add(tempIcon);
	tempIcon.SetIndex(inputBuilding.allocatedInputIcons.Count - 1);
	
	linkUIRef.linkReference[findBuildingIndex(inputBuilding), findBuildingIndex(outputBuilding)] = true;		
	//Draw New Link
	GameObject.FindWithTag("MainCamera").GetComponent(DrawLinks).CreateLinkDraw(findBuildingIndex(inputBuilding), findBuildingIndex(outputBuilding), linkList[lastIndex].type);
}



//*******************************************
// [Building Activation Functions] **********

/*

activateBuilding, when given an index, checks to make sure
the building has no more input requirements, and then sets
the variable isActive to true if so.

*/
public function activateBuilding( buildingIndex:int, checkUnits : boolean ): boolean
{
	var canActivate = true;
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	// only activate if building has no unallocated or deactivated inputs
	if(building.unallocatedInputs.Count > 0 || building.deactivatedInputs.Count > 0)
	//if(building.unallocatedInputs.Count > 0 )
	{
		canActivate = false;
		//Debug.Log(buildingIndex + " failed activate of " + building.buildingName + " " + building.unallocatedInputs.Count + " " + building.deactivatedInputs.Count);
	}
    
    building.isActive = canActivate;
    // if building is activated and has an event, activate the event
    if (building.isActive && building.hasEvent)
    	intelSystem.buildingActivated(building.buildingPointer);
    if(building.isActive && building.unit != UnitType.None)
    {
    	intelSystem.incrementScore(true, buildingWithUnitActivatedScore);
    	Debug.Log("A Building has been activated with a Unit");
    }
    //buildingsOnGrid[buildingIndex] = building;
    // if building has been activated
    if (building.isActive)
    {
    	//SetBuildingResourceActive(building.unallocatedInputIcons, true);
    	SetBuildingResourceActive(building.unallocatedOutputIcons, true);
    	SetBuildingResourceActive(building.allocatedInputIcons, false);
    	SetBuildingResourceActive(building.allocatedOutputIcons, false);
    	
    	if (building.indicator)
    		building.indicator.SetState(IndicatorState.Active);
    	/*if (building.optionalOutputIcon)
    		building.optionalOutputIcon.SetActive(true);*/
    	for(var outLink : int in building.outputLinkedTo)
    	{
    		var outLinkBuilding : BuildingOnGrid = buildingsOnGrid[outLink];
    		if (!outLinkBuilding.isActive)
    		{
	    		var outLinkInputIndex = outLinkBuilding.inputLinkedTo.IndexOf(buildingIndex);
	    		// reactivate its output links
	    		if (outLinkInputIndex >= 0 && outLinkBuilding.deactivatedInputs.Contains(outLinkInputIndex))
	    		{
	    			outLinkBuilding.deactivatedInputs.Remove(outLinkInputIndex);
	    			//DrawLinks.SetLinkColor(buildingIndex, outLink, true);
	    			drawLinks.SetLinkTexture(buildingIndex, outLink, true);
	    		}
	    		// attempt to recursively reactivate the chain
				activateBuilding(outLink, true);
			}
    	}
    	if (building.optionalOutputLinkedTo >= 0)
    	{
    		outLinkBuilding = buildingsOnGrid[building.optionalOutputLinkedTo];
    		if (!outLinkBuilding.isActive)
    		{
	    		outLinkInputIndex = outLinkBuilding.inputLinkedTo.IndexOf(buildingIndex);
	    		// reactivate its output links
	    		if (outLinkInputIndex >= 0 && outLinkBuilding.deactivatedInputs.Contains(outLinkInputIndex))
	    		{
	    			outLinkBuilding.deactivatedInputs.Remove(outLinkInputIndex);
	    			//DrawLinks.SetLinkColor(buildingIndex, outLink, true);
	    			drawLinks.SetLinkTexture(buildingIndex, building.optionalOutputLinkedTo, true);
	    		}
	    		// attempt to recursively reactivate the chain
				activateBuilding(building.optionalOutputLinkedTo, true);
			}
    	}
    	
    	CheckBuildingActiveTrigger(building);
    }
    else
    {
    	SetBuildingResourceActive(building.unallocatedInputIcons, false);
    	SetBuildingResourceActive(building.unallocatedOutputIcons, false);
    	SetBuildingResourceActive(building.allocatedInputIcons, false);
    	SetBuildingResourceActive(building.allocatedOutputIcons, false);
    	building.indicator.SetState(IndicatorState.Neutral);
    	/*if (building.optionalOutputIcon)
    		building.optionalOutputIcon.SetActive(false);*/
    }
    if (checkUnits)
    	UnitManager.CheckUnitsActive();
    return canActivate;
}

private function SetBuildingResourceActive(iconSet : List.<ResourceIcon>, active : boolean)
{
	for (var i : int = 0; i < iconSet.Count; i++)
		iconSet[i].SetActive(active);
}

private function CheckBuildingActiveTrigger(building : BuildingOnGrid)
{
	if (building.isActive && building.hasTooltipTrigger)
	{
		/*if (building.tooltipPic != null)
			display.Activate(building.tooltipPic, building.tooltipText);
		else
			display.Activate(building.tooltipText);*/
		for (var i : int = 0; i < building.tooltip.length; i++)
			display.Activate(building.tooltip[i], null);
	}
}


/*

Can be used for special cases where a building may be deactivated
despite having the required input amounts.

*/
static public function toggleActiveness( buildingIndex:int )
{
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	building.isActive = !building.isActive;
    buildingsOnGrid[buildingIndex] = building;
	
}

/*

Used to check if a particular building at a given index is active

*/
static public function isActive( buildingIndex:int ): boolean
{
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	return building.isActive;	
}


//*******************************************
// [Building Site Functions] ****************


/*
Used to add a building to the grid that replaces another building (e.g., building sites)
*/
static public function ReplaceBuildingOnGrid(buildingObject: GameObject, coord : Vector3, index : int)
{
	var temp = new BuildingOnGrid();
	/*
	if(ModeController.getCurrentMode() == GameState.LINK)
	{
		ModeController.selectedBuilding = null;
	    return;
	}
	*/
	Debug.Log("adding " + buildingObject.name + " to grid at " + coord);

	var tempBuilding : BuildingOnGrid = new BuildingOnGrid();
	var tempBuildingData : BuildingData = buildingObject.GetComponent(BuildingData);
	//tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
	tempBuilding = tempBuildingData.convertBuildingOnGridDataIntoBuildingOnGrid();
	tempBuilding.coordinate = coord;
	tempBuilding.buildingPointer = buildingObject;
	tempBuilding.highlighter = grid.CreateHighlightHexagon(tempBuilding.coordinate);
	buildingsOnGrid[index] = tempBuilding;
	//buildingsOnGrid.Add(tempBuilding);
	BroadcastBuildingUpdate(buildingObject, index);
	
	if(findBuildingIndex(tempBuilding.coordinate) != -1)
	{
		Debug.Log("Coord: " + tempBuilding.coordinate);
		Debug.Log("Index: " + findBuildingIndex(tempBuilding.coordinate));
		Debug.Log(tempBuilding.buildingName + " was added to the grid");
	}
	else
	{
		Debug.Log("Error, building not added...");
	}
}


//This function is used to add a building to the grid, replacing a building site
static public function ReplaceBuildingSite (buildingObject: GameObject, coord : Vector3)
{
	var buildingSiteID : int = findBuildingIndex( coord );	// find location in array of buildings
	var temp = new BuildingOnGrid();
	/*
	if(ModeController.getCurrentMode() == GameState.LINK)
	{
		ModeController.selectedBuilding = null;
	    return;
	}
	*/
	//Debug.Log("adding " + buildingObject.name + " to grid at " + coord + " id " + buildingSiteID);

	var tempBuilding : BuildingOnGrid = new BuildingOnGrid();
	var tempBuildingData : BuildingData = buildingObject.GetComponent(BuildingData);
	//tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
	tempBuilding = tempBuildingData.convertBuildingOnGridDataIntoBuildingOnGrid();
	tempBuilding.coordinate = coord;
	tempBuilding.buildingPointer = buildingObject;
	tempBuilding.highlighter = getBuildingOnGridAtIndex(buildingSiteID).highlighter;
	tempBuilding.indicator = buildingObject.GetComponentInChildren(BuildingIndicator);
	tempBuilding.indicator.SetState(IndicatorState.Neutral);
	linkUIRef.GenerateBuildingResourceIcons(tempBuilding);
	buildingsOnGrid[buildingSiteID] = tempBuilding;
	//buildingsOnGrid.Splice(buildingSiteID, 1, tempBuilding);
	BroadcastBuildingUpdate(buildingObject, buildingSiteID);
}

// This function will properly add a building site to the database
static public function addBuildingSite( coordinate : Vector3, index : int)
{
	//var index : int = findBuildingIndex(coordinate);
	var addIndex : int = addList.Count - 1;		
	var tileType : String = addList[addIndex].buildingSite.tileType;	
	var isPreplaced : boolean = false;
	var idea : String = addList[addIndex].buildingSite.idea;
	var hasEvent : boolean = addList[addIndex].buildingSite.hasEvent;
	
	var building : GameObject = Instantiate(Resources.Load("BuildingSite"));	
	building.transform.position = addList[addIndex].worldCoordinates;
	building.name = "BuildingSite";
	//buildingsOnGrid[index] = building;
	ReplaceBuildingOnGrid(building, coordinate, index);
	ModeController.setSelectedBuilding(building);
	//addBuildingToGrid(building, coordinate);
	//addBuildingToGrid("BuildingSite", coordinate, tileType, building, isPreplaced, idea, hasEvent);
	//BroadcastBuildingUpdate();
	
} // End of addBuildingSite()

//*******************************************
// [Undo Functions] *************************



// Function called if the player presses undo action OR if the player
// Makes a link that would deactivate the outputting building.
// Returns true if undo was successful, false if there is nothing to undo.
function undo(): boolean
{
	if(intelSystem.currentTurn != 0)
	{
		switch(UndoStack[UndoStack.Count - 1])
		{
			case UndoType.Link:
				//Debug.Log("This is a Link Undo");
				UndoLink(0);				
				break;
			case UndoType.Add:
				//Debug.Log("This is a Add Undo");
				UndoAdd();
				break;
			case UndoType.Chain:
				//Debug.Log("This is a Chain Undo");
				UndoLink(1);								
				break;
			case UndoType.Overload:
				//Debug.Log("This is an Overload Undo");
				UndoLink(2);				
				break;	
			default:
				break;
		}				
		UndoStack.RemoveAt(UndoStack.Count - 1);
		return true;
				
	}
	else
	{		
		Debug.Log("You cannot undo any more!");
		return false;
	}

}// end of undo()

//typeOfUndo : int
//0 = Normal Link
//1 = Chain Break
//2 = Overload
function UndoLink(typeOfUndo : int)
{
	var lastIndex : int = linkList.Count - 1;
	
	var tempIcon : ResourceIcon;
	
	//var linkUIRef : LinkUI = GameObject.FindWithTag("MainCamera").GetComponent(LinkUI);													
		
	var b1Building : BuildingOnGrid = getBuildingOnGrid(linkList[lastIndex].b1Coord);
	var b2Building : BuildingOnGrid = getBuildingOnGrid(linkList[lastIndex].b2Coord);
	
	//Undo Previous Link
	b1Building.unallocatedInputs.Add(linkList[lastIndex].type);			
	b1Building.allocatedInputs.RemoveAt(b1Building.allocatedInputs.Count - 1);	
	b1Building.inputLinkedTo.RemoveAt(b1Building.inputLinkedTo.Count - 1);	
	
	tempIcon = b1Building.allocatedInputIcons[b1Building.allocatedInputIcons.Count - 1];
	b1Building.allocatedInputIcons.Remove(tempIcon);
	tempIcon.SetAllocated(false);
	b1Building.unallocatedInputIcons.Add(tempIcon);
	tempIcon.SetIndex(b1Building.unallocatedInputIcons.Count - 1);
	
	//Undo Optional Output
	if(linkList[lastIndex].usedOptionalOutput)
	{
		var optionalOutputLinkedTo : int = -1;
		
		b2Building.optionalOutput = linkList[lastIndex].type;
		b2Building.optionalOutputAllocated = false;
		b2Building.optionalOutputLinkedTo = -1;
		b2Building.optionalOutputIcon.SetAllocated(false);
	}
	//Undo Normal Output
	else
	{
		b2Building.unallocatedOutputs.Add(linkList[lastIndex].type);    
		b2Building.allocatedOutputs.RemoveAt(b2Building.allocatedOutputs.Count - 1);
		b2Building.outputLinkedTo.RemoveAt(b2Building.outputLinkedTo.Count - 1);
		
		tempIcon = b2Building.allocatedOutputIcons[b2Building.allocatedOutputIcons.Count - 1];
		b2Building.allocatedOutputIcons.Remove(tempIcon);
		tempIcon.SetAllocated(false);
		b2Building.unallocatedOutputIcons.Add(tempIcon);
		tempIcon.SetIndex(b2Building.unallocatedOutputIcons.Count - 1);
		SetBuildingResourceActive(b2Building.unallocatedOutputIcons, true);
	}
	
	linkUIRef.removeLink(linkList[lastIndex].b1, linkList[lastIndex].b2);
	
	var b3Building : BuildingOnGrid;
	
	if(typeOfUndo != 0)
	{
		b3Building = getBuildingOnGrid(linkList[lastIndex].b3Coord);
	}
	
	var outputBuildingIndex:int;
		
	switch(typeOfUndo)
	{		
		case 1: // Chain Break
			//Link B3 and B2
			AddLink(b3Building, b2Building, lastIndex);	
			
			
			//ADDED:
			outputBuildingIndex = findBuildingIndex (b2Building);
			if(b3Building.deactivatedInputs.Contains(b3Building.inputLinkedTo.IndexOf(outputBuildingIndex)))
				b3Building.deactivatedInputs.Remove(b3Building.inputLinkedTo.IndexOf(outputBuildingIndex));
			
			outputBuildingIndex = findBuildingIndex (b3Building);
			if(b2Building.deactivatedInputs.Contains(b2Building.inputLinkedTo.IndexOf(outputBuildingIndex)))
				b2Building.deactivatedInputs.Remove(b2Building.inputLinkedTo.IndexOf(outputBuildingIndex));
			
			
			//Activate chain
			activateBuilding(findBuildingIndex(b3Building), true);
			
			//If Overload-Chain Break
			if(linkList[lastIndex].OverloadChainBreak)
			{
				//Old Output
				var b4Building : BuildingOnGrid = getBuildingOnGrid(linkList[lastIndex - 1].b3Coord);		
				AddLink(b1Building, b4Building, lastIndex);
				
				
				//ADDED:
				outputBuildingIndex = findBuildingIndex (b4Building);
				if(b3Building.deactivatedInputs.Contains(b3Building.inputLinkedTo.IndexOf(outputBuildingIndex)))
					b3Building.deactivatedInputs.Remove(b3Building.inputLinkedTo.IndexOf(outputBuildingIndex));	
							
							
							
							
				linkList.RemoveAt(lastIndex - 1);
				lastIndex--;
				UndoStack.RemoveAt(UndoStack.Count - 2);
			}		
			break;
		case 2: // overload
			AddLink(b1Building, b3Building, lastIndex);		
			
			Debug.Log("undo overload");
			//ADDED:
			outputBuildingIndex = findBuildingIndex (b3Building);
			if(b1Building.deactivatedInputs.Contains(b1Building.inputLinkedTo.IndexOf(outputBuildingIndex)))
				b1Building.deactivatedInputs.Remove(b1Building.inputLinkedTo.IndexOf(outputBuildingIndex));	
				
			// if b1 and b2 were mutually linked, redraw the link that still remains
			var b1Index : int = findBuildingIndex(b1Building);
			var possibleInputIndex : int = b2Building.inputLinkedTo.IndexOf(b1Index);
			if (possibleInputIndex >= 0)
			{
				var b2Index : int = findBuildingIndex(b2Building);
				drawLinks.CreateLinkDraw(b1Index, b2Index, b2Building.allocatedInputs[possibleInputIndex]);
			}
			//activateBuilding(outputBuildingIndex, true);
			break;
		default: 
			break;
	
	}
	
	
	//Chain Break
	/*if(typeOfUndo == 1)
	{		
		//B1 is Input
		//B2 is Output
		//B3 is oldInput
		
		//Link B3 and B2
		AddLink(b3Building, b2Building, lastIndex);				
		
		//Activate chain
		activateBuilding(findBuildingIndex(b3Building));
		
		//If Overload-Chain Break
		if(linkList[lastIndex].OverloadChainBreak)
		{
			//Old Output
			var b4Building : BuildingOnGrid = getBuildingOnGrid(linkList[lastIndex - 1].b3Coord);		
			AddLink(b1Building, b4Building, lastIndex);
						
			linkList.RemoveAt(lastIndex - 1);
			lastIndex--;
			UndoStack.RemoveAt(UndoStack.Count - 2);
		}
	}
	//Overload
	else if(typeOfUndo == 2)
	{		
		//Link B1 and B3	
		AddLink(b1Building, b3Building, lastIndex);		
	}
	*/
	//Units
	if(b1Building.isActive)
	{
		activateBuilding(findBuildingIndex(b1Building), true);
		if(!b1Building.isActive)
		{
			if(b1Building.unit != UnitType.None)
			{
				intelSystem.decrementScore(true, buildingWithUnitActivatedScore);
			}
		}
	}
	
	//Removes the latest link
	linkList.RemoveAt(lastIndex);	
}

function UndoAdd()
{
	var lastIndex : int = addList.Count - 1;
	var buildingIndex : int = findBuildingIndex(getBuildingOnGrid(addList[lastIndex].buildingSite.coordinate));	
	var tempBuildingOnGrid : BuildingOnGrid = getBuildingOnGrid(addList[lastIndex].buildingSite.coordinate);
	DestroyResourceIconSet(tempBuildingOnGrid.allocatedInputIcons);
	DestroyResourceIconSet(tempBuildingOnGrid.unallocatedInputIcons);
	DestroyResourceIconSet(tempBuildingOnGrid.allocatedOutputIcons);
	DestroyResourceIconSet(tempBuildingOnGrid.unallocatedOutputIcons);
	var building : GameObject = tempBuildingOnGrid.buildingPointer;
	GameObject.DestroyImmediate(building);
	// Remove building from BuildingsOnGrid
	//buildingsOnGrid.RemoveAt(buildingIndex);//buildingsOnGrid.Splice(buildingIndex, 1);	
	
	// Add BuildingSite to BuildingsOnGrid
	addBuildingSite(addList[lastIndex].buildingSite.coordinate, buildingIndex);		
	
	//TODO: Add Element back to BuildingMenu.BuildingChoices
	
	//Remove element from the list
	var buildingMenuRef : BuildingMenu = GameObject.Find("GUI System").GetComponent(BuildingMenu);
	buildingMenuRef.AddBuildingAfterUndo();
	addList.RemoveAt(lastIndex);	
}

//Adds an element to the AddNodeList
static public function AddToAddList(coordinate: Vector3)
{
	var tempNode = new AddTurnNode();	
	tempNode.buildingSite = getBuildingOnGrid(coordinate);		
	tempNode.worldCoordinates = tempNode.buildingSite.buildingPointer.transform.position;
	addList.Add(tempNode);
	UndoStack.Add(UndoType.Add);
	intelSystem.addTurn();
	//Database.Save("BuildingSite");
}

private function DestroyResourceIconSet(iconSet : List.<ResourceIcon>)
{
	for (var i : int = 0; i < iconSet.Count; i++)
	{
		iconSet[i].Delete();
		DestroyImmediate(iconSet[i].gameObject);
	}
}


//*******************************************
// [Unit Functions] *********************

// Functions for adding/removing units to a building on the grid
// Has it for a UnitType or String, based upon the preference of other scripts
static public function addUnit( buildingIndex : int, unit : UnitType )
{
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	building.unit = unit;
}

static public function addUnit( buildingIndex : int, unit : String )
{
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	
	if(unit == "Worker")
		building.unit = UnitType.Worker;
	else if (unit == "Researcher")
		building.unit = UnitType.Researcher;
		/*
	else if (unit == "Regulator")
		building.unit = UnitType.Regulator;
	else if (unit == "EnergyAgent")
		building.unit = UnitType.EnergyAgent;
		*/
		
}

static public function removeUnit( buildingIndex : int)
{
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	building.unit = UnitType.None;
}


//*******************************************
// [Broadcast Functions] *********************

/* 
	BroadcastBuildingUpdate:

   This functionality is set in place so when the building is placed and added to grid, all game objects with the "UpdateBuildingCount" function,
   if it exists, will be sent the latest set of buildings from the same call. All that's needed to be done is to have an UpdateBuildingCount function
   with a gameObject array as a parameter and everything should be fine.
   
   Also, this can be refined later via tags so we can separate what we need to update for performance tweaking
*/

public static function BroadcastBuildingUpdate():void
{
	var gameObjInScene:GameObject[] = GameObject.FindObjectsOfType(typeof(GameObject)); //Gets all game objects in scene
	
	for(var i : int = 0; i < gameObjInScene.length; i++)//var gos:GameObject in gameObjInScene)
	{
		if(gameObjInScene[i].transform.parent == null)//gos.transform.parent == null)
		{
			gameObjInScene[i].gameObject.BroadcastMessage("UpdateBuildingCount", GameObject.FindGameObjectsWithTag("Building"), SendMessageOptions.DontRequireReceiver);//gos.gameObject.BroadcastMessage("UpdateBuildingCount", GameObject.FindGameObjectsWithTag("Building"), SendMessageOptions.DontRequireReceiver); //calls that function for all the children on the object, if it exists
		} 
	}
}

public static function BroadcastBuildingUpdate(buildingObject : GameObject, buildingIndex : int):void
{
	var gameObjInScene:GameObject[] = GameObject.FindObjectsOfType(typeof(GameObject)); //Gets all game objects in scene
	var replacement : BuildingReplacement = new BuildingReplacement(buildingObject, buildingIndex);
	for(var i : int = 0; i < gameObjInScene.length; i++)//var gos:GameObject in gameObjInScene)
	{
		if(gameObjInScene[i].transform.parent == null)//gos.transform.parent == null)
		{
			gameObjInScene[i].gameObject.BroadcastMessage("ReplaceBuilding", replacement, SendMessageOptions.DontRequireReceiver);//gos.gameObject.BroadcastMessage("ReplaceBuilding", replacement, SendMessageOptions.DontRequireReceiver); //calls that function for all the children on the object, if it exists
		} 
	}
}


//*******************************************
// [Metric and Serialization Functions] *****


public function Save(type : String) : void
{
	metrics.Turns.Add(new TurnData("Turn Data", intelSystem.currentTurn, intelSystem.numOfObjectivesLeft, type));	
}



public static function GenerateID() : String{
	return (String.Format("{0:00}-{1:000}-{2:0000}",  Random.Range(0, 99), Random.Range(0, 999), Random.Range(0, 9999)));
}

public function WriteLevel()
{
	var building_objects : GameObject[] = GameObject.FindGameObjectsWithTag("Building");
	
	for(var i : int = 0; i < building_objects.Length; i++)
	{
		var bldgO : BuildingData = building_objects[i].GetComponent("BuildingData");
		var b : BuildingSerialData = new BuildingSerialData();
		
		b.Name = building_objects[i].name;
		b.Location = building_objects[i].transform.position;
		b.Inputs = bldgO.buildingData.unallocatedInputs;
		b.Outputs = bldgO.buildingData.unallocatedOutputs;
		b.OptionalOutput = bldgO.buildingData.optionalOutput; 
		b.Active = bldgO.buildingData.isActive;
		
		if(bldgO.buildingData.hasEvent)
		{	
			var event : EventScript = building_objects[i].GetComponent("EventScript");
			var e : EventSerialData = new EventSerialData();
			//e.Name = event.event.name;;
			//e.Title = event.event.title;
			//e.Description = event.event.description;
			e.Type = event.event.type;
			e.Turns = event.event.time;
			e.Points = event.event.points;
			e.Location = b.Location;
			
			level_s.Events.Add(e);
		}
		
		level_s.Buildings.Add(b);
	}
	
	var unit_objects : GameObject[] = GameObject.FindGameObjectsWithTag("Unit");
	for(var j : int = 0; j < unit_objects.Length; j++)
	{
		var name : String = unit_objects[j].name;
		var unit;
		var u : UnitSerialData = new UnitSerialData();	
		switch(name)
		{
			case "Worker2D":
				u.Type = UnitType.Worker;
				unit = unit_objects[j].GetComponent("WorkerUnit");
				break;
			case "Researcher2D":
				u.Type = UnitType.Researcher;
				unit = unit_objects[j].GetComponent("ResearcherUnit");
				break;
			default:
				break;
		}
		u.Location = unit_objects[j].transform.position;
		level_s.Units.Add(u);
	}
	
	//level_s.Save(Application.persistentDataPath + "/LevelData.xml");
	//Debug.Log("Writing Level To: " + Application.persistentDataPath + "/LevelData.xml");
}


//*******************************************
// [Potentially Obsolete Functions] *********

/*
This script only seems relevant to the editor
See BuildingMenu.js script, only usage is in EditorPlace(index : int) function.
*/
static public function addBuildingToGrid(buildingObject: GameObject, coord : Vector3)
{
	var temp = new BuildingOnGrid();
	/*
	if(ModeController.getCurrentMode() == GameState.LINK)
	{
		ModeController.selectedBuilding = null;
	    return;
	}
	*/
	Debug.Log("adding " + buildingObject.name + " to grid at " + coord);

	var tempBuilding : BuildingOnGrid = new BuildingOnGrid();
	var tempBuildingData : BuildingData = buildingObject.GetComponent(BuildingData);
	//tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
	tempBuilding = tempBuildingData.convertBuildingOnGridDataIntoBuildingOnGrid();
	tempBuilding.coordinate = coord;
	tempBuilding.buildingPointer = buildingObject;
	tempBuilding.highlighter = grid.CreateHighlightHexagon(tempBuilding.coordinate);
	buildingsOnGrid.Add(tempBuilding);
	BroadcastBuildingUpdate();
	
	if(findBuildingIndex(tempBuilding.coordinate) != -1)
	{
		Debug.Log("Coord: " + tempBuilding.coordinate);
		Debug.Log("Index: " + findBuildingIndex(tempBuilding.coordinate));
		Debug.Log(tempBuilding.buildingName + " was added to the grid");
	}
	else
	{
		Debug.Log("Error, building not added...");
	}
}


//*********************************************************************************************************************
// [Classes] **********************************************************************************************************


/* 	BuildingOnGridData Class

	This is the class that is in the BuildingData script, attached to all buildings.
  	Level Designers are editing this data when they edit the BuildingData component.
*/
class BuildingOnGridData
{
	var buildingName = "nameOfBuilding";
	
	var unallocatedInputs : ResourceType[];
	var unallocatedOutputs : ResourceType[];
	
	var optionalOutput : ResourceType;
	
	var premadeLinks : GameObject[];
	
	var isActive : boolean = false;
	
	var coordinate : Vector3 = new Vector3(0,0,0);
	var tileType = "tileType";
	var buildingPointer: GameObject;
	
	var heldUpgrade : UpgradeID;
	var heldUpgradeTooltip : Tooltip;
	
	var requisitionCost : int;
	var pollutionOutput : int;
	var unit : UnitType = UnitType.None;
	var idea : String = "";
	var hasEvent : boolean = false;
	
	var tooltip : Tooltip[];
	
	var hasTooltipTrigger : boolean = false;
	var isPriorityTooltip : boolean = false;
}// end of BuildingOnGridData

/*
BuildingOnGrid Class

This class contains the information about buildings
that the database actually handles, and contains
more information needed during the game.

Might be wise to eventually merge this with BuildingOnGridData
and keep what the designers shouldn't edit private and create get/set methods

*/


class BuildingOnGrid
{

	var buildingName = "nameOfBuilding";

	var unallocatedInputs : List.<ResourceType> = new List.<ResourceType>();
	var unallocatedInputIcons : List.<ResourceIcon> = new List.<ResourceIcon>();
	var allocatedInputs : List.<ResourceType> = new List.<ResourceType>();
	var allocatedInputIcons : List.<ResourceIcon> = new List.<ResourceIcon>();
	
	var unallocatedOutputs : List.<ResourceType> = new List.<ResourceType>();
	var unallocatedOutputIcons : List.<ResourceIcon> = new List.<ResourceIcon>();
	var allocatedOutputs : List.<ResourceType> = new List.<ResourceType>();
	var allocatedOutputIcons : List.<ResourceIcon> = new List.<ResourceIcon>();
	
	var optionalOutput : ResourceType = ResourceType.None;
	var optionalOutputAllocated : boolean = false;
	var optionalOutputFixed : boolean = false;
	var optionalOutputIcon : ResourceIcon;
	
	var premadeLinks : GameObject[];
	
	var isActive = false;
	
	var coordinate : Vector3 = new Vector3(0,0,0);
	var tileType = "tileType";
	var buildingPointer: GameObject;
	
	// will contain an array of the buildings it is connected to, by index of the building in the array
	var inputLinkedTo : List.<int> = new List.<int>();
	var deactivatedInputs : List.<int> = new List.<int>();
	var outputLinkedTo : List.<int> = new List.<int>();
	var optionalOutputLinkedTo : int = -1;
	
	var requisitionCost : int;
	
	var pollutionOutput : int;
	var linkCount : int = 0; // How many links are currently on the building
	
	var unit : UnitType = UnitType.None;
	var units : List.<Unit> = new List.<Unit>();
	var selectedUnitIndex : int = 0;
	var unitSelected : boolean = false;
	
	var idea : String = "";		// "Upgrade available if a Researcher is placed on this building" (will search through a list of upgrades to identify what this means)
	
	var hasEvent : boolean = false;	// (will search through a list of upgrades to identify what this means)
	
	// Unit pathing variables
	var pathParent : BuildingOnGrid = null;
	var pathParentDist : float = -1;
	
	var heldUpgradeID : UpgradeID;
	var heldUpgradeTooltip : Tooltip;
	/*var heldUpgradeTooltipText : String;
	var heldUpgradeTooltipPic : Texture2D;*/
	//var neededUpgrade : UpgradeType = UpgradeType.None;
	
	var highlighter : GameObject;
	var indicator : BuildingIndicator;
	
	var tooltip : Tooltip[];
	var hasTooltipTrigger : boolean = false;
	/*var tooltipText : String;
	var tooltipPic : Texture2D;*/
}

// This class contains information stored about a particular turn
// that involves linking.
class LinkTurnNode
{
	var b1: GameObject;
	var b2: GameObject;
	var b3: GameObject;
	var b1Coord: Vector3 = new Vector3(0,0,0);
	var b2Coord: Vector3 = new Vector3(0,0,0);
	var b3Coord: Vector3 = new Vector3(0,0,0);
	var turnCreated: int;
	var type: ResourceType;
	var OverloadChainBreak : boolean = false; // True only if this turn was both a Chain Break and Overload
	var usedOptionalOutput : boolean = false; // True only if this turn used an optional output	
}

// This class contains information about a particular turn
// that involves addin a building to the grid via a building site.
class AddTurnNode
{
	var buildingSite: BuildingOnGrid;
	var worldCoordinates: Vector3;
}

// Used by broadcast function
class BuildingReplacement extends System.ValueType
{
	var buildingObject : GameObject;
	var buildingIndex : int;
	
	public function BuildingReplacement (bO : GameObject, bI : int)
	{
		buildingObject = bO;
		buildingIndex = bI;
	}
}

//*********************************************************************************************************************
// [Enums] ************************************************************************************************************

// Types of resources
enum ResourceType
{
	None,
	Coal,
	Fund,
	Gas,
	Petrol,
	Power,
	Waste,
	Ethanol,
	Uranium,
	Knowledge,
	Workforce,
	Commerce
}

// Types of undos that exist
enum UndoType
{
	Link = 0,
	Add = 1,
	Wait = 2,
	Chain = 3,
	Overload = 4,
	ChainOverload = 5
}

// From Design Document, 3.3 Units
// Commented Regulator and EnergyAgent for now,
// since not in use
enum UnitType
{
	None = 0,
	Worker = 1,
	Researcher = 2,
	//Regulator = 3,
	//EnergyAgent = 4
}