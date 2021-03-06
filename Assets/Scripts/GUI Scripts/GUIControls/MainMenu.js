/**********************************************************
MainMenu.js

Description: 

Author: Francis Yuan
**********************************************************/
#pragma strict

public class MainMenuScaling
{

}

public class MainMenu extends GUIControl
{
	// ERROR TEXT
	public var missingResourceText:String = "Resources don’t match!";
	public var brokenChainText:String = "Link chain broken!";
	private var textDisplayRect:Rect;
	
	// For testing different camera angles
	public var testCameras : boolean = false;
	//public var cameraLocations : List.<GameObject>;
	private var currentCamera : int;
	//public var mainCameraObject : GameObject;

	// Skin for Main Menu
	public var mainMenuSkin:GUISkin;
	
	public var enableHUD:boolean = true;
	
	//public var disableActionButtons : boolean = false;
	//GPC altered 12/29/13
	public var disableUndoButton : boolean = false;
	public var disableSkipButton : boolean = false;
			
	// Main Menu Rectangles
	private var pauseButton:Rect;  
	private var helpButton:Rect; 		
	private var waitButton:Rect; 				
	private var undoButton:Rect;				
	private var scoreRect:Rect;
	private var turnRect:Rect;
	private var comboRect:Rect;
	private var timeRect:Rect;
	
	// Main Menu Scaling
	private var hexButtonHeightPercent:float = 0.2;		// Height of the hex button font as a percentage of screen height
	//private var scoreFontHeightPercent:float = 0.04;	// Height of the score font as a percentage of screen height
	//Making turn number bigger GPC 4/23/14
	private var scoreFontHeightPercent:float = 0.08;	// Height of the score font as a percentage of screen height
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
	/*
	public var dataIconBG:Texture;
	private var dataIconHeightPercent:float = 0.14;
	private var dataIconHeight:float;
	private var dataIcons:List.<Texture> = new List.<Texture>();
	private var dataRect:List.<Rect> = new List.<Rect>();
	private var maxDataIcons : int = 3;
	*/
	
	private var upgradeManager : UpgradeManager = null;
	
	private var scoreUpdateTimer = 1;
	private var scoreUpdateTime = 0;
	private var defaultFontColor;
	private var targetFontColor;
		
	private var updateScore = 0.0f;
	private var difference = 0.0f;
	private var startTime = 0;
	private var startScore = 0;
	
	public var victorySplashTimerInSeconds = 2.0f;		
	private var victorySplashStartTime = 0;
	private var victorySplashRectangle:Rect;
	private var mostRecentTurnScore : int = 0;
	
	//For displaying Objective Icons:
	//private var objIconSizePercentage : float = 0.08f;
	private var objIconSizePercentage : float = 0.11f;
	private var objIconSize : Vector2;
	private var objIconGroupRect : Rect;
	private var dataIconSizePercentage : float = 0.02f;
	private var dataIconSize : Vector2;
	
	private var cameraControl : CameraControl;
	
	private var addedObjRect : boolean;
	private var grid:HexagonGrid;
	
	public var missionCompleteTexture : Texture;
	private var missionCompleteSizePercentage : float = 0.7f;
	
	public var showTurns: boolean = false;
	
	private var inspectionDispRef : InspectionDisplay;
	
	/*
	public var objIconsBGCenter:Texture;
	public var objIconsBGLeft:Texture;
	public var objIconsBGRight:Texture;
	public var objIconsBGOne:Texture;
	*/
	public var hasDataIcon:Texture;
	public var hasNotDataIcon:Texture;
	public var objectiveBanner:Texture;
	//public var scoreAndComboBG:Texture;
	private var objIconBGRect:Rect;
	private var objBGRect:Rect;
	//private var addedObjIconBGRect:boolean;
	
	//private var scoreAndComboBGRect : Rect;
	//private var scoreAndComboBGPercent :float= 0.15;
	
	private var tutorialPointers:TutorialPointers;
	
	public var zoomButton:Texture;
	private var zoomButtonRect:Rect;
	private var isZoomedOut:boolean;
	public var enableZoom:boolean = false;
	
