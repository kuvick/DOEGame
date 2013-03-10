public class NarrativeUI extends GUIControl
{
	public var narrativeSlides : Texture[];
	public var nextButton : Texture;
	public var skipButton : Texture;
	public var narrativeSkin : GUISkin;
	public var levelToLoad : String = "DOEGame";
	
	
	// Start Screen rectangles
	private var slide:Rect;
	private var skip:Rect;
	private var next:Rect;

	private var skipButtonHeight:float;
	private var skipButtonWidth:float;
	private var skipButtonHeightPercent:float = 0.13;
	private var skipButtonRatio:float = 2.15;
	
	private var nextButtonHeight:float;
	private var nextButtonWidth:float;
	private var nextButtonHeightPercent:float = 0.10;
	private var nextButtonRatio:float = 2.22;
	
	private var slideHeight:float;
	private var slideWidth:float;
	private var slideRatio:float = 0.5625;
	
	private var topSlide: float;
	
	private var currentSlide;
	

	public function Start () 
	{
		super.Start();
		super.Initialize();
		
		currentSlide = 0;
		
		skipButtonHeight = skipButtonHeightPercent * screenHeight;
		skipButtonWidth = skipButtonHeight * skipButtonRatio;
		
		nextButtonHeight = nextButtonHeightPercent * screenHeight;
		nextButtonWidth = nextButtonHeight * nextButtonRatio;
		
		slideWidth = screenWidth;
		slideHeight = slideWidth * slideRatio;
		
		topSlide = ((screenHeight + (horizontalBarHeight*2))/ 2)  - (slideHeight / 2);
		bottomSlide = topSlide + slideHeight;
		
		slide = Rect(verticalBarWidth, topSlide, slideWidth, slideHeight);
		skip = Rect(screenWidth + verticalBarWidth - skipButtonWidth, topSlide, skipButtonWidth, skipButtonHeight);
		next = Rect(screenWidth + verticalBarWidth - nextButtonWidth, bottomSlide - nextButtonHeight, nextButtonWidth, nextButtonHeight);
		
	}
	
	public function OnGUI()
	{
		GUI.skin = narrativeSkin;
		GUI.DrawTexture(slide, narrativeSlides[currentSlide]);
		
		GUI.DrawTexture(skip, skipButton);
		if (GUI.Button(skip, ""))
		{
			LoadLevel();
		}
		
		GUI.DrawTexture(next, nextButton);
		if (GUI.Button(next, ""))
		{
			if(currentSlide < narrativeSlides.Length - 1)
			{
				currentSlide++;
			}
			else
			{
				LoadLevel();
			}
		}
	}
	
	//Would eventually set this to the loading screen, but for now since there are errors...
	private function LoadLevel()
	{
		Application.LoadLevel(levelToLoad);
	}
}
