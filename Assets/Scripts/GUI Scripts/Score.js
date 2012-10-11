/**********************************************************
Score.js

Description: Sets up the Score Screen menu

Author: Chris Peterson
**********************************************************/

//Variables

var showScore : boolean = false;

var eventScore : int = 190;
var bonusScore : int = 10;
var totalScore : int = 200;

//The Bounds for the 4 Buttons
var eventRetryLevelRect : Rect;
var eventPostScoreToFBRect: Rect;
var eventNextLevelRect : Rect;
var eventBackToStartRect : Rect;

//The Buffer between the buttons and the screen size
var borderBuffer = 10;

//GUIStyle used for the Score Text
var newStyle : GUIStyle;

//need to replace text with GUI texture (if needed)
private var scoreStrings : String[] = ["Retry Level", "Share to Facebook", "Next Level", "Start Screen"];

function Start(){
	/*
		Initialize the Bounds for the 4 buttons
	*/
	eventRetryLevelRect = Rect(	borderBuffer, 
								Screen.height - Screen.height / 6, 
								Screen.width / 4, 
								Screen.height / 6);
	eventPostScoreToFBRect = Rect(Screen.width/2 - Screen.width/8, 
								Screen.height - Screen.height / 6, 
								Screen.width / 4, 
								Screen.height / 6);
	eventNextLevelRect = Rect(Screen.width - Screen.width/4 - borderBuffer, 
								Screen.height - Screen.height / 6, 
								Screen.width / 4, 
								Screen.height / 6);
	eventBackToStartRect = Rect(Screen.width - Screen.width/4 - borderBuffer, 
								borderBuffer,
								Screen.width / 4, 
								Screen.height / 6);
								
								
	/*
		Initialize the GUIStyle for the Score Text
	*/
	newStyle = GUIStyle();
	newStyle.fontSize = 20;		
							
	/*
		TODO: Get values for
			- eventScore
			- bonusScore
		from the IntelSystem script
	*/	
	
}

function Update() {
	
}

function OnGUI(){
	
	DrawScores();
	
	/* 
		Retry Level Button
	*/
	if(GUI.Button(eventRetryLevelRect, scoreStrings[0]))
	{
		/*
			TODO: Restart Previous Level(not just level 1)
			Note: Derrick, possibly done, taking int the current level from ToolBar
		*/
		Application.LoadLevel(ToolBar.currLevel);//"Prototype - Level1");
	}
	
	/* 
		Post to Facebook Button
	*/
	if(GUI.Button(eventPostScoreToFBRect, scoreStrings[1]))
	{
		/*
			TODO: Post Scores to Facebook
		*/
						
		FacebookProtocol.PostScoreToFacebook(totalScore, "The Outpost");		
	}
	
	/*
		Next Level Button
	*/
	if(GUI.Button(eventNextLevelRect, scoreStrings[2]))
	{
		/*
			TODO: Continue to the next level(not just return to level 1)
		*/
		Application.LoadLevel("Prototype - Level1");
	}
	
	/* 
		Return to Start Screen
	*/
	if(GUI.Button(eventBackToStartRect, scoreStrings[3]))
	{
		Application.LoadLevel("StartScreen");
	}
}

//Draws the scores
function DrawScores(){	

	var text: String = "Event Score:      " + eventScore +
					 "\nBonus Score:     " + bonusScore +
				     "\nTotal Score:        " + totalScore;

	GUI.Box(Rect(Screen.width/3, Screen.height/3, Screen.width/3, Screen.height/3), text, newStyle);
}