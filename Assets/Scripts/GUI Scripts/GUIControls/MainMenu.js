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
	//private var pauseFontHeightPercent:float = 0.03;	// Height of the pausefont as a percentage of screen height
	private var pauseButtonHeightPercent:float = 0.14;
				
	private var hexButtonHeight:float;					
	private var scoreFontHeight:float;			
	//private var pauseFontHeight:float;		
	private var pauseButtonHeight:float;
	
	// Main Menu Textures
	public var undoTexture:Texture;				
	public var waitTexture:Texture;								
	
	//public var undoTexture:Texture;			
	//public var undoTexture_Active:Texture;				
	//public var waitTexture:Texture;
	//public var waitTexture_Active:Texture;		
	//public var zoomInTexture:Texture;	
	//public var zoomOutTexture:Texture;
	
	public var pauseTexture : Texture;
	
	// Score and turn ints
	private var score:int;
	private var turn:int;
	private var intelSystem : IntelSystem;
	
	var cameraMain : CameraControl;
	
	//Data Pieces System
	public var dataIconBG:Texture;
	public var dataIcon01:Texture;
	public var dataIcon02:Texture;
	public var dataIcon03:Texture;
	private var numOfDataPieces:int = 0;
	private var dataIconHeightPercent:float = 0.14;
	private var dataIconHeight:float;
	private var dataRect:Rect;
	
	
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
		
		pauseButtonHeight = pauseButtonHeightPercent * screenHeight;
		
		scoreFontHeight = scoreFontHeightPercent * screenHeight;
		
		dataIconHeight = dataIconHeightPercent * screenHeight;
		
		mainMenuSkin.label.fontSize = scoreFontHeight;
		
		//pauseFontHeight = pauseFontHeightPercent * screenHeight;
		//mainMenuSkin.button.fontSize = pauseFontHeight;
		
		pauseButton = Rect(screenWidth + verticalBarWidth - padding - pauseTexture.width, horizontalBarHeight + padding, pauseTexture.width, pauseTexture.height);														
		undoButton = Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - padding - undoTexture.height, undoTexture.width, undoTexture.height);
		
		//var undoButtonPos:Vector2 = HexCalc(Vector2(waitButton.x, waitButton.y), hexButtonHeight, 3);
		 waitButton = Rect(screenWidth - (verticalBarWidth + padding + waitTexture.width), horizontalBarHeight + screenHeight - padding - waitTexture.height, waitTexture.width, waitTexture.height);
		//zoomButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, horizontalBarHeight + screenHeight - totalButtonPadding, hexButtonHeight, hexButtonHeight); 	
		//zoomButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, horizontalBarHeight + screenHeight - totalButtonPadding - hexButtonHeight, hexButtonHeight, hexButtonHeight); 	
		
		scoreRect = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, 0, 0);
		turnRect = Rect(verticalBarWidth + padding, horizontalBarHeight + (2 * padding) + scoreFontHeight, 0, 0);
		
		dataRect = Rect(screenWidth / 2 - (dataIconBG.width/2), horizontalBarHeight + padding, dataIconBG.width, dataIconBG.height);
		
		// Add the buttons' rects to the rectList for checking input collision
		rectList.Add(pauseButton);
		rectList.Add(waitButton);
		rectList.Add(undoButton);
		//rectList.Add(zoomButton);
			
		cameraMain = GameObject.Find("Main Camera").GetComponent(CameraControl);	
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.inGameMusic;
		numOfDataPieces = 0;
		
		// if we're going to allow 2 or 3 pieces than just 3 pieces, there needs to be some sort of code
		// here that detects how many pieces there are and decides to use which set
	}
	
	public function Render()
	{   
		GUI.skin = mainMenuSkin;
		
		if(GameObject.Find("Database") != null && intelSystem == null)
		{
			intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
      		score = intelSystem.getPrimaryScore() + intelSystem.getOptionalScore();
  		}
  		
		if(intelSystem != null)
			score = intelSystem.getPrimaryScore() + intelSystem.getOptionalScore();
		
		
		GUI.DrawTexture(dataRect,dataIconBG);
		
		// displaying number of data pieces collected
		if(numOfDataPieces >= 1)
		{
			GUI.DrawTexture(dataRect,dataIcon01);
			if(numOfDataPieces >= 2)
			{
				GUI.DrawTexture(dataRect,dataIcon02);
				if(numOfDataPieces >= 3)
				{
					GUI.DrawTexture(dataRect,dataIcon03);
				}
			}
		}
		
		// Draw the buttons and respond to interaction
		if(GUI.Button(pauseButton, pauseTexture))
		{
			currentResponse.type = EventTypes.PAUSE;
		}
		
		if(GUI.Button(waitButton, waitTexture))
		{
			intelSystem.comboSystem.resetComboCount();
			currentResponse.type = EventTypes.WAIT;
			//currentResponse.type = EventTypes.BUILDING;
		}
		
		if(GUI.Button(undoButton, undoTexture))
		{
			intelSystem.comboSystem.resetComboCount();
			SoundManager.Instance().playButtonClick();
			
			currentResponse.type = EventTypes.UNDO;
			//GUIManager.Instance().AddContact();
		}
		
		if(Input.GetKeyDown(KeyCode.M))
		{
			currentResponse.type = EventTypes.METRIC;
		}
		
		
		GUI.Label(scoreRect, score.ToString());
		if(intelSystem != null)
		{
			GUI.Label(turnRect, "Turn: " + intelSystem.currentTurn);
		}
		
		/*
		// Previous GUI:
		
		
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
			//GUIManager.Instance().AddContact();
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
		
		*/
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
	
	// Used to update the number of datapieces the player has collected
	// Give the whole number of pieces so that if the player clicks undo,
	// it will decrement the total number.
	public function updateNumOfDataPieces(numOfPieces : int)
	{
		numOfDataPieces = numOfPieces;
	}
}
