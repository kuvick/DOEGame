/**********************************************************
LevelSelectMenu.js

Description: 

Author: Francis Yuan
**********************************************************/

#pragma strict
public class LevelNode
{
	public var texture:Texture;
	public var displayName:String = "";
	public var sceneName:String = "";
	public var difficulty:int = 0;
	private var score:int = 0;
	
	public function LevelNode(tex:Texture, dispName: String, lvlName:String, dif:int, bestScore:int)
	{
		texture = tex;
		displayName = dispName;
		sceneName = lvlName;
		difficulty = dif;
		score = bestScore;
	}
	
	// Eventually need to find way for saving scores and then calling them back up here
	// and it will use these functions to get the score
	public function setScore(num:int)
	{
		score = num;
	}
	
	public function getScore():int
	{
		return score;
	}
}

public class LevelSelectMenu extends GUIControl
{
	// Skins for GUI components
	public var hexButtonSkin:GUISkin;
	public var levelSelectSkin:GUISkin;
	
	// Level Select Menu rectangles
	private var background:Rect;
	private var title:Rect;
	private var scrollLeft:Rect;
	private var scrollRight:Rect;
	private var levelClip:Rect;
	private var levelGroup:Rect;
	private var levelList:List.<Rect>;
	private var backButton:Rect;
	
	// For testing
	private var testLevels:List.<LevelNode>;
	
	// Level Select Menu scaling
	private var scrollHeightPercent:float = 0.3;
	private var scrollRatio:float = 0.39;
	private var scrollYPercent:float = 0.3;
	private var levelHeightPercent:float = 0.35;
	private var levelPaddingPercent:float = 0.01;
	private var levelGroupYPercent:float = 0.25;
	private var levelTitleFontHeightPercent:float = 0.1;
	private var levelNodeFontHeightPercent:float = 0.025;
	private var levelMiddleNodeOffsetPercent:float = 0.2;
	private var backButtonHeightPercent:float = 0.2;		
	private var backButtonFontHeightPercent:float = 0.03;	

	private var scrollHeight:float;
	private var scrollWidth:float;
	private var scrollY:float;
	private var levelHeight:float;
	private var levelPadding:float;
	private var levelSumWidth:int;
	private var levelClipWidth:float;
	private var levelGroupY:float;
	private var levelTitleFontHeight:float;
	private var levelNodeFontHeight:float;
	private var levelMiddleNodeOffset;
	private var backButtonHeight:float;		
	private var backButtonFontHeight:float;	
	
	// Level Select Menu textures
	public var backgroundTexture:Texture;
	
	private var scrollLeftTexture_Current:Texture;
	private var scrollRightTexture_Current:Texture;
	
	public var scrollLeftTexture_Active:Texture;
	public var scrollRightTexture_Active:Texture;
	public var scrollLeftTexture_Inactive:Texture;
	public var scrollRightTexture_Inactive:Texture;
	
	public var levelNodeTexture:Texture;
	
	// Level Select Menu animation
	private var numLevels:int;
	private var maxVisibleLevels:int = 3;
	private var isScrolling:boolean = false;
	private var currentLevel:float = 0;
	private var targetLevel:float = 0;
	private var scrollTimer:float = 0;
	private var scrollSpeed:float = 1;				// Time in seconds to complete 1 scroll.
	private var leftScrollVisible:boolean = false;
	private var rightScrollVisible:boolean = false;
	
	public var levels : LevelNode[];
	
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
		levelClipWidth = screenWidth - 2 * (scrollWidth + padding);
		levelHeight = levelHeightPercent * screenHeight;
		levelPadding = (levelClipWidth - (maxVisibleLevels * levelHeight))/2.0;
		levelGroupY = screenHeight * levelGroupYPercent;
		levelTitleFontHeight = levelTitleFontHeightPercent * screenHeight;
		levelNodeFontHeight = levelNodeFontHeightPercent * screenHeight;
		levelMiddleNodeOffset = levelMiddleNodeOffsetPercent * screenHeight;
		backButtonHeight = backButtonHeightPercent * screenHeight;
		backButtonFontHeight = backButtonFontHeightPercent * screenHeight;
		
		levelSelectSkin.button.fontSize = levelNodeFontHeight;
		levelSelectSkin.label.fontSize = levelTitleFontHeight;
		hexButtonSkin.button.fontSize = backButtonFontHeight;
		
