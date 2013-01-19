/**********************************************************
PauseMenu.js

Description: Pause menu called by ToolBar.js

Author: by Francis Yuan
**********************************************************/
#pragma strict

// Import
import System.Collections.Generic;

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
private var resumeFontHeightPercent = 0.03;			// Height of the font of the resume button as a percentage of screen height
private var resumeFontHeight:float;					// Height of the font of the resume buttonin pixels

// Skins for GUI components
public var hexButtonSkin:GUISkin;
public var pauseMenuSkin:GUISkin;					

// Pause Menu Button Rectangles
private var gameMenuList:List.<Rect>;				// Stores all the Pause Menu elements for easy iteration
private var resumeGameButton:Rect;
private var levelSelectButton:Rect;
private var restartLevelButton:Rect;
private var startScreenButton:Rect;
private var saveExitButton:Rect;

// Pause Menu Scaling
private var hexButtonHeightPercent:float = 0.2;		// Width of the Resume button as a percent of height
private var scoreFontHeightPercent:float = 0.04;	// Height of the font as a percentage of screen height
private var menuFontHeightPercent:float = 0.03;		// Height of the font as a percentage of screen height

private var hexButtonPadding:float;					// Padding of the Resume button
private var hexButtonHeight:float;					// Width of a the Resume button in actual pixels

private var gameMenuButtonHeightPercent:float = 0.1;
private var gameMenuButtonWidthPercent:float = 0.2;
private var gameMenuButtonHeight:float;
private var gameMenuButtonWidth:float;

function Start()
{
	// Store window dimensions and calculate padding
	/*
	screenWidth = ScreenSettingsManager.screenWidth;
	screenHeight = ScreenSettingsManager.screenHeight;
	horizontalBarHeight = ScreenSettingsManager.horizontalBarHeight;
	verticalBarWidth = ScreenSettingsManager.verticalBarWidth;
	*/
	
	screenWidth = Screen.width;
	screenHeight = Screen.height;
	horizontalBarHeight = 0;
	verticalBarWidth = 0;
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


public function Render()
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
		Application.LoadLevel(GUIManager.currLevel);  
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

}