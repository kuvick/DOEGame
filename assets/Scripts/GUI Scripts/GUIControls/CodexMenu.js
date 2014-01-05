/**********************************************************
codicesMenu.js

Author: Jared Mavis
**********************************************************/

#pragma strict

import System.Collections.Generic;

public class CodexMenu extends GUIControl
{
	public var sidePadding : float = .05f;
	public var codicesHeight : float = .4f;
	public var entryLabelMaxWidthPercent : float = .4; // in percetage of screen
	public var entryLabelMaxHeightPercent : float = .2;
	public var codexLabelHeight : float = .2;
	public var backButtonHeight : float = .1;
	private var codexLabelWidth : float = .2;
	
	public var codexButtonDarkStyle : GUIStyle;
	public var codexButtonLightStyle : GUIStyle;
	public var codexLabelTexture : Texture2D;
	public var backButtonTexture : Texture2D;
	public var previousEntriesTexture : Texture2D;
	public var backgroundTexture : Texture2D;
	public var scrollViewbackgroundTexture : Texture2D;
	
	public var playerData : SaveSystem; // should be player class
	
	private var codices : List.<CodexEntry>; //	*******************************switch back to private
	
	private var rowWidth : float;
	private var entryLabelMaxWidth : float; // in pixels on screen
	private var entryLabelMaxHeight : float;
	private var scrollBarStyle : GUIStyle;
	
	private var codexLabelRect : Rect;
	private var backButtonRect : Rect;
	private var scrollViewRect : Rect;
	private var scrollViewAreaRect : Rect;
	private var previousEntriesRect : Rect;
	private var backgroundRect : Rect;
	private var codicesRects : List.<Rect>;
	
	private var scrollViewWidth : float;
	private var FONTRATIOBUTTONS:float = 20; // kinda arbitrary
	
	private var mainView : boolean;
	
	public var skin:GUISkin;
	
	private var isHolding:boolean;
	private var startHolding:boolean;
	
	private var hexBGRect:List.<Rect> = new List.<Rect>();
	private var hexRect:List.<Rect> = new List.<Rect>();
	private var hexCoverRect:List.<Rect> = new List.<Rect>();
	public var hexCoverTexture:Texture;
	private var hexGroup:Rect;
	public var hexBGTexture:Texture;
	private var hexDistancePercent:float = 0.26289;
	private var currentEntry:CodexEntry;
	
	public var fullCodex : List.<CodexEntry> = new List.<CodexEntry>();
	
	private var totalCodex: List.<CodexEntry> = new List.<CodexEntry>();
	private var earnedCodex: List.<CodexEntry> = new List.<CodexEntry>();
	private var notEarnedCodex: List.<CodexEntry> = new List.<CodexEntry>();
	
	//Display Options
	public var showUnlockedButton:Texture;
	public var notShowUnlockedButton:Texture;
	public var showLockedButton:Texture;
	public var notShowLockedButton:Texture;
	private var displayBox:Rect;
	private var displayLabel:Rect;
	private var displayUnlockedRect:Rect;
	private var displayLockedRect:Rect;
	private var displayUnlocked:boolean;
	private var displayLocked:boolean;
	
	private var currentLockedTexture:Texture;
	private var currentUnlockedTexture:Texture;
	
