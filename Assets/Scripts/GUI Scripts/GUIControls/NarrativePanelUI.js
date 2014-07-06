public class NarrPanel
{
	// Offset is given in screen dimension percentages percentages (x is % of screen width, y is % of screen height
	public var background:Texture; // First one in an array must have an image, the rest can be blank if it doesn't change
	public var backgroundOffset:Vector2; // If background is blank, will take settings from previous in array
	public var character:Texture; // First one in an array must have an image, the rest can be blank if it doesn't change
	public var characterOffset:Vector2; // If character is blank, will take settings from previous in array
	public var popUp:Texture; // Leave blank if you don't want any image to be displayed to the left of the character; must copy if you reuse an image
	public var popUpOffset:Vector2; // must be filled out each time
	public var textSpeed:float; // leave as 0 if you want it to display one letter per frame, otherwise in seconds
	public var dialogue:String;
}

public class NarrativePanelScaling
{

}

public class NarrativePanelUI extends GUIControl
{
	public var narrativeSlides : NarrPanel[];
	public var narrativeOverlay : Texture;
	
	public var narrativeMusic:SoundType;
	
	
	private var currentBackground:Texture;
	private var currentBackgroundRect:Rect;
	private var currentCharacter:Texture;
	private var currentCharacterRect:Rect;
	private var popUpRect:Rect;
	
	private var startButtonAB:AnimatedButton;
	private var backButtonAB:AnimatedButton;
	private var homeButtonAB:AnimatedButton;
	
	public var backButton : Texture;
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
	private var metrics : MetricContainer;
	private var skipTimes : List.<float>;
	private var m_display : MetricDisplay;
	
	
	// Textbox
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
	
	private var tapToContinueText:Rect;
	
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
	
	public var disableTypingSound : boolean;
	
	//private var nextLevel : NextLevelScript;
	private var startCoroutine:boolean = false;

	public function Start () 
	{
		Debug.Log("NarPanelUI");
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
			narrativeMusic.CacheSoundClip();
			
			var soundM: SoundManager = SoundManager.Instance();
			soundM.playMusic(narrativeMusic);
			
			// To help maintain a 16:9 ratio for the screen, and for the screen to be in the center
			screenRect = createRect(new Vector2(1920, 1080),0,0, 1, true);
			screenRect.x = (screenWidth / 2) - (screenRect.width / 2);
			screenRect.y = (screenHeight / 2) - (screenRect.height / 2);
			
			currentBackgroundRect = Rect(narrativeSlides[0].backgroundOffset.x * screenRect.width,narrativeSlides[0].backgroundOffset.y * screenRect.height,screenRect.width, screenRect.height);
			currentCharacterRect = createRect(narrativeSlides[0].character, 0.51, 0.073, 0.92, false, screenRect);
			currentCharacterRect.x += narrativeSlides[0].characterOffset.x * screenRect.width;
			currentCharacterRect.y += narrativeSlides[0].characterOffset.y * screenRect.height;
			currentCharacter = narrativeSlides[0].character;
			
			if(narrativeSlides[0].popUp != null)
			{
				popUpRect = createRect(narrativeSlides[0].popUp, 0.02, 0.12, 0.60, false, screenRect);
				popUpRect.x += narrativeSlides[0].popUpOffset.x * screenRect.width;
				popUpRect.y += narrativeSlides[0].popUpOffset.y * screenRect.height;
			}
			
			tapToContinueText = Rect(0,screenRect.height - screenRect.height * 0.11,screenRect.width, screenRect.height * 0.11);
			
			//isWaiting = false;
			
			var designWidth : float = 1920;
			var designHeight : float = 1080;
			
			/*
			if(dialogue.Count != narrativeSlides.Length)
				Debug.Log("The dialogue size does not equal the narrative slide length!");
				
			if(speeds.Count != narrativeSlides.Length)
				Debug.Log("The speed size does not equal the narrative slide length! You must put in a speed for each slide.");
			*/
				
			if(narrativeSkin == null)
				Debug.Log("Forgot to add into the inspector the GUISkin!");
			else
				narrativeSkin.label.fontSize = diagTextHeightPercent * screenRect.height * textSizeModifier;
			
			
			narrativeSkin.customStyles[0].fontSize = titleTextHeightPercent * screenRect.height * titleTextSizeModifier;
			currentDisplayText = narrativeSlides[0].dialogue;
			
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
				
			//skip = createRect(skipButton, skipX / designWidth, skipY / designHeight, skipButton.height / designHeight, false, screenRect);
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
			//replay = createRect(replayButton, 0.007, 0.9, 0.09, false, screenRect);
			start = createRect(startButton, 0.809, 0.9, 0.09, false, screenRect);
			back = createRect(backButton, 0.007, 0.9, 0.09, false, screenRect);
			
			
			charNameRect.x = home.x - charNameRect.width - padding;
												  
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
			
			
		startButtonAB = new AnimatedButton(Color.green, startButton, start, Vector2(screenRect.x, screenRect.y));
		backButtonAB = new AnimatedButton(Color.blue, backButton, back, Vector2(screenRect.x, screenRect.y));
		homeButtonAB = new AnimatedButton(Color.blue, homeButton, home, Vector2(screenRect.x, screenRect.y));
		
			
			
		
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
		if (!disableTypingSound)
			SoundManager.Instance().playNarrativeTyping();
		while (lastLetter <= narrativeSlides[currentSlide].dialogue.length)
		{
			currentDisplayText = narrativeSlides[currentSlide].dialogue.Substring(0, lastLetter);
			/*if (!disableTypingSound)
				SoundManager.Instance().playNarrativeTyping();*/
			yield WaitForSeconds(narrativeSlides[currentSlide].textSpeed);
			lastLetter += 1;
		}
		//isWaiting = false;
		if (!disableTypingSound)
			SoundManager.Instance().stopNarrativeTyping();
	}
	
