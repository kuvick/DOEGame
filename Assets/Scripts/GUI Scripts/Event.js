/**********************************************************
Event.js

Description:
	This script is meant to be attached to a building object. 
	Its primary use is to add Events/Objectives to individual buildings 

TODO:
	- Link Upgrade Texture to variable within event: BuildingEvent
	- 

Author: Chris Peterson
**********************************************************/

#pragma strict

// PUBLIC VARS
public var event: BuildingEvent;

/*Textures*/
public var upgrade_green: Texture;
public var upgrade_blue: Texture;
public var upgrade_orange: Texture;
public var upgrade_yellow: Texture;
public var showUpgrade: boolean = true;

// PRIVATE VARS
private var upgradeBounds: Rect;	
private var upgradeOpacity:float = .50; 		//The opacity of the upgrade 1 = Normal, 0 = Invisible

private var floatPercent: float = .10; 			//The percent of the screens height that the Upgrade GUI floats above the object
private var floatHeight: float; 				//The actual height the Upgrade appears to float
	
private var upgradeWidthPercent: float = .03; 	//The percent of the screens width that the Upgrade texture is wide. 
private var upgradeWidth: float; 				//The actual width in pixels of the Upgrade image

private var screenPosition:Vector3;

private var colorOpacity: Color;				//The color to convert to before drawing the Upgrade. Value of (1.0, 1.0, 1.0, .25) results in 25% opacity


function Start () {
	colorOpacity = Color(1.0, 1.0, 1.0, upgradeOpacity);
	upgradeWidth = Screen.width * upgradeWidthPercent;
	
	floatHeight = floatPercent * Screen.height;
	
	screenPosition = Camera.mainCamera.WorldToScreenPoint(transform.position);	
	upgradeBounds = Rect(screenPosition.x - upgradeWidth/2, Screen.height - screenPosition.y - floatHeight, upgradeWidth, upgradeWidth);
}

function Update () {
	
	//Updage Position of Image
	screenPosition = Camera.mainCamera.WorldToScreenPoint(transform.position);	
	//Update bounds, and convert screen coords to GUI coords
	upgradeBounds = Rect(screenPosition.x - upgradeWidth/2, Screen.height - screenPosition.y  - floatHeight, upgradeWidth, upgradeWidth);
	
}

function OnGUI()
{
	if(showUpgrade)
	{
		Draw_Upgrade();
	}
}

//Draws the Upgrade Image to the Screen
private function Draw_Upgrade()
{		
	GUI.color = colorOpacity;
		GUI.DrawTexture(upgradeBounds, upgrade_blue);	
	GUI.color = Color(1.0, 1.0, 1.0, 1.0);
}