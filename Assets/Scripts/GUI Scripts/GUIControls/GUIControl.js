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
	
	// Most recently interacted element that generate a response
	protected var currentResponse:GUIEvent;
	
	// Audio object
	protected var audioSource:AudioSourceSetup;
	
	public function Start () 
	{
	}
	
	public function Initialize()
	{
		// Store window dimensions and calculate padding
		screenWidth = ScreenSettingsManager.instance.screenWidth;
		screenHeight = ScreenSettingsManager.instance.screenHeight;
		horizontalBarHeight = ScreenSettingsManager.instance.horizontalBarHeight;
		verticalBarWidth = ScreenSettingsManager.instance.verticalBarWidth;
		padding = screenHeight * paddingPercent;
		
		rectList = new List.<Rect>();
		currentResponse = new GUIEvent();
		
		if (GameObject.Find("AudioSource Object") != null)
		{
			audioSource = GameObject.Find("AudioSource Object").GetComponent(AudioSourceSetup);
		}
	}
	
	public function Render()
	{
	}
	
	public function RecieveEvent(e:GUIEvent)
	{
	}
	
	public function GiveResponse()
	{
		return currentResponse;
	}
	
	public function ClearResponse()
	{
		currentResponse.type = EventTypes.NULLEVENT;
	}
	
	public function InputOverControl(inputPos:Vector2):boolean
	{
		for (var i = 0; i < rectList.Count; i++)
		{
			if (rectList[i].Contains(inputPos))
			{
				return true;
			}
		}
		return false;
	}
	
	protected function PlayButtonPress(soundNumber)
	{
		if (audioSource != null)
		{
			audioSource.playButtonClick(soundNumber);
		}
	}
}