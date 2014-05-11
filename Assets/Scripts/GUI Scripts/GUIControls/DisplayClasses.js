#pragma strict
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
	private var icon :Texture = null;
	private var iconRect:Rect;
	private var iconShadowRect:Rect;
	
	public function ParseForHTML()
	{
		//text = Regex.Replace(text, /\<[^\>]*\>/g, "");
		//text = Regex.Replace(text, "<", "");
		text = Regex.Replace(text, "<([^>]*)>", "");
		
		//if((useStyle && style.richText) || (!useStyle && GUI.skin.label.richText))
			//text = "<b>" + text + "</b>";
		
	}
	
	public function ParseForHTML(txt:String):String
	{
		if(txt != null && txt != "")
			txt = Regex.Replace(txt, "<([^>]*)>", "");

		/*
		if((useStyle && style.richText) || (!useStyle && GUI.skin.label.richText))
			return "<b>" + txt + "</b>";
		else
			return txt;
		*/
		return txt;
	}
	
	//CONSTRUCTORS//
	// USE FOR TITLES
	public function ShadowedText(txt:String, guiStl:GUIStyle)
	{
		text = ParseForHTML(txt);
		textColor = new Color(197f / 255f, 211f / 255f, 233f / 255f);
		shadowColor = Color.black;
		shadowColor.a = 0.5f;
		
		style = guiStl;
		style.fontSize = Screen.width * 0.1;
		var textRext:Vector2 = style.CalcSize(GUIContent(txt));
		
		displayRect = new Rect(37f / 1920f * Screen.width, 63f / 1080f * Screen.height, textRext.x, textRext.y);
		
		useStyle = true;
		useSetDistance = true;
		staticDistance = Screen.height * 0.005;
		updateShadowRect();
	}
	
	// USE FOR TITLES w/ ICON
	public function ShadowedText(txt:String, guiStl:GUIStyle, i:Texture)
	{
		text = ParseForHTML(txt);
		textColor = new Color(197f / 255f, 211f / 255f, 233f / 255f);
		shadowColor = Color.black;
		shadowColor.a = 0.5f;
		icon = i;
		style = guiStl;
		style.fontSize = Screen.width * 0.1;
		var textRext:Vector2 = style.CalcSize(GUIContent(txt));
		
		displayRect = new Rect(37f / 1920f * Screen.width, 63f / 1080f * Screen.height, textRext.x, textRext.y);
		
		useStyle = true;
		useSetDistance = true;
		staticDistance = Screen.height * 0.005;
		
		iconRect = new Rect(displayRect.x + displayRect.width + Screen.width * 0.03, displayRect.y, icon.width * (displayRect.height/ icon.height), displayRect.height);
		
		
		updateShadowRect();
	}
	
	
	// DEFAULT, SET DISTANCE, WITH GUISTYLE
	public function ShadowedText(txt:String, disRect:Rect, guiStl:GUIStyle, transparentShadow:boolean)
	{
		text = ParseForHTML(txt);
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
		text = ParseForHTML(txt);
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
	
	// DEFAULT, SET DISTANCE, unique color but black shadow
	public function ShadowedText(txt:String, disRect:Rect, transparentShadow:boolean, cr:Color)
	{
		text = ParseForHTML(txt);
		textColor = cr;
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
		text = ParseForHTML(txt);
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
		text = ParseForHTML(txt);
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
		text = ParseForHTML(txt);
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
		text = ParseForHTML(txt);
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
		text = ParseForHTML(txt);
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
		text = ParseForHTML(txt);
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
		text = ParseForHTML(txt);
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
		{
			shadowRect = new Rect(displayRect.x + (displayRect.height * shadowPercentDistance), displayRect.y + (displayRect.height * shadowPercentDistance), displayRect.width, displayRect.height);
			
			if(icon != null)
				iconShadowRect = new Rect(iconRect.x + (iconRect.height * shadowPercentDistance), iconRect.y + (iconRect.height * shadowPercentDistance), iconRect.width, iconRect.height);
			
		}
		else
		{
			shadowRect = new Rect(displayRect.x + staticDistance, displayRect.y + staticDistance, displayRect.width, displayRect.height);
			
			if(icon != null)
				iconShadowRect = new Rect(iconRect.x + staticDistance, iconRect.y + staticDistance, iconRect.width, iconRect.height);
		}			
	}
	
	private var previousColor:Color;
	public function Display()
	{
		if(useStyle)
		{
			previousColor = style.normal.textColor;
			style.normal.textColor = shadowColor;
			GUI.Label(shadowRect, text, style);
			if(icon != null)
			{
				var prevColor1:Color = GUI.color;
				GUI.color = shadowColor;
				GUI.DrawTexture(iconShadowRect, icon, ScaleMode.StretchToFill);
				GUI.color = prevColor1;
			}
			style.normal.textColor = textColor;
			GUI.Label(displayRect, text, style);
			if(icon != null)
				GUI.DrawTexture(iconRect, icon, ScaleMode.StretchToFill);	
			style.normal.textColor = previousColor;
		}
		else
		{
			previousColor = GUI.color;
			GUI.color = shadowColor;
			GUI.Label(shadowRect, text);
			if(icon != null)
			{
				var prevColor2:Color = GUI.color;
				GUI.color = shadowColor;
				GUI.DrawTexture(iconShadowRect, icon, ScaleMode.StretchToFill);
				GUI.color = prevColor2;
			}
			GUI.color = textColor;
			GUI.Label(displayRect, text);
			if(icon != null)
				GUI.DrawTexture(iconRect, icon, ScaleMode.StretchToFill);
			GUI.color = previousColor;
		}
		
		
	}
	
	
	public function Display(txt:String, disRect:Rect)
	{
		text = ParseForHTML(txt);
		displayRect = disRect;
		updateShadowRect();
	
		if(useStyle)
		{
			previousColor = style.normal.textColor;
			style.normal.textColor = shadowColor;
			GUI.Label(shadowRect, text, style);
			if(icon != null)
			{
				var prevColor1:Color = GUI.color;
				GUI.color = shadowColor;
				GUI.DrawTexture(iconShadowRect, icon, ScaleMode.StretchToFill);
				GUI.color = prevColor1;
			}
			style.normal.textColor = textColor;
			GUI.Label(displayRect, text, style);
			if(icon != null)
				GUI.DrawTexture(iconRect, icon, ScaleMode.StretchToFill);	
			style.normal.textColor = previousColor;
		}
		else
		{
			previousColor = GUI.color;
			GUI.color = shadowColor;
			GUI.Label(shadowRect, text);
			if(icon != null)
			{
				var prevColor2:Color = GUI.color;
				GUI.color = shadowColor;
				GUI.DrawTexture(iconShadowRect, icon, ScaleMode.StretchToFill);
				GUI.color = prevColor2;
			}
			GUI.color = textColor;
			GUI.Label(displayRect, text);
			if(icon != null)
				GUI.DrawTexture(iconRect, icon, ScaleMode.StretchToFill);
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
	public var detectRect : Rect;
	private var hoverDetected:boolean = false;
	private var onTouchDevice:boolean = false;
	
	public function AnimatedButton(c:Color, img:Texture, r:Rect)
	{
		color = c;
		rect = r;
		image = img;
		buttonPressed = false;
		detectRect = r;
	}
	
	// for when an object is within a GUI Group
	public function AnimatedButton(c:Color, img:Texture, r:Rect, dr: Rect)
	{
		color = c;
		rect = r;
		image = img;
		buttonPressed = false;
		detectRect = dr;
	}
	
	// for when an object is within a GUI Group
	public function AnimatedButton(c:Color, img:Texture, r:Rect, dr: Vector2)
	{
		color = c;
		rect = r;
		image = img;
		buttonPressed = false;
		detectRect = new Rect(r.x + dr.x, r.y + dr.y, r.width, r.height);
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
	
	public function Render(style:GUIStyle):boolean
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
			if(GUI.Button(rect, "", style))
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
			hoverDetected = true;
		}	
		//setButtonTexture(codexIconText, codexIconTextPressed);
		GUI.DrawTexture(rect, image);
		if(GUI.Button(rect, ""))
		{
			buttonPressed = true;
		}
			
		if(hoverDetected)
		{
			GUI.color = Color.white;
			rect.x -= rect.width * 0.03;
			rect.y -= rect.height * 0.03;
			hoverDetected = false;
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
	
	public function Render(blink:boolean):boolean
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
			if(blink)
			{
				Blink();
				GUI.color = currentColor;
			}
			
			GUI.DrawTexture(rect, image);
			GUI.color = Color.white;
		}
		
		return buttonPressed;
	}
	
	private var currentColor:Color = Color.white;
	private var fadeTimer : float = 0.5;
	private var fadeScaler : float = 1.0;
	public function Blink()
	{
		fadeTimer += Time.smoothDeltaTime * fadeScaler;
		if (fadeTimer >= 1 || fadeTimer <= 0)
			fadeScaler *= -1;
		Mathf.Clamp(fadeTimer, 0, 1);
		
		currentColor = Color.Lerp(color, Color.white, fadeTimer);
	}
	
	private function DetectHover():boolean
	{
		if(GUI.enabled)
		{
			if(Input.touchCount > 0)
			{
				onTouchDevice = true;
				return detectRect.Contains(Vector2(Input.touches[0].position.x, Screen.height - Input.touches[0].position.y));
			}
			else if(!onTouchDevice)
			{
				return detectRect.Contains(Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y));
			}
		}
		return false;
	}
	
} // AnimatedButton



