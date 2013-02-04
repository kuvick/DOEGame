/**********************************************************
Loading.js

Description: 

Notes: 

Kathrine - Temporary script for the demo, will eventually use this when
we have access to Unity Pro:

http://docs.unity3d.com/Documentation/ScriptReference/Application.LoadLevelAsync.html

Author: Katherine Uvick, Francis Yuan
**********************************************************/
#pragma strict
public class Loading extends GUIControl
{
	// Loading Screen Rectangles
	private var background:Rect;
	
	// Loading Screen Textures
	public var loadingTexture : Texture;
	
	public function Start ()
	{
		super.Start();
		
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		background = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		// Add the background rect to the rectList for checking input collision
		rectList.Add(background);
	}
	
	public function Render() 
	{
		GUI.DrawTexture(background, loadingTexture, ScaleMode.ScaleToFit);
	}
	
	public function DelayLoad(seconds:int):IEnumerator
	{
		yield WaitForSeconds(seconds);
		currentResponse.type = EventTypes.DONELOADING;
	}
}