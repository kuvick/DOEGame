/*
EventSystem.js
Initially by Katharine Uvick

The system that replaced the Requisition System.

Events will be associated with buildings, and these will give
the player points.



*/

#pragma strict

static public var currentTurn : int;

class BuildingEvent
{
	var description : String;
	var type : BuildingEventType;
	var time : int;
	var points : int;
	var upgrade;
}

enum BuildingEventType
{
	

}

function Awake ()
{
	currentTurn = 0;
}

function Update ()
{

}