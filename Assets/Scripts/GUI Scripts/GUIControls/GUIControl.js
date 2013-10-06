/**********************************************************
GUIControl.js

Description: 
	
	GUIControl is the base class for all collections of GUI elements such as menus or splash screens.
	Every menu/screen should inherit from GUIControl in order to be integrated into GUIManager.

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
	
	public var isInitialized : boolean = false;
	
	protected var backgroundMusic : SoundType = null; 
	
	/*
		Starts the GUIControl's update cycle.
		Should be overridden in child classes.
	*/
	public function Start () 
	{
	}
	
	/*
		Initializes all values of the GUIControl. The reason this is not in Start()
		is so that other classes can "reset" this GUIControl by calling its Initialize()
		function again.
	*/
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
		
		isInitialized = true;
	}
	
	/*
		Draws the GUIControl.
		Should be overridden in child classes.
	*/
	public function Render()
	{
	}
	
	/*
		Recieves an input event from another class, typically GUIManager.
		
		Since the GUIManager is making use of the built in GUI interaction, there's
		not much point to this function. However, if the game ever decides to switch to using a 
		class like an InputManager for handling all mouse events, this function should
		allow passing mouse/touch events from InputManager to GUIManager to every active GUIControl,
		
		Should be overridden in child classes.
	*/
	public function RecieveEvent(e:GUIEvent)
	{
		currentResponse.type = e.type;
	}
	
	// Currently used to pass on events from non-GUI members, e.g., the Building Site
	public function RecieveEvent(e:EventTypes)
	{
		currentResponse.type = e;
	}
	
	
	/*
		Returns the GUIControl's current response.
	*/
	public function GiveResponse()
	{
		return currentResponse;
	}
	
	/*
		Clears the response of GUIControl so that when it is re-added
		to the list of active controls, it does not generate any responses.
	*/
	public function ClearResponse()
	{
		currentResponse.type = EventTypes.NULLEVENT;
	}
	
	/*
		Determines whether or not the input position is hovering over one of the Rects
		of this GUIControl
	*/
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
	
	/*
    Called when the menu is opened for the user to see
	  */
	public function OnOpen(){
		if (backgroundMusic != null){
			SoundManager.Instance().playMusic(backgroundMusic);
		}
	} 
	
	/*
		Plays a sound using the SoundManager
	*/	
	protected function PlayButtonPress(){
		SoundManager.Instance().playButtonClick();
	}
	
	// Creates a Rect where the image's height is the percentage of the screen height
	// while maintaining the proper ratio; if the last value is set to true,
	// if the rect will go outside the screen it will adjust the rect to make sure it is
	// within the screen limits
	public function createRect(texture:Texture,xPercent:float,yPercent:float, heightPercentage:float, adjustSizeIfOutsideBoundaries:boolean):Rect
	{

		var height:float = heightPercentage * screenHeight;
		var textX:float = texture.width;
		var textY:float = texture.height;
		var textRatio:float = textX / textY;
		var width:float = height * textRatio;
		var x:float = screenWidth * xPercent;
		var y:float = screenHeight * yPercent;
		
		if(!adjustSizeIfOutsideBoundaries)
			return Rect(x, y, width, height);
		else
			return adjustRect(Rect(x, y, width, height));
		
	}
	
	// Creates a Rect where the image's height is the percentage of the screen height
	// while maintaining the proper ratio; if the last value is set to true,
	// if the rect will go outside the specified rect it will adjust the rect to make sure it is
	// within the other rect limits
	//
	// this is to be used to create rects that within other rects
	public function createRect(texture:Texture,xPercent:float,yPercent:float, heightPercentage:float, adjustSizeIfOutsideBoundaries:boolean, compareToRect:Rect):Rect
	{

		var height:float = heightPercentage * compareToRect.height;
		var textX:float = texture.width;
		var textY:float = texture.height;
		var textRatio:float = textX / textY;
		var width:float = height * textRatio;
		var x:float = compareToRect.width * xPercent;
		var y:float = compareToRect.height * yPercent;
		
		if(!adjustSizeIfOutsideBoundaries)
			return Rect(x, y, width, height);
		else
			return adjustRect(Rect(x, y, width, height), compareToRect);
		
	}
	
	
	
	// Used to make sure the Rect won't go beyond the window's limits
	// Can returns true if an image is within the screen
	// Returns false if not
	public function testWindowLimit(rect:Rect):boolean
	{
		if(rect.width + rect.x > screenWidth)
		{
			//Debug.Log("Rect is larger than screenWidth");
			return false;
		}
		else if(rect.height + rect.y > screenHeight)
		{
			//Debug.Log("Rect is larger than screenHeight");
			return false;
		}
		else
			return true;
	}
	
	//Can use this function for testing the size within a rect that isn't the screen
	public function testWindowLimit(rect:Rect,compareToRect:Rect):boolean
	{
		if(rect.width + rect.x > compareToRect.width)
		{
			//Debug.Log("Rect is larger than screenWidth");
			return false;
		}
		else if(rect.height + rect.y > compareToRect.height)
		{
			//Debug.Log("Rect is larger than screenHeight");
			return false;
		}
		else
			return true;
	}
	
	// Adjusts the given Rect while maintaining ratio and x/y coordnates until
	// the Rect is within the screen limits
	public function adjustRect(rect:Rect):Rect
	{
		var percentage:float = 0.99;
		var newRect:Rect = Rect(rect.x, rect.y, rect.width, rect.height);
		
		for(var i:int=0;i < 100; i++)
		{
			newRect.width = rect.width * percentage;
			newRect.height = rect.height * percentage;
			if(testWindowLimit(newRect))
				return newRect;
			
			percentage -= 0.01;
		}
		
		return newRect;
		
	}
	
	// Adjusts the given Rect while maintaining ratio and x/y coordnates until
	// the Rect is within the specified limits (can be used for making
	// sure a rect is within a rect that isn't the screen)
	public function adjustRect(rect:Rect, compareToRect:Rect):Rect
	{
		var percentage:float = 0.99;
		var newRect:Rect = Rect(rect.x, rect.y, rect.width, rect.height);
		
		for(var i:int=0;i < 100; i++)
		{
			newRect.width = rect.width * percentage;
			newRect.height = rect.height * percentage;
			if(testWindowLimit(newRect, compareToRect))
				return newRect;
			
			percentage -= 0.01;
		}
		
		return newRect;
		
	}
	
	
	// To be used in "OnGUI" or "Render"
	// This function assumes black and white
	// for the colors
	// The rect is the location of the first set of text
	public function displayTextWithShadow(text:String, location:Rect)
	{
		
	}
	
	// To be used in "OnGUI" or "Render"
	// Override for new colors
	// The rect is the location of the first set of text
	public function displayTextWithShadow(text:String, location:Rect, color1:Color, color2:Color)
	{
		
	}
}