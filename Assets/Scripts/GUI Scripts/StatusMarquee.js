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

private var marqueePosition:Rect;		// Position of the Status Marquee
public var marqueeSkin:GUISkin;			// GUISkin component, set in Inspector
private var fontHeightPercent = 0.03;	// Height of the font as a percentage of screen height
private var fontHeight;					// Height of the font in pixels

function Start()
{
	marqueePosition = new Rect(Screen.width/2, 40, 0, 0);
	fontHeight = fontHeightPercent * Screen.height;
}

function OnGUI()
{
	/*
	if(mode == "explore")
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Explore Mode>");	
	else if (mode == "link")
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Link Mode>");	
	*/
	
	// Set the font size of the label style of the scoreSkin variable
	marqueeSkin.label.fontSize = fontHeight;
	// Set the current GUI's skin to the scoreSkin variable
	GUI.skin = marqueeSkin;
	
	if (mode == GameState.EXPLORE && welcome ==0)
	{
		GUI.Label(marqueePosition, "Welcome to Prototype City!");
		//GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 20, Screen.width/2 + 50, 40), "<Explore Mode>");
	}					
	else if(mode == GameState.LINK)
	{
		GUI.Label(marqueePosition, "<Link Mode>");
		welcome = 1;
	}
	else 
		GUI.Label(marqueePosition, "<Explore Mode>");	
}

function Update(){
	mode = ModeController.getCurrentMode();
}