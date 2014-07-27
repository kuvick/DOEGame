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
	//public var overlayUI:Texture;
	
	public var inScoreScreen:boolean = false;
	private var endRender:boolean = false;
	
	// Start Screen rectangles
	private var slide:Rect;
	private var skip:Rect;
	private var back:Rect;
	private var start:Rect;
	private var replay:Rect;
	private var home:Rect;
	//private var overlay:Rect;

	// Buttons
	private var skipX : float = 1577;
	private var skipY : float = 969;
	
	private var backX : float = 200;
	private var backY : float = 950;
	
	//Values modified GPC 2/21/14 
	private var startX : float = 1550;
	private var startY : float = 950;
	
	private var replayX : float = 200;
	private var replayY : float = 950;
	
	private var homeX : float = 1777;
	private var homeY : float = 40;
	
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
	
	private var scoreMenu:ScoreMenu;
	
	private var screenRect : Rect;
	
	//private var nextLevel : NextLevelScript;

	public function Start () 
	
	
	
	{
		if(!inScoreScreen)
		{
			startNarrative();
		}
		else
		{
			scoreMenu = GameObject.Find("GUI System").GetComponent(ScoreMenu);
			scoreMenu.waitForNarrativeUI = true;
			endRender = true;
			startNarrative();
		}
				
		//var s = GameObject.Find("GUIScript");
		//nextLevel = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
		//Debug.Log(nextLevel.nextLevel + " assign 1");
	}
	
	public function setEndRender(bool:boolean)
	{
		endRender = bool;
	}
	
	public function startNarrative()
	{
			//super.Start();
			super.Initialize();
			
			// To help maintain a 16:9 ratio for the screen, and for the screen to be in the center
			screenRect = createRect(new Vector2(1920, 1080),0,0, 1, true);
			screenRect.x = (screenWidth / 2) - (screenRect.width / 2);
			screenRect.y = (screenHeight / 2) - (screenRect.height / 2);
			
			//isWaiting = false;
			
			var designWidth : float = 1920;
			var designHeight : float = 1080;
			
			if(dialogue.Count != narrativeSlides.Length)
				Debug.Log("The dialogue size does not equal the narrative slide length!");
				
			if(speeds.Count != narrativeSlides.Length)
				Debug.Log("The speed size does not equal the narrative slide length! You must put in a speed for each slide.");
				
			if(narrativeSkin == null)
				Debug.Log("Forgot to add into the inspector the GUISkin!");
			else
				narrativeSkin.label.fontSize = diagTextHeightPercent * screenRect.height * textSizeModifier;
			
			
			narrativeSkin.customStyles[0].fontSize = titleTextHeightPercent * screenRect.height * titleTextSizeModifier;
			currentDisplayText = dialogue[0];
			
			//Calculating Rect.
			
				// Character Name
			
			charNameRect = createRect(Vector2(nameWidth, nameHeight), nameX / designWidth, nameY / designHeight, nameHeight / designHeight, false, screenRect);
			/*
			charNameRect = RectFactory.NewRect(	  nameX / designWidth, 
												  nameY / designHeight,
												  nameWidth / designWidth,
												  nameHeight / designHeight);
			*/									  
				// Level Title
			levelTitleRect = createRect(Vector2(titleWidth, titleHeight), titleX / designWidth, titleY / designHeight, titleHeight / designHeight, false, screenRect);
			/*
			levelTitleRect = RectFactory.NewRect( titleX / designWidth, 
												  titleY / designHeight,
												  titleWidth / designWidth,
												  titleHeight / designHeight);
			*/
			
				// Text
				
			diagRect = createRect(Vector2(diagWidth, diagHeight), diagX / designWidth, diagY / designHeight, diagHeight / designHeight, false, screenRect);
			
			/*
			diagRect = RectFactory.NewRect(		  diagX / designWidth, 
												  diagY / designHeight,
												  diagWidth / designWidth,
			*/									  //diagHeight / designHeight);
			
				// Skip
				
			skip = createRect(skipButton, skipX / designWidth, skipY / designHeight, skipButton.height / designHeight, false, screenRect);
			/*skip = RectFactory.NewRect(			  skipX / designWidth, 
												  skipY / designHeight,
												  skipButton.width / designWidth,
												  skipButton.height / designHeight);*/
			
//				// Back
//			back = RectFactory.NewRect(	  		  backX / designWidth, 
//												  backY / designHeight,
//												  backButton.width / designWidth,
//												  backButton.height / designHeight);

	// Back
		/*
			back = RectFactory.NewRect(	  		  (backX - (backButton.width/2) ) / designWidth, 
												  (backY - (backButton.height/2) ) / designHeight,
												  backButton.width / designWidth * 1.5,
												  backButton.height / designHeight * 1.5);
			
				// Start
//			start = RectFactory.NewRect(	  	  startX / designWidth, 
//												  startY / designHeight,
//												  startButton.width / designWidth,
//												  startButton.height / designHeight);

			//GPC 2/21/14 Attempting to make buttons larger
			start = RectFactory.NewRect(	  	  (startX - (startButton.width/2) ) / designWidth, 
												  (startY - (startButton.height/2) ) / designHeight,
												  startButton.width / designWidth * 1.5,
												  startButton.height / designHeight * 1.5);
			
//			
//				// Replay
//			replay = RectFactory.NewRect(	  	  replayX / designWidth, 
//												  replayY / designHeight,
//												  replayButton.width / designWidth,
//												  replayButton.height / designHeight);
//												  
				// Replay
				/*
			replay = RectFactory.NewRect(	  	  (replayX - (replayButton.width/2) ) / designWidth, 
												  (replayY - (replayButton.height/2) ) / designHeight,
												  replayButton.width / designWidth * 1.5,
												  replayButton.height / designHeight * 1.5);							  
				*/								  
												  
//				// Home
//			home = RectFactory.NewRect(	  	      homeX / designWidth, 
//												  homeY / designHeight,
//												  homeButton.width / designWidth,
//												  homeButton.height / designHeight);
									
				// Home
				/*
			home = RectFactory.NewRect(	  	      (homeX - (homeButton.width/2) ) / designWidth, 
												  (homeY - (homeButton.height/2) ) / designHeight,
												  homeButton.width / designWidth * 1.5,
												  homeButton.height / designHeight * 1.5);			  
												  
*/
												  
												  
												  
												  
//			overlay = createRect(overlayUI, 0,0,1,false, screenRect);
//			overlay.x = screenRect.width / 2 - overlay.width / 2;
//			overlay.y = screenRect.height / 2 - overlay.height / 2;
//			home = createRect(homeButton, 0.86, 0.01, 0.09, false, overlay);
			
			//replay = createRect(replayButton, 0.007, 0.9, 0.09, false, overlay);
			//start = createRect(startButton, 0.809, 0.9, 0.09, false, overlay);
			//back = createRect(backButton, 0.007, 0.9, 0.09, false, overlay);

			home = createRect(homeButton, 0.86, 0.01, 0.09, false, screenRect);			
			replay = createRect(replayButton, 0.007, 0.9, 0.09, false, screenRect);
			start = createRect(startButton, 0.809, 0.9, 0.09, false, screenRect);
			back = createRect(backButton, 0.007, 0.9, 0.09, false, screenRect);
												  
				// Tap Space
				/*
			tapSpace = RectFactory.NewRect(	  	  0, 
												  (homeY + homeButton.height)/ designHeight,
												  1,
												  tapHeight / designHeight);
				*/
				
			tapSpace = createRect(Vector2(1920, tapHeight), 0, (homeY + homeButton.height)/ designHeight, tapHeight / designHeight, false, screenRect);
												  														  
												  
			currentSlide = 0;
			
			skipTimes  = new List.<float>();
			
			metrics = new MetricContainer();
			m_display = new MetricDisplay();
		
		StartCoroutine(UpdateText());
	}
	
	function Update()
	{
		/*if(!endRender)
		{
			if(!isWaiting && lastLetter <= dialogue[currentSlide].length)
			{
				UpdateText();
			}
		}*/
	}
	
	private function UpdateText()
	{
		//isWaiting = true;
		while (lastLetter <= dialogue[currentSlide].length)
		{
			currentDisplayText = dialogue[currentSlide].Substring(0, lastLetter);
			yield WaitForSeconds(speeds[currentSlide]);
			lastLetter += 1;
		}
		//isWaiting = false;
	}
	
	public function OnGUI()
	//public function Render()
	{
		//if(!endRender)
		//{
			GUI.BeginGroup(screenRect);
			GUI.skin = narrativeSkin;
			titleStyle = GUI.skin.GetStyle("title");
			GUI.DrawTexture(Rect(0,0,screenRect.width, screenRect.height), narrativeSlides[currentSlide]);
			
			//GUI.DrawTexture(overlay, overlayUI, ScaleMode.StretchToFill);
			
			if(currentSlide < narrativeSlides.Length - 1 || lastLetter < dialogue[currentSlide].Length - 1)
			{
				if (GUI.Button(tapSpace, GUIContent.none))
				{
					if(skipTimes.Count > 0)
					{
						skipTimes.Add(Time.timeSinceLevelLoad - skipTimes[skipTimes.Count - 1]);
					}
					else
						skipTimes.Add(Time.timeSinceLevelLoad);
					if (lastLetter < dialogue[currentSlide].Length - 1)
						lastLetter = dialogue[currentSlide].Length - 1;
					else
					{
						lastLetter = 0;
						currentSlide++;
						StartCoroutine(UpdateText());
					}
				}
				GUI.enabled = false;
				GUI.Button(start, startButton);
				GUI.enabled = true;
				/*if (GUI.Button(skip, skipButton))
				{	
					metrics.Narrative.wasSkipped = true;
					if(!inScoreScreen)
					{
						LoadLevel();
					}
					else
					{
						endRender = true;
						scoreMenu.waitForNarrativeUI = false;
					}		
				}*/
				
				if (GUI.Button(back, backButton))
				{	
					if(currentSlide > 0)
					{
						lastLetter = 0;
						currentSlide--;
						StartCoroutine(UpdateText());
					}			
				}
			}
			else
			{
				if (GUI.Button(start, startButton))
				{	
					if(!inScoreScreen)
					{
						//Temporary Hack to make Briefings complete correctly for demo GPC 2/17/14 
						/*var playerData = GameObject.Find("Player Data").GetComponent(SaveSystem) as SaveSystem;
						playerData.currentPlayer.completeLevel(EditorApplication.currentScene.ToString());*/
							
						/*var event : GUIEvent = new GUIEvent();
						event.type = EventTypes.SCORESCREEN;
						//PlayerPrefs.SetString(Strings.NextLevel, LevelSetup.getNextLevel());
						GUIManager.Instance().RecieveEvent(event);*/
						//RecordEndGameData();
						
						//Debug.Log(nextLevel.nextLevel + " assign 2");
						LoadLevel();
					}
					else
					{
						endRender = true;
						scoreMenu.SwitchFromNarrative();
						
					}
				}
				
				if (GUI.Button(back, backButton))
				{	
					if(currentSlide > 0)
					{
						lastLetter = 0;
						currentSlide--;
						StartCoroutine(UpdateText());
					}			
				}
			}
			
			if(GUI.Button(home, homeButton))
			{	
				Application.LoadLevel("StartScreen");
			}
			
			GUI.Label(diagRect, currentDisplayText);
			narrativeSkin.customStyles[0].alignment = TextAnchor.UpperRight;
			GUI.Label(charNameRect, characterName, titleStyle);
			narrativeSkin.customStyles[0].alignment = TextAnchor.UpperLeft;
			GUI.Label(levelTitleRect, levelTitle, titleStyle);
		//}	
	
		GUI.EndGroup();
	}// end of OnGUI
	
	//Would eventually set this to the loading screen, but for now since there are errors...
	private function LoadLevel()
	{
//		Debug.Log("loading level in narrative ui");
//		#if (!UNITY_WEBPLAYER)
//		WriteMetricData();	
//		#endif	
//		//So it can pass to the loading screen where to go next
//		var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
//		nextLevel.nextLevel = levelToLoad;
//		//PlayerPrefs.SetString(Strings.NextLevel, levelToLoad);
//		//Altered GPC 2/17/14
//		Application.LoadLevel(nextLevel.nextLevel);

		//PlayerPrefs.SetString(Strings.NextLevel, levelToLoad);
		//Altered GPC 2/17/14
		//nextLevel = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
		//var nextLevel = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
		
		//Application.LoadLevel(nextLevel.nextLevel);
		//Application.LoadLevel(levelToLoad);
		if (PlayerPrefs.GetString(Strings.NextLevel) != "GameComplete")
			Application.LoadLevel("LoadingScreen");
		else
			Application.LoadLevel("LevelSelectScreen");
	}
	
	#if (!UNITY_WEBPLAYER)
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
		Debug.Log(Application.dataPath);	
	}
	#endif
}