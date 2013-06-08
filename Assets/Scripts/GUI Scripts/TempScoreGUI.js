/* (Original) Coding by Katharine Uvick

	Calculating percentages based on design of Score Screen
	which involved a 1920 x 1080 size design (hence why
	these numbers are used in the calculations).

*/

#pragma strict

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
public var lineOverlay : Texture;
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
private var expMissionScore : float = 0;
private var expBonusScore : float = 0;


// Initialize/start stuff goes here
function Start ()
{
	
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

}// End of Start

// Will be .Render()
public function OnGUI()
{
	// Drawing background textures:
	GUI.skin = scoreScreenSkin;
	GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
	GUI.DrawTexture(new Rect(0,0,lineOverlay.width, lineOverlay.height), lineOverlay);
	GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), infoBox);
	
	renderButtons();
	renderText();
	renderHonors();
}

function renderText()
{
	//Debug.Log(GUI.skin.label.CalcSize(new GUIContent("text")));
	
	GUI.Label(agentNameRect, agentName);
	GUI.Label(agentRankRect, agentRank);
	GUI.Label(missionScoreRect, missionScore);
	GUI.Label(totalScoreRect, totalScore);
}

function renderButtons()
{
	if(GUI.Button(shareButtonRect, shareButton))
	{
		Debug.Log("Share");
	}
	if(GUI.Button(retryButtonRect, retryButton))
	{
		Debug.Log("Retry");
	}
	if(GUI.Button(contButtonRect, contButton))
	{
		Debug.Log("Cont");
	}
	
}

function renderHonors()
{
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
}

// Used to find out the actual values for all the text that will be displayed,
// and also to do the saving and calculations of rank, etc.
function generateText()
{
	agentName = saveSystem.currentPlayer.name;
	agentRank = saveSystem.currentPlayer.rankName;
	
	// Need to program the bonuses...
	expBonusScore = 0;
	
	expMissionScore = intelSystem.getOptionalScore() + intelSystem.getPrimaryScore();
	missionScore = expMissionScore.ToString();	
	expWithinRank = saveSystem.rankSystem.expForThisRank(saveSystem.currentPlayer.rank, saveSystem.currentPlayer.exp);	
	
	var totScore : int = expBonusScore + expMissionScore;
	
	totalScore = totScore.ToString();
	
	var expEarned : int = saveSystem.currentPlayer.updateScore(intelSystem.levelName, totScore);
	
	saveSystem.currentPlayer.exp += expEarned;
	
	saveSystem.currentPlayer = saveSystem.rankSystem.updateRank(saveSystem.currentPlayer);
	saveSystem.SavePlayer(saveSystem.currentPlayer.name);
	
}

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

//*******************************************************For Testing Purposes:
/*
public var GOTSCORE : int;
public var USER : String;
public var LEVELNAME : String;
*/
function test()
{
	saveSystem.LoadPlayer(USER);
	agentName = saveSystem.currentPlayer.name;
	agentRank = saveSystem.currentPlayer.rankName;
	
	expBonusScore = 0;
	for(var i: int = 0; i < honorsTextures.Count; i++)
	{
		honorsTextures[i].score = i * 100;
		expBonusScore = expBonusScore + honorsTextures[i].score;
	}
	
	expMissionScore = GOTSCORE;
	missionScore = GOTSCORE.ToString();
	expWithinRank = saveSystem.rankSystem.expForThisRank(saveSystem.currentPlayer.rank, saveSystem.currentPlayer.exp);	
	Debug.Log("Exp within rank" + expWithinRank);
	var totScore : int = expBonusScore + expMissionScore;
	totalScore = totScore.ToString();
	
	var expEarned : int = saveSystem.currentPlayer.updateScore(LEVELNAME, totScore);
	Debug.Log("exp earned" + expEarned);
	saveSystem.currentPlayer.exp += expEarned;
	
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