/**********************************************************
StatusMarquee.js

Description: Displays which mode the player is in. 
(Explore mode or Link mode)

Note: Attach the script to Main Camera.

Author: Ajinkya Waghulde

Edits by: Ian Winter, Francis Yuan
**********************************************************/
private var mode:int;
private var welcome : int = 0;

// Screen width and height
private var screenWidth: float;
private var screenHeight: float;

// Bars to account for resolution differences
private var horizontalBarHeight:float;
private var verticalBarWidth:float;

public var marqueeSkin:GUISkin;			// GUISkin component, set in Inspector
private var marqueePosYPercent = 0.07;
private var marqueePosXPercent = 0.5; 

private var marqueePosition:Rect;		// Position of the Status Marquee

private var fontHeightPercent = 0.03;	// Height of the font as a percentage of screen height
private var fontHeight;					// Height of the font in pixels

private var marqueeBGHeightPercent:float = 0.15; 	// Height of the marquee background as a percentage of screen height
private var marqueeBGWidthRatio:float = 5.1;		// Ratio between the width and the height of the marquee image (don't want stretching, only scaling)
private var marqueeBGHeight:float;
private var marqueeBGWidth:float;
private var marqueeBGRect:Rect;

public var marqueeTexture:Texture;

function Start()
{
	// Store window dimensions and calculate padding
	screenWidth = ScreenSettingsManager.instance.screenWidth;
	screenHeight = ScreenSettingsManager.instance.screenHeight;
	horizontalBarHeight = ScreenSettingsManager.instance.horizontalBarHeight;
	verticalBarWidth = ScreenSettingsManager.instance.verticalBarWidth;
	
	// Calclate the marquee position
	marqueePosition = new Rect(verticalBarWidth + screenWidth * marqueePosXPercent, horizontalBarHeight + screenHeight * marqueePosYPercent, 0, 0);
	
	fontHeight = fontHeightPercent * screenHeight;
	marqueeSkin.label.fontSize = fontHeight;
	
	marqueeBGHeight = marqueeBGHeightPercent * screenHeight;
	marqueeBGWidth = marqueeBGWidthRatio * marqueeBGHeight;
	marqueeBGRect = Rect(marqueePosition.x - marqueeBGWidth/2, marqueePosition.y - marqueeBGHeight/2, marqueeBGWidth, marqueeBGHeight);
}

function OnGUI()
{
	if (!GUIManager.GetInstance().IsPaused())
	{
		// Set the current GUI's skin to the scoreSkin variable
		GUI.skin = marqueeSkin;
		
		GUI.Box(marqueeBGRect, "");
		
		if (mode == GameState.EXPLORE && welcome == 0)
		{
			GUI.Label(marqueePosition, "Welcome to Prototype City!");
		}					
		else if(mode == GameState.LINK)
		{
			GUI.Label(marqueePosition, "Link Mode");
			welcome = 1;
		}
		else if(mode == GameState.INTEL)
		{
			GUI.Label(marqueePosition, "Intelligence");
			welcome = 1;
		}
		else if(mode == GameState.PAUSE)
		{
			GUI.Label(marqueePosition, "Paused");
			welcome = 1;
		}
		else 
			GUI.Label(marqueePosition, "Explore Mode");	
	}
}

function Update(){
	mode = ModeController.getCurrentMode();
}