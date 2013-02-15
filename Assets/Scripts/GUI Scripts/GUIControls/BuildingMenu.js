/**********************************************************
BuildingMenu.js

Description: 

Author: Francis Yuan
**********************************************************/

#pragma strict

public class BuildingMenu extends GUIControl
{
	// Skins for GUI components
	public var hexButtonSkin:GUISkin;
	public var buildingMenuSkin:GUISkin;
	
	// Building Menu rectangles
	private var background:Rect;
	private var scrollLeft:Rect;
	private var scrollRight:Rect;
	private var buildingClip:Rect;
	private var buildingGroup:Rect;
	private var buildingIconList:List.<Rect>;
	private var cancelButton:Rect;
	
	// For testing
	private var testBuildings:List.<String>;
	
	// Building Menu scaling
	private var scrollHeightPercent:float = 0.3;
	private var scrollRatio:float = 0.39;
	private var scrollYPercent:float = 0.4;
	private var buildingIconHeightPercent:float = 0.3;
	private var buildingIconPaddingPercent:float = 0.005;
	private var buildingGroupYPercent:float = 0.25;
	private var cancelButtonHeightPercent:float = 0.2;		
	private var cancelButtonFontHeightPercent:float = 0.03;	

	private var scrollHeight:float;
	private var scrollWidth:float;
	private var scrollY:float;
	private var buildingIconHeight:float;
	private var buildingIconPadding:float;
	private var buildingClipWidth:float;
	private var buildingGroupY:float;
	private var cancelButtonHeight:float = 0.2;		
	private var cancelButtonFontHeight:float = 0.03;	
	
	// Building Menu textures
	private var scrollLeftTexture_Current:Texture;
	private var scrollRightTexture_Current:Texture;
	
	public var scrollLeftTexture_Active:Texture;
	public var scrollRightTexture_Active:Texture;
	public var scrollLeftTexture_Inactive:Texture;
	public var scrollRightTexture_Inactive:Texture;
	
	public var buildingIconTexture:Texture;
	
	// Building Menu animation
	private var isScrolling:boolean = false;
	private var numPages:int = 0;
	private var currentPage:float = 0;
	private var targetPage:float = 0;
	private var scrollTimer:float = 0;
	private var scrollSpeed:float = 1;				// Time in seconds to complete 1 scroll.
	private var leftScrollVisible:boolean = false;
	private var rightScrollVisible:boolean = true;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		scrollHeight = scrollHeightPercent * screenHeight;
		scrollWidth = scrollHeight * scrollRatio;
		scrollY = scrollYPercent * screenHeight;
		buildingIconHeight = buildingIconHeightPercent * screenHeight;
		buildingIconPadding = buildingIconPaddingPercent * screenWidth;
		buildingClipWidth = screenWidth - 2 * (scrollWidth + 2 * padding);
		buildingGroupY = screenHeight * buildingGroupYPercent;
		
		cancelButtonHeight = cancelButtonHeightPercent * screenHeight;
		cancelButtonFontHeight = cancelButtonFontHeightPercent * screenHeight;
		
		hexButtonSkin.button.fontSize = cancelButtonFontHeight;
		
		background = new Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		scrollLeft = new Rect(verticalBarWidth + padding, horizontalBarHeight + scrollY, scrollWidth, scrollHeight);
		scrollRight = new Rect(verticalBarWidth + screenWidth - scrollWidth - padding, horizontalBarHeight + scrollY, scrollWidth, scrollHeight);
		buildingClip = new Rect(verticalBarWidth + (screenWidth - buildingClipWidth)/2, horizontalBarHeight, buildingClipWidth, screenHeight);
		cancelButton =	Rect(verticalBarWidth + padding, horizontalBarHeight + padding, cancelButtonHeight, cancelButtonHeight);	

		// For testig the layout of the building icons and scrolling animations
		testBuildings = new List.<String>();
		testBuildings.Add("1415");
		testBuildings.Add("4505");
		testBuildings.Add("9410");
		testBuildings.Add("1024");
		testBuildings.Add("5938");
		testBuildings.Add("3029");
		testBuildings.Add("8467");
		testBuildings.Add("6265");
		testBuildings.Add("9245");
		
		rectList.Add(background);
		
