/**********************************************************
GameMenu.js

Description: Game Menu that is called when the game is paused

Author: Bomin Kim

Rewritten by Francis Yuan
**********************************************************/

// Skins for GUI components
public var gameMenuSkin:GUISkin;			// GUISkin component for the game menu, set in Inspector

function Start()
{
}


function Update(){

	/*if ( Input.GetKeyDown( KeyCode.P ) )
	{
		paused = !paused;
	}*/
	
}

function OnGUI()
{
	
}

function OnPauseGame()
{
	paused = true;
	Debug.Log("Setting to true");
}

function OnResumeGame()
{
	paused = false;
}

public static function pauseGame()
{
	Debug.Log("Pausing game...");
	Time.timeScale = 0.0;
	var objects:GameObject[] = GameObject.FindObjectsOfType(GameObject);
	for (var obj:GameObject in objects) {
		obj.SendMessage ("OnPauseGame", SendMessageOptions.DontRequireReceiver);
	}
}

public static function resumeGame()
{
	Debug.Log("Resuming game");
	Time.timeScale = 1.0;
	var objects:GameObject[] = GameObject.FindObjectsOfType(GameObject);
	for (var obj:GameObject in objects) {
		obj.SendMessage ("OnResumeGame", SendMessageOptions.DontRequireReceiver);
	}
}