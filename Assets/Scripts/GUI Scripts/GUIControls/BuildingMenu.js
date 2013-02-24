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
	
	public var buildingIconTexture:Texture;					//to be removed?
	
	// Building Menu animation
	private var isScrolling:boolean = false;
	private var numPages:int = 0;
	private var currentPage:float = 0;
	private var targetPage:float = 0;
	private var scrollTimer:float = 0;
	private var scrollSpeed:float = 1;				// Time in seconds to complete 1 scroll.
	private var leftScrollVisible:boolean = false;
	private var rightScrollVisible:boolean = true;
	
	
	/*
	Since it is easier to keep track of buildings in one spot, since all
	Building Sites utlize the same list and there is the requirement of
	subtracting buildings from the list, one uses the menu to keep track
	of all the buildings. Also, for now the resources that are involved
	with the buildings must be included in the picture so the user knows
	the the input/output of the building they are selecting.
	
	These two items, to avoid the confusion of parallel arrays, will be in
	a new class, and there will be an array of this new class, BuildingSiteChoice,
	that this menu will use.
	
	*/
	
	class BuildingSiteChoice
	{
		public var building : GameObject;
		public var icon : Texture;
	}
	
	public var buildingChoices : BuildingSiteChoice[];
	
	// Used for placing buildings:
	private var gridObject : GameObject;
	private var grid : HexagonGrid;
	private var selectedBuildingSite : GameObject;

	
	public function Start () 
	{
		super.Start();
		
		gridObject = GameObject.Find("HexagonGrid");
		grid = gridObject.GetComponent(HexagonGrid);
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
				for (var i:int = 0; i < buildingChoices.length; i++)
				{
					//Katharine: I will eventually set it up for it to print the input/output on top of the button (?)
					//so we don't have to include the input int the image
					//var buildingData : BuildingData = buildingChoices[i].building.GetComponent("BuildingData");
					//Debug.Log(i + "Input: " + buildingData.buildingData.inputName[0]);
				
					GUI.DrawTexture(buildingIconList[i], buildingChoices[i].icon);
					if(GUI.Button(buildingIconList[i], "" ))
					{
						Place(i);						
						currentResponse.type = EventTypes.MAIN;
						
					}
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
		//This will scroll the icons until the current page matches the target page		
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
		numPages = Mathf.CeilToInt(buildingChoices.Length/6.0);
		if (numPages > 6)
		{
			rightScrollVisible = true;
		}	
		sumWidth = buildingIconHeight + buildingIconPadding;
		buildingGroup = new Rect(0, buildingGroupY, screenWidth * numPages, screenHeight);
		
		// Calculate the rect dimensions of every page of building icons
		// Each page consists of up to six icons split into two rows of three
		for (var i:int = 0; i < numPages; i++)
		{	
			currentPageX = i * screenWidth;
			// Calculate the first row of building icons
			for (var j:int = 0; j < 3; j++)
			{
				counter++;
				if (counter > buildingChoices.Length)
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
				if (counter > buildingChoices.Length)
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
		
		if (numPages <= 1)
		{
			leftScrollVisible = false;
			rightScrollVisible = false;
		}
		else if (targetPage == 0 && numPages > 1)
		{
			leftScrollVisible = false;
			rightScrollVisible = true;
		}
		else if (targetPage != 0 && targetPage == numPages - 1)
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
	
	
	// Used to place the building at the specified location,
	// using the building in the current index of buildingChoices.
	// It also deletes the building site where it is to place the building.
	public function Place(index : int)
	{
			var position : Vector3 = selectedBuildingSite.transform.position;
			var buildingData : BuildingSiteScript = selectedBuildingSite.GetComponent("BuildingSiteScript");
			//Database.deleteBuildingSite(buildingData.GetLocation());
		
			
			var coordinate : Vector2 = grid.worldToTileCoordinates( position.x, position.z);			
			var build: GameObject;
			
			build = Instantiate(buildingChoices[index].building, position, Quaternion.identity);
			
			Database.addBuildingToGrid(build, new Vector3(coordinate.x, coordinate.y, 0));
			
			Destroy(selectedBuildingSite);
			RemoveBuildingFromList(index);
	}
	
	// Used by building site to give this menu its location.
	public function MakeCurrentSite( currentSite : GameObject )
	{
		selectedBuildingSite = currentSite;
	}
	
	private function RemoveBuildingFromList(index : int)
	{
		var tempBuildingChoices : BuildingSiteChoice[] = new BuildingSiteChoice[buildingChoices.length - 1];
		
		var i : int = 0;
		var j : int = 0;
		for(i = 0; i < buildingChoices.length; i++)
		{
			if(i != index)
			{
				tempBuildingChoices[j] = buildingChoices[i];
				j++;
			}
		}
		
		buildingChoices = tempBuildingChoices;
		
		numPages = Mathf.CeilToInt(buildingChoices.Length/6.0);	
		Debug.Log(numPages + " pages");
		if (numPages <= 1)
		{
			leftScrollVisible = false;
			rightScrollVisible = false;
			targetPage = 0;
		}		
	}

}