/* Revised/Replaced Coding by Katharine Uvick

	Calculating percentages based on design of Score Screen
	which involved a 1920 x 1080 size design (hence why
	these numbers are used in the calculations).

*/


#pragma strict

public class ScoreMenu extends GUIControl{	


	private var saveSystem : SaveSystem;
	private var intelSystem : IntelSystem;
	
	// For Testing Purposes:
	public var GOTSCORE : int;
	public var USER : String;
	public var LEVELNAME : String;
	public var doTest : boolean;
	
	// BG Textures
	public var scoreScreenSkin : GUISkin;
	public var background : Texture;
	//public var lineOverlay : Texture;
	public var infoBox : Texture;
	private var infoBoxRect:Rect;
	
	// Honors Textures
	public var honorsTextures : List.<HonorIcon> = new List.<HonorIcon>();
	
	// Ratings Textures
	public var ratings : List.<Texture> = new List.<Texture>();
	private var missionRating : int = 0;
	
	//Share Button
	public var shareButton : Texture;
	private var shareButtonRect : Rect;
	private var shareButtonX : float = 1476;
	private var shareButtonY : float = 23;
	
	// Retry Button
	public var retryButton : Texture;
	private var retryButtonRect : Rect;
	private var retryButtonX : float = 69;
	private var retryButtonY : float = 946;
	
	
	// Cont Button
	public var contButton : Texture;
	private var contButtonRect : Rect;
	private var contButtonX : float = 1341;
	private var contButtonY : float = 945;
	
	// Codex Icon
	public var codexIcon : Texture;
	private var codexIconRect : Rect;
	
	// Tech BG
	public var techBG : Texture;
	private var techBGRect : Rect;
	
	// Tech Image
	public var ecrbPlaceholder : Texture;
	private var techImage : Texture;
	private var techImageRect : Rect;
	
	// Text
	private var textX : float = 810;
	private var textY : float = 174;
	private var boxWidth : float = 1025;
	private var boxHeight : float = 60;
	
	private var agentName : String = "NoName";
	private var agentNameRect : Rect;
	
	private var agentRank : String = "NoRank";
	private var agentRankRect : Rect;
	
	private var missionScore : String = "00000";
	private var missionScoreRect : Rect;
	
	private var honorsBoxGap : float = 312;
	private var totalScore : String = "00000000";
	private var totalScoreRect : Rect;
	
	// Honors
	private var honorsBoxWidth : float = 1104;
	private var honorScoreOffsetX : float = 168;
	private var honorScoreOffsetY : float = 225;
	private var honorsLeftX : float = 128;
	private var honorsLeftY : float = 516;
	private var honorsRect : List.<Rect> = new List.<Rect>();
	private var honorScoreRect : List.<Rect> = new List.<Rect>();
	public var honorsExplanations : List.<String> = new List.<String>();
	private var displayExplanation : boolean = false;
	private var explanationRenderSpace : Rect;
	private var explanationText:String="";
	public var explanationBG:Texture;
	
	
	// Promotion Bar
	private var expWithinRank : float = 0;
	private var expEarned : float = 0;
	private var expBarX : float = 846;
	private var expBarY : float = 728;
	private var expBarRect : Rect;
	
	public var expBarBG : Texture;
	public var expBarExp : Texture;
	private var expFill : float = 0;
	public var expEarnedBar : Texture;
	private var expEarnedFill : float = 0;
	private var currentMinExpGoal : float = 0;
	private var goalWidth : float = 0;
	private var filledUp : boolean = false;
	private var timesFilled : int = 0;
	private var counter : int = 0;
	
	
	private var barDisplay : float = 0;			//Used for when the bar fills
	private var barFillSpeed : float = 0.005;	//Speed at which bar fills
	private var timesRankIncreased : int = -1;
	private var startRank : int = 0;
	
	public var playerDataPref : GameObject;
	
	private var levelSelectRef : LevelSelectMenu;
	
	var screenRect : Rect;
	
	private var boldStyle:GUIStyle;
	private var yellowStyle:GUIStyle;
	private var redStyle:GUIStyle;
	
