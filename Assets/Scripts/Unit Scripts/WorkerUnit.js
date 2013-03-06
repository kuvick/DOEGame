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
	
	// Checks that the target building has optional outputs
	protected function BuildingCheck (target : BuildingOnGrid)
	{
		if (!super(target) || target.optionalOutputNum.length <= 0)
			return false;
		return true;
	}
}