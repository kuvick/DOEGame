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
	
	//Added to adjust icon scaling (GPC 8/16/13)
	private var iconScale : Vector3 = Vector3(6,6,6);
	
	public function Initialize (building : GameObject, id : UpgradeID, icon : Texture2D, inspIcon : Texture2D, disp : Tooltip)
	{
		// slant icon slightly forward towards the camera
		gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
		
		this.building = building;
		this.id = id;
		
		// set icon textures
		normalTexture = icon;
		selectedTexture = inspIcon;
		renderer.material.mainTexture = normalTexture;
		// flip texture so not upside-down
		renderer.material.mainTextureScale = Vector2(-1,-1);
		renderer.material.mainTextureOffset = Vector2(1,1);
		
		gameObject.layer = 10;
		
		// set icon height above terrain
		//transform.position.y = 50;
		
		//Added to adjust icon scale and positioning (GPC 8/16/13)
		transform.position.y += 80;
		transform.localPosition.y += 60;
		
		gameObject.transform.localScale = iconScale;
		
		Initialize(disp);
	}
	
	public function Initialize (building : GameObject, id : UpgradeID, icon : Texture2D, text : String, pic : Texture2D)
	{
		// slant icon slightly forward towards the camera
		gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
		
		this.building = building;
		this.id = id;
		
		// set icon textures
		normalTexture = icon;
		selectedTexture = icon;
		renderer.material.mainTexture = normalTexture;
		// flip texture so not upside-down
		renderer.material.mainTextureScale = Vector2(-1,-1);
		renderer.material.mainTextureOffset = Vector2(1,1);
		
		// set icon height above terrain
		//transform.position.y = 50;
		
		//Added to adjust icon scale and positioning (GPC 8/16/13)
		transform.position.y += 80;
		transform.localPosition.y += 60;
		
		gameObject.transform.localScale = iconScale;
		
		Initialize(text, pic);
	}
	
	public function BuildingEquals (b : GameObject) : boolean
	{
		return building == b;
	}
	
	public function Draw()
	{
		super();
		renderer.enabled = isActive;
	}
	
	public function SetSelected(selected : boolean)
	{
		super(selected);
		renderer.material.mainTexture = currentTexture;
	}
	
	public function SetActive(active : boolean)
	{
		super(active);
		if(active)
		{
			renderer.enabled = true;
			if(wasCollected)
			{
				transform.localScale = originalScale;
				wasCollected = false;
			}
		}
		else
		{
			wasCollected = true;
			firstLoop = true;
		}
	}
	
	public function OnSelected()
	{
		SendToDisplay();
	}
	
	private var wasCollected:boolean = false;
	private var firstLoop:boolean = true;
	private var originalScale:Vector3;
	private var speed:float = 0.05;
	private var switchScale:boolean = false;
	function Update()
	{
		if(wasCollected)
		{
			if(firstLoop)
			{
				originalScale = transform.localScale;
				switchScale = false;
				firstLoop = false;				
			}
			
			if(!switchScale)
			{
				transform.localScale += Vector3((originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed);
				
				if(transform.localScale.x >= originalScale.x * 2)
					switchScale = true;
			}
			else
			{
				transform.localScale -= Vector3((originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed);
			}
			
			if(transform.localScale.x <= 0.1)
			{
				renderer.enabled = false;
				transform.localScale = originalScale;
				wasCollected = false;
			}
		}	
	}// end of Update
}






