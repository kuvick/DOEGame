/**********************************************************
MainMenu.js

Description: 

Author: Francis Yuan
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
private var resumeFontHeight:float;		

// Skins for GUI components
public var hexButtonSkin:GUISkin;
public var intelLeftSkin:GUISkin;			// GUISkin component for the event icon, set in Inspector
public var intelBorderSkin:GUISkin;			// GUISkin component for the event border, set in Inspector
public var intelRightSkin:GUISkin;			// GUISkin component for the event turns, set in Inspector

// Intel Menu Rectangles
private var eventList:EventLinkedList;

private var eventListScrollRect:Rect; 		// For the positions of the scroll bars
private var eventListScrollPos:Vector2;

private var eventListBGRect:Rect; 			// Background for the event list
private var eventListCloseRect:Rect;		// Close the menu
private var eventListContentRect:Rect; 		// For the content area

private var eventListIconRect:Rect;
private var eventListDescriptionRect:Rect;
private var eventListTurnsRect:Rect;
private var eventListNodeRect:Rect;

// Intel Menu Scaling
private var eventListSidePaddingPercent:float = 0.02;
private var eventListTopPaddingPercent:float = 0.04;
private var eventListCloseWidthPercent:float = 0.12;
private var eventListNodeWidthPercent:float	= 0.12;
private var eventListFontHeightPercent:float = 0.03;

private var eventListSidePadding:float;
private var eventListTopPadding:float;
private var eventListCloseWidth:float;
private var eventListNodeWidth:float;
private var eventListFontHeight:float;


function Start () {

}

function Update () {

}