public class AnimatedImage
{
	public var startImage:Texture;
	public var endImage:Texture;
	private var currentImage:Texture;
	public var currentRect:Rect;
	public var originalRect:Rect;
	private var recIncrement:float;
	private var animate:boolean;
	private var color:Color;
	
	private var totalSizeIncrease:float = 15f;
	private var incrementRate:float = 1f;
	
	private var speedColor:float = 0.03;
	private var firstLoop:boolean = true;
	private var centerPos:Vector2;
	private var switchScale:boolean;
	
	public function AdjustAnimationIncrease(speed:float, totalSizeIncrease:float, byPercentage:boolean)
	{
		if(!byPercentage)
		{
			totalSizeIncrease = totalSizeIncrease;
			incrementRate = speed;
		}
		else
		{
			totalSizeIncrease = totalSizeIncrease * originalRect.height;
			incrementRate = speed * originalRect.height;
		}
	
	}
	
	public function AnimatedImage()
	{
		color = Color.white;
		firstLoop = true;
		switchScale = false;
		currentRect = Rect(0,0,0,0);
	}
	
	public function AnimatedImage(rect:Rect, imageS:Texture, imageE:Texture)
	{
		color = Color.white;
		endImage = imageE;
		currentImage = imageS;
		currentRect = rect;
		originalRect = rect;
		firstLoop = true;
		switchScale = false;
	}
	
