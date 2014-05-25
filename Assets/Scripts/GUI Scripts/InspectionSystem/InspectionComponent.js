#pragma strict
public class InspectionComponent extends MonoBehaviour
{
	public var dispText : String = String.Empty;
	public var dispPic : Texture2D = null;
	public var tooltip : Tooltip;
	protected var display : InspectionDisplay;
	
	protected var currentTexture : Texture2D;
	protected var normalTexture : Texture2D;
	protected var textureSize : float;
	protected var rect : Rect;
	protected var isActive : boolean = true;
	protected var isSelected : boolean = false;
	
	protected var selectedTexture : Texture2D;
	
	protected var skin : GUISkin;
	private var textSize : float;
	private var textSizeScale : float = .015;
	
	public function Initialize(disp : Tooltip)
	{
		display = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
		if (!display)
			Debug.LogWarning("display not found");
		tooltip = disp;
		SetSelected(false);//currentTexture = normalTexture;
		//skin = GUISkin();
		skin = ScriptableObject.CreateInstance(GUISkin);
		skin.font = Resources.Load("Orbitron-Bold") as Font;
		textSize = Screen.width * textSizeScale;
		skin.button.fontSize = textSize;
		skin.button.normal.textColor = Color.white;
		skin.button.hover.textColor = Color.white;
		skin.button.active.textColor = Color.white;
		skin.button.alignment = TextAnchor.MiddleCenter;
	}
	
	public function Initialize(text : String, pic : Texture2D)
	{
		display = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
		if (!display)
			Debug.LogWarning("display not found");
		dispText = text;
		dispPic = pic;
		//selectedTexture = Resources.Load("hex_click") as Texture2D;
		SetSelected(false);//currentTexture = normalTexture;
		//skin = GUISkin();
		skin = ScriptableObject.CreateInstance(GUISkin);
		skin.font = Resources.Load("Orbitron-Bold") as Font;
		textSize = Screen.width * textSizeScale;
		skin.button.fontSize = textSize;
		skin.button.normal.textColor = Color.white;
		skin.button.hover.textColor = Color.white;
		skin.button.active.textColor = Color.white;
		skin.button.alignment = TextAnchor.MiddleCenter;
	}
	
	public function Update()
	{
		
	}
	
	public function Draw()
	{
		GUI.skin = skin;
		/*if (isSelected)
			SelectedButtonStyle();
		else
			BlankButtonStyle();*/
	}
	
	public function SetActive(active : boolean)
	{
		isActive = active;
	}
	
	public function SetSelected(selected : boolean)
	{
		isSelected = selected;
		if (isSelected)
			currentTexture = selectedTexture;
		else
			currentTexture = normalTexture;
	}
	
	public function SetRect (rect : Rect)
	{
		this.rect = rect;
	}
	
	public function SetTexture (tex : Texture2D)
	{
		currentTexture = tex;
	}
	
	protected function SendToDisplay()
	{
		/*if (dispPic != null)
			display.Activate(dispPic, dispText, this, true);
		else
			display.Activate(dispText, this, true);*/
		display.Activate(tooltip, this);
	}
	
	// See ActivateAndDeactivate(disp : Tooltip) in InspectionDisplay
	protected function SendToDisplayFromHUD()
	{
		display.ActivateAndDeactivate(tooltip, this);
	}
	
	protected function BlankButtonStyle()
	{
		GUI.skin.button.normal.background = null;
		GUI.skin.button.active.background = null;
		GUI.skin.button.hover.background = null;
	}
	
	protected function SelectedButtonStyle()
	{
		GUI.skin.button.normal.background = selectedTexture;
		GUI.skin.button.active.background = selectedTexture;
		GUI.skin.button.hover.background = selectedTexture;
	}
}