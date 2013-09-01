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
	WaitingForFirstInput, // there are no fingers down/ mouse down
	WaitingForSecondTouch, // there is one finger down and we are waiting to see if user presses down another for 2 touch actions *note this will only occur on mobile
	WaitingForMovement, // the user has pressed 2 fingers down and we are waiting to see what gesture is performed
	DragingCamera, // the user has one finger down/clicked and is moving across the screen greater than some minimum amount
	ZoomingCamera, // The state that occurs when the user move two fingers in opposite directions to zoom in and out or if using mouse when using the wheel
	WaitingForNoInput, // The final state where the user's input has been performed but the user is still touching the screen/ clicking
	DraggingLink
}

// General input system settings to be altered as seen fit
var minimumTimeUntilMove = .25; // the time in seconds that we will wait for the user to move before we interprate as a tap
var minimumMovementDistance: float = 5; // the amount of posisiton change in a single touch gesture/click before it is considered a drag
var zoomEnabled: boolean = true; 
var zoomEpsilon: float = 10;

// some variables to represent zooming in/out
var zoomIn: boolean = true;
var zoomOut: boolean = false;

private var state = ControlState.WaitingForFirstInput;

// Used for touch controls
private var fingerDown : int[] = new int[ 2 ];
private var fingerDownPosition : Vector2[] = new Vector2[ 2 ];
private var fingerDownFrame : int[] = new int[ 2 ];
private var firstTouchTime : float;

// used for mouse
private var firstClickTime: float;
private var clickPosition: Vector2;
private var firstClickPosition : Vector2;
private var hasFirstClick : boolean = false;

private var linkUI : LinkUI;
private var intelSystem : IntelSystem;

var touchCount : int;

// this will point to the funciton that will perform input checking based on the device
private var typeOfInput: function();


public function getState():ControlState
{
	return state;
}

// ------------ These functions will be called when the given event occurs, put any code to be perform on the event in here 
// so you don't have to search in the state machine for the spot
// called whenever a drag occurs
function DragEvent(inputChangeSinceLastTick: Vector2){
	CameraControl.Drag(-inputChangeSinceLastTick);
}

// called when a click/tap occurs
function singleClickEvent(inputPos: Vector2){	
	// At this point the user has indicated a tap on a point on the screen
	// we need to check if the point overlaps with a gui element
	// if it does then we do nothing and let the gui handle it, otherwise
	// we let the builing interaction manager handle it
	if (GUIManager.Instance().NotOnGUI(inputPos) && linkUI.CheckMouseNotOverGUI())//GUIManager.Instance().NotOnOtherGUI())
	{
    	BuildingInteractionManager.HandleTapAtPoint(inputPos);
    }
} 

function ResetControlState() {
	state = ControlState.WaitingForFirstInput;
	fingerDown[ 0 ] = -1;
	fingerDown[ 1 ] = -1;
}

function Start () {
	linkUI = GameObject.Find("Main Camera").GetComponent(LinkUI);
	ResetControlState();
	// Check what type of input we should be expecting
	// if we are running on android or iOS then use touch controls else
	// it is assumed this game will be ran on mobile or computers and thus other device inputs are not accounted for
	if (Application.platform == RuntimePlatform.Android || Application.platform == RuntimePlatform.IPhonePlayer){
		typeOfInput = function(){HandleMobileInput();};
	} else {
		typeOfInput = function(){HandleComputerInput();};
	}
	
	//intelSystem = GameObject.FindWithTag("Database").GetComponent(IntelSystem);
	intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
}

