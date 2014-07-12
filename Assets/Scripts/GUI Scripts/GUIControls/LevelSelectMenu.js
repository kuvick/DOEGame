/**********************************************************
LevelSelectMenu.js

Description: 

Author: Francis Yuan
**********************************************************/
import System.Collections.Generic;
import System.Xml;
import System.IO;

#pragma strict
enum UnlockType
{
	NONE,
	RANK,
	MISSION,
	CONTACT
}

public class LevelSelectMenuScaling
{
	var agentRank : float;
	var agentName : float;
	var emailListSubject : float;
	var messageSender : float;
	var messageSubject : float;
	var messageText : float;
	var messageObj : float;
}

@XmlRoot("LevelList")
public class LevelList
{
	public var numInitialTutorials : int; // number of levels before dashboard is available
	@XmlArray("Levels")
  	@XmlArrayItem("Level")
  	public var levels : List.<BasicNode> = new List.<BasicNode>();
  	
	public function Load(): LevelList
 	{
		var textAsset:TextAsset = Resources.Load("LevelList") as TextAsset;
	 	
	 	var serializer : XmlSerializer = new XmlSerializer(LevelList);
	 	var strReader : StringReader = new StringReader(textAsset.text);
	 	var xmlFromText : XmlTextReader = new XmlTextReader(strReader);
	 	
	 	var lvlList : LevelList = serializer.Deserialize(xmlFromText) as LevelList;
	 	strReader.Close();
		xmlFromText.Close();
		
		//Debug.Log("Loading of levels complete.");
		return lvlList;
	 }
}

public class BasicNode
{
	public var displayName:String = "";
	public var sceneName:String = "";
	public var difficulty:int = 0;
	
	public var subjectText : String = "";
	public var messageText : String = "";
	public var objectiveText : String = String.Empty;
	
	public var isPrimary : boolean = true;
	public var senderName : String = "";
	
	public var howToUnlock : UnlockType;
	public var rankRequirement : int = -1;
	public var missionRequirementIndex : int = -1;
	public var contactRequirement : String = "";
}


public class LevelNode
{
	public var texture:Texture;
	public var displayName:String = "";
	public var sceneName:String = "";
	public var difficulty:int = 0;
	private var score:int = 0;
	
	public var subjectText : String;
	public var messageText : String;
	public var objectiveText : String;
	public var unlocked : boolean = false;
	
	public var bounds : Rect;
	public var isPrimary : boolean = true;
	public var wasRead : boolean = false;
	public var completed : boolean = false;
	
	public var senderTexture : Texture;
	public var senderName : String;
	
	public var howToUnlock : UnlockType;
	public var rankRequirement : int = -1;
	public var missionRequirementIndex : int = -1;
	public var contactRequirement : String;
	
	public function LevelNode()
	{
		texture = null;
		displayName = "";
		sceneName = "";
		difficulty = 0;
		score = 0;
			
		subjectText="";
		messageText="";
		unlocked = false;
			
		bounds = Rect(0,0,0,0);
		isPrimary = true;
		wasRead = false;
		completed = false;
			
		senderTexture = null;
		senderName = "";
			
		howToUnlock = UnlockType.NONE;
		rankRequirement = -1;
		missionRequirementIndex = -1;
		contactRequirement = "";
	}
	
	public function LevelNode(tex:Texture, dispName: String, lvlName:String, dif:int, bestScore:int)
	{
		texture = tex;
		displayName = dispName;
		sceneName = lvlName;
		difficulty = dif;
		score = bestScore;
	}
	
	// Eventually need to find way for saving scores and then calling them back up here
	// and it will use these functions to get the score
	public function setScore(num:int)
	{
		score = num;
	}
	
	public function getScore():int
	{
		return score;
	}
}

public class LevelSelectMenu extends GUIControl
{
	public var displayTutorialToolTips:boolean = false;
	public var levelsFromXML : LevelList;
	
	public var dashboardTooltips : Tooltip[];
	private var tooltipDisplay : InspectionDisplay;

	//Images
	public var backgroundText: Texture;
	public var difficultyIcons:List.<Texture> = new List.<Texture>();
	
	
	public var codexIconText: Texture;
	//public var codexIconTextPressed: Texture;
			private var codexIconRect: Rect;
			private var codexX: float=35;
			private var codexY: float=603;
	public var archiveIconText: Texture;
	public var newMessageText:Texture;
	//public var archiveIconTextPressed: Texture;
	//public var newMessageTextPressed:Texture;
			private var archiveIconRect: Rect;
			private var archiveX: float=35;
			private var archiveY: float=206;
	private var sideButtonHeightPercent:float=0.34;
			
			
	public var emailItemBackground: Texture; // normal background
	private var highlightedItemBackground : Texture; // background for first highlighted level
	public var highlightedItemBackground1 : Texture; // background for first highlighted level
	public var highlightedItemBackground2 : Texture; // background for first highlighted level
	private var blinkSpeed : float = 1.2;
	private var isWaitingToSwitch : boolean;
	private var fade:float;
	private var useNum1BlinkTexture : boolean;	
			private var emailItemBackgroundRect: Rect;
			private var dispEmailItemBackground : Texture; // background to display
	private var messageLineText:ShadowedText;
	public var emailMessageBackground: Texture;
	private var messageText:ShadowedText;
			private var emailMessageBackgroundRect: Rect;
			private var emailMessageX:float = 66;
			private var emailMessageY:float = 66;
			private var emailMessagePercent:float = 0.75;
	//public var lineOverlayText: Texture;
			//private var lineOverlayRect: Rect;
	public var mainMenuIconText: Texture;
	//public var mainMenuIconTextPressed: Texture;
			private var mainMenuIconRect: Rect;
			private var mainMenuX: float=1563;
			private var mainMenuY: float=24;
			private var mainMenuPercent:float=0.12;
	public var missionBackgroundText: Texture;
			private var missionBackgroundRect: Rect;
			private var missionBGX: float=267;
			private var missionBGY: float=171;
			private var missionBGHeightPercent:float=0.84;
	public var progressBarExpText: Texture;
	public var progressBarBGText: Texture;
			private var progressBarRect: Rect;
			private var progressBarX: float=54;
			private var progressBarY: float=120;
			private var progressBarPercent:float=0.028;
	private var designWidth : float = 1920;
	private var designHeight : float = 1080;
	public var startLevelButtonTexture: Texture;
	//public var startLevelButtonTexturePressed: Texture;
	private var missionScrollArea: Rect;
		private var missionScrollX:float =41;
		private var missionScrollY:float = 50;
		private var missionScrollWidth:float = 1440;
		private var missionScrollHeight:float = 762;
		private var missionScrollAreaPercent = 0.85;
	private var barDisplay:float;
	private var agentName:String;
	private var agentRank:String;
	private var agentRankText:ShadowedText;
		private var agentRankRect1:Rect;
		private var rank1X:float=79;
		private var rank1Y:float=27;
		private var agentRankRect2:Rect;
		private var rank2X:float=83;
		private var rank2Y:float=31;
	private var scrollThumbWidth:float=0.03;
	public var backButtonText: Texture;
	//public var backButtonTextPressed: Texture;
	private var rank1Style:GUIStyle;
	private var rank2Style:GUIStyle;
	private var playerNameStyle:GUIStyle;
	private var playerNameText:ShadowedText;
	private var playerName:String;
		private var playerRect:Rect;
		private var playerPaddingPercent:float = 0.01;
	private var senderRect:Rect;
	
	public var toggleMissionTypesButton : Rect;
	
	// Used to display player information:
	private var saveSystem : SaveSystem;
	
	/************************************/

	// Skins for GUI components