	public function Render(baseRect:Rect, imageS:Texture, imageE:Texture, shouldAnimate:boolean):boolean // returns true if animated
	{
		//originalRect = new Rect(r.x, r.y, r.width, r.height);
		currentImage = imageS;
		endImage = imageE;
		
		if(currentRect.Equals(Rect(0,0,0,0)))
			currentRect = new Rect(baseRect.x, baseRect.y, baseRect.width, baseRect.height);
		
		//objIconRecobjIconSize = originalRect
		//objIconRect = currentRect
		/*
		var objIconRect: Rect = Rect(	padding + (originalRect.x + padding) * (i*2), 
								0,
								originalRect.x,
								originalRect.y);
								*/
		//DISPLAYING OBJECTIVE ICON						
		//if(resolvedObj && eventID == i && !firstLoop)
		
		if(firstLoop && shouldAnimate)
			animate = true;
		
		
		if(animate && !firstLoop)
		{
			
			currentRect = Rect(	centerPos.x - ((baseRect.width + recIncrement) / 2), 
								centerPos.y - ((baseRect.height + recIncrement) / 2),
								baseRect.width + recIncrement,
								baseRect.height + recIncrement);
			

			if(!switchScale)
			{
				recIncrement+= 1;
				if(recIncrement > totalSizeIncrease)
					switchScale = true;
			}
			else
			{
				recIncrement-= 1;
				if(recIncrement <= 0)
				{
					color.a = 1.0f;
					animate = false;
					firstLoop = true;
					//intelSystem.events[i].setIcon(setNewObjTexture);
					currentImage = endImage;
				}
			}
	
		}
		//GUI.DrawTexture(currentRect, intelSystem.events[i].getIcon()); 
		GUI.DrawTexture(currentRect, currentImage);
				
		
		if(animate)
		{
			if(firstLoop)
			{
				color.a = 0f;
				recIncrement = 0;
				switchScale = false;
				currentRect = new Rect(baseRect.x, baseRect.y, baseRect.width, baseRect.height);
				centerPos = Vector2(currentRect.x + currentRect.width / 2, currentRect.y + currentRect.height / 2);
				firstLoop = false;
			}
			
			color.a += speedColor;
			
			GUI.color = color;
			
			GUI.DrawTexture(currentRect, endImage);
			
			GUI.color = Color.white;
		}
	
		return animate;
	}
	
	
	public function Blink()
	{
		var prevColor:Color = GUI.color;
		GUI.color = Color.Lerp(Color(1,1,1,0.5), Color.white, LinkUI.fadeTimer);
		GUI.DrawTexture(originalRect, currentImage);
		GUI.color = prevColor;
	}

} //AnimatedImage



