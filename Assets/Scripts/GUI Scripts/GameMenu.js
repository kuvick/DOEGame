/**********************************************************
GameMenu.js

Description: Game Menu that is called when the game is paused

Author: Bomin Kim
**********************************************************/

// Variables
var levelFailed : boolean = false;
var paused : boolean = false;

// GUIStyle used for the GameMenu Text
var newStyle : GUIStyle;

// need to replace text with GUI texture (if needed)
private var menuStrings : String[] = ["Try again?", "Paused", "Level Select", "Restart Level", "Save and Exit", "Resume"];

// The Bounds for the 3 Buttons
private var eventLevelSelectRect: Rect;
private var eventRestartLevelRect : Rect;
private var eventSaveAndExitRect : Rect;
private var eventResumeRect : Rect;

// Private variables for buttons
private var buttonWidth : float = Screen.width / 4;
private var buttonHeight : float = Screen.height / 6;
private var xGrid : float = Screen.width / 16;
private var yGrid : float = Screen.height / 5;

private static var currLevel : String;

function Start(){
	
	// Initialize the Bounds for the 3 buttons
	eventLevelSelectRect = Rect	( 1 * xGrid, 3 * yGrid, buttonWidth, buttonHeight );
	eventRestartLevelRect = Rect( 6 * xGrid, 3 * yGrid, buttonWidth, buttonHeight );
	eventSaveAndExitRect = Rect( 11 * xGrid, 3 * yGrid, buttonWidth, buttonHeight );
	eventResumeRect = Rect( 11 * xGrid, 1.5 * yGrid, buttonWidth, buttonHeight );
					
								
	
	// Initialize the GUIStyle for the Score Text
	newStyle = GUIStyle();
	newStyle.fontSize = 20;		
	newStyle.alignment = TextAnchor.MiddleCenter;
	//currLevel = "Prototype - Level1";
	
}

// Added by Derrick, used to set the current level for "Reset Level"
// possibly moved to ToolBar if multiple screens need current level (such as the score screen)
/*static function SetCurrLevel(clevel : String) {
	currLevel = clevel;
}*/

function Update(){

	/*if ( Input.GetKeyDown( KeyCode.P ) )
	{
		paused = !paused;
	}*/
	
}

function OnGUI(){
	
	if ( paused || levelFailed )
	{
		
		if ( levelFailed )
		{
			// Show text "Try again?"
			GUI.Box(Rect( 6 * xGrid, 1.5 * yGrid, buttonWidth, buttonHeight), menuStrings[0], newStyle);
		}
		else
		{
			// Show text "Paused"
			GUI.Box(Rect( 6 * xGrid, 1.5 * yGrid, buttonWidth, buttonHeight), menuStrings[1], newStyle);
		}
		
		// Level Select Button
		if(GUI.Button(eventLevelSelectRect, menuStrings[2]))
		{
			/*
				TODO: Show Level Selection Screen when implemented
			*/
			//Application.LoadLevel("LevelSelect");
		}
		
		
		// Restart Level Button
		if(GUI.Button(eventRestartLevelRect, menuStrings[3]))
		{
			
			// Restart Current Level
			//Application.LoadLevel(EditorApplication.currentScene);
			Application.LoadLevel(ToolBar.currLevel); // added by Derrick, takes in current level from ToolBar
		}
		
		
		// Save and Exit Button
		if(GUI.Button(eventSaveAndExitRect, menuStrings[4]))
		{
			/*
				TODO: Closes game app and saves progress (not just return to level 1)
			*/
			Application.Quit();
		}
		
		
		// Resume Button
		if(GUI.Button(eventResumeRect, menuStrings[5]))
		{
			resumeGame();
		}
	
	}
}

function OnPauseGame()
{
	paused = true;
}

function OnResumeGame()
{
	paused = false;
}



public static function pauseGame()
{
	Time.timeScale = 0.0;
	var objects:GameObject[] = GameObject.FindObjectsOfType(GameObject);
	for (var obj:GameObject in objects) {
		obj.SendMessage ("OnPauseGame", SendMessageOptions.DontRequireReceiver);
	}
}

public static function resumeGame()
{
	Time.timeScale = 1.0;
	var objects:GameObject[] = GameObject.FindObjectsOfType(GameObject);
	for (var obj:GameObject in objects) {
		obj.SendMessage ("OnResumeGame", SendMessageOptions.DontRequireReceiver);
	}
}