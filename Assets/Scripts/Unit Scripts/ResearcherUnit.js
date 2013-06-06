/*
ResearcherUnit.js
By Derrick Huey
*/
#pragma strict

class ResearcherUnit extends Unit {
	public var heldUpgrade : UpgradeID = UpgradeID.None; // represents the upgrade the researcher is holding
	private var heldUpgradeIcon : Texture; // icon to draw for held upgrade
	private var heldUpgradeButtonOffset:Vector2 = new Vector2(-14, -50);	//Used to set position of button relative to building
	private var upgradeButtonWidth = 27;
	private var upgradeButtonHeight = 27;
	private var manager : UnitManager;
	private var upgradeManager : UpgradeManager;
	
	public var upgradePickedUpScore : int = 15;
	//private var intelSystem : IntelSystem;

	function Start () {
		super();
		type = UnitType.Researcher; // set unit type
		manager = gameObject.FindGameObjectWithTag("MainCamera").GetComponent("UnitManager"); // find Unit Manager
		upgradeManager = GameObject.Find("Database").GetComponent(UpgradeManager);
		if (heldUpgrade != UpgradeID.None) // if holding an upgrade, get the appropriate icon
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
	}
	
	// Checks that the target building either is holding or needs an upgrade
	protected function BuildingCheck (target : BuildingOnGrid)
	{
		if (!super(target) || heldUpgrade != GetBuildingEventUpgrade(target) || (target.heldUpgradeID == UpgradeID.None && GetBuildingEventUpgrade(target) == UpgradeID.None))
			return false;
		return true;
	}
	
	// finds and returns the upgrade type associated with the passed in building's event
	private function GetBuildingEventUpgrade (building : BuildingOnGrid) : UpgradeID
	{
		if (!building.hasEvent)
			return UpgradeID.None;
		var buildingEventScript : EventScript = building.buildingPointer.GetComponent("EventScript");
		return buildingEventScript.event.upgrade;
	}
	
	function DoAction() 
	{
		if (currentPath.Count < 1)
			return;
		super();
		var tempHeld : UpgradeID = UpgradeID.None; // used if an upgrade was picked up
		var tempPickUp : UpgradeID = UpgradeID.None; // used for if an upgrade was picked up
		// after moving buildings, checks if the new building is either 
		// holding a new upgrade
		if (currentBuilding.heldUpgradeID != UpgradeID.None)
		{
			// if so, discard currently held upgrade and pick up the new one
			tempHeld = heldUpgrade;
			heldUpgrade = currentBuilding.heldUpgradeID;
			tempPickUp = heldUpgrade;  // Unit picks up an Upgrade
			intelSystem.incrementScore(true, upgradePickedUpScore); //If an Upgrade with picked up, increment score
			currentBuilding.heldUpgradeID = UpgradeID.None;
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
			upgradeManager.PickupUpgrade(currentBuilding.buildingPointer, heldUpgrade);
		}
		// or needs the currently held upgrade
		else if (GetBuildingEventUpgrade(currentBuilding) != UpgradeID.None &&
					upgradeManager.CheckUpgradeComplete(GetBuildingEventUpgrade(currentBuilding)))//GetBuildingEventUpgrade(currentBuilding) == heldUpgrade)
		{
			// if so, satisfy upgrade need and display a temporary message on the status marquee
			//currentBuilding.neededUpgrade = UpgradeID.None;
			tempHeld = heldUpgrade;
			intelSystem.resolveEvent(currentBuilding.buildingPointer.GetComponent("EventScript"));
			//StatusMarquee.SetText("Upgrade delivered", true);	
			tempHeld = heldUpgrade;
		}
		else
			tempHeld = heldUpgrade;
		actionList.Add(new UnitAction(previousBuilding, intelSystem.currentTurn - 1, tempPickUp, tempHeld));
	}
	
	function UndoAction ()
	{
		//foundPath.Clear();
		//currentPath = FindPath(currentTarget);
		//CheckPathBroken();
		if (actionList.Count < 1)
			return;
		// if the current turn is the proper undo turn
		if (intelSystem.currentTurn == actionList[actionList.Count - 1].turn)
		{
			// replace a picked up upgrade and regains the old held upgrade
			currentBuilding.heldUpgradeID = actionList[actionList.Count - 1].pickedUpUpgrade;
			
			//If an Upgrade with picked up, decrement score
			if(actionList[actionList.Count - 1].pickedUpUpgrade != UpgradeID.None)
			{
				intelSystem.decrementScore(true, upgradePickedUpScore);
				upgradeManager.ReturnUpgrade(currentBuilding.buildingPointer, actionList[actionList.Count - 1].pickedUpUpgrade);
			}
			
			heldUpgrade = actionList[actionList.Count - 1].heldUpgrade;
			if (heldUpgrade != UpgradeID.None)
				heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
			super();
		}		
	}
}

// represents upgrades
enum UpgradeID // to be changed
{
	None,
	First,
	Second,
	Third,
	Fourth,
	Fifth,
	Sixth,
	Dummy
}