	private var doNotRender:boolean;
	
	
	public function Initialize(){
		super.Initialize();
		
		displayUnlocked = true;
		displayLocked = true;
		doNotRender = false;
		
		codices = new List.<CodexEntry>();
		mainView = true;
		isHolding = false;
		startHolding = false;
		firstPass = false;
		checkDelta = 0;
		zooming = false;
		
		currentLockedTexture = showLockedButton;
		currentUnlockedTexture = showUnlockedButton;
		
		if (playerData == null){
			Debug.LogWarning("IntelSystem does not have a reference to the SaveSystem. Attempting to find");
			playerData = GameObject.Find("Player Data").GetComponent(SaveSystem) as SaveSystem;
			if (playerData == null){
				Debug.LogError("Could not find SaveSystem");
			}
		}
		
		scrollBarStyle = new GUIStyle();
		
		entryLabelMaxWidth = ScreenSettingsManager.screenWidth * entryLabelMaxWidthPercent;
		entryLabelMaxHeight = ScreenSettingsManager.screenHeight * entryLabelMaxHeightPercent;
		
		codexButtonDarkStyle.fontSize = (Mathf.RoundToInt(Mathf.Min(ScreenSettingsManager.screenWidth, ScreenSettingsManager.screenHeight) / FONTRATIOBUTTONS));
		codexButtonLightStyle.fontSize = codexButtonDarkStyle.fontSize;
		
		rowWidth = 1 - (2 * sidePadding); // fill up the width with codices
		
		/*
	 	if(playerData.currentPlayer.codexData == null || playerData.currentPlayer.codexData.codices == null || playerData.currentPlayer.codexData.codices.Count <= 0)
	 	{
	 		playerData.currentPlayer.codexData = new CodexData();
			playerData.currentPlayer.codexData.LoadFromSource();
		}
		playerData.profileSystem.Save();
		*/
		
		//codices = playerData.currentPlayer.codexData.codices;
		
		for(var i:int = 0; i < playerData.currentPlayer.codexEntries.Count; i++)
		{
			var tempCodex:CodexEntry = new CodexEntry();
			
			if(playerData.codexData.UnlockCodex(playerData.currentPlayer.codexEntries[i]))
				codices.Add(playerData.codexData.GetCodexEntry(playerData.currentPlayer.codexEntries[i]));
		}
		
		fullCodex = playerData.codexData.codices;
		
		SetupRectangles();
	}
	
	public function OnOpen(){
		super.OnOpen();
	} 
	
	private function HoldWait()
	{
		//Debug.Log("waiting");
		yield WaitForSeconds(0.07);
		
		if (startHolding && Input.GetKey(KeyCode.Mouse0) || Input.touchCount > 0)
		{
			startHolding = true;
			isHolding = true;
			released = false;
			
			if(Input.GetKey(KeyCode.Mouse0))
			{
				lastMousePos = Input.mousePosition;
				useMouse = true;
			}
			else
				useMouse = false;
				//Input.touches[0].deltaPosition
		}
	}
	
	//So it doesn't recongize it as a "click" for the button underneath
	private var released:boolean;
	private function ReleaseWait()
	{
		//Debug.Log("waiting");
		yield WaitForSeconds(0.03);
		released = true;
	}


	//Dragging
	private var scrollPosition : Vector2;
	private var lastMousePos: Vector2;
	private var useMouse:boolean;
	private var originalYHexGroup:float;
	private var startMousePosition:Vector2;
	private var startTapPosition:Vector2;
	private var checkDelta : int;
	private var firstPass:boolean = false;

	//Zooming
	private var zooming:boolean = false;
	private var touchZoom:boolean = false;
	private var tapDistance:float;
	private var zoomIn:boolean = false;
	
