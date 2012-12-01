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
		currentTexture = thirdSlide;
		showSplash = false;
	}
}

function OnGUI()
{
	GUI.DrawTexture(RectFactory.NewRect(0,0,1,1),currentTexture); 
	
	if(!showSplash)
	{
		if(GUI.Button(eventStartGameRect, "Start Game"))
		{
			Application.LoadLevel("LoadingScreen");
		}
		
		if(GUI.Button(eventResumeRect, "Resume"))
		{
			Application.LoadLevel("LoadingScreen"); // to be changed when saving and loading is implemented
		}
		
		if(GUI.Button(eventLevelSelectRect, "Level Select"))
		{
			// Application.LoadLevel("LevelSelect"); when implemented
		}
		
		if(GUI.Button(eventExitRect, "Exit"))
		{
			Application.Quit();
		}
		
		if(GUI.Button(eventScoreScreenRect, "Score Screen"))
		{
			Application.LoadLevel("ScoreScreen");		// to be removed later, used for testing purposes
		}
	}
}

static function SetShowSplash (sSplash : boolean){
	showSplash = sSplash;
}

function InitButtons(){
	eventStartGameRect = RectFactory.NewRect(.2,.6);
	eventResumeRect = RectFactory.NewRect(.6,.6);
	eventLevelSelectRect = RectFactory.NewRect(.2,.8);
	eventExitRect = RectFactory.NewRect(.8,0);
	eventScoreScreenRect = RectFactory.NewRect(.6,.8);
}