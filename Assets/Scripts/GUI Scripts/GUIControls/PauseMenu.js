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
	private var backButtonRect : Rect;
	private var backButtonPercent:float = 0.11;
	private var backButtonX : float = 0.03;
	private var backButtonY : float = 0.05;
	
	// Restart Button
	public var restartButton : Texture;
	private var restartButtonRect : Rect;

	// Dashboard Button
	public var dashboardButton : Texture;
	private var dashboardButtonRect : Rect;
	
	// Main Menu Button
	public var mainMenuButton : Texture;
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


	//Buttons/Text Group - to help maintain a buffer on the far right side of the screen
	private var groupRect:Rect;
	
	
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
		
		
		
		
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.pauseMenuMusic;
	}
	
	public function Render()
	{
		GUI.depth = 0;
			// Drawing background textures:
		GUI.skin = pauseScreenSkin;
		GUI.color = transparentColor;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background, ScaleMode.StretchToFill);
		
		GUI.color = defaultColor;
		GUI.DrawTexture(hexTextRect, hexText, ScaleMode.StretchToFill);
		
		
		
		GUI.BeginGroup(groupRect);
		
		GUI.DrawTexture(pauseTextRect, pauseText, ScaleMode.StretchToFill);
		
		// Buttons are rendered:
		GUI.DrawTexture(backButtonRect, backButton, ScaleMode.StretchToFill);
		if(GUI.Button(backButtonRect, ""))
		{
			currentResponse.type = EventTypes.MAIN;
			PlayButtonPress();
		}
		GUI.DrawTexture(restartButtonRect, restartButton, ScaleMode.StretchToFill);
		if(GUI.Button(restartButtonRect, ""))
		{
			currentResponse.type = EventTypes.RESTART;
		}
		
		GUI.DrawTexture(dashboardButtonRect, dashboardButton, ScaleMode.StretchToFill);
		if(GUI.Button(dashboardButtonRect, ""))
		{
			currentResponse.type = EventTypes.LEVELSELECT;
			PlayButtonPress();
		}
		
		GUI.DrawTexture(mainMenuButtonRect, mainMenuButton, ScaleMode.StretchToFill);
		if(GUI.Button(mainMenuButtonRect, ""))
		{
			currentResponse.type = EventTypes.STARTMENU;
			PlayButtonPress();
		}
		
		GUI.EndGroup();

	}
}