	//Additional Text:
	private var agentNameTitleRect:Rect;
	private var agentRankTitleRect:Rect;
	private var missionScoreTitleRect:Rect;
	private var promotionStatusRect:Rect;
	private var titleRect:Rect;
	private var honorTitleRect:Rect;
	public var technologyName:String = "";
	private var technologyNameRect:Rect;
	private var addedToCodexRect:Rect;
	
	private var standardFontSize:int;
	private var largerFontSize:int;

	public function Initialize()
	{
		super.Initialize();
		
		counter = 0;
		var playerData : GameObject = GameObject.Find("Player Data");		
		saveSystem = playerData.GetComponent("SaveSystem");
		
		
		
		
		if(!doTest)
		{
			var database : GameObject = GameObject.Find("Database");
			intelSystem = database.GetComponent(IntelSystem);
			generateText();
		}
		else
		{
			test();
			Debug.Log("Testing...");
		}
	
		
		// To help maintain a 16:9 ratio for the screen, and for the screen to be in the center
		screenRect = createRect(new Vector2(1920, 1080),0,0, 1, true);
		screenRect.y = (screenHeight / 2) - (screenRect.height / 2);
		
		//standardFontSize = 0.040 * screenHeight;
		//largerFontSize = 0.054 * screenHeight;
		
		standardFontSize = 0.022 * screenWidth;
		largerFontSize = 0.030 * screenWidth;
		
		scoreScreenSkin.label.fontSize = standardFontSize;
		scoreScreenSkin.customStyles[1].fontSize = standardFontSize;
		scoreScreenSkin.customStyles[2].fontSize = standardFontSize;
		scoreScreenSkin.customStyles[3].fontSize = standardFontSize;
		
		boldStyle = scoreScreenSkin.customStyles[1];
		yellowStyle = scoreScreenSkin.customStyles[2];
		redStyle = scoreScreenSkin.customStyles[3];
		
		
		var designWidth : float = 1920;
		var designHeight : float = 1080;
		
		
		infoBoxRect = createRect(infoBox, 81 / designWidth, 74 / designHeight, infoBox.height / designHeight, false, screenRect);
		
		
		
		//createRect(texture:Texture,xPercent:float,yPercent:float, heightPercentage:float, adjustSizeIfOutsideBoundaries:boolean, compareToRect:Rect);
		
		shareButtonRect = createRect(shareButton,1340 / designWidth, 27/designHeight, shareButton.height / designHeight, false, screenRect);
		retryButtonRect = createRect(retryButton, 81 / designWidth, 936/designHeight, retryButton.height / designHeight, false, screenRect);
		contButtonRect = createRect(contButton, 1225 / designWidth, 936/designHeight, contButton.height / designHeight, false, screenRect);
		
		
		var textBox : Vector2 = new Vector2(boxWidth, boxHeight);
		
		agentNameRect = createRect(textBox, textX / designWidth, textY / designHeight, 0.05, false, screenRect);
		
		agentRankRect = createRect(textBox, textX / designWidth, (textY + boxHeight) / designHeight, 0.05, false, screenRect);
		
		missionScoreRect = createRect(textBox, textX / designWidth, (textY + (boxHeight*2)) / designHeight, 0.05, false, screenRect);
						
		titleRect  = createRect(new Vector2(1066, 96), (textX - 700) / designWidth, 72/designHeight, 96 / designHeight, false, screenRect);
		
		agentNameTitleRect = createRect(textBox, (textX - 700) / designWidth, textY / designHeight, 0.05, false, screenRect);
		agentRankTitleRect = createRect(textBox, (textX - 700) / designWidth, (textY + boxHeight) / designHeight, 0.05, false, screenRect);
		missionScoreTitleRect = createRect(textBox, (textX - 700) / designWidth, (textY + (boxHeight*2)) / designHeight, 0.05, false, screenRect);
		promotionStatusRect = createRect(textBox, (textX - 700) / designWidth, (textY + (boxHeight*3)) / designHeight, 0.05, false, screenRect);
																																										
		honorTitleRect = createRect(textBox, 135 / designWidth, 420 / designHeight, 0.05, false, screenRect);
		
		techBGRect = createRect(techBG, 1354 / designWidth, 419 /designHeight, techBG.height / designHeight, false, screenRect);
		codexIconRect = createRect(codexIcon, 109 / designWidth, 817 /designHeight, codexIcon.height / designHeight, false, screenRect);
		techImageRect = createRect(new Vector2(327, 283), 1387 / designWidth, 465 /designHeight, 0.262, false, screenRect);

		/*

		//Calculating Rect.
			// Share Button
		shareButtonRect = RectFactory.NewRect(shareButtonX / designWidth, 
											  shareButtonY / designHeight,
											  shareButton.width / designWidth,
											  shareButton.height / designHeight);
			// Retry Button
		retryButtonRect = RectFactory.NewRect(retryButtonX / designWidth, 
											  retryButtonY / designHeight,
											  retryButton.width / designWidth,
											  retryButton.height / designHeight);
			// Cont Button
		contButtonRect = RectFactory.NewRect( contButtonX / designWidth, 
											  contButtonY / designHeight,
											  contButton.width / designWidth,
											  contButton.height / designHeight);
											  
			// Text
			
		agentNameRect = RectFactory.NewRect(  textX / designWidth, 
											  textY / designHeight,
											  boxWidth / designWidth,
											  boxHeight / designHeight);
											  
		agentRankRect = RectFactory.NewRect(  textX / designWidth, 
											 (textY + boxHeight) / designHeight,
											  boxWidth / designWidth,
											  boxHeight / designHeight);
											  
		missionScoreRect = RectFactory.NewRect(textX / designWidth, 
											  (textY + (boxHeight*2)) / designHeight,
											   boxWidth / designWidth,
											   boxHeight / designHeight);
	
		totalScoreRect = RectFactory.NewRect(textX / designWidth, 
											  (textY + (boxHeight*3) + honorsBoxGap) / designHeight,
											   boxWidth / designWidth,
											   boxHeight / designHeight);
												   							   
	   */	
	   
			// Honors
	
		for(var i :int = 0; i < honorsTextures.Count; i++)
		{
		
			var width : float = honorsLeftX + ((honorsBoxWidth / 3) * i);
			
			var rect : Rect = new Rect();
			rect = createRect(honorsTextures[i].earned, width / designWidth, honorsLeftY / designHeight, honorsTextures[i].earned.height / designHeight, false, screenRect);

			/*
				 	 	 	 RectFactory.NewRect( width / designWidth, 
											  honorsLeftY / designHeight,
											  honorsTextures[i].earned.width / designWidth,
											  honorsTextures[i].earned.height / designHeight);
			*/
			
			var rectScore : Rect = new Rect();
			rectScore = createRect(honorsTextures[i].earned, (width + honorScoreOffsetX) / designWidth, (honorsLeftY + honorScoreOffsetY) / designHeight, honorsTextures[i].earned.height / designHeight, false, screenRect);
											  
			/*
			rectScore =	 RectFactory.NewRect((width + honorScoreOffsetX) / designWidth, 
											  (honorsLeftY + honorScoreOffsetY) / designHeight,
											  honorsTextures[i].earned.width / designWidth,
											  honorsTextures[i].earned.height / designHeight);
		  	*/
			honorsRect.Add(rect);
			honorScoreRect.Add(rectScore);
		}
		
			// Exp Bar:
			/*
		expBarRect = RectFactory.NewRect( expBarX / designWidth, 
										  expBarY / designHeight,
										  expBarBG.width / designWidth,
										  expBarBG.height / designHeight);
				*/						  
				
		expBarRect = createRect(expBarBG, 0.457, 0.33, 0.033, false, screenRect);
				
		expFill = expWithinRank / currentMinExpGoal;
		expEarnedFill = (expWithinRank + expEarned) / currentMinExpGoal;
		barDisplay = expFill;	// starts off at exp length
		//Debug.Log("EXP FILL" + expFill);
		//Debug.Log("EXP EARNED FILL" + expEarnedFill);
		goalWidth = expEarnedFill * expBarRect.width;
		
		levelSelectRef = gameObject.GetComponent(LevelSelectMenu);
		backgroundMusic = SoundManager.Instance().backgroundSounds.scoreMenuMusic;
		
		
		var codexBox : Vector2 = new Vector2(1744, 104);
		
		technologyNameRect = createRect(codexBox, 235 / designWidth, 844/designHeight, codexBox.x / designHeight, false, screenRect);
		addedToCodexRect = createRect(codexBox, 0, 844/designHeight, codexBox.x / designHeight, false, screenRect);
		addedToCodexRect.x = technologyNameRect.x + (technologyName.Length * (scoreScreenSkin.customStyles[3].fontSize/1.6));
		
	}
	
