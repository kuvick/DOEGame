/**********************************************************
StartMenu.js

Description: 

Author: Katharine Uvick, Francis Yuan
**********************************************************/

#pragma strict

public class StartMenu extends GUIControl
{
	// Set the first level the game is to load when the player
	// clicks "new game"
	public var firstLevel:String = "CE9Narr";

	// Skins for Start Screen
	public var startMenuSkin:GUISkin;
	public var hexButtonSkin:GUISkin;
	
	// Start Screen rectangles
	private var background:Rect;
	private var title:Rect;
	private var quitButton:Rect;
	private var resumeGameButton:Rect;
	private var newGameButton:Rect;
	private var levelSelectButton:Rect;
	private var linkFacebookButton:Rect;
	
	// Start Screen scaling
	private var groupXPercent:float = 0.4;					// X position of the entire menu as a position of screen width
	private var groupYPercent:float = 0.4;					// Y position of the entire menu as a position of screen width
	private var quitButtonHeightPercent:float = 0.1;		// Height (size) of the quit button as a percentage of screen height
	private var buttonHeightPercent:float = 0.13;			// Height (size) of each button as a percentage of screen height
	private var buttonRatio:float = 4.5;						// Width to height ratio of the button texture (for accurate sclaing)
	private var buttonOffsetPercent:float = 1;				// The "height" of the button used for positioning to account for whitespace in the textures
	private var titleHeightPercent:float = 0.17;			// Height of the title texture as a percentage of screen height
	private var titleRatio:float = 5.47;					// Width to height ratio of the title texture
	
	private var buttonTextOffsetXPercent:float = -0.09;		// Offset X of the button text so it's aligned according to the mockup
	private var buttonTextOffsetYPercent:float = 0.37;		// Offset Y of the button text so it's aligned according to the mockup
	
	private var titleOffsetXPercent:float = 0.00;			// Offset X of the menu title so it's aligned according to the mockup
	private var titleOffsetYPercent:float = -0.2;			// Offset Y of the menu title so it's aligned according to the mockup
	
	private var fontHeightPercent:float = 0.04;				// Height of the font of the buttons as a percentage of screen height
	
	private var buttonHeight:float;
	private var buttonWidth:float;
	private var titleHeight:float;
	private var titleWidth:float;
	private var quitButtonHeight:float;
	private var buttonOffset:float;
	private var buttonTextOffsetY:float;
	private var buttonTextOffsetX:float;
	private var titleOffsetX:float;
	private var titleOffsetY:float;
	private var fontHeight:float;
	
	// Start screen textures
	public var firstSlide : Texture;
	public var secondSlide : Texture;
	public var startMenu : Texture;
	public var logoTexture:Texture;
	public var quitTexture:Texture;

	// Screen flow control variables
	private static var showSplash:boolean = true;
	private var currentTexture:Texture = firstSlide;
	
	private var levelToResume:String;
	
	
	// Variables for Profile Selection
	
	
	public function Start ()
	{
		super.Start();
		if (!PlayerPrefs.HasKey(Strings.RESUME)){
			Debug.LogError("There was no level to resume.");
		} else {
			levelToResume = PlayerPrefs.GetString(Strings.RESUME);
			Debug.Log("resume: " + levelToResume);
		}
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		buttonHeight = buttonHeightPercent* screenHeight;
		buttonWidth = buttonHeight * buttonRatio;
		buttonOffset = buttonOffsetPercent * buttonHeight;
		titleHeight = titleHeightPercent * screenHeight;
		titleWidth = titleHeight * titleRatio;
		quitButtonHeight = quitButtonHeightPercent * screenHeight;
		
		buttonTextOffsetY = buttonTextOffsetYPercent * buttonHeight;
		buttonTextOffsetX = buttonTextOffsetXPercent * buttonWidth;
		titleOffsetX = titleOffsetXPercent * titleWidth;
		titleOffsetY = titleOffsetYPercent * titleHeight;
		
		fontHeight = fontHeightPercent * screenHeight;
		
		startMenuSkin.label.fontSize = titleHeight;
		startMenuSkin.button.fontSize = fontHeight;
		startMenuSkin.button.contentOffset.x = buttonTextOffsetX;
		startMenuSkin.button.contentOffset.y = buttonTextOffsetY;
		
		background = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		
		resumeGameButton = Rect(verticalBarWidth + (screenWidth * groupXPercent), horizontalBarHeight + screenHeight * groupYPercent, buttonWidth, buttonHeight); 
		newGameButton = Rect(resumeGameButton.x, resumeGameButton.y + buttonOffset, buttonWidth, buttonHeight);
		levelSelectButton = Rect(resumeGameButton.x, newGameButton.y + buttonOffset, buttonWidth, buttonHeight);
		linkFacebookButton = Rect(resumeGameButton.x, levelSelectButton.y + buttonOffset, buttonWidth, buttonHeight);
		quitButton = Rect(verticalBarWidth + screenWidth - quitButtonHeight, horizontalBarHeight, quitButtonHeight, quitButtonHeight);	
		
		title = Rect((resumeGameButton.x + buttonWidth) - (titleWidth + titleOffsetX), resumeGameButton.y - (titleHeight + titleOffsetY), titleWidth, titleHeight);
		
		RiffSplashScreens();
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.startMenuMusic;
	}
	
	public function Render()
	{
		GUI.DrawTexture(background, currentTexture, ScaleMode.ScaleAndCrop);
		if (!showSplash)
		{
			GUI.DrawTexture(title, logoTexture, ScaleMode.StretchToFill);
			
			GUI.skin = startMenuSkin;
		
			if (!PlayerPrefs.HasKey(Strings.RESUME) || levelToResume == "StartScreen" || levelToResume == "LoadingScreen"
				|| levelToResume == "LevelSelectScreen") // Only display the resume button if there is a level to resume
				GUI.enabled = false;
			if (GUI.Button(resumeGameButton, "resume"))
			{
				currentResponse.type = EventTypes.RESUME;
				
				PlayButtonPress();
				Application.LoadLevel(levelToResume); // TODO We need to load in the actual level not restart it
			}
			GUI.enabled = true;
			
			if (GUI.Button(newGameButton, "new game"))
			{
				//So it can pass to the loading screen where to go next
				var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
				nextLevel.nextLevel = firstLevel;
				Debug.Log("Going to " + firstLevel);
				currentResponse.type = EventTypes.NEWGAME;
				PlayButtonPress();
			}
			
			if (GUI.Button(levelSelectButton, "level select"))
			{
				currentResponse.type = EventTypes.LEVELSELECT;
				PlayButtonPress();
			}
		
			if (GUI.Button(linkFacebookButton, "link to facebook"))
			{
				currentResponse.type = EventTypes.FACEBOOK;
				PlayButtonPress();
			}
			
			GUI.skin = hexButtonSkin;
			if (GUI.Button(quitButton, quitTexture))
			{
				Application.Quit();
			}
		}
		else
		{
		}
	}
	
	public function SetSplash(show:boolean)
	{
		showSplash = show;
		if (show)
		{
			RiffSplashScreens();
		}
		else
		{
			currentTexture = startMenu;
		}
	}
	
	private function RiffSplashScreens():IEnumerator
	{
		//showSplash = true;
		if (showSplash)
		{
			currentTexture = firstSlide;
			yield WaitForSeconds(2);
			currentTexture = secondSlide;
			yield WaitForSeconds(2);
			showSplash = false;
		}
		currentTexture = startMenu;
	}
}