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

public var totalEvents : int = 0;
private var eventStack : List.<EventStackNode>;

public var turnTriggers : TurnTrigger[];
private var currentTriggerIndex : int = 0;

private var display : InspectionDisplay; // tooltip display reference

public var levelName : String;
public var playerData : SaveSystem; // Should really be a player class need to move to other file 

private var iconIndex : int = 0;
public var primaryIcons : Texture2D[]; // 0 = without upgrade, 1 = with upgrade
public var secondaryIcons : Texture2D[]; // 0 = without upgrade, 1 = with upgrade

//private var codicesUnlockedThisLevel : List.<String>;
//private var contactsUnlockedThisLevel : List.<String>;

//Combo
public var comboSystem: ComboSystem;
public var updateScore = false;

// timer system
private var timeLeft : int = 60;

public var useTimer : boolean = true;

public var toolTipOnScreen : boolean = false;
public var isPaused : boolean = false;

private var dOS:DisplayOnceSystem;

private var usedUndoOrWait:boolean;

private var failurePath : List.<EventScript> = new List.<EventScript>();

public function pressedUndoOrWait()
{
	usedUndoOrWait = true;
}

public function getUsedUndoOrWait():boolean
{
	return usedUndoOrWait;
}

public function hasSecondaryEvent():boolean
{
	for(var i:int = 0; i < events.Count; i++)
	{
		if(!events[i].getObjIcon().getIsPrimary())
			return true;
	}
	return false;
}

class BuildingEvent
{
	//var name : String = "";				// Used for accessing in editor				(?) may want to cut out
	//var title: String = "";				// Displayed Title in the Intel Menu
	//var description : String = "";		// Displayed Description in the Intel Menu
	/*var tooltipPic : Texture2D;*/         // Displayed image in tooltip
	var tooltip : Tooltip;
	@HideInInspector
	var icon : Texture = null;			// Can be used in the event class for the designer to give the building the icon to display
	var inspIcon : Texture = null;      // inspected icon
	var resolvedIcon : Texture = null;
	var type : BuildingEventType;	// Primary or Secondary
	var time : int = 0;				// Number of turns to complete primary objective (doesn't matter for secondary)
	@HideInInspector
	var points : int = 0;				// Number of points awarded to player upon resolution of event 
	var upgrade: UpgradeID = UpgradeID.None;			// set blank if no need for upgrade; if no need for upgrade, assumes event will be to activate building 
	/*var upgradeText : String;
	var upgradeTooltipPic : Texture2D;*/
	var upgradeTooltip : Tooltip;
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
	usedUndoOrWait = false;
	
	if(!useTimer)
	{
		timeLeft = 0;
	}

	var guiObj : GameObject = GameObject.Find("GUI System");
	display = guiObj.GetComponent(InspectionDisplay);

	eventStack = new List.<EventStackNode>();
	//codicesUnlockedThisLevel = new List.<String>();
	//contactsUnlockedThisLevel = new List.<String>();
	
	if (playerData == null){
		//Debug.LogWarning("IntelSystem does not have a reference to the SaveSystem. Attempting to find");
		playerData = GameObject.Find("Player Data").GetComponent(SaveSystem) as SaveSystem;
		if (playerData == null){
			Debug.LogError("Could not find SaveSystem");
		}
	}

	currentTurn = 0;
	numOfObjectivesLeft = 0;
	primaryScore = 0;
	optionalScore = 0;
	victory = false;
	levelName = Application.loadedLevelName;
	
	var tempBuildingData : BuildingData;
	var tempBuilding : BuildingOnGrid;
	//var defaultBuildingScript : DefaultBuildings = gameObject.GetComponent(DefaultBuildings);
	var tempEventClass : EventScript = new EventScript();
	
