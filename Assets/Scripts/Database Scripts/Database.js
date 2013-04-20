/*
Database.js
By Katharine Uvick

This script will be used to store data of the different specific buildings
involved in the game, as well as the buildings currently placed on the grid.
It also contains the scripts to alter the data (to link buildings, add them to
the grid, etc.)

It uses a series of arrays to store the data in order to keep the information
organized and flexible, rather than a fixed matrix or 2d array that would need
to be detailed on what each column and row represented.

Also contains undo functionality.

UPDATE REMINDER: See DefaultBuildingEditor to change the values of the default
buildings.


Attach to a blank GameObject
*/

#pragma strict

// The two main structures for holding data:
	// Default buildings stored here:
static public var buildings : Array;// = new Array();

	// Buildings on grid stored here:
static public var buildingsOnGrid : Array;// = new Array(); 


	// The amount of tiles a building has in range, can be specific to building later on
static public var TILE_RANGE = 3;


//Undo-related variables:
static public var UndoStack : List.<UndoType>;
//List holding information pertaining to links. When they were created, and which building they are attached to.
static public var linkList: List.<LinkTurnNode>;
//List holding information pertaining to adds. A reference to the building site, as well as the object that replaced it.
static public var addList: List.<AddTurnNode>;

	// Keeps track of the moves and indexes of placed buildings so they can be removed:
static private var previousBuildings = new Array();
		//For use if we want to limit the number of undos:
			// Current number of times undos the user is capable of (how many changes to grid have been made)
static private var numberOfUndos = 0;
			// This will allow for a limited number of undos
static public var undoLimit = 3;
			// Whether or not the player is allowed an unlimited number of undos
static public var limitedUndos = false;
	//*************************************************************************************************



static var gridObject:GameObject;
static var grid:HexagonGrid;


static var defaultBuildingScript : DefaultBuildings;

static var intelSystem : IntelSystem;

private var drawLinks : DrawLinks;
private var buildingWithUnitActivatedScore : int = 20;

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
	Uranium
}

enum UndoType
{
	Link = 0,
	Add = 1,
	Wait = 2,
	Chain = 3,
	Overload = 4,
	ChainOverload = 5
}

function Start()
{
	DontDestroyOnLoad (gameObject);	// So the Database will carry over to the score page
	
	
	// Telling the GUISystem to get the references to scripts specific to the level:
	var manager : GUIManager = GameObject.Find("GUI System").GetComponent(GUIManager);
	manager.LoadLevelReferences();
	var mainMenu : MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
	mainMenu.LoadLevelReferences();
	var buildMenu : BuildingMenu = GameObject.Find("GUI System").GetComponent(BuildingMenu);
	buildMenu.LoadLevelReferences();	
	
	drawLinks = GameObject.Find("Main Camera").GetComponent(DrawLinks);
	
	gridObject = GameObject.Find("HexagonGrid");
	grid = gridObject.GetComponent(HexagonGrid);
	
	buildings = new Array();
	buildingsOnGrid = new Array();
	defaultBuildingScript = gameObject.GetComponent(DefaultBuildings);
	var tempBuildingData : BuildingData;
	var tempBuilding : BuildingOnGrid;
	
	buildings = defaultBuildingScript.createDefaultBuildingArray();

	for (var buildingObject : GameObject in GameObject.FindGameObjectsWithTag("Building"))
	{
		tempBuilding = new BuildingOnGrid();
		tempBuildingData = buildingObject.GetComponent(BuildingData);
		tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
		// create the building's highlight hexagon
		tempBuilding.highlighter = grid.CreateHighlightHexagon(tempBuilding.coordinate);
		buildingsOnGrid.Push(tempBuilding);
		BroadcastBuildingUpdate();
		
		Debug.Log(tempBuilding.buildingName + " was added to the grid at " + tempBuilding.coordinate.x + "," + tempBuilding.coordinate.y);
	}
	
	//UnitManager.InitiateUnits();
	intelSystem = gameObject.GetComponent(IntelSystem);
	linkList = new List.<LinkTurnNode>();
	addList = new List.<AddTurnNode>();
	UndoStack = new List.<UndoType>();
}


