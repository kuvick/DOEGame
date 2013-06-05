#pragma strict

public class ScoreMenu extends GUIControl{	
	//The Bounds for the recangles
	private var retryLevelButtonRect : Rect;
	//private var nextLevelButtonRect : Rect;
	private var missionHubButtonRect : Rect;
	private var backToMainMenuButtonRect : Rect;
	private var closeButtonRect : Rect;
	
	private var scoreBoxRect : Rect;
	private var scoreTextLabelRect : Rect;
	private var eventTextLabelRect : Rect;
	private var eventsCompletedTextLabelRect : Rect;
	private var bonusScoreLabelRect : Rect;
	private var bonusCompletedScoreLabelRect : Rect;
	private var totalScoreLabelRect : Rect;
	private var scoreDisplayLabelRect : Rect;
	private var bonusScoreDisplayLabelRect : Rect;
	private var totalScoreDisplayLabelRect : Rect;
	
	private var GUIPADDING : float = .025f; // Percentage of screen to pad
	private var BUTTONPADDING : float = .01f;
	private var BOTTOMBUTTONPADDING : float = .15f;
	private var BUTTONHEIGHT : float = .3f;
	private var BUTTONSIDEPADDING : float = .005;
	private var TEXTPADDING : float = .01;
	private var TEXTWIDTH : float = .4;
	private var TEXTHEIGHT : float = .1;

	public var scoreScreenSkin:GUISkin;
	private var largeLabelsStyle:GUIStyle;
	private var totalLabelStyle:GUIStyle;
	public var background : Texture;
	private var intelSystem : IntelSystem;
	
	public var nextLevelToLoad : String;
	
	private var saveSystem : SaveSystem;

	//need to replace text with GUI texture (if needed)
	private var scoreStrings : String[] = ["Retry Level", "Start Screen", "Mission Hub"];

	public function Initialize(){
		super.Initialize();
		
		SetupButtons();
		var database : GameObject = GameObject.Find("Database");
		intelSystem = database.GetComponent(IntelSystem);
		
		largeLabelsStyle = scoreScreenSkin.label;
		largeLabelsStyle.fontSize += 5;
		totalLabelStyle = largeLabelsStyle;
		totalLabelStyle.active.textColor = Color.yellow;
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.scoreMenuMusic;
		
		var playerData : GameObject = GameObject.Find("Player Data");
		saveSystem = playerData.GetComponent("SaveSystem");
		
		if(saveSystem != null)
		{
			//saveSystem. updateScore(levelName : String, levelScore : int): int
		}
	}
	
	public function Render(){   
		GUI.skin = scoreScreenSkin;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
		
		DrawScores();
	
		//Retry Level Button
		if(GUI.Button(retryLevelButtonRect, scoreStrings[0]))
		{
			Application.LoadLevel(Application.loadedLevelName);//GUIManager.currLevel);//"Prototype - Level1");
		}
/*
		//Next Level Button
		if(GUI.Button(nextLevelButtonRect, scoreStrings[2]))
		{		
	//		TODO: Continue to the next level(not just return to level 1)			
			PlayerPrefs.SetString(Strings.RESUME, nextLevelToLoad);
			GameObject.Find("NextLevel").GetComponent(NextLevelScript).nextLevel = nextLevelToLoad;
			currentResponse.type = EventTypes.NEWGAME;
			//Application.LoadLevel(levelToLoad);
		}
*/
		//Mission Selection Button
		if(GUI.Button(missionHubButtonRect, scoreStrings[2]))
		{
			/*
				TODO: Continue to the next level(not just return to level 1)
			*/
			//PlayerPrefs.SetString(Strings.RESUME, nextLevelToLoad);
			//GameObject.Find("NextLevel").GetComponent(NextLevelScript).nextLevel = nextLevelToLoad;
			currentResponse.type = EventTypes.LEVELSELECT;
			//Application.LoadLevel(levelToLoad);
		}
		
		//Return to Start Screen
		if(GUI.Button(backToMainMenuButtonRect, scoreStrings[1]))
		{
			Application.LoadLevel("StartScreen");
		}
		
		// X close button
		if (GUI.Button(closeButtonRect, "X")){
			currentResponse.type = EventTypes.MAIN;
		}
	}
	
	//Draws the scores
	function DrawScores(){	
		var primaryScore : int = intelSystem.getPrimaryScore();
		var bonusScore : int = intelSystem.getOptionalScore();
		var totalScore : int  = primaryScore + bonusScore;
		var highScore : int = 0;
		if (PlayerPrefs.HasKey(intelSystem.currentLevelName + "NarrScore"))
			highScore = PlayerPrefs.GetInt(intelSystem.currentLevelName + "NarrScore");
		if (totalScore > highScore)
			PlayerPrefs.SetInt(intelSystem.currentLevelName + "NarrScore", totalScore);
		
	 	GUI.Box(scoreBoxRect, "");
	 	GUI.Label(scoreTextLabelRect, "Score", largeLabelsStyle);
	 	GUI.Label(eventTextLabelRect, "Events Completed", largeLabelsStyle);
	 	GUI.Label(eventsCompletedTextLabelRect, "-Event 1\n-Event2\n-Event3");
	 	GUI.Label(bonusScoreLabelRect, "Bonus", largeLabelsStyle);
	 	GUI.Label(bonusCompletedScoreLabelRect, "Bonus1\nBonus2");
	 	GUI.Label(totalScoreLabelRect, "Total Score", totalLabelStyle);
	 	GUI.Label(scoreDisplayLabelRect, "" + primaryScore);
	 	GUI.Label(bonusScoreDisplayLabelRect, "" + bonusScore);
	 	GUI.Label(totalScoreDisplayLabelRect, "" + totalScore);
	}
	
	function SetupButtons(){
		scoreBoxRect = RectFactory.NewRect(.07, .11, .86, .7);
		scoreTextLabelRect = RectFactory.NewRect(.125, .167, TEXTWIDTH, TEXTHEIGHT);
		eventTextLabelRect = RectFactory.NewRect(.125, .25, TEXTWIDTH, TEXTHEIGHT);
		eventsCompletedTextLabelRect = RectFactory.NewRect(.161, .287, TEXTWIDTH, 3 * TEXTHEIGHT);
		bonusScoreLabelRect = RectFactory.NewRect(.125, .48, TEXTWIDTH, TEXTHEIGHT);
		bonusCompletedScoreLabelRect = RectFactory.NewRect(.161, .54, TEXTWIDTH, TEXTHEIGHT);
		totalScoreLabelRect = RectFactory.NewRect(.125, .667, TEXTWIDTH, TEXTHEIGHT);
		
		scoreDisplayLabelRect = RectFactory.NewRect(.7, .287, TEXTWIDTH, TEXTHEIGHT);
		bonusScoreDisplayLabelRect = RectFactory.NewRect(.7, .54, TEXTWIDTH, TEXTHEIGHT);
		totalScoreDisplayLabelRect = RectFactory.NewRect(.7, .667, TEXTWIDTH, TEXTHEIGHT);
		
		retryLevelButtonRect = RectFactory.NewRect(0.097, .83, .267, .1);
		//nextLevelButtonRect = RectFactory.NewRect(.375, .83, .267, .1);
		missionHubButtonRect = RectFactory.NewRect(.375, .83, .267, .1);
		backToMainMenuButtonRect = RectFactory.NewRect(.656, .83, .267, .1);
		closeButtonRect = RectFactory.NewRect(.938, .04, .052, .07);
		
		rectList.Add(RectFactory.NewRect(0,0,1,1));
	}
}