/**********************************************************
IntelMenu.js

Description: 

Author: Francis Yuan
**********************************************************/

#pragma strict

public class BuildingMenu extends GUIControl
{
	// Skins for GUI components
	public var buildingMenuSkin:GUISkin;
	public var buildingHexButtonSkin:GUISkin;
	
	// Building Menu rectangles
	private var background:Rect;
	private var scrollLeft:Rect;
	private var scrollRight:Rect;
	private var buildingsList:List.<Rect>;
	
	// Building Menu scaling
	private var buildingIconHeightPercent:float = 0.3;
	private var buildingIconPaddingPercent:float = 0.05;
	private var scrollHeightPercent:float = 0.3;
	private var scrollRatio:float = 0.39;
	private var scrollYPercent:float = 0.4;
	
	private var buildingIconHeight:float;
	private var buildingIconPadding:float;
	private var scrollHeight:float;
	private var scrollWidth:float;
	private var scrollY:float;
	
	// Building Menu textures
	public var scrollLeftTexture:Texture;
	public var scrollRightTexture:Texture;
	
	// Building Menu animation
	private var isScrolling:boolean;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		buildingIconHeight = buildingIconHeightPercent * screenHeight;
		buildingIconPadding = buildingIconPaddingPercent * screenWidth;
		scrollHeight = scrollHeightPercent * screenHeight;
		scrollWidth = scrollHeight * scrollRatio;
		scrollY = scrollYPercent * screenHeight;
		
		background = new Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		scrollLeft = new Rect(verticalBarWidth + padding, horizontalBarHeight + scrollY, scrollWidth, scrollHeight);
		scrollRight = new Rect(verticalBarWidth + screenWidth - scrollWidth - padding, horizontalBarHeight + scrollY, scrollWidth, scrollHeight);
		
		rectList.Add(background);
	}
	
	public function Render()
	{
		GUI.skin = buildingMenuSkin;
		GUI.Box(background, "");
		
		GUI.DrawTexture(scrollLeft, scrollLeftTexture);
		GUI.DrawTexture(scrollRight, scrollRightTexture);
		
		if (GUI.Button(scrollLeft, ""))
		{
			Scroll(-1);
		}
		
		if (GUI.Button(scrollRight,""))
		{
			Scroll(1);
		}
	}
	
	public function Update()
	{
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