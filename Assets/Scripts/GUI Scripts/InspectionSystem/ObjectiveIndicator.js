#pragma strict
public class ObjectiveIndicator extends InspectionComponent
{
	//private var textureSize : float;
	private var rotAngle : float = 0;
	//private var rect : Rect;
	 
	private var screenPos : Vector2;
	
	private var target : Transform;
	private var targetScreenPos : Vector3;
	private var screenMiddle : Vector3;
	
	private var doDraw : boolean = false;
	
	public function Initialize(targ : Transform, desc : String, type : int)
	{
		texture = Resources.Load("indicator_arrow" + type) as Texture2D;
	    target = targ;
	    screenMiddle = Vector3(Screen.width/2, Screen.height/2, 0);
	    textureSize = .1 * Screen.height;
	    rect = Rect(screenMiddle.x - textureSize / 2, Screen.height - (.1 * Screen.height), textureSize, textureSize);
	    //display = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
	    Initialize(desc);
	} 
	
	 
	public function Update() 
	{
	    targetScreenPos = Camera.main.WorldToScreenPoint(target.position);
	    /*if (targetScreenPos.z < 0)
	    	targetScreenPos *= -1;*/
	    screenPos.y = Screen.height-screenPos.y;
	    if (targetScreenPos.z > 0 && targetScreenPos.x > 0 && targetScreenPos.x < Screen.width &&
	    		targetScreenPos.y > 0 && targetScreenPos.y < Screen.height)
	    	doDraw = false;
	    else
	    	doDraw = true;
	    rotAngle = (Mathf.Atan2(targetScreenPos.x-screenMiddle.x,Screen.height-targetScreenPos.y-screenMiddle.y) * Mathf.Rad2Deg) * -1;
	    //if (rotAngle < 0) rotAngle +=360;
	}
	 
	public function Draw() 
	{
		if (doDraw)
		{
			BlankButtonStyle();
		    var matrixBackup : Matrix4x4 = GUI.matrix;
		    GUIUtility.RotateAroundPivot(rotAngle, screenMiddle);
		    if(GUI.Button(rect, texture))
		    	display.Activate(dispText);
		    GUI.matrix = matrixBackup;
	    }
	}
}