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

	public function Initialize(pos : Transform, icon : Texture2D, text : String)
	{
		colorOpacity = Color(1.0, 1.0, 1.0, iconOpacity);
		texture = icon;
		position = pos;
		iconWidth = Screen.width * iconWidthScale;
		floatHeight = floatPercent * Screen.height;
		rect = Rect(0,0, iconWidth, iconWidth);
		Initialize(text);
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
		GUI.color = colorOpacity;
		if (GUI.Button(rect, texture))
			display.Activate(dispText);
		GUI.color = Color(1.0, 1.0, 1.0, 1.0);
	}
	
	public function DrawTime(turnsLeft : String)
	{
		var tempRect : Rect = Rect(rect.x + iconWidth, rect.y, 30, 30); 
		
		GUI.Label(tempRect, turnsLeft);
	}
}