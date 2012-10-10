/* ScreenChange.js
Original Script by Katharine Uvick

Temporary script for the demo, uses this concept:

http://docs.unity3d.com/Documentation/Manual/HOWTO-SplashScreen.html

*/

#pragma strict

public var firstSlide : Texture;
public var secondSlide : Texture;
public var thirdSlide : Texture;






function Start ()
{
	yield WaitForSeconds(5);
	renderer.material.mainTexture = firstSlide;
	yield WaitForSeconds(2);
	renderer.material.mainTexture = secondSlide;
	yield WaitForSeconds(2);
	renderer.material.mainTexture = thirdSlide;
}

function OnGUI()
{
	if(renderer.material.mainTexture == thirdSlide)
	{
		if(GUI.Button(new Rect(Screen.width/2, Screen.height - 200, 100, 100), "Play"))
		{
			Application.LoadLevel(1);
		}
		
		if(GUI.Button(Rect(Screen.width - 110, 10, 100, 80), "Score Screen")){
			Application.LoadLevel("ScoreScreen");		
		}
	}
}