/*
Since there are no more default buildings, this script will add a building as is
to the building menu. There is no undo functionality yet, since that will involve
re-placing the building site.

This will place the building at the building site's index
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
	tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
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

/*
The addingBuildingToGrid function adds a building to the
buildingsOnGrid array, representing it has been placed on
the grid, based on a given building type name, coordinate,
and the tile type.

*/
static public function addBuildingToGrid(buildingType:String, coordinate:Vector3, tileType:String, building:GameObject, isPreplaced: boolean, idea:String, hasEvent:boolean) : boolean
{
	var temp = new BuildingOnGrid();
	/*
	if(ModeController.getCurrentMode() == GameState.LINK)
	{
		ModeController.selectedBuilding = null;
	    return;
	}
	*/

	Debug.Log("adding buidling to grid");
	for (var defaultBuilding : Building in buildings)
	{
		if(buildingType.ToUpper() == defaultBuilding.buildingName.ToUpper() )
		{
		
			temp.buildingName = buildingType;
			
			temp.unallocatedInputs.AddRange(defaultBuilding.unallocatedInputs);
			temp.unallocatedOutputs.AddRange(defaultBuilding.unallocatedOutputs);
			
			temp.optionalOutput = defaultBuilding.optionalOutput;
			
			temp.requisitionCost = defaultBuilding.requisitionCost;
			
			temp.pollutionOutput = defaultBuilding.pollutionOutput;
			
			break;
		}
    }
    temp.buildingPointer = building;
    temp.coordinate = coordinate;
    temp.tileType = tileType;
    temp.idea = idea;				// will be blank for buildings placed in game?
    temp.hasEvent = hasEvent;				// will be blank for buildings placed in game?
    temp.highlighter = grid.CreateHighlightHexagon(temp.coordinate);
    	
   if( !isPreplaced )
   {
	    buildingsOnGrid.push(temp);
	    	        
	    //adding for undo:
		
		previousBuildings.Add("EndOfAdd");
		previousBuildings.Add(buildingsOnGrid.length - 1); 	// index of new building
		previousBuildings.Add("Add");
		
		numberOfUndos++;
		
		cleanUpPreviousBuildings();
				
		//intelSystem.addTurn();		// NEW: for the Intel System
		
		ModeController.setSelectedBuilding(temp.buildingPointer);
		GameObject.Find("ModeController").GetComponent(ModeController).switchTo(GameState.LINK);
		Debug.Log("Setting to link");
		BroadcastBuildingUpdate();
		
		//************
		return true;
	}
	else
	{
	
		buildingsOnGrid.push(temp);	   	
		return true;
	
	}
	 
}// end of addBuildingToGrid

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
	
	for(var gos:GameObject in gameObjInScene)
	{
		if(gos.transform.parent == null)
		{
			gos.gameObject.BroadcastMessage("UpdateBuildingCount", GameObject.FindGameObjectsWithTag("Building"), SendMessageOptions.DontRequireReceiver); //calls that function for all the children on the object, if it exists
		} 
	}
}

public static function BroadcastBuildingUpdate(buildingObject : GameObject, buildingIndex : int):void
{
	var gameObjInScene:GameObject[] = GameObject.FindObjectsOfType(typeof(GameObject)); //Gets all game objects in scene
	var replacement : BuildingReplacement = new BuildingReplacement(buildingObject, buildingIndex);
	for(var gos:GameObject in gameObjInScene)
	{
		if(gos.transform.parent == null)
		{
			gos.gameObject.BroadcastMessage("ReplaceBuilding", replacement, SendMessageOptions.DontRequireReceiver); //calls that function for all the children on the object, if it exists
		} 
	}
}


/*

The findBuildingIndex function is used to identify the index
of the building in the buildingsOnGrid array based on a
given coordinate.

*/
static public function findBuildingIndex( coordinate:Vector3 ): int
{
	var index = 0;

	for (var placedBuilding : BuildingOnGrid in buildingsOnGrid)
	{
		//Debug.Log("coordinate: " + coordinate + " building coord: " + placedBuilding.coordinate);
		if(coordinate == placedBuilding.coordinate)
		{
			//Debug.Log("Found match at " + index);
			return index;
		}
		
		index++;
	}
	return -1;			// will return -1 if there is no building at the
						// given coordinate, to be used as a check as
						// needed if there is no building at the given
						// coordinate
								
	
}// end of findBuildingIndex

