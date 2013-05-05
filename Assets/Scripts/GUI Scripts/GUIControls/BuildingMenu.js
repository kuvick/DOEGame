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
	
	private var unallocatedInputTex : Texture2D[];
	private var unallocatedOutputTex : Texture2D[];
	private var resourceIconList:List.<Rect>;
	private var resourceIconHeight:float;
	private var resourceIconHeightPercent:float = 0.08;
	
	
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
		public var data : BuildingOnGridData;
		public var icon : Texture;
	}
	
	public var buildingChoices : BuildingSiteChoice[];
	private var buildingsChosen : List.<BuildingSiteChoice>;
	
	// Used for placing buildings:
	private var gridObject : GameObject;
	private var grid : HexagonGrid;
	private var selectedBuildingSite : GameObject;

	
	public function Start () 
	{
		super.Start();		
	}
	
	// For when the level is loaded and there is an intel system
	public function LoadLevelReferences()
	{
		gridObject = GameObject.Find("HexagonGrid");
		grid = gridObject.GetComponent(HexagonGrid);
		
		var cameraObj : GameObject = GameObject.Find("Main Camera");
		var linkUI : LinkUI = cameraObj.GetComponent(LinkUI);
		unallocatedInputTex = linkUI.allocatedInputTex;
		unallocatedOutputTex = linkUI.allocatedOutputTex;
	}
	
	
	public function Initialize()
	{
		super.Initialize();
		
		//**Added by Katharine start
		resourceIconHeight = resourceIconHeightPercent * screenHeight;
		
		var i : int = 0;
		for (i = 0; i < buildingChoices.length; i++)//for (var choice : BuildingSiteChoice in buildingChoices)
		{
			var setData : BuildingData = buildingChoices[i].building.GetComponent(BuildingData);//choice.building.GetComponent(BuildingData);
			setData.buildingData = buildingChoices[i].data;
			//i++;
		}
		
		//** Added by Katharine end
		
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
		buildingsChosen = new List.<BuildingSiteChoice>();
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
		var j : int = 0;
		GUI.BeginGroup(buildingClip);
			GUI.BeginGroup(buildingGroup);
				for (var i:int = 0; i < buildingChoices.length; i++)
				{
					// Drawings Building Icon
					GUI.DrawTexture(buildingIconList[i], buildingChoices[i].icon);
					// Draws Input Icons:
					for (var k : int = 0; k < buildingChoices[i].data.unallocatedOutputs.length; k++)//for(var output : ResourceType in buildingChoices[i].data.unallocatedOutputs)
					{
						if(buildingChoices[i].data.unallocatedOutputs[k] != ResourceType.None)//output != ResourceType.None)
						{
							GUI.DrawTexture(resourceIconList[j], unallocatedOutputTex[buildingChoices[i].data.unallocatedOutputs[k] - 1]);//output - 1]);
							
						}
						else
						{
							Debug.Log("Check inputs of BuildingMenu, one of them is marked None...for " + buildingChoices[i].data.buildingName);
						}
						j++;
					}
					
					// Draws Output Icons:
					for(k = 0; k < buildingChoices[i].data.unallocatedInputs.length; k++)//var input : ResourceType in buildingChoices[i].data.unallocatedInputs)
					{
						if(buildingChoices[i].data.unallocatedInputs[k] != ResourceType.None)//input != ResourceType.None)
						{							
							GUI.DrawTexture(resourceIconList[j], unallocatedInputTex[buildingChoices[i].data.unallocatedInputs[k] - 1]);//input - 1]);
						}
						else
						{
							Debug.Log("Check outputs of BuildingMenu, one of them is marked None...for " + buildingChoices[i].data.buildingName);
						}
						j++;
					}
					
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
		
		var resourceIcon:Rect;
		
		buildingIconList = new List.<Rect>();
		resourceIconList = new List.<Rect>();
		numPages = Mathf.CeilToInt(buildingChoices.Length/6.0);
		if (numPages > 6)
		{
			rightScrollVisible = true;
		}	
		sumWidth = buildingIconHeight + buildingIconPadding;
		buildingGroup = new Rect(0, buildingGroupY, screenWidth * numPages, screenHeight);
		
		var buildingNum : int = 0;
		
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
				
				//Resource Icon Input Display:
				//var l : int = 0;
				for(var l : int = 0; l < buildingChoices[buildingNum].data.unallocatedOutputs.length; l++)//var output : ResourceType in buildingChoices[buildingNum].data.unallocatedOutputs)
				{
					resourceIcon = new Rect(currentPageX + currentUpperRowX, (resourceIconHeight/1.5) * l, resourceIconHeight, resourceIconHeight);
					resourceIconList.Add(resourceIcon);
					//l++;
				}
				//Resource Icon Output Display:
				//l = 0;
				for(l = 0; l < buildingChoices[buildingNum].data.unallocatedInputs.length; l++)//var input : ResourceType in buildingChoices[buildingNum].data.unallocatedInputs)
				{
					resourceIcon = new Rect(currentPageX + currentUpperRowX + (buildingIconHeight / 1.4), (buildingIconHeight / 1.4) - (resourceIconHeight/1.5) * l, resourceIconHeight, resourceIconHeight);
					resourceIconList.Add(resourceIcon);
					//l++;
				}				
				buildingNum++;
				
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
				buildingIconList.Add(buildingIcon);;
				
				//Resource Icon Input Display
				//var m : int = 0;
				for(var m : int = 0; m < buildingChoices[buildingNum].data.unallocatedOutputs.length; m++)//var output : ResourceType in buildingChoices[buildingNum].data.unallocatedOutputs)
				{
					resourceIcon = new Rect(currentPageX + currentLowerRowX, buildingIconHeight + (resourceIconHeight/1.5) * m, resourceIconHeight, resourceIconHeight);
					resourceIconList.Add(resourceIcon);
					//m++;
				}
				//Resource Icon Output Display
				//m = 0;
				for(m = 0; m < buildingChoices[buildingNum].data.unallocatedInputs.length; m++)//var input : ResourceType in buildingChoices[buildingNum].data.unallocatedInputs)
				{
					resourceIcon = new Rect(currentPageX + currentLowerRowX + (buildingIconHeight / 1.4), (buildingIconHeight * 1.7) - (resourceIconHeight/1.5) * m, resourceIconHeight, resourceIconHeight);
					resourceIconList.Add(resourceIcon);
					//m++;
				}
				buildingNum++;
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
			
			//Database.deleteBuildingSite(buildingData.GetLocation());
		
			var coordinate : Vector2 = grid.worldToTileCoordinates( position.x, position.z);			
			var build: GameObject;
			
			build = Instantiate(buildingChoices[index].building, position, Quaternion.identity);
			
			ReplaceBuildingData (build, buildingChoices[index].data);
			
			GameObject.Find("Database").GetComponent(Database).Save("BuildingSite");

			Database.AddToAddList(new Vector3(coordinate.x, coordinate.y, 0));
						
			//deleteBuildingSite(new Vector3(coordinate.x, coordinate.y, 0));
			GameObject.DestroyImmediate(selectedBuildingSite);
			Database.ReplaceBuildingSite(build, new Vector3(coordinate.x, coordinate.y, 0));
			//Database.addBuildingToGrid(build, new Vector3(coordinate.x, coordinate.y, 0));
			
			SoundManager.Instance().PlayBuildingPlaced();
			
			RemoveBuildingFromList(index);
	}
	
	// replaces the building data of the passed in building with the newData
	private function ReplaceBuildingData(building : GameObject, newData : BuildingOnGridData)
	{
		var buildingData : BuildingData = building.GetComponent("BuildingData");
		buildingData.buildingData.buildingName = newData.buildingName;
		buildingData.buildingData.unallocatedInputs = newData.unallocatedInputs;
		buildingData.buildingData.unallocatedOutputs = newData.unallocatedOutputs;
		
		buildingData.buildingData.optionalOutput = newData.optionalOutput;
		
		buildingData.buildingData.isActive = newData.isActive;
	}
	
	// Used by building site to give this menu its location.
	public function MakeCurrentSite( currentSite : GameObject )
	{
		selectedBuildingSite = currentSite;
	}
	
	private function RemoveBuildingFromList(index : int)
	{
		buildingsChosen.Add(buildingChoices[index]);
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
		
		resetResourceIcons();
	}
	
	//Adds the most recent building to be removed
	public function AddBuildingAfterUndo()
	{
		var tempChoice : BuildingSiteChoice = buildingsChosen[buildingsChosen.Count - 1];
		buildingsChosen.RemoveAt(buildingsChosen.Count - 1);
		var tempBuildingChoices : BuildingSiteChoice[] = new BuildingSiteChoice[buildingChoices.length + 1];
				
		for(var i = 0; i < buildingChoices.length; i++)
		{
				tempBuildingChoices[i] = buildingChoices[i];				
		}
		tempBuildingChoices[tempBuildingChoices.length - 1] = tempChoice;
		buildingChoices = tempBuildingChoices;
		
		numPages = Mathf.CeilToInt(buildingChoices.Length/6.0);	
		Debug.Log(numPages + " pages");
		if (numPages <= 1)
		{
			leftScrollVisible = false;
			rightScrollVisible = false;
			targetPage = 0;
		}
		else{
			rightScrollVisible = true;
		}
		
		resetResourceIcons();
	}
	
	// Recalculates all of the resource icons to their proper positions
	// to be used when a building is removed from the list.
	private function resetResourceIcons()
	{
		var sumWidth:int;
		var buildingIcon:Rect;
		var counter:int = 0;
		var currentPageX:float = 0;
		var currentUpperRowX:float = 0;
		var currentLowerRowX:float = 0;
		
		var resourceIcon:Rect;
		resourceIconList = new List.<Rect>();	
		sumWidth = buildingIconHeight + buildingIconPadding;
		
		var buildingNum : int = 0;
		
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
				
				//Resource Icon Input Display:
				//var l : int = 0;
				for(var l : int = 0; l < buildingChoices[buildingNum].data.unallocatedOutputs.length; l++)//var output : ResourceType in buildingChoices[buildingNum].data.unallocatedOutputs)
				{
					resourceIcon = new Rect(currentPageX + currentUpperRowX, (resourceIconHeight/1.5) * l, resourceIconHeight, resourceIconHeight);
					resourceIconList.Add(resourceIcon);
					//l++;
				}
				//Resource Icon Output Display:
				//l = 0;
				for(l = 0; l < buildingChoices[buildingNum].data.unallocatedInputs.length; l++)//var input : ResourceType in buildingChoices[buildingNum].data.unallocatedInputs)
				{
					resourceIcon = new Rect(currentPageX + currentUpperRowX + (buildingIconHeight / 1.4), (buildingIconHeight / 1.4) - (resourceIconHeight/1.5) * l, resourceIconHeight, resourceIconHeight);
					resourceIconList.Add(resourceIcon);
					//l++;
				}				
				buildingNum++;
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
				
				//Resource Icon Input Display
				//var m : int = 0;
				for(var m : int = 0; m < buildingChoices[buildingNum].data.unallocatedOutputs.length; m++)//var output : ResourceType in buildingChoices[buildingNum].data.unallocatedOutputs)
				{
					resourceIcon = new Rect(currentPageX + currentLowerRowX, buildingIconHeight + (resourceIconHeight/1.5) * m, resourceIconHeight, resourceIconHeight);
					resourceIconList.Add(resourceIcon);
					//m++;
				}
				//Resource Icon Output Display
				//m = 0;
				for(m = 0; m < buildingChoices[buildingNum].data.unallocatedInputs.length; m++)//var input : ResourceType in buildingChoices[buildingNum].data.unallocatedInputs)
				{
					resourceIcon = new Rect(currentPageX + currentLowerRowX + (buildingIconHeight / 1.4), (buildingIconHeight * 1.7) - (resourceIconHeight/1.5) * m, resourceIconHeight, resourceIconHeight);
					resourceIconList.Add(resourceIcon);
					//m++;
				}
				buildingNum++;
			}
		}		
	}	

}