	var buildings : GameObject[] = GameObject.FindGameObjectsWithTag("Building");
	for (var i : int = 0; i < buildings.length; i++)//var buildingObject : GameObject in GameObject.FindGameObjectsWithTag("Building"))
	{
		var buildingObject : GameObject = buildings[i];
		tempBuilding = new BuildingOnGrid();
		tempBuildingData = buildingObject.GetComponent(BuildingData);
		//tempBuilding = defaultBuildingScript.convertBuildingOnGridDataIntoBuildingOnGrid(tempBuildingData.buildingData);
		tempBuilding = tempBuildingData.convertBuildingOnGridDataIntoBuildingOnGrid();
		
		if (tempBuilding.hasEvent)
		{		
			//tempEventClass = new EventScript();
			tempEventClass = buildingObject.GetComponent(EventScript);
			if(tempEventClass != null)
			{
				// set icon
				iconIndex = (tempEventClass.event.upgrade == UpgradeID.None) ? 0 : 2;
				if (tempEventClass.event.type == BuildingEventType.Primary)
				{
					tempEventClass.event.icon = primaryIcons[iconIndex];
					tempEventClass.event.inspIcon = primaryIcons[iconIndex + 1];
					tempEventClass.event.resolvedIcon = primaryIcons[4];
					failurePath.Add(tempEventClass);
				}
				else
				{
					tempEventClass.event.icon = secondaryIcons[iconIndex];
					tempEventClass.event.inspIcon = secondaryIcons[iconIndex + 1];
					tempEventClass.event.resolvedIcon = secondaryIcons[4];
				}
				tempEventClass.Initialize();
				
				tempEventClass.event.buildingReference = buildingObject;
				
				if(!tempEventClass.event.isChild)
				{
					// If the event is the first in a linked event set
					// or a singular event
					tempEventClass.showIcon = true;
					tempEventClass.SetIconActive(true);
					tempEventClass.getObjIcon().setID(i);
					
					events.Add(tempEventClass);
					//events[i]
					
					if(tempEventClass.event.type == BuildingEventType.Primary)
					{
						numOfObjectivesLeft++;
					}				
				//	Debug.Log(tempEventClass.event.name + " - event as added");	
				}
				else
				{
					//If the event is a child...
					tempEventClass.changeOpacity(0f);
					tempEventClass.showIcon = false;
					tempEventClass.SetIconActive(false);
					linkedEvents.Add(tempEventClass);
					
					if(tempEventClass.event.type == BuildingEventType.Primary)
					{
						numOfObjectivesLeft++;
					}				
					//Debug.Log(tempEventClass.event.name + " - a linked event");	
				}			
			}
			else
			{
				//Debug.Log(tempBuilding.buildingName + " incorrectly marked as having an event.");
			}
		}
				
	}
	totalEvents = events.Count + linkedEvents.Count;
	dOS = new DisplayOnceSystem();
	CheckTriggerToDisplay();
	
	comboSystem = new ComboSystem();
	
	StartCoroutine(DecrementTimer());
	
	
	
	for(var j:int = 0; j < events.Count; j++)
	{
		if(events[j].event.type == BuildingEventType.Primary)
		{
			var cameraContr : CameraControl = GameObject.Find("Main Camera").GetComponent(CameraControl);
			cameraContr.finalBuilding.Add(events[j].event.buildingReference);
		}
	}
}

public function resetTimer()
{
	timeLeft = 60.0;
}

// game timer, 60s, player gets 50 points per second left up to 3000
public function DecrementTimer()
{
	while (timeLeft > 0 && !victory)
	{
		if(!toolTipOnScreen && !isPaused)
			timeLeft--;
		yield WaitForSeconds(1.0);
	}
}

public function GetTimeLeft() : int
{
	return timeLeft;
}

//Can use this functio to check for events
public function addTurn()
{
	//Debug.Log("adding a turn");
	//decreaseTurns();
	currentTurn++;
	UnitManager.DoUnitActions();
	CheckTriggerToDisplay();
	decreaseTurns();
}

public function subtractTurn()
{
	//Debug.Log("subtracting a turn");
	increaseTurns();
	currentTurn--;
	UnitManager.UndoUnitActions();
	undoResolution();
	CheckTriggerUndo();
	CheckTriggerToDisplay();
}

//Added GPC 9/3/13
/*public function checkTriggers():boolean{
	return CheckTriggerToDisplay();
}*/

// checks whether the current turn triggers a tooltip display
//private function CheckTriggerToDisplay()
private function CheckTriggerToDisplay()//:boolean
{
	if (currentTriggerIndex >= turnTriggers.length)
		//return;
		//Added GPC 9/3/13
		return; //false;
	while (currentTurn == turnTriggers[currentTriggerIndex].turn)
	{
		/*if(dOS.WasAlreadyDisplayed(display.currentToolTipIndex, false))
		{
			display.currentToolTipIndex++;
			currentTriggerIndex++;
			if (currentTriggerIndex >= turnTriggers.length)
				break;
		}
		else
		{*/
			/*if (turnTriggers[currentTriggerIndex].dispPic == null)
				display.Activate(turnTriggers[currentTriggerIndex].dispText);
			else
				display.Activate(turnTriggers[currentTriggerIndex].dispPic, turnTriggers[currentTriggerIndex].dispText);*/
			display.Activate(turnTriggers[currentTriggerIndex].tooltip, null);
			currentTriggerIndex++;
			if (currentTriggerIndex >= turnTriggers.length)
				break;
			//Added GPC 9/3/13
			//return true;
		//}
	}
}