static public function findBuildingIndex (build : BuildingOnGrid) : int {
	var index = 0;

	for (var placedBuilding : BuildingOnGrid in buildingsOnGrid)
	{
		//Debug.Log("coordinate: " + coordinate + " building coord: " + placedBuilding.coordinate);
		if(build == placedBuilding)
		{
			//Debug.Log("Found match at " + index);
			return index;
		}
		
		index++;
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

static public function getBuildingsOnGrid(){
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
	}
    
    // If the resource has been found in both buildings,
    // decrease the amount and add the index of the other building
    // in the linkedTo array.
    if(hasResource)
    {
    
    	//adding for undo:
    	var tempOutputBuilding: BuildingOnGrid = new BuildingOnGrid();
		var tempInputBuilding: BuildingOnGrid = new BuildingOnGrid();
	
		copyBuildingOnGrid(buildingsOnGrid[outputBuildingIndex], tempOutputBuilding);
		copyBuildingOnGrid(buildingsOnGrid[inputBuildingIndex], tempInputBuilding);
	
		previousBuildings.Add("EndOfLink");	
		previousBuildings.Add(tempInputBuilding);
		previousBuildings.Add(inputBuildingIndex);
		previousBuildings.Add(tempOutputBuilding);
		previousBuildings.Add(outputBuildingIndex);
		previousBuildings.Add("Link");
		
		numberOfUndos++;
		
		cleanUpPreviousBuildings();
		
		//****************

    	if(usedOptionalOutput)
    	{
		    outputBuilding.optionalOutputAllocated = true;
		    outputBuilding.optionalOutputLinkedTo = inputBuildingIndex;
    	}
    	else
    	{
		    outputBuilding.allocatedOutputs.Add(resourceName);
		    outputBuilding.unallocatedOutputs.Remove(resourceName);
		    outputBuilding.outputLinkedTo.Add(inputBuildingIndex);
	    }
	    
	    inputBuilding.allocatedInputs.Add(resourceName);
		inputBuilding.unallocatedInputs.Remove(resourceName);
		
		inputBuilding.inputLinkedTo.Add(outputBuildingIndex);
	    
	    buildingsOnGrid[outputBuildingIndex] = outputBuilding;
		buildingsOnGrid[inputBuildingIndex] = inputBuilding;
		activateBuilding(inputBuildingIndex);
		Debug.Log("End of link buildings");
		
		//Stores links into list organized by when they were created	
		var tempNode : LinkTurnNode = new LinkTurnNode();
		tempNode.b1 = inputBuilding.buildingPointer;
		tempNode.b1Coord = inputBuilding.coordinate;
		tempNode.b2 = outputBuilding.buildingPointer;
		tempNode.b2Coord = outputBuilding.coordinate;
		tempNode.turnCreated = intelSystem.currentTurn + 1;
		tempNode.type = resourceName;
		linkList.Add(tempNode);
		
		UndoStack.Add(UndoType.Link);
		
		intelSystem.addTurn();	// NEW: Intel System
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
	var oldOutputBuildingIndex : int = inputBuilding.inputLinkedTo[selectedInIndex]; // save the old output building index
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
		if (inputBuilding.allocatedInputs[selectedInIndex] == resourceName && outputList.Contains(resourceName))
			hasResource = true;
	}
	
	// if resource is valid
	if (hasResource)
	{
		if(usedOptionalOutput)
    	{
		    outputBuilding.optionalOutputAllocated = true;
		    outputBuilding.optionalOutputLinkedTo = inputBuildingIndex;
    	}
    	// move the resource from the output building's unallocated list to allocated
    	else if (!allocatedOutSelected)
    	{
		    outputBuilding.allocatedOutputs.Add(resourceName);
		    outputBuilding.unallocatedOutputs.Remove(resourceName);
		    outputBuilding.outputLinkedTo.Add(inputBuildingIndex); // add the link to the output building
	    }
	    
	    // swap the resource from the allocated list back into the unallocated list of the old output building
	    // and remove the link
	    var oldOutIndex : int = oldOutputBuilding.outputLinkedTo.IndexOf(inputBuildingIndex);
	    if (oldOutIndex > -1)
	    {
		    oldOutputBuilding.unallocatedOutputs.Add(resourceName);
		    oldOutputBuilding.allocatedOutputs.RemoveAt(oldOutIndex);
		    oldOutputBuilding.outputLinkedTo.RemoveAt(oldOutIndex);
	    }
	    else
	    {
	    	oldOutputBuilding.optionalOutputAllocated = false;
	    	oldOutputBuilding.optionalOutputLinkedTo = -1;
	    }
	    
		inputBuilding.inputLinkedTo[selectedInIndex] = outputBuildingIndex; // swap in the new output building index for the input's links
		
		buildingsOnGrid[outputBuildingIndex] = outputBuilding;
		buildingsOnGrid[inputBuildingIndex] = inputBuilding;
		activateBuilding(inputBuildingIndex);
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
		linkList.Add(tempNode);
		
		UndoStack.Add(UndoType.Overload);
		if (!allocatedOutSelected)
		{			
			intelSystem.addTurn();
		}
	}
	
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
	var oldInputBuildingIndex = outputBuilding.outputLinkedTo[selectedOutIndex]; // save the old input building index
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
		if (outputBuilding.optionalOutput == resourceName && !outputBuilding.optionalOutputAllocated
			&& inputList.Contains(resourceName))
			hasResource = true;
	}
	else
	{
		if (inputList.Contains(resourceName) && outputBuilding.allocatedOutputs[selectedOutIndex] == resourceName)
			hasResource = true;
	}
	
	// if resource is valid
	if (hasResource)
	{
		// move the resource from the inputs unallocated list to allocated list
		if (!allocatedInSelected)
		{
		    inputBuilding.allocatedInputs.Add(resourceName);
			inputBuilding.unallocatedInputs.Remove(resourceName);
			inputBuilding.inputLinkedTo.Add(outputBuildingIndex); // add the link to the input building
		}
	    
	    // swap the resource from the allocated list back into the unallocated list of the old input building
	    // and remove the link.  Deactivate the chain of all output linked buildings
	    var oldInIndex : int = oldInputBuilding.inputLinkedTo.IndexOf(outputBuildingIndex);
	    oldInputBuilding.unallocatedInputs.Add(resourceName);
	    oldInputBuilding.allocatedInputs.RemoveAt(oldInIndex);
	    oldInputBuilding.inputLinkedTo.RemoveAt(oldInIndex);
	    DeactivateChain(outputBuilding.outputLinkedTo[selectedOutIndex], -1);
	    
		outputBuilding.outputLinkedTo[selectedOutIndex] = inputBuildingIndex; // swap in the new input building index for the output's links
		
		
		buildingsOnGrid[outputBuildingIndex] = outputBuilding;
		buildingsOnGrid[inputBuildingIndex] = inputBuilding;
		activateBuilding(inputBuildingIndex);
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
		if(allocatedInSelected)
			tempNode.OverloadChainBreak = true;		
		
		linkList.Add(tempNode);						
		
		UndoStack.Add(UndoType.Chain);
		
		//If the Chain Break was the result of an Overload/Chain Break combo: Do not add another turn
//		if(!allocatedInOutSelected)
			intelSystem.addTurn();
	}
	
	if (hasResource)
		return oldInputBuildingIndex;//hasResource;
	Debug.Log("Chain break failed");
	return -1;
}

