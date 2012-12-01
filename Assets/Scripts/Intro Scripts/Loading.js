/* Loading.js
Original Script by Katharine Uvick

Temporary script for the demo, will eventually use this when
we have access to Unity Pro:

http://docs.unity3d.com/Documentation/ScriptReference/Application.LoadLevelAsync.html

*/


#pragma strict

public var adTexture : Texture;
public var loadingTexture : Texture;

function Start (){
	yield WaitForSeconds(4);
	Application.LoadLevel("Prototype - Level1");
}

function OnGUI() {
	GUI.DrawTexture(RectFactory.NewRect(0,0,1,1),loadingTexture); 
	GUI.DrawTexture(RectFactory.NewRect(.05,.05,.9,.8),adTexture); 
}