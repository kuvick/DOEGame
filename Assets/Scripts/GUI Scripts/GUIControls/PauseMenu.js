/**********************************************************
PauseMenu.js

Description:

Author: by Francis Yuan
**********************************************************/
#pragma strict

public class PauseMenu extends GUIControl
{
	
	// BG Textures
	public var pauseScreenSkin : GUISkin;
	public var background : Texture;
	//public var lineOverlay : Texture;
	private var defaultColor : Color;
	private var transparentColor : Color;
	
	// Paused Text
	public var pauseText : Texture;
	private var pauseTextRect : Rect;
	private var pauseTextPercent:float = 0.14;
	private var pauseTextX : float = 0.54;
	private var pauseTextY : float = 0.23;
	
	// Back Button
	public var backButton : Texture;
	public var backButtonPressed : Texture;
	private var backButtonRect : Rect;
	private var backButtonPercent:float = 0.11;
	private var backButtonX : float = 0.03;
	private var backButtonY : float = 0.05;
	
	// Restart Button
	public var restartButton : Texture;
	public var restartButtonPressed : Texture;
	private var restartButtonRect : Rect;

	// Dashboard Button
	public var dashboardButton : Texture;
	public var dashboardButtonPressed : Texture;
	private var dashboardButtonRect : Rect;
	
	// Main Menu Button
	public var mainMenuButton : Texture;
	public var mainMenuButtonPressed : Texture;
	private var mainMenuButtonRect : Rect;
	
	//Button Vars
	private var buttonPercent: float = 0.11;
	private var buttonBufferPercent: float = 0.04;
	private var buttonInitialYPercent: float = 0.45;
	private var buttonXPercent: float = 0.59;
	
	// Hex Texture
	public var hexText : Texture;
	private var hexTextRect : Rect;
	private var hexTextX : float = 0.39;
	private var hexTextY : float = 0;
	private var hexPercent : float = 1;

	// current level text
	private var levelName : String;
	private var levelRect : Rect;
	private var levelSize : Vector2 = Vector2(5, 1);
	private var levelXPercent : float = .2f;
	private var levelYPercent : float = .05f;
	private var levelHeightPercent : float = .11f;

	//Buttons/Text Group - to help maintain a buffer on the far right side of the screen
	private var groupRect:Rect;
	
	private var intelSystem:IntelSystem;
	
	public function Start()
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		defaultColor = new Color(1.0f, 1.0f, 1.0f, 1.0f);
		transparentColor = new Color(1.0f, 1.0f, 1.0f, 0.9f);
		
		
		groupRect = Rect(0,0,screenWidth - (buttonBufferPercent * screenWidth), screenHeight - (buttonBufferPercent * screenHeight));

		
		//Calculating Rect.
			// PausedText											  
		pauseTextRect = createRect(pauseText, pauseTextX, pauseTextY, pauseTextPercent, true, groupRect);

			// Hex Texture
		hexTextRect = createRect(hexText, hexTextX, hexTextY, hexPercent, false);
											  
											  
			// Back Button
		backButtonRect = createRect(backButton, backButtonX, backButtonY, backButtonPercent, false);
											  
			// Restart Button
		restartButtonRect = createRect(restartButton, buttonXPercent, buttonInitialYPercent, buttonPercent, true, groupRect);
											  
			// Dashboard Button
		dashboardButtonRect = createRect(dashboardButton, buttonXPercent, buttonInitialYPercent + buttonPercent + buttonBufferPercent, buttonPercent, true, groupRect);
											  
			// Main Menu Button
		mainMenuButtonRect = createRect(mainMenuButton, buttonXPercent, buttonInitialYPercent + (buttonPercent*2) + (buttonBufferPercent*2), buttonPercent, true, groupRect);
		
		// level name display
		levelRect = createRect(levelSize, levelXPercent, levelYPercent, levelHeightPercent, false);
		levelName = PlayerPrefs.GetString(Strings.CurrentLevel, Application.loadedLevelName);
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.pauseMenuMusic;
		
		intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
		intelSystem.isPaused = true;
	}
	
	public function Render()
	{
		intelSystem.isPaused = true;
		GUI.depth = 0;
			// Drawing background textures:
		GUI.skin = pauseScreenSkin;
		GUI.color = transparentColor;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background, ScaleMode.StretchToFill);
		
		GUI.color = defaultColor;
		GUI.DrawTexture(hexTextRect, hexText, ScaleMode.StretchToFill);
		
		
		
		GUI.BeginGroup(groupRect);
		
		GUI.DrawTexture(pauseTextRect, pauseText, ScaleMode.StretchToFill);
		var oldAnchor : TextAnchor = GUI.skin.label.alignment;
		GUI.skin.label.alignment = TextAnchor.MiddleLeft;
		GUI.Label(levelRect, levelName);
		GUI.skin.label.alignment = oldAnchor;
		
		// Buttons are rendered:
		setButtonTexture(backButton, backButtonPressed);
		if(GUI.Button(backButtonRect, ""))
		{
			intelSystem.isPaused = false;
			currentResponse.type = EventTypes.MAIN;
			PlayButtonPress();
		}
		
		//	ANDROID BACK BUTTON
		if(Input.GetKeyUp(KeyCode.Escape))
		{
			currentResponse.type = EventTypes.MAIN;
			intelSystem.isPaused = false;
			PlayButtonPress();
		}
		
		setButtonTexture(restartButton, restartButtonPressed);
		if(GUI.Button(restartButtonRect, ""))
		{
			intelSystem.isPaused = false;
			currentResponse.type = EventTypes.RESTART;
		}
		setButtonTexture(dashboardButton, dashboardButtonPressed);
		if(GUI.Button(dashboardButtonRect, ""))
		{
			intelSystem.isPaused = false;
			currentResponse.type = EventTypes.LEVELSELECT;
			PlayButtonPress();
		}
		setButtonTexture(mainMenuButton, mainMenuButtonPressed);
		if(GUI.Button(mainMenuButtonRect, ""))
		{
			intelSystem.isPaused = false;
			currentResponse.type = EventTypes.STARTMENU;
			PlayButtonPress();
		}
		resetButtonTexture();
		GUI.EndGroup();

	}
}