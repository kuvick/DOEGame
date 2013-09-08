/*
Unit.js
By Derrick Huey
*/
#pragma strict

class WorkerUnit extends Unit {
	private var databaseRef : Database;

	function Start () {
		super();
		type = UnitType.Worker; // set unit type
		databaseRef = GameObject.Find("Database").GetComponent(Database);
	}
	
	// Checks that the target building has optional outputs
	protected function BuildingCheck (target : BuildingOnGrid)
	{
		if (!super(target) || target.optionalOutput == ResourceType.None)
			return false;
		return true;
	}
	
	function DoAction()
	{
		if(super())
		{
			if (previousBuilding.optionalOutputLinkedTo >= 0)
				databaseRef.DeactivateLink(Database.findBuildingIndex(previousBuilding), previousBuilding.optionalOutputLinkedTo);
			else if (currentBuilding.optionalOutputLinkedTo >= 0)
				databaseRef.activateBuilding(Database.findBuildingIndex(currentBuilding), true);
		}
	}
}