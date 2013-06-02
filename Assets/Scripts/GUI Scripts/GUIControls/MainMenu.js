/**********************************************************
MainMenu.js

Description: 

Author: Francis Yuan
**********************************************************/
#pragma strict

public class MainMenu extends GUIControl
{

	// For testing different camera angles
	public var testCameras : boolean = false;
	public var cameraLocations : List.<GameObject>;
	private var currentCamera : int;
	public var mainCameraObject : GameObject;


	// Skin for Main Menu
	public var mainMenuSkin:GUISkin;
			
	// Main Menu Rectangles
	private var pauseButton:Rect;   		
	private var waitButton:Rect; 				
	private var undoButton:Rect;				
	private var scoreRect:Rect;
	private var turnRect:Rect;
	private var zoomButton:Rect;
	
	// Main Menu Scaling
	private var hexButtonHeightPercent:float = 0.2;		// Height of the hex button font as a percentage of screen height
	private var scoreFontHeightPercent:float = 0.04;	// Height of the score font as a percentage of screen height
	private var pauseFontHeightPercent:float = 0.03;	// Height of the pausefont as a percentage of screen height
				
	private var hexButtonHeight:float;					
	private var scoreFontHeight:float;			
	private var pauseFontHeight:float;		
	
	// Main Menu Textures
	private var undoTexture:Texture;				
	private var waitTexture:Texture;								
	
	public var undoTexture_Inactive:Texture;			
	public var undoTexture_Active:Texture;				
	public var waitTexture_Inactive:Texture;
	public var waitTexture_Active:Texture;		
	public var zoomInTexture:Texture;	
	public var zoomOutTexture:Texture;	
	
	// Score and turn ints
	private var score:int;
	private var turn:int;
	private var intelSystem : IntelSystem;
	
	var cameraMain : CameraControl;
	
	public function Start () 
	{
		super.Start();
		
		// If testing different camera angles, going through and adding
		// the cameras to the list.
		if(testCameras)
		{
			// index of current camera
			currentCamera = 0;
			
			// getting the original camera's information
			mainCameraObject = GameObject.Find("Main Camera");
			cameraLocations.Add(mainCameraObject);
			
			// collecting the different cameras for testing
			for(var camera : GameObject in GameObject.FindGameObjectsWithTag("TestCamera"))
			{
				camera.camera.enabled = false;
				cameraLocations.Add(camera);
			}
			
			Debug.Log("# of Cameras to test: " + cameraLocations.Count);
		}// end of if(testCameras)
		
	}
	
	// For when the level is loaded and there is an intel system
	public function LoadLevelReferences()
	{
		if (GameObject.Find("Database") != null){
      		intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
      		score = intelSystem.getPrimaryScore();
    	} 
	}
	