public class AnimatedText
{
	public var otherText:Rect;

	public var currentText:String;
	public var endText:String;
	public var currentRect:Rect;
	public var originalRect:Rect;
	private var recIncrement:float;
	private var animate:boolean;
	private var color:Color; // growing
	private var fadeColor:Color; //fading
	
	
	public var isShadowed:boolean;
	public var startShadowedText:ShadowedText;
	public var endShadowedText:ShadowedText;
	
	
	private var totalSizeIncrease:float = 15f;
	private var incrementRate:float = 1f;
	
	private var speedColor:float = 0.03;
	private var firstLoop:boolean = true;
	
	public function AdjustAnimationIncrease(speed:float, totalSizeIncrease:float, byPercentage:boolean)
	{
		if(!byPercentage)
		{
			totalSizeIncrease = totalSizeIncrease;
			incrementRate = speed;
		}
		else
		{
			totalSizeIncrease = totalSizeIncrease * originalRect.height;
			incrementRate = speed * originalRect.height;
		}
	}
	
	public function AnimatedText()
	{
		fadeColor = Color.white;
		color = Color.white;
		firstLoop = true;
		currentRect = Rect(0,0,0,0);
	}
	
	public function Render(baseRect:Rect, textS:String, textE:String, shouldAnimate:boolean):boolean // returns true if animated
	{
		currentText = textS;
		endText = textE;
		
		if(currentRect.Equals(Rect(0,0,0,0)))
		{
			currentRect = new Rect(baseRect.x, baseRect.y, baseRect.width, baseRect.height);
			otherText = new Rect(baseRect.x + baseRect.width, baseRect.y, baseRect.width, baseRect.height);
		}
			
		if(firstLoop && shouldAnimate)
			animate = true;
		
		
		if(animate && !firstLoop)
		{
			
			currentRect = Rect(	currentRect.x - recIncrement, 
								currentRect.y,
								currentRect.width,
								currentRect.height);
								
			otherText = Rect(	otherText.x - recIncrement, 
								otherText.y,
								otherText.width,
								otherText.height);


			recIncrement++;
			
			if(otherText.x <= baseRect.x)
			{
				color.a = 1.0f;
				animate = false;
				firstLoop = true;
				currentText = endText;
			}

	
		}
		GUI.color = fadeColor;
		GUI.Label(currentRect, currentText);
		GUI.color = Color.white;
		
		if(animate)
		{
			if(firstLoop)
			{
				color.a = 0f;
				fadeColor = Color.white;
				recIncrement = 0;
				currentRect = new Rect(baseRect.x, baseRect.y, baseRect.width, baseRect.height);
				firstLoop = false;
			}
			
			color.a += speedColor;
			fadeColor.a = 1f - color.a;
			
			
			GUI.color = color;
			
			GUI.Label(otherText, endText);
			
			GUI.color = Color.white;
		}
	
		return animate;
	}

	

} //AnimatedImage


public class RectAnimations
{
	private var recIncrement:float = 0;
	private var animate:boolean;	
	private var incrementRate:float = 1f;
	private var firstLoop:boolean = true;
	
	public var currentRect:Rect;
	public var nextRect:Rect;
	
	public function RectAnimations()
	{
		recIncrement = 0;
		animate = false;
		incrementRate = 1f;
		firstLoop = true;
	}
	

	public function Render(cRect:Rect, nRect:Rect):boolean
	{
		currentRect = cRect;
		nextRect = nRect;

		animate = true;
		
		
		if(animate && !firstLoop)
		{
			
			currentRect = Rect(	currentRect.x - recIncrement, 
								currentRect.y,
								currentRect.width,
								currentRect.height);
								
			nextRect = Rect(	nextRect.x - recIncrement, 
								nextRect.y,
								nextRect.width,
								nextRect.height);


			recIncrement++;
			
			if(nextRect.x <= 0)
			{
				animate = false;
				firstLoop = true;
			}

	
		}
		
		if(firstLoop)
		{
			recIncrement = 0;
			firstLoop = false;
		}
	
		return animate;
	}
}