		background = new Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		title = new Rect(verticalBarWidth + screenWidth/2, horizontalBarHeight + padding, 0, 0);
		scrollLeft = new Rect(verticalBarWidth + padding, horizontalBarHeight + scrollY, scrollWidth, scrollHeight);
		scrollRight = new Rect(verticalBarWidth + screenWidth - scrollWidth - padding, horizontalBarHeight + scrollY, scrollWidth, scrollHeight);
		levelClip = new Rect(verticalBarWidth + (screenWidth - levelClipWidth)/2, horizontalBarHeight, levelClipWidth, screenHeight);
		backButton =	Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - padding - backButtonHeight, backButtonHeight, backButtonHeight);	
		
		// For testing
		/*
		testLevels = new List.<LevelNode>();
		testLevels.Add(new LevelNode(levelNodeTexture, "\nIntro", 1, 0));
		testLevels.Add(new LevelNode(levelNodeTexture, "\nEast Coast Surge", 2, 0));
		testLevels.Add(new LevelNode(levelNodeTexture, "\nHurricanes", 3, 0));
		testLevels.Add(new LevelNode(levelNodeTexture, "\nWe Ran Out of Oil", 5, 0));
		testLevels.Add(new LevelNode(levelNodeTexture, "\nIntro", 1, 0));
		testLevels.Add(new LevelNode(levelNodeTexture, "\nEast Coast Surge", 2, 0));
		testLevels.Add(new LevelNode(levelNodeTexture, "\nHurricanes", 3, 0));
		testLevels.Add(new LevelNode(levelNodeTexture, "\nWe Ran Out of Oil", 5, 0));
		*/
		
		LoadLevelList();
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.levelSelectMusic;
	}
	
	public function Render()
	{
		GUI.skin = levelSelectSkin;
		GUI.DrawTexture(background, backgroundTexture, ScaleMode.ScaleAndCrop);
		
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
		
		//So it can pass to the loading screen where to go next
		var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);

		
		// Draws every building icon in the building icon list in two nested GUI groups
		// The first group represents the clip area 
		// The second group represents the entire list of building icons
		// Change the second group's rect's x position in order to scroll the building icons
		GUI.BeginGroup(levelClip);
			GUI.BeginGroup(levelGroup);
				for (var i:int = 0; i < levelList.Count; i++)
				{
					if(PlayerPrefs.HasKey(levels[i].sceneName + "Score"))
					{
						levels[i].setScore(PlayerPrefs.GetInt(levels[i].sceneName + "Score"));
					}
				
					GUI.DrawTexture(levelList[i], levels[i].texture);
					if(GUI.Button(levelList[i], levels[i].displayName + "\n\nDifficulty: " + levels[i].difficulty + "\nHigh Score: " + levels[i].getScore()))
					{
						nextLevel.nextLevel = levels[i].sceneName;
						Application.LoadLevel("LoadingScreen");
					}
				}
			GUI.EndGroup();
		GUI.EndGroup();
		
		
		GUI.skin = hexButtonSkin;
		
		if (GUI.Button(backButton, "Back"))
		{
			currentResponse.type = EventTypes.MAIN;
			if (!PlayerPrefs.HasKey(Strings.RESUME)){
				Debug.LogError("There was no level to resume.");
			} else {
				var levelToResume : String = PlayerPrefs.GetString(Strings.RESUME);
				Debug.Log("Going to load " + levelToResume);
				Application.LoadLevel(levelToResume); // TODO We need to load in the actual level not restart it
			}
		}
	}
	
	public function Update()
	{
		if (targetLevel != currentLevel)
		{
			scrollTimer += Time.deltaTime;
			currentLevel = Mathf.Lerp(currentLevel, targetLevel, scrollTimer/scrollSpeed);
			levelGroup.x = levelSumWidth * -currentLevel;
			
			if (targetLevel == currentLevel)
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
		var level:Rect;
		var counter:int = 0;
		var currentRowX:float = 0;
		var currentRowY:float = 0;
		levelList = new List.<Rect>();
		
		numLevels = levels.Length;
		if (numLevels > 3)
		{
			rightScrollVisible = true;
		}
		levelSumWidth = levelHeight + levelPadding;
		levelGroup = new Rect(0, levelGroupY, screenWidth * numLevels, screenHeight);
		
		// Calculate the rect dimensions of every level
		for (var i:int = 0; i < numLevels; i++)
		{			
			if(i%2 == 1)	
			{
				currentRowY = levelMiddleNodeOffset;
			}
			else
			{
				currentRowY = 0;
			}
			
			currentRowX = i * levelSumWidth;
			level = new Rect(currentRowX, currentRowY, levelHeight, levelHeight);
			levelList.Add(level);
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
		targetLevel = Mathf.Clamp(targetLevel + direction, 0, numLevels);
		
		if(numLevels <= 3)
		{
			leftScrollVisible = false;
			rightScrollVisible = false;
		}
		else if (targetLevel == 0)
		{
			leftScrollVisible = false;
			rightScrollVisible = true;
		}
		else if (targetLevel + 3 >= numLevels)
		{
			leftScrollVisible = true;
			rightScrollVisible = false;
		}
		else
		{
			leftScrollVisible = true;
			rightScrollVisible = true;
		}
	}
}