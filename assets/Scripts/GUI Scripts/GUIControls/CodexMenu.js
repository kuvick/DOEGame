/**********************************************************
codicesMenu.js

Author: Jared Mavis
**********************************************************/

#pragma strict

import System.Collections.Generic;

public class CodexMenu extends GUIControl{
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
	
	public function Initialize(){
		super.Initialize();
		
		codices = new List.<CodexEntry>();
		mainView = true;
		isHolding = false;
		startHolding = false;
		
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
		yield WaitForSeconds(0.1);
		
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
		yield WaitForSeconds(0.1);
		released = true;
	}

	private var scrollPosition : Vector2;
	private var lastMousePos: Vector2;
	private var useMouse:boolean;
	private var originalYHexGroup:float;
	public function Render()
	{	
		GUI.skin = skin;
		
		if(mainView)
		{
			//To check if the user is holding down in order to drag
			if (!startHolding && (Input.GetKey(KeyCode.Mouse0) || Input.touchCount > 0))
			{
				//Debug.Log("Input detected");
				startHolding = true;
				HoldWait();
			}
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
			
			
		GUI.EndGroup();
	}
	
	private function RenderEntry()
	{
		
	}
	
	
	private var currentRow : int;
	public function SetupRectangles()
	{
		backgroundRect = RectFactory.NewRect(0,0,1,1);
		codexLabelRect = createRect(codexLabelTexture,0,0, 0.246, false);
		backButtonRect = createRect(backButtonTexture,0.81,0.022, 0.12, true);
		
		
		
	
		var startHex:Rect = createRect(fullCodex[0].icon,0,0, 0.4102, false);
		var startHexBG:Rect = createRect(hexBGTexture,0,0, 0.4667, false);
		
		startHex.x = startHexBG.width / 2 - startHex.width / 2;
		startHex.y = startHexBG.height / 2 - startHex.height / 2;
		
		var row:int = -1;
		
		for(var i:int = 0; i < fullCodex.Count; i++)
		{
			var col:int = i % 5;
			
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
				(startHexBG.width - (startHexBG.width * hexDistancePercent)) * 6,
				(row + 2) * tempHexBG.height);
	
	
		originalYHexGroup = hexGroup.y;
	
		
		
		var codexLabelSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(codexLabelTexture, codexLabelHeight);
		//codexLabelRect = RectFactory.NewRect(.01,.01,codexLabelSize.x,codexLabelSize.y);
		
		
		
		var backButtonSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(backButtonTexture, backButtonHeight);
		/*
		backButtonRect = RectFactory.NewRect(1-sidePadding-backButtonSize.x, sidePadding, backButtonSize.x, backButtonSize.y);
		*/
		
		
		
		var previousEntriesLabelSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredWidth(previousEntriesTexture, entryLabelMaxWidthPercent);
		
		previousEntriesRect = RectFactory.NewRect(sidePadding*2,sidePadding,previousEntriesLabelSize.x, previousEntriesLabelSize.y);
		
		scrollViewWidth = 1-(2*sidePadding);
		scrollViewRect = RectFactory.NewRect(sidePadding,(2*sidePadding)+backButtonSize.y,scrollViewWidth, 1-(2*sidePadding)-backButtonSize.y);
		
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
	}
}