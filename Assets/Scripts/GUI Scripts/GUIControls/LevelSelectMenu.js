/**********************************************************
LevelSelectMenu.js

Description: 

Author: Francis Yuan
**********************************************************/
#pragma strict
enum UnlockType
{
	NONE,
	RANK,
	MISSION,
	CONTACT
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
	public var isPrimary = true;
	public var wasRead : boolean = false;
	public var completed : boolean = false;
	
	public var senderTexture : Texture;
	public var senderName : String;
	
	public var howToUnlock : UnlockType;
	public var rankRequirement : int = -1;
	public var missionRequirementIndex : int = -1;
	public var contactRequirement : String;
	
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
	//Images
	public var backgroundText: Texture;
	
	public var codexIconText: Texture;
			private var codexIconRect: Rect;
			private var codexX: float=35;
			private var codexY: float=382;
	public var contactsIconText: Texture;
			private var contactsIconRect: Rect;
			private var contactsX: float=35;
			private var contactsY: float=609;
	public var emailDividerText: Texture;
			private var emailDividerRect: Rect;
	public var imagePlaceholderText: Texture;
			private var senderIconRect: Texture;
	public var emailReadText: Texture;
			private var emailReadRect: Rect;
	public var emailUnreadText: Texture;
			private var emailUnreadRect: Rect;
	public var lineOverlayText: Texture;
			private var lineOverlayRect: Rect;
	public var mainMenuIconText: Texture;
			private var mainMenuIconRect: Rect;
			private var mainMenuX: float=1748;
			private var mainMenuY: float=31;
	public var missionBackgroundText: Texture;
			private var missionBackgroundRect: Rect;
			private var missionBGX: float=263;
			private var missionBGY: float=182;
	public var progressBarExpText: Texture;
	public var progressBarBGText: Texture;
			private var progressBarRect: Rect;
			private var progressBarX: float=100;
			private var progressBarY: float=117;
	private var designWidth : float = 1920;
	private var designHeight : float = 1080;
	public var launchMissionButton: Texture;
	private var missionScrollArea: Rect;
		private var missionScrollX:float = 300;
		private var missionScrollY:float = 223;
		private var missionScrollWidth:float = 1419;
		private var missionScrollHeight:float = 749;
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
	
	private var availableMissionsButton : Rect;
	private var archivedMissionsButton : Rect;
	public var tabHeightPercentage : float = .15;
	public var tabWidthPercentage : float = .15;

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
	
	private var messageHeightPercent : float = 0.1;
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
	private var startLevelButtonWidth : float = .25;
	private var startLevelButtonHeight : float = .25;
	
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
	
	private static var fromScoreScreen : boolean = false;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
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
	
		//Codex Icon:
		codexIconRect = RectFactory.NewRect( codexX / designWidth, 
										  codexY / designHeight,
										  codexIconText.width / designWidth,
										  codexIconText.height / designHeight);	
				
		//Contacts Icon:
		contactsIconRect = RectFactory.NewRect( contactsX / designWidth, 
										  contactsY / designHeight,
										  contactsIconText.width / designWidth,
										  contactsIconText.height / designHeight);	

		//Main Menu Icon:
		mainMenuIconRect = RectFactory.NewRect( mainMenuX / designWidth, 
										  mainMenuY / designHeight,
										  mainMenuIconText.width / designWidth,
										  mainMenuIconText.height / designHeight);	
		
		//Mission Background:	
		missionBackgroundRect = RectFactory.NewRect( missionBGX / designWidth, 
										  missionBGY / designHeight,
										  missionBackgroundText.width / designWidth,
										  missionBackgroundText.height / designHeight);			
	
		// Exp Bar:
		progressBarRect = RectFactory.NewRect( progressBarX / designWidth, 
										  progressBarY / designHeight,
										  progressBarBGText.width / designWidth,
										  progressBarBGText.height / designHeight);	
										  
		// Scroll Area:
		missionScrollArea = RectFactory.NewRect( missionScrollX / designWidth, 
										  missionScrollY / designHeight,
										  missionScrollWidth / designWidth,
										  (missionBackgroundText.height - (missionBackgroundText.height * 0.10)) / designHeight);


		availableMissionsButton = RectFactory.NewRect( missionScrollX / designWidth, 
										  progressBarY / designHeight,
										  tabWidthPercentage,
										  tabHeightPercentage);	
		archivedMissionsButton = RectFactory.NewRect( missionScrollX / designWidth + tabWidthPercentage, 
										  progressBarY / designHeight,
										  tabWidthPercentage,
										  tabHeightPercentage);	
		
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
		messageBuffer = new Vector2(.04 * splashBounds.width, .1 * splashBounds.height);
		messageRect = new Rect(messageBuffer.x, messageBuffer.y, splashBounds.width - messageBuffer.x, splashBounds.height - messageBuffer.y);
		startLevelButton = new Rect((splashBounds.width /2 - (startLevelButtonWidth * splashBounds.width / 2)),splashBounds.height /1.75 - (startLevelButtonHeight * splashBounds.height / 2), splashBounds.width * (launchMissionButton.width / designWidth), splashBounds.height * (launchMissionButton.height/ designHeight));	
		