// Recursively deactivates all of the buildings in the chain of output links
private function DeactivateChain (buildingIndex : int, parentIndex : int)
{
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	// if the building is active, deactivate it
	if (building.isActive)
		toggleActiveness(buildingIndex);
	if (parentIndex >= 0)
	{
		building.deactivatedInputs.Add(building.inputLinkedTo.IndexOf(parentIndex));
	}
	// change all output links' colors to reflect deactivation
	for (var i : int in building.outputLinkedTo)
	{
		//DrawLinks.SetLinkColor(buildingIndex, i, Color.gray);
		drawLinks.SetLinkTexture(buildingIndex, i, false);
		DeactivateChain(i, buildingIndex);
	}
	Debug.Log("Deactivate Chain");
}

/*

activateBuilding, when given an index, checks to make sure
the building has no more input requirements, and then sets
the variable isActive to true if so.

*/
public function activateBuilding( buildingIndex:int ): boolean
{
	var canActivate = true;
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	
	// only activate if building has no unallocated or deactivated inputs
	if(building.unallocatedInputs.Count > 0 || building.deactivatedInputs.Count > 0)
	{
		canActivate = false;
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
    buildingsOnGrid[buildingIndex] = building;
    // if building has been activated
    if (building.isActive)
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
				activateBuilding(outLink);
			}
    	}
    return canActivate;
	
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
	else if (unit == "Regulator")
		building.unit = UnitType.Regulator;
	else if (unit == "EnergyAgent")
		building.unit = UnitType.EnergyAgent;
		
}

