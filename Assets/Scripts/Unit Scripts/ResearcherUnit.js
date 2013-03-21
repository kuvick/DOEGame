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
	
	public var upgradePickedUpScore : int = 15;
	//private var intelSystem : IntelSystem;

	function Start () {
		super();
		type = UnitType.Researcher; // set unit type
		manager = gameObject.FindGameObjectWithTag("MainCamera").GetComponent("UnitManager"); // find Unit Manager
		//intelSystem = GameObject.Find("Database").GetComponent(IntelSystem); // find Intel System
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
	
	function DoAction() 
	{
		if (foundPath.Count < 1)
			return;
		super();
		var tempHeld : UpgradeType = UpgradeType.None; // used if an upgrade was picked up
		var tempPickUp : UpgradeType = UpgradeType.None; // used for if an upgrade was picked up
		// after moving buildings, checks if the new building is either 
		// holding a new upgrade
		if (currentBuilding.heldUpgrade != UpgradeType.None)
		{
			// if so, discard currently held upgrade and pick up the new one
			tempHeld = heldUpgrade;
			heldUpgrade = currentBuilding.heldUpgrade;
			tempPickUp = heldUpgrade;  // Unit picks up an Upgrade
			intelSystem.incrementScore(true, upgradePickedUpScore); //If an Upgrade with picked up, increment score
			currentBuilding.heldUpgrade = UpgradeType.None;
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
		}
		// or needs the currently held upgrade
		else if (GetBuildingEventUpgrade(currentBuilding) != UpgradeType.None &&
					GetBuildingEventUpgrade(currentBuilding) == heldUpgrade)
		{
			// if so, satisfy upgrade need and display a temporary message on the status marquee
			//currentBuilding.neededUpgrade = UpgradeType.None;
			tempHeld = heldUpgrade;
			intelSystem.resolveEvent(currentBuilding.buildingPointer.GetComponent("EventScript"));
			StatusMarquee.SetText("Upgrade delivered", true);	
			tempHeld = heldUpgrade;
		}
		else
			tempHeld = heldUpgrade;
		actionList.Add(new UnitAction(previousBuilding, intelSystem.currentTurn - 1, tempPickUp, tempHeld));
	}
	
	function UndoAction ()
	{
		foundPath.Clear();
		FindPath(currentTarget);
		if (actionList.Count < 1)
			return;
		// if the current turn is the proper undo turn
		if (intelSystem.currentTurn == actionList[actionList.Count - 1].turn)
		{
			// replace a picked up upgrade and regains the old held upgrade
			currentBuilding.heldUpgrade = actionList[actionList.Count - 1].pickedUpUpgrade;
			
			//If an Upgrade with picked up, decrement score
			if(actionList[actionList.Count - 1].pickedUpUpgrade != UpgradeType.None)
				intelSystem.decrementScore(true, upgradePickedUpScore);
			
			heldUpgrade = actionList[actionList.Count - 1].heldUpgrade;
			if (heldUpgrade != UpgradeType.None)
				heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
			super();
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