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
	private var pauseTextX : float = .04;//0.54;
	private var pauseTextY : float = 0.23;
	
	// Back Button
	public var backButton : Texture;
	//public var backButtonPressed : Texture;
	private var backButtonRect : Rect;
	private var backButtonPercent:float = 0.12;
	private var backButtonX : float = .8;//0.03;
	private var backButtonY : float = 0.02;
	
	// Restart Button
	public var restartButton : Texture;
	//public var restartButtonPressed : Texture;
	private var restartButtonRect : Rect;

	// Dashboard Button
	public var dashboardButton : Texture;
	//public var dashboardButtonPressed : Texture;
	private var dashboardButtonRect : Rect;
	
	// Main Menu Button
	public var mainMenuButton : Texture;
	//public var mainMenuButtonPressed : Texture;
	private var mainMenuButtonRect : Rect;
	
	//Button Vars
	private var buttonPercent: float = 0.11;
	private var buttonBufferPercent: float = 0.04;
	private var buttonInitialYPercent: float = 0.45;
	private var buttonXPercent: float = .09;//0.59;
	
	// Hex Texture
	public var hexText : Texture;
	private var hexTextRect : Rect;
	private var hexTextX : float = 0;//0.39;
	private var hexTextY : float = 0;
	private var hexPercent : float = 1;

	// current level text
	private var levelName : String;
	private var levelRect : Rect;
	private var levelSize : Vector2 = Vector2(5, 1);
	private var levelXPercent : float = .04f;
	private var levelYPercent : float = .26f;
	private var levelHeightPercent : float = .11f;
	
	
		// Buttons
	private var restartAB:AnimatedButton;
	private var mainMenuAB:AnimatedButton;
	private var dashboardAB:AnimatedButton;
	private var backAB:AnimatedButton;
	
	private var titleST:ShadowedText;

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
		
		restartAB = new AnimatedButton(Color.blue, restartButton, restartButtonRect, Vector2(groupRect.x, groupRect.y));
		mainMenuAB  = new AnimatedButton(Color.blue, dashboardButton, dashboardButtonRect, Vector2(groupRect.x, groupRect.y));
		dashboardAB  = new AnimatedButton(Color.blue, mainMenuButton, mainMenuButtonRect, Vector2(groupRect.x, groupRect.y));
		backAB  = new AnimatedButton(Color.blue, backButton, backButtonRect, Vector2(groupRect.x, groupRect.y));

		titleST = new ShadowedText("Paused", pauseScreenSkin.customStyles[0]);
	}
	
	public function Render()
	{
		intelSystem.isPaused = true;
		if (!isActive)
			return;
		GUI.depth = 0;
			// Drawing background textures:
		GUI.skin = pauseScreenSkin;
		GUI.color = transparentColor;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background, ScaleMode.StretchToFill);
		
		GUI.color = defaultColor;
		GUI.DrawTexture(hexTextRect, hexText, ScaleMode.StretchToFill);
		
		var prevFontSize = GUI.skin.label.fontSize;
		GUI.skin.label.fontSize = Utils.ScaleFontSize(levelName, GUI.skin.label, levelRect.width, levelRect.height * .8);
		GUI.Label(levelRect, levelName);
		GUI.skin.label.fontSize = prevFontSize;
		
		GUI.BeginGroup(groupRect);
		
		//GUI.DrawTexture(pauseTextRect, pauseText, ScaleMode.StretchToFill);
		
		titleST.Display();
		
		var oldAnchor : TextAnchor = GUI.skin.label.alignment;
		GUI.skin.label.alignment = TextAnchor.MiddleLeft;
		
		GUI.skin.label.alignment = oldAnchor;
		
		// Buttons are rendered:
		//setButtonTexture(backButton, backButtonPressed);
		if(backAB.Render())
		{
			intelSystem.isPaused = false;
			isActive = false;
			currentResponse.type = EventTypes.MAIN;
			PlayButtonPress();
		}
		
		//	ANDROID BACK BUTTON
		if(Input.GetKeyUp(KeyCode.Escape))
		{
			currentResponse.type = EventTypes.MAIN;
			isActive = false;
			intelSystem.isPaused = false;
			PlayButtonPress();
		}
		
		//setButtonTexture(restartButton, restartButtonPressed);
		if(restartAB.Render())
		{
			intelSystem.isPaused = false;
			currentResponse.type = EventTypes.RESTART;
		}
		//setButtonTexture(dashboardButton, dashboardButtonPressed);
		if(mainMenuAB.Render())
		{
			intelSystem.isPaused = false;
			currentResponse.type = EventTypes.LEVELSELECT;
			PlayButtonPress();
		}
		//setButtonTexture(mainMenuButton, mainMenuButtonPressed);
		if(dashboardAB.Render())
		{
			intelSystem.isPaused = false;
			currentResponse.type = EventTypes.STARTMENU;
			PlayButtonPress();
		}
		//resetButtonTexture();
		GUI.EndGroup();

	}
}