static public function removeUnit( buildingIndex : int)
{
	var building : BuildingOnGrid = buildingsOnGrid[buildingIndex];
	building.unit = UnitType.None;
}

/*

Building Class

Instead of just creating a 2D array/matrix, I decided that creating a class for a building
would make it easier to understand the structure of the database (since for the matrix I would
have to create in the comments an explaination as to what which row and column held).

Also, since not all buildings share the same input and output, or even the same amounts of input
and output, this will allow for flexiblity in that regard as well. Since the amount of a specific
resource a building might need is not always 1, that's what the Num arrays are; the corrisponding
values at the matching indexes should indicate the number of resources needed or output by the 
resource named in the other array.

NOTE: This class and the one below uses parallel arrays to store the resource input/output type
and their amounts.

*/


class Building
{
	var buildingName = "nameOfBuilding";

	var unallocatedInputs : List.<ResourceType> = new List.<ResourceType>();
	var allocatedInputs : List.<ResourceType> = new List.<ResourceType>();
	var unallocatedOutputs : List.<ResourceType> = new List.<ResourceType>();
	var allocatedOutputs : List.<ResourceType> = new List.<ResourceType>();
	
	var optionalOutput : ResourceType = ResourceType.None;
	var optionalOutputAllocated : boolean = false;
	
	var requisitionCost : int;
	
	var pollutionOutput : int;
}

/*
BuildingOnGrid Class

This contains the information for a building placed on a grid.
Takes the information from the default Building class, but
creates, essentially, a new building so that the data can be
manipulated without affecting the original default building.

We'll have to tweak the code a little based upon what coordinate
is set as, whether a singular value or something like an 2D
coordinate, which shouldn't be too diffcult since most
of the functions use index.

*/


class BuildingOnGrid
{

	var buildingName = "nameOfBuilding";

	var unallocatedInputs : List.<ResourceType> = new List.<ResourceType>();
	var allocatedInputs : List.<ResourceType> = new List.<ResourceType>();
	var unallocatedOutputs : List.<ResourceType> = new List.<ResourceType>();
	var allocatedOutputs : List.<ResourceType> = new List.<ResourceType>();
	
	var optionalOutput : ResourceType = ResourceType.None;
	var optionalOutputAllocated : boolean = false;
	
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
	var unitSelected : boolean = false;
	
	var idea : String = "";		// "Upgrade available if a Researcher is placed on this building" (will search through a list of upgrades to identify what this means)
	
	var hasEvent : boolean = false;	// (will search through a list of upgrades to identify what this means)
	
	// Unit pathing variables
	var pathParent : BuildingOnGrid = null;
	var pathParentDist : float = -1;
	
	var heldUpgrade : UpgradeType = UpgradeType.None;
	//var neededUpgrade : UpgradeType = UpgradeType.None;
	
	var highlighter : GameObject;
}


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
}

class AddTurnNode
{
	var buildingSite: BuildingOnGrid;
	var worldCoordinates: Vector3;
}

// From Design Document, 3.3 Units
enum UnitType
{
	None = 0,
	Worker = 1,
	Researcher = 2,
	Regulator = 3,
	EnergyAgent = 4
}



//********************************************************************Updated for Undo Function:



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
} // end of copyBuildingOnGridd



// Returns true if undo was successful, false if there is nothing to undo
// Can add more than link and add (linking buildings and adding to grid)
// if there are more actions the player can undo; this is assuming other actions
// are taken by the game rather than the player themselves.

