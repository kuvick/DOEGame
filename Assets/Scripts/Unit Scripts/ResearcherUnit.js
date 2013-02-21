/*
ResearcherUnit.js
By Derrick Huey
*/
#pragma strict

class ResearcherUnit extends Unit {
	public var heldUpgrade : UpgradeType = UpgradeType.NONE;
	private var heldUpgradeIcon : Texture;
	private var heldUpgradeButtonOffset:Vector2 = new Vector2(-14, -50);	//Used to set position of button relative to building
	private var upgradeButtonWidth = 27;
	private var upgradeButtonHeight = 27;
	private var manager : UnitManager;

	function Start () {
		super();
		manager = gameObject.FindGameObjectWithTag("MainCamera").GetComponent("UnitManager");
		if (heldUpgrade != UpgradeType.NONE)
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
	}
	
	function DoAction() {
		super();
		if (currentBuilding.heldUpgrade != UpgradeType.NONE)
		{
			heldUpgrade = currentBuilding.heldUpgrade;
			currentBuilding.heldUpgrade = UpgradeType.NONE;
			heldUpgradeIcon = manager.GetUpgradeIcon(heldUpgrade - 1);
		}
		else if (currentBuilding.neededUpgrade != UpgradeType.NONE &&
					currentBuilding.neededUpgrade == heldUpgrade)
		{
			currentBuilding.neededUpgrade = UpgradeType.NONE;
			StatusMarquee.SetText("Upgrade delivered", true);	
		}
	}
	
	function OnGUI()
	{
		super();
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