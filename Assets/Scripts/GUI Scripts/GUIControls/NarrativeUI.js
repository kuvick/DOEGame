public class NarrativeUI extends GUIControl
{
	public var narrativeSlides : Texture[];
	public var nextButton : Texture;
	public var skipButton : Texture;
	public var narrativeSki : GUISkin;

	public function Start () 
	{
		super.Start();
		super.Initialize();
		Debug.Log("Start");
	}
	
	public function OnGUI()
	{
		Debug.Log("ongui");
	}
}
