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
public var currentLevelName : String;


private var eventStack : List.<EventStackNode>;


class BuildingEvent
{
	var name : String = "";				// Used for accessing in editor				(?) may want to cut out
	var title: String = "";				// Displayed Title in the Intel Menu
	var description : String = "";		// Displayed Description in the Intel Menu
	var icon : Texture = null;			// Can be used in the event class for the designer to give the building the icon to display
	var type : BuildingEventType;	// Primary or Secondary
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
	Primary,
	Secondary,
}

class EventStackNode
{
	var event : EventScript;
	var turnAdded: int;
}

function Start ()
{
	var intelMenu : IntelMenu = GameObject.Find("GUI System").GetComponent(IntelMenu);
	intelMenu.LoadLevelReferences();
	currentLevelName = Application.loadedLevelName;
	eventStack = new List.<EventStackNode>();

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
					tempEventClass.showIcon = true;
					events.Add(tempEventClass);
					
					if(tempEventClass.event.type == BuildingEventType.Primary)
					{
						numOfObjectivesLeft++;
					}				
					Debug.Log(tempEventClass.event.name + " - event as added");	
				}
				else
				{
					//If the event is a child...
					tempEventClass.changeOpacity(0f);
					tempEventClass.showIcon = false;
					linkedEvents.Add(tempEventClass);
					
					if(tempEventClass.event.type == BuildingEventType.Primary)
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
	undoResolution();
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

public function incrementScore(modifyPrimaryScore: boolean, scoreModifier :int)
{
	if(modifyPrimaryScore)
	{
		primaryScore += scoreModifier;
	}
	else
	{
		optionalScore += scoreModifier;	
	}
	Debug.Log("Score Incremented: " + primaryScore);
}

public function decrementScore(modifyPrimaryScore : boolean, scoreModifier: int)
{
	if(modifyPrimaryScore)
	{
		primaryScore -= scoreModifier;
	}
	else
	{
		optionalScore -= scoreModifier;
	}
	Debug.Log("Score Decremented: " + primaryScore);
}

// Resolves the event, removes it from the list
// also adds any linked events the event may have had
public function resolveEvent( script : EventScript)
{
	Debug.Log(script.event.name + " was resolved!");
	var tempScript : EventScript = script;
	var tempNode : EventStackNode = new EventStackNode();
	tempNode.event = script;
	tempNode.turnAdded = currentTurn;
	eventStack.Add(tempNode);
	events.Remove(script);
	
	tempScript.changeOpacity(0f);
	
	if(tempScript.event.childEvent != null)
	{	
		var childEvent : EventScript = findLinkedEvent(tempScript.event.childEvent);
		childEvent.changeOpacity(.5f);
		childEvent.showIcon = true;
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

public function undoResolution()
{
	if(eventStack.Count > 0)
	{
		var index = eventStack.Count - 1;
		if(eventStack[index].turnAdded == currentTurn + 1)
		{	
			var tempEvent : BuildingEvent = eventStack[index].event.event;		
			
			//If the event had a child, that child will now be in play
			if(tempEvent.childEvent != null)
			{
				var tempChildEvent = findEvent(tempEvent.childEvent);
				//Remove child from events list
				events.Remove(tempChildEvent);
				
				//Reset 
				tempChildEvent.changeOpacity(0.5f);
				tempChildEvent.showIcon = true;
			
				//Add child to linkedEvents list
				linkedEvents.Add(tempChildEvent);
			}
			
			//If the event was a Primary Event
			if(tempEvent.type == BuildingEventType.Primary){
				// Decrement Primary Score
				primaryScore -= tempEvent.points; 
				// Increment the Number of Objectives Remaining
				numOfObjectivesLeft++;  
			}
			else // Otherwise...
			{
				// Decrement Optional Score
				optionalScore -= tempEvent.points; 
			}
			
			eventStack[index].event.changeOpacity(.5f);
			eventStack[index].event.showIcon = true;
			eventStack[index].event.event.time++;
			
			events.Add(eventStack[index].event);  // Add to event list
			eventStack.RemoveAt(index);  // Remove element from eventStack
		}
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
	var event : GUIEvent = new GUIEvent();
	event.type = EventTypes.SCORESCREEN;
	GUIManager.Instance().RecieveEvent(event);
}

// placeholder function to be called when a lose state is triggered
public function triggerLoss()
{
	victory = false;
	var event : GUIEvent = new GUIEvent();
	event.type = EventTypes.FAILUREMENU;
	GUIManager.Instance().RecieveEvent(event);
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