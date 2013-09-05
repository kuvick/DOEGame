/**********************************************************
IntelMenu.js

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
	
	// Intel Menu textures
	public var left:Texture;
	public var right:Texture;
	public var border:Texture;
	
	// Intel Menu Icon textures
	public var defaultIcon:Texture;
	
	private var intelSystem : IntelSystem;
	private var turn : int = 0;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function LoadLevelReferences()
	{
		intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		closeButtonHeight = closeButtonHeightPercent * screenHeight;
		eventNodeHeight = eventNodeHeightPercent * screenHeight * 4;
		
		fontHeight = fontHeightPercent * screenHeight;
		hexButtonSkin.button.fontSize = fontHeight;
		intelMenuSkin.label.fontSize = fontHeight;
		
		//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
		background = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		closeButton = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, closeButtonHeight, closeButtonHeight);	
	
		scrollArea = Rect(background.x + padding, closeButton.y + closeButton.height + padding, background.width - 2 * padding, background.height - closeButton.height - (2 * padding));
		scrollContent = Rect(0, 0, scrollArea.width - 2 * padding, 1000);
		
		eventNodeIcon = Rect(padding, 0, eventNodeHeight/2, eventNodeHeight/2);
		eventNodeDescription = Rect(eventNodeIcon.x + eventNodeHeight, 0, scrollContent.width - 2.5 * eventNodeHeight, eventNodeHeight);
		eventNodeTitle = Rect(eventNodeDescription.x + eventNodeIcon.width * 2, 0, scrollContent.width - 2.5 * eventNodeHeight, eventNodeHeight);
		eventNodeTurns = Rect(eventNodeDescription.x + eventNodeDescription.width - eventNodeHeight * 1.4, 0, eventNodeHeight, eventNodeHeight);
	    eventNodeHitbox = Rect(eventNodeIcon.x, 0, eventNodeIcon.width + eventNodeDescription.width + eventNodeTurns.width, eventNodeHeight);
		
		eventNodeIcon.x = eventNodeDescription.x + eventNodeIcon.width/1.6;			
		
		/*Build Event List*/
		eventList = new EventLinkedList();
		if(intelSystem != null)					
		{
			var tempList : List.<BuildingEvent> = intelSystem.getEventList();
			
			/*Query active BuildingEvents from IntelSystem*/
			for(var i : int = 0; i < tempList.Count; i++)//var event: BuildingEvent in tempList)		
			{
				eventList.InsertNode(tempList[i]);//event);			
			}						
		}
		// Add the background's rect to the rectList for checking input collision
		rectList.Add(background);
	}
	
	public function UpdateEventList()
	{
		if(intelSystem != null)					
		{
			var tempList : List.<BuildingEvent> = intelSystem.getEventList();
			eventList.Clear();
			/*Query active BuildingEvents from IntelSystem*/
			for(var i : int = 0; i < tempList.Count; i++)//var event: BuildingEvent in tempList)		
			{
				eventList.InsertNode(tempList[i]);//event);			
			}						
		}	
	}
	
	/*
		Draws all the buttons in the Intel Menu.
		
		Buttons:
			Event - Each event is a button
			Close - Closes the Intel Menu
	*/
	public function Render()
	{
		if(turn != intelSystem.currentTurn)
		{
			UpdateEventList();
			turn = intelSystem.currentTurn;
		}
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
			currentHeight = (i * eventNodeHeight * .78); //Magic Number was: 0.78
				
			eventNodeIcon.y = currentHeight + eventNodeIcon.height /2;
			eventNodeTurns.y = currentHeight;
			eventNodeDescription.y = currentHeight;
			eventNodeTitle.y = currentHeight - fontHeight;
			eventNodeHitbox.y = currentHeight;						
			
			GUI.skin = intelMenuSkin;
								
			GUI.DrawTexture(eventNodeDescription, border);			
			
			/*
				Render Node Type
			*/
			if(currNode.data.icon == null)
			{
				GUI.DrawTexture(eventNodeIcon, defaultIcon);							
			}
			else{
				GUI.DrawTexture(eventNodeIcon, currNode.data.icon);						
			}
			
			//drawTitle(currNode.data.title, currNode.data.type);

			
			eventNodeDescription.y += fontHeight/2;
			GUI.Label(eventNodeDescription, currNode.data.description);
			
			drawTurns(currNode.data.time);
			
			if (GUI.Button(eventNodeHitbox, ""))
			{
				Debug.Log("\"" + currNode.data.description + "\"" + " clicked");
			}
			
			currNode = currNode.next;
			++i;
		}
		GUI.EndScrollView();
	}
	
	//Draws the Title of an Event
	private function drawTitle(newTitle:String, newType: int)
	{
		/*Skin Modification for Title display*/
				intelMenuSkin.label.alignment = TextAnchor.MiddleLeft;
				intelMenuSkin.label.fontStyle = FontStyle.Bold;
				
				if(newType == 0)
				{
					GUI.Label(eventNodeTitle, newTitle + " :: Primary");	//Display Title as Label
				}
				else
				{
					GUI.Label(eventNodeTitle, newTitle + " :: Secondary");	//Display Title as Label
				}								
				
				intelMenuSkin.label.alignment = TextAnchor.MiddleCenter;
				intelMenuSkin.label.fontStyle = FontStyle.Normal;
			/*End of Skin Modification*/
	}
	
	//Draws the Turns remaining of each event
	private function drawTurns(time:int)
	{
		/*Skin Modification for Turns Display*/
			intelMenuSkin.label.alignment = TextAnchor.MiddleRight;
			intelMenuSkin.label.fontStyle = FontStyle.Bold;
			
			GUI.Label(eventNodeTurns, time.ToString());
			
			intelMenuSkin.label.alignment = TextAnchor.MiddleCenter;
			intelMenuSkin.label.fontStyle = FontStyle.Normal;
		/*End of Skin Modification*/
	}
}