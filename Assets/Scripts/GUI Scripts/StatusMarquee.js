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

public var marqueeSkin:GUISkin;			// GUISkin component, set in Inspector
private var marqueePosition:Rect;		// Position of the Status Marquee

private var fontHeightPercent = 0.03;	// Height of the font as a percentage of screen height
private var fontHeight;					// Height of the font in pixels

function Start()
{
	// Calclate the marquee position
	marqueePosition = new Rect(Screen.width/2, Screen.height * 0.05, 0, 0);
	fontHeight = fontHeightPercent * Screen.height;
	marqueeSkin.label.fontSize = fontHeight;
	Debug.Log(fontHeight);
	Debug.Log(marqueeSkin.label.fontSize);
}

function OnGUI()
{
	// Set the current GUI's skin to the scoreSkin variable
	GUI.skin = marqueeSkin;
	
	if (mode == GameState.EXPLORE && welcome == 0)
	{
		GUI.Label(marqueePosition, "Welcome to Prototype City!");
	}					
	else if(mode == GameState.LINK)
	{
		GUI.Label(marqueePosition, "<Link Mode>");
		welcome = 1;
	}
	else if(mode == GameState.INTEL)
	{
		GUI.Label(marqueePosition, "<Intelligence>");
		welcome = 1;
	}
	else if(mode == GameState.PAUSE)
	{
		GUI.Label(marqueePosition, "<Paused>");
		welcome = 1;
	}
	else 
		GUI.Label(marqueePosition, "<Explore Mode>");	
}

function Update(){
	mode = ModeController.getCurrentMode();
}