#pragma strict

/*
	InputController.js
	----------------------------------------------
	Respnsible for detecting all input and calling relevent functions based on that Input

	- Based off of Penelope camera and control tutorial for unity iPhone

	Deployment Notes:
	-- Attach to camera for now, but that doesn't really make sense.
*/

// The input detection is based off of these states
enum ControlState {
	WaitingForFirstTouch, // there are no fingers down
	WaitingForSecondTouch, // there is one finger down and we are waiting to see if user presses down another for 2 touch actions
	WaitingForMovement, // the user has pressed 2 fingers down and we are waiting to see what gesture is performed
	DragingCamera, // the user has one finger down and is moving across the screen greater than some minimum amount
	ZoomingCamera, // The state that occurs when the user move two fingers in opposite directions to zoom in and out
	WaitingForNoFingers // The final state where the user's input has been performed but the user is still touching the screen
}

// General input system settings to be altered as seen fit
var minimumTimeUntilMove = .25; // the time in seconds that we will wait for the user to move before we interprate as a tap
var minimumMovementDistance: float = 5; // the amount of posisiton change in a single touh gesture before it is considered a drag
var zoomEnabled: boolean = true; 
var zoomEpsilon: float = 25; // 

private var state = ControlState.WaitingForFirstTouch;

// Used for touch controls
private var fingerDown : int[] = new int[ 2 ];
private var fingerDownPosition : Vector2[] = new Vector2[ 2 ];
private var fingerDownFrame : int[] = new int[ 2 ];
private var firstTouchTime : float;
var touchCount : int;

// this will point to the funciton that will perform input checking based on the device
private var typeOfInput: function();


function ResetControlState() {
	state = ControlState.WaitingForFirstTouch;
	fingerDown[ 0 ] = -1;
	fingerDown[ 1 ] = -1;
}

function Start () {
	ResetControlState();
	// Check what type of input we should be expecting
	// if we are running on android or iOS then use touch controls else
	// it is assumed this game will be ran on mobile or computers and thus other device inputs are not accounted for
	if (Application.platform == RuntimePlatform.Android || Application.platform == RuntimePlatform.IPhonePlayer){
		typeOfInput = function(){HandleMobileInput();};
	} else {
		typeOfInput = function(){HandleComputerInput();};
	}
}

