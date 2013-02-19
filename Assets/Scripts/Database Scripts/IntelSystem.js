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
public var events : BuildingEvent[];		// must use this intel system to edit actual events


class BuildingEvent
{
	var name : String;			//used for accessing in editor
	var description : String;
	var icon : String;
	var type : BuildingEventType; 
	var functionName : String;
	var time : int;
	var points : int;
	var upgrade;
}

enum BuildingEventType
{
	Negative = 0,
	Positive_Green = 1,
	Positive_Blue = 2,
	Positive_Yellow = 3
}

function Awake ()
{
	currentTurn = 0;
}

//Can use this functio to check for events
static function addTurn()
{
	currentTurn++;
}

static function subtractTurn()
{
	currentTurn--;
}

static function causeEvent()
{

}