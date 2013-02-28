/*
ResearcherUnit.js
By Derrick Huey
*/
#pragma strict

class ResearcherUnit extends Unit {
	public var heldUpgrade : UpgradeType = UpgradeType.NONE; // represents the upgrade the researcher is holding
	private var heldUpgradeIcon : Texture; // icon to draw for held upgrade
	private var heldUpgradeButtonOffset:Vector2 = new Vector2(-14, -50);	//Used to set position of button relative to building
	private var upgradeButtonWidth = 27;
	private var upgradeButtonHeight = 27;
	private var manager : UnitManager;

	function Start () {
		super();
		type = UnitType.Researcher; // set unit type
		manager = gameObject.FindGameObjectWithTag("MainCamera").GetComponent("UnitManager"); // find Unit Manager
		if (heldUpgrade != UpgradeType.NONE) // if holding an upgrade, get the appropriate icon
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
	}
	
	function DoAction() {
		super();
		// after moving buildings, checks if the new building is either 
		// holding a new upgrade
		if (currentBuilding.heldUpgrade != UpgradeType.NONE)
		{
			// if so, discard currently held upgrade and pick up the new one
			heldUpgrade = currentBuilding.heldUpgrade;
			currentBuilding.heldUpgrade = UpgradeType.NONE;
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
		}
		// or needs the currently held upgrade
		else if (currentBuilding.neededUpgrade != UpgradeType.NONE &&
					currentBuilding.neededUpgrade == heldUpgrade)
		{
			// if so, satisfy upgrade need and display a temporary message on the status marquee
			currentBuilding.neededUpgrade = UpgradeType.NONE;
			StatusMarquee.SetText("Upgrade delivered", true);	
		}
	}
	
	function OnGUI()
	{
		super();
		// if holding an upgrade, draw an icon to indicate so
		if (heldUpgrade != UpgradeType.NONE)
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
	NONE,
	BLUE,
	GREEN,
	ORANGE,
	PINK,
	PURPLE,
	TEAL,
	YELLOW
}