	public function OnGUI()
	//public function Render()
	{
		//if(!endRender)
		//{
			GUI.BeginGroup(screenRect);
			GUI.skin = narrativeSkin;
			titleStyle = GUI.skin.GetStyle("title");
			
			if(narrativeSlides[currentSlide].background != null && currentBackground != narrativeSlides[currentSlide].background)
			{
				currentBackground = narrativeSlides[currentSlide].background;
				currentBackgroundRect = Rect(narrativeSlides[currentSlide].backgroundOffset.x * screenRect.width,narrativeSlides[currentSlide].backgroundOffset.y * screenRect.height,screenRect.width, screenRect.height);
			}
				
			if(narrativeSlides[currentSlide].character != null && currentCharacter != narrativeSlides[currentSlide].character)
			{
				currentCharacter = narrativeSlides[currentSlide].character;
				currentCharacterRect = createRect(narrativeSlides[currentSlide].character, 0.51, 0.073, 0.92, false, screenRect);
				currentCharacterRect.x += narrativeSlides[currentSlide].characterOffset.x * screenRect.width;
				currentCharacterRect.y += narrativeSlides[currentSlide].characterOffset.y * screenRect.height;
			}
			
			GUI.DrawTexture(currentBackgroundRect, currentBackground);
			GUI.DrawTexture(currentCharacterRect, currentCharacter);
			
			if(narrativeSlides[currentSlide].popUp != null)
			{
				if(popUpRect == Rect(0,0,0,0))
				{
					popUpRect = createRect(narrativeSlides[currentSlide].popUp, 0.02, 0.12, 0.60, false, screenRect);
					//popUpRect.x += narrativeSlides[currentSlide].popUpRectOffset.x * screenRect.width;
					//popUpRect.y += narrativeSlides[currentSlide].popUpRectOffset.y * screenRect.height;
				}
				GUI.DrawTexture(popUpRect, narrativeSlides[currentSlide].popUp);
			}
			else
				popUpRect = Rect(0,0,0,0);
			
			GUI.DrawTexture(Rect(0,0,screenRect.width, screenRect.height), narrativeOverlay);
			
			//GUI.DrawTexture(overlay, overlayUI, ScaleMode.StretchToFill);
			
			if(currentSlide < narrativeSlides.Length - 1 || lastLetter < narrativeSlides[currentSlide].dialogue.Length - 1)
			{
				if (GUI.Button(tapSpace, ""))
				{
					if(skipTimes.Count > 0)
					{
						skipTimes.Add(Time.timeSinceLevelLoad - skipTimes[skipTimes.Count - 1]);
					}
					else
						skipTimes.Add(Time.timeSinceLevelLoad);
					if (lastLetter < narrativeSlides[currentSlide].dialogue.Length - 1)
						lastLetter = narrativeSlides[currentSlide].dialogue.Length - 1;
					else
					{
						lastLetter = 0;
						currentSlide++;
						startCoroutine = true;
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
				
				//if (GUI.Button(back, backButton))
				if(backButtonAB.Render())
				{	
					if(currentSlide > 0)
					{
						lastLetter = 0;
						currentSlide--;
						startCoroutine = true;
					}			
				}
				
				GUI.skin.label.alignment = TextAnchor.UpperCenter;
				GUI.skin.label.normal.textColor = Color.yellow;
				GUI.Label(tapToContinueText, "Tap Screen to Continue");
				GUI.skin.label.alignment = TextAnchor.UpperLeft;
				GUI.skin.label.normal.textColor = Color.white;
				
			}
			else
			{
				//if (GUI.Button(start, startButton))
				if(startButtonAB.Render(true))
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
				
				//if (GUI.Button(back, backButton))
				if(backButtonAB.Render())
				{	
					if(currentSlide > 0)
					{
						lastLetter = 0;
						currentSlide--;
						startCoroutine = true;
					}			
				}
				
			GUI.skin.label.alignment = TextAnchor.UpperCenter;
			GUI.skin.label.normal.textColor = Color.cyan;
			GUI.Label(tapToContinueText, "Tap Start to Begin Mission");
			GUI.skin.label.alignment = TextAnchor.UpperLeft;
			GUI.skin.label.normal.textColor = Color.white;
				
			}
			
			//if(GUI.Button(home, homeButton))
			if(homeButtonAB.Render())
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
		
		//If called within begin/end group will cause this error:
		// "you are pushing more guiclips than you are popping"
		// Edit: Still getting this error despite being moved outside...not sure what to do about it.
		if(startCoroutine)					
		{
			startCoroutine = false;
			StartCoroutine(UpdateText());
		}
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