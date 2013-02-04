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
static public var farthestZoomDistnace: float = 550;
static public var zoomingIncrement: float = 10;

static private var hexOrigin: Vector3;
static private var thisCamera: Camera;

function Start () {	
	hexOrigin = HexagonGrid.TileToWorldCoordinates(0,0);

	thisCamera = Camera.main;
}

// The function uses the difference in the mouse's position between frames
// to determine which way to drag the camera, and moves the camera in that direction.
static public function Drag(currentInputPos: Vector2){
	thisCamera.transform.Translate(new Vector3(currentInputPos.x, 0, currentInputPos.y), Space.World);
	
	var totalDimensions: Vector2 = HexagonGrid.totalTileDimensions();
	
	//Detects the edge of the map - Left
	if(thisCamera.transform.position.x <= hexOrigin.x){
		thisCamera.transform.position = new Vector3(hexOrigin.x, thisCamera.transform.position.y, thisCamera.transform.position.z);
	}
	//Detects the edge of the map - Right
	if(thisCamera.transform.position.x >= hexOrigin.x + totalDimensions.x){
		thisCamera.transform.position = new Vector3(hexOrigin.x + totalDimensions.x, thisCamera.transform.position.y, thisCamera.transform.position.z);
	}
	//Detects the edge of the map - Bottom
	if(thisCamera.transform.position.z <= hexOrigin.z){
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z);		
	}
	//Detects the edge of the map - Top
	if(thisCamera.transform.position.z >= hexOrigin.z + totalDimensions.y - Screen.height /2){
		thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, hexOrigin.z + totalDimensions.y - Screen.height/2);		
	}
}

// This function is used to zoom the camera in and out.
// Assumes the camera is at a 45 degree angle towards the terrain.
static function Zoom(isZoomingIn: boolean){
	if (isZoomingIn && CanZoomIn()){
		ZoomIn();
	} else if (!isZoomingIn && CanZoomOut()) {
		ZoomOut();
	}
}

private static function CanZoomIn() : boolean{
	return (thisCamera.transform.position.y > closestZoomDistance);
}

private static function CanZoomOut() : boolean{
	return (thisCamera.transform.position.y < farthestZoomDistnace);
}

private static function ZoomIn(){
	var updatedLocation: Vector3 = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y - zoomingIncrement, thisCamera.transform.position.z + zoomingIncrement);
	thisCamera.transform.position = Vector3.MoveTowards(thisCamera.transform.position, updatedLocation, speedOfZoom);
}

private static function ZoomOut(){
	var updatedLocation: Vector3 = new Vector3( thisCamera.transform.position.x, thisCamera.transform.position.y + zoomingIncrement, thisCamera.transform.position.z - zoomingIncrement );
	thisCamera.transform.position = Vector3.MoveTowards(thisCamera.transform.position, updatedLocation, speedOfZoom);
}