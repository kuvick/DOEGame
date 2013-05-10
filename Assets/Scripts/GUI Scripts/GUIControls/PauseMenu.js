/**********************************************************
PauseMenu.js

Description:

Author: by Francis Yuan
**********************************************************/
#pragma strict

public class PauseMenu extends GUIControl
{
	// Skins for Pause Menu
	public var hexButtonSkin:GUISkin;
	public var pauseMenuSkin:GUISkin;					
	
	// Pause Menu Button Rectangles
	private var background:Rect;
	private var title:Rect;
	private var resumeGameButton:Rect;
	private var levelSelectButton:Rect;
	private var restartButton:Rect;
	private var StartMenuButton:Rect;
	private var saveQuitButton:Rect;	
	
	// Pause Menu Scaling
	private var groupYPosPercent:float = 0.3;				// Y position of the entire menu as a percentage of screen height
	private var menuButtonHeightPercent:float = 0.13;		// Height of each button as a percentage of screen height
	private var menuButtonRatio:float = 3.7;				// Width to height ratio of the button texture (for accurate sclaing)
	private var menuButtonOffsetPercent:float = 1;			// The "height" of the button used for positioning to account for whitespace in the textures
	private var resumeButtonHeightPercent:float = 0.2;		// Width of the resume button as a percent of height
	
	private var menuButtonTextOffsetXPercent:float = -0.1;	// Offset X of the button text so it's aligned according to the mockup
	private var menuButtonTextOffsetYPercent:float = 0.43;	// Offset Y of the button text so it's aligned according to the mockup
	
	private var titleOffsetXPercent:float = 0.02;			// Offset X of the meny title so it's aligned according to the mockup
	private var titleOffsetYPercent:float = -0.6;			// Offset Y of the meny title so it's aligned according to the mockup
	
	private var titleHeightPercent:float = 0.09;			// Height of the font of the title as a percentage of screen height
	private var fontHeightPercent:float = 0.04;				// Height of the font of the buttons as a percentage of screen height
	
	private var resumeButtonFontHeightPercent:float = 0.03;	// Height of the font of the resume button as a pecentage of screen height

	private var menuButtonHeight:float;
	private var menuButtonWidth:float;
	private var resumeButtonHeight:float;	
			
	private var menuButtonOffset:float;
	private var menuButtonTextOffsetY:float;
	private var menuButtonTextOffsetX:float;
	
	private var titleOffsetX:float;
	private var titleOffsetY:float;
	private var titleHeight:float;
	
	private var fontHeight:float;
	private var resumeButtonFontHeight:float;	
	
	// Pause Menu Textures
	public var pauseBackground:Texture;
	
	public function Start()
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		menuButtonHeight = menuButtonHeightPercent* screenHeight;
		menuButtonWidth = menuButtonHeight * menuButtonRatio;
		menuButtonOffset = menuButtonOffsetPercent * menuButtonHeight;
		resumeButtonHeight = resumeButtonHeightPercent * screenHeight;
		
		menuButtonTextOffsetY = menuButtonTextOffsetYPercent * menuButtonHeight;
		menuButtonTextOffsetX = menuButtonTextOffsetXPercent * menuButtonWidth;
		titleOffsetX = titleOffsetXPercent * menuButtonWidth;
		titleOffsetY = titleOffsetYPercent * menuButtonHeight;
		
		titleHeight = titleHeightPercent * screenHeight;
		fontHeight = fontHeightPercent * screenHeight;
		resumeButtonFontHeight = resumeButtonFontHeightPercent * screenHeight;
		
		pauseMenuSkin.label.fontSize = titleHeight;
		pauseMenuSkin.button.fontSize = fontHeight;
		hexButtonSkin.button.fontSize = resumeButtonFontHeight;
		
		pauseMenuSkin.button.contentOffset.x = menuButtonTextOffsetX;
		pauseMenuSkin.button.contentOffset.y = menuButtonTextOffsetY;
		
		background = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		
		resumeGameButton =	Rect(verticalBarWidth + padding, horizontalBarHeight + padding, resumeButtonHeight, resumeButtonHeight);	
		levelSelectButton = Rect(verticalBarWidth + (screenWidth - menuButtonWidth)/2, horizontalBarHeight + screenHeight * groupYPosPercent, menuButtonWidth, menuButtonHeight); 
		restartButton = Rect(levelSelectButton.x, levelSelectButton.y + menuButtonOffset, menuButtonWidth, menuButtonHeight);
		StartMenuButton = Rect(levelSelectButton.x, restartButton.y + menuButtonOffset, menuButtonWidth, menuButtonHeight);
		saveQuitButton = Rect(levelSelectButton.x, StartMenuButton.y + menuButtonOffset, menuButtonWidth, menuButtonHeight);
		
		title = Rect(levelSelectButton.x + titleOffsetX, levelSelectButton.y + titleOffsetY, 0, 0);
		
		// Add the background's rect to the rectList for checking input collision
		rectList.Add(background);
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.pauseMenuMusic;
	}
	
	public function Render()
	{
		GUI.skin = pauseMenuSkin;
		
		GUI.DrawTexture(background, pauseBackground, ScaleMode.ScaleAndCrop);
		GUI.Label(title, "PAUSE");
		
		if (GUI.Button(levelSelectButton, "level select"))
		{
			currentResponse.type = EventTypes.LEVELSELECT;
		}
		
		if (GUI.Button(restartButton, "restart"))
		{
			currentResponse.type = EventTypes.RESTART;
		}
		
		if (GUI.Button(StartMenuButton, "start screen"))
		{
			currentResponse.type = EventTypes.STARTMENU;
		}
		
		if (GUI.Button(saveQuitButton, "save and quit"))
		{
			currentResponse.type = EventTypes.SAVEQUIT;
		}
		
		GUI.skin = hexButtonSkin;
		
		if (GUI.Button(resumeGameButton, "Resume"))
		{
			currentResponse.type = EventTypes.MAIN;
		}
	}
}