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




function Start ()
{
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
		if(GUI.Button(new Rect(Screen.width/2 - 55, Screen.height - 400, 110, 50), "Start Game"))
		{
			Application.LoadLevel(1);
		}
		
		if(GUI.Button(new Rect(Screen.width/2 - 55, Screen.height - 325, 110, 50), "Resume"))
		{
			Application.LoadLevel(1); // to be changed when saving and loading is implemented
		}
		
		if(GUI.Button(new Rect(Screen.width/2 - 55, Screen.height - 250, 110, 50), "Level Select"))
		{
			// Application.LoadLevel("LevelSelect"); when implemented
		}
		
		if(GUI.Button(new Rect(Screen.width/2 - 55, Screen.height - 175, 110, 50), "Link to Facebook"))
		{
			FacebookProtocol.PostScoreToFacebook(12345, "The Outpost");
		}
		
		if(GUI.Button(new Rect(Screen.width/2 - 55, Screen.height - 100, 110, 50), "Exit"))
		{
			Application.Quit();
		}
		
		if(GUI.Button(Rect(Screen.width - 110, 10, 100, 80), "Score Screen")){
			Application.LoadLevel("ScoreScreen");		// to be removed later, used for testing purposes
		}
	}
}

static function SetShowSplash (sSplash : boolen)
{
	showSplash = sSplash;
}

/*
function Update()
{
	gameObject.transform.localScale = new Vector3( ( Screen.width / 119 ) + 5, ( Screen.height / 119 ) + 5, 1);
}
*/