	public function Render()
	{   
	
		// Drawing background textures:
		GUI.skin = scoreScreenSkin;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
		
		GUI.BeginGroup(screenRect);
		//GUI.DrawTexture(new Rect(0,0,lineOverlay.width, lineOverlay.height), lineOverlay);
		GUI.DrawTexture(infoBoxRect, infoBox);
		
		
		scoreScreenSkin.customStyles[1].fontSize = largerFontSize;
		GUI.Label(titleRect, "Agent Performance Evaluation", boldStyle);
		scoreScreenSkin.customStyles[1].fontSize = standardFontSize;
		
		
		// Buttons are rendered:
		
		if(GUI.Button(shareButtonRect, shareButton))
		{
			currentResponse.type = EventTypes.FACEBOOK;
			PlayButtonPress();
		}
		if(GUI.Button(retryButtonRect, retryButton))
		{
			currentResponse.type = EventTypes.RESTART;
			PlayButtonPress();
		}
		if(GUI.Button(contButtonRect, contButton))
		{
			// Maybe switch this to level select, but can't
			// so long as the back button returns to the level...
			//currentResponse.type = EventTypes.MAIN;
			//var nextLevel : String = PlayerPrefs.GetString(Strings.NextLevel);
			//Changed GPC 9/14/13
			var nextLevel : String = "LevelSelectScreen";
			
			if (nextLevel == null){
				currentResponse.type = EventTypes.LEVELSELECT;
				levelSelectRef.SetFromScoreScreen(true);
			} else {
				Application.LoadLevel(nextLevel);
			}
			PlayButtonPress();
		}
		
		
		// Text is rendered:
		GUI.Label(agentNameTitleRect, "Agent Name", boldStyle);
		GUI.Label(agentRankTitleRect, "Agent Rank", boldStyle);
		GUI.Label(missionScoreTitleRect, "Mission Score", boldStyle);
		GUI.Label(promotionStatusRect, "Promotion Status", boldStyle);
		GUI.Label(honorTitleRect, "Honors", boldStyle);
		
		
		
		GUI.Label(agentNameRect, agentName);
		GUI.Label(agentRankRect, agentRank);
		GUI.Label(missionScoreRect, missionScore);
		GUI.Label(totalScoreRect, totalScore);
		
		// Honors/bonus icons and scores are rendered:
		GUI.skin.label.alignment = TextAnchor.UpperLeft;
		for(var i: int = 0; i < honorsTextures.Count; i++)
		{
			if(honorsTextures[i].hasEarned)
				GUI.DrawTexture(honorsRect[i], honorsTextures[i].earned);
			else
				GUI.DrawTexture(honorsRect[i], honorsTextures[i].notEarned);
			
			GUI.Label(honorScoreRect[i], honorsTextures[i].score.ToString());
			
			if(GUI.Button(honorsRect[i],""))
			{
				displayExp(honorsRect[i], honorsExplanations[i]);
			}
		}
		GUI.skin.label.alignment = TextAnchor.MiddleCenter;
		
		// Exp Bar:
		
		GUI.BeginGroup (expBarRect);
			GUI.Box (Rect (0,0, expBarRect.width, expBarRect.height), expBarBG);
			
			// SCORE FILL:
			GUI.BeginGroup (new Rect (0, 0, expBarRect.width * barDisplay, expBarRect.height));
				GUI.Box (Rect (0,0, expBarRect.width, expBarRect.height), expEarnedBar);
			GUI.EndGroup ();
			 
			// EXP FILL:
			if(!filledUp)
			{
				GUI.BeginGroup (new Rect (0, 0, expBarRect.width * expFill, expBarRect.height));
					GUI.Box (Rect (0,0, expBarRect.width, expBarRect.height), expBarExp);
				GUI.EndGroup ();
			}
			 
		GUI.EndGroup ();
		
		GUI.DrawTexture(techBGRect, techBG, ScaleMode.StretchToFill);	
		GUI.DrawTexture(techImageRect, techImage, ScaleMode.StretchToFill);
	
	
		GUI.DrawTexture(codexIconRect, codexIcon, ScaleMode.StretchToFill);
		if(technologyName != null && technologyName != "")
		{
			GUI.Label(technologyNameRect, technologyName, redStyle);
			GUI.Label(addedToCodexRect, " added to the Codex", yellowStyle);
		}
		else	
			GUI.Label(technologyNameRect, "No new technology added.", redStyle);
		
		GUI.EndGroup();
		
		if(displayExplanation)
		{
			scoreScreenSkin.label.wordWrap = true;
			GUI.DrawTexture(explanationRenderSpace, explanationBG);
			GUI.Label(explanationRenderSpace, explanationText);
			scoreScreenSkin.label.wordWrap = false;
		}
		
	}
	
	
	// Used to find out the actual values for all the text that will be displayed,
	// and also to do the saving and calculations of rank, etc.
	function generateText()
	{
		// Honors Icons
		for(var i:int = 0; i < honorsTextures.Count; i++)
		{
			//honorsTextures[i].earned
			if(honorsTextures[i].type == HonorType.Agile)
			{
				if(intelSystem.comboSystem.getHighestCombo() > 0)
				{
					honorsTextures[i].score = 100 * intelSystem.comboSystem.getHighestCombo();
					honorsTextures[i].hasEarned = true;
				}
			}
			else if(honorsTextures[i].type == HonorType.Efficient)
			{
				if(intelSystem.GetTimeLeft() > 0)
				{
					honorsTextures[i].score = 200 * intelSystem.GetTimeLeft();
					honorsTextures[i].hasEarned = true;
				}
			}
			else if(honorsTextures[i].type == HonorType.Resourceful)
			{
				if(intelSystem.getOptionalScore() > 0)
				{
					honorsTextures[i].score = 1000;
					honorsTextures[i].hasEarned = true;
				}
			}
		}
	
		agentName = saveSystem.currentPlayer.name;
		agentRank = saveSystem.currentPlayer.rankName;
		startRank = saveSystem.currentPlayer.rank;
		if(saveSystem.currentPlayer.rank > 0)
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank) -
			saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank - 1);
		else
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank);
		
		var tempScore : int = intelSystem.getOptionalScore() + intelSystem.getPrimaryScore() + (50 * intelSystem.GetTimeLeft());
		
		// Adding in honors scores
		for(var j:int = 0; j < honorsTextures.Count; j++)
		{
			tempScore += honorsTextures[j].score;
		}
		
		missionScore = tempScore.ToString();
		expWithinRank = saveSystem.rankSystem.expForThisRank(saveSystem.currentPlayer.rank, saveSystem.currentPlayer.exp);	
		
		//Debug.Log("Total Score: " + tempScore);
		var totScore : int = tempScore + AddComboPoints();
		//Debug.Log("Total Score with Combo: " + totScore);
		
		totalScore = totScore.ToString() + ConvertComboToString();
		
		expEarned = saveSystem.currentPlayer.updateScore(intelSystem.levelName, totScore);
		saveSystem.currentPlayer.exp += expEarned;
		//Debug.Log("EXP EARNED: " + expEarned);
		
		var previousRank : int = -1;
		var timesRankIncreased : int = -1;
		while(saveSystem.currentPlayer.rank != previousRank)
		{
			previousRank = saveSystem.currentPlayer.rank;
			saveSystem.currentPlayer = saveSystem.rankSystem.updateRank(saveSystem.currentPlayer);
			timesRankIncreased++;
		}
		//Debug.Log("Rank increased " + timesRankIncreased + " times.");
		
		Debug.Log("Tech Name: " + technologyName);
		
		if(technologyName != "")
		{
			// if the function doesn't return true, sets technology name because either the codex did not contain the 
			// the tech, or the technology has already been unlocked.
			if(!saveSystem.UnlockCodex(saveSystem.currentPlayer, technologyName))
				technologyName = "";
		}
		
		if(technologyName != "")
			techImage = saveSystem.codexData.GetCodexEntry(technologyName).icon;
		else
			techImage = ecrbPlaceholder;
		
		Debug.Log("Tech Name: " + technologyName);		
		saveSystem.SavePlayer(saveSystem.currentPlayer.name);
	}
	
	function AddComboPoints(): int
	{
		return (intelSystem.comboSystem.getComboCount() * 100);
	}
	
	function ConvertComboToString() : String
	{
		//return " (Combo: " + AddComboPoints() + ")";
	}
	
	// class for the honors/bonus icons
	// each has an HonorType (an enum),
	// a texture for whether or not it was
	// earned, and a score
	public class HonorIcon
	{
		var type : HonorType;
		var earned : Texture;
		var notEarned : Texture;
		var hasEarned : boolean;
		var score : int = 0;
	}
	
	enum HonorType
	{
		Agile,
		Efficient,
		Resourceful
	}
	
	