// The previousBuildings array will store the building's info before
// it was changed, followed by the index of the building, and then lastly the
// type of change. It is set up to have as many undos as we would like, by changing
// the number of previousBuildingsLimit, keeping in mind that there are 6 elements
// added for linking buildings, and 3 added for adding a building.

function undo(): boolean
{
	if(intelSystem.currentTurn != 0)
	{
		
		//switch(UndoStack[intelSystem.currentTurn - 1])
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
				UndoLink(1);								
				break;
			case UndoType.Overload:
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
	
	var linkUIRef : LinkUI = GameObject.FindWithTag("MainCamera").GetComponent(LinkUI);			
	linkUIRef.removeLink(linkList[lastIndex].b1, linkList[lastIndex].b2);										
		
	var b1Building : BuildingOnGrid = getBuildingOnGrid(linkList[lastIndex].b1Coord);
	var b2Building : BuildingOnGrid = getBuildingOnGrid(linkList[lastIndex].b2Coord);
	
	//Undo Previous Link
	b1Building.unallocatedInputs.Add(linkList[lastIndex].type);	
	b2Building.unallocatedOutputs.Add(linkList[lastIndex].type);    
	
	b1Building.allocatedInputs.RemoveAt(b1Building.allocatedInputs.Count - 1);	
	b2Building.allocatedOutputs.RemoveAt(b2Building.allocatedOutputs.Count - 1);
	
	b1Building.inputLinkedTo.RemoveAt(b1Building.inputLinkedTo.Count - 1);	
	b2Building.outputLinkedTo.RemoveAt(b2Building.outputLinkedTo.Count - 1);
	
	var b3Building : BuildingOnGrid;
	
	if(typeOfUndo != 0)
	{
		b3Building = getBuildingOnGrid(linkList[lastIndex].b3Coord);
	}
	
	switch(typeOfUndo)
	{
		case 1: // Chain Break
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
			break;
		case 2:
			AddLink(b1Building, b3Building, lastIndex);		
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
		activateBuilding(findBuildingIndex(b1Building));
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

function AddLink(inputBuilding : BuildingOnGrid, outputBuilding : BuildingOnGrid, lastIndex : int)
{
	var linkUIRef : LinkUI = GameObject.FindWithTag("MainCamera").GetComponent(LinkUI);				
					
	//Link B1 to B3
	inputBuilding.unallocatedInputs.Remove(linkList[lastIndex].type);	
	outputBuilding.unallocatedOutputs.Remove(linkList[lastIndex].type);	
	
	inputBuilding.allocatedInputs.Add(linkList[lastIndex].type);
	outputBuilding.allocatedOutputs.Add(linkList[lastIndex].type);
	
	inputBuilding.inputLinkedTo.Add(findBuildingIndex(outputBuilding));
	outputBuilding.outputLinkedTo.Add(findBuildingIndex(inputBuilding));
	
	linkUIRef.linkReference[findBuildingIndex(inputBuilding), findBuildingIndex(outputBuilding)] = true;		
	//Draw New Link
	GameObject.FindWithTag("MainCamera").GetComponent(DrawLinks).CreateLinkDraw(findBuildingIndex(inputBuilding), findBuildingIndex(outputBuilding), linkList[lastIndex].type);
}

function UndoAdd()
{
	var lastIndex : int = addList.Count - 1;
	var buildingIndex : int = findBuildingIndex(getBuildingOnGrid(addList[lastIndex].buildingSite.coordinate));		
	var building : GameObject = getBuildingOnGrid(addList[lastIndex].buildingSite.coordinate).buildingPointer;
	GameObject.DestroyImmediate(building);
	// Remove building from BuildingsOnGrid
	buildingsOnGrid.Splice(buildingIndex, 1);	
	
	// Add BuildingSite to BuildingsOnGrid
	addBuildingSite(addList[lastIndex].buildingSite.coordinate);		
	
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
}

// Cleans up the array used to keep track of previous states
// by removing the least recent change
static function cleanUpPreviousBuildings()
{
	if(limitedUndos)
	{
		
		if( numberOfUndos > undoLimit )
		{
			var typeOfUndo = previousBuildings.Shift();	// #1
		
			if(typeOfUndo == "EndOfAdd")
			{
				previousBuildings.Shift();	//#2, the index of the building
				previousBuildings.Shift();	//#3, the "Add"
				
				numberOfUndos--;
			}
			else if(typeOfUndo == "EndOfLink")
			{
				previousBuildings.Shift();	//#2, the Input building 
				previousBuildings.Shift();	//#3, the Input index
				previousBuildings.Shift();	//#4, the Output building
				previousBuildings.Shift();	//#5, the Output index
				previousBuildings.Shift();	//#6, the "Link"
				
				numberOfUndos--;
			}
					
		}
	}
}// end of cleanUpPreviousBuildings()



// This function adds up the pollution output for all buildings on
// the grid and returns that value.
static public function totalPollution(): int
{
	var pollution : int = 0;

	for (var placedBuilding : BuildingOnGrid in buildingsOnGrid)
	{
		pollution += placedBuilding.pollutionOutput;
	}
	return pollution;

}// end of totalPollution








//********************************************************************Updated for Check for Win State:

// This function will need to be called during an update function, or whenever the game
// wants to check for a win state. At the moment, it just checks to see if all buildings
// that are on the grid are active. Returns true if all are active, false if not.
// Can be used to trigger another even, like loading another level, or calling another function, etc.

function testWinState(): boolean
{
	
	for (var placedBuilding : BuildingOnGrid in buildingsOnGrid)
	{
		//only checks houses and cities
		if(placedBuilding.buildingName == "House" || placedBuilding.buildingName == "City")
		{
			if(placedBuilding.isActive == false)
			{
				//if any of the buildings are not active, will return false
				return false;
			}
		}
	}
	//will only make it this far after going through all the buildings and finding none of them false
	return true;
	
}// end of testWinState



//*******************************************************************************
// This function will properly delete a building site from the database

static public function deleteBuildingSite( coordinate : Vector3 )
{
	var buildingSiteID : int = findBuildingIndex( coordinate );	// find location in array of buildings
	if (buildingSiteID >= 0)
		Destroy(getBuildingOnGridAtIndex(buildingSiteID).highlighter);
	Debug.Log("Removing at Index: " + buildingSiteID + " for coordinate " + coordinate);
	buildingsOnGrid.Splice(buildingSiteID, 1);	// removes building site from array of buildings
	BroadcastBuildingUpdate();
	
	if(findBuildingIndex(coordinate) == -1)
	{
		Debug.Log("Successfully Removed.");
	}
	else
	{
		Debug.Log("Error, building not removed...");
	}
}// end of deleteBuildingSite()

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
	Debug.Log("adding " + buildingObject.name + " to grid at " + coord);

	var tempBuilding : BuildingOnGrid = new BuildingOnGrid();
	var tempBuildingData : BuildingData = buildingObject.GetComponent(BuildingData);
	tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
	tempBuilding.coordinate = coord;
	tempBuilding.buildingPointer = buildingObject;
	tempBuilding.highlighter = getBuildingOnGridAtIndex(buildingSiteID).highlighter;
	
	buildingsOnGrid[buildingSiteID] = tempBuilding;
	//buildingsOnGrid.Splice(buildingSiteID, 1, tempBuilding);
	BroadcastBuildingUpdate(buildingObject, buildingSiteID);
}

// This function will properly add a building site to the database
static public function addBuildingSite( coordinate : Vector3)
{
	var index : int = findBuildingIndex(coordinate);
	var addIndex : int = addList.Count - 1;		
	var tileType : String = addList[addIndex].buildingSite.tileType;	
	var isPreplaced : boolean = false;
	var idea : String = addList[addIndex].buildingSite.idea;
	var hasEvent : boolean = addList[addIndex].buildingSite.hasEvent;
	
	var building : GameObject = Instantiate(Resources.Load("BuildingSite"));	
	building.transform.position = addList[addIndex].worldCoordinates;
	building.name = "BuildingSite";
	ModeController.setSelectedBuilding(building);
	addBuildingToGrid("BuildingSite", coordinate, tileType, building, isPreplaced, idea, hasEvent);
	BroadcastBuildingUpdate();
} // End of addBuildingSite()

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