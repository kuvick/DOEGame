/*
 CameraControl.js
 By Katharine Uvick
 
 This script allows for panning the camera via drag and zooming
 
 Attach this script to the camera.
*/

#pragma strict

// Variables for altering the camera's movement
static public var speedOfZoom: float = 100;	
static public var closestZoomDistance: float = 400;	
static public var farthestZoomDistnace: float = 570;//580;//650;
static public var zoomingIncrement: float = 10;

static public var zoomedIn:boolean = true;

static private var hexOrigin: Vector3;
static private var thisCamera: Camera;

static public var testingCameras : boolean = false;

static public var bCP : Vector3;
static public var bD : Vector3;

public var borderCenterPosition : Vector3;
public var borderDimensions : Vector3;
public var cameraStartObject : GameObject;
private var aspectRatioWidth : float = 5;
private var aspectRatioHeight : float = 4;
public var aspectRatio : AspectRatios;
public var useDefaultAspectRatio : boolean = true;
private var revertedToDefault = true;

static public var cameraAngle : float = 60;


private enum AspectRatios
{
	FourByFive,
	FourByThree,
	ThreeByTwo,
	SixteenByTen,
	SixteenByNine	
};

function Start () {	
	hexOrigin = HexagonGrid.TileToWorldCoordinates(0,0);
	zoomedIn = true;
	thisCamera = this.camera;
	if(camera.tag == "TestCamera")
	{
		testingCameras = true;
	}
	else
	{
		testingCameras = false;
	}
	ZoomIn();
	
	if(borderDimensions.x == 0 || borderDimensions.z == 0)
	{
		Debug.Log("WARNING: Camera Dimensions Not Set. Reverting to Default");
		borderDimensions.x = HexagonGrid.totalDimensions.x;
		borderDimensions.z = HexagonGrid.totalDimensions.y;
		borderCenterPosition.x = borderDimensions.x / 2;
		borderCenterPosition.z = borderDimensions.z / 2;
	}
	
	bCP = borderCenterPosition;
	bD = borderDimensions;
	
	thisCamera.transform.position = new Vector3(cameraStartObject.transform.position.x, thisCamera.transform.position.y, cameraStartObject.transform.position.z);
	
	if(!useDefaultAspectRatio)
		if(aspectRatioWidth != 0 && aspectRatioHeight != 0)
			thisCamera.aspect = (aspectRatioWidth / aspectRatioHeight);
}

// Only used when testing cameras, to set the current camera
public function setCamera(camera : Camera)
{
	thisCamera = camera;
}

// The function uses the difference in the mouse's position between frames
// to determine which way to drag the camera, and moves the camera in that direction.
static public function Drag(currentInputPos: Vector2){
	thisCamera.transform.Translate(new Vector3(currentInputPos.x, 0, currentInputPos.y), Space.World);
	
	var totalDimensions: Vector2 = HexagonGrid.totalTileDimensions();
	
	//OLD EDGE DETECTION - Keeping it just in case current implementation is not desired.
	/*
	//Detects the edge of the map - Left
	if(thisCamera.transform.position.x <= hexOrigin.x + Screen.width / 2){
		thisCamera.transform.position = new Vector3(hexOrigin.x + Screen.width / 2, thisCamera.transform.position.y, thisCamera.transform.position.z);
	}
	//Detects the edge of the map - Right
	if(thisCamera.transform.position.x >= hexOrigin.x + totalDimensions.x - Screen.width / 2){
		thisCamera.transform.position = new Vector3(hexOrigin.x + totalDimensions.x - Screen.width / 2, thisCamera.transform.position.y, thisCamera.transform.position.z);
	}
	//Detects the edge of the map - Bottom when zoomed in
	if(thisCamera.transform.position.z <= hexOrigin.z && zoomedIn){
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z);		
	}
	//Detects the edge of the map - Bottom when zoomed out
	if(thisCamera.transform.position.z <= hexOrigin.z + Screen.height / 1.5 && !zoomedIn){
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z + Screen.height / 1.5);		
	}
	//Detects the edge of the map - Top
	if(thisCamera.transform.position.z >= hexOrigin.z + totalDimensions.y - Screen.height /2){
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z + totalDimensions.y - Screen.height/2);		
	}*/
	
	//Left
	if(thisCamera.transform.position.x < (bCP.x - (bD.x / 2)))
	{
		thisCamera.transform.position = new Vector3(bCP.x - (bD.x / 2), thisCamera.transform.position.y, thisCamera.transform.position.z);
	}
	//Right
	if(thisCamera.transform.position.x > (bCP.x + (bD.x / 2)))
	{
		thisCamera.transform.position = new Vector3(bCP.x + (bD.x / 2), thisCamera.transform.position.y, thisCamera.transform.position.z);
	}
	//Top
	if(thisCamera.transform.position.z > (bCP.z + (bD.z / 2)))
	{
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, bCP.z + (bD.z / 2));
	}
	//Bottom
	if(thisCamera.transform.position.z < (bCP.z - (bD.z / 2)))
	{
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, bCP.z - (bD.z / 2));
	}	
}

