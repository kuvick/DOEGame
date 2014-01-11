#pragma strict

public class FailureMenu extends GUIControl
{	

	// BG Textures
	public var pauseScreenSkin : GUISkin;
	public var background : Texture;
	
	// Fail Text
	public var failText : Texture;
	private var failTextRect : Rect;
	private var failTextX : float = 0.03;
	private var failTextY : float = 0.23;
	private var failPercent : float = 0.25;

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
	private var buttonInitialYPercent: float = 0.54;
	private var buttonXPercent: float = 0.58;
	
	
	// Hex Texture
	public var hexText : Texture;
	private var hexTextRect : Rect;
	private var hexTextX : float = 0.39;
	private var hexTextY : float = 0;
	private var hexPercent : float = 1;


	//Buttons/Text Group - to help maintain a buffer on the far right side of the screen
	private var groupRect:Rect;

	public function Initialize()
	{
		super.Initialize();

		groupRect = Rect(0,0,screenWidth - (buttonBufferPercent * screenWidth), screenHeight - (buttonBufferPercent * screenHeight));
		
		//Calculating Rect.
			// FailText
		failTextRect = createRect(failText, failTextX, failTextY, failPercent, true, groupRect);
		
			// Restart Button
		restartButtonRect = createRect(restartButton, buttonXPercent, buttonInitialYPercent, buttonPercent, true, groupRect);
											  
			// Dashboard Button
		dashboardButtonRect = createRect(dashboardButton, buttonXPercent, buttonInitialYPercent + buttonPercent + buttonBufferPercent, buttonPercent, true, groupRect);
											  
			// Main Menu Button
		mainMenuButtonRect = createRect(mainMenuButton, buttonXPercent, buttonInitialYPercent + (buttonPercent*2) + (buttonBufferPercent*2), buttonPercent, true, groupRect);
		
			// Hex Texture
		hexTextRect = createRect(hexText, hexTextX, hexTextY, hexPercent, false);
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.failureMenuMusic;
	}
	
	public function Render()
	{   
		GUI.depth = 0;
			// Drawing background textures:
		GUI.skin = pauseScreenSkin;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background, ScaleMode.StretchToFill);
		GUI.DrawTexture(hexTextRect, hexText, ScaleMode.StretchToFill);
		
		GUI.BeginGroup(groupRect);
		GUI.DrawTexture(failTextRect, failText, ScaleMode.StretchToFill);
		
		
		// Buttons are rendered:
		setButtonTexture(restartButton, restartButtonPressed);
		if(GUI.Button(restartButtonRect, ""))
		{
			currentResponse.type = EventTypes.RESTART;
		}
		
		setButtonTexture(dashboardButton, dashboardButtonPressed);
		if(GUI.Button(dashboardButtonRect, ""))
		{
			currentResponse.type = EventTypes.LEVELSELECT;
			PlayButtonPress();
		}
		
		setButtonTexture(mainMenuButton, mainMenuButtonPressed);
		if(GUI.Button(mainMenuButtonRect, ""))
		{
			currentResponse.type = EventTypes.STARTMENU;
			PlayButtonPress();
		}
		resetButtonTexture();
		GUI.EndGroup();


	}
	

}