function HandleMobileInput(){
	touchCount = Input.touchCount;
    if ( touchCount == 0 ){
        ResetControlState();
    } else{
        var i : int;
        var touch : Touch;
        var theseTouches = Input.touches;
        
        var touch0 : Touch;
        var touch1 : Touch;
        var gotTouch0 = false;
        var gotTouch1 = false;          
        
        // Check if we got the first finger down
        if (state == ControlState.WaitingForFirstTouch){
            for (i = 0; i < touchCount; i++){
                touch = theseTouches[ i ];

                if (touch.phase != TouchPhase.Ended &&
                     touch.phase != TouchPhase.Canceled ){
                    state = ControlState.WaitingForSecondTouch;
                    firstTouchTime = Time.time;
                    fingerDown[ 0 ] = touch.fingerId;
                    fingerDownPosition[ 0 ] = touch.position;
                    fingerDownFrame[ 0 ] = Time.frameCount;
                    break; // break out of the rest of the checks for efficiency
                }
            }
        }
        
        // Wait to see if a second finger touches down. Otherwise, we will
        // register this as a tap                                   
        if ( state == ControlState.WaitingForSecondTouch ){
            for ( i = 0; i < touchCount; i++ ){
                touch = theseTouches[ i ];

                if ( touch.phase != TouchPhase.Canceled ){
                    if ( touchCount >= 2 && touch.fingerId != fingerDown[ 0 ] ){
                        // If we got a second finger, then let's see what kind of 
                        // movement occurs
                        state = ControlState.WaitingForMovement;
                        fingerDown[ 1 ] = touch.fingerId;
                        fingerDownPosition[ 1 ] = touch.position;
                        fingerDownFrame[ 1 ] = Time.frameCount;                                         
                        break;
                    } else if ( touchCount == 1 ) {
                        var deltaSinceDown = touch.position - fingerDownPosition[ 0 ];
                        Debug.Log("delta = " + deltaSinceDown);
                        
                        // if we are looking at the right finger
                        if (touch.fingerId == fingerDown[ 0 ]) {
	                        // Either the finger is held down long enough to count
	                        // as a move or it is lifted, which is also a tap. 
	                        if (Time.time > firstTouchTime + minimumTimeUntilMove || 
	                             touch.phase == TouchPhase.Ended){
	                             
	                             Debug.Log("Place : we have a tap");
	                            // since gui coordinates and screen coordinates differ, we need to convert the mouse position into the toolbar's rectangle gui coordinates
								var mousePos: Vector2;
								mousePos.x = Screen.width-Input.mousePosition.x;
								mousePos.y = Screen.height-Input.mousePosition.y;
	
	                            // At this point the user has indicated a tap on a point on the screen
	                            // we need to check if the point overlaps with a gui element
	                            // if it does then we do nothing and let the gui handle it, otherwise
	                            // we let the builing interaction manager handle it
	                            if (ToolBar.NotOnGui(mousePos)){
	                            	Debug.Log("Place: it is not on the gui");
	                            	BuildingInteractionManager.HandleTapAtPoint(mousePos);
	                            }
	                            state = ControlState.WaitingForNoFingers;
	                            break;
	                        } else if (deltaSinceDown.x > minimumMovementDistance || deltaSinceDown.y > minimumMovementDistance){ // else if the single touch has moved more than the minimum amount we take it to be a drag
	                        	Debug.Log("Drag");
	                        	state = ControlState.DragingCamera;
	                        	break;
	                        }
	                    }                                           
                    }
                }
            }
        }
        
        // Now that we have two fingers down, let's see what kind of gesture is made                    
        if ( state == ControlState.WaitingForMovement ) {  
            // See if we still have both fingers    
            for ( i = 0; i < touchCount; i++ ) {
                touch = theseTouches[ i ];

                if ( touch.phase == TouchPhase.Began ){
                    if ( touch.fingerId == fingerDown[ 0 ] && 
                    	 fingerDownFrame[ 0 ] == Time.frameCount )
                        // We need to grab the first touch if this
                        // is all in the same frame, so the control 
                        // state doesn't reset.
                        touch0 = touch;
                        gotTouch0 = true;
                } else if ( touch.fingerId != fingerDown[ 0 ] && 
                			touch.fingerId != fingerDown[ 1 ] ){
                    // We still have two fingers, but the second
                    // finger was lifted and touched down again
                    fingerDown[ 1 ] = touch.fingerId;
                    touch1 = touch;
                    gotTouch1 = true;
                }
            }
                                                                
            if ( touch.phase == TouchPhase.Moved || 
            	 touch.phase == TouchPhase.Stationary || 
                 touch.phase == TouchPhase.Ended ) {
                if ( touch.fingerId == fingerDown[ 0 ] ){
                    touch0 = touch;
                    gotTouch0 = true;
                } else if ( touch.fingerId == fingerDown[ 1 ] ) {
                    touch1 = touch;
                    gotTouch1 = true;
                }
            }
            
            if ( gotTouch0 ){
	            if ( gotTouch1 ){
	                var originalVector = fingerDownPosition[ 1 ] - fingerDownPosition[ 0 ];
	                var currentVector = touch1.position - touch0.position;
	                
	                // If we are zooming
	                if ( state == ControlState.WaitingForMovement ){
	                    var deltaDistance = originalVector.magnitude - currentVector.magnitude;
	                    if ( Mathf.Abs( deltaDistance ) > zoomEpsilon ){
	                        // The distance between fingers has changed enough
	                        // to count this as a pinch
	                        state = ControlState.ZoomingCamera;
	                    }
	                }               
	            }
	        } else {
	            // A finger was lifted, so let's just wait until we have no fingers
	            // before we reset to the origin state
	            state = ControlState.WaitingForNoFingers;
	        }
        }
        
        if (state == ControlState.DragingCamera){
        	Debug.Log("dragging");
        	// Call old camera dragging here
        }
        
        // Now that we are zooming the camera, let's keep
	    // feeding those changes until we no longer have two fingers
	    if ( state == ControlState.ZoomingCamera ){
	        for ( i = 0; i < touchCount; i++ ){
	            touch = theseTouches[ i ];
	
	            if ( touch.phase == TouchPhase.Moved || 
	            	 touch.phase == TouchPhase.Stationary || 
	            	 touch.phase == TouchPhase.Ended ){
	                if ( touch.fingerId == fingerDown[ 0 ] ){
	                    touch0 = touch;
	                    gotTouch0 = true;
	                } else if ( touch.fingerId == fingerDown[ 1 ] ){
	                    touch1 = touch;
	                    gotTouch1 = true;
	                }
	            }
	        }
	        
	        if ( gotTouch0 ){
	            if ( gotTouch1 ){
	                //CameraControl( touch0, touch1 );
	            }
	        } else {
	            // A finger was lifted, so let's just wait until we have no fingers
	            // before we reset to the origin state
	            state = ControlState.WaitingForNoFingers;
	        }
	    } 
    }       
        
    
}

function HandleComputerInput(){
	// TODO
}

function Update () {  
	typeOfInput();          
}