// This function is used to zoom the camera in and out.
// Assumes the camera is at a 45 degree angle towards the terrain.
static function Zoom(isZoomingIn: boolean){
	/* No more manual zoom
	if (isZoomingIn && CanZoomIn()){
		ZoomIn();
	} else if (!isZoomingIn && CanZoomOut()) {
		ZoomOut();
	}*/
}

public static function ToggleZoomType(){
	if (zoomedIn){
		ZoomOut();
	} else {
		ZoomIn();
	}
	zoomedIn = !zoomedIn;
}

private static function ZoomIn(){
	if(!testingCameras)
	{
		thisCamera.transform.rotation = Quaternion.AngleAxis(cameraAngle, Vector3.right);
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, closestZoomDistance, thisCamera.transform.position.z);
		if(thisCamera.transform.position.z <= hexOrigin.z + Screen.height / 1.5){
			thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z);		
		}
	}
}

private static function ZoomOut(){
	if(!testingCameras)
	{
		thisCamera.transform.rotation = Quaternion.AngleAxis(90, Vector3.right);
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, farthestZoomDistnace, thisCamera.transform.position.z);
		//Detects the edge of the map - Bottom when zoomed out
		if(thisCamera.transform.position.z <= hexOrigin.z + Screen.height / 1.5){
			thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z + Screen.height / 1.5);		
		}
	}
}

public function Update()
{	
	if(!useDefaultAspectRatio)
	{
		switch(aspectRatio)
		{
			case AspectRatios.FourByFive:
				aspectRatioWidth = 4;
				aspectRatioHeight = 5;
				break;
			case AspectRatios.FourByThree:
				aspectRatioWidth = 4;	
				aspectRatioHeight = 3;
				break;
			case AspectRatios.ThreeByTwo:
				aspectRatioWidth = 3;
				aspectRatioHeight = 2;
				break;
			case AspectRatios.SixteenByTen:
				aspectRatioWidth = 16;
				aspectRatioHeight = 10;
				break;
			case AspectRatios.SixteenByNine:
				aspectRatioWidth = 16;
				aspectRatioHeight = 9;
				break;
		}
		
		if(revertedToDefault)
			revertedToDefault = false;
		
		if((thisCamera.aspect != (aspectRatioWidth / aspectRatioHeight)) && aspectRatioWidth != 0 && aspectRatioHeight != 0)
			thisCamera.aspect = (aspectRatioWidth / aspectRatioHeight);
	}
	else
	{
		if(!revertedToDefault)
		{
			revertedToDefault = true;
			thisCamera.ResetAspect();
		}
	}
	
	if(borderDimensions.x == 0 || borderDimensions.z == 0)
	{
		Debug.Log("WARNING: Camera Dimensions Not Set. Reverting to Default");
		borderDimensions.x = HexagonGrid.totalDimensions.x;
		borderDimensions.z = HexagonGrid.totalDimensions.y;
		borderCenterPosition.x = borderDimensions.x / 2;
		borderCenterPosition.z = borderDimensions.z / 2;
		
		CameraControl.bCP = borderCenterPosition;
		CameraControl.bD = borderDimensions;
	}

}

public function OnDrawGizmos()
{
	Gizmos.color = Color.red;
	Gizmos.DrawWireCube(borderCenterPosition, borderDimensions);
	//thisCamera.aspect = (aspectRatioWidth / aspectRatioHeight);
}