/*
Unit.js
By Derrick Huey
*/
#pragma strict

class ResearcherUnit extends Unit {
	var heldUpgrade : Upgrade = null;

	/*function Start () {
		super();
	}*/
	
	/*function Initiate() {
		super();
	}*/
	
	function DoAction() {
		super();
		if (CheckUpgrade())
			heldUpgrade = null;
	}
	
	// checks whether the held upgrade's target building has been reached
	function CheckUpgrade () : boolean {
		if (currentBuilding == heldUpgrade.targetBuilding)
			return true;
		return false;
	}
	
	/*function Update () {
	
	}*/

}

enum UpgradeType // to be changed
{
	Electrical = 0,
	Gas = 1
}

class Upgrade {
	var type : UpgradeType;
	var targetBuilding : BuildingOnGrid; // building upgrade needs to be brought to
	
	function Upgrade (ut : UpgradeType, tb : BuildingOnGrid) {
		type = ut;
		targetBuilding = tb;
	}
	
	function GetTarget() : BuildingOnGrid {
		return targetBuilding;
	}
}