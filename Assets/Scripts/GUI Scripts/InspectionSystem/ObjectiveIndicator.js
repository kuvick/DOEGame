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
	private var radiusScale : float = .375;
	
	private var turnRect : Rect;
	private var turnSize : float;
	private var turnSizeScale : float = .075;
	
	private var textureSizeScale = .1;
	
	private var attachedEvent : BuildingEvent;
	
	//private var doDraw : boolean = false;
	
	public function Initialize(targ : Transform, event : BuildingEvent, type : int)//desc : String, type : int)
	{
		attachedEvent = event;
		texture = Resources.Load("indicator_arrow" + type) as Texture2D;
	    target = targ;
	    screenMiddle = Vector3(Screen.width/2, Screen.height/2, 0);
	    textureSize = textureSizeScale * Screen.height;
	    rect = Rect(screenMiddle.x - textureSize / 2, Screen.height - (.1 * Screen.height), textureSize, textureSize);
	    turnSize = turnSizeScale * Screen.height;
	    turnRect = Rect(0,0, turnSize, turnSize);
	    radius = Screen.height * radiusScale;
	    isActive = false;
	    //display = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
	    Initialize(event.description);
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
		    if(GUI.Button(rect, texture))
		    {
		    	display.Activate(dispText, this);
		    	Debug.Log("Angle: " + rotAngleDeg);
		    }
		    GUI.matrix = matrixBackup;
		    GUI.Button(turnRect, String.Empty + attachedEvent.time);
	    }
	}
}