// checks whether the trigger index needs to be decremented
private function CheckTriggerUndo()
{
	if (currentTriggerIndex <= 0)
		return;
	if (currentTurn <= turnTriggers[currentTriggerIndex - 1].turn)
		currentTriggerIndex--;
}


// When a building is activated and has an event, it calls this
// function to check and see what the event is. If it is an event
// that does not require an upgrade, it resolves it.
public function buildingActivated( reference : GameObject ):boolean
{
	var script : EventScript = findEvent(reference);
	if(script != null)
	{
		if(script.event.upgrade != UpgradeID.None)
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
	updateScore = true;
	//Debug.Log("Score Incremented: " + primaryScore);
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
	//Debug.Log("Score Decremented: " + primaryScore);
}

// Resolves the event, removes it from the list
// also adds any linked events the event may have had
public function resolveEvent( script : EventScript)
{
	//Debug.Log(script.event.name + " was resolved!");
	var tempScript : EventScript = script;
	if (tempScript.getResolved())
		return;
	var tempNode : EventStackNode = new EventStackNode();
	tempNode.event = script;
	tempNode.turnAdded = currentTurn;
	eventStack.Add(tempNode);
	//events.Remove(script);
	
	tempScript.changeOpacity(0f);
	//tempScript.SetIconActive(false);
	//tempScript.getIconScript().SetResolved(true);
	tempScript.SetResolved(true);
	
	if(tempScript.event.childEvent != null)
	{	
		var childEvent : EventScript = findLinkedEvent(tempScript.event.childEvent);
		childEvent.changeOpacity(.5f);
		childEvent.showIcon = true;
		childEvent.SetIconActive(true);
		linkedEvents.Remove(childEvent);
		events.Add(childEvent);
		SoundManager.Instance().PlaySecondaryObjectiveComplete();
	}
	
	if(tempScript.event.type == BuildingEventType.Primary)
	{
		incrementScore(true, tempScript.event.points);
		numOfObjectivesLeft--;
		if(numOfObjectivesLeft <= 0)
		{
			//triggerWin();
			victory = true;
		}
		SoundManager.Instance().PlayPrimaryObjectiveComplete();
	}	
	else
	{
		//optionalScore += tempScript.event.points;
		SoundManager.Instance().PlaySecondaryObjectiveComplete();
		incrementScore(false, tempScript.event.points);
	}
	/*
	for (var contactToUnlock : String in tempScript.contactsUnlocked){
		if (playerData.currentPlayer.contactData.ContactUnlocked(contactToUnlock)){
			continue;
		}
		contactsUnlockedThisLevel.Add(contactToUnlock);
		playerData.currentPlayer.unlockContact(contactToUnlock);
		playerData.SaveCurrentPlayer();
	}
	*/
	/*
	for (var codexToUnlock : String in tempScript.codicesUnlocked){
		if (playerData.currentPlayer.codexData.CodexUnlocked(codexToUnlock)){
			continue;
		}
		codicesUnlockedThisLevel.Add(codexToUnlock);
		playerData.currentPlayer.unlockCodex(codexToUnlock);
		playerData.SaveCurrentPlayer();
	}
	*/
}

public function undoResolution()
{
	if(eventStack.Count > 0)
	{
		var index = eventStack.Count - 1;
		//if(eventStack[index].turnAdded == currentTurn + 1)
		if(eventStack[index].turnAdded == currentTurn)
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
				tempChildEvent.SetIconActive(true);
			
				//Add child to linkedEvents list
				linkedEvents.Add(tempChildEvent);
			}
			
			//If the event was a Primary Event
			if(tempEvent.type == BuildingEventType.Primary){
				// Decrement Primary Score
				decrementScore(true, tempEvent.points);
				// Increment the Number of Objectives Remaining
				numOfObjectivesLeft++;  
			}
			else
			{
				decrementScore(false, tempEvent.points);
			}
			
			eventStack[index].event.changeOpacity(.5f);
			eventStack[index].event.showIcon = true;
			eventStack[index].event.SetIconActive(true);
			//eventStack[index].event.event.time++;
			
			//I don't think it's taken off anymore from the event list, so don't need to
			// do this, adding it back:
			//events.Add(eventStack[index].event);  // Add to event list
			
			
			for(var l:int; l < events.Count; l++)
			{
				if(events[l].event.tooltip.text == eventStack[index].event.event.tooltip.text)
				{
					Debug.Log("Found Event");
					events[l].SetResolved(false);
				}
			}
			

			
						
			eventStack.RemoveAt(index);  // Remove element from eventStack
			
			
			// Will need to be set up properly if we set up the codex and contacts:
			/*
			for (var contactToUnlock : String in eventStack[index].event.contactsUnlocked){
				if (contactsUnlockedThisLevel.Contains(contactToUnlock)){
					contactsUnlockedThisLevel.Remove(contactToUnlock);
					playerData.currentPlayer.lockContact(contactToUnlock);
					playerData.SaveCurrentPlayer();
				}
			}
			for (var codexToLock : String in eventStack[index].event.codicesUnlocked){
				if (codicesUnlockedThisLevel.Contains(codexToLock)){
					codicesUnlockedThisLevel.Remove(codexToLock);
					playerData.currentPlayer.lockCodex(codexToLock);
					playerData.SaveCurrentPlayer();
				}
			}*/
		}
	}
}


