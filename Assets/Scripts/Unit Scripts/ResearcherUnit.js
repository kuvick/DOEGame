/*
ResearcherUnit.js
By Derrick Huey
*/
#pragma strict

class ResearcherUnit extends Unit {
	public var heldUpgrade : UpgradeType = UpgradeType.None; // represents the upgrade the researcher is holding
	private var heldUpgradeIcon : Texture; // icon to draw for held upgrade
	private var heldUpgradeButtonOffset:Vector2 = new Vector2(-14, -50);	//Used to set position of button relative to building
	private var upgradeButtonWidth = 27;
	private var upgradeButtonHeight = 27;
	private var manager : UnitManager;
	private var intelSystem : IntelSystem;

	function Start () {
		super();
		type = UnitType.Researcher; // set unit type
		manager = gameObject.FindGameObjectWithTag("MainCamera").GetComponent("UnitManager"); // find Unit Manager
		intelSystem = GameObject.Find("Database").GetComponent(IntelSystem); // find Intel System
		if (heldUpgrade != UpgradeType.None) // if holding an upgrade, get the appropriate icon
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
	}
	
	// Checks that the target building either is holding or needs an upgrade
	protected function BuildingCheck (target : BuildingOnGrid)
	{
		if (!super(target) || (target.heldUpgrade == UpgradeType.None && GetBuildingEventUpgrade(target) == UpgradeType.None))
			return false;
		return true;
	}
	
	// finds and returns the upgrade type associated with the passed in building's event
	private function GetBuildingEventUpgrade (building : BuildingOnGrid) : UpgradeType
	{
		if (!building.hasEvent)
			return UpgradeType.None;
		var buildingEventScript : EventScript = building.buildingPointer.GetComponent("EventScript");
		return buildingEventScript.event.upgrade;
	}
	
	function DoAction() {
		super();
		// after moving buildings, checks if the new building is either 
		// holding a new upgrade
		if (currentBuilding.heldUpgrade != UpgradeType.None)
		{
			// if so, discard currently held upgrade and pick up the new one
			heldUpgrade = currentBuilding.heldUpgrade;
			currentBuilding.heldUpgrade = UpgradeType.None;
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
		}
		// or needs the currently held upgrade
		else if (GetBuildingEventUpgrade(currentBuilding) != UpgradeType.None &&
					GetBuildingEventUpgrade(currentBuilding) == heldUpgrade)
		{
			// if so, satisfy upgrade need and display a temporary message on the status marquee
			//currentBuilding.neededUpgrade = UpgradeType.None;
			intelSystem.resolveEvent(currentBuilding.buildingPointer.GetComponent("EventScript"));
			StatusMarquee.SetText("Upgrade delivered", true);	
		}
	}
	
	function OnGUI()
	{
		super();
		// if holding an upgrade, draw an icon to indicate so
		if (heldUpgrade != UpgradeType.None)
		{
			GUI.enabled = true;
			var point : Vector3 = Camera.main.WorldToScreenPoint(gameObject.transform.position);
			
			point.y = Screen.height - point.y; //adjust height point
				
			if(point.y < 0) //Adjust y value of button for screen space
				point.y -= Screen.height;
			var heldUpgradeRect:Rect = Rect(point.x + heldUpgradeButtonOffset.x, 
							point.y + heldUpgradeButtonOffset.y, upgradeButtonWidth, upgradeButtonHeight);
	
			GUI.Button(heldUpgradeRect, heldUpgradeIcon);
		}
	}
}

// represents upgrades
enum UpgradeType // to be changed
{
	None,
	Blue,
	Green,
	Orange,
	Pink,
	Purple,
	Teal,
	Yellow
}