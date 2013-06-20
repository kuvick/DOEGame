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

	public function Initialize(pos : Transform, icon : Texture2D, text : String, pic : Texture2D,
								type : BuildingEventType)
	{
		colorOpacity = Color(1.0, 1.0, 1.0, iconOpacity);
		texture = icon;
		position = pos;
		/*iconWidth = Screen.width * iconWidthScale;
		floatHeight = floatPercent * Screen.height;
		rect = Rect(0,0, iconWidth, iconWidth);*/
		transform.position.y = 50;
		renderer.material.mainTexture = texture;
		renderer.material.mainTextureScale = Vector2(-1,-1);
		renderer.material.mainTextureOffset = Vector2(1,1);
		renderer.material.color = colorOpacity;
		//turnMesh = gameObject.AddComponent(TextMesh);
		var temp : GameObject = Instantiate(Resources.Load("ObjectiveTurnText") as GameObject, transform.position, Quaternion.Euler(90, 0, 0));
		temp.transform.position.x -= 25;
		turnMesh = temp.GetComponent(TextMesh);
		if (type == BuildingEventType.Secondary)
			turnMesh.active = false;
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
	}

	public function Update()
	{
		//Update Position of Image
		screenPosition = Camera.mainCamera.WorldToScreenPoint(position.position);	
	
		//Update bounds, and convert screen coords to GUI coords
		rect.x = screenPosition.x - iconWidth/2; 
		rect.y = Screen.height - screenPosition.y - floatHeight; 
	}
	
	public function Draw()
	{
		super();
		/*super();
		GUI.color = colorOpacity;
		if (GUI.Button(rect, texture))
			SendToDisplay();//display.Activate(dispText, this);
		GUI.color = Color(1.0, 1.0, 1.0, 1.0);*/
	}
	
	public function DrawTime(turnsLeft : String)
	{
		/*var tempRect : Rect = Rect(rect.x + iconWidth, rect.y, 30, 30); 
		
		GUI.Label(tempRect, turnsLeft);*/
		//turnMesh.text = turnsLeft;
		turnMesh.text = turnsLeft;
	}
}