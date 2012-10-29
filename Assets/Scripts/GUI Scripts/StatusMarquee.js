/**********************************************************
StatusMarquee.js

Description: Displays which mode the player is in. 
(Explore mode or Link mode)

Note: Attach the script to Main Camera.

Author: Ajinkya Waghulde

Edits by: Ian Winter
**********************************************************/
private var mode:int;
private var welcome : int = 0;

function OnGUI()
{
	/*
	if(mode == "explore")
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Explore Mode>");	
	else if (mode == "link")
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Link Mode>");	
	*/
	
	GUI.contentColor = Color.green;
	GUI.backgroundColor = Color.black;
	
	if (mode == GameState.EXPLORE && welcome ==0)
		{
		GUI.Label(Rect(Screen.width/2 - 70, Screen.height - 50, Screen.width/2 + 50, 40), "Welcome to Prototype City!");
		//GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 20, Screen.width/2 + 50, 40), "<Explore Mode>");
		}					
								
	if(mode == GameState.LINK)
		{
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, Screen.width/2 + 50, 40), "<Link Mode>");
		welcome = 1;
		}
	else 
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 30, Screen.width/2 + 50, 40), "<Explore Mode>");	
	

}

function Update(){
	mode = ModeController.getCurrentMode();
}