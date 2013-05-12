#pragma strict

public class InspectionComponent
{
	public var dispText : String = String.Empty;
	protected var display : InspectionDisplay;
	
	protected var texture : Texture2D;
	protected var textureSize : float;
	protected var rect : Rect;
	
	public function Initialize(text : String)
	{
		display = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
		dispText = text;
	}
	
	public function Update()
	{
		
	}
	
	public function Draw()
	{
		
	}
	
	protected function BlankButtonStyle()
	{
		GUI.skin.button.normal.background = null;
		GUI.skin.button.active.background = null;
		GUI.skin.button.hover.background = null;
	}
}