	private var color:Color;
	private var speedColor:float = 0.03;
	private var resolvedObj:boolean = false;
	private var pickedUpData:boolean = false;
	private var firstLoop:boolean = true;
	private var setNewObjTexture:Texture;
	private var eventID:List.<int> = new List.<int>();// = 0;
	private var centerPos:Vector2;
	private var recIncrement:float;
	private var switchScale:boolean;
	
	private var objIconAnimatedImage:AnimatedImage = new AnimatedImage();
	
	private var objNumST:ShadowedText;
	
	private var sparkRect:Rect;
	public var sparkTextures:List.<Texture> = new List.<Texture>();
	private var currentSparkTexture:int = 0;
	
	//DEBUGGING
	public var levelSkipAndroid:boolean = false;
	
	public function Start () 
	{
		super.Start();		
		/* It is better to have this in the initialize
		mainCameraObject = GameObject.Find("Main Camera");
		if(mainCameraObject != null)
			cameraControl = mainCameraObject.GetComponent(CameraControl);
		else
		{
			mainCameraObject = GameObject.Find("Main Camera");
			if(mainCameraObject != null)
				cameraControl = mainCameraObject.GetComponent(CameraControl);
		}
		*/
		
		// If testing different camera angles, going through and adding
		// the cameras to the list.
		/*
		if(testCameras)
		{
			// index of current camera
			currentCamera = 0;
			cameraLocations.Add(mainCameraObject);
			// getting the original camera's information
			//mainCameraObject = GameObject.Find("Main Camera");
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
		*/
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
		
		color = Color.white;
		
		addedObjRect = false;
		//addedObjIconBGRect = false;
				
	    if (intelSystem == null) {
    		LoadLevelReferences();
    	} 
    	
		currentWaitTexture = waitTexture;
		currentUndoTexture = undoTexture;
    	
    	sparkRect = createRect(sparkTextures[0],0,0, 0.1, false);
    	sparkRect.x = Screen.width / 2 - sparkRect.width / 2;
    	sparkRect.y = Screen.height / 2 - sparkRect.height / 2;
    	
    	
    	
    	
    	if(!PlayerPrefs.HasKey("isZoomedOut"))
    	{
    		isZoomedOut = false;
    	}
    	else
    	{
    		if(PlayerPrefs.GetInt("isZoomedOut") == 0)
    			isZoomedOut = false;
			else
				isZoomedOut = true;
    	}
    	
		pauseButton = createRect(pauseTexture,0,0, 41.0 / 540.0, false);
		pauseButton.x = screenWidth - pauseButton.width;
		
		zoomButtonRect = createRect(zoomButton, 0,0,0.1, false);
    	zoomButtonRect.x = screenWidth - zoomButtonRect.width - padding;
    	zoomButtonRect.y = zoomButtonRect.height;
		
		helpButton = createRect(zoomButton,0,0, 41.0 / 540.0, false);
		helpButton.x = pauseButton.x - (pauseButton.width);
		
		waitButton = createRect(waitTexture,0,0, 143.0 / 540.0, false);
		waitButton.x = screenWidth - waitButton.width;
		waitButton.y = screenHeight - waitButton.height;
		
		undoButton = createRect(undoTexture,0,0, 143.0 / 540.0, false);
		undoButton.y = waitButton.y;
		
		//scoreAndComboBGRect = createRect(scoreAndComboBG,0,0,scoreAndComboBGPercent,false);
		//scoreAndComboBGRect = createRect(scoreAndComboBG,0,0, 49.0 / 540.0, false);
		//scoreAndComboBGRect.x = screenWidth / 2 - scoreAndComboBGRect.width / 2;
		
		//objBGRect = createRect(objectiveBanner,0, 0, 55.0 / 540.0, false);
		objBGRect = createRect(objectiveBanner,0, 0, 75 / 540.0, false);
		objBGRect.x = screenWidth / 2 - objBGRect.width / 2;
		
		//scoreRect = createRect(new Vector2(243, 24), 223.0 / 691.0, 22.0 / 48.0, 24.0 / 48.0, false, scoreAndComboBGRect);

		//comboRect = createRect(new Vector2(102, 24), 110.0 / 691.0, 22.0 / 48.0, 24.0 / 48.0, false, scoreAndComboBGRect);
		
		//timeRect = createRect(new Vector2(102, 24), 496.0 / 691.0, 22.0 / 48.0, 24.0 / 48.0, false, scoreAndComboBGRect);
    	

		hexButtonHeight = hexButtonHeightPercent * screenHeight;
		var totalButtonPadding : float = hexButtonHeight + padding;
		var hexButtonRatio : float = undoTexture.width / undoTexture.height;
		var hexButtonWidth = hexButtonHeight * hexButtonRatio;
		
		/*
		pauseButtonHeight = pauseButtonHeightPercent * screenHeight;
		var pauseW: float = pauseTexture.width;
		var pauseH: float = pauseTexture.height;
		var pauseButtonRatio : float = pauseW / pauseH;
		var pauseButtonWidth : float = pauseButtonHeight * pauseButtonRatio;
		*/
		
		scoreFontHeight = scoreFontHeightPercent * screenHeight;
		
		//dataIconHeight = dataIconHeightPercent * screenHeight;
		
		mainMenuSkin.label.fontSize = scoreFontHeight;
	
		
		//pauseFontHeight = pauseFontHeightPercent * screenHeight;
		//mainMenuSkin.button.fontSize = pauseFontHeight;
		
		//pauseButton = Rect(screenWidth + verticalBarWidth - padding - pauseButtonWidth, horizontalBarHeight + padding, pauseButtonWidth, pauseButtonHeight);
		//undoButton = Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - padding - hexButtonHeight, hexButtonWidth, hexButtonHeight);//undoTexture.width, undoTexture.height);
		//waitButton = Rect(screenWidth - (verticalBarWidth + padding + hexButtonWidth), horizontalBarHeight + screenHeight - padding - hexButtonHeight, hexButtonWidth, hexButtonHeight);//waitTexture.width, waitTexture.height);
		
		//scoreRect = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, 0, 0);
		//comboRect = Rect(verticalBarWidth + padding, horizontalBarHeight + (2 * padding) + (1.3 * scoreFontHeight), 0, 0);
		//var turnHorizontalPadding = -0.2 * screenHeight;
		turnRect =  Rect(verticalBarWidth + padding, horizontalBarHeight + (4 * padding) + (3.9 * scoreFontHeight) +100, 0, 0);
		//timeRect =  Rect(verticalBarWidth + padding, horizontalBarHeight + (3 * padding) + (2.6 * scoreFontHeight), 0, 0);
		
		
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
				
				//CalcDataPiecePositions();
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
		rectList.Add(objBGRect);
			
		cameraMain = GameObject.Find("Main Camera").GetComponent(CameraControl);
		cameraControl = cameraMain.GetComponent(CameraControl);
		cameraMain.startCameraOut(!isZoomedOut);
		
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
		//var dataW: float = upgradeManager.iconTexture.width;
		//var dataH: float = upgradeManager.iconTexture.height;
		var dataW: float = hasDataIcon.width;
		var dataH: float = hasDataIcon.height;
		var dataRatio : float = dataW / dataH;
		var dataWidth : float = dataHeight * dataRatio;
		dataIconSize = Vector2(dataWidth, dataHeight);
		
		var objRectWidth : float = (objIconSize.x + padding) * intelSystem.events.Count;
		objIconGroupRect = Rect(objBGRect.x, objBGRect.y + 0.1 * objBGRect.height, objRectWidth, objIconSize.y + padding);
		//objBGRect = Rect(pauseButton.x - objRectWidth - padding, horizontalBarHeight, objRectWidth + padding, objIconSize.y + padding*2 + dataIconSize.x);
		
		grid = GameObject.Find("HexagonGrid").GetComponent(HexagonGrid);
		tutorialPointers = GameObject.Find("GUI System").GetComponent(TutorialPointers);
		
		inspectionDispRef = gameObject.GetComponent(InspectionDisplay);
		
		textDisplayRect = new Rect(0,Screen.height * 0.1,Screen.width * 0.40, Screen.height);
		textDisplayRect.x = Screen.width / 2 - textDisplayRect.width / 2;
		
		
		objNumST = new ShadowedText("", Rect(0,0,0,0), false);
		
	}
	