	public function Render()
	{	
		GUI.skin = skin;
		
		if(mainView)
		{
			if(Input.touchCount >= 2 || Input.GetAxis("Mouse ScrollWheel") != 0)
			{
				//Debug.Log(Input.GetAxis("Mouse ScrollWheel"));
				zooming = true;
			}
			else
				zooming = false;
		
			if(!zooming)
			{
				//To check if the user is holding down in order to drag
				if (!startHolding && (Input.GetKey(KeyCode.Mouse0) || Input.touchCount > 0))
				{
					//Debug.Log("Input detected");
					startHolding = true;
					
					/*
					firstPass = true;
					checkDelta = 0;
					
					if(Input.GetKey(KeyCode.Mouse0))
					{
						startMousePosition = Vector2(Input.mousePosition.x, Input.mousePosition.y);
					}
					else
					{
						startMousePosition = Vector2.zero;
					}
						
					if(Input.touchCount > 0)
					{
						startTapPosition = Vector2(Input.touches[0].position.x, Input.touches[0].position.y);
					}
					*/
					HoldWait();
				}
				/*
				else if(firstPass)
				{	
					//Debug.Log(checkDelta);
					//Debug.Log(Input.mousePosition);
					if(checkDelta > 2)
					{
						if(startMousePosition != Vector2.zero && startMousePosition != Vector2(Input.mousePosition.x, Input.mousePosition.y))
						{
							//Debug.Log("FirstPass1");
							HoldWait();
						}
						else if(Input.touchCount > 0 && startTapPosition != Vector2(Input.touches[0].position.x, Input.touches[0].position.y))
						{
							//Debug.Log("FirstPass2");
							HoldWait();
						}
						
						firstPass = false;
					}
					else
						checkDelta++;
				}
				*/
				else if (startHolding && (!Input.GetKey(KeyCode.Mouse0) && Input.touchCount <= 0))
				{
					startHolding = false;
					isHolding  = false;
					ReleaseWait();
				}
				
				
				if(isHolding)
				{
					var change:Vector2;
				
					if(useMouse)
					{
						change = Input.mousePosition - lastMousePos;
						lastMousePos = Input.mousePosition;
					}
					else
					{
						change = Input.touches[0].deltaPosition;
					}
					
					
					hexGroup.x += change.x;
					hexGroup.y += -change.y;
					
					
					if(	hexGroup.xMax < Screen.width)
					{
						hexGroup.x = Screen.width - hexGroup.width;
					}
					else if(hexGroup.xMin > 0)
					{
						hexGroup.x = 0;
					}
					
					if(	hexGroup.yMax < Screen.height)
					{
						hexGroup.y = Screen.height - hexGroup.height;
					}
					else if(hexGroup.yMin > originalYHexGroup)
					{
						hexGroup.y = originalYHexGroup;
					}
				}
			}
			else if(zooming || touchZoom)
			{
				if(Input.GetAxis("Mouse ScrollWheel") != 0)
				{
					if(Input.GetAxis("Mouse ScrollWheel") > 0)
						zoomIn = true;
					else if(Input.GetAxis("Mouse ScrollWheel") < 0)
						zoomIn = false;
				}
				else if(Input.touchCount >= 2)
				{
					if(touchZoom)
					{
						if(tapDistance > Vector2.Distance(Input.touches[0].position, Input.touches[1].position))
							zoomIn = false;
						else
							zoomIn = true;
							
						tapDistance = Vector2.Distance(Input.touches[0].position, Input.touches[1].position);	
					}
					else
					{
						touchZoom = true;
						tapDistance = Vector2.Distance(Input.touches[0].position, Input.touches[1].position);
					}
				}
				else
				{
					touchZoom = false;
				}
			
			
				//if(zoomIn && hexGroup.width < Screen.width * 2)
				if(zoomIn && (currentNumOfCol > 3))
				{
					//if(currentNumOfCol > 3)
						//currentNumOfCol--;
						
					recalculateRectForHexes(1.1);
					
					//hexGroup.width = hexGroup.width * 1.1;
					//hexGroup.height = hexGroup.height * 1.1;
				}
				//else if(!zoomIn && hexGroup.width > Screen.width * 0.9)
				else if(!zoomIn && (currentNumOfCol < 11))
				{
					//if(currentNumOfCol < 11)
						//currentNumOfCol++;
						
					recalculateRectForHexes(0.9);
					//hexGroup.width = hexGroup.width * 0.9;
					//hexGroup.height = hexGroup.height * 0.9;
				}
				
			}
		}
	
		GUI.DrawTexture(backgroundRect, backgroundTexture);
		
		if(mainView)
		{
			RenderMain();
		}
		else
		{
			RenderEntry();
		}
		
		
		// Header:
		GUI.DrawTexture(codexLabelRect, codexLabelTexture);
		GUI.DrawTexture(backButtonRect, backButtonTexture,ScaleMode.StretchToFill);
		if(!isHolding && GUI.Button(backButtonRect, ""))
		{
			
			if(mainView)
			{
				currentResponse.type = EventTypes.LEVELSELECT;
			}
			else
			{
				mainView = true;
			}
		}
		

	}
	
	private function recalculateRectForHexes(percentage:float)
	{
		for(var i:int = 0; i < fullCodex.Count; i++)
		{
			hexBGRect[i] = Rect(hexBGRect[i].x * percentage, hexBGRect[i].y * percentage, hexBGRect[i].width * percentage, hexBGRect[i].height * percentage);
			hexRect[i] = Rect(hexRect[i].x * percentage, hexRect[i].y * percentage, hexRect[i].width * percentage, hexRect[i].height * percentage);	
		}
		for(var j:int = 0; j < hexCoverRect.Count; j++)
		{
			hexCoverRect[j] = Rect(hexCoverRect[j].x * percentage, hexCoverRect[j].y * percentage, hexCoverRect[j].width * percentage, hexCoverRect[j].height * percentage);
		}
		
		currentNumOfCol = (screenWidth / hexRect[0].width) + 2;
		reArrangeHexTiles(percentage);
	}
	
