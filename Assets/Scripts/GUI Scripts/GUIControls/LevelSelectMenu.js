/**********************************************************
LevelSelectMenu.js

Description: 

Author: Francis Yuan
**********************************************************/

#pragma strict
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
	
	public var senderTexture : Texture;
	public var senderName : String;
	
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
	// Skins for GUI components
	public var hexButtonSkin:GUISkin;
	public var levelSelectSkin:GUISkin;
	
	// Level Select Menu rectangles
	private var background:Rect;
	private var title:Rect;
	
	private var levelGroup:Rect;	
	private var backButton:Rect;
	
	private var loginRect : Rect;
	private var loginText : String;
	
	//Scroll
	private var scrollArea:Rect;
	private var levelSelectScrollPos:Vector2;
	private var scrollContent : Rect;
	
	private var scrollAreaWidthPercent : float = 0.75;
	private var scrollAreaHeightPercent : float = 0.75;
	private var scrollPosition : Vector2;
	
	private var messageHeightPercent : float = 0.1;
	private var messageWidthPercent : float = 0.70;
	private var yPaddingPercent : float = 0.05;
	
	
	//Textures
	public var unreadTexture : Texture;
	public var primaryTexture : Texture;	
	public var secondaryTexture : Texture;
	private var statusRectangle : Rect;
	private var senderRectangle : Rect;
	
	//Splash Screen / Message View
	private var showSplash = false;
	private var splashBounds : Rect;
	private var splashWidthPercent : float = 0.75;
	private var splashHeightPercent : float = 0.75;
	private var activeLevelIndex : int = -1;
	
	private var startLevelButton : Rect;
	private var startLevelButtonWidth : float = .5;
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
	//private var levelMiddleNodeOffset;
	private var backButtonHeight:float;		
	private var backButtonFontHeight:float;	
	
	// Level Select Menu textures
	public var backgroundTexture:Texture;	
	
	public var levelNodeTexture:Texture;
	
	// Level Select Menu animation
	private var numLevels:int;			
	
	public var levels : LevelNode[];
	public var unlockedLevels : List.<LevelNode>;
	private var secondaryLevels : LevelNode[];
	private var primaryLevels : LevelNode[];
	
	// Used to display player information:
	private var saveSystem : SaveSystem;
	
	//Tabs
	private var primaryTab : Rect;
	private var secondaryTab : Rect;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function Initialize()
	{
		var playerData : GameObject = GameObject.Find("Player Data");
		saveSystem = playerData.GetComponent("SaveSystem");
	
		super.Initialize();
		levelGroupY = 0;//screenHeight * levelGroupYPercent;
		levelTitleFontHeight = levelTitleFontHeightPercent * screenHeight;
		levelNodeFontHeight = levelNodeFontHeightPercent * screenHeight;
		backButtonHeight = backButtonHeightPercent * screenHeight;
		backButtonFontHeight = backButtonFontHeightPercent * screenHeight;
		
		levelSelectSkin.button.fontSize = levelNodeFontHeight;
		levelSelectSkin.label.fontSize = levelTitleFontHeight;
		hexButtonSkin.button.fontSize = backButtonFontHeight;
		
		background = new Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		title = new Rect(verticalBarWidth + screenWidth/2, horizontalBarHeight + padding, 0, 0);
				
		backButton = new Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - padding - backButtonHeight, backButtonHeight, backButtonHeight);	
		
		if(saveSystem.currentPlayer != null)
		{
			loginText  = "Logged in as: " + saveSystem.currentPlayer.name;
		}
		if(saveSystem.currentPlayer.name != "")
		{
			loginText  = "Logged in as: -Username-";
		}
		else
		{
			loginText  = "Logged in as: -Username-";
		}

		loginRect = new Rect(background.x + background.width - (loginText.length * levelSelectSkin.label.fontSize), 0, loginText.length * levelSelectSkin.label.fontSize * 10, levelSelectSkin.label.fontSize * 10);
		
		scrollPosition = new Vector2(0.125, 0.125);
		scrollArea = new Rect(background.x + (screenWidth * scrollPosition.x), background.y + (screenHeight * scrollPosition.y), background.width * scrollAreaWidthPercent, background.height * scrollAreaHeightPercent);		
		splashBounds = new Rect(background.x + (screenWidth * scrollPosition.x), background.y + (screenHeight * scrollPosition.y), splashWidthPercent * screenWidth, splashHeightPercent * screenHeight);
		messageBuffer = new Vector2(.04 * splashBounds.width, .1 * splashBounds.height);
		messageRect = new Rect(messageBuffer.x, messageBuffer.y, splashBounds.width - messageBuffer.x, splashBounds.height - messageBuffer.y);
		startLevelButton = new Rect((splashBounds.width * (startLevelButtonWidth / 2)), splashBounds.height - (splashBounds.height * .30), splashBounds.width * startLevelButtonWidth, splashBounds.height * startLevelButtonHeight);
		
		primaryTab = new Rect(0, scrollArea.y, (screenWidth - scrollArea.x/2), messageHeightPercent * screenHeight);
		secondaryTab = new Rect(primaryTab.x, primaryTab.y + primaryTab.height, primaryTab.width, primaryTab.height);
		
		LoadLevelList();
		scrollContent = Rect(0, 0, scrollArea.width, levels.Length * (messageHeightPercent * screenHeight) + (levels.Length * .05));// - 2 * padding, 1000);
		backgroundMusic = SoundManager.Instance().backgroundSounds.levelSelectMusic;
		
		statusRectangle = new Rect(unlockedLevels[0].bounds.x + (unlockedLevels[0].bounds.width) - (unlockedLevels[0].bounds.height * .75 + messageBuffer.x), scrollArea.y + messageBuffer.y, unlockedLevels[0].bounds.height * .75, unlockedLevels[0].bounds.height * .75);
		senderRectangle = new Rect(statusRectangle.x - statusRectangle.width - (messageBuffer.x), statusRectangle.y, statusRectangle.width, statusRectangle.height);
	}
	
	public function Render()
	{
		GUI.skin = levelSelectSkin;
		GUI.DrawTexture(background, backgroundTexture, ScaleMode.ScaleAndCrop);
		
		// Calculate the mouse position
		var mousePos:Vector2;
		mousePos.x = Input.mousePosition.x;
		mousePos.y = Screen.height - Input.mousePosition.y;
		
		//So it can pass to the loading screen where to go next
		var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);		
		
		loginRect = new Rect(background.x + background.width - (loginText.length * GUI.skin.label.fontSize), background.y, loginText.length * levelSelectSkin.label.fontSize, 50);
		GUI.skin.label.alignment = TextAnchor.UpperRight;
		GUI.Label(background, loginText);
		GUI.skin.label.alignment = TextAnchor.UpperLeft;
		if(!showSplash)	//Renders the Inbox Screen
		{
			GUI.Box(scrollArea,"Inbox");
			
			if(GUI.Button(primaryTab, "Primary"))
			{
				Debug.Log("LOL1");
			}
			if(GUI.Button(secondaryTab, "Secondary"))
			{
				Debug.Log("LOL2");
			}
			// Scroll bar
			levelSelectScrollPos = GUI.BeginScrollView
			(
				scrollArea,
				levelSelectScrollPos,
				scrollContent,
				false, 
				true
			);
				var levelSelectFontSize = levelSelectSkin.label.fontSize;
				levelSelectSkin.label.fontSize = 10;
				
				
				//Begin Group for Inbox
				GUI.BeginGroup(levelGroup);
					for (var i:int = 0; i < unlockedLevels.Count; i++)
					{
						if(PlayerPrefs.HasKey(unlockedLevels[i].sceneName + "Score"))
						{
							unlockedLevels[i].setScore(PlayerPrefs.GetInt(unlockedLevels[i].sceneName + "Score"));
						}
												
						GUI.Box(unlockedLevels[i].bounds, "");
						//statusRectangle.x = unlockedLevels[i].bounds.x;
						statusRectangle.y = unlockedLevels[i].bounds.y + ((unlockedLevels[i].bounds.height - statusRectangle.height) / 2);
						senderRectangle.y = unlockedLevels[i].bounds.y + ((unlockedLevels[i].bounds.height - senderRectangle.height) / 2);
						if(!unlockedLevels[i].wasRead)
						{
							GUI.DrawTexture(statusRectangle, unreadTexture,ScaleMode.StretchToFill);	
						}		
						else
						{
							if(unlockedLevels[i].isPrimary)
							{
								GUI.DrawTexture(statusRectangle, primaryTexture,ScaleMode.StretchToFill);	
							}
							else
							{
								GUI.DrawTexture(statusRectangle, secondaryTexture,ScaleMode.StretchToFill);	
							}
						}		
						
						//If there is an image of the sender, draw it
						if(unlockedLevels[i].senderTexture != null)
							GUI.DrawTexture(senderRectangle, unlockedLevels[i].senderTexture, ScaleMode.StretchToFill);
							
						//If there is a name of the sender, write it
						var subjectString : String = "Subject: " + unlockedLevels[i].subjectText + "\n\n";
						if(unlockedLevels[i].senderName != "")		
							subjectString += "Sender: " + unlockedLevels[i].senderName;						
						//If a message has been selected, show the splash screen
						if(GUI.Button(unlockedLevels[i].bounds, subjectString))
						{
							showSplash = true;
							activeLevelIndex = i;							
						}
					}
				GUI.EndGroup();   // End of Message Group
			GUI.EndScrollView();  //End Scroll bar
			
		}				
		else	//Renders the Splash Screen
		{
			GUI.Box(splashBounds,"Message");
			GUI.BeginGroup(splashBounds);			
				//levelSelectSkin.label.fontSize = levelSelectFontSize;
				GUI.skin = hexButtonSkin;				
				if(GUI.Button(startLevelButton, "Launch Mission"))
				{							
					nextLevel.nextLevel = unlockedLevels[activeLevelIndex].sceneName;
					Application.LoadLevel("LoadingScreen");
				}
				GUI.skin = levelSelectSkin;		
				if(!unlockedLevels[activeLevelIndex].wasRead)
					unlockedLevels[activeLevelIndex].wasRead = true;														
				
				GUI.Label(messageRect, "Subject: " + unlockedLevels[activeLevelIndex].subjectText + "\n\nMessage:\n\n" + unlockedLevels[activeLevelIndex].messageText);						
			GUI.EndGroup();
		}
		
		
		/*
			Switches Back to the hexButtonSkin and draws the Back button
			Back button will take you to the previous screen.
			In inbox view, it will take you back to the game screen.
			In message view, it will take you back to inbox view.		
		*/
		GUI.skin = hexButtonSkin;
		if (GUI.Button(backButton, "Back"))
		{
			if(!showSplash)
			{
				currentResponse.type = EventTypes.MAIN;
				if (!PlayerPrefs.HasKey(Strings.RESUME)){
					Debug.LogError("There was no level to resume.");
				} else {
					var levelToResume : String = PlayerPrefs.GetString(Strings.RESUME);
					Debug.Log("Going to load " + levelToResume);
					Application.LoadLevel(levelToResume); // TODO We need to load in the actual level not restart it
				}
			}
			else
			{
				showSplash = false;
				activeLevelIndex = -1;
				
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

	public function unlockLevel(sceneName : String)
	{
		for(var i :int = 0; i < levels.length; i++)
		{
			if(levels[i].sceneName == sceneName){
				if(!unlockedLevels.Contains(levels[i])){
					levels[i].unlocked = true;
					unlockedLevels.Insert(0, levels[i]);
					shuffleLevels();
				}
			}
		
		}
		
		//reloadLevelList();
		
		//unlockedLevels.Clear();
		//LoadLevelList();
		//scrollContent = Rect(0, 0, scrollArea.width, unlockedLevels.Count * (messageHeightPercent * screenHeight) + (unlockedLevels.Count * .05));
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
		
		numLevels = levels.Length;
		
		levelGroup = new Rect(0, levelGroupY, screenWidth * numLevels, numLevels * (messageHeightPercent * screenHeight));
		
		var count : int = 0;
		
		// Calculate the rect dimensions of every level
		for (var i:int = numLevels - 1; i >= 0; i--)
		{					
			if(levels[i].unlocked)
			{				
				level = new Rect(0, count * (messageHeightPercent * screenHeight), messageWidthPercent * screenWidth, messageHeightPercent * screenHeight);											
				level.y += count * (level.height * .05);
				levels[i].bounds = level;				
				
				unlockedLevels.Add(levels[i]);
				count++;
			}
		}
	}
}