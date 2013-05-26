#pragma strict

public class UpgradeIcon extends InspectionComponent
{
	private var building : GameObject; // building the upgrade part is on
	public var id : UpgradeID; // id of the upgrade
	
	private var heldUpgradeButtonOffset:Vector2 = new Vector2(-20, -50);	//Used to set position of button relative to building
	private var neededUpgradeButtonOffset:Vector2 = new Vector2(10, -50);
	private var upgradeButtonWidth = 32;
	private var upgradeButtonHeight = 32;
	
	public function Initialize (building : GameObject, id : UpgradeID, text : String)
	{
		this.building = building;
		this.id = id;
		texture = (GameObject.FindObjectOfType(UnitManager) as UnitManager).GetUpgradeIcon(this.id - 1);
		Initialize(text);
	}
	
	public function BuildingEquals (b : GameObject) : boolean
	{
		return building == b;
	}
	
	public function Draw()
	{
		if (isActive)
		{
			var point : Vector3 = Camera.main.WorldToScreenPoint(building.transform.position);
			
			point.y = Screen.height - point.y; //adjust height point
			
			if(point.y < 0) //Adjust y value of button for screen space
				point.y -= Screen.height;
			
			var rect = Rect(point.x + heldUpgradeButtonOffset.x, 
							point.y + heldUpgradeButtonOffset.y, upgradeButtonWidth, upgradeButtonHeight);
			BlankButtonStyle();
			if (GUI.Button(rect, texture))
				display.Activate(dispText);
		}
	}
}