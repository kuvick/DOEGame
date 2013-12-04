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

@XmlRoot("LevelList")
public class LevelList
{
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
	public var levelsFromXML : LevelList;

	//Images
	public var backgroundText: Texture;
	public var difficultyIcons:List.<Texture> = new List.<Texture>();
	
	
	public var codexIconText: Texture;
			private var codexIconRect: Rect;
			private var codexX: float=35;
			private var codexY: float=603;
	public var archiveIconText: Texture;
	public var newMessageText:Texture;
			private var archiveIconRect: Rect;
			private var archiveX: float=35;
			private var archiveY: float=206;
	private var sideButtonHeightPercent:float=0.34;
			
			
	public var emailItemBackground: Texture;
			private var emailItemBackgroundRect: Rect;
	public var emailMessageBackground: Texture;
			private var emailMessageBackgroundRect: Rect;
			private var emailMessageX:float = 66;
			private var emailMessageY:float = 66;
			private var emailMessagePercent:float = 0.75;
	public var imagePlaceholderText: Texture;
			private var senderIconRect: Texture;
	public var emailReadText: Texture;
			private var emailReadRect: Rect;
	public var emailUnreadText: Texture;
			private var emailUnreadRect: Rect;
	//public var lineOverlayText: Texture;
			//private var lineOverlayRect: Rect;
	public var mainMenuIconText: Texture;
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
			private var progressBarPercent:float=0.034;
	private var designWidth : float = 1920;
	private var designHeight : float = 1080;
	public var startLevelButtonTexture: Texture;
	private var missionScrollArea: Rect;
		private var missionScrollX:float =41;
		private var missionScrollY:float = 50;
		private var missionScrollWidth:float = 1440;
		private var missionScrollHeight:float = 762;
		private var missionScrollAreaPercent = 0.85;
	private var barDisplay:float;
	private var agentName:String;
	private var agentRank:String;
		private var agentRankRect1:Rect;
		private var rank1X:float=79;
		private var rank1Y:float=27;
		private var agentRankRect2:Rect;
		private var rank2X:float=83;
		private var rank2Y:float=31;
	private var scrollThumbWidth:float=0.03;
	public var backButtonText: Texture;
	private var rank1Style:GUIStyle;
	private var rank2Style:GUIStyle;
	private var playerNameStyle:GUIStyle;
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

	
	//Scroll
	private var scrollArea:Rect;
	private var scrollArea2: Rect;
	private var levelSelectScrollPos:Vector2;
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
	private var startLevelButtonX : float = 0.72;
	private var startLevelButtonY : float = 0.60;
	private var startLevelButtonPercent:float = 0.19;
	
	private var messageBuffer : Vector2;
	private var messageRect : Rect;
	
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
	private var baseUnlockedIndex : int = 0;
	
	private static var fromScoreScreen : boolean = false;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
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
		levelTitleFontHeight = levelTitleFontHeightPercent * screenHeight;
		levelNodeFontHeight = levelNodeFontHeightPercent * screenHeight;
		
		levelSelectSkin.button.fontSize = levelNodeFontHeight;
		levelSelectSkin.label.fontSize = levelNodeFontHeight * 1.5;
		levelSelectSkin.customStyles[0].fontSize = levelNodeFontHeight * 2;
		levelSelectSkin.customStyles[1].fontSize = levelNodeFontHeight * 2;
		levelSelectSkin.customStyles[2].fontSize = levelNodeFontHeight * 2;
		
		
		//hexButtonSkin.button.fontSize = backButtonFontHeight;
		/******************************************/
		
		var playerData : GameObject = GameObject.Find("Player Data");		
		saveSystem = playerData.GetComponent("SaveSystem");
		
		
		var sideButtonArea : Rect = Rect(0,0,260/designWidth * screenWidth, 1080/designHeight * screenHeight);
	
										  
		codexIconRect = createRect(codexIconText, codexX / 260, codexY / designHeight, sideButtonHeightPercent, true, sideButtonArea);
		archiveIconRect = createRect(archiveIconText, archiveX / 260, archiveY / designHeight, sideButtonHeightPercent, true, sideButtonArea);
		
		missionBackgroundRect = createRect(missionBackgroundText, missionBGX / designWidth, missionBGY / designHeight, missionBGHeightPercent, true);
		mainMenuIconRect = createRect(mainMenuIconText, mainMenuX / designWidth, mainMenuY / designHeight, mainMenuPercent, true);										  
		progressBarRect = createRect(progressBarBGText, progressBarX / designWidth, progressBarY / designHeight, progressBarPercent, false);
		
