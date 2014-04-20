﻿#pragma strict
//import System.Collections.Generic;

public class ShadowedText
{
	public var text:String;
	public var textColor:Color;
	public var shadowColor:Color;
	//public var shadowTransparency:float;
	public var shadowPercentDistance:float;	//percent is of the height of the rect
	public var displayRect:Rect;
	private var shadowRect:Rect;
	public var style:GUIStyle;
	private var useStyle:boolean;
	private var staticDistance:float;
	private var useSetDistance:boolean;
	
	
	//CONSTRUCTORS//
	
	// DEFAULT, SET DISTANCE, WITH GUISTYLE
	public function ShadowedText(txt:String, disRect:Rect, guiStl:GUIStyle, transparentShadow:boolean)
	{
		text = txt;
		textColor = Color.white;
		shadowColor = Color.black;
		if(transparentShadow)
			shadowColor.a = 0.5f;
		else
			shadowColor.a = 1.0f;
		displayRect = disRect;
		style = guiStl;
		useStyle = true;
		useSetDistance = true;
		staticDistance = Screen.height * 0.005;
		updateShadowRect();
	}
	
	// DEFAULT, SET DISTANCE
	public function ShadowedText(txt:String, disRect:Rect, transparentShadow:boolean)
	{
		text = txt;
		textColor = Color.white;
		shadowColor = Color.black;
		if(transparentShadow)
			shadowColor.a = 0.5f;
		else
			shadowColor.a = 1.0f;
		displayRect = disRect;
		useStyle = false;
		useSetDistance = true;
		staticDistance = Screen.height * 0.005;
		updateShadowRect();
	}
	
	//Used to fill out all the attributes of the item, includes a GUIStyle
	public function ShadowedText(txt:String, txtColor:Color, shdColor:Color, shdTransparency:float, shdPerDist:float, disRect:Rect, guiStl:GUIStyle)
	{
		text = txt;
		textColor = txtColor;
		shadowColor = shdColor;
		shadowColor.a = shdTransparency;
		shadowPercentDistance = shdPerDist;
		displayRect = disRect;
		style = guiStl;
		useStyle = true;
		useSetDistance = false;
		updateShadowRect();
	}
	
	//Used to fill out all the attributes of the item, no GUIStyle
	public function ShadowedText(txt:String, txtColor:Color, shdColor:Color, shdTransparency:float, shdPerDist:float, disRect:Rect)
	{
		text = txt;
		textColor = txtColor;
		shadowColor = shdColor;
		shadowColor.a = shdTransparency;
		shadowPercentDistance = shdPerDist;
		displayRect = disRect;
		useStyle = false;
		useSetDistance = false;
		updateShadowRect();
	}
	
	//Used to fill out all the attributes of the item, includes a GUIStyle, set distance
	public function ShadowedText(txt:String, txtColor:Color, shdColor:Color, shdTransparency:float, shdPerDist:float, disRect:Rect, guiStl:GUIStyle, setDistance:float)
	{
		text = txt;
		textColor = txtColor;
		shadowColor = shdColor;
		shadowColor.a = shdTransparency;
		displayRect = disRect;
		style = guiStl;
		useStyle = true;
		useSetDistance = true;
		staticDistance = setDistance;
		updateShadowRect();
	}
	
	//Used to fill out all the attributes of the item, includes a GUIStyle, use default distance
	public function ShadowedText(txt:String, txtColor:Color, shdColor:Color, shdTransparency:float, disRect:Rect, guiStl:GUIStyle)
	{
		text = txt;
		textColor = txtColor;
		shadowColor = shdColor;
		shadowColor.a = shdTransparency;
		displayRect = disRect;
		style = guiStl;
		useStyle = true;
		useSetDistance = true;
		staticDistance = Screen.height * 0.005;
		updateShadowRect();
	}
	
	//Used to fill out all the attributes of the item, no GUIStyle, set distance
	public function ShadowedText(txt:String, txtColor:Color, shdColor:Color, shdTransparency:float, shdPerDist:float, disRect:Rect, setDistance:float)
	{
		text = txt;
		textColor = txtColor;
		shadowColor = shdColor;
		shadowColor.a = shdTransparency;
		displayRect = disRect;
		useStyle = false;
		useSetDistance = true;
		staticDistance = setDistance;
		updateShadowRect();
	}
	
	// If you want to use the default settings, no GUIStyle, but want to use a static distance for the text
	public function ShadowedText(txt:String, disRect:Rect, setDistance:float)
	{
		text = txt;
		textColor = Color.white;
		shadowColor = Color.black;
		shadowColor.a = 0.5f;
		shadowPercentDistance = 0;
		displayRect = disRect;
		useStyle = false;
		useSetDistance = true;
		staticDistance = setDistance;
		updateShadowRect();
	}
	
	// If you want to use the default settings, no GUIStyle, but want to use a static distance for the text
	public function ShadowedText(txt:String, disRect:Rect, guiStl:GUIStyle, setDistance:float)
	{
		text = txt;
		textColor = Color.white;
		shadowColor = Color.black;
		shadowColor.a = 0.5f;
		shadowPercentDistance = 0;
		displayRect = disRect;
		useStyle = true;
		style = guiStl;
		useSetDistance = true;
		staticDistance = setDistance;
		updateShadowRect();
	}
	//*********************************************************************************************************************
	
