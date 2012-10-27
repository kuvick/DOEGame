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

// the dimensions of the buttons
private var buttonWidth : float;
private var buttonHeight : float; 

// the size of each unit on a grid placed on the screen
private var xGrid : float;
private var yGrid : float;


function Start ()
{
	buttonWidth = Screen.width / 4;
	buttonHeight = Screen.height / 6;
	xGrid = Screen.width / 16;
	yGrid = Screen.height / 5;
	
	eventStartGameRect = Rect( 3.5 * xGrid, 3 * yGrid, buttonWidth, buttonHeight );
	eventResumeRect = Rect( 8.5 * xGrid, 3 * yGrid, buttonWidth, buttonHeight );
	eventLevelSelectRect = Rect( 3.5 * xGrid, 4 * yGrid, buttonWidth, buttonHeight );
	eventExitRect = Rect( 12 * xGrid, 0 * yGrid, buttonWidth, buttonHeight );
	eventScoreScreenRect = Rect( 8.5 * xGrid, 4 * yGrid, buttonWidth, buttonHeight );

	if (showSplash) {
		yield WaitForSeconds(1);
		renderer.material.mainTexture = firstSlide;
		yield WaitForSeconds(2);
		renderer.material.mainTexture = secondSlide;
		yield WaitForSeconds(2);
		showSplash = false;
	}
	renderer.material.mainTexture = thirdSlide;
}

function OnGUI()
{
	if(renderer.material.mainTexture == thirdSlide)
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

static function SetShowSplash (sSplash : boolean)
{
	showSplash = sSplash;
}

/*
function Update()
{
	gameObject.transform.localScale = new Vector3( ( Screen.width / 119 ) + 5, ( Screen.height / 119 ) + 5, 1);
}
*/