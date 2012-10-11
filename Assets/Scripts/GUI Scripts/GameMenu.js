/**********************************************************
GameMenu.js

Description: Game Menu that is called when "P" is pressed during the game or fails the level

Author: Bomin Kim
**********************************************************/

// Variables
var levelFailed : boolean = false;
var paused : boolean = false;

// GUIStyle used for the Score Text
var newStyle : GUIStyle;

// need to replace text with GUI texture (if needed)
private var menuStrings : String[] = ["Try again?", "Paused", "Level Select", "Restart Level", "Save and Exit"];

// The Bounds for the 3 Buttons
private var eventLevelSelectRect: Rect;
private var eventRestartLevelRect : Rect;
private var eventSaveAndExitRect : Rect;

// Private variables for buttons
private var buttonWidth : float = Screen.width / 4;
private var buttonHeight : float = Screen.height / 6;
private var xGrid : float = Screen.width / 16;
private var yGrid : float = Screen.height / 5;



function Start(){
	
	// Initialize the Bounds for the 3 buttons
	eventLevelSelectRect = Rect	( 1 * xGrid, 3 * yGrid, buttonWidth, buttonHeight );
	eventRestartLevelRect = Rect( 6 * xGrid, 3 * yGrid, buttonWidth, buttonHeight );
	eventSaveAndExitRect = Rect( 11 * xGrid, 3 * yGrid, buttonWidth, buttonHeight );
					
								
	
	// Initialize the GUIStyle for the Score Text
	newStyle = GUIStyle();
	newStyle.fontSize = 20;		
	newStyle.alignment = TextAnchor.MiddleCenter;

}

function Update(){

	if ( Input.GetKeyDown( KeyCode.P ) )
	{
		if ( paused )
			paused = false;
		else
			paused = true;
	}

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
				TODO: Show All Levels (not just level 1)
			*/
			Application.LoadLevel("Prototype - Level1");
		}
		
		
		// Restart Level Button
		if(GUI.Button(eventRestartLevelRect, menuStrings[3]))
		{
			
			// Restart Current Level
			Application.LoadLevel(EditorApplication.currentScene);
		}
		
		
		// Save and Exit Button
		if(GUI.Button(eventSaveAndExitRect, menuStrings[4]))
		{
			/*
				TODO: Closes game app and saves progress (not just return to level 1)
			*/
			Application.LoadLevel("Prototype - Level1");
		}
	
	}
}