function Update()
	{
	
		var currentWidth : float = expBarRect.width * barDisplay;
		
		if(currentWidth < goalWidth)
		{
			barDisplay = (counter * barFillSpeed) + expFill;
			counter++;
		}
	
		// Resets the bar for the next fill:
		if(currentWidth > expBarRect.width)
		{
			filledUp = true;
			timesFilled++;
			startRank++;
			
			agentRank = saveSystem.rankSystem.getRankName(startRank);
			expEarned = (expEarned + expWithinRank) - currentMinExpGoal;		
			currentMinExpGoal = saveSystem.rankSystem.expGoal(startRank) -
								saveSystem.rankSystem.expGoal(startRank - 1);
								
			expEarnedFill = expEarned / currentMinExpGoal;
			barDisplay = 0;
			goalWidth = expEarnedFill * expBarRect.width;
	
			goalWidth = expEarnedFill * expBarRect.width;
			expFill = 0;
			counter = 0;
			barDisplay = 0;
			expWithinRank = 0;
			//Debug.Log("******earned exp bar" + expEarned);
			//Debug.Log("******current min exp goal" + currentMinExpGoal);
			//Debug.Log("******exp earn fill" + expEarnedFill);
		}
		
	
	}
	
	//*******************************************************For Testing Purposes:
	/*
	The purpose of the below is to make up level data for
	testing the score screen:
	*/
	function test()
	{
		saveSystem.LoadPlayer(USER);
		agentName = saveSystem.currentPlayer.name;
		agentRank = saveSystem.currentPlayer.rankName;
		startRank = saveSystem.currentPlayer.rank;
		
		if(saveSystem.currentPlayer.rank > 0)
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank) -
			saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank - 1);
		else
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank);
		
		Debug.Log("CurrentGoal" + currentMinExpGoal);
		var bonusScore : int = 0;
		for(var i: int = 0; i < honorsTextures.Count; i++)
		{
			//honorsTextures[i].score = ((i + 1) * 15) + 99;
			honorsTextures[i].score = 0;
			bonusScore = bonusScore + honorsTextures[i].score;
		}
		
		missionScore = GOTSCORE.ToString();
	
		expWithinRank = saveSystem.rankSystem.expForThisRank(saveSystem.currentPlayer.rank, saveSystem.currentPlayer.exp);	
		Debug.Log("Current bar exp: " + expWithinRank);
		var totScore : int = bonusScore + GOTSCORE;
		totalScore = totScore.ToString();
		
		expEarned = saveSystem.currentPlayer.updateScore(LEVELNAME, totScore);
		saveSystem.currentPlayer.exp += expEarned;
		
		Debug.Log("EXP EARNED: " + expEarned);
		
		var previousRank : int = -1;
		timesRankIncreased = -1;
		while(saveSystem.currentPlayer.rank != previousRank)
		{
			previousRank = saveSystem.currentPlayer.rank;
			saveSystem.currentPlayer = saveSystem.rankSystem.updateRank(saveSystem.currentPlayer);
			timesRankIncreased++;
		}
		Debug.Log("Rank increased " + timesRankIncreased + " times.");
		
		saveSystem.SavePlayer(saveSystem.currentPlayer.name);
	
	}
	
	private function displayExp(location:Rect, text:String)
	{
		explanationText = text;
		explanationRenderSpace = createRect(new Vector2(500, 200),0,0,0.3, false);
		explanationRenderSpace.x = location.x;
		explanationRenderSpace.y = location.y - explanationRenderSpace.height / 2;
		if(!displayExplanation)
		{
			displayExplanation = true;
			yield WaitForSeconds(5.0);
			displayExplanation = false;
		}
	}
	
}// End of ScoreMenuClass