		emailMessageBackgroundRect = createRect(emailMessageBackground,emailMessageX/ designWidth, emailMessageY/designHeight, emailMessagePercent, true, missionBackgroundRect);
		// Scroll Area:
		missionScrollArea = createRect(Vector2(missionScrollWidth, missionScrollHeight), missionScrollX / designWidth, missionScrollY / designHeight, missionScrollAreaPercent, true, missionBackgroundRect);

		
		startLevelButton = createRect(startLevelButtonTexture, startLevelButtonX, startLevelButtonY, startLevelButtonPercent, true, missionBackgroundRect);
		
		

		/*
		toggleMissionTypesButton = RectFactory.NewRect( archiveX / designWidth, 
										  archiveY / designHeight + archiveIconText.height / designHeight,
										  archiveIconText.width / designWidth,
										  archiveIconText.height / designHeight);	
		*/
		
		
		
		if(saveSystem.currentPlayer != null)
		{
								
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
	
			playerName = saveSystem.currentPlayer.name;
			
			baseUnlockedIndex = saveSystem.currentPlayer.baseUnlockedIndex;
			
			// Displayed Player Name:
			playerRect = new Rect(agentRankRect1.width + agentRankRect1.x, 
								  screenHeight * rank1Y / designHeight,
								  playerName.Length * levelSelectSkin.customStyles[0].fontSize,
								  levelSelectSkin.customStyles[0].fontSize * 10);
		}	
		else
			Debug.Log("player not logged in!");
			
		scrollPosition = new Vector2(0.125, 0.125);
		splashBounds = new Rect((screenWidth * scrollPosition.x), (screenHeight * scrollPosition.y), splashWidthPercent * screenWidth, splashHeightPercent * screenHeight);
		messageBuffer = new Vector2(.004 * splashBounds.width, .004 * splashBounds.height);
		messageRect = new Rect(messageBuffer.x, messageBuffer.y, splashBounds.width - messageBuffer.x, splashBounds.height - messageBuffer.y);
		
