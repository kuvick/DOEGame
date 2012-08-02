/**********************************************************
StatusMarquee.js

Description: Displays which mode the player is in. 
(Explore mode or Link mode)

Note: Attach the script to Main Camera.

Author: Ajinkya Waghulde
**********************************************************/
private var mode:String;


function OnGUI()
{
	/*
	if(mode == "explore")
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Explore Mode>");	
	else if (mode == "link")
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Link Mode>");	
	*/
	
	if(mode == "link")
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Link Mode>");	
	else 
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Explore Mode>");	
	

}

function Update(){
	mode = GameObject.Find("ModeController").GetComponent(ModeController).getCurrentMode();
}