/* ScreenChange.js
Original Script by Katharine Uvick

Temporary script for the demo, uses this concept:

http://docs.unity3d.com/Documentation/Manual/HOWTO-SplashScreen.html

*/

#pragma strict

public var firstSlide : Texture;
public var secondSlide : Texture;
public var thirdSlide : Texture;

private static var showSplash : boolean = true;

private var eventStartGameRect: Rect;
private var eventResumeRect : Rect;
private var eventLevelSelectRect : Rect;
private var eventExitRect : Rect;
private var eventScoreScreenRect : Rect;

private var currentTexture : Texture = firstSlide;

function Start (){
	InitButtons();
	if (showSplash) {
		currentTexture = firstSlide;
		yield WaitForSeconds(2);
		currentTexture = secondSlide;
		yield WaitForSeconds(2);
		showSplash = false;
	}
	
	currentTexture = thirdSlide; 
}

function OnGUI()
{
	//if (currentTexture == null) currentTexture = thirdSlide; // if we are return
	GUI.DrawTexture(RectFactory.NewRect(0,0,1,1),currentTexture); 
	
	if(!showSplash)
	{
		if(GUI.Button(eventStartGameRect, "Start Game"))
		{
		PlayButtonPress(2);
			Application.LoadLevel("LoadingScreen");
		}
		
		if(GUI.Button(eventResumeRect, "Resume"))
		{
			PlayButtonPress(2);
			Application.LoadLevel("LoadingScreen"); // to be changed when saving and loading is implemented
		}
		
		if(GUI.Button(eventLevelSelectRect, "Level Select"))
		{
			PlayButtonPress(1);
			Application.LoadLevel("LevelSelectScreen");
		}
		
		if(GUI.Button(eventExitRect, "Exit"))
		{
			PlayButtonPress(1);
			Application.Quit();
		}
		
		if(GUI.Button(eventScoreScreenRect, "Score Screen"))
		{
			PlayButtonPress(1);
			Application.LoadLevel("ScoreScreen");		// to be removed later, used for testing purposes
		}
	}
}

static function SetShowSplash (sSplash : boolean){
	showSplash = sSplash;
}

function ChangeScreen(newScreen : String){
	showSplash = false; 
	
}

function InitButtons(){
	eventStartGameRect = RectFactory.NewRect(.2,.6);
	eventResumeRect = RectFactory.NewRect(.6,.6);
	eventLevelSelectRect = RectFactory.NewRect(.2,.8);
	eventExitRect = RectFactory.NewRect(.8,0);
	eventScoreScreenRect = RectFactory.NewRect(.6,.8);
}

//Plays the Audio for the Button Press
//sounderNumber is which button press sound to play (1 or 2)
function PlayButtonPress(soundNumber)
{
	GameObject.Find("AudioSource Object").GetComponent(AudioSourceSetup).playButtonClick(soundNumber);
}