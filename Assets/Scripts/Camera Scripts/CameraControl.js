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
static public var farthestZoomDistnace: float = 580;//650;
static public var zoomingIncrement: float = 10;

static public var zoomedIn:boolean = true;

static private var hexOrigin: Vector3;
static private var thisCamera: Camera;


function Start () {	
	hexOrigin = HexagonGrid.TileToWorldCoordinates(0,0);
	zoomedIn = true;
	thisCamera = Camera.main;
	ZoomIn();
}

// The function uses the difference in the mouse's position between frames
// to determine which way to drag the camera, and moves the camera in that direction.
static public function Drag(currentInputPos: Vector2){
	thisCamera.transform.Translate(new Vector3(currentInputPos.x, 0, currentInputPos.y), Space.World);
	
	var totalDimensions: Vector2 = HexagonGrid.totalTileDimensions();
	
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
	thisCamera.transform.rotation = Quaternion.AngleAxis(60, Vector3.right);
	thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, closestZoomDistance, thisCamera.transform.position.z);
	if(thisCamera.transform.position.z >= hexOrigin.z + Screen.height / 1.5){
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z);		
	}
}

private static function ZoomOut(){
	thisCamera.transform.rotation = Quaternion.AngleAxis(90, Vector3.right);
	thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, farthestZoomDistnace, thisCamera.transform.position.z);
	//Detects the edge of the map - Bottom when zoomed out
	if(thisCamera.transform.position.z <= hexOrigin.z + Screen.height / 1.5){
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z + Screen.height / 1.5);		
	}
}