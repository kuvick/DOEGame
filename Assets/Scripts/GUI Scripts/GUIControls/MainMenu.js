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
	private var timeRect:Rect;
	
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
	
	private var victorySplashTimerInSeconds = 2.0f;
	private var victorySplashStartTime = 0;
	private var victorySplashRectangle:Rect;
	private var mostRecentTurnScore : int = 0;
	
	//For displaying Objective Icons:
	private var objIconSizePercentage : float = 0.12f;
	private var objIconSize : Vector2;
	private var objIconGroupRect : Rect;
	private var dataIconSizePercentage : float = 0.04f;
	private var dataIconSize : Vector2;
	
	private var cameraControl : CameraControl;
	
	private var addedObjRect : boolean;
	private var grid:HexagonGrid;
	
	public var missionCompleteTexture : Texture;
	private var missionCompleteSizePercentage : float = 0.7f;
	
	public var showTurns: boolean = false;
	
	public var objIconsBGCenter:Texture;
	public var objIconsBGLeft:Texture;
	public var objIconsBGRight:Texture;
	public var objIconsBGOne:Texture;
	public var scoreAndComboBG:Texture;
	private var objIconBGRect:Rect;
	private var objBGRect:Rect;
	private var addedObjIconBGRect:boolean;
	
	private var scoreAndComboBGRect : Rect;
	private var scoreAndComboBGPercent :float= 0.15;
	
	public function Start () 
	{
		super.Start();
		addedObjRect = false;
		addedObjIconBGRect = false;
		
		mainCameraObject = GameObject.Find("Main Camera");
		cameraControl = mainCameraObject.GetComponent(CameraControl);
		
		// If testing different camera angles, going through and adding
		// the cameras to the list.
		if(testCameras)
		{
			// index of current camera
			currentCamera = 0;
			cameraLocations.Add(mainCameraObject);
			// getting the original camera's information
			mainCameraObject = GameObject.Find("Main Camera");
			cameraLocations.Add(mainCameraObject);
			cameraControl = mainCameraObject.GetComponent(CameraControl);
			
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
		var pauseW: float = pauseTexture.width;
		var pauseH: float = pauseTexture.height;
		var pauseButtonRatio : float = pauseW / pauseH;
		var pauseButtonWidth : float = pauseButtonHeight * pauseButtonRatio;
		
		scoreFontHeight = scoreFontHeightPercent * screenHeight;
		
		dataIconHeight = dataIconHeightPercent * screenHeight;
		
		mainMenuSkin.label.fontSize = scoreFontHeight;
	
		
		//pauseFontHeight = pauseFontHeightPercent * screenHeight;
		//mainMenuSkin.button.fontSize = pauseFontHeight;
		
		pauseButton = Rect(screenWidth + verticalBarWidth - padding - pauseButtonWidth, horizontalBarHeight + padding, pauseButtonWidth, pauseButtonHeight);
		undoButton = Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - padding - hexButtonHeight, hexButtonWidth, hexButtonHeight);//undoTexture.width, undoTexture.height);
		waitButton = Rect(screenWidth - (verticalBarWidth + padding + hexButtonWidth), horizontalBarHeight + screenHeight - padding - hexButtonHeight, hexButtonWidth, hexButtonHeight);//waitTexture.width, waitTexture.height);
		
		scoreRect = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, 0, 0);
		comboRect = Rect(verticalBarWidth + padding, horizontalBarHeight + (2 * padding) + (1.3 * scoreFontHeight), 0, 0);
		turnRect =  Rect(verticalBarWidth + padding, horizontalBarHeight + (4 * padding) + (3.9 * scoreFontHeight), 0, 0);
		timeRect =  Rect(verticalBarWidth + padding, horizontalBarHeight + (3 * padding) + (2.6 * scoreFontHeight), 0, 0);
		
		scoreAndComboBGRect = createRect(scoreAndComboBG,0,0,scoreAndComboBGPercent,false);
		
		
		var victoryHeight = missionCompleteSizePercentage * screenHeight;
		var victoryW: float = missionCompleteTexture.width;
		var victoryH: float = missionCompleteTexture.height;
		var victoryRatio : float = victoryW / victoryH;
		var victoryWidth : float = victoryHeight * victoryRatio;
		victorySplashRectangle = Rect(screenWidth/2 - victoryWidth/2, screenHeight/2 - victoryHeight/2,  victoryWidth, victoryHeight);
		
		xFinalDestination = victorySplashRectangle.x;
		victorySplashRectangle.x = screenWidth;
		
				
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
			
			
		var objHeight : float = objIconSizePercentage * screenHeight;
		var objW: float = intelSystem.primaryIcons[0].width;
		var objH: float = intelSystem.primaryIcons[0].height;
		var objRatio : float = objW / objH;
		var objWidth : float = objHeight * objRatio;
		
		objIconSize = Vector2(objWidth, objHeight);
		
		var dataHeight : float = dataIconSizePercentage * screenHeight;
		var dataW: float = upgradeManager.iconTexture.width;
		var dataH: float = upgradeManager.iconTexture.height;
		var dataRatio : float = dataW / dataH;
		var dataWidth : float = dataHeight * dataRatio;
		
		dataIconSize = Vector2(dataWidth, dataHeight);
		
		
		var objRectWidth : float = (objIconSize.x + padding) * intelSystem.events.Count;
		objIconGroupRect = Rect(pauseButton.x - objRectWidth, horizontalBarHeight + padding, objRectWidth, objIconSize.y + padding + dataIconSize.x);		
		objBGRect = Rect(pauseButton.x - objRectWidth - padding, horizontalBarHeight, objRectWidth + padding, objIconSize.y + padding*2 + dataIconSize.x);
		
		grid = GameObject.Find("HexagonGrid").GetComponent(HexagonGrid);
	}
	
	public function Render(){ 
		if (!enableHUD) return; 
		if(intelSystem.victory) 
			DrawVictorySplash();
		
		GUI.skin = mainMenuSkin;
		
		GUI.DrawTexture(scoreAndComboBGRect, scoreAndComboBG);
		
		if(intelSystem == null){
			LoadReferences();
  		} else {  			
			targetFontColor = new Color(0,0,0);
			score = intelSystem.getPrimaryScore() + intelSystem.getOptionalScore();
			
			GUI.Label(comboRect, "Combo x" + intelSystem.comboSystem.getComboCount());
			
			if(showTurns)
				GUI.Label(turnRect, "Turn: " + intelSystem.currentTurn);
				
			GUI.Label(timeRect, "Time: " + intelSystem.GetTimeLeft());
				
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
			intelSystem.decrementScore(true, intelSystem.comboSystem.comboScoreBasePoints);
			intelSystem.comboSystem.resetComboCount();
			SoundManager.Instance().playUndo();
			
			currentResponse.type = EventTypes.UNDO;
		}
		
		if(Input.GetKeyDown(KeyCode.M))
		{
			currentResponse.type = EventTypes.METRIC;
		}
				
		GUI.Label(scoreRect, currentlyDisplayedScore.ToString());
		
		//if(upgradeManager != null) // REMOVING THE OTHER UPGRADE COUNTER
			//upgradeManager.Render();
			
		
		//DISPLAYING OBJECTIVE ICONS IN HUD
		GUI.skin.label.normal.textColor = Color.white;
		var objRectWidth : float = (objIconSize.x + padding) * intelSystem.events.Count;
		objIconGroupRect = Rect(pauseButton.x - objRectWidth, horizontalBarHeight + padding, objRectWidth, objIconSize.y + padding + dataIconSize.x);
		objBGRect = Rect(pauseButton.x - objRectWidth - padding, horizontalBarHeight, objRectWidth + padding, objIconSize.y + padding * 2 + dataIconSize.x);
		
		// This resizes the size of the objective icons if they overlap the score and combo background
		// Should only be called once unless there is a ridiculous number of objectives
		// Typically it's around 6 or 7 that this should be called?
		if(scoreAndComboBGRect.width > objIconGroupRect.x)
		{
			//Debug.Log("Resizing obj. icon rect");
			objIconSizePercentage -= 0.02;
			dataIconSizePercentage -= 0.01;
			
			var objHeight : float = objIconSizePercentage * screenHeight;
			var objW: float = intelSystem.primaryIcons[0].width;
			var objH: float = intelSystem.primaryIcons[0].height;
			var objRatio : float = objW / objH;
			var objWidth : float = objHeight * objRatio;
			
			objIconSize = Vector2(objWidth, objHeight);
			
			var dataHeight : float = dataIconSizePercentage * screenHeight;
			var dataW: float = upgradeManager.iconTexture.width;
			var dataH: float = upgradeManager.iconTexture.height;
			var dataRatio : float = dataW / dataH;
			var dataWidth : float = dataHeight * dataRatio;
			
			dataIconSize = Vector2(dataWidth, dataHeight);
			objRectWidth = (objIconSize.x + padding) * intelSystem.events.Count;
			objIconGroupRect = Rect(pauseButton.x - objRectWidth, horizontalBarHeight + padding, objRectWidth, objIconSize.y + padding + dataIconSize.x);
			objBGRect = Rect(pauseButton.x - objRectWidth - padding, horizontalBarHeight, objRectWidth + padding, objIconSize.y + padding * 2 + dataIconSize.x);
			
		}
		
		
		//DISPLAYING OBJECTIVE ICON BACKGROUND
		GUI.BeginGroup(objBGRect);
		
		if(intelSystem.events.Count > 0)
		{
			var objIconBGRect:Rect;
			
			if(intelSystem.events.Count == 1)
			{
				 objIconBGRect = Rect(0, 0, objIconSize.x + padding*2, objBGRect.height);	
				GUI.DrawTexture(objIconBGRect, objIconsBGOne);
				if(!addedObjIconBGRect)
				{
					rectList.Add(objIconBGRect);
				}
			}
			else
			{
				for(var r:int = 0; r < intelSystem.events.Count; r++)
				{
					objIconBGRect = Rect((objIconSize.x + padding) * r, 
											0,
											objIconSize.x + padding,
											objBGRect.height);
											
					if(r == 0)					
						GUI.DrawTexture(objIconBGRect, objIconsBGLeft);
					else if(r == intelSystem.events.Count - 1)
						GUI.DrawTexture(objIconBGRect, objIconsBGRight);
					else
						GUI.DrawTexture(objIconBGRect, objIconsBGCenter);
						
						
					if(!addedObjIconBGRect)
					{
						rectList.Add(objIconBGRect);
					}
						
				}
			}
		}
		GUI.EndGroup();
		addedObjIconBGRect = true;
		
		GUI.BeginGroup(objIconGroupRect);
			for(var i:int = 0; i < intelSystem.events.Count; i++)
			{
				//DISPLAYING OBJECTIVE ICON
				var objIconRect = Rect(	(objIconSize.x + padding) * i, 
										0,
										objIconSize.x,
										objIconSize.y);
				
				GUI.DrawTexture(objIconRect, intelSystem.events[i].getIcon());
				//If clicks on objective icon, centers on building
				if(GUI.Button(objIconRect,""))
				{
					cameraControl.centerCameraOnPointInWorld(intelSystem.events[i].event.buildingReference.transform.position);
					var objIconScript:ObjectiveIcon = intelSystem.events[i].getIconScript();
					objIconScript.OnSelectedFromHUD(); // See ActivateAndDeactivate(disp : Tooltip) in InspectionDisplay
					
					var buildingData : BuildingData = intelSystem.events[i].event.buildingReference.GetComponent(BuildingData);
					
					grid.CreateFlashingHexagon(buildingData.buildingData.coordinate);
				}
				if(!addedObjRect)
				{
					rectList.Add(objIconRect);
				}
										
				//DISPLAYING NUMBER
				if(intelSystem.events[i].event.type == BuildingEventType.Primary && !intelSystem.events[i].getResolved())
				{		
					GUI.Label(Rect(	(objIconSize.x + padding) * i, 
											objIconSize.y / 2f,
											objIconSize.x,
											objIconSize.y),
											intelSystem.events[i].event.time.ToString());
				}
				
				//IF IT HAS AN UPGRADE
				if(intelSystem.events[i].event.upgrade != UpgradeID.None)
				{
					var upgradeCount : UpgradeCounter = upgradeManager.getUpgradeCounter(intelSystem.events[i].event.upgrade);

					for(var j : int = 0; j < upgradeCount.getTotalParts(); j++)
					{
						//DISPLAYS THE DARK UPGRADE ICON CIRCLE FOR EACH ONE PRESENT IN THE LEVEL
						GUI.DrawTexture(Rect((objIconSize.x + padding) * i + ((padding / 2) + dataIconSize.x) * j,
												objIconSize.y + (padding / 2),
												dataIconSize.x,
												dataIconSize.y),
												upgradeManager.notCollectedIconTexture);
					}
					
					for(var k : int = 0; k < upgradeCount.getObtainedParts(); k++)
					{	
						//DISPLAYS THE LIGHTER UPGRADE ICON FOR EACH ONE COLLECTED
						GUI.DrawTexture(Rect((objIconSize.x + padding) * i + ((padding / 2) + dataIconSize.x) * k,
												objIconSize.y + (padding / 2),
												dataIconSize.x,
												dataIconSize.y),
												upgradeManager.iconTexture);
					}
					
				}
			}
		GUI.EndGroup();
		addedObjRect = true;
			
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
				incrementPerFrame = difference / 2; // was "incrementPerFrame = difference / value2;" ...changed to 2 because of error. Need to find out what it's actually supposed to be.
				currentlyDisplayedScore += incrementPerFrame;				
			}
		}
		else
		{			
			scoreUpdateTime = 0;
			currentlyDisplayedScore = score;
		}		
	}
	
	
	//Variables for animated mission complete
	private var xFinalDestination:float;
	private var hasReachedDestination:boolean = false;
	private var tolerance:float = 10f;
	private var speed:float = 2f;
	
	private function DrawVictorySplash()
	{		
		//animates the mission complete until it is in the center
		if(!hasReachedDestination)
		{
			GUI.DrawTexture(victorySplashRectangle, missionCompleteTexture);
			
			victorySplashRectangle.x -= speed * Time.deltaTime * Mathf.Abs(victorySplashRectangle.x - xFinalDestination);
			
			if(victorySplashRectangle.x - tolerance < xFinalDestination)
				hasReachedDestination = true;
		
		}
		//triggers count down until it goes to score screen
		else
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
				GUI.DrawTexture(victorySplashRectangle, missionCompleteTexture);
			}
		}
		
	}// end of drawvictorysplash
	
}// end of main menu
