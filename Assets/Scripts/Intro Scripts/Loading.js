/* Loading.js
Original Script by Katharine Uvick

Temporary script for the demo, will eventually use this when
we have access to Unity Pro:

http://docs.unity3d.com/Documentation/ScriptReference/Application.LoadLevelAsync.html

*/


#pragma strict

function Start ()
{
	yield WaitForSeconds(4);
	Application.LoadLevel(2);
}