// Returns the event script that the specified building, or returns
// null if the building does not have an event
public function findEvent( building : GameObject): EventScript
{
	for (var i : int = 0; i < events.Count; i++)//var script : EventScript in events)
	{
		if(events[i].event.buildingReference == building)//script.event.buildingReference == building)
		{
			return events[i];//script;
		}
	}
	
	return null;
}

// Returns the linked event script
public function findLinkedEvent( building : GameObject): EventScript
{
	for (var i : int = 0; i < linkedEvents.Count; i++)//var script : EventScript in linkedEvents)
	{
		if(linkedEvents[i].event.buildingReference == building)//script.event.buildingReference == building)
		{
			return linkedEvents[i];//script;
		}
	}
	
	return null;
}



// To be used by the researcher unit when it arrives at a building site
// it checks the given upgrade name with the upgrade the building needs
// assumes that in order to arrive at a building, it must be already activated
public function unitArrival( upgradeName : UpgradeID, buildingRef : GameObject ): boolean
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

// function to be called when a win state is triggered
public function triggerWin()
{
	victory = true;
	playerData.currentPlayer.completeLevel(levelName);
	
	var event : GUIEvent = new GUIEvent();
	event.type = EventTypes.SCORESCREEN;
	//PlayerPrefs.SetString(Strings.NextLevel, LevelSetup.getNextLevel());
	GUIManager.Instance().RecieveEvent(event);
}


//**
// Added only for the purpose of autmoatically allowing a win
function Update()
{		
	if(Input.GetKeyDown(KeyCode.W))
		victory = true;
}
//**

// placeholder function to be called when a lose state is triggered
public function triggerLoss()
{
	victory = false;
	/*var event : GUIEvent = new GUIEvent();
	event.type = EventTypes.CLEAR;//FAILUREMENU;*/
	//GUIManager.Instance().RecieveEvent(event);
	
	SoundManager.Instance().PlayPrimaryObjectiveExpired();
	var mainMenu:MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
	mainMenu.enableHUD = false;
	var cameraContr : CameraControl = GameObject.Find("Main Camera").GetComponent(CameraControl);
	cameraContr.SetFailureTrace(failurePath);
	//GUIManager.Instance().RecieveEvent(event);
	/*yield WaitForSeconds(1.5f);
	event.type = EventTypes.RESTART;
	GUIManager.Instance().RecieveEvent(event);*/
}

public function GetLastPrimary() : EventScript
{
	return failurePath[failurePath.Count - 1];
}

// Goes through the events and decreases the
// the turn amount both on the GUI and in the system. Also does a check
// to see if any of the primary events have reached zero and then triggers
// a lose state
public function decreaseTurns()
{
	var script : EventScript;
	for (var i : int = 0; i < events.Count; i++)//var script : EventScript in events)
	{
		script = events[i];
		if(script.event.type == BuildingEventType.Secondary)
			script.decrementTime();
		else
		{
			//Added condition to prevent loss if you win on last turn (GPC 9/25/13)
			if(!script.decrementTime() && (victory == false))
			{
				script.TriggerLossFlash();
				triggerLoss();
			}
		}
	}
}

// Goes through the events and increases the
// the turn amount both on the GUI and in the system. 
public function increaseTurns()
{
	for (var i : int = 0; i < events.Count; i++)//var script : EventScript in events)
	{
		if(!events[i].incrementTime())//script.incrementTime())
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
	for (var i : int = 0; i < events.Count; i++)//var script : EventScript in events)
	{		
		eventList.Add(events[i].event);//script.event);
	}	
	return eventList;
}

public function renderEvents()
{
	for(var i : int = 0; i < events.Count; i++)//var script : EventScript in events)
	{
		events[i].Draw_Upgrade();//script.Draw_Upgrade();
	}
}