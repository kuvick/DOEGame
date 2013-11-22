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
	
	private var codices : List.<CodexEntry>;
	
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
	
	public function Initialize(){
		super.Initialize();
		
		codices = new List.<CodexEntry>();
		
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
		
		
		SetupRectangles();
	}
	
	public function OnOpen(){
		super.OnOpen();
	} 
	
	private var scrollPosition : Vector2;
	public function Render(){		
		GUI.DrawTexture(backgroundRect, backgroundTexture);
		GUI.DrawTexture(codexLabelRect, codexLabelTexture);
		if (GUI.Button(backButtonRect, backButtonTexture)){
			currentResponse.type = EventTypes.LEVELSELECT;
		}
		
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
		GUI.EndScrollView ();
	}
	
	private var currentRow : int;
	public function SetupRectangles(){
		backgroundRect = RectFactory.NewRect(0,0,1,1);
		
		var codexLabelSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(codexLabelTexture, codexLabelHeight);
		codexLabelRect = RectFactory.NewRect(.01,.01,codexLabelSize.x,codexLabelSize.y);
		
		var backButtonSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(backButtonTexture, backButtonHeight);
		backButtonRect = RectFactory.NewRect(1-sidePadding-backButtonSize.x, sidePadding, backButtonSize.x, backButtonSize.y);
		
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