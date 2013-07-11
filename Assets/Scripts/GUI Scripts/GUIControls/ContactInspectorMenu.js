/**********************************************************
ContactsMenu.js

Author: Jared Mavis
**********************************************************/

#pragma strict

public class ContactInspectorMenu extends GUIControl{
	public var contactStyle : GUIStyle;
	public var sidePadding : float = .15f;
	public var internalPadding : float = .1f;
	public var portraitPercentage : float = .4f;
	public var infoPercentage : float = .6f;
	public var backButtonHeight : float = .1;
	public var backButtonTexture : Texture2D;
	private var currentContact : Contact;
	private var currentContactPortrait : Texture2D;
	
	private var mainRect : Rect;
	private var portraitRect : Rect;
	private var desriptionRect : Rect;
	private var backButtonRect : Rect;
	private var mainRectWidth : float;
	private var mainRectHeight : float;
	
	private var internalHeight : float;
	
	
	public function Initialize(){
		super.Initialize();
		mainRectWidth = 1 - (2 * sidePadding);
		mainRectHeight = 1 - (1 * sidePadding);
		mainRect = RectFactory.NewRect(sidePadding, sidePadding, mainRectWidth, mainRectHeight);
		
		var backButtonSize : Vector2 = Utils.CalcTextureDimensionsWithDesiredHeight(backButtonTexture, backButtonHeight);
		backButtonRect = RectFactory.NewRect(1-sidePadding-backButtonSize.x, sidePadding, backButtonSize.x, backButtonSize.y);
		
		internalHeight = 1 - (2 * sidePadding) - (3 * internalPadding);
		
		var totalWidth = 1 - (2 * sidePadding) - (3 * internalPadding);
		var portraitWidth = totalWidth * portraitPercentage;
		var descriptionWidth = totalWidth * infoPercentage;
		
		portraitRect = RectFactory.NewRect(sidePadding + internalPadding, sidePadding + internalPadding, portraitWidth, internalHeight);
		desriptionRect = RectFactory.NewRect(sidePadding + (2 * internalPadding) + portraitWidth, sidePadding + internalPadding, descriptionWidth, internalHeight);
	}
	
	public function SetContact(contact : Contact){
		currentContact = contact;
		currentContactPortrait = contact.GetPortraitTexture();
		if (currentContact.description == null || currentContact.description == ""){
			currentContact.description = "No description set";
		}
	}
	
	public function OnOpen(){
		super.OnOpen();
		if (currentContact == null){
			Debug.LogWarning("No Contact to inspect");
		}
	} 

	public function Render(){	
		GUI.Box(mainRect,"");	
		
		GUI.Box(portraitRect, currentContactPortrait,contactStyle);
		
		GUI.Box(desriptionRect, currentContact.description,contactStyle);
		if (GUI.Button(backButtonRect, backButtonTexture)){
			currentResponse.type = EventTypes.CONTACTSMENU;
		}
	}
}