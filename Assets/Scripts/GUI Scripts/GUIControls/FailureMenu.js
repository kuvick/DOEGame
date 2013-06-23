#pragma strict

public class FailureMenu extends GUIControl
{	

	// BG Textures
	public var pauseScreenSkin : GUISkin;
	public var background : Texture;
	public var lineOverlay : Texture;
	
	// Fail Text
	public var failText : Texture;
	private var failTextRect : Rect;
	private var failTextX : float = 65;
	private var failTextY : float = 232;

	// Restart Button
	public var restartButton : Texture;
	private var restartButtonRect : Rect;
	private var restartButtonX : float = 1316;
	private var restartButtonY : float = 552;
	
	// Dashboard Button
	public var dashboardButton : Texture;
	private var dashboardButtonRect : Rect;
	private var dashboardButtonX : float = 1211;
	private var dashboardButtonY : float = 715;
	
	// Main Menu Button
	public var mainMenuButton : Texture;
	private var mainMenuButtonRect : Rect;
	private var mainMenuButtonX : float = 1208;
	private var mainMenuButtonY : float = 877;




	public function Initialize()
	{
		super.Initialize();
		
		var designWidth : float = 1920;
		var designHeight : float = 1080;
		
		
		//Calculating Rect.
			// FailText
		failTextRect = RectFactory.NewRect(failTextX / designWidth, 
											  failTextY / designHeight,
											  failText.width / designWidth,
											  failText.height / designHeight);
		
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
		
	}
	
	public function Render()
	{   

			// Drawing background textures:
		GUI.skin = pauseScreenSkin;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
		GUI.DrawTexture(new Rect(0,0,lineOverlay.width, lineOverlay.height), lineOverlay);
		GUI.DrawTexture(failTextRect, failText);
		
		
		
		// Buttons are rendered:
		
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


	}
	

}