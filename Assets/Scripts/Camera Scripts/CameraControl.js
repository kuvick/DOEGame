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
static public var cameraAngle : float = 60;

public var showCameraLocation : boolean = false;

public var centerOnPoint: Vector3;
public var showCenter: boolean = false;
static private var isCentering: boolean;
private var cameraPosForCentering:Vector3;
private var tolerance: float = 10f;
private var currentCenter: Vector3;
private var speed : float = 5f;

private enum AspectRatios
{
	FourByFive,
	FourByThree,
	ThreeByTwo,
	SixteenByTen,
	SixteenByNine	
};

function Start () {	
	thisCamera = this.camera;
	isCentering = false;
	centerOnPoint = this.camera.ScreenToWorldPoint(Vector3(Screen.width / 2, Screen.height /2, thisCamera.transform.position.y));
	currentCenter = centerOnPoint;
	hexOrigin = HexagonGrid.TileToWorldCoordinates(0,0);
	
	
	// Setting camera for the current standard
	thisCamera.orthographic = true;
	thisCamera.orthographicSize = 250;
	thisCamera.transform.eulerAngles = Vector3(45,45,0);
	//*************
	
	
	if(borderDimensions.x == 0 || borderDimensions.z == 0)
	{
		Debug.LogWarning("Camera Dimensions Not Set. Reverting to Default");
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

}
// The function uses the difference in the mouse's position between frames
// to determine which way to drag the camera, and moves the camera in that direction.
static public function Drag(currentInputPos: Vector2){
	
	isCentering = false;
	// Perspective Camera:
	//thisCamera.transform.Translate(new Vector3(currentInputPos.x, 0, currentInputPos.y), Space.World);
	
	// Orthographic Camera:
	
	
	var currentPos : Vector3 = thisCamera.transform.position;
	
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
									

	
	
	//In a corner:
	if((nonRotatedPos.x < (bCP.x - (bD.x / 2))) && (nonRotatedPos.z > (bCP.z + (bD.z / 2))))
	{
		//Debug.Log("Left and Top");
		thisCamera.transform.position = currentPos;
	}
	else if((nonRotatedPos.x > (bCP.x + (bD.x / 2))) && (nonRotatedPos.z > (bCP.z + (bD.z / 2))))
	{
		//Debug.Log("Right and Top");
		thisCamera.transform.position = currentPos;
	}
	else if((nonRotatedPos.x < (bCP.x - (bD.x / 2))) && (nonRotatedPos.z < (bCP.z - (bD.z / 2))))
	{
		//Debug.Log("Left and Bottom");
		thisCamera.transform.position = currentPos;
	}
	else if((nonRotatedPos.x > (bCP.x + (bD.x / 2))) && (nonRotatedPos.z < (bCP.z - (bD.z / 2))))
	{
		//Debug.Log("Right and Bottom");
		thisCamera.transform.position = currentPos;
	}
	// Not in a corner:
	else
	{
		//Left
		if(nonRotatedPos.x < (bCP.x - (bD.x / 2)))
		{
			//thisCamera.transform.position = new Vector3(bCP.x - (bD.x / 2), thisCamera.transform.position.y, thisCamera.transform.position.z);
			
			
			thisCamera.transform.position = new Vector3(((-bD.x / 2)) * Mathf.Cos((Mathf.PI / 180) * -45)
										- (nonRotatedPos.z - bCP.z) * Mathf.Sin((Mathf.PI / 180) * -45) + bCP.x,
										thisCamera.transform.position.y,
										((-bD.x / 2)) * Mathf.Sin((Mathf.PI / 180) * -45)
										+ (nonRotatedPos.z - bCP.z) * Mathf.Cos((Mathf.PI / 180) * -45) + bCP.z);
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

	if(isCentering)
	{
		var distance: float = Vector3.Distance(thisCamera.transform.position, cameraPosForCentering);
		if(distance > tolerance)
			thisCamera.transform.position = Vector3.Lerp(thisCamera.transform.position, cameraPosForCentering, Time.deltaTime * speed);
		else
			isCentering = false;
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
	
	
	if(showCenter)
	{
		Gizmos.color = Color.blue;
		//centerOnPoint = this.camera.ScreenToWorldPoint(Vector3(Screen.width / 2, Screen.height /2, 433));
		Gizmos.DrawCube(centerOnPoint, new Vector3(25, 50, 25));
		Gizmos.color = Color.yellow;
		Gizmos.DrawCube(currentCenter, new Vector3(25, 50, 25));	
		
	}
	
	
}

public function centerCameraOnPointInWorld(centerPoint : Vector3)
{
	centerOnPoint = centerPoint;
	currentCenter = thisCamera.ScreenToWorldPoint(Vector3(Screen.width / 2, Screen.height /2, thisCamera.transform.position.y + 100));
	centerOnPoint.y = currentCenter.y;
	var difference:Vector3 = Vector3(0,0,0);
	difference.x = Mathf.Abs(currentCenter.x - centerPoint.x);
	difference.z = Mathf.Abs(currentCenter.z - centerPoint.z);
	
	if(currentCenter.x > centerPoint.x)
		difference.x = difference.x * -1f;
	
	if(currentCenter.z > centerPoint.z)
		difference.z = difference.z * -1f;
		
	cameraPosForCentering = thisCamera.transform.position + difference;
	isCentering = true;
}