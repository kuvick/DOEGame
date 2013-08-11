/*
 CameraControl.js
 (Originally) By Katharine Uvick
 
 This script allows for panning the camera via drag and zooming
 
 Attach this script to the camera.
*/

#pragma strict

static private var hexOrigin: Vector3;
static private var thisCamera: Camera;

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
public var cameraHeight = 400;
public var setCameraToFarCorner = true;
static public var cameraAngle : float = 60;

public var showCameraLocation : boolean = false;

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
	thisCamera = this.camera;
	
	// Setting camera for the current standard
	thisCamera.orthographic = true;
	thisCamera.orthographicSize = 250;
	thisCamera.transform.eulerAngles = Vector3(45,45,0);
	//*************
	
	
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
	
	//thisCamera.transform.position = new Vector3(cameraStartObject.transform.position.x, thisCamera.transform.position.y, cameraStartObject.transform.position.z);
	
	if(!useDefaultAspectRatio)
		if(aspectRatioWidth != 0 && aspectRatioHeight != 0)
			thisCamera.aspect = (aspectRatioWidth / aspectRatioHeight);
			
	//Adjusts the camera so it's at the far bottom right corner of the camera bounds, to avoid a sudden jump if outside the box when the player first drags
	if(setCameraToFarCorner)
		thisCamera.transform.position = new Vector3(borderCenterPosition.x - borderDimensions.x / 2, cameraHeight, borderCenterPosition.z - borderDimensions.z / 2) ;
}

