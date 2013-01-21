/* ScreenChange.js
Original Script by Katharine Uvick

Temporary script for the demo, uses this concept:

http://docs.unity3d.com/Documentation/Manual/HOWTO-SplashScreen.html

*/

#pragma strict

public var firstSlide : Texture;
public var secondSlide : Texture;
public var startScreen : Texture;
public var logoTexture:Texture;
public var quitTexture:Texture;

private static var showSplash : boolean = false;

public var startMenuSkin:GUISkin;
public var hexButtonSkin:GUISkin;

// Screen width and height
private var screenWidth: float;
private var screenHeight: float;

// Bars to account for resolution differences
private var horizontalBarHeight:float;
private var verticalBarWidth:float;

private var background:Rect;
private var title:Rect;
private var quitButton:Rect;
private var resumeGameButton:Rect;
private var newGameButton:Rect;
private var levelSelectButton:Rect;
private var linkFacebookButton:Rect;

private var groupXPercent:float = 0.4;					// X position of the entire menu as a position of screen width
private var groupYPercent:float = 0.4;					// Y position of the entire menu as a position of screen width
private var quitButtonHeightPercent:float = 0.1;		// Height (size) of the quit button as a percentage of screen height
private var buttonHeightPercent:float = 0.16;			// Height (size) of each button as a percentage of screen height
private var buttonRatio:float = 4;						// Width to height ratio of the button texture (for accurate sclaing)
private var buttonOffsetPercent:float = 0.6;			// The "height" of the button used for positioning to account for whitespace in the textures
private var titleHeightPercent:float = 0.17;			// Height of the title texture as a percentage of screen height
private var titleRatio:float = 5.47;					// Width to height ratio of the title texture

private var buttonTextOffsetXPercent:float = -0.17;		// Offset X of the button text so it's aligned according to the mockup
private var buttonTextOffsetYPercent:float = 0.4;		// Offset Y of the button text so it's aligned according to the mockup

private var titleOffsetXPercent:float = 0.06;			// Offset X of the menu title so it's aligned according to the mockup
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

private var currentTexture : Texture = firstSlide;

// Outated
private var eventStartGameRect: Rect;
private var eventResumeRect : Rect;
private var eventLevelSelectRect : Rect;
private var eventExitRect : Rect;
private var eventScoreScreenRect : Rect;

function Start ()
{
	// Store window dimensions and calculate padding
	screenWidth = ScreenSettingsManager.instance.screenWidth;
	screenHeight = ScreenSettingsManager.instance.screenHeight;
	horizontalBarHeight = ScreenSettingsManager.instance.horizontalBarHeight;
	verticalBarWidth = ScreenSettingsManager.instance.verticalBarWidth;
	
	InitializeStartMenu();
	
	if (showSplash) 
	{
		currentTexture = firstSlide;
		yield WaitForSeconds(2);
		currentTexture = secondSlide;
		yield WaitForSeconds(2);
		showSplash = false;
	}
	
	currentTexture = startScreen; 
}

function OnGUI()
{
	if(!showSplash)
	{
		DrawStartMenu();
	}
}

static function SetShowSplash (sSplash : boolean){
	showSplash = sSplash;
}

function ChangeScreen(newScreen : String){
	showSplash = false; 
}

function InitializeStartMenu()
{
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
}

function DrawStartMenu()
{
	GUI.DrawTexture(background, startScreen, ScaleMode.StretchToFill);
	GUI.DrawTexture(title, logoTexture, ScaleMode.StretchToFill);
	
	GUI.skin = startMenuSkin;

	if (GUI.Button(resumeGameButton, "resume"))
	{
		PlayButtonPress(2);
		Application.LoadLevel("LoadingScreen"); // to be changed when saving and loading is implemented
	}
	
	if (GUI.Button(newGameButton, "new game"))
	{
		PlayButtonPress(2);
		Application.LoadLevel("LoadingScreen");
	}
	
	if (GUI.Button(levelSelectButton, "level select"))
	{
		PlayButtonPress(1);
		Application.LoadLevel("LevelSelectScreen");
	}

	if (GUI.Button(linkFacebookButton, "link to facebook"))
	{
		PlayButtonPress(1);
		Application.LoadLevel("ScoreScreen");		// to be removed later, used for testing purposes
	}
	
	GUI.skin = hexButtonSkin;
	if (GUI.Button(quitButton, quitTexture))
	{
		Application.Quit();
	}
}

//Plays the Audio for the Button Press
//sounderNumber is which button press sound to play (1 or 2)
function PlayButtonPress(soundNumber)
{
	GameObject.Find("AudioSource Object").GetComponent(AudioSourceSetup).playButtonClick(soundNumber);
}