		LoadLevelList();
		scrollContent = Rect(0, 0, missionBackgroundRect.width, (levels.Length + 1) * (messageHeightPercent * screenHeight) + ((levels.Length + 1) * .05));
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
							unlockedLevels[i].setScore(PlayerPrefs.GetInt(levelsToRender[i].sceneName + "Score"));
						}
						
						if(i != levelsToRender.Count-1)
						{
							GUI.Label(new Rect(levelsToRender[i].bounds.x, levelsToRender[i].bounds.y + (levelsToRender[i].bounds.height * .75), levelsToRender[i].bounds.width, levelsToRender[i].bounds.height / 2), emailDividerText);
						}
						
												
						statusRectangle.y = levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - statusRectangle.height) / 2);
						senderRectangle.y = levelsToRender[i].bounds.y + ((levelsToRender[i].bounds.height - senderRectangle.height) / 2);
						senderRect.y = statusRectangle.y;
						
						
						//If there is a sender picture, display that, else don't
						if(levelsToRender[i].senderTexture != null)
							GUI.DrawTexture(senderRect, imagePlaceholderText,ScaleMode.StretchToFill);
						else
							GUI.DrawTexture(senderRect, imagePlaceholderText,ScaleMode.StretchToFill);
						
						//Display proper mail icon
						if(!levelsToRender[i].wasRead)
						{
							GUI.DrawTexture(statusRectangle, emailUnreadText,ScaleMode.StretchToFill);
						}		
						else
						{
							GUI.DrawTexture(statusRectangle, emailReadText,ScaleMode.StretchToFill);	
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
		GUI.DrawTexture(new Rect(0,0,lineOverlayText.width, lineOverlayText.height), lineOverlayText);
		
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
			if (inboxTab){
				RenderLevels(unlockedLevels);
			} else {
				RenderLevels(completedLevels);
			}
			
			if (GUI.Button(availableMissionsButton, "Inbox")){
				inboxTab = true;
			}
			if (GUI.Button(archivedMissionsButton, "Archive")){
				inboxTab = false;
			}
			if(GUI.Button(codexIconRect, codexIconText))
			{
				currentResponse.type = EventTypes.CODEXMENU;
			}
			
			if(GUI.Button(contactsIconRect, contactsIconText))
			{
				currentResponse.type = EventTypes.CONTACTSMENU;
			}
			
			if(GUI.Button(mainMenuIconRect, mainMenuIconText))
			{
				currentResponse.type = EventTypes.STARTMENU;
			}
		}				
		else	//Renders the Splash Screen
		{
			GUI.BeginGroup(missionScrollArea);			
				//levelSelectSkin.label.fontSize = levelSelectFontSize;				

				GUI.skin = levelSelectSkin;		
				if(!unlockedLevels[activeLevelIndex].wasRead)
					unlockedLevels[activeLevelIndex].wasRead = true;														
				
				GUI.Label(messageRect, "Subject: " + unlockedLevels[activeLevelIndex].subjectText + "\n\nMessage:\n\n" + unlockedLevels[activeLevelIndex].messageText);						
				
				startLevelButton.y = messageRect.y + GUI.skin.GetStyle("Label").CalcSize(GUIContent("Subject: " + unlockedLevels[activeLevelIndex].subjectText + "\n\nMessage:\n\n" + unlockedLevels[activeLevelIndex].messageText)).y * 2.0f;
				
				if(GUI.Button(startLevelButton, launchMissionButton))
				{							
					PlayerPrefs.SetString(Strings.NextLevel, unlockedLevels[activeLevelIndex].sceneName);
					Application.LoadLevel("LoadingScreen");
				}
				
			GUI.EndGroup();
			
			if(GUI.Button(contactsIconRect, backButtonText))
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
		
		checkForUnlocks();
		
		// Calculate the rect dimensions of every level
		for (var i:int = numLevels - 1; i >= 0; i--)
		{					
			if(levels[i].unlocked || saveSystem.currentPlayer.levelHasBeenUnlocked(levels[i].sceneName))
			{	
				if (levels[i].completed || saveSystem.currentPlayer.levelHasBeenCompleted(levels[i].sceneName)){
					level = new Rect(0, countCompleted * (messageHeightPercent * screenHeight), /*messageWidthPercent * screenWidth*/missionScrollArea.width * .95, messageHeightPercent * screenHeight);											
					level.y += countCompleted * (level.height * .05);
					levels[i].bounds = level;
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
					if(levels[levels[i].missionRequirementIndex].completed)
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


}