	public function Render(){
		GUI.skin = mainMenuSkin;
		
		// skip straight to restart on tap after failure
		if (!enableHUD && GUI.Button(Rect(0,0, screenWidth, screenHeight), GUIContent.none))
		{
			var event : GUIEvent = new GUIEvent();
			event.type = EventTypes.RESTART;//FAILUREMENU;
			GUIManager.Instance().RecieveEvent(event);
		}

		if (!enableHUD || !isActive) return; 
		if(intelSystem.victory) 
		{
			DrawVictorySplash();
		}
		
		
		//Disabling top HUD frame (GPC 2/13/14)
//		GUI.DrawTexture(scoreAndComboBG/Rect, scoreAndComboBG, ScaleMode.StretchToFill);
//		
//		
//		
//		
//		GUI.BeginGroup(scoreAndComboBGRect);
//		mainMenuSkin.label.alignment = TextAnchor.UpperCenter;
//			if(intelSystem == null){
//				LoadReferences();
//	  		} else {  			
//				targetFontColor = new Color(0,0,0);
//				score = intelSystem.getPrimaryScore() + intelSystem.getOptionalScore();
//				
//				GUI.Label(comboRect, "x" + intelSystem.comboSystem.getComboCount());
//				//GUI.Label(comboRect, "Combo x" + intelSystem.comboSystem.getComboCount());
//				
//				if(showTurns)
//					GUI.Label(turnRect, "Turn: " + intelSystem.currentTurn);
//				
//				if(intelSystem.useTimer)
//					GUI.Label(timeRect, "" + intelSystem.GetTimeLeft());
//					//GUI.Label(timeRect, "Time: " + intelSystem.GetTimeLeft());
//					
//			}
//			UpdateDisplayedScore();
//			GUI.Label(scoreRect, currentlyDisplayedScore.ToString());
//			mainMenuSkin.label.alignment = TextAnchor.UpperLeft;
//		GUI.EndGroup();


		
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
		GUI.DrawTexture(pauseButton, pauseTexture, ScaleMode.StretchToFill);
		if(GUI.Button(pauseButton, GUIContent.none))
		{
			SoundManager.Instance().playButtonClick();
			isActive = false;
			currentResponse.type = EventTypes.PAUSE;
		}
		//GUI.enabled = !inspectionDispRef.IsActive();
		
		//Help menu disabled for now GPC 3/10/14
		
//		GUI.DrawTexture(helpButton, zoomButton, ScaleMode.StretchToFill);
//		if(GUI.Button(helpButton, String.Empty))
//			currentResponse.type = EventTypes.INTEL;
//		
		//	ANDROID BACK BUTTON
		if(Input.GetKeyUp(KeyCode.Escape))
		{
			SoundManager.Instance().playButtonClick();
			
			if(levelSkipAndroid){
				intelSystem.victory = true;
			}else{	
				isActive = false;
				currentResponse.type = EventTypes.PAUSE;
			}
		}
		
		if(!disableSkipButton && GUI.Button(waitButton, currentWaitTexture))
		{
			cycleWaitButtonTexture();
			intelSystem.pressedUndoOrWait();
			SoundManager.Instance().playWait();
			intelSystem.comboSystem.resetComboCount();
			currentResponse.type = EventTypes.WAIT;
		}
		
		if (intelSystem.currentTurn <= 0)
			GUI.enabled = false;
		if(!disableUndoButton && GUI.Button(undoButton, currentUndoTexture))
		{
			cycleUndoButtonTexture();
			intelSystem.pressedUndoOrWait();
			intelSystem.decrementScore(true, intelSystem.comboSystem.comboScoreBasePoints);
			intelSystem.comboSystem.resetComboCount();
			SoundManager.Instance().playUndo();
			
			currentResponse.type = EventTypes.UNDO;
		}
		//GUI.enabled = !inspectionDispRef.IsActive();
		GUI.enabled = true;
		
		if(Input.GetKeyDown(KeyCode.H))
		{
			currentResponse.type = EventTypes.INTEL;
		}
				
		
		//if(upgradeManager != null) // REMOVING THE OTHER UPGRADE COUNTER
			//upgradeManager.Render();
			
		
		//DISPLAYING OBJECTIVE ICONS IN HUD
		GUI.skin.label.normal.textColor = Color.white;
		var objRectWidth : float = (objIconSize.x + padding) * intelSystem.events.Count * 2;
		objIconGroupRect = Rect(objBGRect.x + objIconSize.x * 1.2, objBGRect.y + 0.1 * objBGRect.height, objRectWidth + dataIconSize.x + padding, objIconSize.y + padding);
		
		//var objRectWidth : float = (objIconSize.x + padding) * intelSystem.events.Count;
		//objIconGroupRect = Rect(pauseButton.x - objRectWidth, horizontalBarHeight + padding, objRectWidth, objIconSize.y + padding + dataIconSize.x);
		//objBGRect = Rect(pauseButton.x - objRectWidth - padding, horizontalBarHeight, objRectWidth + padding, objIconSize.y + padding * 2 + dataIconSize.x);
		// This resizes the size of the objective icons if they overlap the score and combo background
		// Should only be called once unless there is a ridiculous number of objectives
		// Typically it's around 6 or 7 that this should be called?
		/*
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
		/*
		
		//DISPLAYING OBJECTIVE ICON BACKGROUND
		/*
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
		*/
		GUI.DrawTexture(objBGRect, objectiveBanner, ScaleMode.StretchToFill);		

		GUI.BeginGroup(objIconGroupRect);
			for(var i:int = 0; i < intelSystem.events.Count; i++)
			{
				var reset:boolean = false;

				if(!(intelSystem.events[i].getResolved()) && (intelSystem.events[i].event.type == BuildingEventType.Primary) && (intelSystem.events[i].event.time <= 3))
				{
					GUI.color = Color.Lerp(Color(1,1,1,0), Color(1,1,1,1), LinkUI.fadeTimer);
				
					reset = true;
				}
			
				var objIconRect: Rect = Rect(	padding + (objIconSize.x + padding) * (i*2), 
										0,
										objIconSize.x,
										objIconSize.y);
				// Animation:
				if(resolvedObj && eventID.Contains(intelSystem.events[i].getObjIcon().getID()))
				{
					if(!objIconAnimatedImage.Render(objIconRect, intelSystem.events[i].getIcon(), setNewObjTexture, resolvedObj))
					{
						eventID.Remove(intelSystem.events[i].getObjIcon().getID());
						if (eventID.Count <= 0)
							resolvedObj = false;
						intelSystem.events[i].setIcon(setNewObjTexture);
					}
				}
				else
					GUI.DrawTexture(objIconRect, intelSystem.events[i].getIcon()); //DISPLAYING OBJECTIVE ICON
				
				
				//If clicks on objective icon, centers on building
				if(GUI.Button(objIconRect,""))
				{
					//cameraControl.centerCameraOnPointInWorld(intelSystem.events[i].event.buildingReference.transform.position);
					var objIconScript:ObjectiveIcon = intelSystem.events[i].getIconScript();
					objIconScript.OnSelectedFromHUD(); // See ActivateAndDeactivate(disp : Tooltip) in InspectionDisplay
					
					var buildingData : BuildingData = intelSystem.events[i].event.buildingReference.GetComponent(BuildingData);
					
					//grid.CreateFlashingHexagon(buildingData.buildingData.coordinate);
				}
				if(!addedObjRect)
				{
					rectList.Add(objIconRect);
				}
										
				//DISPLAYING NUMBER
				if(intelSystem.events[i].event.type == BuildingEventType.Primary && !intelSystem.events[i].getResolved())
				{	
				
					objNumST.Display(intelSystem.events[i].event.time.ToString(),
								Rect(padding + (objIconSize.x + padding) * (i*2) + (objIconSize.y / 2),
											padding / 2, 
											objIconSize.x,
											objIconSize.y),
											false);
					
					/*
					GUI.Label(	Rect(padding + (objIconSize.x + padding) * (i*2) + (objIconSize.y / 2),
								padding / 2, 
								objIconSize.x,
								objIconSize.y),
								intelSystem.events[i].event.time.ToString());
					*/
				}
				
				if(reset)
					GUI.color = Color.white;


			}
		GUI.EndGroup();
		addedObjRect = true;
		
		tutorialPointers.Render();
		
		// Displaying Error Text
		if(displayErrorText)
			GUI.Label(textDisplayRect, textToDisplay, tutorialPointers.style);
			
		if(enableZoom)
		{
			if(GUI.Button(zoomButtonRect, zoomButton))
			{
				if(!isZoomedOut)
				{
					cameraMain.cameraZoom(false);
					isZoomedOut = true;
					PlayerPrefs.SetInt("isZoomedOut", 1);
				}
				else
				{
					cameraMain.cameraZoom(true);
					isZoomedOut = false;
					PlayerPrefs.SetInt("isZoomedOut", 0);
				}
			}
		}
	}
	
