/**********************************************************
GUIControl.js

Description: 

Author: Francis Yuan
**********************************************************/
#pragma strict

import System.Collections.Generic;
	
public class GUIControl extends MonoBehaviour
{
	// Screen width and height
	protected var screenWidth: float;
	protected var screenHeight: float;
	
	// Bars to account for resolution differences
	protected var horizontalBarHeight:float;
	protected var verticalBarWidth:float;
	
	// Padding as a percent of total screen height and padding in pixels
	protected var paddingPercent = .02;
	protected var padding: float;
	
	// Font sizes
	protected var resumeFontHeightPercent = 0.03;			// Height of the font of the resume button as a percentage of screen height
	protected var resumeFontHeight:float;					// Height of the font of the resume buttonin pixels
	
	// All the bounding boxes of the elements of this GUIControl (to check for collision)
	protected var rectList:List.<Rect>;
	
	function Start () 
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
		rectList = new List.<Rect>();
	}
	
	public function Render()
	{
	}
	
	public function RecieveEvent(e:EventTypes)
	{
	}
}