	public function Initialize()
	{	
		super.Initialize();
		
	    if (intelSystem == null) {
    		LoadLevelReferences();
    	} 

		hexButtonHeight = hexButtonHeightPercent * screenHeight;
		var totalButtonPadding : float = hexButtonHeight + padding;
		
		scoreFontHeight = scoreFontHeightPercent * screenHeight;
		mainMenuSkin.label.fontSize = scoreFontHeight;
		
		pauseFontHeight = pauseFontHeightPercent * screenHeight;
		mainMenuSkin.button.fontSize = pauseFontHeight;
		
		pauseButton = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, hexButtonHeight, hexButtonHeight);														
		waitButton = Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - (1.7 * totalButtonPadding), hexButtonHeight, hexButtonHeight);						
		var undoButtonPos:Vector2 = HexCalc(Vector2(waitButton.x, waitButton.y), hexButtonHeight, 3);
		undoButton = Rect(undoButtonPos.x, undoButtonPos.y, hexButtonHeight , hexButtonHeight);																					
		zoomButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, horizontalBarHeight + screenHeight - totalButtonPadding, hexButtonHeight, hexButtonHeight); 	
		//zoomButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, horizontalBarHeight + screenHeight - totalButtonPadding - hexButtonHeight, hexButtonHeight, hexButtonHeight); 	
		
		scoreRect = Rect(verticalBarWidth + screenWidth - padding, horizontalBarHeight + padding, 0, 0);
		turnRect = Rect(verticalBarWidth + screenWidth - padding, horizontalBarHeight + (2 * padding) + scoreFontHeight, 0, 0);
		
		// Add the buttons' rects to the rectList for checking input collision
		rectList.Add(pauseButton);
		rectList.Add(waitButton);
		rectList.Add(undoButton);
		rectList.Add(zoomButton);	
			
		cameraMain = GameObject.Find("Main Camera").GetComponent(CameraControl);	
		if(!testCameras)
		{
			cameraMain.testingCameras = false;
		}
		else
		{
			cameraMain.testingCameras = true;
		}	
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.inGameMusic;
	}
	
	public function Render()
	{   
		GUI.skin = mainMenuSkin;
		
		score = intelSystem.getPrimaryScore() + intelSystem.getOptionalScore();
		
		// Set icon textures to default
		waitTexture = waitTexture_Inactive;
		undoTexture = undoTexture_Inactive;
		
		// Calculate the mouse position
		var mousePos:Vector2;
		mousePos.x = Input.mousePosition.x;
		mousePos.y = Screen.height - Input.mousePosition.y;
	    
	    // If the mouse or the finger is hovering/tapping one of the buttons, change the button's texture
		if (waitButton.Contains(mousePos))
		{
			waitTexture = waitTexture_Active;
		}
		
		if (undoButton.Contains(mousePos))
		{
			undoTexture = undoTexture_Active;
		}
		
		// Draw the buttons and respond to interaction
		if(GUI.Button(pauseButton, "Pause"))
		{
			currentResponse.type = EventTypes.PAUSE;
		}
		
		if(GUI.Button(waitButton, waitTexture))
		{
			currentResponse.type = EventTypes.WAIT;
			//currentResponse.type = EventTypes.BUILDING;
		}
		
		if(GUI.Button(undoButton, undoTexture))
		{
			SoundManager.Instance().playButtonClick();
			
			currentResponse.type = EventTypes.UNDO;
		}
		
		if(Input.GetKeyDown(KeyCode.M))
		{
			currentResponse.type = EventTypes.METRIC;
		}
		
		if (!testCameras && GUI.Button(zoomButton, (cameraMain.zoomedIn ? zoomOutTexture : zoomInTexture)))
		{
			PlayButtonPress();	 
			cameraMain.ToggleZoomType();
		}
		// *** FOR TESTING CAMERAS, TO LOOP THROUGH VARIOUS ONES ***
		else if(testCameras  && GUI.Button(zoomButton, (cameraMain.zoomedIn ? zoomOutTexture : zoomInTexture)))
		{
			// "Powering down" previous camera:
			cameraLocations[currentCamera].camera.tag = "TestCamera";
			cameraLocations[currentCamera].camera.enabled = false;
			
			currentCamera = (currentCamera + 1) % cameraLocations.Count;
			
			// "Powering up" next camera:
			cameraLocations[currentCamera].camera.enabled = true;
			cameraLocations[currentCamera].camera.tag = "MainCamera";
			
			var cameraComp : CameraControl = cameraLocations[currentCamera].camera.GetComponent(CameraControl);
			cameraComp.setCamera(cameraLocations[currentCamera].camera);
			cameraMain = cameraComp;
				
		}
		// *** End for testing cameras ***
		
		GUI.Label(scoreRect, score.ToString());
		if(intelSystem != null)
		{
			GUI.Label(turnRect, "Turn: " + intelSystem.currentTurn);
		}
	}
	
	private function HexCalc(position:Vector2, length:float, side:int):Vector2
	{
		var angle = (90 - (side * 60) + 30) * Mathf.PI/180;
		var offsetLength = length * 0.85;
		var sin = Mathf.Sin(angle) * offsetLength;
		var cos = Mathf.Cos(angle) * offsetLength;
		
		var newPosition:Vector2 = Vector2(position.x + cos, position.y - sin);
		
		return newPosition;
	}
}