	public var levelSelectSkin:GUISkin;
	
	private var levelGroup:Rect;

	private var screenRect:Rect;
	
	//Scroll
	private var scrollArea:Rect;
	private var scrollArea2: Rect;
	private var levelSelectScrollPos:Vector2 = Vector2.zero;
	private var scrollContent : Rect;
	
	private var scrollAreaWidthPercent : float = 0.75;
	private var scrollAreaHeightPercent : float = 0.80;
	private var innerScrollAreaWidthPercent : float = 0.67;
	private var innerScrollAreaHeightPercent : float = 0.75;
	private var scrollPosition : Vector2;
	
	private var messageHeightPercent : float = 0.12;
	private var messageWidthPercent : float = 0.70;
	private var yPaddingPercent : float = 0.05;
	
	private var statusRectangle : Rect;
	private var senderRectangle : Rect;
	
	//Splash Screen / Message View
	private var showSplash = false;
	private var inboxTab = true; // switches between the archive and active missions
	private var splashBounds : Rect;
	private var splashWidthPercent : float = 0.75;
	private var splashHeightPercent : float = 0.75;
	
	
	private var activeLevelIndex : int = -1;
	
	private var startLevelButton : Rect;
	private var startLevelButtonX : float = 0.667;
	private var startLevelButtonY : float = 0.66;
	private var startLevelButtonPercent:float = 0.15;
	
	private var messageBuffer : Vector2;
	
	private var senderRect_desc : Rect;
	private var subjectRect : Rect;
	private var messageRect : Rect;
	private var objectiveRect : Rect;
	
	// Level Select Menu scaling
		
	private var levelTitleFontHeightPercent:float = 0.1;
	private var levelNodeFontHeightPercent:float = 0.025;

	private var backButtonHeightPercent:float = 0.2;		
	private var backButtonFontHeightPercent:float = 0.03;	

	private var levelGroupY:float;
	private var levelTitleFontHeight:float;
	private var levelNodeFontHeight:float;

	
	// Level Select Menu animation
	private var numLevels:int;			
	
	public var levels : LevelNode[];
	private var unlockedLevels : List.<LevelNode>;
	private var completedLevels : List.<LevelNode>; 
	private var secondaryLevels : LevelNode[];
	private var primaryLevels : LevelNode[];
	private var lastUnlockedIndex : int = 0;
	
	private var baseDifficulty : int = 0; // used for difficulty icon selection
	
	private static var fromScoreScreen : boolean = false;
	
	public var tutorialIcon : Texture;
	public var rankTextures : List.<Texture> = new List.<Texture>();
	private var rankRect:Rect;
	private var rankTextureNum:int;
	
	private var returnedFromMessage:boolean;
	
	private var checkRender : boolean = false;
	
	//Dragging
	private var lastMousePos: Vector2;
	private var useMouse:boolean;
	private var startMousePosition:Vector2;
	private var startTapPosition:Vector2;
	private var checkDelta : int;
	private var firstPass:boolean;
	private var isHolding:boolean;
	private var startHolding:boolean;
	private var confirmHolding:boolean;
	
	private var topRect:Rect;
	
	// Buttons
	private var codexButtonAB:AnimatedButton;
	private var archiveButtonAB:AnimatedButton;
	private var mainMenuButtonAB:AnimatedButton;
	private var startLevelButtonAB:AnimatedButton;
	
	private var messageLineST:ShadowedText;
	
	//ShadowedText
	private var objTextST:ShadowedText;
	
	private var pointers : TutorialPointers;
	
	public var isDebugMode : boolean;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		messageText = new ShadowedText("", Rect(0,0,0,0), false);
		messageLineText = new ShadowedText("", Rect(0,0,0,0), false);
		objTextST = new ShadowedText("", Rect(0,0,0,0), false, new Color(247f/255f, 216f/255f, 39f/255f, 1f));
		messageLineST = new ShadowedText("", Rect(0,0,0,0), levelSelectSkin.button, false);

		
		// To help maintain a 16:9 ratio for the screen, and for the screen to be in the center
		screenRect = createRect(new Vector2(1920, 1080),0,0, 1, true);
		screenRect.x = (screenWidth / 2) - (screenRect.width / 2);
		screenRect.y = (screenHeight / 2) - (screenRect.height / 2);
		
		//Dragging variables:
		isHolding = false;
		startHolding = false;
		confirmHolding = false;
		firstPass = false;
		checkDelta = 0;
		
		
		returnedFromMessage = false;
		
		//Getting style and displaying names
		rank1Style =  levelSelectSkin.GetStyle("title1");
		rank2Style =  levelSelectSkin.GetStyle("title2");
		playerNameStyle =  levelSelectSkin.GetStyle("playerName");
		
		
		highlightedItemBackground = highlightedItemBackground1;
		isWaitingToSwitch = true;
		fade = 0f;
		useNum1BlinkTexture = true;
		tooltipDisplay = gameObject.GetComponent(InspectionDisplay);
		
		//ADDING IN THE XML LEVELS INTO THE LEVELS ARRAY
		levelsFromXML = levelsFromXML.Load();
		levelsFromXML.levels.Reverse();
		levels = new LevelNode[levelsFromXML.levels.Count];
		
		for(var i:int=0; i < levelsFromXML.levels.Count; i++)
		{
			levels[i] = convertBasicToLevel(levelsFromXML.levels[i]);
			levels[i].senderTexture = assignSenderTexture(levelsFromXML.levels[i].senderName);
		}
		
		
		
		levelGroupY = 0;//screenHeight * levelGroupYPercent;
		//levelTitleFontHeight = levelTitleFontHeightPercent * screenHeight;
		//levelNodeFontHeight = levelNodeFontHeightPercent * screenHeight;
		
		levelTitleFontHeight = 0.8 * screenWidth;
		levelNodeFontHeight = 0.015 * screenWidth;
		
		levelSelectSkin.button.fontSize = levelNodeFontHeight * (1f + GUIManager.Instance().levelSelectMenuScaling.emailListSubject);
		levelSelectSkin.label.fontSize = levelNodeFontHeight * 1.5;
		levelSelectSkin.customStyles[0].fontSize = levelNodeFontHeight * 2 * (1f + GUIManager.Instance().levelSelectMenuScaling.agentRank);
		levelSelectSkin.customStyles[1].fontSize = levelNodeFontHeight * 2 * (1f + GUIManager.Instance().levelSelectMenuScaling.agentRank);
		levelSelectSkin.customStyles[2].fontSize = levelNodeFontHeight * 2 * (1f + GUIManager.Instance().levelSelectMenuScaling.agentName);
		
		//hexButtonSkin.button.fontSize = backButtonFontHeight;
		/******************************************/
		
		var playerData : GameObject = GameObject.Find("Player Data");		
		saveSystem = playerData.GetComponent("SaveSystem");
		
		
		
		
		//var sideButtonArea : Rect = Rect(0,0,260/designWidth * screenWidth, 1080/designHeight * screenHeight);
		
		var sideButtonArea : Rect = createRect(Vector2(280,1080),0,0,1, false, screenRect);
	
										  
		codexIconRect = createRect(codexIconText, codexX / 260, codexY / designHeight, sideButtonHeightPercent, true, sideButtonArea);
		archiveIconRect = createRect(archiveIconText, archiveX / 260, archiveY / designHeight, sideButtonHeightPercent, true, sideButtonArea);
		
