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
		if (!super(target) || target.optOutput.resource == ResourceType.None)//ionalOutput == ResourceType.None)
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
			if (currentBuilding.optOutput.icon)//ionalOutputIcon)
			{
				currentBuilding.optOutput.icon.SetFlashSolidColor(Color.white);//ionalOutputIcon.SetFlashSolidColor(Color.white);//SetActive(true);
				currentBuilding.optOutput.icon.SetFixed(true);//ionalOutputIcon.SetFixed(true);
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
			previousBuilding.optionalOutputFixed = buildingOptionalFixedPreviousSetting;
			if (!buildingOptionalFixedPreviousSetting && previousBuilding.optOutput.icon)//ionalOutputIcon)
				previousBuilding.optOutput.icon.SetFixed(false);//ionalOutputIcon.SetFixed(false);//SetFlashSolidColor(Color.red);
		}
	}
}