/**********************************************************
MainMenu.js

Description: 

Author: Francis Yuan
**********************************************************/

#pragma strict

public class IntelMenu extends GUIControl
{
	// Skins for GUI components
	public var hexButtonSkin:GUISkin;
	public var intelMenuSkin:GUISkin;			// GUISkin component for the event icon, set in Inspector
	
	// Event List
	private var eventList:EventLinkedList;

	// Intel Menu rectanges
	private var scrollArea:Rect; 				
	private var intelMenuScrollPos:Vector2;
	
	private var background:Rect; 					
	private var closeButton:Rect;				
	private var scrollContent:Rect; 				
	
	private var eventNodeIcon:Rect;
	private var eventNodeDescription:Rect;
	private var eventNodeTurns:Rect;
	private var eventNodeHitbox:Rect;
	
	// Intel Menu scaling
	private var closeButtonHeightPercent:float = 0.12;
	private var eventNodeHeightPercent:float	= 0.12;
	private var fontHeightPercent:float = 0.02;
	
	private var closeButtonHeight:float;
	private var eventNodeHeight:float;
	private var fontHeight:float;
	
	// Intel Menu textures
	public var left:Texture;
	public var right:Texture;
	public var border:Texture;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		closeButtonHeight = closeButtonHeightPercent * screenHeight;
		eventNodeHeight = eventNodeHeightPercent * screenHeight;
		
		fontHeight = fontHeightPercent * screenHeight;
		hexButtonSkin.button.fontSize = fontHeight;
		intelMenuSkin.label.fontSize = fontHeight;
		
		//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
		background = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		closeButton = Rect(background.x + background.width - closeButtonHeight - padding, background.y + padding, closeButtonHeight, closeButtonHeight);
		scrollArea = Rect(background.x + padding, closeButton.y + closeButton.height + padding, background.width - 2 * padding, background.height - closeButton.height - (2 * padding));
		scrollContent = Rect(0, 0, scrollArea.width - 2 * padding, 1000);
		
		eventNodeIcon = Rect(padding, 0, eventNodeHeight, eventNodeHeight);
		eventNodeDescription = Rect(eventNodeIcon.x + eventNodeHeight, 0, scrollContent.width - 2.5 * eventNodeHeight, eventNodeHeight);
		eventNodeTurns = Rect(eventNodeDescription.x + eventNodeDescription.width, 0, eventNodeHeight, eventNodeHeight);
	    eventNodeHitbox = Rect(eventNodeIcon.x, 0, eventNodeIcon.width + eventNodeDescription.width + eventNodeTurns.width, eventNodeHeight);
		
		eventList = new EventLinkedList();
		var bE1:BuildingEvent = new BuildingEvent();
		bE1.description = "Game started.";
		bE1.type = 0;
		bE1.time = 1;
		var bE2:BuildingEvent = new BuildingEvent();
		bE2.description = "The Coal Mine needs new equipment to continue to ship out coal.";
		bE2.type = 1;
		bE2.time = 22;
		var bE3:BuildingEvent = new BuildingEvent();
		bE3.description = "The local Waste Disposal Facility is willing to help fund our project!.";
		bE3.type = 0;
		bE3.time = 19;
		var bE4:BuildingEvent = new BuildingEvent();
		bE4.description = "A Manager is looking to make his next career move.";
		bE4.type = 0;
		bE4.time = 15;
		var bE5:BuildingEvent = new BuildingEvent();
		bE5.description = "A new Researcher is about to graduate from the University.";
		bE5.type = 0;
		bE5.time = 12;
		var bE6:BuildingEvent = new BuildingEvent();
		bE6.description = "The factory is going to shut down if they don't get cheaper fuel.";
		bE6.type = 1;
		bE6.time = 8;
		
		eventList.InsertNode(bE1);
		eventList.InsertNode(bE2);
		eventList.InsertNode(bE3);
		eventList.InsertNode(bE4);
		eventList.InsertNode(bE5);
		eventList.InsertNode(bE6);
		
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
		GUI.Box(background, "");
		
		GUI.skin = hexButtonSkin;
		// Closes the event list
		if (GUI.Button(closeButton, "Close"))
		{
			currentResponse.type = EventTypes.MAIN;
		}
		
		// Scroll bar
		intelMenuScrollPos = GUI.BeginScrollView
		(
			scrollArea,
			intelMenuScrollPos,
			scrollContent
		);
			
		//Array of events
		var currentHeight:int;
		var currNode:EventNode = eventList.head;
		var i : int = 0;
		
		while(currNode != null)
		{
			currentHeight = (i * eventNodeHeight * 0.78);
			
			eventNodeIcon.y = currentHeight;
			eventNodeTurns.y = currentHeight;
			eventNodeDescription.y = currentHeight;
			eventNodeHitbox.y = currentHeight;
			
			GUI.skin = intelMenuSkin;
			
			GUI.DrawTexture(eventNodeIcon, left);
			GUI.DrawTexture(eventNodeDescription, border);
			GUI.DrawTexture(eventNodeTurns, right);
			
			GUI.Label(eventNodeIcon, "Icon");
			GUI.Label(eventNodeDescription, currNode.data.description);
			GUI.Label(eventNodeTurns, currNode.data.time.ToString());
			
			if (GUI.Button(eventNodeHitbox, ""))
			{
				Debug.Log("\"" + currNode.data.description + "\"" + " clicked");
			}
			
			currNode = currNode.next;
			++i;
		}
		GUI.EndScrollView();
	}
}