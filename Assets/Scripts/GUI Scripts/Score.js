/**********************************************************
Score.js

Description: Sets up the Score Screen menu

Author: Chris Peterson
**********************************************************/

//Variables

var showScore : boolean = false;

var eventScore : int = 0;
var bonusScore : int = 0;
var totalScore : int = 0;

//The Bounds for the 4 Buttons
var eventRetryLevelRect : Rect;
var eventPostScoreToFBRect: Rect;
var eventNextLevelRect : Rect;
var eventBackToStartRect : Rect;
var eventLoginToFBRect : Rect;

//The Buffer between the buttons and the screen size
var borderBuffer = 10;

//GUIStyle used for the Score Text
var newStyle : GUIStyle;

//need to replace text with GUI texture (if needed)
private var scoreStrings : String[] = ["Retry Level", "Share to Facebook", "Next Level", "Start Screen", "Login"];

// for showing facebook confirmation
private static var showToast : boolean = false;
private static var toastTime : int;
private static var toastMsg : String = "";

public var backgroundTexture : Texture;

private var database : GameObject;
private var intelSystem : IntelSystem;

function Start(){
	database = GameObject.Find("Database");
	intelSystem = database.GetComponent(IntelSystem);
	eventScore = intelSystem.getPrimaryScore();
	bonusScore = intelSystem.getOptionalScore();

	/*
		Initialize the Bounds for the 4 buttons
	*/
	eventRetryLevelRect = RectFactory.NewRect(0,.85);
	eventPostScoreToFBRect = RectFactory.NewRect(.4,.85);
	eventLoginToFBRect = RectFactory.NewRect(.4,.7);
	eventNextLevelRect = RectFactory.NewRect(.8,.85);
	eventBackToStartRect = RectFactory.NewRect(.8,0);
								
								
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
	if (showToast){
		if (toastTime > 0){
			toastTime -= Time.deltaTime;
		} else {
			showToast = false;
		}
	}
}

function OnGUI(){
	GUI.DrawTexture(RectFactory.NewRect(0,0,1,1),backgroundTexture); 
	
	DrawScores();
	
	/* 
		Retry Level Button
	*/
	if(GUI.Button(eventRetryLevelRect, scoreStrings[0]))
	{
		PlayButtonPress(1);
		/*
			TODO: Restart Previous Level(not just level 1)
			Note: Derrick, possibly done, taking int the current level from ToolBar
		*/
		
		Application.LoadLevel(Application.loadedLevelName);//GUIManager.currLevel);//"Prototype - Level1");
	}
	
	/* 
		Post to Facebook Button
	*/
	if(GUI.Button(eventPostScoreToFBRect, scoreStrings[1]))
	{
		PlayButtonPress(2);
		FacebookProtocol.PostScoreToFacebook(totalScore, "The Outpost");		
	}
	
	
	/* 
		Login to Facebook Button
	*/
	if(GUI.Button(eventLoginToFBRect, scoreStrings[4]))
	{
		PlayButtonPress(2);
		/*
			TODO: Post Scores to Facebook
		*/
						
		FacebookProtocol.Login();	
	}
	
	/*
		Next Level Button
	*/
	if(GUI.Button(eventNextLevelRect, scoreStrings[2]))
	{
		PlayButtonPress(1);
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
		PlayButtonPress(1);
		Application.LoadLevel("StartScreen");
	}
	
	// shows messages
	if (showToast){
		GUI.Label(RectFactory.NewRect(.2,.5), toastMsg);
	}
}

//Draws the scores
function DrawScores(){	

	var text: String = "Event Score:      " + eventScore +
					 "\nBonus Score:     " + bonusScore +
				     "\nTotal Score:        " + totalScore +
				     "\nVictory?        " + intelSystem.victory;

	GUI.Box(RectFactory.NewRect(.38,.38,.3,.3), text, newStyle);
}

// will set things to show a message on screen
static function ShowMessage(msg : String){
	toastMsg = msg;
	toastTime = 300;
	showToast = true;
}

//Plays the Audio for the Button Press
//sounderNumber is which button press sound to play (1 or 2)
function PlayButtonPress(soundNumber)
{
	GameObject.Find("AudioSource Object").GetComponent(AudioSourceSetup).playButtonClick(soundNumber);
}
