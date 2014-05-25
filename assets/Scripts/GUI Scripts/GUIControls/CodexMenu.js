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
	//public var codexLabelTexture : Texture2D;
	public var backButtonTexture : Texture2D;
	//public var backButtonTexturePressed : Texture2D;
	//public var previousEntriesTexture : Texture2D;
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
	//private var previousEntriesRect : Rect;
	private var backgroundRect : Rect;
	private var codicesRects : List.<Rect>;
	
	private var scrollViewWidth : float;
	private var FONTRATIOBUTTONS:float = 20; // kinda arbitrary
	
	private var mainView : boolean;
	
	public var skin:GUISkin;
	
	private var isHolding:boolean;
	private var startHolding:boolean;
	private var confirmHolding:boolean;
	
	private var startHex : Rect;
	private var startHexBG : Rect;
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
	
	private var instructionRect:Rect;
	
	private var returningFromTechView:boolean;
	
	// variables for confirmation to go to site
	private var showConfirmation : boolean = false;
	private var confirmationRect : Rect;
	private var confirmCancelRect : Rect;
	private var confirmContinueRect : Rect;
	private var confirmTextRect : Rect;
	
	public var infoBox:Texture;
	public var infoButton:Texture;
	//public var infoButtonPressed:Texture;
	
	public var zoomButton:Texture;
	private var zoomButtonRect:Rect;
	private var lastButtonZoom:boolean;
	private var maxZoom : float;
	private var minZoom : float;
	private var zoomFromButton : boolean; // indicates whether the zoom button was pressed or not
	
	private var style:GUIStyle = GUIStyle();
	
	private var fromScoreScreen:boolean = false;
	
	private var codexTitleST:ShadowedText;
	private var backButtonAB:AnimatedButton;
	private var zoomButtonAB:AnimatedButton;
	private var learnButtonAB:AnimatedButton;
	public var codexIcon:Texture;
	
	private var earnedST:ShadowedText;
	private var lockedST:ShadowedText;
	private var viewST:ShadowedText;
	
	
	public var showIcon:Texture;
	public var hideIcon:Texture;
	
	private var titleST:ShadowedText;
	private var descriptST:ShadowedText;
	
	
	public function Initialize(){
		super.Initialize();
		
		// setup confirmation window
		
		style.normal.textColor = Color.white;
		style.active.textColor = Color.white;
		style.hover.textColor = Color.white;
		style.font = descriptStyle.font;
		style.wordWrap = true;
		style.fontSize = Mathf.Min(Screen.width, Screen.height) * 0.035 * 0.9;		
		style.alignment = TextAnchor.MiddleCenter;
		
		confirmationRect = Rect(.3 * Screen.width, .3 * Screen.height, .4*Screen.width, .4* Screen.height);
		confirmCancelRect = Rect(confirmationRect.x + (.1 * confirmationRect.width), confirmationRect.y + .7 * confirmationRect.height - padding,
								confirmationRect.width * .3, confirmationRect.height * .3);
		confirmContinueRect = Rect((confirmationRect.x + confirmationRect.width) - ((.1 * confirmationRect.width) + confirmCancelRect.width), confirmCancelRect.y, confirmCancelRect.width, confirmCancelRect.height);
		
		
		displayUnlocked = true;
		displayLocked = true;
		doNotRender = false;
		
		returningFromTechView = false;
		
		codices = new List.<CodexEntry>();
		
		if(!fromScoreScreen)
			mainView = true;
		else
			mainView = false;
		isHolding = false;
		startHolding = false;
		confirmHolding = false;
		firstPass = false;
		checkDelta = 0;
		zooming = false;
		
		currentLockedTexture = showIcon;
		currentUnlockedTexture = showIcon;
		
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
		
		//UpdateST
    	codexTitleST = new ShadowedText("Codex", codexStyle, codexIcon);
		
		instructionRect = createRect(Vector2(500, 60), 0,0, 60/1080, false);
		instructionRect.x = padding * 2;
		instructionRect.y = screenHeight - (instructionRect.height + padding * 2);
		
		zoomButtonRect = createRect(zoomButton, 0,0,0.1, false);
    	zoomButtonRect.x = Screen.width - zoomButtonRect.width - padding;
    	zoomButtonRect.y = Screen.height / 2 - zoomButtonRect.height / 2;
    	
    	backButtonRect = createRect(backButtonTexture,0.81,0.022, 0.12, true);
    	backButtonAB  = new AnimatedButton(Color.blue, backButtonTexture, backButtonRect);
    	zoomButtonAB  = new AnimatedButton(Color.blue, zoomButton, zoomButtonRect);
    	learnButtonAB  = new AnimatedButton(Color.green, learnMoreButton , learnMoreRect, Vector2(techEntryGroup.x, techEntryGroup.y));
    	
    	var viewRect:Rect;
    	var labelRect:Vector2;
    	
    	labelRect = style.CalcSize(GUIContent("View:"));
    	viewRect = Rect(padding, codexTitleST.displayRect.height + codexTitleST.displayRect.y + padding, labelRect.x, labelRect.y);
    	
    	viewStyle.fontSize = 0.03 * screenWidth;
    	
    	viewST = new ShadowedText("View:", viewRect, viewStyle, false);
    	
    	earnedIconRect = createRect(showIcon, 0,0, 0.085, false);
    	earnedIconRect.x = padding;
    	earnedIconRect.y = viewST.displayRect.y + viewST.displayRect.height + padding * 2;
    	lockedIconRect = Rect(earnedIconRect.x, earnedIconRect.y + earnedIconRect.height + padding, earnedIconRect.width, earnedIconRect.height);
    
    	
    	
    	labelRect = style.CalcSize(GUIContent("Earned"));
    	viewRect = new Rect(viewRect.x + earnedIconRect.width, earnedIconRect.y + (labelRect.y/2), labelRect.x, labelRect.y);
    	
    	earnedST = new ShadowedText("Earned", viewRect, viewStyle, false);
    	SetupRectangles();
    	
    	labelRect = style.CalcSize(GUIContent("Locked"));
    	viewRect = new Rect(viewRect.x, lockedIconRect.y + (labelRect.y/2), labelRect.x, labelRect.y);
    	
    	lockedST = new ShadowedText("Locked", viewRect, viewStyle, false);
       	
		wholeEarned = Rect(earnedIconRect.x, earnedIconRect.y, earnedIconRect.width + earnedST.displayRect.width, earnedIconRect.height + earnedST.displayRect.height);
		wholeLocked = Rect(lockedIconRect.x, lockedIconRect.y, lockedIconRect.width + lockedST.displayRect.width, lockedIconRect.height + lockedST.displayRect.height);
		
		
		titleST = new ShadowedText("", Rect(0,0,0,0), titleStyle, false);
		descriptST = new ShadowedText("", Rect(0,0,0,0), descriptStyle, false);
    	
	}
	
	private var earnedIconRect:Rect;
	private var lockedIconRect:Rect;
	private var wholeEarned:Rect;
	private var wholeLocked:Rect;
	
	
	public function OnOpen(){
		super.OnOpen();
	} 
	
	private function HoldWait()
	{
		//Debug.Log("waiting");
		//yield WaitForSeconds(0.07);
		
		if (startHolding && (Input.GetKey(KeyCode.Mouse0) || Input.touchCount > 0))
		{
			if(Input.GetKey(KeyCode.Mouse0))
			{
				lastMousePos = Input.mousePosition;
				useMouse = true;
			}
			else
				useMouse = false;
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
	private var originalXHexGroup:float;
	private var startMousePosition:Vector2;
	private var startTapPosition:Vector2;
	private var checkDelta : int;
	private var firstPass:boolean = false;

	//Zooming
	private var zooming:boolean = false;
	private var touchZoom:boolean = false;
	private var tapDistance:float;
	private var zoomIn:boolean = false;
	private var minZoomDistance:float = 10.0;
	
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
			else if (!zoomFromButton)
				zooming = false;
		
			if(!zooming)
			{
			
				//To check if the user is holding down in order to drag
				if (!startHolding && (Input.GetKey(KeyCode.Mouse0) || Input.touchCount > 0))
				{
					//Debug.Log("Input detected");
					startHolding = true;
					confirmHolding = false;
					HoldWait();		
					
				}
				else if(startHolding && !confirmHolding)
				{
					var changeTest:Vector2;
				
					if(useMouse)
					{
						changeTest = Input.mousePosition - lastMousePos;
						lastMousePos = Input.mousePosition;
					}
					else
					{
						if (Input.touchCount > 0)
							changeTest = Input.touches[0].deltaPosition;
					}
					
					// Sees if the player has moved the minimum distance
					if((Mathf.Abs(changeTest.x) > 1) || (Mathf.Abs(changeTest.y) > 1))
					{
						startHolding = true;
						confirmHolding = true;
						isHolding = true;
						released = false;
					}
						
				}


				if (startHolding && (!Input.GetKey(KeyCode.Mouse0) && Input.touchCount <= 0))
				{
					startHolding = false;
					isHolding  = false;
					confirmHolding = false;
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
					else if(hexGroup.xMin > originalXHexGroup)
					{
						hexGroup.x = originalXHexGroup;
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
			
				var enactZoom:boolean = true;
				
				if (zoomFromButton)
				{
					zoomIn = !lastButtonZoom;
				}
				// If there is a scroll wheel to take input from...
				else if(Input.GetAxis("Mouse ScrollWheel") != 0)
				{
					if(Input.GetAxis("Mouse ScrollWheel") > 0)
						zoomIn = true;
					else if(Input.GetAxis("Mouse ScrollWheel") < 0)
						zoomIn = false;
					else
						enactZoom = false;
				}
				// If there are two fingers on the screen, use that for zooming
				else if(Input.touchCount >= 2)
				{
					if(touchZoom)
					{
						//If both fingers have moved:
						if(Input.touches[0].phase == TouchPhase.Moved && Input.touches[1].phase == TouchPhase.Moved)
						{
							var newDistance:float = Vector2.Distance(Input.touches[0].position, Input.touches[1].position);
							
							// If both fingers have moved more than the minimum distance
							if(minZoomDistance <= Mathf.Abs(tapDistance - newDistance))
							{
								if(tapDistance > newDistance)
									zoomIn = false;
								else
									zoomIn = true;
							}
							// If fingers didn't move more than the min distance:
							else
								enactZoom = false;
									
							tapDistance = Vector2.Distance(Input.touches[0].position, Input.touches[1].position);
								
						}
						// If fingers didn't move last phase:
						else
							enactZoom = false;
					}
					else
					{
						touchZoom = true;
						tapDistance = Vector2.Distance(Input.touches[0].position, Input.touches[1].position);
					}
								
				}
				// If there is no input to recieve from
				else
				{
					touchZoom = false;
					enactZoom = false;
				}
			
			
				if(enactZoom)
				{
					//if(zoomIn && hexGroup.width < Screen.width * 2)
					//if(zoomIn && (currentNumOfCol > 3))
					
					if (zoomFromButton && (hexGroup.width >= 2000 || hexGroup.width <= 900))
					{
						enactZoom = false;
						zoomFromButton = false;
						if (hexGroup.width >= 2000)
							recalculateRectForHexes(.99);
						else
							recalculateRectForHexes(1.01);
					}
					else if(zoomIn && (hexGroup.width < 2000))
					{
						//if(currentNumOfCol > 3)
							//currentNumOfCol--;
						/*if(touchZoom)
							recalculateRectForHexes(tapDistance);
						else
						{
							var change1:float = 1f + Mathf.Abs(Input.GetAxis("Mouse ScrollWheel"));
							if(change1 > 1.3)
								change1 = 1.3;
							recalculateRectForHexes(change1);
						}
						*/	
						recalculateRectForHexes(1.01);
						
						//hexGroup.width = hexGroup.width * 1.1;
						//hexGroup.height = hexGroup.height * 1.1;
					}
					//else if(!zoomIn && hexGroup.width > Screen.width * 0.9)
					//else if(!zoomIn && (currentNumOfCol < 11))
					else if(!zoomIn && (hexGroup.width > 900))
					{
						/*
						if(touchZoom)
							recalculateRectForHexes(1f / tapDistance);
						else
						{
							var change2:float = Mathf.Abs(Input.GetAxis("Mouse ScrollWheel"));
							if(change2 < 0.5)
								change2 = 0.5;
							recalculateRectForHexes(change2);
						}
						*/
					
						//if(currentNumOfCol < 11)
							//currentNumOfCol++;
						recalculateRectForHexes(0.99);
						//hexGroup.width = hexGroup.width * 0.9;
						//hexGroup.height = hexGroup.height * 0.9;
					}
				}
			}
		}
	
		//GUI.DrawTexture(backgroundRect, backgroundTexture);
		AnimatedBackground(backgroundTexture);
		
		if(mainView)
		{
			RenderMain();
		}
		else
		{
			RenderEntry();
		}
		
		
		// Header:
		//GUI.DrawTexture(codexLabelRect, codexLabelTexture);
		codexTitleST.Display();
		//setButtonTexture(backButtonTexture, backButtonTexturePressed);
		
		if(showConfirmation)
				GUI.enabled = false;

		//if(GUI.Button(backButtonRect, ""))
		if(backButtonAB.Render())
		{
			if(!isHolding)
			{
				if(mainView)
				{
					currentResponse.type = EventTypes.LEVELSELECT;
				}
				else
				{
					if(!fromScoreScreen)
						mainView = true;
					else
						currentResponse.type = EventTypes.SCORESCREEN;
				}
			}
		}
		
		//if(GUI.Button(zoomButtonRect, zoomButton))
		if(mainView && zoomButtonAB.Render())
		{
			zoomFromButton = true;
			lastButtonZoom = !lastButtonZoom;
			zooming = true;
		}
		
		if(showConfirmation)
				GUI.enabled = true;
		
		//resetButtonTexture();
		
		
		//	ANDROID BACK BUTTON
		if(returningFromTechView)
			returningFromTechView = false;
		else if(Input.GetKeyUp(KeyCode.Escape))
		{
			if(!isHolding)
			{
				if(!returningFromTechView && mainView)
				{
					currentResponse.type = EventTypes.LEVELSELECT;
				}
				else
				{
					mainView = true;
					returningFromTechView = true;
				}
			}
		}
		
		if (showConfirmation)
		{
			RenderConfirmationWindow();
		}

	}//end of render
	
	private function recalculateRectForHexes(percentage:float)
	{
		var addedWidth:float = hexBGRect[0].width;
		var addedHeight:float = hexBGRect[0].height;
		
		for(var i:int = 0; i < fullCodex.Count; i++)
		{
			hexBGRect[i] = Rect(hexBGRect[i].x * percentage, hexBGRect[i].y * percentage, hexBGRect[i].width * percentage, hexBGRect[i].height * percentage);
			hexRect[i] = Rect(hexRect[i].x * percentage, hexRect[i].y * percentage, hexRect[i].width * percentage, hexRect[i].height * percentage);	
		}
		for(var j:int = 0; j < hexCoverRect.Count; j++)
		{
			hexCoverRect[j] = Rect(hexCoverRect[j].x * percentage, hexCoverRect[j].y * percentage, hexCoverRect[j].width * percentage, hexCoverRect[j].height * percentage);
		}
		
		addedWidth = -1 * (hexBGRect[0].width - addedWidth) * (currentNumOfCol / 9);
		addedHeight = -1 * (hexBGRect[0].height - addedHeight) * (totalRows / 5);
		
		//currentNumOfCol = (screenWidth / hexRect[0].width) + 2;
		//reArrangeHexTiles(percentage);
		/*
		hexGroup = new Rect(hexGroup.x + addedWidth,
				hexGroup.y + addedHeight,
				(hexBGRect[0].width - (hexBGRect[0].width * hexDistancePercent)) * (currentNumOfCol + 1),
				(totalRows + 2) * hexBGRect[0].height);
		*/		
		hexGroup = new Rect(earnedST.displayRect.x + earnedST.displayRect.width,
				viewST.displayRect.y,
				(hexBGRect[0].width - (hexBGRect[0].width * hexDistancePercent)) * (currentNumOfCol + 1),
				(totalRows + 2) * hexBGRect[0].height);
				
	}
	
	private var currentNumOfCol:int = 7; // originally 5
	private function reArrangeHexTiles(percentage:float)
	{
		/*if (hexRect.Count <= 0 || hexBGRect.Count <= 0)
			return;*/
		
		var firstHex:Rect;// = hexRect[0];
		var firstHexBG:Rect;// = hexBGRect[0];
		
		if (hexRect.Count > 0)
		{
			firstHex = hexRect[0];
			firstHexBG = hexBGRect[0];
		}
		else
		{
			firstHex = startHex;
			firstHexBG = startHexBG;
		}
		
		var row:int = -1;
		
		hexCoverRect.Clear();
		hexBGRect.Clear();
		hexRect.Clear();
	
		for(var i:int = 0; i < fullCodex.Count; i++)
		{
			var col:int = i % currentNumOfCol;
			
			if(col == 0)
				row++;
			
		
			var tempHex:Rect = firstHex;
			var tempHexBG:Rect = firstHexBG;
			
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
				for(var i:int = 0; i < fullCodex.Count && i < hexBGRect.Count; i++)
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
		
		viewST.Display();
    	earnedST.Display();
    	lockedST.Display();
    	GUI.DrawTexture(earnedIconRect, currentUnlockedTexture);
    	GUI.DrawTexture(lockedIconRect, currentLockedTexture);
		
		//GUI.BeginGroup(displayBox);
			//GUI.skin.label.alignment = TextAnchor.UpperCenter;
			//GUI.Label(displayLabel, "SHOW:");
			//GUI.skin.label.alignment = TextAnchor.UpperLeft;
			//GUI.DrawTexture(displayUnlockedRect, currentUnlockedTexture, ScaleMode.StretchToFill);
			//GUI.DrawTexture(displayLockedRect, currentLockedTexture, ScaleMode.StretchToFill);
			
							
			if(GUI.Button(wholeEarned,""))
			{
				doNotRender = false;
				if(displayUnlocked)
				{
					currentUnlockedTexture = hideIcon;					
					if(displayLocked)
						fullCodex = notEarnedCodex;
					else
						doNotRender = true;
				}
				else
				{
					currentUnlockedTexture = showIcon;					
					if(displayLocked)
						fullCodex = totalCodex;
					else
						fullCodex = earnedCodex;
				}
				
				displayUnlocked = !displayUnlocked;
				//recalculateRectForHexes(1.0);
				reArrangeHexTiles(1.0);
			}
			
			if(GUI.Button(wholeLocked,""))
			{
				doNotRender = false;
				if(displayLocked)
				{
					currentLockedTexture = hideIcon;					
					if(displayUnlocked)
						fullCodex = earnedCodex;
					else
						doNotRender = true;
					
				}
				else
				{
					currentLockedTexture = showIcon;
					if(displayUnlocked)
						fullCodex = totalCodex;
					else
						fullCodex = notEarnedCodex;
				}
				
				displayLocked = !displayLocked;
				//recalculateRectForHexes(1.0);
				reArrangeHexTiles(1.0);
			}
			
		//GUI.EndGroup();
		
		GUI.skin.label.alignment = TextAnchor.LowerLeft;
		GUI.Label(instructionRect,"Pinch to zoom.", descriptStyle);
		GUI.skin.label.alignment = TextAnchor.UpperLeft;
		
	}
	
	private var techEntryGroup:Rect;
	private var awardBGRect:Rect;
	public var awardBGTexture:Texture;
	private var techIconRect:Rect;
	public var infoBoxTexture:Texture;
	private var infoBoxRect:Rect;
	public var learnMoreButton:Texture;
	//public var learnMoreButtonPressed:Texture;
	private var learnMoreRect:Rect;
	private var titleRect:Rect;
	private var descriptionRect:Rect;
	
	public var titleStyle:GUIStyle;
	public var descriptStyle:GUIStyle;
	private var totalRows:int;
	
	public var viewStyle:GUIStyle;
	
	public var codexStyle:GUIStyle;
	
	private function RenderEntry()
	{
		GUI.BeginGroup(techEntryGroup);
		
		
			GUI.DrawTexture(infoBoxRect, infoBoxTexture, ScaleMode.StretchToFill);
			//GUI.Label(titleRect, currentEntry.name, titleStyle);
			titleST.Display(currentEntry.name, titleRect);
			
			//GUI.Label(descriptionRect, currentEntry.description, descriptStyle);
			descriptST.Display(currentEntry.description, descriptionRect);
			
		
			GUI.DrawTexture(awardBGRect, awardBGTexture, ScaleMode.StretchToFill);
			GUI.DrawTexture(techIconRect, currentEntry.icon, ScaleMode.StretchToFill);
			
			
			if(showConfirmation)
				GUI.enabled = false;
			
			//setButtonTexture(learnMoreButton, learnMoreButtonPressed);
			//if(GUI.Button(learnMoreRect, ""))
			if(learnButtonAB.Render())
			{
				//Application.OpenURL(currentEntry.urlLink);
				showConfirmation = true;
			}
			//resetButtonTexture(style);
			
			if(showConfirmation)
				GUI.enabled = true;
			
			
			
		GUI.EndGroup();
	}
	
	private var currentRow : int;
	public function SetupRectangles()
	{
	
		displayBox = createRect(new Vector2(369.0,218.0),1083.0/1920.0, 27.0/1080.0, 218.0/1080.0, true);
		displayLabel = createRect(new Vector2(320.0,65.0), 0,0, 65.0/218.0, false, displayBox);
		
		displayLabel.x = displayBox.width / 2 - displayLabel.width / 2;
		
		displayUnlockedRect = createRect(showUnlockedButton,1.0/369.0, 69.0/218.0, 140.0/218.0, false, displayBox);
		displayLockedRect  = createRect(showLockedButton,208.0/369.0, 69.0/218.0, 140.0/218.0, false, displayBox);
		
		
		techEntryGroup = createRect(new Vector2(1845,746),73.0/1920.0, 264.0/1080.0, 746.0/1080.0, true);
		awardBGRect = createRect(awardBGTexture,(1201.0 - 73.0)/1845.0, (264.0 - 264.0)/746.0, 637.0/746.0, false, techEntryGroup);
		techIconRect = createRect(fullCodex[0].icon,(1254.0 - 73.0)/1845.0, (342.0 - 264.0)/746.0, 481.0/746.0, false, techEntryGroup);
		infoBoxRect = createRect(infoBoxTexture,(73.0 - 73.0)/1845.0, (338.0 - 264.0)/746.0, 672.0/746.0, false, techEntryGroup);
		learnMoreRect = createRect(learnMoreButton,(144.0 - 73.0)/1845.0, (834.0 - 264.0)/746.0, 107.0/746.0, false, techEntryGroup);
		
		titleRect = createRect(new Vector2(1089,598), (104.0 - 73.0)/1845.0, (369.0 - 280.0)/746.0, 598.0/746.0, false, techEntryGroup);
		descriptionRect = createRect(new Vector2(1089,598), (104.0 - 73.0)/1845.0, (509.0 - 264.0)/746.0, 598.0/746.0, false, techEntryGroup);
	
	
		titleStyle.fontSize = 0.030 * screenWidth;
		descriptStyle.fontSize = 0.022 * screenWidth;
	
		backgroundRect = RectFactory.NewRect(0,0,1,1);
		//codexLabelRect = createRect(codexLabelTexture,0,0, 0.246, false);
		
	
		startHex = createRect(fullCodex[0].icon,0,0, 0.4102, false);
		startHexBG = createRect(hexBGTexture,0,0, 0.4667, false);
		
		startHex.x = startHexBG.width / 2 - startHex.width / 2;
		startHex.y = startHexBG.height / 2 - startHex.height / 2;
		
		//currentNumOfCol = (screenWidth / startHex.width) + 2;
		currentNumOfCol = fullCodex.Count / 2;
		
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
		
		/*
		hexGroup = new Rect(0,codexLabelRect.height * 1.3,
				(startHexBG.width - (startHexBG.width * hexDistancePercent)) * (currentNumOfCol+1),
				(row + 2) * tempHexBG.height);
		*/		
		
		hexGroup = new Rect(earnedST.displayRect.x + earnedST.displayRect.width,
				viewST.displayRect.y,
				(startHexBG.width - (startHexBG.width * hexDistancePercent)) * (currentNumOfCol+1),
				(row + 2) * tempHexBG.height);
		
		totalRows = row;
	
	
		originalYHexGroup = hexGroup.y;
		originalXHexGroup = hexGroup.x;
	
		
		
		//var codexLabelSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(codexLabelTexture, codexLabelHeight);
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
	
	public function takeToCodexEntry(entry:CodexEntry)
	{
		currentEntry = entry;
		mainView = false;
		fromScoreScreen = true;
	}
	
	private function RenderConfirmationWindow()
	{		
		setButtonTexture(infoBox, infoBox, style);
		GUI.Box(confirmationRect, "Continue to technology website?", style);
		setButtonTexture(infoButton, infoButton, style);
		if (GUI.Button(confirmCancelRect, "Cancel", style))
		{
			showConfirmation = false;
		}
		if (GUI.Button(confirmContinueRect, "Continue", style))
		{
			//MetricContainer.IncrementSessionSiteClicks(); -- this line is causing an error
			Application.OpenURL(currentEntry.urlLink);
			showConfirmation = false;
		}
		//resetButtonTexture(style);
	}
}