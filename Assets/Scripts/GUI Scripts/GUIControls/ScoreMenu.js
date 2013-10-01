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
	private var honorsBoxWidth : float = 1760;
	private var honorScoreOffsetX : float = 294;
	private var honorScoreOffsetY : float = 185;
	private var honorsLeftX : float = 79;
	private var honorsLeftY : float = 427;
	private var honorsRect : List.<Rect> = new List.<Rect>();
	private var honorScoreRect : List.<Rect> = new List.<Rect>();
	
	
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

	public function Initialize(){
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
	
	
		var designWidth : float = 1920;
		var designHeight : float = 1080;
	
	
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
											   
			// Honors
	
		for(var i :int = 0; i < honorsTextures.Count; i++)
		{
		
			var width : float = honorsLeftX + ((honorsBoxWidth / 4) * i);
			
			var rect : Rect = new Rect();
			rect =	 	 RectFactory.NewRect( width / designWidth, 
											  honorsLeftY / designHeight,
											  honorsTextures[i].earned.width / designWidth,
											  honorsTextures[i].earned.height / designHeight);
											  
			var rectScore : Rect = new Rect();
			rectScore =	 RectFactory.NewRect((width + honorScoreOffsetX) / designWidth, 
											  (honorsLeftY + honorScoreOffsetY) / designHeight,
											  honorsTextures[i].earned.width / designWidth,
											  honorsTextures[i].earned.height / designHeight);
			honorsRect.Add(rect);
			honorScoreRect.Add(rectScore);
		}
		
			// Exp Bar:
		expBarRect = RectFactory.NewRect( expBarX / designWidth, 
										  expBarY / designHeight,
										  expBarBG.width / designWidth,
										  expBarBG.height / designHeight);
										  
		expFill = expWithinRank / currentMinExpGoal;
		expEarnedFill = (expWithinRank + expEarned) / currentMinExpGoal;
		barDisplay = expFill;	// starts off at exp length
		Debug.Log("EXP FILL" + expFill);
		Debug.Log("EXP EARNED FILL" + expEarnedFill);
		goalWidth = expEarnedFill * expBarRect.width;
		
		levelSelectRef = gameObject.GetComponent(LevelSelectMenu);
		backgroundMusic = SoundManager.Instance().backgroundSounds.scoreMenuMusic;
	}
	
	public function Render(){   
		
		// Drawing background textures:
		GUI.skin = scoreScreenSkin;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
		//GUI.DrawTexture(new Rect(0,0,lineOverlay.width, lineOverlay.height), lineOverlay);
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), infoBox);
		
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
		
	}
	
	
	// Used to find out the actual values for all the text that will be displayed,
	// and also to do the saving and calculations of rank, etc.
	function generateText()
	{
		agentName = saveSystem.currentPlayer.name;
		agentRank = saveSystem.currentPlayer.rankName;
		startRank = saveSystem.currentPlayer.rank;
		if(saveSystem.currentPlayer.rank > 0)
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank) -
			saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank - 1);
		else
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank);
		
		// Need to program the bonuses...
		
		var tempScore : int = intelSystem.getOptionalScore() + intelSystem.getPrimaryScore();
		missionScore = tempScore.ToString();
		expWithinRank = saveSystem.rankSystem.expForThisRank(saveSystem.currentPlayer.rank, saveSystem.currentPlayer.exp);	
		
		Debug.Log("Total Score: " + tempScore);
		var totScore : int = tempScore + AddComboPoints();
		Debug.Log("Total Score with Combo: " + totScore);
		
		totalScore = totScore.ToString() + ConvertComboToString();
		
		expEarned = saveSystem.currentPlayer.updateScore(intelSystem.levelName, totScore);
		saveSystem.currentPlayer.exp += expEarned;
		Debug.Log("EXP EARNED: " + expEarned);
		
		var previousRank : int = -1;
		var timesRankIncreased : int = -1;
		while(saveSystem.currentPlayer.rank != previousRank)
		{
			previousRank = saveSystem.currentPlayer.rank;
			saveSystem.currentPlayer = saveSystem.rankSystem.updateRank(saveSystem.currentPlayer);
			timesRankIncreased++;
		}
		Debug.Log("Rank increased " + timesRankIncreased + " times.");
		
		saveSystem.SavePlayer(saveSystem.currentPlayer.name);
		
		
	}
	
	function AddComboPoints(): int
	{
		return (intelSystem.comboSystem.getComboCount() * 100);
	}
	
	function ConvertComboToString() : String
	{
		return " (Combo: " + AddComboPoints() + ")";
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
		UnitBonus,
		TimeBonus,
		NoUndoBonus,
		TurnBonus
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
			Debug.Log("******earned exp bar" + expEarned);
			Debug.Log("******current min exp goal" + currentMinExpGoal);
			Debug.Log("******exp earn fill" + expEarnedFill);
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
	
}// End of ScoreMenuClass