	/*
	private function CalcDataPiecePositions(){
		for (var i : int = 0; i < maxDataIcons; i++){
			var dataXPos:float = screenWidth / (maxDataIcons * 2 + 1) - (dataIconBG.width / 2);
			dataRect.Add(new Rect(dataXPos * (i + 1) * 2, horizontalBarHeight + padding, dataIconBG.width, dataIconBG.height));
		}
	}*/
	
	public function triggerObjIconChange(id: int, newText:Texture)
	{		
		eventID.Add(id);// = id;
		setNewObjTexture = newText;
		resolvedObj = true;
		firstLoop = true;
		pickedUpData = false;
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
	private var startPath:boolean = false;
	public var startMissionComplete: boolean = false;
	public var doVictoryTrace: boolean = false;
	
	private function DrawVictorySplash()
	{		
		if(!startPath)
		{
			//cameraControl.FindPath();
			if(doVictoryTrace)
				cameraControl.StartCompleteSequence(intelSystem.GetLastPrimary());//StartTrace();
			else
			{
				startMissionComplete = true;
				//SoundManager.Instance().playMusic(SoundManager.Instance().backgroundSounds.scoreMenuMusic);
			}
			startPath = true;
			inspectionDispRef.ClearTooltips();
		}
		else if(startMissionComplete)
		{
			//animates the mission complete until it is in the center
			if(!hasReachedDestination)
			{
				GUI.DrawTexture(victorySplashRectangle, missionCompleteTexture, ScaleMode.StretchToFill);
				
				victorySplashRectangle.x -= speed * Time.deltaTime * Mathf.Abs(victorySplashRectangle.x - xFinalDestination);
				
				if(victorySplashRectangle.x - tolerance < xFinalDestination)
					hasReachedDestination = true;
			
			}
			//triggers count down until it goes to score screen
			else
			{
				if(victorySplashStartTime == 0)
				{
					victorySplashStartTime = Time.time;
					
				}
				if(Time.time - victorySplashStartTime >= victorySplashTimerInSeconds)
				{
					victorySplashStartTime = 0;
					intelSystem.triggerWin();
				}
				else
				{			
					GUI.DrawTexture(victorySplashRectangle, missionCompleteTexture, ScaleMode.StretchToFill);
				}
			}
		}
		else
		{
			GUI.DrawTexture(sparkRect, sparkTextures[currentSparkTexture]);
			currentSparkTexture++;
			if(currentSparkTexture >= sparkTextures.Count)
				currentSparkTexture = 0;
		}
	}// end of drawvictorysplash
	
	
	//ERROR TEXT FUNCTIONS
	private var displayErrorText:boolean = false;
	private var textToDisplay:String = "";
	
	public function chainBroken()
	{
		textToDisplay = brokenChainText;
		displayErrorText = true;
		yield WaitForSeconds(3.0);
		displayErrorText = false;
	}
	
	public function missingResource()
	{
		textToDisplay = missingResourceText;
		displayErrorText = true;
		yield WaitForSeconds(3.0);
		displayErrorText = false;
	}
	
	public var waitButtonAnimationTextures:Texture[];
	private var currentWaitTexture:Texture;
	private function cycleWaitButtonTexture()
	{
		for(var i:int = 0; i < waitButtonAnimationTextures.length; i++)
		{
			currentWaitTexture = waitButtonAnimationTextures[i];
			yield WaitForSeconds(0.001);
		}
		currentWaitTexture = waitTexture;
	}
	
	public var undoButtonAnimationTextures:Texture[];
	private var currentUndoTexture:Texture;
	private function cycleUndoButtonTexture()
	{
		for(var i:int = 0; i < undoButtonAnimationTextures.length; i++)
		{
			currentUndoTexture = undoButtonAnimationTextures[i];
			yield WaitForSeconds(0.001);
		}
		currentUndoTexture = undoTexture;
	}
	
}// end of main menu