	private var currentNumOfCol:int = 7; // originally 5
	private function reArrangeHexTiles(percentage:float)
	{
		var startHex:Rect = hexRect[0];
		var startHexBG:Rect = hexBGRect[0];
		
		var row:int = -1;
		
		hexCoverRect.Clear();
		hexBGRect.Clear();
		hexRect.Clear();
	
		for(var i:int = 0; i < fullCodex.Count; i++)
		{
			var col:int = i % currentNumOfCol;
			
			if(col == 0)
				row++;
			
		
			var tempHex:Rect = startHex;
			var tempHexBG:Rect = startHexBG;
			
			tempHex.x += (tempHexBG.width - (tempHexBG.width * hexDistancePercent)) * col;
			tempHexBG.x = (tempHexBG.width - (tempHexBG.width * hexDistancePercent)) * col;
			
			tempHex.y += row * tempHexBG.height;
			tempHexBG.y = row * tempHexBG.height;
			
			if(col % 2 == 1)
			{
				tempHex.y += tempHexBG.height / 2;
				tempHexBG.y += tempHexBG.height / 2;
			}
			
			hexRect.Add(tempHex);
			hexBGRect.Add(tempHexBG);
			
			if(!codices.Contains(fullCodex[i]))
			{
				hexCoverRect.Add(tempHexBG);
			}
		}
	
		//i % 5 for width
		// if i % 5 = 0 , start of new row
		
		hexGroup = new Rect(0,codexLabelRect.height * 1.3,
				(startHexBG.width - (startHexBG.width * hexDistancePercent)) * (currentNumOfCol + 1),
				(row + 2) * tempHexBG.height);
	}
	
	
	
	private function RenderMain()
	{		
		/*
		scrollPosition = GUI.BeginScrollView (scrollViewRect, scrollPosition, scrollViewAreaRect, scrollBarStyle, scrollBarStyle);
		
		GUI.Box(scrollViewAreaRect, "");
		GUI.DrawTexture(previousEntriesRect, previousEntriesTexture);
		
		var index : int = 0;
		for (var codex : CodexEntry in codices){
			//if (codex.isUnlocked){
				if (GUI.Button(codicesRects[index], codex.name,  index%2==0 ? codexButtonLightStyle : codexButtonDarkStyle)){
					if (codex.urlLink != null && codex.urlLink != ""){
						Application.OpenURL(codex.urlLink);
					} else {
						Debug.LogError("No url set for " + codex.name);
					}
				}
				index++;
			//}
		}
		GUI.EndScrollView ();*/
		
		GUI.BeginGroup(hexGroup);
			if(!doNotRender)
			{
				for(var i:int = 0; i < fullCodex.Count; i++)
				{
					GUI.DrawTexture(hexBGRect[i], hexBGTexture, ScaleMode.StretchToFill);
					GUI.DrawTexture(hexRect[i], fullCodex[i].icon, ScaleMode.StretchToFill);
					
					if(codices.Contains(fullCodex[i]))
					{
						if(released && !isHolding && GUI.Button(hexRect[i], ""))
						{
							currentEntry = fullCodex[i];
							mainView = false;
						}
					}
				}
				for(var j:int = 0; j < hexCoverRect.Count; j++)
				{
					GUI.DrawTexture(hexCoverRect[j], hexCoverTexture, ScaleMode.StretchToFill);
				}
			}			
		GUI.EndGroup();
		
		GUI.BeginGroup(displayBox);
			GUI.skin.label.alignment = TextAnchor.UpperCenter;
			GUI.Label(displayLabel, "DISPLAY");
			GUI.skin.label.alignment = TextAnchor.UpperLeft;
			GUI.DrawTexture(displayUnlockedRect, currentUnlockedTexture, ScaleMode.StretchToFill);
			GUI.DrawTexture(displayLockedRect, currentLockedTexture, ScaleMode.StretchToFill);
			
			if(GUI.Button(displayUnlockedRect,""))
			{
				doNotRender = false;
				if(displayUnlocked)
				{
					currentUnlockedTexture = notShowUnlockedButton;					
					if(displayLocked)
						fullCodex = notEarnedCodex;
					else
						doNotRender = true;
				}
				else
				{
					currentUnlockedTexture = showUnlockedButton;					
					if(displayLocked)
						fullCodex = totalCodex;
					else
						fullCodex = earnedCodex;
				}
				
				displayUnlocked = !displayUnlocked;
				//recalculateRectForHexes(1.0);
				reArrangeHexTiles(1.0);
			}
			
			if(GUI.Button(displayLockedRect,""))
			{
				doNotRender = false;
				if(displayLocked)
				{
					currentLockedTexture = notShowLockedButton;					
					if(displayUnlocked)
						fullCodex = earnedCodex;
					else
						doNotRender = true;
					
				}
				else
				{
					currentLockedTexture = showLockedButton;
					if(displayUnlocked)
						fullCodex = totalCodex;
					else
						fullCodex = notEarnedCodex;
				}
				
				displayLocked = !displayLocked;
				//recalculateRectForHexes(1.0);
				reArrangeHexTiles(1.0);
			}
			
		GUI.EndGroup();
		
	}
	
