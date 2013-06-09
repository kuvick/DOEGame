/**********************************************************
ContactsMenu.js

Author: Jared Mavis
**********************************************************/

#pragma strict

import System.Collections.Generic;


public class ContactsMenu extends GUIControl{
	public var inBetweenContactsSpace : float = .02f;
	public var sidePadding : float = .05f;
	public var contactsPerRow : int = 6;
	public var contactsHeight : float = .4f;
	private var contacts : List.<Contact>;
	
	public static var currentContact : Contact;
	
	private var rowWidth : float;
	private var contactWidth : float;
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
		rowWidth = 1 - (2 * sidePadding); // fill up the width with contacts
		spacesPerRow = contactsPerRow - 1;
		contactWidth = ((rowWidth - (spacesPerRow * inBetweenContactsSpace)) / contactsPerRow);
		contacts = ContactData.Instance().contacts;
	}
	
	public function OnOpen(){
		super.OnOpen();
	} 
	
	private var currentRow : int;
	private var currentCol : int;
	public function Render(){		
		currentRow = 0;
		currentCol = 0;
		for (var contact : Contact in contacts){
			if (contact.portrait == null) continue;
			var topLeftX : float = currentCol * (contactWidth + inBetweenContactsSpace);
			var topLeftY : float = currentRow * (contactsHeight + inBetweenContactsSpace);
			topLeftX += sidePadding;
			topLeftY += sidePadding;
			if (contact.isUnlocked){
				GUI.color = Color(1,1,1, 1);
				if (GUI.Button(RectFactory.NewRect(topLeftX, topLeftY, contactWidth, contactsHeight), contact.portrait)){
					currentContact = contact;
					currentResponse.type = EventTypes.CONTACTINPECTIONMENU;
				}
			} else {
				GUI.color = Color(1,1,1, .5);
				if (GUI.Button(RectFactory.NewRect(topLeftX, topLeftY, contactWidth, contactsHeight), contact.portrait)){
					currentContact = contact;
					currentResponse.type = EventTypes.CONTACTINPECTIONMENU;
				}
			}
			currentCol++;
			if (currentCol == contactsPerRow){
				currentCol = 0;
				currentRow++;
			}
		}
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