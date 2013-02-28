/*
Unit.js
By Derrick Huey
*/
#pragma strict

class WorkerUnit extends Unit {

	function Start () {
		super();
		type = UnitType.Worker; // set unit type
	}
}