/**********************************************************
IntelMenu.js

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
	private var buildingIconPaddingPercent:float = 0.01;
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
	public var scrollLeftTexture_Active:Texture;
	public var scrollLeftTexture_Inactive:Texture;
	public var scrollRightTexture_Active:Texture;
	public var scrollRightTexture_Inactive:Texture;
	public var buildingIconTexture:Texture;
	
	// Building Menu animation
	private var isScrolling:boolean;
	private var buildingPageNumber:int = 0;
	
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
		buildingClipWidth = screenWidth - 2 * (scrollWidth + padding);
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
		
		CreateBuildingGroup();
	}
	
	public function Render()
	{
		GUI.skin = buildingMenuSkin;
		GUI.Box(background, "");
		
		GUI.DrawTexture(scrollLeft, scrollLeftTexture_Inactive);
		GUI.DrawTexture(scrollRight, scrollRightTexture_Inactive);
		
		if (GUI.Button(scrollLeft, ""))
		{
			Scroll(-1);
		}
		
		if (GUI.Button(scrollRight,""))
		{
			Scroll(1);
		}
		
		GUI.BeginGroup(buildingClip);
			GUI.BeginGroup(buildingGroup);
				for (var i:int = 0; i < buildingIconList.Count; i++)
				{
					GUI.Button(buildingIconList[i], buildingIconTexture);
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
	}
	
	/*
		Eventually, this should be the function that creates the building icons GUI group
		out of a list of building data
	*/
	public function CreateBuildingGroup()
	{
		buildingIconList = new List.<Rect>();
		var numPages:int;
		var sumWidth:int;
		var buildingIcon:Rect;
		
		numPages = Mathf.CeilToInt(testBuildings.Count/6);
		sumWidth = buildingIconHeight + buildingIconPadding;
		buildingGroup = new Rect(0, buildingGroupY, screenWidth * numPages, screenHeight);
		
		// Calculate the rect dimensions of every page of building icons
		// Each page consists of up to six icons split into two rows three
		for (var i:int = 0; i < numPages; i++)
		{	
			// Calculate the first row of building icons
			for (var j:int = 0; j < 3; j++)
			{
				buildingIcon = new Rect(j * sumWidth + buildingIconPadding, 0, buildingIconHeight, buildingIconHeight);
				buildingIconList.Add(buildingIcon);
			}
			
			// Calculate the second row of building icons
			var lowerRowOffset = buildingClipWidth - (3 * buildingIconHeight) - (2 * buildingIconPadding);
			for (var k:int = 0; k < 3; k++)
			{
				buildingIcon = new Rect(k * sumWidth + lowerRowOffset - buildingIconPadding, buildingIconHeight, buildingIconHeight, buildingIconHeight);
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
		
	}
}