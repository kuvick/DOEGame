/**********************************************************
PauseMenu.js

Description: Pause menu called by ToolBar.js

Author: by Francis Yuan
**********************************************************/
#pragma strict

// Import
import System.Collections.Generic;

// Static boolean to control visibility
private var isVisible:boolean;

// Screen width and height
private var screenWidth: float;
private var screenHeight: float;

// Bars to account for resolution differences
private var horizontalBarHeight:float;
private var verticalBarWidth:float;

// Padding as a percent of total screen height and padding in pixels
private var paddingPercent = .02;
private var padding: float;

// Font sizes
private var resumeFontHeightPercent = 0.03;		// Height of the font of the resume button as a percentage of screen height
private var resumeFontHeight:float;				// Height of the font of the resume buttonin pixels

// Skins for GUI components
public var hexButtonSkin:GUISkin;
public var pauseMenuSkin:GUISkin;					

// Pause Menu Variables
private var gameMenuList:List.<Rect>;				// Stores all the Pause Menu elements for easy iteration
private var resumeGameButton:Rect;
private var levelSelectButton:Rect;
private var restartLevelButton:Rect;
private var startScreenButton:Rect;
private var saveExitButton:Rect;	

private var gameMenuButtonHeightPercent:float = 0.1;
private var gameMenuButtonWidthPercent:float = 0.2;
private var gameMenuButtonHeight:float;
private var gameMenuButtonWidth:float;

// Pause Menu Textures
private var undoTexture:Texture;					// Texture to display for the undo button
private var waitTexture:Texture;					// Texture to display for the wait button
private var intelTexture:Texture;					// Texture to display for the intel button

public var undoTextureNeutral:Texture;				// Texture for the undo button when unclicked
public var undoTextureClicked:Texture;				// Texture for the undo button when clicked
public var waitTextureNeutral:Texture;				// Texture for the wait button when unclicked
public var waitTextureClicked:Texture;				// Texture for the wait button when clicked
public var intelTextureNeutral:Texture;				// Texture for the intel button when unclicked
public var intelTextureClicked:Texture;				// Texture for the intel button when clicked

// Pause Menu Scaling
private var hexButtonHeightPercent = 0.2;	// Width of a Main Menu button as a percent of height
private var scoreFontHeightPercent = 0.04;	// Height of the font as a percentage of screen height
private var menuFontHeightPercent = 0.03;	// Height of the font as a percentage of screen height
private var hexButtonPadding : float;

private var hexButtonHeight:float;			// Width of a Main Menu button in actual pixels
private var scoreFontHeight:float;			// Height of the font in pixels
private var menuFontHeight:float;			// Height of the font in pixels

function Start()
{
	// Store window dimensions and calculate padding
	screenWidth = ScreenSettingsManager.screenWidth;
	screenHeight = ScreenSettingsManager.screenHeight;
	horizontalBarHeight = ScreenSettingsManager.horizontalBarHeight;
	verticalBarWidth = ScreenSettingsManager.verticalBarWidth;
	padding = screenWidth * paddingPercent;
	
	InitializePauseMenu();
}

function InitializePauseMenu()
{
	gameMenuButtonHeight = screenHeight * gameMenuButtonHeightPercent;
	gameMenuButtonWidth = screenWidth * gameMenuButtonWidthPercent;

	resumeFontHeight = resumeFontHeightPercent * screenHeight;
	hexButtonSkin.button.fontSize = resumeFontHeight;
	
	resumeGameButton =	Rect(verticalBarWidth + padding, horizontalBarHeight + padding, hexButtonHeight, hexButtonHeight);	
	levelSelectButton = Rect(verticalBarWidth + (screenWidth - gameMenuButtonWidth)/2, horizontalBarHeight + screenHeight * 0.4, gameMenuButtonWidth, gameMenuButtonHeight); 
	restartLevelButton = Rect(levelSelectButton.x, levelSelectButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
	startScreenButton = Rect(levelSelectButton.x, restartLevelButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);
	saveExitButton = Rect(levelSelectButton.x, startScreenButton.y + gameMenuButtonHeight, gameMenuButtonWidth, gameMenuButtonHeight);

	gameMenuList = new List.<Rect>();
	gameMenuList.Add(resumeGameButton);
	gameMenuList.Add(levelSelectButton);
	gameMenuList.Add(restartLevelButton);
	gameMenuList.Add(startScreenButton);
	gameMenuList.Add(saveExitButton);
}


function DrawPauseMenu()
{
	GUI.skin = hexButtonSkin;
	if (GUI.Button(resumeGameButton, "Resume"))
	{
		ModeController.setCurrentMode(GameState.EXPLORE);
	}
	
	GUI.skin = pauseMenuSkin;
	if (GUI.Button(levelSelectButton, "Level Select"))
	{
		Application.LoadLevel("LevelSelectScreen");
	}
	if (GUI.Button(restartLevelButton, "Restart"))
	{
		Application.LoadLevel(ToolBar.currLevel);  
	}
	if (GUI.Button(startScreenButton, "Start Screen"))
	{
		// TODO: Saves progress and returns to the starting screen
		Application.LoadLevel ("StartScreen");
	}
	if (GUI.Button(saveExitButton, "Save & Exit"))
	{
		// TODO: Closes game app and saves progress 
		Application.Quit();	
	}
}

function Update()
{
	
}

function OnGUI()
{
	if (isVisible)
	{
		DrawPauseMenu();
	}
}