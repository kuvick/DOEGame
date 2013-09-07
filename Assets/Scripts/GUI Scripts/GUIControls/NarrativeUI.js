public class NarrativeUI extends GUIControl
{
	public var narrativeSlides : Texture[];
	public var backButton : Texture;
	public var skipButton : Texture;
	public var replayButton : Texture;
	public var startButton : Texture;
	public var narrativeSkin : GUISkin;
	public var levelToLoad : String = "DOEGame";
	public var homeButton : Texture;
	
	
	// Start Screen rectangles
	private var slide:Rect;
	private var skip:Rect;
	private var back:Rect;
	private var start:Rect;
	private var replay:Rect;
	private var home:Rect;

	// Buttons
	private var skipX : float = 1577;
	private var skipY : float = 969;
	
	private var backX : float = 64;
	private var backY : float = 969;
	
	private var startX : float = 1557;
	private var startY : float = 969;
	
	private var replayX : float = 23;
	private var replayY : float = 969;
	
	private var homeX : float = 1777;
	private var homeY : float = 15;
	
	// "Tap Space" - so the user can cont. when they tap the image
	private var tapHeight : float = 872;
	private var tapSpace : Rect;


	private var topSlide: float;
	private var bottomSlide: float;
	
	private var currentSlide: float;
	
	//Metrics
	public var metrics : MetricContainer;
	private var skipTimes : List.<float>;
	public var m_display : MetricDisplay;
	
	
	// Textbox
	public var dialogue : List.<String>;
	public var speeds : List.<float>;
	private var diagRect : Rect;
	private var diagTextHeightPercent = 0.04;
	private var currentDisplayText : String;
	private var diagX : float = 97;
	private var diagY : float = 831;
	private var diagWidth : float = 1727;
	private var diagHeight : float = 131;
	private var lastLetter : int = 0;
	private var isWaiting : boolean;
	public var textSizeModifier : float = 1.0;
	
	
	public var characterName : String;
	private var charNameRect : Rect;
	private var nameX: float = 1003;
	private var nameY: float = 11;
	private var nameWidth: float = 752;
	private var nameHeight: float = 73;
	public var levelTitle : String;
	private var levelTitleRect : Rect;
	private var titleX: float = 22;
	private var titleY: float = 11;
	private var titleWidth: float = 971;
	private var titleHeight: float= 73;
	
	private var titleTextHeightPercent = 0.06;
	public var titleTextSizeModifier : float = 1.0;
	private var titleStyle:GUIStyle;
	

	public function Start () 
	{
		super.Start();
		super.Initialize();
		
		isWaiting = false;
		
		var designWidth : float = 1920;
		var designHeight : float = 1080;
		
		if(dialogue.Count != narrativeSlides.Length)
			Debug.Log("The dialogue size does not equal the narrative slide length!");
			
		if(speeds.Count != narrativeSlides.Length)
			Debug.Log("The speed size does not equal the narrative slide length! You must put in a speed for each slide.");
			
		if(narrativeSkin == null)
			Debug.Log("Forgot to add into the inspector the GUISkin!");
		else
			narrativeSkin.label.fontSize = diagTextHeightPercent * screenHeight * textSizeModifier;
		
		
		narrativeSkin.customStyles[0].fontSize = titleTextHeightPercent * screenHeight * titleTextSizeModifier;
		currentDisplayText = dialogue[0];
		
		//Calculating Rect.
		
			// Character Name
		
		charNameRect = RectFactory.NewRect(	  nameX / designWidth, 
											  nameY / designHeight,
											  nameWidth / designWidth,
											  nameHeight / designHeight);
											  
			// Level Title
		
		levelTitleRect = RectFactory.NewRect( titleX / designWidth, 
											  titleY / designHeight,
											  titleWidth / designWidth,
											  titleHeight / designHeight);
		
			// Text
		
		diagRect = RectFactory.NewRect(		  diagX / designWidth, 
											  diagY / designHeight,
											  diagWidth / designWidth,
											  diagHeight / designHeight);
		
			// Skip
		skip = RectFactory.NewRect(			  skipX / designWidth, 
											  skipY / designHeight,
											  skipButton.width / designWidth,
											  skipButton.height / designHeight);
		
			// Back
		back = RectFactory.NewRect(	  		  backX / designWidth, 
											  backY / designHeight,
											  backButton.width / designWidth,
											  backButton.height / designHeight);
		
			// Start
		start = RectFactory.NewRect(	  	  startX / designWidth, 
											  startY / designHeight,
											  startButton.width / designWidth,
											  startButton.height / designHeight);
		
			// Replay
		replay = RectFactory.NewRect(	  	  replayX / designWidth, 
											  replayY / designHeight,
											  replayButton.width / designWidth,
											  replayButton.height / designHeight);
											  
			// Replay
		home = RectFactory.NewRect(	  	      homeX / designWidth, 
											  homeY / designHeight,
											  homeButton.width / designWidth,
											  homeButton.height / designHeight);
											  
											  
			// Tap Space
		tapSpace = RectFactory.NewRect(	  	  0, 
											  (homeY + homeButton.height)/ designHeight,
											  1,
											  tapHeight / designHeight);
											  
		currentSlide = 0;
		
		skipTimes  = new List.<float>();
		
		metrics = new MetricContainer();
		m_display = new MetricDisplay();
	}
	
	function Update()
	{
		if(!isWaiting && lastLetter < dialogue[currentSlide].length)
		{
			UpdateText();
		}
	}
	
	private function UpdateText()
	{
		isWaiting = true;
		currentDisplayText = dialogue[currentSlide].Substring(0, lastLetter);
		yield WaitForSeconds(speeds[currentSlide]);
		lastLetter += 1;
		isWaiting = false;
	}
	
	public function OnGUI()
	{
		GUI.skin = narrativeSkin;
		titleStyle = GUI.skin.GetStyle("title");
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), narrativeSlides[currentSlide]);
		
		
		if(currentSlide < narrativeSlides.Length - 1)
		{
			if (GUI.Button(tapSpace, ""))
			{
				if(skipTimes.Count > 0)
				{
					skipTimes.Add(Time.timeSinceLevelLoad - skipTimes[skipTimes.Count - 1]);
				}
				else
					skipTimes.Add(Time.timeSinceLevelLoad);
				
				lastLetter = 0;
				currentSlide++;
			}
			if (GUI.Button(skip, skipButton))
			{	
				metrics.Narrative.wasSkipped = true;
				LoadLevel();			
			}
			
			if (GUI.Button(back, backButton))
			{	
				if(currentSlide > 0)
				{
					lastLetter = 0;
					currentSlide--;
				}			
			}
		}
		else
		{
			if (GUI.Button(start, startButton))
			{	
				LoadLevel();	
			}
			
			if (GUI.Button(replay, replayButton))
			{	
				currentSlide = 0;		
			}
		}
		
		if (GUI.Button(home, homeButton))
		{	
			Application.LoadLevel("StartScreen");
		}
		
		GUI.Label(diagRect, currentDisplayText);
		narrativeSkin.customStyles[0].alignment = TextAnchor.UpperRight;
		GUI.Label(charNameRect, characterName, titleStyle);
		narrativeSkin.customStyles[0].alignment = TextAnchor.UpperLeft;
		GUI.Label(levelTitleRect, levelTitle, titleStyle);
		

	}// end of OnGUI
	
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
			sceneName.Remove(sceneName.Length - 6);
		
		var path : String = Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/NARRATIVE");
		if(!Directory.Exists(path))
			System.IO.Directory.CreateDirectory(Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/NARRATIVE"));													
		metrics.SaveNarrative(Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/NARRATIVE/"));	
	}
}
