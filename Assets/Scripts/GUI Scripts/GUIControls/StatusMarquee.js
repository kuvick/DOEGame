/**********************************************************
StatusMarquee.js

Description: Displays which mode the player is in. 
(Explore mode or Link mode)

Author: Ajinkya Waghulde, Francis Yuan
**********************************************************/
#pragma strict

public class StatusMarquee extends GUIControl
{
	// Skin for the Marquee
	public var marqueeSkin:GUISkin;	
	
	// Marquee Rectangles
	private var posYPercent = 0.07;
	private var posXPercent = 0.5; 
	private var position:Vector2;				// Position of the Status Marquee
	private var backgroundRect:Rect;
	
	// Marquee Scaling
	private var fontHeightPercent = 0.03;		// Height of the marquee font as a percentage of screen height
	private var backgroundHeightPercent:float = 0.15; 	// Height of the marquee background as a percentage of screen height
	private var backgroundWidthRatio:float = 5.1;		// Ratio between the width and the height of the marquee image (don't want stretching, only scaling)
	
	private var fontHeight:float;				// Height of the font in pixels
	private var backgroundHeight:float;
	private var backgroundWidth:float;
	
	// Marquee Text
	private var text:String = "Welcome to Prototype City!";	// Default text

	// Mode variables
	private var mode:int = 0;
	private var welcome:boolean = true;
	
	public function Start()
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		// Calclate values for the marquee 
		fontHeight = fontHeightPercent * screenHeight;
		marqueeSkin.label.fontSize = fontHeight;
		
		position = new Vector2(verticalBarWidth + screenWidth * posXPercent, horizontalBarHeight + screenHeight * posYPercent);

		backgroundHeight = backgroundHeightPercent * screenHeight;
		backgroundWidth = backgroundWidthRatio * backgroundHeight;
		backgroundRect = Rect(position.x - backgroundWidth/2, position.y - backgroundHeight/2, backgroundWidth, backgroundHeight);
	}
	
	public function Render()
	{
		// Set the current GUI's skin to the scoreSkin variable
		GUI.skin = marqueeSkin;
		
		GUI.Box(backgroundRect, "");
		
		GUI.Label(backgroundRect, "Welcome to Prototype City!");
	}
	
	public function Update()
	{
	}
}