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
	private var bottomSlide: float;
	
	private var currentSlide: float;
	
	//Metrics
	public var metrics : MetricContainer;
	private var skipTimes : List.<float>;
	//public var m_display : MetricDisplay;
	

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
		
		skipTimes  = new List.<float>();
		
		metrics = new MetricContainer();
		m_display = new MetricDisplay();
	}
	
	public function OnGUI()
	{
		GUI.skin = narrativeSkin;
		GUI.DrawTexture(slide, narrativeSlides[currentSlide]);
		
		GUI.DrawTexture(skip, skipButton);
		if (GUI.Button(skip, ""))
		{	
			metrics.Narrative.wasSkipped = true;
			LoadLevel();			
		}
		
		GUI.DrawTexture(next, nextButton);
		if (GUI.Button(next, ""))
		{
			if(currentSlide < narrativeSlides.Length - 1)
			{
				if(skipTimes.Count > 0)
				{
					skipTimes.Add(Time.timeSinceLevelLoad - skipTimes[skipTimes.Count - 1]);
				}
				else
					skipTimes.Add(Time.timeSinceLevelLoad);
								
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
		WriteMetricData();		
		//So it can pass to the loading screen where to go next
		var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
		nextLevel.nextLevel = levelToLoad;
		Application.LoadLevel("LoadingScreen");
	}
	
	private function WriteMetricData()
	{
		metrics.Narrative.timeSpentTotal = Time.timeSinceLevelLoad;
		metrics.Narrative.timeBeforeClick = skipTimes;				
		
		var sceneName :String = Application.loadedLevelName;
		if(sceneName.Contains(".unity"))
			sceneName.Remove(sceneName.Count - 6);
		
		var path : String = Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/NARRATIVE");
		if(!Directory.Exists(path))
			System.IO.Directory.CreateDirectory(Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/NARRATIVE"));													
		metrics.SaveNarrative(Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/NARRATIVE/"));	
	}
}
