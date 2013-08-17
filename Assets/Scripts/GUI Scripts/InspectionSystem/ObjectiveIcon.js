#pragma strict

public class ObjectiveIcon extends InspectionComponent
{
	private var position : Transform;

	private var iconWidthScale: float = .05; 	//The percent of the screens width that the Upgrade texture is wide. 
	private var iconWidth: float; 				//The actual width in pixels of the Upgrade image
	
	private var floatPercent: float = .10; 			//The percent of the screens height that the Upgrade GUI floats above the object
	private var floatHeight: float; 				//The actual height the Upgrade appears to float
	
	private var screenPosition:Vector3;

	private var iconOpacity:float = .50; 		//The opacity of the upgrade 1 = Normal, 0 = Invisible
	private var colorOpacity: Color;				//The color to convert to before drawing the Upgrade. Value of (1.0, 1.0, 1.0, .25) results in 25% opacity
	
	private var iconObject : GameObject;
	
	private var turnMesh : TextMesh;
	
	private var isPrimary : boolean = true;
	
	private var iconScale : Vector3 = Vector3(7,7,7);

	public function Initialize(pos : Transform, icon : Texture2D, text : String, pic : Texture2D,
								type : BuildingEventType, turns : int)
	{
		// slant icon slightly forward towards the camera
		//Moved this elsewhere so text and icon have same rotation (see below) (GPC 8/16/13)
		//gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
		
		// set icon textures
		normalTexture = icon;
		selectedTexture = icon;
		renderer.material.mainTexture = normalTexture;
		// flip texture so not upside-down
		renderer.material.mainTextureScale = Vector2(-1,-1);
		renderer.material.mainTextureOffset = Vector2(1,1);
		
		position = pos;
		
		// set icon height above the terrain
		//transform.position.y = 50;
		
		//Modified local and world coordinates so they don't overlap over resource icons (GPC 8/16/13)
		transform.position.y += 80;
		transform.localPosition.y += 75;
		
		gameObject.transform.localScale = iconScale;
		
		//Removing this so text can overlap over icon (GPC 8/16/13)
		//gameObject.layer = 10;
		
		// set-up turn timer object
		var temp : GameObject = Instantiate(Resources.Load("ObjectiveTurnText") as GameObject, transform.position, Quaternion.Euler(90, 0, 0));
		
		//Tweaking icon position and scale (GPC 8/16/13)
		temp.transform.localPosition += Vector3(-25,5,-5);
		temp.transform.localScale = Vector3(1.25,1.25,1.25);
		
		turnMesh = temp.GetComponent(TextMesh);
		if (type == BuildingEventType.Secondary)
		{
			turnMesh.active = false;
			isPrimary = false;
		}
		else
			turnMesh.text = String.Empty + turns;
		
		
		//Added by GPC 8/16/13
		temp.transform.parent = gameObject.transform;
		
		//Moved here so timer and text both have the same angle (GPC 8/16/13)
		gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
				
		Initialize(text, pic);
	}
	
	public function OnSelected()
	{
		SendToDisplay();
	}
	
	public function SetActive(active : boolean)
	{
		super(active);
		renderer.enabled = isActive;
		if (isPrimary)
			turnMesh.active = isActive;
	}
	
	public function Draw()
	{
		super();
	}
	
	public function DrawTime(turnsLeft : String)
	{
		turnMesh.text = turnsLeft;
	}
}