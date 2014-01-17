#pragma strict

public class TransparentGradientTexture
{
	public var topTexture:Texture;
	public var bottomTexture:Texture;
	public var topTransparency:float;
	public var bottomTransparency:float;
	
	public function TransparentGradientTexture(topText:Texture, bottomText:Texture, topTransp:float, bottomTransp:float)
	{
		topTexture = topText;
		bottomTexture = bottomText;
		topTransparency = topTransp;
		bottomTransparency = bottomTransp;
	}
	
	public function Display(rect:Rect)
	{
		GUI.color.a = bottomTransparency;
		GUI.DrawTexture(rect, bottomTexture, ScaleMode.StretchToFill);
		GUI.color.a = topTransparency;
		GUI.DrawTexture(rect, topTexture, ScaleMode.StretchToFill);
		GUI.color.a = 1.0f;
	}
}// end of TransparentGradientTexture