		LoadLevelList();
		//scrollContent = Rect(0, 0, missionBackgroundRect.width, (levels.Length + 1) * (messageHeightPercent * screenHeight) + ((levels.Length + 1) * .05));
		scrollContent = Rect(0, 0, missionBackgroundRect.width, (unlockedLevels.Count + 1) * (messageHeightPercent * screenHeight) + ((levels.Length + 1) * .05));
		backgroundMusic = SoundManager.Instance().backgroundSounds.levelSelectMusic;
		if(unlockedLevels.Count > 0)
		{
			statusRectangle = new Rect(unlockedLevels[0].bounds.x + (unlockedLevels[0].bounds.width) - (unlockedLevels[0].bounds.height * .75 + messageBuffer.x), missionScrollArea.y + messageBuffer.y, unlockedLevels[0].bounds.height * .75, unlockedLevels[0].bounds.height * .75);
			senderRectangle = new Rect(statusRectangle.x - statusRectangle.width - (messageBuffer.x) + unlockedLevels[0].bounds.height * .75, statusRectangle.y, statusRectangle.width, statusRectangle.height);
			senderRect = new Rect(0, missionScrollArea.y + messageBuffer.y, unlockedLevels[0].bounds.height * .75, unlockedLevels[0].bounds.height * .75);
		}
	}
	
	private function RenderLevels(levelsToRender : List.<LevelNode>)
	{
		// Scroll bar
		
		GUI.skin.verticalScrollbarThumb.fixedWidth = screenWidth * scrollThumbWidth;
		
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
						if(PlayerPrefs.HasKey(levelsToRender[i].sceneName + "Score"))
						{
							if(inboxTab)
								unlockedLevels[i].setScore(PlayerPrefs.GetInt(levelsToRender[i].sceneName + "Score"));
							else
								completedLevels[i].setScore(PlayerPrefs.GetInt(levelsToRender[i].sceneName + "Score"));
							
						}
						
						if(i != levelsToRender.Count-1)
						{
							GUI.Label(new Rect(levelsToRender[i].bounds.x, levelsToRender[i].bounds.y + (levelsToRender[i].bounds.height * .75), levelsToRender[i].bounds.width, levelsToRender[i].bounds.height / 2), emailItemBackground);
						}
						
												
						statusRectangle.y = levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - statusRectangle.height) / 2);
						senderRectangle.y = levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - senderRectangle.height) / 2);
						senderRect.y = statusRectangle.y;
						
						
						//If there is a sender picture, display that, else don't
						if(levelsToRender[i].senderTexture != null)
							GUI.DrawTexture(senderRect, levelsToRender[i].senderTexture,ScaleMode.StretchToFill);
						else
							GUI.DrawTexture(senderRect, imagePlaceholderText,ScaleMode.StretchToFill);
						
						//Display proper mail icon
						if(levelsToRender[i].difficulty < difficultyIcons.Count )
						{
							GUI.DrawTexture(statusRectangle, difficultyIcons[levelsToRender[i].difficulty], ScaleMode.StretchToFill);
						}	
						else
						{
							Debug.LogError("The given difficulty does not have a matching icon");
						}		

						levelsToRender[i].bounds.x = senderRect.width;
						
						//If there is a name of the sender, write it
						var subjectString : String = levelsToRender[i].subjectText + "\n\n";
						//if(unlockedLevels[i].senderName != "")		
							//subjectString += "Sender: " + unlockedLevels[i].senderName;						
						//If a message has been selected, show the splash screen
						if(GUI.Button(levelsToRender[i].bounds, subjectString))
						{
							showSplash = true;
							activeLevelIndex = i;							
						}

					}
				GUI.EndGroup();   // End of Message Group
			GUI.EndScrollView();  //End Scroll bar
	}
	
	public function Render()
	{
		GUI.skin = levelSelectSkin;
	
		// Drawing background textures:
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), backgroundText);
		//GUI.DrawTexture(new Rect(0,0,lineOverlayText.width, lineOverlayText.height), lineOverlayText);
		
		//Getting style and displaying names
		rank1Style =  GUI.skin.GetStyle("title1");
		rank2Style =  GUI.skin.GetStyle("title2");
		playerNameStyle =  GUI.skin.GetStyle("playerName");
		
		if(saveSystem.currentPlayer != null)
		{
			GUI.Label(agentRankRect2, agentRank, rank2Style);
			GUI.Label(agentRankRect1, agentRank, rank1Style);
			GUI.Label(playerRect, playerName, playerNameStyle);
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
					RenderLevels(unlockedLevels);
				} else {
					RenderLevels(completedLevels);
				}
			GUI.EndGroup();
			/*
			if (GUI.Button(toggleMissionTypesButton, inboxTab ? "Archive" : "Inbox")){
				inboxTab = !inboxTab;
			}
			*/
			
			GUI.DrawTexture(codexIconRect, codexIconText,ScaleMode.StretchToFill);
			if(GUI.Button(codexIconRect, ""))
			{
				currentResponse.type = EventTypes.CODEXMENU;
			}
			
			GUI.DrawTexture(archiveIconRect, inboxTab ? archiveIconText : newMessageText,ScaleMode.StretchToFill);
			if(GUI.Button(archiveIconRect, ""))
			{
				//currentResponse.type = EventTypes.archiveMENU;
				inboxTab = !inboxTab;
			}
			
			GUI.DrawTexture(mainMenuIconRect, mainMenuIconText, ScaleMode.StretchToFill);
			if(GUI.Button(mainMenuIconRect, ""))
			{
				currentResponse.type = EventTypes.STARTMENU;
			}
		}				
		else	//Renders the Splash Screen
		{
			GUI.BeginGroup(missionBackgroundRect);
				
				GUI.DrawTexture(emailMessageBackgroundRect, emailMessageBackground,ScaleMode.StretchToFill);
				
				GUI.BeginGroup(emailMessageBackgroundRect);
					//levelSelectSkin.label.fontSize = levelSelectFontSize;				
	
				GUI.skin = levelSelectSkin;		
				if(inboxTab)
				{
					if(!unlockedLevels[activeLevelIndex].wasRead)
						unlockedLevels[activeLevelIndex].wasRead = true;														
					var message:String = "Sender: " + unlockedLevels[activeLevelIndex].senderName + "\n\nSubject: " + unlockedLevels[activeLevelIndex].subjectText + "\n\n" + unlockedLevels[activeLevelIndex].messageText;
					
					GUI.Label(messageRect, message);						
				}
				else
				{
					if(!completedLevels[activeLevelIndex].wasRead)
						completedLevels[activeLevelIndex].wasRead = true;														
					
					GUI.Label(messageRect, "Sender: " + completedLevels[activeLevelIndex].senderName + "\n\nSubject: " + completedLevels[activeLevelIndex].subjectText + "\n\n" + completedLevels[activeLevelIndex].messageText);			

				}
					
				GUI.EndGroup();

				if(inboxTab)
				{
					GUI.DrawTexture(startLevelButton, startLevelButtonTexture, ScaleMode.StretchToFill);
					if(GUI.Button(startLevelButton, ""))
					{							
						PlayerPrefs.SetString(Strings.NextLevel, unlockedLevels[activeLevelIndex].sceneName);
						Application.LoadLevel("LoadingScreen");
					}
				}
				else
				{
					GUI.DrawTexture(startLevelButton, startLevelButtonTexture, ScaleMode.StretchToFill);
					if(GUI.Button(startLevelButton, ""))
					{							
						PlayerPrefs.SetString(Strings.NextLevel, completedLevels[activeLevelIndex].sceneName);
						Application.LoadLevel("LoadingScreen");
					}
				}

			GUI.EndGroup();
			
			GUI.DrawTexture(archiveIconRect, backButtonText, ScaleMode.StretchToFill);
			if(GUI.Button(archiveIconRect, ""))
			{
				showSplash = false;
			}
		}
		
	}
	
	public function Update()
	{
		if(Input.GetKeyDown("k"))
		{
			unlockLevel("Tut1");
		}
		if(Input.GetKeyDown("j"))
		{
			unlockLevel("Tut2");
		}
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
		
		if(GUIManager.addLevel)
		{
			GUIManager.addLevel = false;				
			completeLevel(GUIManager.levelToAdd);;
			GUIManager.levelToAdd = "";
		}
		
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
			
		CheckForBaseUnlockIndexChange();	
		checkForUnlocks();
		
		for (var i:int = numLevels - 1; i >= 0; i--)
		{
			if(levels[i].unlocked || saveSystem.currentPlayer.levelHasBeenUnlocked(levels[i].sceneName))
			{	
				if (levels[i].completed || saveSystem.currentPlayer.levelHasBeenCompleted(levels[i].sceneName)){
					level = new Rect(0, countCompleted * (messageHeightPercent * screenHeight), /*messageWidthPercent * screenWidth*/missionScrollArea.width * .95, messageHeightPercent * screenHeight);											
					level.y += countCompleted * (level.height * .05);
					levels[i].bounds = level;
					levels[i].completed = true;
					completedLevels.Add(levels[i]);
					countCompleted++;	
				} else {
					level = new Rect(0, countUnlocked * (messageHeightPercent * screenHeight), /*messageWidthPercent * screenWidth*/missionScrollArea.width * .95, messageHeightPercent * screenHeight);											
					level.y += countUnlocked * (level.height * .05);
					levels[i].bounds = level;
					unlockedLevels.Add(levels[i]);
					countUnlocked++;	
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
		}
		//scrollContent.height = unlockedLevels.Count * messageHeightPercent * screenHeight * 2;
			
	}
	
	private function checkForUnlocks()
	{
		for(var i :int = 0; i < levels.length; i++)
		{
			switch(levels[i].howToUnlock)
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
					if (i > levels.Length - 1 - baseUnlockedIndex - 3)
						levels[i].unlocked = true;
					break;
				case UnlockType.CONTACT:
					break;
				case UnlockType.NONE:
					levels[i].unlocked = true;
					break;
			}
		}
	}
	
	private function CheckForBaseUnlockIndexChange()
	{
		//Debug.Log("zomg"); 	//******commented to make debugging easier
		var i : int = 0;
		for (i = levels.Length - 1 - baseUnlockedIndex; i >= 0 && i > levels.Length - 1 - baseUnlockedIndex - 3; i--)
		{
			//Debug.Log("zomg" + i + levels[i].sceneName); 	//******commented to make debugging easier
			if (!levels[i].completed)
				return;
		}
		//Debug.Log("changing base to " + i); 	//******commented to make debugging easier
		baseUnlockedIndex = levels.Length - 1 - i;
		saveSystem.currentPlayer.baseUnlockedIndex = baseUnlockedIndex;
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
	
	public function convertBasicToLevel(basicNode : BasicNode):LevelNode
	{
		var levelNode : LevelNode = new LevelNode();
		levelNode.displayName = basicNode.displayName;
		levelNode.sceneName = basicNode.sceneName;
		levelNode.difficulty = basicNode.difficulty;
		levelNode.subjectText = basicNode.subjectText;
		levelNode.messageText = basicNode.messageText;
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
}