		LoadBuildingList();
	}
	
	public function Render()
	{
		GUI.skin = buildingMenuSkin;
		GUI.Box(background, "");
		
		// Calculate the mouse position
		var mousePos:Vector2;
		mousePos.x = Input.mousePosition.x;
		mousePos.y = Screen.height - Input.mousePosition.y;
	    
	    // Set scroll textures to default
		scrollLeftTexture_Current = scrollLeftTexture_Inactive;
		scrollRightTexture_Current = scrollRightTexture_Inactive;
		
	    // If the mouse or the finger is hovering/tapping one of the scroll buttons, change the button's texture
		if (scrollLeft.Contains(mousePos))
		{
			scrollLeftTexture_Current = scrollLeftTexture_Active;
		}
		
		if (scrollRight.Contains(mousePos))
		{
			scrollRightTexture_Current = scrollRightTexture_Active;
		}
		
		if (leftScrollVisible)
		{
			GUI.DrawTexture(scrollLeft, scrollLeftTexture_Current);
			if (GUI.Button(scrollLeft, "") && !isScrolling)
			{
				Scroll(-1);
			}
		}
		
		if (rightScrollVisible)
		{
			GUI.DrawTexture(scrollRight, scrollRightTexture_Current);
			if (GUI.Button(scrollRight,"") && !isScrolling)
			{
				Scroll(1);
			}
		}
		
		// Draws every building icon in the building icon list in two nested GUI groups
		// The first group represents the clip area 
		// The second group represents the entire list of building icons
		// Change the second group's rect's x position in order to scroll the building icons
		GUI.BeginGroup(buildingClip);
			GUI.BeginGroup(buildingGroup);
				for (var i:int = 0; i < buildingIconList.Count; i++)
				{
					GUI.DrawTexture(buildingIconList[i], buildingIconTexture);
					GUI.Button(buildingIconList[i], "");
				}
			GUI.EndGroup();
		GUI.EndGroup();
		
		
		GUI.skin = hexButtonSkin;
		
		if (GUI.Button(cancelButton, "Cancel"))
		{
			currentResponse.type = EventTypes.MAIN;
		}
	}
	
	public function Update()
	{
		if (targetPage != currentPage)
		{
			scrollTimer += Time.deltaTime;
			currentPage = Mathf.Lerp(currentPage, targetPage, scrollTimer/scrollSpeed);
			buildingGroup.x = screenWidth * -currentPage;
			
			if (targetPage == currentPage)
			{
				isScrolling = false;
				scrollTimer = 0;
			}
		}
	}
	
	/*
		Eventually, this should be the function that creates the building icons group
		out of a list of building data
	*/
	public function LoadBuildingList()
	{
		var sumWidth:int;
		var buildingIcon:Rect;
		var counter:int = 0;
		var currentPageX:float = 0;
		var currentUpperRowX:float = 0;
		var currentLowerRowX:float = 0;
		
		buildingIconList = new List.<Rect>();
		numPages = Mathf.CeilToInt(testBuildings.Count/6.0);
		if (numPages > 6)
		{
			rightScrollVisible = true;
		}	
		sumWidth = buildingIconHeight + buildingIconPadding;
		buildingGroup = new Rect(0, buildingGroupY, screenWidth * numPages, screenHeight);
		
		// Calculate the rect dimensions of every page of building icons
		// Each page consists of up to six icons split into two rows three
		for (var i:int = 0; i < numPages; i++)
		{	
			currentPageX = i * screenWidth;
			// Calculate the first row of building icons
			for (var j:int = 0; j < 3; j++)
			{
				counter++;
				if (counter > testBuildings.Count)
				{
					break;
				}
				currentUpperRowX = j * sumWidth;
				buildingIcon = new Rect(currentPageX + currentUpperRowX, 0, buildingIconHeight, buildingIconHeight);
				buildingIconList.Add(buildingIcon);
				
			}
			
			// Calculate the second row of building icons
			var lowerRowOffset = buildingClipWidth - (3 * buildingIconHeight) - (2 * buildingIconPadding);
			for (var k:int = 0; k < 3; k++)
			{
				counter++;
				if (counter > testBuildings.Count)
				{
					break;
				}
				currentLowerRowX = k * sumWidth + lowerRowOffset;
				buildingIcon = new Rect(currentPageX + currentLowerRowX, buildingIconHeight, buildingIconHeight, buildingIconHeight);
				buildingIconList.Add(buildingIcon);
			}
		}
	}
	
	/*
		Triggers a scrolling animation.
			1 scrolls to the right
			-1 scrolls to the left
	*/
	private function Scroll(direction:int):IEnumerator
	{
		isScrolling = true;
		targetPage = Mathf.Clamp(targetPage + direction, 0, numPages);
		
		if (targetPage == 0)
		{
			leftScrollVisible = false;
		}
		else if (targetPage == numPages - 1)
		{
			rightScrollVisible = false;
		}
		else
		{
			leftScrollVisible = true;
			rightScrollVisible = true;
		}
	}
}