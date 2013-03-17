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
var eventNextLevelRect : Rect;
var eventBackToMainMenuRect : Rect;
var scoreTextRect : Rect;

var GUIPADDING : float = .01f; // Percentage of screen to pad
var BUTTONPADDING : float = .01f;
var BOTTOMBUTTONPADDING : float = .15f;
var BUTTONHEIGHT : float = .3f;

//GUIStyle used for the Score Text
var newStyle : GUIStyle;

//need to replace text with GUI texture (if needed)
private var scoreStrings : String[] = ["Retry Level", "Share to Facebook", "Next Level", "Start Screen", "Login"];

public var backgroundTexture : Texture;

private var database : GameObject;
private var intelSystem : IntelSystem;

function Start(){
	database = GameObject.Find("Database");
	intelSystem = database.GetComponent(IntelSystem);
	eventScore = intelSystem.getPrimaryScore();
	bonusScore = intelSystem.getOptionalScore();
				
	/*
		Initialize the GUIStyle for the Score Text
	*/
	newStyle = GUIStyle();
	newStyle.fontSize = 20;		
							
	SetupButtons();
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
		Application.LoadLevel(Application.loadedLevelName);//GUIManager.currLevel);//"Prototype - Level1");
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
	if(GUI.Button(eventBackToMainMenuRect, scoreStrings[3]))
	{
		PlayButtonPress(1);
		Application.LoadLevel("StartScreen");
	}
}

//Draws the scores
function DrawScores(){	
	var primaryScore : int = intelSystem.getPrimaryScore();
	var bonusScore : int = intelSystem.getOptionalScore();
	var totalScore : int  = primaryScore + bonusScore;

	var text: String = "You " + (intelSystem.victory ? "Won" : "Lost") +
					   "\nEvent Score:     " + primaryScore +
					   "\nBonus Score:     " + bonusScore +
				       "\nTotal Score:     " + totalScore;
 
	GUI.Box(scoreTextRect, text, newStyle);
}

//Plays the Audio for the Button Press
//sounderNumber is which button press sound to play (1 or 2)
function PlayButtonPress(soundNumber)
{
	GameObject.Find("AudioSource Object").GetComponent(AudioSourceSetup).playButtonClick(soundNumber);
}

function SetupButtons(){
	var textBoxTopLeftX : float = GUIPADDING;
	var textBoxTopLeftY : float = GUIPADDING;
	var textBoxWidth : float = 1f - (2f * GUIPADDING);
	var textBoxHeight : float = 1f - (2f * GUIPADDING) - BOTTOMBUTTONPADDING - BUTTONHEIGHT;
	var buttonBoxTopLeftX : float = GUIPADDING;
	var buttonBoxTopLeftY : float = (2f * GUIPADDING) + textBoxHeight;
	var buttonBoxWidth : float = textBoxWidth;
	var buttonBoxHeight : float = BUTTONHEIGHT;
	var buttonWidth : float = (buttonBoxWidth - (2f * BUTTONPADDING)) / 3f;
	var buttonHeight: float = buttonBoxHeight;
	var buttonMainTopLeftX : float = buttonBoxTopLeftX;
	var buttonRetryLeftX : float = buttonMainTopLeftX + BUTTONPADDING + buttonWidth;
	var buttonNextTopLeftX : float = buttonRetryLeftX + BUTTONPADDING + buttonWidth;

	eventBackToMainMenuRect = RectFactory.NewRect(buttonMainTopLeftX, buttonBoxTopLeftY, buttonWidth, buttonHeight);
	eventNextLevelRect = RectFactory.NewRect(buttonNextTopLeftX, buttonBoxTopLeftY, buttonWidth, buttonHeight);
	eventRetryLevelRect = RectFactory.NewRect(buttonRetryLeftX, buttonBoxTopLeftY, buttonWidth, buttonHeight);
	scoreTextRect = RectFactory.NewRect(textBoxTopLeftX, textBoxTopLeftY, textBoxWidth, textBoxHeight);
}