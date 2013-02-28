/*
IntelSystem.js
Original Script by Katharine Uvick

"On any given map, there will be a few buildings (typically on the far
side of the map from any Originator buildings) with events that will
give points. A player must create a network of links to reach those
buildings to score points. An event will trigger or expire after a
specified number of turns. Reaching a positive event will be referred
to as “tagging” the event, while reaching a negative event will be
referred to as “preventing” an event."



*/

#pragma strict

static public var currentTurn : int;
private var score : int;
private var events : List.<BuildingEvent>;		// must use this intel system to edit actual events


class BuildingEvent
{
	var name : String = "";				// Used for accessing in editor				(?) may want to cut out
	var title: String = "";				// Displayed Title in the Intel Menu
	var description : String = "";		// Displayed Description in the Intel Menu
	var icon : Texture = null;			// Can be used in the event class for the designer to give the building the icon to display
	var type : BuildingEventType = 1;	// Primary or Secondary
	var time : int = 0;				// Number of turns to complete primary objective (doesn't matter for secondary)
	var points : int = 0;				// Number of points awarded to player upon resolution of event 
	var upgrade: String = "";			// set blank if no need for upgrade; if no need for upgrade, assumes event will be to activate building 
	var isChild : boolean = false;
}


// Buildings can be either primary (necessary to complete the level)
// or secondary (optional objectives).
enum BuildingEventType
{
	Primary = 0,
	Secondary = 1,
}

function Start ()
{
	currentTurn = 0;
	
	var tempBuildingData : BuildingData;
	var tempBuilding : BuildingOnGrid;
	var defaultBuildingScript : DefaultBuildings = gameObject.GetComponent(DefaultBuildings);
	var tempEvent : BuildingEvent;
	var tempEventClass : Event;
	
	for (var buildingObject : GameObject in GameObject.FindGameObjectsWithTag("Building"))
	{
		tempBuilding = new BuildingOnGrid();
		tempBuildingData = buildingObject.GetComponent(BuildingData);
		tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
		if (tempBuilding.hasEvent)
		{
			//tempEvent = new BuildingEvent();
			//tempEventClass = buildingObject.GetComponent("Event");
			//tempEvent = tempEventClass.event;
			//events.Add(tempEvent);
			//Debug.Log(tempEvent.name + " - event as added");	
		}
				
	}
	
}

//Can use this functio to check for events
static function addTurn()
{
	UnitManager.DoUnitActions();
	currentTurn++;
}

static function subtractTurn()
{
	currentTurn--;
}


// When a building is activated and has an event, it calls this
// function to check and see what the event is. If it is an event
// that does not require an upgrade, it resolves it.
public function buildingActivated( reference : GameObject ):boolean
{

}



// To be used by the researcher unit when it arrives at a building site
// it checks the given upgrade name with the upgrade the building needs
// assumes that in order to arrive at a building, it must be already activated
public function unitArrival( upgradeName : String ): boolean
{

}

// provides the score to whoever calls the function
// to be used by Score.js to get the score
// that is a result of resolving events
public function getScore():int
{
	return score;
}

// placeholder function, to be called when a win state is triggered
public function triggerWin()
{

}

// placeholder function to be called when a lose state is triggered
public function triggerLose()
{

}

// placeholder function, goes through the events and decreases the
// the turn amount both on the GUI and in the system. Also does a check
// to see if any of the primary events have reached zero and then triggers
// a lose state
public function decreaseTurns()
{

}