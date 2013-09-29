/*
Unit.js
By Derrick Huey
*/
#pragma strict

class WorkerUnit extends Unit {
	private var databaseRef : Database;
	private var buildingOptionalFixedPreviousSetting : boolean = false;

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
			/*if (previousBuilding.optionalOutputLinkedTo >= 0)
				databaseRef.DeactivateLink(Database.findBuildingIndex(previousBuilding), previousBuilding.optionalOutputLinkedTo);
			else if (currentBuilding.optionalOutputLinkedTo >= 0)
				databaseRef.activateBuilding(Database.findBuildingIndex(currentBuilding), true);*/
			buildingOptionalFixedPreviousSetting = currentBuilding.optionalOutputFixed;
			if (currentBuilding.optionalOutputIcon)
			{
				currentBuilding.optionalOutputIcon.SetFlashSolidColor(Color.white);//SetActive(true);
				currentBuilding.optionalOutputFixed = true;
			}
			/*if (previousBuilding.optionalOutputIcon)
				previousBuilding.optionalOutputIcon.SetActive(false);*/
		}
	}
	
	function UndoAction()
	{
		if(super())
		{
			currentPath[0].optionalOutputFixed = buildingOptionalFixedPreviousSetting;
			if (!buildingOptionalFixedPreviousSetting)
				currentPath[0].optionalOutputIcon.SetFlashSolidColor(Color.red);
		}
	}
}