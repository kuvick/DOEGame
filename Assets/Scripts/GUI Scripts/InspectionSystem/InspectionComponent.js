#pragma strict

public class InspectionComponent
{
	public var dispText : String = String.Empty;
	protected var display : InspectionDisplay;
	
	protected var texture : Texture2D;
	protected var textureSize : float;
	protected var rect : Rect;
	protected var isActive : boolean = true;
	protected var isSelected : boolean = false;
	
	protected var selectedTexture : Texture2D;
	
	protected var skin : GUISkin;
	private var textSize : float;
	private var textSizeScale : float = .015;
	
	public function Initialize(text : String)
	{
		display = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
		dispText = text;
		selectedTexture = Resources.Load("hex_click") as Texture2D;
		skin = GUISkin();
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
		if (isSelected)
			SelectedButtonStyle();
		else
			BlankButtonStyle();
	}
	
	public function SetActive(active : boolean)
	{
		isActive = active;
	}
	
	public function SetSelected(selected : boolean)
	{
		isSelected = selected;
	}
	
	public function SetRect (rect : Rect)
	{
		this.rect = rect;
	}
	
	public function SetTexture (tex : Texture2D)
	{
		texture = tex;
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