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

public var currentTurn : int;
private var primaryScore : int;
private var optionalScore : int;
public var events : List.<EventScript>;
public var linkedEvents : List.<EventScript>;
public var numOfObjectivesLeft : int;
public var victory : boolean;


class BuildingEvent
{
	var name : String = "";				// Used for accessing in editor				(?) may want to cut out
	var title: String = "";				// Displayed Title in the Intel Menu
	var description : String = "";		// Displayed Description in the Intel Menu
	var icon : Texture = null;			// Can be used in the event class for the designer to give the building the icon to display
	var type : BuildingEventType = 1;	// Primary or Secondary
	var time : int = 0;				// Number of turns to complete primary objective (doesn't matter for secondary)
	var points : int = 0;				// Number of points awarded to player upon resolution of event 
	var upgrade: UpgradeType = UpgradeType.None;			// set blank if no need for upgrade; if no need for upgrade, assumes event will be to activate building 
	var isChild : boolean = false;		// set if it is a child event
	var childEvent : GameObject;		// if there is a linked event to this event
	var buildingReference : GameObject;	// The gameobject the event is attached to
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
	var intelMenu : IntelMenu = GameObject.Find("GUI System").GetComponent(IntelMenu);
	intelMenu.LoadLevelReferences();

	Debug.Log("Adding events to the list:");
	currentTurn = 0;
	numOfObjectivesLeft = 0;
	primaryScore = 0;
	optionalScore = 0;
	victory = false;
	
	var tempBuildingData : BuildingData;
	var tempBuilding : BuildingOnGrid;
	var defaultBuildingScript : DefaultBuildings = gameObject.GetComponent(DefaultBuildings);
	var tempEventClass : EventScript = new EventScript();
	
	for (var buildingObject : GameObject in GameObject.FindGameObjectsWithTag("Building"))
	{
		tempBuilding = new BuildingOnGrid();
		tempBuildingData = buildingObject.GetComponent(BuildingData);
		tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
		if (tempBuilding.hasEvent)
		{
			tempEventClass = new EventScript();
			tempEventClass = buildingObject.GetComponent(EventScript);
			if(tempEventClass != null)
			{
				tempEventClass.event.buildingReference = buildingObject;
				
				if(!tempEventClass.event.isChild)
				{
					// If the event is the first in a linked event set
					// or a singular event
					events.Add(tempEventClass);
					
					if(tempEventClass.event.type == 1)
					{
						numOfObjectivesLeft++;
					}				
					Debug.Log(tempEventClass.event.name + " - event as added");	
				}
				else
				{
					//If the event is a child...
					tempEventClass.changeOpacity(0f);
					tempEventClass.showUpgrade = false;
					linkedEvents.Add(tempEventClass);
					
					if(tempEventClass.event.type == 1)
					{
						numOfObjectivesLeft++;
					}				
					Debug.Log(tempEventClass.event.name + " - a linked event");	
				}			
			}
			else
			{
				Debug.Log(tempBuilding.buildingName + " incorrectly marked as having an event.");
			}
		}
				
	}
	Debug.Log("Finished adding events to the list.");
}

//Can use this functio to check for events
public function addTurn()
{
	decreaseTurns();
	currentTurn++;
	UnitManager.DoUnitActions();
}

public function subtractTurn()
{
	increaseTurns();
	currentTurn--;
	UnitManager.UndoUnitActions();
}


// When a building is activated and has an event, it calls this
// function to check and see what the event is. If it is an event
// that does not require an upgrade, it resolves it.
public function buildingActivated( reference : GameObject ):boolean
{
	var script : EventScript = findEvent(reference);
	if(script != null)
	{
		if(script.event.upgrade != UpgradeType.None)
		{
			Debug.Log("Event requires upgrade to be resolved");
			return false;
		}
		else
		{
			resolveEvent(script);
		}
	}
	else
	{
		Debug.Log("This newly activated building does not have an event!");
		return false;
	}
	
}

// Resolves the event, removes it from the list
// also adds any linked events the event may have had
public function resolveEvent( script : EventScript)
{
	Debug.Log(script.event.name + " was resolved!");
	var tempScript : EventScript = script;
	events.Remove(script);
	
	tempScript.changeOpacity(0f);
	
	if(tempScript.event.childEvent != null)
	{	
		var childEvent : EventScript = findLinkedEvent(tempScript.event.childEvent);
		childEvent.changeOpacity(0f);
		childEvent.showUpgrade = false;
		linkedEvents.Remove(childEvent);
		events.Add(childEvent);
	}
	
	if(tempScript.event.type == BuildingEventType.Primary)
	{
		primaryScore += tempScript.event.points;
		numOfObjectivesLeft--;
		if(numOfObjectivesLeft <= 0)
		{
			triggerWin();
		}
	}
	else
	{
		optionalScore += tempScript.event.points;
	}
	
}


// Returns the event script that the specified building, or returns
// null if the building does not have an event
public function findEvent( building : GameObject): EventScript
{
	for (var script : EventScript in events)
	{
		if(script.event.buildingReference == building)
		{
			return script;
		}
	}
	
	return null;
}

// Returns the linked event script
public function findLinkedEvent( building : GameObject): EventScript
{
	for (var script : EventScript in linkedEvents)
	{
		if(script.event.buildingReference == building)
		{
			return script;
		}
	}
	
	return null;
}



// To be used by the researcher unit when it arrives at a building site
// it checks the given upgrade name with the upgrade the building needs
// assumes that in order to arrive at a building, it must be already activated
public function unitArrival( upgradeName : UpgradeType, buildingRef : GameObject ): boolean
{
	var script = findEvent( buildingRef );
	if(script.event.upgrade == upgradeName)
	{
		resolveEvent(script);
		return true;
	}
	return false;
}

// provides the score to whoever calls the function
// to be used by Score.js to get the score
// that is a result of resolving events
public function getPrimaryScore():int
{
	return primaryScore;
}

// provides the score to whoever calls the function
// to be used by Score.js to get the score
// that is a result of resolving events
public function getOptionalScore():int
{
	return optionalScore;
}

// placeholder function, to be called when a win state is triggered
public function triggerWin()
{
	victory = true;
	Application.LoadLevel ("ScoreScreen");
}

// placeholder function to be called when a lose state is triggered
public function triggerLoss()
{
	victory = false;
	Application.LoadLevel ("ScoreScreen");
}

// Goes through the events and decreases the
// the turn amount both on the GUI and in the system. Also does a check
// to see if any of the primary events have reached zero and then triggers
// a lose state
public function decreaseTurns()
{
	for (var script : EventScript in events)
	{
		if(script.event.type == BuildingEventType.Secondary)
			script.decrementTime();
		else
		{
			if(!script.decrementTime())
			{
				triggerLoss();
			}
		}
	}
}

// Goes through the events and increases the
// the turn amount both on the GUI and in the system. 
public function increaseTurns()
{
	for (var script : EventScript in events)
	{
		if(!script.incrementTime())
		{
			/*
				TODO: De-Activate Events
			*/
		}		
	}
}


// Returns a list of the events
public function getEventList():List.<BuildingEvent>
{	
	var eventList : List.<BuildingEvent> = new List.<BuildingEvent>();
	for (var script : EventScript in events)
	{		
		eventList.Add(script.event);
	}	
	return eventList;
}

public function renderEvents()
{
	for(var script : EventScript in events)
	{
		script.Draw_Upgrade();
	}
}