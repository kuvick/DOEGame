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
	public var lineOverlay : Texture;
	private var defaultColor : Color;
	private var transparentColor : Color;
	
	// Paused Text
	public var pauseText : Texture;
	private var pauseTextRect : Rect;
	private var pauseTextX : float = 1030;
	private var pauseTextY : float = 232;
	
	// Back Button
	public var backButton : Texture;
	private var backButtonRect : Rect;
	private var backButtonX : float = 59;
	private var backButtonY : float = 31;
	
	// Restart Button
	public var restartButton : Texture;
	private var restartButtonRect : Rect;
	private var restartButtonX : float = 1320;
	private var restartButtonY : float = 475;
	
	// Dashboard Button
	public var dashboardButton : Texture;
	private var dashboardButtonRect : Rect;
	private var dashboardButtonX : float = 1218;
	private var dashboardButtonY : float = 638;
	
	// Main Menu Button
	public var mainMenuButton : Texture;
	private var mainMenuButtonRect : Rect;
	private var mainMenuButtonX : float = 1215;
	private var mainMenuButtonY : float = 801;
	
	// Hex BG Shape
	public var hexShape : Texture;
	private var hexShapeRect : Rect;
	private var hexShapeX : float = 746;
	private var hexShapeY : float = 0;
	
	
	public function Start()
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		
		var designWidth : float = 1920;
		var designHeight : float = 1080;
		
		defaultColor = new Color(1.0f, 1.0f, 1.0f, 1.0f);
		transparentColor = new Color(1.0f, 1.0f, 1.0f, 0.9f);
		

		
		//Calculating Rect.
			// PausedText
		pauseTextRect = RectFactory.NewRect(pauseTextX / designWidth, 
											  pauseTextY / designHeight,
											  pauseText.width / designWidth,
											  pauseText.height / designHeight);

			// Hex
		hexShapeRect = RectFactory.NewRect(hexShapeX / designWidth, 
											  hexShapeY / designHeight,
											  hexShape.width / designWidth,
											  hexShape.height / designHeight);
											  
											  
			// Back Button
		backButtonRect = RectFactory.NewRect(backButtonX / designWidth, 
											  backButtonY / designHeight,
											  backButton.width / designWidth,
											  backButton.height / designHeight);
											  
			// Dashboard Button
		restartButtonRect = RectFactory.NewRect(restartButtonX / designWidth, 
											  restartButtonY / designHeight,
											  restartButton.width / designWidth,
											  restartButton.height / designHeight);
											  
			// Restart Button
		dashboardButtonRect = RectFactory.NewRect(dashboardButtonX / designWidth, 
											  dashboardButtonY / designHeight,
											  dashboardButton.width / designWidth,
											  dashboardButton.height / designHeight);
											  
			// Main Menu Button
		mainMenuButtonRect = RectFactory.NewRect(mainMenuButtonX / designWidth, 
											  mainMenuButtonY / designHeight,
											  mainMenuButton.width / designWidth,
											  mainMenuButton.height / designHeight);
		
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.pauseMenuMusic;
	}
	
	public function Render()
	{
	
			// Drawing background textures:
		GUI.skin = pauseScreenSkin;
		GUI.color = transparentColor;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
		GUI.color = defaultColor;
		GUI.DrawTexture(new Rect(0,0,lineOverlay.width, lineOverlay.height), lineOverlay);
		GUI.DrawTexture(hexShapeRect, hexShape);
		GUI.DrawTexture(pauseTextRect, pauseText);
		
		
		
		// Buttons are rendered:
		
		if(GUI.Button(backButtonRect, backButton))
		{
			currentResponse.type = EventTypes.MAIN;
			PlayButtonPress();
		}
		
		if(GUI.Button(restartButtonRect, restartButton))
		{
			currentResponse.type = EventTypes.RESTART;
		}
		
		if(GUI.Button(dashboardButtonRect, dashboardButton))
		{
			currentResponse.type = EventTypes.LEVELSELECT;
			PlayButtonPress();
		}
		
		if(GUI.Button(mainMenuButtonRect, mainMenuButton))
		{
			currentResponse.type = EventTypes.STARTMENU;
			PlayButtonPress();
		}
		
	
	/*
		
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
		
		*/
	}
}