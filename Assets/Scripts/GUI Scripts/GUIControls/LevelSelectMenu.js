/**********************************************************
LevelSelectMenu.js

Description: 

Author: Francis Yuan
**********************************************************/

#pragma strict
public class LevelNode
{
	public var texture:Texture;
	public var name:String = "";
	public var difficulty:int = 0;
	public var score:int = 0;
}

public class LevelSelectMenu extends GUIControl
{
	// Skins for GUI components
	public var hexButtonSkin:GUISkin;
	public var levelSelectSkin:GUISkin;
	
	// Level Select Menu rectangles
	private var background:Rect;
	private var scrollLeft:Rect;
	private var scrollRight:Rect;
	private var levelClip:Rect;
	private var levelGroup:Rect;
	private var levelList:List.<Rect>;
	private var cancelButton:Rect;
	
	// For testing
	private var testLevels:List.<LevelNode>;
	
	// Level Select Menu scaling
	private var scrollHeightPercent:float = 0.3;
	private var scrollRatio:float = 0.39;
	private var scrollYPercent:float = 0.4;
	private var levelHeightPercent:float = 0.3;
	private var levelPaddingPercent:float = 0.01;
	private var levelGroupYPercent:float = 0.25;
	private var cancelButtonHeightPercent:float = 0.2;		
	private var cancelButtonFontHeightPercent:float = 0.03;	

	private var scrollHeight:float;
	private var scrollWidth:float;
	private var scrollY:float;
	private var levelHeight:float;
	private var levelPadding:float;
	private var levelClipWidth:float;
	private var levelGroupY:float;
	private var cancelButtonHeight:float = 0.2;		
	private var cancelButtonFontHeight:float = 0.03;	
	
	// Level Select Menu textures
	private var scrollLeftTexture_Current:Texture;
	private var scrollRightTexture_Current:Texture;
	
	public var scrollLeftTexture_Active:Texture;
	public var scrollRightTexture_Active:Texture;
	public var scrollLeftTexture_Inactive:Texture;
	public var scrollRightTexture_Inactive:Texture;
	
	public var levelNodeTexture:Texture;
	
	// Level Select Menu animation
	private var numPages:int = 0;
	private var isScrolling:boolean = false;
	private var currentPage:float = 0;
	private var targetPage:float = 0;
	private var scrollTimer:float = 0;
	private var scrollSpeed:float = 1;				// Time in seconds to complete 1 scroll.
	
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
		levelHeight = levelHeightPercent * screenHeight;
		levelPadding = levelPaddingPercent * screenWidth;
		levelClipWidth = screenWidth - 2 * (scrollWidth + padding);
		levelGroupY = screenHeight * levelGroupYPercent;
		
		cancelButtonHeight = cancelButtonHeightPercent * screenHeight;
		cancelButtonFontHeight = cancelButtonFontHeightPercent * screenHeight;
		
		hexButtonSkin.button.fontSize = cancelButtonFontHeight;
		
		background = new Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		scrollLeft = new Rect(verticalBarWidth + padding, horizontalBarHeight + scrollY, scrollWidth, scrollHeight);
		scrollRight = new Rect(verticalBarWidth + screenWidth - scrollWidth - padding, horizontalBarHeight + scrollY, scrollWidth, scrollHeight);
		levelClip = new Rect(verticalBarWidth + (screenWidth - levelClipWidth)/2, horizontalBarHeight, levelClipWidth, screenHeight);
		cancelButton =	Rect(verticalBarWidth + padding, horizontalBarHeight + padding, cancelButtonHeight, cancelButtonHeight);	
		
		LoadLevelList();
	}
	
	public function Render()
	{
		
	}
	
	public function Update()
	{
		if (targetPage != currentPage)
		{
			scrollTimer += Time.deltaTime;
			currentPage = Mathf.Lerp(currentPage, targetPage, scrollTimer/scrollSpeed);
			//levelGroup.x = screenWidth * -currentPage;
			
			if (targetPage == currentPage)
			{
				isScrolling = false;
				scrollTimer = 0;
			}
		}
	}

	/*
		Eventually, this should be the function that creates the level select menu
		out of a list of levels
	*/
	public function LoadLevelList()
	{
		var sumWidth:int;
		var level:Rect;
		var counter:int = 0;
		var currentPageX:float = 0;
		var currentUpperRowX:float = 0;
		var currentLowerRowX:float = 0;
		
		levelList = new List.<Rect>();
		numPages = Mathf.CeilToInt(testLevels.Count/6.0);	
		sumWidth = levelHeight + levelPadding;
		levelGroup = new Rect(0, levelGroupY, screenWidth * numPages, screenHeight);
		
		// Calculate the rect dimensions of every page of levels
		// Each page consists of up to 4 icons
		for (var i:int = 0; i < numPages; i++)
		{	
			currentPageX = i * screenWidth;
			// Calculate the first row of building icons
			for (var j:int = 0; j < 3; j++)
			{
				counter++;
				if (counter > testLevels.Count)
				{
					break;
				}
				currentUpperRowX = j * sumWidth + levelPadding;
				level = new Rect(currentPageX + currentUpperRowX, 0, levelHeight, levelHeight);
				levelList.Add(level);
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
	}
}