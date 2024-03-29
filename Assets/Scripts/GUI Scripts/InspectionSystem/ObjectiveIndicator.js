#pragma strict
public class ObjectiveIndicator extends InspectionComponent
{
	//private var textureSize : float;
	private var rotAngleDeg : float = 0;
	private var rotAngleRad : float = 0;
	//private var rect : Rect;
	 
	private var screenPos : Vector2;
	
	private var target : Transform;
	private var targetScreenPos : Vector3;
	private var screenMiddle : Vector3;
	
	private var radius : float;
	private var radiusScale : float = .375f;
	
	private var turnRect : Rect;
	private var turnSize : float;
	private var turnSizeScale : float = .075f;
	
	private var textureSizeScale : float = .1f;
	
	private var attachedEvent : BuildingEvent;
	
	private var isPrimary : boolean = true;
	
	//private var doDraw : boolean = false;
	
	public function Initialize(targ : Transform, event : BuildingEvent, type : int)//desc : String, type : int)
	{
		var hasUpgrade : int = 0;
		if (event.upgrade != UpgradeID.None)
			hasUpgrade = 1;
		attachedEvent = event;
		normalTexture = Resources.Load("indicator_arrow" + type + hasUpgrade) as Texture2D;
		selectedTexture = Resources.Load("indicator_arrow" + type + hasUpgrade) as Texture2D;
	    target = targ;
	    screenMiddle = Vector3(Screen.width/2, Screen.height/2, 0);
	    textureSize = textureSizeScale * Screen.height;
	    var textureWidthScale : float = 328f / 509f;
	   // Debug.Log(textureWidthScale);
	    var textureWidth : float = textureSize * textureWidthScale;
	    rect = Rect(screenMiddle.x - textureWidth / 2, Screen.height - (.1 * Screen.height), textureSize, textureSize);
	    turnSize = turnSizeScale * Screen.height;
	    turnRect = Rect(0,0, turnSize, turnSize);
	    radius = Screen.height * radiusScale;
	    isActive = false;
	    isPrimary = (type == 0);
	    //display = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
	    //Initialize(event.description, event.tooltipPic);
	    Initialize(event.tooltip);
	} 
	
	 
	public function Update() 
	{
	    targetScreenPos = Camera.main.WorldToScreenPoint(target.position);
	    /*if (targetScreenPos.z < 0)
	    	targetScreenPos *= -1;*/
	    screenPos.y = Screen.height-screenPos.y;
	    if (targetScreenPos.z > 0 && targetScreenPos.x > 0 && targetScreenPos.x < Screen.width &&
	    		targetScreenPos.y > 0 && targetScreenPos.y < Screen.height)
	    	isActive = false;
	    else
	    	isActive = true;
	    rotAngleRad = Mathf.Atan2(targetScreenPos.x-screenMiddle.x,Screen.height-targetScreenPos.y-screenMiddle.y) * -1;
	    rotAngleDeg = rotAngleRad * Mathf.Rad2Deg;
	    turnRect.x = (screenMiddle.x + (Mathf.Cos(rotAngleRad + (Mathf.PI / 2)) * radius)) - (turnSize / 2);
	    turnRect.y = screenMiddle.y + (Mathf.Sin(rotAngleRad + (Mathf.PI / 2)) * radius) - (turnSize / 2);
	    //if (rotAngle < 0) rotAngle +=360;
	}
	 
	public function Draw() 
	{
		super();
		if (isActive)
		{
		    var matrixBackup : Matrix4x4 = GUI.matrix;
		    GUIUtility.RotateAroundPivot(rotAngleDeg, screenMiddle);
		    if(GUI.Button(rect, currentTexture))
		    {
		    	SendToDisplay();//display.Activate(dispText, this);
		    	Debug.Log("Angle: " + rotAngleDeg);
		    }
		    GUI.matrix = matrixBackup;
		    if (isPrimary)
		    	GUI.Button(turnRect, String.Empty + attachedEvent.time);
	    }
	}
}