		missionBackgroundRect = createRect(missionBackgroundText, missionBGX / designWidth, missionBGY / designHeight, missionBGHeightPercent, true, screenRect);
		mainMenuIconRect = createRect(mainMenuIconText, mainMenuX / designWidth, mainMenuY / designHeight, mainMenuPercent, false, screenRect);										  
		progressBarRect = createRect(progressBarBGText, progressBarX / designWidth, progressBarY / designHeight, progressBarPercent, false, screenRect);
		
		
		emailMessageBackgroundRect = createRect(emailMessageBackground,emailMessageX/ designWidth, emailMessageY/designHeight, emailMessagePercent, true, missionBackgroundRect);
		// Scroll Area:
		missionScrollArea = createRect(Vector2(missionScrollWidth, missionScrollHeight), missionScrollX / designWidth, missionScrollY / designHeight, missionScrollAreaPercent, true, missionBackgroundRect);

		
		//startLevelButton = createRect(startLevelButtonTexture, startLevelButtonX, startLevelButtonY, startLevelButtonPercent, true, missionBackgroundRect);
		
		startLevelButton = createRect(startLevelButtonTexture, 0.674, 0.414, 0.536, false, missionBackgroundRect);
		
		

		/*
		toggleMissionTypesButton = RectFactory.NewRect( archiveX / designWidth, 
										  archiveY / designHeight + archiveIconText.height / designHeight,
										  archiveIconText.width / designWidth,
										  archiveIconText.height / designHeight);	
		*/
		
		if(saveSystem.currentPlayer != null)
		{
			playerName = saveSystem.currentPlayer.name;
			
			lastUnlockedIndex = saveSystem.currentPlayer.lastUnlockedIndex;
			
			/*if (lastUnlockedIndex < levelsFromXML.numInitialTutorials)
			{
				PlayerPrefs.SetString(Strings.NextLevel, levels[levels.Length - 1 - lastUnlockedIndex].sceneName);
				Application.LoadLevel("LoadingScreen");
				return;
			}*/
								
			agentName = saveSystem.currentPlayer.name;
			agentRank = saveSystem.currentPlayer.rankName;
			
			
			// Calculating how much the exp. bar should be filled:
			var expWithinRank:float = saveSystem.rankSystem.expForThisRank(saveSystem.currentPlayer.rank, saveSystem.currentPlayer.exp);	
			var currentMinExpGoal:float;
			
			if(saveSystem.currentPlayer.rank > 0)
				currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank) -
				saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank - 1);
			else
				currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank);
		
			barDisplay = expWithinRank / currentMinExpGoal;
			/**********/
			
			// Rank Rect 1:
			agentRankRect1 = new Rect(screenWidth * rank1X / designWidth, 
									  screenHeight * rank1Y / designHeight,
									  (agentRank.Length * levelSelectSkin.customStyles[0].fontSize * 0.7),
									  levelSelectSkin.customStyles[0].fontSize * 2);
			
			// Rank Rect 1:
			agentRankRect2 = new Rect(screenWidth * rank2X / designWidth, 
									  screenHeight * rank2Y / designHeight,
									  (agentRank.Length * levelSelectSkin.customStyles[0].fontSize),
									  levelSelectSkin.customStyles[0].fontSize * 2);
			
			// Displayed Player Name:
			playerRect = new Rect(agentRankRect1.width + agentRankRect1.x, 
								  screenHeight * rank1Y / designHeight,
								  playerName.Length * levelSelectSkin.customStyles[0].fontSize,
								  levelSelectSkin.customStyles[0].fontSize * 10);
								  
								  

			
			
			var rankNameCalcSize : Vector2 = rank2Style.CalcSize(GUIContent(agentRank));
			var playerNameCalcSize : Vector2 =  playerNameStyle.CalcSize(GUIContent(playerName));
			
			playerRect.x = agentRankRect2.x + rankNameCalcSize.x + padding;
			
			rankTextureNum = saveSystem.currentPlayer.rank;
			
			if(rankTextureNum >= rankTextures.Count)
				rankTextureNum = rankTextures.Count - 1;
		
			rankRect = createRect(rankTextures[rankTextureNum], 991.0 / 1920.0, 9.0 / 1080.0, 144/ 1080.0, false);
			
			//rankRect.x = playerRect.x + playerNameCalcSize.x + padding;
			
			rankRect.x = missionBackgroundRect.x + padding;
			agentRankRect1.x += rankRect.x + rankRect.width + padding;
			agentRankRect2.x += rankRect.x + rankRect.width + padding;
			playerRect.x += rankRect.x + rankRect.width + padding;
			//progressBarRect.x = agentRankRect1.x - rankRect.width * 1.5f + padding;
			progressBarRect.x = agentRankRect1.x;
			
			
			topRect = createRect(Vector2(1545, 171), 0,0, 0.158, false, screenRect);
			
			if(topRect.width > mainMenuIconRect.x)
				topRect.width -= (mainMenuIconRect.x - topRect.width - padding);

			if(topRect.height > missionBackgroundRect.y)
				topRect.height -= (missionBackgroundRect.y - topRect.height - padding);
			
			rankRect = createRect(Vector2(rankRect.width, rankRect.height), rankRect.x / topRect.width, rankRect.y / topRect.height, rankRect.height/topRect.height, true, topRect);
			
			var maintainSize: Vector2 = Vector2(agentRankRect1.width,agentRankRect1.height);
			agentRankRect1 = createRect(Vector2(agentRankRect1.width, agentRankRect1.height), agentRankRect1.x / topRect.width, agentRankRect1.y / topRect.height, agentRankRect1.height/topRect.height, true, topRect);
			agentRankRect1.width = maintainSize.x;
			agentRankRect1.height = maintainSize.y;
			
			maintainSize = Vector2(agentRankRect2.width,agentRankRect2.height);
			agentRankRect2 = createRect(Vector2(agentRankRect2.width, agentRankRect2.height), agentRankRect2.x / topRect.width, agentRankRect2.y / topRect.height, agentRankRect2.height/topRect.height, true, topRect);
			agentRankRect2.width = maintainSize.x;
			agentRankRect2.height = maintainSize.y;
			
			maintainSize = Vector2(playerRect.width,playerRect.height);
			playerRect = createRect(Vector2(playerRect.width, playerRect.height), playerRect.x / topRect.width, playerRect.y / topRect.height, playerRect.height/topRect.height, true, topRect);
			playerRect.width = maintainSize.x;
			playerRect.height = maintainSize.y;
			
			var gap : float  = agentRankRect1.x - (rankRect.x + rankRect.width + padding);
			agentRankRect1.x -= gap;
			agentRankRect2.x -= gap;
			playerRect.x -= gap;
			
			playerNameText = new ShadowedText(playerName, playerRect, playerNameStyle, false);
			//agentRankText = new ShadowedText(agentRank, rank1Style.normal.textColor, rank2Style.normal.textColor, 1f, agentRankRect1, rank1Style);
			//agentRankText  = new ShadowedText(agentRank, agentRankRect1, playerNameStyle, false);
			agentRankText = new ShadowedText(agentRank, rank1Style.normal.textColor, rank2Style.normal.textColor, 1f, agentRankRect1, rank1Style);
						
		}
		else
			Debug.Log("player not logged in!");
			
		scrollPosition = new Vector2(0.125, 0.125);
		splashBounds = new Rect((screenWidth * scrollPosition.x), (screenHeight * scrollPosition.y), splashWidthPercent * screenWidth, splashHeightPercent * screenHeight);
		var boxHeight = (splashBounds.height - messageBuffer.y) * 0.095;
				
		//messageBuffer = new Vector2(.003 * splashBounds.width, .003 * splashBounds.height);
		
		//REPLACE THIS GPC 4/17/14
		messageBuffer = new Vector2(.02 * splashBounds.width, .01 * splashBounds.height); //MOVE BUFFER TO TOP DECLARATION!
		
		//MOVE THIS TO TOP!!!
		//var subjectHeight:float = boxHeight - messageBuffer.y;
				
		//senderRect_desc = new Rect(messageBuffer.x, messageBuffer.y, emailMessageBackgroundRect.width - messageBuffer.x, splashBounds.height - messageBuffer.y);
		senderRect_desc = new Rect(messageBuffer.x, messageBuffer.y, emailMessageBackgroundRect.width - messageBuffer.x, boxHeight);
				
		//messageBuffer = new Vector2(.02 * splashBounds.width, .001 * splashBounds.height);
		subjectRect = new Rect(messageBuffer.x, messageBuffer.y + boxHeight, emailMessageBackgroundRect.width - messageBuffer.x, boxHeight);
		
		//messageBuffer = new Vector2(.02 * splashBounds.width, .001 * splashBounds.height);
		messageRect = new Rect(messageBuffer.x, messageBuffer.y + (boxHeight*2), emailMessageBackgroundRect.width - messageBuffer.x, boxHeight * 4);
		
		//messageBuffer = new Vector2(.07 * splashBounds.width, .001 * splashBounds.height);
		var objectiveRightBuffer = 0.04 * splashBounds.width;
		//var objectiveRightBuffer = 0.25 * splashBounds.width;
		objectiveRect = new Rect(messageBuffer.x, messageBuffer.y+(boxHeight*5.5), emailMessageBackgroundRect.width - objectiveRightBuffer, boxHeight * 3);
		
		
		
