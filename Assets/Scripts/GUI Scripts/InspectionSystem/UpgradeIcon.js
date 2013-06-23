#pragma strict

public class UpgradeIcon extends InspectionComponent
{
	private var building : GameObject; // building the upgrade part is on
	public var id : UpgradeID; // id of the upgrade
	
	private var heldUpgradeButtonOffset:Vector2 = new Vector2(-20, -50);	//Used to set position of button relative to building
	private var neededUpgradeButtonOffset:Vector2 = new Vector2(10, -50);
	private var upgradeButtonWidth = 32;
	private var upgradeButtonHeight = 32;
	
	private var iconObject : GameObject;
	
	public function Initialize (building : GameObject, id : UpgradeID, text : String, pic : Texture2D)
	{
		this.building = building;
		this.id = id;
		normalTexture = (GameObject.FindObjectOfType(UnitManager) as UnitManager).GetUpgradeIcon(this.id - 1);
		selectedTexture = (GameObject.FindObjectOfType(UnitManager) as UnitManager).GetUpgradeIcon(this.id - 1);
		//iconObject = MonoBehaviour.Instantiate(Resources.Load("IconPlane") as GameObject, this.building.transform.position, Quaternion.identity);
		transform.position.y = 50;
		renderer.material.mainTexture = normalTexture;
		renderer.material.mainTextureScale = Vector2(-1,-1);
		renderer.material.mainTextureOffset = Vector2(1,1);
		Initialize(text, pic);
	}
	
	public function BuildingEquals (b : GameObject) : boolean
	{
		return building == b;
	}
	
	public function Draw()
	{
		super();
		/*super();
		if (isActive)
		{
			var point : Vector3 = Camera.main.WorldToScreenPoint(building.transform.position);
			
			point.y = Screen.height - point.y; //adjust height point
			
			if(point.y < 0) //Adjust y value of button for screen space
				point.y -= Screen.height;
			
			var rect = Rect(point.x + heldUpgradeButtonOffset.x, 
							point.y + heldUpgradeButtonOffset.y, upgradeButtonWidth, upgradeButtonHeight);
			if (GUI.Button(rect, texture))
				SendToDisplay();//display.Activate(dispText, this);
		}*/
		renderer.enabled = isActive;
	}
	
	public function OnSelected()
	{
		SendToDisplay();
	}
}