	private var techEntryGroup:Rect;
	private var awardBGRect:Rect;
	public var awardBGTexture:Texture;
	private var techIconRect:Rect;
	public var infoBoxTexture:Texture;
	private var infoBoxRect:Rect;
	public var learnMoreButton:Texture;
	private var learnMoreRect:Rect;
	private var titleRect:Rect;
	private var descriptionRect:Rect;
	
	public var titleStyle:GUIStyle;
	public var descriptStyle:GUIStyle;
	
	private function RenderEntry()
	{
		GUI.BeginGroup(techEntryGroup);
		
		
			GUI.DrawTexture(infoBoxRect, infoBoxTexture, ScaleMode.StretchToFill);
			GUI.Label(titleRect, currentEntry.name, titleStyle);
			GUI.Label(descriptionRect, currentEntry.description, descriptStyle);
			
		
			GUI.DrawTexture(awardBGRect, awardBGTexture, ScaleMode.StretchToFill);
			GUI.DrawTexture(techIconRect, currentEntry.icon, ScaleMode.StretchToFill);
			
			
			GUI.DrawTexture(learnMoreRect, learnMoreButton, ScaleMode.StretchToFill);
			if(GUI.Button(learnMoreRect, ""))
			{
				Application.OpenURL(currentEntry.urlLink);
			}

		GUI.EndGroup();
	}
	
