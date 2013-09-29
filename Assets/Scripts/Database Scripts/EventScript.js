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
import System.Collections.Generic;


// PUBLIC VARS
public var event: BuildingEvent;

public var showIcon: boolean = true;

public var contactsUnlocked : List.<String>;
public var codicesUnlocked : List.<String>;

// PRIVATE VARS
private var upgradeBounds: Rect;	
private var upgradeOpacity:float = .50; 		//The opacity of the upgrade 1 = Normal, 0 = Invisible

private var floatPercent: float = .10; 			//The percent of the screens height that the Upgrade GUI floats above the object
private var floatHeight: float; 				//The actual height the Upgrade appears to float
	
private var upgradeWidthPercent: float = .03; 	//The percent of the screens width that the Upgrade texture is wide. 
private var upgradeWidth: float; 				//The actual width in pixels of the Upgrade image

private var screenPosition:Vector3;

private var colorOpacity: Color;				//The color to convert to before drawing the Upgrade. Value of (1.0, 1.0, 1.0, .25) results in 25% opacity

//private var indicator : ObjectiveIndicator = ObjectiveIndicator();
private var icon : ObjectiveIcon;

private var resolved : boolean = false;

public function Initialize()
{
	//indicator.Initialize(gameObject.transform, event, event.type);
	var tempPlane : GameObject = Instantiate(Resources.Load("IconPlane") as GameObject, transform.position, Quaternion.identity);
	icon = tempPlane.AddComponent(ObjectiveIcon);
	//icon.Initialize(gameObject.transform, event.icon, event.description, event.tooltipPic, event.type, event.time);
	icon.Initialize(gameObject.transform, event.icon, event.inspIcon, event.resolvedIcon, event.tooltip, event.type, event.time);
	
	//ADDED GPC 9/3/13
	if(event.type == BuildingEventType.Primary){
		event.points = 3000;
	}else if(event.type == BuildingEventType.Secondary){
		event.points = 1000;
	}
}

function Update () {
	
	//Updage Position of Image
	/*screenPosition = Camera.mainCamera.WorldToScreenPoint(transform.position);	
	
	//Update bounds, and convert screen coords to GUI coords
	upgradeBounds = Rect(screenPosition.x - upgradeWidth/2, 
						Screen.height - screenPosition.y  - floatHeight, 
						upgradeWidth, 
						upgradeWidth);*/
	//indicator.Update();
	icon.Update();
}

//Draws the Upgrade Image to the Screen
public function Draw_Upgrade()
{		
	if(showIcon)
	{
		icon.Draw();
		/*GUI.color = colorOpacity;
			GUI.DrawTexture(upgradeBounds, event.icon);	
		GUI.color = Color(1.0, 1.0, 1.0, 1.0);
		
		var tempRect : Rect = Rect(upgradeBounds.x + upgradeWidth, upgradeBounds.y, 30, 30); */
		if (event.type == BuildingEventType.Primary)
			icon.DrawTime(event.time.ToString());
			//GUI.Label(tempRect, event.time.ToString());
	}
	
	//indicator.Draw();
}

public function SetIconActive(active : boolean)
{
	icon.SetActive(active);
}

public function SetIconTexture (tex : Texture2D)
{
	event.icon = tex;
}

//Changes the current opacity of the upgrade icon.
// Accepts floats between 0.0-1.0
// 0.0: Invisible 
// 1.0: Normal
public function changeOpacity(newOpacity: float)
{
	upgradeOpacity = Mathf.Clamp01(newOpacity);
	colorOpacity = Color(1.0, 1.0, 1.0, upgradeOpacity);
}

// Decrements the time variable of the attached BuildingEvent
// If the new time = 0, it will return false. If it above 0, it will return true  
public function decrementTime()
{
	if(event.time - 1 > 0 || resolved){
		event.time--;
		return true;
	}
	else
	{
		event.time--;
		return false;
	}	
}

// Decrements the time variable of the attached BuildingEvent
// If the old time = 0, it will return false. If it above 0, it will return true  
public function incrementTime()
{
	if(event.time == 0){
		event.time++;
		return false;
	}
	else
	{
		event.time++;
		return true;
	}
}
	
public function getIcon():Texture
{
	return icon.texture;
}

public function getIconScript():ObjectiveIcon
{
	return icon;
}

public function SetResolved(res : boolean)
{
	resolved = res;
	icon.SetResolved(res);
}