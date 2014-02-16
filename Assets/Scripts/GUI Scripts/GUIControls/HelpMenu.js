/**********************************************************
IntelMenu.js

Description: 

Author: Francis Yuan
**********************************************************/

#pragma strict

public class HelpMenu extends GUIControl
{
	// Skins for GUI components
	public var hexButtonSkin:GUISkin;
	public var intelMenuSkin:GUISkin;			// GUISkin component for the event icon, set in Inspector

	// Intel Menu rectangles
	private var scrollArea:Rect; 				
	private var intelMenuScrollPos:Vector2;
	
	private var background:Rect; 					
	private var closeButton:Rect;				
	private var scrollContent:Rect; 				
	
	private var eventNodeIcon:Rect;
	private var eventNodeDescription:Rect;
	private var eventNodeTitle:Rect;
	private var eventNodeTurns:Rect;
	private var eventNodeHitbox:Rect;
	
	// Intel Menu scaling
	private var closeButtonHeightPercent:float = 0.2;
	private var eventNodeHeightPercent:float = 0.03;
	private var fontHeightPercent:float = 0.02;
	
	private var closeButtonHeight:float;
	private var eventNodeHeight:float;
	private var fontHeight:float;
	
	private var optionHeightPercent : float;
	private var descHeightPercent : float;
	private var optionSelected : boolean = false;
	private var optionRects : Rect[];
	private var descRect : Rect;
	
	// Intel Menu textures
	public var left:Texture;
	public var right:Texture;
	public var backgroundTex:Texture;
	
	// Intel Menu Icon textures
	public var defaultIcon:Texture;
	
	private var intelSystem : IntelSystem;
	private var turn : int = 0;
	
	public var helpOptions : HelpOption[];
	private var currOption : int = 0;	
	
	private var showMain : boolean = true;
	
	private class HelpOption
	{
		public var name : Texture;
		public var description : Texture;
	}
	
	public function Start () 
	{
		super.Start();
	}
	
	public function LoadLevelReferences()
	{
		
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		closeButtonHeight = closeButtonHeightPercent * screenHeight;
		eventNodeHeight = eventNodeHeightPercent * screenHeight * 4;
		
		/*fontHeight = fontHeightPercent * screenHeight;
		hexButtonSkin.button.fontSize = fontHeight;
		intelMenuSkin.label.fontSize = fontHeight;*/
		
		//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
		background = createRect(backgroundTex, .125f, .1f, .8f, true);
		descRect = createRect(helpOptions[0].description, .225f, .2f, .6f, true);
		closeButton = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, closeButtonHeight, closeButtonHeight);	
	
		scrollArea = createRect(helpOptions[0].description, .2f, .2f, .6f, true);//Rect(background.x + padding, closeButton.y + closeButton.height + padding, background.width - 2 * padding, background.height - closeButton.height - (2 * padding));
		scrollContent = Rect(0, 0, scrollArea.width - 2 * padding, 1000);
		
		optionRects = new Rect[helpOptions.Length];
		var startY : float = .2f;
		for (var i : int = 0; i < helpOptions.Length; i++)
		{
			optionRects[i] = createRect(helpOptions[0].name, .225f, startY, .1f, true);
			startY += .15f;
		}
		
		eventNodeIcon = Rect(padding, 0, eventNodeHeight/2, eventNodeHeight/2);
		eventNodeDescription = Rect(eventNodeIcon.x + eventNodeHeight, 0, scrollContent.width - 2.5 * eventNodeHeight, eventNodeHeight);
		eventNodeTitle = Rect(eventNodeDescription.x + eventNodeIcon.width * 2, 0, scrollContent.width - 2.5 * eventNodeHeight, eventNodeHeight);
		eventNodeTurns = Rect(eventNodeDescription.x + eventNodeDescription.width - eventNodeHeight * 1.4, 0, eventNodeHeight, eventNodeHeight);
	    eventNodeHitbox = Rect(eventNodeIcon.x, 0, eventNodeIcon.width + eventNodeDescription.width + eventNodeTurns.width, eventNodeHeight);
		
		eventNodeIcon.x = eventNodeDescription.x + eventNodeIcon.width/1.6;			
		
		/*Build Event List*/

		// Add the background's rect to the rectList for checking input collision
		rectList.Add(background);
	}
	
	/*
		Draws all the buttons in the Intel Menu.
		
		Buttons:
			Event - Each event is a button
			Close - Closes the Intel Menu
	*/
	public function Render()
	{
		GUI.DrawTexture(background, backgroundTex);
		
		GUI.skin = hexButtonSkin;
		// Closes the event list
		if (GUI.Button(closeButton, "Close"))
		{
			currentResponse.type = EventTypes.MAIN;
		}		
		
		// Scroll bar
		/*intelMenuScrollPos = GUI.BeginScrollView
		(
			scrollArea,
			intelMenuScrollPos,
			scrollContent
		);*/
			if (showMain)
				RenderMenu();
			else
				RenderOption(currOption);
		//Array of events
		var currentHeight:int;

		var i : int = 0;
		
			currentHeight = (i * eventNodeHeight * .78); //Magic Number was: 0.78
				
			eventNodeIcon.y = currentHeight + eventNodeIcon.height /2;
			eventNodeTurns.y = currentHeight;
			eventNodeDescription.y = currentHeight;
			eventNodeTitle.y = currentHeight - fontHeight;
			eventNodeHitbox.y = currentHeight;						
			
			GUI.skin = intelMenuSkin;
								
			//GUI.DrawTexture(eventNodeDescription, border);			
			
			eventNodeDescription.y += fontHeight/2;
			
			
			
			++i;
		//GUI.EndScrollView();
	}
	
	// Renders the specified help option
	private function RenderOption(toDisplay : int)
	{
		if (GUI.Button(descRect, helpOptions[toDisplay].description))
			showMain = true;
	}
	
	// Renders help menu options
	private function RenderMenu()
	{
		for (var i : int = 0; i < optionRects.Length; i++)
		{
			if (GUI.Button(optionRects[i], helpOptions[i].name))
			{
				showMain = false;
				currOption = i;
			}
		}
	}
}