// The function uses the difference in the mouse's position between frames
// to determine which way to drag the camera, and moves the camera in that direction.
static public function Drag(currentInputPos: Vector2){
	
	// Perspective Camera:
	//thisCamera.transform.Translate(new Vector3(currentInputPos.x, 0, currentInputPos.y), Space.World);
	
	// Orthographic Camera:
	
	
	var r : float = Mathf.Sqrt(currentInputPos.x * currentInputPos.x + currentInputPos.y * currentInputPos.y);
	var degree:float = (Mathf.PI / 180) * 45;
	var degree2:float = (Mathf.PI / 180) * 315;
	
	var moveX : float = (currentInputPos.x * Mathf.Sin(degree)) + (currentInputPos.y * Mathf.Sin(degree));
	var moveZ : float = (-currentInputPos.x * Mathf.Cos(degree)) + (currentInputPos.y * Mathf.Cos(degree));
	
	//thisCamera.transform.Translate(new Vector3(currentInputPos.y * Mathf.Sin(degree), 0, currentInputPos.y * Mathf.Cos(degree)), Space.World);
	thisCamera.transform.Translate(new Vector3(moveX, 0, moveZ), Space.World);
	
	
	
	//Debug.Log("Input Pos: " + currentInputPos);
	
	var totalDimensions: Vector2 = HexagonGrid.totalTileDimensions();
	
	// The camera's position as if it were not rotated
	var nonRotatedPos : Vector3 = new Vector3((thisCamera.transform.position.x - bCP.x) * Mathf.Cos((Mathf.PI / 180) * 45)
									- (thisCamera.transform.position.z - bCP.z) * Mathf.Sin((Mathf.PI / 180) * 45) + bCP.x,
									thisCamera.transform.position.y,
									(thisCamera.transform.position.x - bCP.x) * Mathf.Sin((Mathf.PI / 180) * 45)
									+ (thisCamera.transform.position.z - bCP.z) * Mathf.Cos((Mathf.PI / 180) * 45) + bCP.z);
									
	//Left
	if(nonRotatedPos.x < (bCP.x - (bD.x / 2)))
	{
		//thisCamera.transform.position = new Vector3(bCP.x - (bD.x / 2), thisCamera.transform.position.y, thisCamera.transform.position.z);
		
		
		thisCamera.transform.position = new Vector3(((-bD.x / 2)) * Mathf.Cos((Mathf.PI / 180) * -45)
									- (nonRotatedPos.z - bCP.z) * Mathf.Sin((Mathf.PI / 180) * -45) + bCP.x,
									thisCamera.transform.position.y,
									((-bD.x / 2)) * Mathf.Sin((Mathf.PI / 180) * -45)
									+ (nonRotatedPos.z - bCP.z) * Mathf.Cos((Mathf.PI / 180) * -45) + bCP.z);
		Debug.Log("Left");									
	}
	//Right
	if(nonRotatedPos.x > (bCP.x + (bD.x / 2)))
	{
		//thisCamera.transform.position = new Vector3(bCP.x + (bD.x / 2), thisCamera.transform.position.y, thisCamera.transform.position.z);
		
		thisCamera.transform.position = new Vector3(((bD.x / 2)) * Mathf.Cos((Mathf.PI / 180) * -45)
									- (nonRotatedPos.z - bCP.z) * Mathf.Sin((Mathf.PI / 180) * -45) + bCP.x,
									thisCamera.transform.position.y,
									((bD.x / 2)) * Mathf.Sin((Mathf.PI / 180) * -45)
									+ (nonRotatedPos.z - bCP.z) * Mathf.Cos((Mathf.PI / 180) * -45) + bCP.z);
		Debug.Log("Right");
	}
	//Top
	if(nonRotatedPos.z > (bCP.z + (bD.z / 2)))
	{
		//thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, bCP.z + (bD.z / 2));
		
		thisCamera.transform.position = new Vector3(((nonRotatedPos.x - bCP.x)) * Mathf.Cos((Mathf.PI / 180) * -45)
									- (bD.z / 2) * Mathf.Sin((Mathf.PI / 180) * -45) + bCP.x,
									thisCamera.transform.position.y,
									(nonRotatedPos.x - bCP.x) * Mathf.Sin((Mathf.PI / 180) * -45)
									+ (bD.z / 2) * Mathf.Cos((Mathf.PI / 180) * -45) + bCP.z);
		Debug.Log("Top");
									
	}
	//Bottom
	if(nonRotatedPos.z < (bCP.z - (bD.z / 2)))
	{
		//thisCamera.transform.position = new Vector3(thisCamera.transform.position.x, thisCamera.transform.position.y, bCP.z - (bD.z / 2));
				thisCamera.transform.position = new Vector3(((nonRotatedPos.x - bCP.x)) * Mathf.Cos((Mathf.PI / 180) * -45)
									- (-bD.z / 2) * Mathf.Sin((Mathf.PI / 180) * -45) + bCP.x,
									thisCamera.transform.position.y,
									(nonRotatedPos.x - bCP.x) * Mathf.Sin((Mathf.PI / 180) * -45)
									+ (-bD.z / 2) * Mathf.Cos((Mathf.PI / 180) * -45) + bCP.z);
		Debug.Log("Bottom");
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
	
	// For perspective camera:
	//Gizmos.DrawWireCube(borderCenterPosition, borderDimensions);

	// Finding the corners of the rotated rect. view
	var corner1 : Vector3 = new Vector3(borderCenterPosition.x + (borderDimensions.x / 2) * Mathf.Cos((Mathf.PI / 180) * -45)
										- (borderDimensions.z / 2) * Mathf.Sin((Mathf.PI / 180) * -45),
										10,
										borderCenterPosition.z + (borderDimensions.x / 2) * Mathf.Sin((Mathf.PI / 180) * -45)
										+ (borderDimensions.z / 2) * Mathf.Cos((Mathf.PI / 180) * -45));
										
	var corner2 : Vector3 = new Vector3(borderCenterPosition.x + (borderDimensions.x / 2) * Mathf.Cos((Mathf.PI / 180) * -45)
										- (- borderDimensions.z / 2) * Mathf.Sin((Mathf.PI / 180) * -45),
										10,
										borderCenterPosition.z + (borderDimensions.x / 2) * Mathf.Sin((Mathf.PI / 180) * -45)
										+ (- borderDimensions.z / 2) * Mathf.Cos((Mathf.PI / 180) * -45));
	var corner3 : Vector3 = new Vector3(borderCenterPosition.x + (-borderDimensions.x / 2) * Mathf.Cos((Mathf.PI / 180) * -45)
										- (borderDimensions.z / 2) * Mathf.Sin((Mathf.PI / 180) * -45),
										10,
										borderCenterPosition.z + (-borderDimensions.x / 2) * Mathf.Sin((Mathf.PI / 180) * -45)
										+ (borderDimensions.z / 2) * Mathf.Cos((Mathf.PI / 180) * -45));
	var corner4 : Vector3 = new Vector3(borderCenterPosition.x + (-borderDimensions.x / 2) * Mathf.Cos((Mathf.PI / 180) * -45)
										- (- borderDimensions.z / 2) * Mathf.Sin((Mathf.PI / 180) * -45),
										10,
										borderCenterPosition.z + (-borderDimensions.x / 2) * Mathf.Sin((Mathf.PI / 180) * -45)
										+ (- borderDimensions.z / 2) * Mathf.Cos((Mathf.PI / 180) * -45));
	
	Gizmos.DrawLine(corner1, corner2);
	Gizmos.DrawLine(corner2, corner4);
	Gizmos.DrawLine(corner3, corner4);
	Gizmos.DrawLine(corner3, corner1);

	if(showCameraLocation)
	{
		var cameraLoc : Vector3 = new Vector3(this.camera.transform.position.x, 0, this.camera.transform.position.z);
		Gizmos.DrawCube(cameraLoc, new Vector3(25, 50, 25));	
	}
	
}