	private var currentRow : int;
	public function SetupRectangles()
	{
	
		displayBox = createRect(new Vector2(369.0,218.0),1083.0/1920.0, 27.0/1080.0, 218.0/1080.0, true);
		displayLabel = createRect(new Vector2(320.0,65.0), 0,0, 65.0/218.0, false, displayBox);
		
		displayLabel.x = displayBox.width / 2 - displayLabel.width / 2;
		
		displayUnlockedRect = createRect(showUnlockedButton,1.0/369.0, 58.0/218.0, 162.0/218.0, false, displayBox);
		displayLockedRect  = createRect(showLockedButton,208.0/369.0, 69.0/218.0, 140.0/218.0, false, displayBox);
		
		
		techEntryGroup = createRect(new Vector2(1845,746),73.0/1920.0, 264.0/1080.0, 746.0/1080.0, true);
		awardBGRect = createRect(awardBGTexture,(1201.0 - 73.0)/1845.0, (264.0 - 264.0)/746.0, 637.0/746.0, false, techEntryGroup);
		techIconRect = createRect(fullCodex[0].icon,(1254.0 - 73.0)/1845.0, (342.0 - 264.0)/746.0, 481.0/746.0, false, techEntryGroup);
		infoBoxRect = createRect(infoBoxTexture,(73.0 - 73.0)/1845.0, (338.0 - 264.0)/746.0, 672.0/746.0, false, techEntryGroup);
		learnMoreRect = createRect(learnMoreButton,(144.0 - 73.0)/1845.0, (834.0 - 264.0)/746.0, 107.0/746.0, false, techEntryGroup);
		
		titleRect = createRect(new Vector2(1089,598), (104.0 - 73.0)/1845.0, (369.0 - 264.0)/746.0, 598.0/746.0, false, techEntryGroup);
		descriptionRect = createRect(new Vector2(1089,598), (104.0 - 73.0)/1845.0, (509.0 - 264.0)/746.0, 598.0/746.0, false, techEntryGroup);
	
	
		titleStyle.fontSize = 0.030 * screenWidth;
		descriptStyle.fontSize = 0.022 * screenWidth;
	
		backgroundRect = RectFactory.NewRect(0,0,1,1);
		codexLabelRect = createRect(codexLabelTexture,0,0, 0.246, false);
		backButtonRect = createRect(backButtonTexture,0.81,0.022, 0.12, true);
		
		
		
	
		var startHex:Rect = createRect(fullCodex[0].icon,0,0, 0.4102, false);
		var startHexBG:Rect = createRect(hexBGTexture,0,0, 0.4667, false);
		
		startHex.x = startHexBG.width / 2 - startHex.width / 2;
		startHex.y = startHexBG.height / 2 - startHex.height / 2;
		
		currentNumOfCol = (screenWidth / startHex.width) + 2;
		
		var row:int = -1;
		
		for(var i:int = 0; i < fullCodex.Count; i++)
		{
			var col:int = i % currentNumOfCol;
			
			if(col == 0)
				row++;
			
		
			var tempHex:Rect = startHex;
			var tempHexBG:Rect = startHexBG;
			
			tempHex.x += (tempHexBG.width - (tempHexBG.width * hexDistancePercent)) * col;
			tempHexBG.x = (tempHexBG.width - (tempHexBG.width * hexDistancePercent)) * col;
			
			tempHex.y += row * tempHexBG.height;
			tempHexBG.y = row * tempHexBG.height;
			
			if(col % 2 == 1)
			{
				tempHex.y += tempHexBG.height / 2;
				tempHexBG.y += tempHexBG.height / 2;
			}
			
			hexRect.Add(tempHex);
			hexBGRect.Add(tempHexBG);
			
			if(!codices.Contains(fullCodex[i]))
			{
				hexCoverRect.Add(tempHexBG);
				notEarnedCodex.Add(fullCodex[i]);
			}
			else
				earnedCodex.Add(fullCodex[i]);
				
			totalCodex.Add(fullCodex[i]);
		}
		
	
		//i % 5 for width
		// if i % 5 = 0 , start of new row
		
		hexGroup = new Rect(0,codexLabelRect.height * 1.3,
				(startHexBG.width - (startHexBG.width * hexDistancePercent)) * (currentNumOfCol+1),
				(row + 2) * tempHexBG.height);
	
	
		originalYHexGroup = hexGroup.y;
	
		
		
		var codexLabelSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(codexLabelTexture, codexLabelHeight);
		//codexLabelRect = RectFactory.NewRect(.01,.01,codexLabelSize.x,codexLabelSize.y);
		
		
		
		var backButtonSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(backButtonTexture, backButtonHeight);
		/*
		backButtonRect = RectFactory.NewRect(1-sidePadding-backButtonSize.x, sidePadding, backButtonSize.x, backButtonSize.y);
		*/
		
		
		
		//var previousEntriesLabelSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredWidth(previousEntriesTexture, entryLabelMaxWidthPercent);
		
		//previousEntriesRect = RectFactory.NewRect(sidePadding*2,sidePadding,previousEntriesLabelSize.x, previousEntriesLabelSize.y);
		
		scrollViewWidth = 1-(2*sidePadding);
		scrollViewRect = RectFactory.NewRect(sidePadding,(2*sidePadding)+backButtonSize.y,scrollViewWidth, 1-(2*sidePadding)-backButtonSize.y);
		/*
		var areaAboveCodicies : float = previousEntriesLabelSize.y + (2*sidePadding);
		codicesRects = new List.<Rect>();
		var totalHeight : float = areaAboveCodicies;
		for (var codex : CodexEntry in codices){
			var topLeftX : float = sidePadding;
			var topLeftY : float = currentRow * (codicesHeight) + areaAboveCodicies;
			codicesRects.Add(RectFactory.NewRect(topLeftX,topLeftY,scrollViewWidth - (2*sidePadding),codicesHeight));
			totalHeight += codicesHeight;
			currentRow++;
		}
		
		scrollViewAreaRect = RectFactory.NewRect(0,0,scrollViewWidth, totalHeight);
		*/
	}
}