	//Calculates position of shadow's rect; if you change the display rect, use this function
	public function updateShadowRect()
	{
		if(!staticDistance)
			shadowRect = new Rect(displayRect.x + (displayRect.height * shadowPercentDistance), displayRect.y + (displayRect.height * shadowPercentDistance), displayRect.width, displayRect.height);
		else
			shadowRect = new Rect(displayRect.x + staticDistance, displayRect.y + staticDistance, displayRect.width, displayRect.height);
			
	}
	
	private var previousColor:Color;
	public function Display()
	{
		if(useStyle)
		{
			previousColor = style.normal.textColor;
			style.normal.textColor = shadowColor;
			GUI.Label(shadowRect, text, style);
			style.normal.textColor = textColor;
			GUI.Label(displayRect, text, style);		
			style.normal.textColor = previousColor;
		}
		else
		{
			previousColor = GUI.color;
			GUI.color = shadowColor;
			GUI.Label(shadowRect, text);
			GUI.color = textColor;
			GUI.Label(displayRect, text);
			GUI.color = previousColor;
		}
	}
	
	
	public function Display(txt:String, disRect:Rect)
	{
		text = txt;
		displayRect = disRect;
		updateShadowRect();
	
		if(useStyle)
		{
			previousColor = style.normal.textColor;
			style.normal.textColor = shadowColor;
			GUI.Label(shadowRect, text, style);
			style.normal.textColor = textColor;
			GUI.Label(displayRect, text, style);		
			style.normal.textColor = previousColor;
		}
		else
		{
			previousColor = GUI.color;
			GUI.color = shadowColor;
			GUI.Label(shadowRect, text);
			GUI.color = textColor;
			GUI.Label(displayRect, text);
			GUI.color = previousColor;
		}
	}	
	
}//ShadowedText


public class AnimatedButton
{
	public var color : Color;
	public var image : Texture;
	public var rect : Rect;
	private var buttonPressed: boolean = false;
	
	public function AnimatedButton(c:Color, img:Texture, r:Rect)
	{
		color = c;
		rect = r;
		image = img;
		buttonPressed = false;
	}
	
	public function Render():boolean
	{
		buttonPressed = false;
		if (DetectHover())
		{
			GUI.color = color;
			rect.x += rect.width * 0.03;
			rect.y += rect.height * 0.03;
			//add boolean perhaps that changes to true that signifies that the settings need to be reset, to avoid
			// having the second if statement sometimes not triggered.
			
			//setButtonTexture(codexIconText, codexIconTextPressed);
			GUI.DrawTexture(rect, image);
			if(GUI.Button(rect, ""))
			{
				buttonPressed = true;
			}
			
			GUI.color = Color.white;
			rect.x -= rect.width * 0.03;
			rect.y -= rect.height * 0.03;
		}
		else
		{
			GUI.DrawTexture(rect, image);
		}
		
		return buttonPressed;
	}
	
	public function Render(text:Texture):boolean
	{
		image = text;
		buttonPressed = false;
		if (DetectHover())
		{
			GUI.color = color;
			rect.x += rect.width * 0.03;
			rect.y += rect.height * 0.03;
			//add boolean perhaps that changes to true that signifies that the settings need to be reset, to avoid
			// having the second if statement sometimes not triggered.
			
			//setButtonTexture(codexIconText, codexIconTextPressed);
			GUI.DrawTexture(rect, image);
			if(GUI.Button(rect, ""))
			{
				buttonPressed = true;
			}
			
			GUI.color = Color.white;
			rect.x -= rect.width * 0.03;
			rect.y -= rect.height * 0.03;
		}
		else
		{
			GUI.DrawTexture(rect, image);
		}
		
		return buttonPressed;
	}
	
	public function Render(r:Rect,text:Texture):boolean
	{
		image = text;
		rect = r;
		buttonPressed = false;
		if (DetectHover())
		{
			GUI.color = color;
			rect.x += rect.width * 0.03;
			rect.y += rect.height * 0.03;
			//add boolean perhaps that changes to true that signifies that the settings need to be reset, to avoid
			// having the second if statement sometimes not triggered.
			
			//setButtonTexture(codexIconText, codexIconTextPressed);
			GUI.DrawTexture(rect, image);
			if(GUI.Button(rect, ""))
			{
				buttonPressed = true;
			}
			
			GUI.color = Color.white;
			rect.x -= rect.width * 0.03;
			rect.y -= rect.height * 0.03;
		}
		else
		{
			GUI.DrawTexture(rect, image);
		}
		
		return buttonPressed;
	}
	
	private function DetectHover():boolean
	{
		var inputLocation : Vector2;
		
		if(Input.touchCount > 0)
			return rect.Contains(Vector2(Input.touches[0].position.x, Screen.height - Input.touches[0].position.y));
		else
			return rect.Contains(Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y));
	}
	
} // AnimatedButton