// will detect if the change in input position since the last tick is enough to be accepted as a drag
function DragMovementDetected(movementChange: Vector2){
	// if the x or y is greater than the minimum amount to be considered a drag then return true
	if (Mathf.Abs(movementChange.x) > minimumMovementDistance || Mathf.Abs(movementChange.y) > minimumMovementDistance){
		return (true);
	} else {
		return (false);
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
        if (state == ControlState.WaitingForFirstInput){
            for (i = 0; i < touchCount; i++){
                touch = theseTouches[ i ];

                if (touch.phase != TouchPhase.Ended &&
                     touch.phase != TouchPhase.Canceled ){
                     // now that we have a tap we need to be sure to check if it is on the gui or not
                     if (GUIManager.Instance().NotOnGUI(touch.position)){
	                    state = ControlState.WaitingForSecondTouch;
	                    firstTouchTime = Time.time;
	                    fingerDown[ 0 ] = touch.fingerId;
	                    fingerDownPosition[ 0 ] = touch.position;
	                    fingerDownFrame[ 0 ] = Time.frameCount;
	                    
	                    if(!hasFirstClick){
							firstClickPosition = touch.position;		
							hasFirstClick = true;
							Debug.Log("MODIFIED!");			
						}
	                    break; // break out of the rest of the checks for efficiency
	                }
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
                        
                        // if we are looking at the right finger
                        if (touch.fingerId == fingerDown[ 0 ]) {
	                        // Either the finger is held down long enough to count
	                        // as a move or it is lifted, which is also a tap. 
	                        if (Time.time > firstTouchTime + minimumTimeUntilMove || 
	                             touch.phase == TouchPhase.Ended){
	                            singleClickEvent(deltaSinceDown);
	                            state = ControlState.WaitingForNoInput;
	                            break;
	                            
	                        }
	                  		/*else if(DragMovementDetected(deltaSinceDown) && ModeController.selectedBuilding != null)
							{
								state = ControlState.DraggingLink;		
								break;	
							} */
	                        else if (DragMovementDetected(deltaSinceDown) && BuildingInteractionManager.PointOnBuilding(firstClickPosition) == null){ // else if the single touch has moved more than the minimum amount we take it to be a drag
	                        	state = ControlState.DragingCamera;
	                        	break;
	                        }
	                        else if(DragMovementDetected(deltaSinceDown) && BuildingInteractionManager.PointOnBuilding(firstClickPosition) != null)//ModeController.selectedBuilding != null)
							{
								ModeController.selectedBuilding = BuildingInteractionManager.PointOnBuilding(firstClickPosition);
								state = ControlState.DraggingLink;	
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
	                        state = ControlState.ZoomingCamera;
	                    }
	                }               
	            }
	        } else {
	            // A finger was lifted, so let's just wait until we have no fingers
	            // before we reset to the origin state
	            state = ControlState.WaitingForNoInput;
	        }
        }
        
        if (state == ControlState.DragingCamera){
        	touch = theseTouches[ 0 ];
        	
        	if (touch.phase == TouchPhase.Ended){
        		state = ControlState.WaitingForFirstInput;
        	} else {
	       		deltaSinceDown = touch.position - fingerDownPosition[ 0 ];
	       		fingerDownPosition[ 0 ] = touch.position;
	       		// need to do negative in order to give the feeling of pushing the world underneath your finger
	       		DragEvent(deltaSinceDown);
	        }
        }
        
        if(state == ControlState.DraggingLink)
		{
			touch = theseTouches[ 0 ];
			
			if(touch.phase == TouchPhase.Ended)
			{
				if (GUIManager.Instance().NotOnGUI(touch.position) && linkUI.CheckMouseNotOverGUI())
				{
					BuildingInteractionManager.HandleReleaseAtPoint(touch.position);
			    }
			
				state = ControlState.WaitingForFirstInput;
			}
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
	        
            // A finger was lifted, so let's just wait until we have no fingers
            // before we reset to the origin state
			state = ControlState.WaitingForNoInput;
	    } 
    }    
}

function HandleComputerInput(){

	// if the user has not clicked then keep checking for a click
	if (state == ControlState.WaitingForFirstInput){
		// if a click occurs then start waiting for movement		
		if (Input.GetKey(KeyCode.Mouse0) && GUIManager.Instance().NotOnGUI(Input.mousePosition)) {
			state = ControlState.WaitingForNoInput;
			firstClickTime = Time.time;			
			clickPosition = Input.mousePosition;
			
			if(!hasFirstClick){
				firstClickPosition = Input.mousePosition;		
				hasFirstClick = true;
			}
		}
	}
	
	if (state == ControlState.WaitingForNoInput){
		var deltaSinceDown = Input.mousePosition - clickPosition;
		// if the mouse has moved over the threshhold then consider it a drag
		if (DragMovementDetected(deltaSinceDown) && BuildingInteractionManager.PointOnBuilding(firstClickPosition) == null)//&& ModeController.selectedBuilding == null) {
		{	
			state = ControlState.DragingCamera;			
		} 
		else if(DragMovementDetected(deltaSinceDown) && BuildingInteractionManager.PointOnBuilding(firstClickPosition) != null)//ModeController.selectedBuilding != null)
		{
			ModeController.selectedBuilding = BuildingInteractionManager.PointOnBuilding(firstClickPosition);
			state = ControlState.DraggingLink;				
		}
		else if (!Input.GetKey(KeyCode.Mouse0) /* need to decide if we want a delay auto click Time.time > firstClickTime + minimumTimeUntilMove*/){ // if the mouse has been released or held for the minimum duration then count it as a click
			singleClickEvent(Input.mousePosition);
			state = ControlState.WaitingForFirstInput;
		}
	}
	
	if (state == ControlState.DragingCamera){
		deltaSinceDown = Input.mousePosition - clickPosition;
		clickPosition = Input.mousePosition;
		
		// if the mouse is still down keep dragging the camera
		if (Input.GetKey(KeyCode.Mouse0)){
			DragEvent(deltaSinceDown);
		} else {
			state = ControlState.WaitingForFirstInput;			
		}
	}
	
	
	if(state == ControlState.DraggingLink)
	{
		deltaSinceDown = Input.mousePosition - clickPosition;
		clickPosition = Input.mousePosition;		
		
		//If Button is released
		if(!Input.GetKey(KeyCode.Mouse0))
		{
			if (GUIManager.Instance().NotOnGUI(clickPosition) && linkUI.CheckMouseNotOverGUI())
			{
				BuildingInteractionManager.HandleReleaseAtPoint(clickPosition);				
		    }		 			
			hasFirstClick = false;			
			state = ControlState.WaitingForFirstInput;
		}
	}
}

function Update () {
	if(intelSystem != null && !intelSystem.victory)
		typeOfInput();      
}

public function getTouchLocation()
{
	Debug.Log(fingerDownPosition.ToString());
}