//		GUI.Label(senderRect, message);						
//					GUI.Label(subjectRect, message);						
//					GUI.Label(messageRect, message);											
//					GUI.Label(objectiveRect, message);	
		
		
		LoadLevelList();
		
		//Debug.Log("Unlocked: " + unlockedLevels.Count);
		//Debug.Log("Finished: " + completedLevels.Count);
		
		if(unlockedLevels.Count <= 0)
		{
			if(PlayerPrefs.HasKey("DisplayedGameComplete"))
			{			
				if(PlayerPrefs.GetInt("DisplayedGameComplete") != 1)
					currentResponse.type = EventTypes.GAMECOMPLETE;
			}
			else
				currentResponse.type = EventTypes.GAMECOMPLETE;
		}
		
		//scrollContent = Rect(0, 0, missionBackgroundRect.width, (levels.Length + 1) * (messageHeightPercent * screenHeight) + ((levels.Length + 1) * .05));
		scrollContent = Rect(0, 0, missionBackgroundRect.width, (unlockedLevels.Count + 1) * (messageHeightPercent * screenHeight) + ((levels.Length + 1) * .05));
		backgroundMusic = SoundManager.Instance().backgroundSounds.levelSelectMusic;
		if(unlockedLevels.Count > 0)
		{
			statusRectangle = new Rect(unlockedLevels[0].bounds.x + (unlockedLevels[0].bounds.width) - (unlockedLevels[0].bounds.height * .75 + messageBuffer.x), missionScrollArea.y + messageBuffer.y - (difficultyIcons[0].height * 0.05), unlockedLevels[0].bounds.height * .75, unlockedLevels[0].bounds.height * .75);
			senderRectangle = new Rect(statusRectangle.x - statusRectangle.width - (messageBuffer.x) + unlockedLevels[0].bounds.height * .75, statusRectangle.y, statusRectangle.width, statusRectangle.height);
			senderRect = new Rect(0, missionScrollArea.y + messageBuffer.y, unlockedLevels[0].bounds.height * .75, unlockedLevels[0].bounds.height * .75);
		}
		// check whether to go directly to level instead of loading dashboard
		
		var displayTips:boolean = true;
		if(PlayerPrefs.HasKey("MissionSelectScoreScreen"))
		{
			if(PlayerPrefs.GetInt("MissionSelectScoreScreen") == 0);
				displayTips = false;
		}
		
		pointers = gameObject.GetComponent(TutorialPointers);
		
		if (!isDebugMode && (lastUnlockedIndex < levelsFromXML.numInitialTutorials || (unlockedLevels.Count > 0 && unlockedLevels[0] == levels[0])))
		{
			showSplash = true;
			checkRender = true;
			activeLevelIndex = 0;//levels.Length - 1 - lastUnlockedIndex;
			pointers.Disable();
		}
		else if (displayTutorialToolTips || (displayTips && tooltipDisplay != null && ((lastUnlockedIndex - 1) == levelsFromXML.numInitialTutorials)))
		{				
			var dOS : DisplayOnceSystem = new DisplayOnceSystem(false);
			pointers.Enable(true);
			for (i = 0; i < dashboardTooltips.Length; i++)
			{
				if(!dOS.WasAlreadyDisplayed(i, false, true))
					tooltipDisplay.Activate(dashboardTooltips[i], null);
			}
			PlayerPrefs.SetInt("MissionSelectScoreScreen", 0);
			
		}
		
		codexButtonAB =  new AnimatedButton(Color.blue, codexIconText, codexIconRect, Vector2(screenRect.x + sideButtonArea.x, screenRect.y + sideButtonArea.y));
		archiveButtonAB =  new AnimatedButton(Color.blue, archiveIconText, archiveIconRect, Vector2(screenRect.x + sideButtonArea.x, screenRect.y + sideButtonArea.y));
		mainMenuButtonAB =  new AnimatedButton(Color.blue, mainMenuIconText, mainMenuIconRect, Vector2(screenRect.x, screenRect.y));
		startLevelButtonAB =  new AnimatedButton(Color.yellow, startLevelButtonTexture, startLevelButton, Vector2(screenRect.x + missionBackgroundRect.x, screenRect.y + missionBackgroundRect.y));
		
		
		subjectRect = createRect(Vector2(1062,55), 25f /1301f , 6f / 669f, 55f /669f, false, emailMessageBackgroundRect);
		senderRect_desc = createRect(Vector2(1062,55), 25f /1301f , 80f / 669f, 55f /669f, false, emailMessageBackgroundRect);
		messageRect = createRect(Vector2(1062,295), 25f /1301f , 164f / 669f, 295f /669f, false, emailMessageBackgroundRect);
		objectiveRect = createRect(Vector2(1062,295), 25f /1301f , 390f / 669f, 295f /669f, false, emailMessageBackgroundRect);
		
		objectiveRect.width -= objectiveRightBuffer;
		
	}
	
	private function RenderLevels(levelsToRender : List.<LevelNode>, displayDifficulty : boolean)
	{
		
		// USES DRAGGING CODE FROM CODEX MENU BUT CHANGED TO FIT THIS SCREEN
		if(!inboxTab)
		{
			//To check if the user is holding down in order to drag
			if (!startHolding && (Input.GetKey(KeyCode.Mouse0) || Input.touchCount > 0))
			{
				//Debug.Log("Input detected");
				startHolding = true;
				confirmHolding = false;
				HoldWait();
				
			}
			else if(startHolding && !confirmHolding)
			{
				var changeTest:Vector2;
			
				if(useMouse)
				{
					changeTest = Input.mousePosition - lastMousePos;
					lastMousePos = Input.mousePosition;
				}
				else
				{
					if (Input.touchCount > 0)
						changeTest = Input.touches[0].deltaPosition;
				}
				
				// Sees if the player has moved the minimum distance
				if((Mathf.Abs(changeTest.x) > 1) || (Mathf.Abs(changeTest.y) > 1))
				{
					startHolding = true;
					confirmHolding = true;
					isHolding = true;
					released = false;
				}
					
			}

			// CHECKING FOR RELEASE
			if (startHolding && (!Input.GetKey(KeyCode.Mouse0) && Input.touchCount <= 0))
			{
				startHolding = false;
				isHolding  = false;
				confirmHolding = false;
				ReleaseWait();
			}
			
			
			if(isHolding)
			{
				var change:Vector2;
			
				if(useMouse)
				{
					change = Input.mousePosition - lastMousePos;
					lastMousePos = Input.mousePosition;
				}
				else
				{
					change = Input.touches[0].deltaPosition;
				}
				
				levelSelectScrollPos.y += (change.y) * 2;
				
				if(	levelSelectScrollPos.y < 0)
				{
					levelSelectScrollPos.y = 0;
				}
				// Scroll seems to automatically stop when it can go no further
			}
			

		}
	
		// Scroll bar
		
		//GUI.skin.verticalScrollbarThumb.fixedWidth = screenWidth * scrollThumbWidth;
		
			levelSelectScrollPos = GUI.BeginScrollView
			(
				missionScrollArea,				
				levelSelectScrollPos,
				scrollContent,
				false, 
				false
			);				
				
				//Begin Group for Inbox
				GUI.BeginGroup(levelGroup);
					for (var i:int = 0; i < levelsToRender.Count; i++)
					{
						// if on level archive, do not show briefings
						if (!inboxTab && levelsToRender[i].sceneName.Contains("riefing"))
							continue;

						if(PlayerPrefs.HasKey(levelsToRender[i].sceneName + "Score"))
						{
							if(inboxTab)
								unlockedLevels[i].setScore(PlayerPrefs.GetInt(levelsToRender[i].sceneName + "Score"));
							else
								completedLevels[i].setScore(PlayerPrefs.GetInt(levelsToRender[i].sceneName + "Score"));
						}
						
						//if(i != levelsToRender.Count-1)
						//{
						// choose appropriate item background
						
						//Blink();
						
						//Now fades in and out between the two textures
						if(useNum1BlinkTexture)
						{
							fade += 0.01;
							if(fade >=1f)
								useNum1BlinkTexture = false;
						}
						else
						{
							fade -= 0.01;
							if(fade <=0f)
								useNum1BlinkTexture = true;
						}
						
				
						
						if (i == 0 && displayDifficulty)
						{
							GUI.Label(new Rect(levelsToRender[i].bounds.x, levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - statusRectangle.height) / 4), levelsToRender[i].bounds.width, levelsToRender[i].bounds.height), highlightedItemBackground1);
							GUI.color.a = fade;
							GUI.Label(new Rect(levelsToRender[i].bounds.x, levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - statusRectangle.height) / 4), levelsToRender[i].bounds.width, levelsToRender[i].bounds.height), highlightedItemBackground2);
							GUI.color.a = 1.0f;
						}
						else
						{
							GUI.Label(new Rect(levelsToRender[i].bounds.x, levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - statusRectangle.height) / 4), levelsToRender[i].bounds.width, levelsToRender[i].bounds.height), emailItemBackground);
						}
						
						
						/*
						if (i == 0 && displayDifficulty)
							dispEmailItemBackground = highlightedItemBackground;
						else
							dispEmailItemBackground = emailItemBackground;
						GUI.Label(new Rect(levelsToRender[i].bounds.x, levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - statusRectangle.height) / 4), levelsToRender[i].bounds.width, levelsToRender[i].bounds.height), dispEmailItemBackground);
						*/
						//}
						
												
						statusRectangle.y = levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - statusRectangle.height) / 2) - (difficultyIcons[0].height * 0.0543);
						senderRectangle.y = levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - senderRectangle.height) / 2);
						senderRect.y = statusRectangle.y;
						
						
						//If there is a sender picture, display that, else don't
						if (i == 0 && displayDifficulty)
						{							
							GUI.DrawTexture(senderRect, getBlinkTexture(levelsToRender[i].senderTexture, true),ScaleMode.StretchToFill);
							GUI.color.a = fade;
							GUI.DrawTexture(senderRect, getBlinkTexture(levelsToRender[i].senderTexture, false),ScaleMode.StretchToFill);
							GUI.color.a = 1.0f;
						}
						else if(levelsToRender[i].senderTexture != null)
							GUI.DrawTexture(senderRect, levelsToRender[i].senderTexture,ScaleMode.StretchToFill);
						else
							GUI.DrawTexture(senderRect, characterEmailIcons[0].senderIcon,ScaleMode.StretchToFill);
						
						//Display proper difficulty icon
						
						statusRectangle.y = levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - statusRectangle.height) / 4);
						
						if(displayDifficulty)
						{
							if(levelsToRender[i].sceneName.Contains("Tutorial_"))
							{
								GUI.DrawTexture(statusRectangle, tutorialIcon, ScaleMode.StretchToFill);
							}
							else if(levelsToRender[i].difficulty < difficultyIcons.Count )
							{
								/*if((levelsToRender[i].difficulty - baseDifficulty) >= 0 && (levelsToRender[i].difficulty - baseDifficulty) < difficultyIcons.Count)
									GUI.DrawTexture(statusRectangle, difficultyIcons[levelsToRender[i].difficulty - baseDifficulty], ScaleMode.StretchToFill);
								else if (levelsToRender[i].difficulty - baseDifficulty < 0)
									GUI.DrawTexture(statusRectangle, difficultyIcons[0], ScaleMode.StretchToFill);
								else*/
								GUI.DrawTexture(statusRectangle, difficultyIcons[levelsToRender[i].difficulty], ScaleMode.StretchToFill);
								
								//Debug.Log((levelsToRender[i].difficulty - baseDifficulty) + " - " + levelsToRender[i].displayName + " = " + levelsToRender[i].difficulty);
							}	
							else
							{
								//Debug.LogError("The given difficulty does not have a matching icon");
								GUI.DrawTexture(statusRectangle, difficultyIcons[2], ScaleMode.StretchToFill);
							}		
						}

						levelsToRender[i].bounds.x = senderRect.width;
						
						//If there is a name of the sender, write it
						var subjectString : String = levelsToRender[i].subjectText + "\n\n";
						//if(unlockedLevels[i].senderName != "")		
							//subjectString += "Sender: " + unlockedLevels[i].senderName;						
						//If a message has been selected, show the splash screen
						
						if(GUI.Button(levelsToRender[i].bounds, ""))
						{
							if (levelsToRender[i].sceneName.Contains("riefing"))
							{
								Application.LoadLevel(levelsToRender[i].sceneName);
								PlayerPrefs.SetString("LevelToComplete", levelsToRender[i].sceneName);
								break;
							}
							activeLevelIndex = i;							
							showSplash = true;
						}
						messageLineST.Display(subjectString, levelsToRender[i].bounds, false);

					}
				GUI.EndGroup();   // End of Message Group
			GUI.EndScrollView();  //End Scroll bar
	}
	
	public function Render()
	{
		GUI.BeginGroup(screenRect);
		// checks when in initial tutorial levels, if latest level is a briefing go straight to it
		if (checkRender && unlockedLevels[activeLevelIndex].sceneName.Contains("riefing"))
		{
			Application.LoadLevel(unlockedLevels[activeLevelIndex].sceneName);
			PlayerPrefs.SetString("LevelToComplete", unlockedLevels[activeLevelIndex].sceneName);
			return;
		}

		if(tooltipDisplay != null)
		{
			if (tooltipDisplay.IsActive())
				GUI.enabled = false;
		}

		if(fromScoreScreen)
		{
			activeLevelIndex = 0;
			showSplash = true;
			fromScoreScreen = false;
			Debug.Log("From Score Screen");
		}
	
		GUI.skin = levelSelectSkin;
	
		// Drawing background textures:
		//GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), backgroundText, ScaleMode.StretchToFill);
		AnimatedBackground(backgroundText);
		//GUI.DrawTexture(new Rect(0,0,lineOverlayText.width, lineOverlayText.height), lineOverlayText);
		
		if(saveSystem.currentPlayer != null)
		{
			GUI.BeginGroup(topRect);
				//GUI.Label(agentRankRect2, agentRank, rank2Style);
				//GUI.Label(agentRankRect1, agentRank, rank1Style);
				agentRankText.Display();
				//GUI.Label(playerRect, playerName, playerNameStyle);
				playerNameText.Display();
				
				GUI.DrawTexture(rankRect, rankTextures[rankTextureNum]);
			GUI.EndGroup();
		}
		else
			GUI.Label(new Rect(0,0,200,200), "Not logged in...");
		
		

		// Exp Bar:
		
		GUI.BeginGroup (progressBarRect);
			GUI.Box (Rect (0,0, progressBarRect.width, progressBarRect.height), progressBarBGText);
			// SCORE FILL:
			GUI.BeginGroup (new Rect (0, 0, progressBarRect.width * barDisplay, progressBarRect.height));
				GUI.Box (Rect (0,0, progressBarRect.width, progressBarRect.height), progressBarExpText);
			GUI.EndGroup ();			 
		GUI.EndGroup ();
		
		GUI.DrawTexture(missionBackgroundRect, missionBackgroundText,ScaleMode.StretchToFill);		
		if(!showSplash)	//Renders the Inbox Screen
		{
			GUI.BeginGroup(missionBackgroundRect);
				if (inboxTab){
					RenderLevels(unlockedLevels, true);
				} else {
					RenderLevels(completedLevels, false);
				}
			GUI.EndGroup();
			/*
			if (GUI.Button(toggleMissionTypesButton, inboxTab ? "Archive" : "Inbox")){
				inboxTab = !inboxTab;
			}
			*/
			
			//GUI.DrawTexture(codexIconRect, codexIconText,ScaleMode.StretchToFill);			
			//setButtonTexture(codexIconText, codexIconTextPressed);
			if(codexButtonAB.Render())
			{
				currentResponse.type = EventTypes.CODEXMENU;
			}			
			
			//GUI.DrawTexture(archiveIconRect, inboxTab ? archiveIconText : newMessageText,ScaleMode.StretchToFill);
			//setButtonTexture(inboxTab ? archiveIconText : newMessageText, inboxTab ? archiveIconTextPressed : newMessageTextPressed);
			if(archiveButtonAB.Render(inboxTab ? archiveIconText : newMessageText))
			{
				//currentResponse.type = EventTypes.archiveMENU;
				inboxTab = !inboxTab;
				if (inboxTab)
					scrollContent.height = (unlockedLevels.Count + 1) * (messageHeightPercent * screenHeight) + (levels.Length + 1) * .05;
				else
					scrollContent.height = (completedLevels.Count + 3) * (messageHeightPercent * screenHeight) + (levels.Length + 1) * .05;
			}
			
			//GUI.DrawTexture(mainMenuIconRect, mainMenuIconText, ScaleMode.StretchToFill);
			//setButtonTexture(mainMenuIconText, mainMenuIconTextPressed);
			if(mainMenuButtonAB.Render())
			{
				currentResponse.type = EventTypes.STARTMENU;
			}
			//resetButtonTexture();
			
			//	ANDROID BACK BUTTON
			if(!returnedFromMessage && Input.GetKeyUp(KeyCode.Escape))
				currentResponse.type = EventTypes.STARTMENU;
			else if(returnedFromMessage)
				returnedFromMessage = false;

		}				
		else	//Renders the Splash Screen
		{
			//setButtonTexture(mainMenuIconText, mainMenuIconTextPressed);
			if(mainMenuButtonAB.Render())
			{
				currentResponse.type = EventTypes.STARTMENU;
			}
			//resetButtonTexture();
			GUI.BeginGroup(missionBackgroundRect);
				
				GUI.DrawTexture(emailMessageBackgroundRect, emailMessageBackground,ScaleMode.StretchToFill);
				
				GUI.BeginGroup(emailMessageBackgroundRect);
					//levelSelectSkin.label.fontSize = levelSelectFontSize;				
	
				//Initialize MOVE TO TOP GPC 4/17/14
				var sender:String;
				var subject:String;
				var message:String;
				var mission:String;
				var objective:String;
				
				var dropShadowRect:Rect = new Rect(splashBounds.width * 0.001,splashBounds.height * 0.001,0,0);
	
				GUI.skin = levelSelectSkin;		
				if(inboxTab)
				{
					if(!unlockedLevels[activeLevelIndex].wasRead)
						unlockedLevels[activeLevelIndex].wasRead = true;														
						
						//Modified GPC 4/17/14
//					var message:String = "Sender: " + unlockedLevels[activeLevelIndex].senderName + "\n\nSubject: " 
//											+ unlockedLevels[activeLevelIndex].subjectText + "\n\n" + unlockedLevels[activeLevelIndex].messageText
//											+ "\n\n<size=18><color=yellow><b>Objective: \n     " + unlockedLevels[activeLevelIndex].objectiveText + "</b></color></size>";
					sender = "<b>" + unlockedLevels[activeLevelIndex].senderName + "</b>";
					subject = "<b>" + unlockedLevels[activeLevelIndex].subjectText + "</b>";
					message = "<b>" + unlockedLevels[activeLevelIndex].messageText + "</b>";
					//objective = "<size=18><color=yellow><b>" + unlockedLevels[activeLevelIndex].objectiveText + "</b></color></size>";
					objective = "<b><i>" + unlockedLevels[activeLevelIndex].objectiveText + "</i></b>";
					
					//GPC 4/17 Dropshadows added. Move this to a separate function.					
					//var senderShadow:Rect = new Rect(senderRect_desc.x + (splashBounds.width * 0.004), senderRect_desc.y + (splashBounds.height * 0.004), senderRect_desc.width, senderRect_desc.height);					
					//GUI.Label(senderShadow, "<color=black>" + sender + "</color>");	
					//GUI.Label(senderRect_desc, sender);	
					prevSize = GUI.skin.label.fontSize;
					GUI.skin.label.fontSize *= GUIManager.Instance().levelSelectMenuScaling.messageSender;
					messageLineText.Display(sender, senderRect_desc, false);
					GUI.skin.label.fontSize = prevSize;
					
					//var subjectShadow:Rect = new Rect(subjectRect.x + (splashBounds.width * 0.004), subjectRect.y + (splashBounds.height * 0.004), subjectRect.width, subjectRect.height);					
					//GUI.Label(subjectShadow, "<color=black>" + subject + "</color>");	
					//GUI.Label(subjectRect, subject);	
					prevSize = GUI.skin.label.fontSize;
					GUI.skin.label.fontSize *= GUIManager.Instance().levelSelectMenuScaling.messageSubject;
					messageLineText.Display(subject, subjectRect, false);
					GUI.skin.label.fontSize = prevSize;
					
					//var messageShadow:Rect = new Rect(messageRect.x + (splashBounds.width * 0.004), messageRect.y + (splashBounds.height * 0.004), messageRect.width, messageRect.height);					
					//GUI.Label(messageShadow, "<color=black>" + message + "</color>");											
					//GUI.Label(messageRect, message);	
					prevSize = GUI.skin.label.fontSize;
					GUI.skin.label.fontSize *= GUIManager.Instance().levelSelectMenuScaling.messageText;
					messageText.Display(message, messageRect, false);
					GUI.skin.label.fontSize = prevSize;
					
					//var objectiveShadow:Rect = new Rect(objectiveRect.x + (splashBounds.width * 0.006), objectiveRect.y + (splashBounds.height * 0.006), objectiveRect.width, objectiveRect.height);										
					//GUI.Label(objectiveShadow, "<color=blue>" + objective + "</color>");	
					//objective = "<color=cyan>" + objective + "</color>";																														
					//GUI.Label(objectiveRect, objective);
					levelSelectSkin.label.fontSize = levelNodeFontHeight * 1.75;
					objTextST.Display(objective, objectiveRect, false);
					levelSelectSkin.label.fontSize = levelNodeFontHeight * 1.5;
				}
				else
				{
					if(!completedLevels[activeLevelIndex].wasRead)
						completedLevels[activeLevelIndex].wasRead = true;														
					
					if(inboxTab)
					{
						sender = "<b>" + unlockedLevels[activeLevelIndex].senderName + "</b>";
						subject = "<b>" + unlockedLevels[activeLevelIndex].subjectText + "</b>";
						message = "<b>" + unlockedLevels[activeLevelIndex].messageText + "</b>";
						objective = "<b>" + unlockedLevels[activeLevelIndex].objectiveText + "</b>";
					}
					else
					{
						sender = "<b>" + completedLevels[activeLevelIndex].senderName + "</b>";
						subject = "<b>" + completedLevels[activeLevelIndex].subjectText + "</b>";
						message = "<b>" + completedLevels[activeLevelIndex].messageText + "</b>";
						objective = "<b>" + completedLevels[activeLevelIndex].objectiveText + "</b>";
					}
										
					/*
					GUI.Label(senderRect_desc, sender);						
					GUI.Label(subjectRect, subject);						
					GUI.Label(messageRect, message);											
					GUI.Label(objectiveRect, objective);
					*/
					messageLineText.Display(sender, senderRect_desc, false);
					messageLineText.Display(subject, subjectRect, false);
					messageText.Display(message, messageRect, false);		
					prevSize = levelSelectSkin.label.fontSize;
					levelSelectSkin.label.fontSize = levelNodeFontHeight * 1.75 * (1f + GUIManager.Instance().levelSelectMenuScaling.messageObj);
					objTextST.Display(objective, objectiveRect, false);
					levelSelectSkin.label.fontSize = prevSize;//levelNodeFontHeight * 1.5;

				}
					
				GUI.EndGroup();

				if(inboxTab)
				{
					//setButtonTexture(startLevelButtonTexture, startLevelButtonTexturePressed);
					//GUI.DrawTexture(startLevelButton, startLevelButtonTexture, ScaleMode.StretchToFill);
					if(startLevelButtonAB.Render())
					{							
						PlayerPrefs.SetString(Strings.NextLevel, unlockedLevels[activeLevelIndex].sceneName);
						PlayerPrefs.SetString(Strings.CurrentLevel, unlockedLevels[activeLevelIndex].subjectText);
						Application.LoadLevel("LoadingScreen");
					}
					//resetButtonTexture();
				}
				else
				{
					//setButtonTexture(startLevelButtonTexture, startLevelButtonTexturePressed);
					//GUI.DrawTexture(startLevelButton, startLevelButtonTexture, ScaleMode.StretchToFill);
					if(startLevelButtonAB.Render())
					{							
						PlayerPrefs.SetString(Strings.NextLevel, completedLevels[activeLevelIndex].sceneName);
						PlayerPrefs.SetString(Strings.CurrentLevel, completedLevels[activeLevelIndex].subjectText);
						Application.LoadLevel("LoadingScreen");
					}
					//resetButtonTexture();
				}

			GUI.EndGroup();
			
			//setButtonTexture(backButtonText, backButtonTextPressed);
			// only display back button if past the initial tutorials
			if(lastUnlockedIndex >= levelsFromXML.numInitialTutorials && archiveButtonAB.Render(backButtonText))
			{
				showSplash = false;
			}
			//resetButtonTexture();
			
			//	ANDROID BACK BUTTON
			if(Input.GetKeyUp(KeyCode.Escape) && lastUnlockedIndex >= levelsFromXML.numInitialTutorials)
			{
				returnedFromMessage = true;
				showSplash = false;
			}
		}
		GUI.EndGroup();
		
		pointers.Render();
	}
	
	private function HoldWait()
	{
		//Debug.Log("waiting");
		//yield WaitForSeconds(0.07);
		
		if (startHolding && (Input.GetKey(KeyCode.Mouse0) || Input.touchCount > 0))
		{
			if(Input.GetKey(KeyCode.Mouse0))
			{
				lastMousePos = Input.mousePosition;
				useMouse = true;
			}
			else
				useMouse = false;
		}
	}
	
	//So it doesn't recongize it as a "click" for the button underneath
	private var released:boolean;
	private function ReleaseWait()
	{
		//Debug.Log("waiting");
		yield WaitForSeconds(0.03);
		released = true;
	}
	
	/*
	private function Blink()
	{
		if(isWaitingToSwitch)
		{
			isWaitingToSwitch = false;
			yield WaitForSeconds(blinkSpeed);
			if(useNum1BlinkTexture)
			{
				highlightedItemBackground = highlightedItemBackground2;
				useNum1BlinkTexture = false; 
			}
			else
			{
				highlightedItemBackground = highlightedItemBackground1;
				useNum1BlinkTexture = true;
			}

			isWaitingToSwitch = true;
		}
		
	}*/
	
	public function Update()
	{
//		if(Input.GetKeyDown("k"))
//		{
//			unlockLevel("Tut1");
//		}
//		if(Input.GetKeyDown("j"))
//		{
//			unlockLevel("Tut2");
//		}
	}
	
	public static function SetFromScoreScreen (fromScore : boolean)
	{
		fromScoreScreen = fromScore;
	}

	/// Will mark the given level at unlocked or given an error if there is no such level.
	public function unlockLevel(sceneName : String)
	{
		var levelExsists : boolean = false;
		for(var i :int = 0; i < levels.length; i++)
		{
			if(levels[i].sceneName == sceneName){
				if(!unlockedLevels.Contains(levels[i])){
					shuffleLevels();
					levelExsists = true;
				}
			}			
		}
		if (levelExsists){
			LoadLevelList();
		} else {
			Debug.LogError("Tried to unlock " + sceneName + " and it was not found in LevelSelectMenu's set levels.");
		}
	}
	
	public function completeLevel(sceneName : String)
	{
		for(var i :int = 0; i < levels.length; i++)
		{
			if(levels[i].sceneName == sceneName){
				if(!unlockedLevels.Contains(levels[i])){
					levels[i].completed = true;
					//unlockedLevels.Insert(0, levels[i]);
					saveSystem.currentPlayer.completeLevel(sceneName);
					
					shuffleLevels();
				}
			}
		
		}
	}
	
	private function shuffleLevels()
	{								
		var level : Rect;
		// Calculate the rect dimensions of every level
		for (var i:int = 0; i < unlockedLevels.Count; i++)
		{								
			level = new Rect(0, i * (messageHeightPercent * screenHeight), messageWidthPercent * screenWidth, messageHeightPercent * screenHeight);											
			level.y += i * (level.height * .05);
			unlockedLevels[i].bounds = level;											
		}
	}

	/*
		Eventually, this should be the function that creates the level select menu
		out of a list of levels
	*/
	public function LoadLevelList()
	{
		var level:Rect;				
		unlockedLevels = new List.<LevelNode>();
		completedLevels = new List.<LevelNode>();
		
		numLevels = levels.Length;
		
		levelGroup = new Rect(0, levelGroupY, screenWidth * numLevels, (numLevels + 1) * (messageHeightPercent * screenHeight));
		
		var countUnlocked : int = 0;
		var countCompleted : int = 0;
		
		/*if(GUIManager.addLevel)
		{
			GUIManager.addLevel = false;				
			completeLevel(GUIManager.levelToAdd);
			GUIManager.levelToAdd = "";
		}*/
		
		// Calculate the rect dimensions of every level
		
		
		
		// Goes through the levels multiple times, as many times as there are levels
		// so that unlocks "ripple" through until all proper levels are unlocked
		for (var a:int = numLevels - 1; a >= 0; a--)
		{
			checkForUnlocks();
			
			if(levels[a].unlocked || saveSystem.currentPlayer.levelHasBeenUnlocked(levels[a].sceneName))
			{
				if (saveSystem.currentPlayer.levelHasBeenCompleted(levels[a].sceneName))
					levels[a].completed = true;
			}
		}
		
		var actualLevelIndex : int = numLevels - 1;
		for (var i:int = numLevels - 1; i >= 0 && (isDebugMode || countUnlocked < 3); i--)
		{
			if(levels[i].unlocked || saveSystem.currentPlayer.levelHasBeenUnlocked(levels[i].sceneName))
			{	
				if (levels[i].completed || saveSystem.currentPlayer.levelHasBeenCompleted(levels[i].sceneName)){
					if (levels[i].sceneName.Contains("riefing")) // don't show briefings on completed level list
						continue;
					level = new Rect(0, countCompleted * (messageHeightPercent * screenHeight), /*messageWidthPercent * screenWidth*/missionScrollArea.width * .95, messageHeightPercent * screenHeight);											
					level.y += countCompleted * (level.height * .05);
					levels[i].bounds = level;
					levels[i].subjectText = (levels.Length - actualLevelIndex) + ": " + levels[i].subjectText;
					levels[i].completed = true;
					completedLevels.Add(levels[i]);
					countCompleted++;	
				} else {
					if (countUnlocked < 1)
						baseDifficulty = levels[i].difficulty;
					if (isDebugMode && levels[i].sceneName.Contains("riefing"))
						continue;
					level = new Rect(0, countUnlocked * (messageHeightPercent * screenHeight), /*messageWidthPercent * screenWidth*/missionScrollArea.width * .95, messageHeightPercent * screenHeight);											
					level.y += countUnlocked * (level.height * .05);
					levels[i].bounds = level;
					levels[i].subjectText = (levels.Length - actualLevelIndex) + ": " + levels[i].subjectText;
					unlockedLevels.Add(levels[i]);
					countUnlocked++;
					
					var tutorialUnlockedModifier : int = 1;
					if (levels[i].sceneName.Contains("riefing"))
					{
						if(i > 0)
						{
							i--; // decrement i to prevent the paired level from displaying
							// set loading playerpref variables to paired level
							PlayerPrefs.SetString(Strings.NextLevel, levels[i].sceneName);
							PlayerPrefs.SetString(Strings.CurrentLevel, levels[i].subjectText);
						}
						// for final briefing
						else if (!isDebugMode)
							PlayerPrefs.SetString(Strings.NextLevel, "GameComplete");
						
						tutorialUnlockedModifier = 2;
						saveSystem.currentPlayer.lastUnlockedIndex = lastUnlockedIndex = levels.Length - tutorialUnlockedModifier - i;
						break;
					}
					
					// display no more levels past a tutorial
					if (levels[i].sceneName.Contains("utorial") && !isDebugMode)
					{
						saveSystem.currentPlayer.lastUnlockedIndex = lastUnlockedIndex = levels.Length - tutorialUnlockedModifier - i;
						break;
					} 
				}
				//if(showActive) // If in the Active Tab
				//{
					//0if(!levels[i].completed) //If the level is not completed
				//	{
									
				//	}
				//}
				/*else // If in the Compeleted Tab
				{
					if(levels[i].completed) // If the level is completed
					{
						level = new Rect(0, count * (messageHeightPercent * screenHeight),scrollArea2.width, messageHeightPercent * screenHeight);											
						level.y += count * (level.height * .05);
						levels[i].bounds = level;				
						unlockedLevels.Add(levels[i]);
						count++;
					}
				}*/		
						
			}
			actualLevelIndex--;
		}
		saveSystem.currentPlayer.numToUnlock = 3 - countUnlocked + 1;
		saveSystem.SaveCurrentPlayer();
		//scrollContent.height = unlockedLevels.Count * messageHeightPercent * screenHeight * 2;
			
	}
	
	private function checkForUnlocks()
	{
		for(var i :int = 0; i < levels.length; i++)
		{
			/*switch(levels[i].howToUnlock)
			{
				case UnlockType.RANK:
					if(saveSystem.currentPlayer.rank >= levels[i].rankRequirement)
					{
						levels[i].unlocked = true;
					}
					break;
				case UnlockType.MISSION:
					//Debug.Log("name" + levels[levels[i].missionRequirementIndex].sceneName);
					//if(levels[levels.Length - 1 - levels[i].missionRequirementIndex].completed)
					if (i > levels.Length - 1 - lastUnlockedIndex - 1)// - 3)
						levels[i].unlocked = true;
					break;
				case UnlockType.CONTACT:
					break;
				case UnlockType.NONE:
					levels[i].unlocked = true;
					break;
			}*/
			if (i > levels.Length - 1 - lastUnlockedIndex - 1 || isDebugMode)// - 3)
				levels[i].unlocked = true;
		}
	}

	public var characterEmailIcons : List.<SenderIcon> = new List.<SenderIcon>();
	
	private function assignSenderTexture(name : String):Texture
	{
		//Debug.Log("name: " + name);
		for(var i:int=0; i < characterEmailIcons.Count; i++)
		{
			if(name == characterEmailIcons[i].senderName)
			{
				//Debug.Log("Returning icon for " + characterEmailIcons[i].senderName);
				return characterEmailIcons[i].senderIcon;
			}
		}

		//Debug.Log("Setting as default");
		return characterEmailIcons[0].senderIcon;
	}
	
	private function getBlinkTexture(normalTexture: Texture, useFirst:boolean):Texture
	{
		//Debug.Log("name: " + name);
		for(var i:int=0; i < characterEmailIcons.Count; i++)
		{
			if(characterEmailIcons[i].senderIcon.Equals(normalTexture))
			{
				if(useFirst)
					return characterEmailIcons[i].senderIconHighlight1;
				else
					return characterEmailIcons[i].senderIconHighlight2;
			}
		}
		
		if(useFirst)
			return characterEmailIcons[0].senderIconHighlight1;
		else
			return characterEmailIcons[0].senderIconHighlight2;
	}
	
	public function convertBasicToLevel(basicNode : BasicNode):LevelNode
	{
		var levelNode : LevelNode = new LevelNode();
		levelNode.displayName = basicNode.displayName;
		levelNode.sceneName = basicNode.sceneName;
		levelNode.difficulty = basicNode.difficulty;
		levelNode.subjectText = basicNode.subjectText;
		levelNode.messageText = basicNode.messageText;
		levelNode.objectiveText = basicNode.objectiveText;
		levelNode.isPrimary = basicNode.isPrimary;
		levelNode.senderName = basicNode.senderName;
		levelNode.howToUnlock = basicNode.howToUnlock;
		levelNode.rankRequirement = basicNode.rankRequirement;
		levelNode.missionRequirementIndex = basicNode.missionRequirementIndex;
		levelNode.contactRequirement = basicNode.contactRequirement;
		
		return levelNode;
	}


}

public class SenderIcon
{
	public var senderName : String;
	public var senderIcon : Texture;
	public var senderIconHighlight1 : Texture;
	public var senderIconHighlight2 : Texture;
}