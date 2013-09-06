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
	
	public var enableHUD:boolean = true;
			
	// Main Menu Rectangles
	private var pauseButton:Rect;   		
	private var waitButton:Rect; 				
	private var undoButton:Rect;				
	private var scoreRect:Rect;
	private var turnRect:Rect;
	private var comboRect:Rect;
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
	public var pauseTexture : Texture;
	
	// Score and turn ints
	private var currentlyDisplayedScore: float;
	private var score:int;	
	private var turn:int;
	private var intelSystem : IntelSystem;
	
	var cameraMain : CameraControl;
	
	//Data Pieces System
	public var dataIconBG:Texture;
	public var dataIcon01:Texture;
	public var dataIcon02:Texture;
	public var dataIcon03:Texture;
	private var dataIconHeightPercent:float = 0.14;
	private var dataIconHeight:float;
	private var dataIcons:List.<Texture> = new List.<Texture>();
	private var dataRect:List.<Rect> = new List.<Rect>();
	private var maxDataIcons : int = 3;
	
	private var upgradeManager : UpgradeManager = null;
	
	private var scoreUpdateTimer = 1;
	private var scoreUpdateTime = 0;
	private var defaultFontColor;
	private var targetFontColor;
		
	private var updateScore = 0.0f;
	private var difference = 0.0f;
	private var startTime = 0;
	private var startScore = 0;
	
	public var victorySplashTimerInSeconds = 5.0f;
	private var victorySplashStartTime = 0;
	private var victorySplashRectangle;
	private var mostRecentTurnScore : int = 0;
	
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
		var hexButtonRatio : float = undoTexture.width / undoTexture.height;
		var hexButtonWidth = hexButtonHeight * hexButtonRatio;
		
		pauseButtonHeight = pauseButtonHeightPercent * screenHeight;
		var pauseButtonRatio : float = pauseTexture.width / pauseTexture.height;
		var pauseButtonWidth = pauseButtonHeight * pauseButtonRatio;
		
		scoreFontHeight = scoreFontHeightPercent * screenHeight;
		
		dataIconHeight = dataIconHeightPercent * screenHeight;
		
		mainMenuSkin.label.fontSize = scoreFontHeight;
		
		//pauseFontHeight = pauseFontHeightPercent * screenHeight;
		//mainMenuSkin.button.fontSize = pauseFontHeight;
		
		pauseButton = Rect(screenWidth + verticalBarWidth - padding - pauseButtonWidth, horizontalBarHeight + padding, pauseButtonWidth, pauseButtonHeight);														
		undoButton = Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - padding - hexButtonHeight, hexButtonWidth, hexButtonHeight);//undoTexture.width, undoTexture.height);
		waitButton = Rect(screenWidth - (verticalBarWidth + padding + hexButtonWidth), horizontalBarHeight + screenHeight - padding - hexButtonHeight, hexButtonWidth, hexButtonHeight);//waitTexture.width, waitTexture.height);
		
		scoreRect = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, 0, 0);
		turnRect = Rect(verticalBarWidth + padding, horizontalBarHeight + (2 * padding) + scoreFontHeight, 0, 0);
		comboRect = Rect(verticalBarWidth + padding, horizontalBarHeight + (3 * padding) + (2 * scoreFontHeight), 0, 0);
		
		victorySplashRectangle = Rect(screenWidth/3, screenHeight / 3,  screenWidth/3, screenHeight / 3);
				
		var database:GameObject = GameObject.Find("Database");
				
		//Added check to see if the level uses the UpgradeManager (GPC 8/15/13)
		if(database!=null){
			if(database.GetComponent(UpgradeManager) != null){
				upgradeManager = database.GetComponent(UpgradeManager);
				
				CalcDataPiecePositions();
			}
			//dataIcons.Add(dataIcon01);
			//dataIcons.Add(dataIcon02);
			//dataIcons.Add(dataIcon03);
		} else {
			Debug.LogWarning("Could not find the database in the main menu");
		}

		// Add the buttons' rects to the rectList for checking input collision
		rectList.Add(pauseButton);
		rectList.Add(waitButton);
		rectList.Add(undoButton);
			
		cameraMain = GameObject.Find("Main Camera").GetComponent(CameraControl);	
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.inGameMusic;
		
		defaultFontColor = mainMenuSkin.label.normal.textColor;
			targetFontColor = new Color(0,0,0);
	}
	
	public function Render(){   
		if (!enableHUD) return; 
		if(intelSystem.victory) 
			DrawVictorySplash();
		
		GUI.skin = mainMenuSkin;
		
		if(intelSystem == null){
			LoadReferences();
  		} else {  			
			targetFontColor = new Color(0,0,0);
			score = intelSystem.getPrimaryScore() + intelSystem.getOptionalScore();
			GUI.Label(turnRect, "Turn: " + intelSystem.currentTurn);
			GUI.Label(comboRect, "Combo x" + intelSystem.comboSystem.getComboCount());
		}
		
		UpdateDisplayedScore();
		// displaying number of data pieces collected
		/*
		if (upgradeManager != null){
			for(var i:int = 0; i < upgradeManager.counterSet.Count; i++){
				GUI.DrawTexture(dataRect[i],dataIconBG);
				if (upgradeManager.counterSet[i].getObtainedParts() > 0){
					//GUI.DrawTexture(dataRect[i],dataIcons[upgradeManager.counterSet[i].getObtainedParts()]);
				}
			}
		}
		*/
		
		// Draw the buttons and respond to interaction
		if(GUI.Button(pauseButton, pauseTexture))
		{
			SoundManager.Instance().playButtonClick();
			
			currentResponse.type = EventTypes.PAUSE;
		}
		
		if(GUI.Button(waitButton, waitTexture))
		{
			SoundManager.Instance().playWait();
			intelSystem.comboSystem.resetComboCount();
			currentResponse.type = EventTypes.WAIT;
		}
		
		if(GUI.Button(undoButton, undoTexture))
		{
			intelSystem.comboSystem.resetComboCount();
			SoundManager.Instance().playUndo();
			
			currentResponse.type = EventTypes.UNDO;
		}
		
		if(Input.GetKeyDown(KeyCode.M))
		{
			currentResponse.type = EventTypes.METRIC;
		}
				
		GUI.Label(scoreRect, currentlyDisplayedScore.ToString());
		
		if(upgradeManager != null)
			upgradeManager.Render();
	}
	
	private function CalcDataPiecePositions(){
		for (var i : int = 0; i < maxDataIcons; i++){
			var dataXPos:float = screenWidth / (maxDataIcons * 2 + 1) - (dataIconBG.width / 2);
			dataRect.Add(new Rect(dataXPos * (i + 1) * 2, horizontalBarHeight + padding, dataIconBG.width, dataIconBG.height));
		}
	}
	
	private function LoadReferences(){
		if (GameObject.Find("Database")){
			intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
	      	score = intelSystem.getPrimaryScore() + intelSystem.getOptionalScore();
      	}
	}
	
	private function UpdateDisplayedScore()
	{				

		if(intelSystem.updateScore)
		{
			difference = score - currentlyDisplayedScore;
			intelSystem.updateScore = false;
			startTime = Time.timeSinceLevelLoad;
			startScore = currentlyDisplayedScore;					
		}
		
		if(currentlyDisplayedScore < score)
		{	
			scoreUpdateTime = Time.timeSinceLevelLoad;			
			if((startTime - scoreUpdateTime) < scoreUpdateTimer)
			{	
				//Debug.Log("Difference: " + difference);
				var incrementPerFrame : float = (1/Time.deltaTime)  * scoreUpdateTimer;		
				incrementPerFrame = difference / value2;
				currentlyDisplayedScore += incrementPerFrame;				
			}
		}
		else
		{			
			scoreUpdateTime = 0;
			currentlyDisplayedScore = score;
		}		
	}
	
	private function DrawVictorySplash()
	{		
		if(victorySplashStartTime == 0)
			victorySplashStartTime = Time.time;
		if(Time.time - victorySplashStartTime >= victorySplashTimerInSeconds)
		{
			victorySplashStartTime = 0;
			intelSystem.triggerWin();
		}
		else
		{			
			GUI.Box(victorySplashRectangle, "You Win!");
		}
	}
}
