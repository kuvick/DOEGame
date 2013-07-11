/**********************************************************
ContactsMenu.js

Author: Jared Mavis
**********************************************************/

#pragma strict

import System.Collections.Generic;


public class ContactsMenu extends GUIControl{
	public var sidePadding : float = .05f;
	public var inBetweenContactsSpace : float = .02f;
	public var contactsPerRow : int = 6;
	public var backButtonHeight : float = .1;
	
	public var playerData : SaveSystem; // should be player class
	
	private var contacts : List.<Contact>;
	private var contactPortraits : List.<Texture2D>;
	
	public static var currentContact : Contact;
	
	public var backButtonTexture : Texture2D;
	public var backgroundTexture : Texture2D;
	public var scrollViewbackgroundTexture : Texture2D;
	
	private var rowWidth : float;
	private var contactWidth : float;
	private var spacesPerRow : int; // the number of spaces between each contact
	private var scrollViewWidth : float;
	private var backButtonRect : Rect;
	private var scrollViewRect : Rect;
	private var scrollViewAreaRect : Rect;
	private var backgroundRect : Rect;
	private var cotactsRects : List.<Rect>;
	
	public function Initialize(){
		super.Initialize();
		
		if (playerData == null){
			Debug.LogWarning("IntelSystem does not have a reference to the SaveSystem. Attempting to find");
			playerData = GameObject.Find("Player Data").GetComponent(SaveSystem) as SaveSystem;
			if (playerData == null){
				Debug.LogError("Could not find SaveSystem");
			}
		}
		
		rowWidth = 1 - (2 * sidePadding); // fill up the width with contacts
		spacesPerRow = contactsPerRow - 1;
		contactWidth = ((rowWidth - (spacesPerRow * inBetweenContactsSpace)) / contactsPerRow);
		contacts = playerData.currentPlayer.contactData.contacts;
		SetupRectangles();
	}
	
	private var scrollPosition : Vector2;
	public function Render(){		
		currentRow = 0;
		currentCol = 0;
		GUI.DrawTexture(backgroundRect, backgroundTexture);
		GUI.DrawTexture(backButtonRect, backButtonTexture);
		
		scrollPosition = GUI.BeginScrollView (scrollViewRect, scrollPosition, scrollViewAreaRect, true, true);
		
		GUI.Box(scrollViewAreaRect, "");
		var index : int = 0;
		for (var contact : Contact in contacts){
			if (contact.isUnlocked){
				if (GUI.Button(cotactsRects[index], contactPortraits[index])){
					//currentContact = contact;
					//currentResponse.type = EventTypes.CONTACTINPECTIONMENU;
				}
			} else {
				GUI.Box(cotactsRects[index], contactPortraits[index]);
			}
			index++;
		}
		GUI.EndScrollView ();
	}
	
	private var currentRow : int;
	private var currentCol : int;
	public function SetupRectangles(){
		backgroundRect = RectFactory.NewRect(0,0,1,1);

		var backButtonSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(backButtonTexture, backButtonHeight);
		backButtonRect = RectFactory.NewRect(1-sidePadding-backButtonSize.x, sidePadding, backButtonSize.x, backButtonSize.y);
		
		scrollViewWidth = 1-(2*sidePadding);
		scrollViewRect = RectFactory.NewRect(sidePadding,(2*sidePadding)+backButtonSize.y,scrollViewWidth, 1-(2*sidePadding)-backButtonSize.y);

		var totalHeight : float = 0;
		cotactsRects = new List.<Rect>();
		contactPortraits = new List.<Texture2D>();

		contactWidth = (scrollViewWidth - ((contactsPerRow - 1) * inBetweenContactsSpace)) / contactsPerRow;
		
		var contactSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredWidth(contacts[0].GetPortraitTexture(), contactWidth);
		currentRow = 0;
		currentCol = 0;
		for (var contact : Contact in contacts){
			var topLeftX : float = currentCol * (contactSize.x + inBetweenContactsSpace);
			var topLeftY : float = currentRow * (contactSize.y + inBetweenContactsSpace);
			cotactsRects.Add(RectFactory.NewRect(topLeftX,topLeftY,contactSize.x,contactSize.y));
			
			contactPortraits.Add(contact.GetPortraitTexture());
			
			currentCol++;
			if (currentCol == contactsPerRow){
				currentCol = 0;
				currentRow++;
				totalHeight += contactSize.y;
			}
		}
		
		scrollViewAreaRect = RectFactory.NewRect(0,0,scrollViewWidth, totalHeight);
	}
}