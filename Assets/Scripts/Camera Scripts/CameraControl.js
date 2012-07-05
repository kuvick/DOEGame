#pragma strict

// Attributes:

private var thisCamera: Camera;

	// Variables used in dragging the camera:
private var clickStarted: boolean;
private var lastMousePos: Vector3;
private var currentMousePos : Vector3;
private var clickStartedOnTerrain: boolean;

	// Variables used in raycast
private var cameraRay: Ray;
private var mouseClickTarget: RaycastHit;


	// Variables used for centering camera
private var centerMousePos: Vector3;
private var centeringCamera: boolean;


	// Variables for altering the camera's movement
public var speed: float = 50;							// affects the speed of the scroll
public var centeringDistanceAway: float = 300;			// the distance away from the object the player has double-clicked on
public var closestZoomDistance: float = 50;				// the closest distance from terrain the camera can zoom
public var farthestZoomDistnace: float = 300;			// the farthest distance from terrain the camera can zoom
public var zoomingIncrement: float = 10;					// the incremental distance the camera will zoom in/zoom out
public var direction: int = 1;							// change to -1 to reverse the direction of the drag
public var allowCentering: boolean = true;					// enable/disable double-click to center camera on location


function Start ()
{
	thisCamera = Camera.main;
	clickStarted = false;
	centeringCamera = false;
	clickStartedOnTerrain = true; 

}

	// Update: calls the functions responsible for movement
	// Sees if the user is clicking
	function Update ()
	{
		
		
		//Raycast:
		cameraRay = thisCamera.ScreenPointToRay(Input.mousePosition);
		Physics.Raycast( cameraRay.origin, cameraRay.direction, mouseClickTarget);
		
		
		//If the camera is currently not centering on a user-specified location:
		if( !centeringCamera )
		{
			// If (1) the user has started dragging and has the left mouse button pressed or
			// (2) Hasn't clicked something that's not the terrain, has the left button pressed,
			// and the object that the mouse is now over is the terrain:
			if( ( clickStarted && Input.GetKey(KeyCode.Mouse0) ) || ( clickStartedOnTerrain && Input.GetKey(KeyCode.Mouse0) && mouseClickTarget.transform.name == "Terrain" ) )
			{
				drag();
			}
			// If button is pressed, the click hasn't started, and (assumed) user did not start click on Terrain
			else if( Input.GetKey(KeyCode.Mouse0) && !clickStarted )
			{
				clickStartedOnTerrain = false;
				clickStarted = false;
			}
			else
			{
				clickStartedOnTerrain = true;
				clickStarted = false;
			}
			
			
			

			if( Input.GetAxis("Mouse ScrollWheel") != 0)
			{
				zoom();
			}

		}
		else
		{
			
			center();
			
		}
		
	
		
	
	}// End of Update
	
	
	
	// The function uses the difference in the mouse's position between frames
	// to determine which way to drag the camera, and moves the camera in that direction.
	private function drag()
	{
		// Sets the currentMousePos to the mouse's current position when the click starts
		if(!clickStarted)
		{
			clickStarted = true;
			currentMousePos = Input.mousePosition;
		}
		// Continues to move the camera towards the new position based upon the difference in location
		// of the mouse between frames.
		else
		{
			
			lastMousePos = currentMousePos;
			currentMousePos = Input.mousePosition;
			thisCamera.transform.position = Vector3.MoveTowards(thisCamera.transform.position, dragToPosition(), speed);
		}

	}// End of drag
	

	// The function creates a vector based on the the "deltaPosition" of the
	// mouse (will become deltaPosition in Touch for mobile), and adds this
	// to the camera's current position for a location to move the camera to
	private function dragToPosition(): Vector3
	{
		var changeInPos: Vector3 = ( lastMousePos - currentMousePos ) * direction;
		var temp: Vector3 =  Vector3( changeInPos.x, 0, changeInPos.y );
		return thisCamera.transform.position + temp;
		
	}// End of dragToPosition

	
	// This function is used to zoom the camera in and out.
	// Assumes the camera is at a 45 degree angle towards the terrain.
	private function zoom()
	{
		var updatedLocation: Vector3;
		
		//Zoom Out:
		if(Input.GetAxis("Mouse ScrollWheel") < 0 && thisCamera.transform.position.y < farthestZoomDistnace)
		{
			updatedLocation = new Vector3( thisCamera.transform.position.x, thisCamera.transform.position.y + zoomingIncrement, thisCamera.transform.position.z - zoomingIncrement );
			thisCamera.transform.position = Vector3.MoveTowards(thisCamera.transform.position, updatedLocation, speed);
		}
		//Zoom In:
		else if(Input.GetAxis("Mouse ScrollWheel") > 0 && thisCamera.transform.position.y > closestZoomDistance )
		{
			updatedLocation = new Vector3( thisCamera.transform.position.x, thisCamera.transform.position.y - zoomingIncrement, thisCamera.transform.position.z + zoomingIncrement );
			thisCamera.transform.position = Vector3.MoveTowards(thisCamera.transform.position, updatedLocation, speed);
		}
		
	}// End of zoom
	
	// This function will move the camera to the indicated position for
	// centering the camera (vector created in OnGUI) until it is within 1
	// unit, then it will set centeringCamera to false and allow for dragging
	// again.
	private function center()
	{
		if( Mathf.Abs(Vector3.Distance(thisCamera.transform.position, centerMousePos)) > 1)
		{
			thisCamera.transform.position = Vector3.MoveTowards(thisCamera.transform.position, centerMousePos, speed);
		}
		else
		{
			centeringCamera = false;
		}
			
		
	}// End of center
	

	// This function is used to detect the double-click from the user, used
	// for centering the screen on a user-specified location.
	function OnGUI()
	{
		if( allowCentering )
		{
	        var e: Event = Event.current;
	        if (e.isMouse && !clickStarted && e.clickCount == 2)
			{
	
				centerMousePos = new Vector3(mouseClickTarget.point.x, thisCamera.transform.position.y, mouseClickTarget.point.z - centeringDistanceAway);
				centeringCamera = true;
				
				
			}
		}
            
        
    }// End of OnGUI