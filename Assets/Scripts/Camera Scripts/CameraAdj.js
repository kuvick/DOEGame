/*
	Initially by Katharine Uvick
	Use this to adjust the camera's location and angle
	in relation to the terrain. Can use this both while
	the game is playing and while in the editor.
*/


#pragma strict
@script ExecuteInEditMode()

public var distanceFromTerrain : float;
public var angleFromTerrain : float;
public var mainCamera : GameObject;
public var terrain : GameObject;
public var adjustCamera : boolean = true;

function Update ()
{
	if(adjustCamera)
	{
		mainCamera.transform.rotation = Quaternion.AngleAxis(angleFromTerrain, Vector3.right);
		mainCamera.transform.position = new Vector3(mainCamera.transform.position.x, terrain.transform.position.y + distanceFromTerrain, mainCamera.transform.position.z);
	}
}