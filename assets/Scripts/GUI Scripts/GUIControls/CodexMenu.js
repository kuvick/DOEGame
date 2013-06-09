/**********************************************************
codicesMenu.js

Author: Jared Mavis
**********************************************************/

#pragma strict

import System.Collections.Generic;

public class CodexMenu extends GUIControl{
	public var inBetweencodicesSpace : float = .02f;
	public var sidePadding : float = .05f;
	public var codicesPerRow : int = 6;
	public var codicesHeight : float = .4f;
	private var codices : List.<CodexEntry>;
	
	private var rowWidth : float;
	private var codexWidth : float;
	private var spacesPerRow : int; // the number of spaces between each contact
	
	// Building Menu animation
	private var isScrolling:boolean = false;
	private var numPages:int = 0;
	private var currentPage:float = 0;
	private var targetPage:float = 0;
	private var scrollTimer:float = 0;
	private var scrollSpeed:float = 1;				// Time in seconds to complete 1 scroll.
	private var leftScrollVisible:boolean = false;
	private var rightScrollVisible:boolean = true;
	
	public function Initialize(){
		super.Initialize();
		rowWidth = 1 - (2 * sidePadding); // fill up the width with codices
		spacesPerRow = codicesPerRow - 1;
		codexWidth = ((rowWidth - (spacesPerRow * inBetweencodicesSpace)) / codicesPerRow);
		codices = CodexData.Instance().codices;
	}
	
	public function OnOpen(){
		super.OnOpen();
	} 
	
	private var currentRow : int;
	private var currentCol : int;
	private var scrollPosition : Vector2;
	public function Render(){		
		currentRow = 0;
		currentCol = 0;
		scrollPosition = GUILayout.BeginScrollView (scrollPosition, false, true,
									GUILayout.Width (ScreenSettingsManager.screenWidth), 
									GUILayout.Height (ScreenSettingsManager.screenHeight));
		
		for (var codex : CodexEntry in codices){
			var topLeftX : float = currentCol * (codexWidth + inBetweencodicesSpace);
			var topLeftY : float = currentRow * (codicesHeight + inBetweencodicesSpace);
			topLeftX += sidePadding;
			topLeftY += sidePadding;
			if (codex.isUnlocked){
				GUI.color = Color(1,1,1, 1);
				if (GUILayout.Button(codex.name)){
					if (codex.urlLink != null && codex.urlLink != ""){
						Application.OpenURL(codex.urlLink);
					} else {
						Debug.LogError("No url set for " + codex.name);
					}
				}
			} else {
				GUI.color = Color(1,1,1, .5);
				GUILayout.Box(codex.name);
			}
			currentCol++;
			if (currentCol == codicesPerRow){
				currentCol = 0;
				currentRow++;
			}
		}
		GUILayout.EndScrollView ();
	}
	
	public function Update(){
		//This will scroll the icons until the current page matches the target page		
		/*if (targetPage != currentPage){
			scrollTimer += Time.deltaTime;
			currentPage = Mathf.Lerp(currentPage, targetPage, scrollTimer/scrollSpeed);
			buildingGroup.x = screenWidth * -currentPage;
			
			if (targetPage == currentPage){
				isScrolling = false;
				scrollTimer = 0;
			}
		}*/
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
		
		if (numPages <= 1){
			leftScrollVisible = false;
			rightScrollVisible = false;
		}else if (targetPage == 0 && numPages > 1){
			leftScrollVisible = false;
			rightScrollVisible = true;
		}else if (targetPage != 0 && targetPage == numPages - 1){
			leftScrollVisible = true;
			rightScrollVisible = false;
		}else{
			leftScrollVisible = true;
			rightScrollVisible = true;
		}
	}
}