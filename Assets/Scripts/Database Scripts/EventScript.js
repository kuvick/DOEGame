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

public var showIcon: boolean = true;

// PRIVATE VARS
private var upgradeBounds: Rect;	
private var upgradeOpacity:float = .50; 		//The opacity of the upgrade 1 = Normal, 0 = Invisible

private var floatPercent: float = .10; 			//The percent of the screens height that the Upgrade GUI floats above the object
private var floatHeight: float; 				//The actual height the Upgrade appears to float
	
private var upgradeWidthPercent: float = .03; 	//The percent of the screens width that the Upgrade texture is wide. 
private var upgradeWidth: float; 				//The actual width in pixels of the Upgrade image

private var screenPosition:Vector3;

private var colorOpacity: Color;				//The color to convert to before drawing the Upgrade. Value of (1.0, 1.0, 1.0, .25) results in 25% opacity

private var indicator : ObjectiveIndicator = ObjectiveIndicator();
private var icon : ObjectiveIcon = ObjectiveIcon();

function Start () {
	/*colorOpacity = Color(1.0, 1.0, 1.0, upgradeOpacity);
	upgradeWidth = Screen.width * upgradeWidthPercent;
	
	floatHeight = floatPercent * Screen.height;
	
	screenPosition = Camera.mainCamera.WorldToScreenPoint(transform.position);	
	upgradeBounds = Rect(screenPosition.x - upgradeWidth/2, Screen.height - screenPosition.y - floatHeight, upgradeWidth, upgradeWidth);*/
	indicator.Initialize(gameObject.transform, event, event.type);
	icon.Initialize(gameObject.transform, event.icon, event.description);
}

function Update () {
	
	//Updage Position of Image
	/*screenPosition = Camera.mainCamera.WorldToScreenPoint(transform.position);	
	
	//Update bounds, and convert screen coords to GUI coords
	upgradeBounds = Rect(screenPosition.x - upgradeWidth/2, 
						Screen.height - screenPosition.y  - floatHeight, 
						upgradeWidth, 
						upgradeWidth);*/
	indicator.Update();
	icon.Update();
}
/*
function OnGUI()
{
	if(showUpgrade)
	{
		//Draw_Upgrade();
	}
}
*/

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
	
	indicator.Draw();
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
	if(event.time - 1 > 0){
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