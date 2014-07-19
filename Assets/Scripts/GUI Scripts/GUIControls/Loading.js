/**********************************************************
Loading.js

Description: 

Notes: 

Kathrine - Temporary script for the demo, will eventually use this when
we have access to Unity Pro:

http://docs.unity3d.com/Documentation/ScriptReference/Application.LoadLevelAsync.html

Author: Katherine Uvick, Francis Yuan
**********************************************************/
#pragma strict

public class LoadingScaling
{
	var job : float;
	var title : float;
}

public class Loading extends GUIControl
{
	public var debugCycleJobDescriptions:boolean = false;
	private var currentJobNum:int = 0;
	private var STARTjobTextRect:Rect;
	// Loading Screen Rectangles
	private var blackBackground : Rect;
	private var background:Rect;
	private var loadingRect : Rect;
	private var onlineRect : Rect;
	private var iconRect : Rect;
	private var toggleDescriptionRect : Rect;
	
	// Loading Screen Textures
	public var blackBackgroundTexture : Texture2D;
	//public var loadingTexture : Texture;
	//public var iconTexture : Texture;
	//public var backgroundTexture : Texture2D;
	//public var foregroundTexture : Texture2D;
	//public var onlineTexture : Texture2D;
	
	private var style : GUIStyle = GUIStyle();
	private var titleStyle : GUIStyle = GUIStyle();
	public var boldFont : Font;
	public var regularFont : Font;
	
	public var guiCamera : Camera; // this is for the loading screen where the game's camera will not exsist
	
	public var loadDelay : float = 3.0f; // The minimum amout of seconds the user will wait
	
	private var descRect : Rect;
	
	// New Loading Textures
	public var backgroundText:Texture;
	public var loadingBackground:Texture;
		private var loadingBGRect:Rect;
	public var loadingStatusBox:Texture;
	public var loadingStatusBoxPressed:Texture;
		private var loadingStatusBoxRect:Rect;
	//public var viewFullDescriptButton:Texture;
		//private var fullDescriptButtonRect:Rect;
	//public var viewJobOnlineButton:Texture;
		//private var jobOnlineButtonRect:Rect;
	public var viewJobWebsiteButton:Texture;
	public var viewJobWebsiteButtonPressed:Texture;
		private var jobWebsiteButtonRect:Rect;
	public var placeholderPanel:Texture;
		private var panelRect:Rect;
		private var jobTextRect:Rect;
		private var loadingStatusRect:Rect;
	
	private var loadingStatusFontSize:float;
	
	// job title and description font sizes
	private var descFontScale : float = 0.2;
	private var initialDescFontSize : float;
	private var descFontSize : float;
	private var jobFontSize:float;
	
	private var leftOffsetScale : float = 0.025;
	private var leftOffset : float;
	private var topOffsetScale : float = .2;
	private var topOffset : float;
	
	private var descWidthScale : float = .6;
	private var descWidth : float;
	
	private var loadingWidthScale : float = .25;
	private var loadingWidth : float;
	private var loadingHeightScale : float = .1;
	private var loadingHeight : float;
	
	private var iconWidthScale : float = .33;
	private var iconWidth : float;
	private var iconHeightScale : float = .4;
	private var iconHeight : float;
	
	private var onlineHeightScale : float = .2;
	private var onlineHeight : float;
	
	// variables for confirmation to go to site
	private var showConfirmation : boolean = false;
	private var confirmationRect : Rect;
	private var confirmCancelRect : Rect;
	private var confirmContinueRect : Rect;
	private var confirmTextRect : Rect;
	
	private var currentJob : Job;
	private var currentJobDesc : String;
	private var currentJobInformation : String;
	private var toggleText : String = "More information";
	private var overviewInformationShowing : boolean = true;
	
	private var hasLoaded : boolean = false;
	public static var hasFinishedDelay : boolean  = false;
	
	public var panels:List.<Texture> = new List.<Texture>();
	private var numOfNarrFolders = 15;		// THIS should be the number of folders there are in Resources/NarrativePanels folder
	private static var lastNarrShown : int = -1;
	public var currentPanel:int = 0;
	public var nextPanel:int = 0;
	private var framesPerSecond:int = 150;	// This is how long (frames) a panel is displayed before switching to the next
	private var currentFrame:int;
	private var fading:boolean;
	private var reset:boolean;
	private var fade:float;
	
	private var panelLabel:Rect;
	
	public var infoBox:Texture;
	public var infoButton:Texture;
	public var infoButtonPressed:Texture;
	
	public var buttonSkin:GUISkin;
	public var buttonStyle:GUIStyle;
	
	public var jobBox:Texture;
	private var jobBoxRect:Rect;
	
	public var missionBeginButton:Texture;
	public var missionBeginButtonPressed:Texture;
	public var missionLoadingButton:Texture;
	
	private var screenRect:Rect;
	
	private var displayComicPanels:boolean;
	
	public var websiteButton:Texture;
	public var websiteButtonPressed:Texture;
	
	
	private var exploreCareersAB:AnimatedButton;
	private var beginMissionAB:AnimatedButton;
	
	private var jobTextST:ShadowedText;
	private var jobTitleTextST:ShadowedText;
	private var jobTitleUnderlineTextST:ShadowedText;
	private var panelST:ShadowedText;
	private var panelST2:ShadowedText;
	
	public function Initialize()
	{
		super.Initialize();
		
		if(debugCycleJobDescriptions)
			displayComicPanels = false;
		else if(PlayerPrefs.HasKey("displayComicPanels"))
		{
			if(PlayerPrefs.GetInt("displayComicPanels") == 1)
			{
				displayComicPanels = false;
				PlayerPrefs.SetInt("displayComicPanels", 0);
			}
			else
			{
				displayComicPanels = true;
				PlayerPrefs.SetInt("displayComicPanels", 1);
			}
		}
		else
		{
			displayComicPanels = true;
			PlayerPrefs.SetInt("displayComicPanels", 1);
			
		}

		// To help maintain a 16:9 ratio for the screen, and for the screen to be in the center
		//screenRect = createRect(new Vector2(1920, 1080),0,0, 1, true);
		//screenRect.x = (Screen.width / 2) - (screenRect.width / 2);
		//screenRect.y = (Screen.height / 2) - (screenRect.height / 2);
		screenRect = createScreenRect(1920f, 1080f);
		
		currentFrame = framesPerSecond;
		currentPanel = 0;
		nextPanel = 0;
		fading = false;
		reset = false;
		fade = 1.0;
		SetupRectangles();
							
		initialDescFontSize = screenRect.height * descFontScale;
		style.normal.textColor = Color.white;
		style.active.textColor = Color.white;
		style.hover.textColor = Color.white;
		style.font = regularFont;
		style.wordWrap = true;
		
		titleStyle.normal.textColor = Color.white;
		titleStyle.active.textColor = Color.white;
		titleStyle.hover.textColor = Color.white;
		titleStyle.font = regularFont;
		titleStyle.wordWrap = true;
		
		jobFontSize = calcFontSize(18);
		
		//Making error. Not sure what this is. GPC 3/5/14
		buttonStyle = buttonSkin.GetStyle("BlueButtonRight");
		buttonStyle.fontSize = 48 * Screen.height / 1080.0;
        buttonStyle.fontSize = Mathf.Min(Screen.width, Screen.height) / 30;
		
		/*style.normal.background = null;
		style.active.background = null;
		style.hover.background = null;*/
		//style.richText = true;
		// Add the background rect to the rectList for checking input collision
		
		
		rectList.Add(background);
		backgroundMusic = SoundManager.Instance().backgroundSounds.loadingMenuMusic;
		
	
		var percentage:float = screenWidth / 1920; //Assumes images made to spec of 1920 px
		
		loadingBGRect = createRect(loadingBackground,0,0.04, 0.86, false, screenRect);
		
		//var newWidth:float = Screen.width;
		//var percentOfScreen:float = newWidth / loadingBGRect.width;
		//var newHeight:float = loadingBGRect.height * percentOfScreen;
		//var newY:float =  Screen.height / 2 - newHeight / 2;
		//loadingBGRect = Rect(Screen.width / 2 - newWidth / 2, newY, newWidth, newHeight);
		
		
		
		
		loadingStatusBoxRect = createRect(loadingStatusBox, 0, 0.81, 0.15, false, screenRect);
		loadingStatusBoxRect.x = (screenRect.width / 2) - (loadingStatusBoxRect.width) / 2;
		
		
		jobWebsiteButtonRect = createRect(websiteButton,0.55,0.61, 0.099, true, screenRect);
		
		//fullDescriptButtonRect = createRect(viewFullDescriptButton,0.55,0.67, 0.099, true);
		//jobOnlineButtonRect = createRect(viewJobOnlineButton,0.55,0.55, 0.099, true);
		//panelRect = createRect(placeholderPanel,0.05,0.26, 0.5, true, screenRect);
		
		panelRect = createRect(placeholderPanel,0,0, 0.6, true, screenRect);
		panelRect.x = screenRect.width / 2 - panelRect.width / 2;
		panelRect.y = screenRect.height / 2 - panelRect.height / 2 - padding;
	
		
		jobWebsiteButtonRect.y = panelRect.y + panelRect.height - jobWebsiteButtonRect.height;
		jobWebsiteButtonRect.x = screenRect.width - jobWebsiteButtonRect.width - panelRect.x;
		
		
		
		jobTextRect = createRect( Vector2(861, 531), 877f/1920f, 243f/1080f, 388f/1080f, false, screenRect);
		STARTjobTextRect = new Rect(jobTextRect.x, jobTextRect.y, jobTextRect.width, jobTextRect.height);
		
		jobWebsiteButtonRect = createRect( websiteButton, 0.44, 0.58, 0.11, false, screenRect);
		
		//jobTextRect.y = panelRect.y;
		
		// So the job text rect will go all the way to just a little bit above the jobs online button
		//jobTextRect.height = jobWebsiteButtonRect.y -(jobTextRect.y + padding);
		//jobTextRect.height = jobTextRect.height - jobWebsiteButtonRect.height;
		
		loadingStatusRect = createRect( Vector2(855, 134), 0, 0.08, 0.85, true, loadingStatusBoxRect);
		loadingStatusRect.x = (screenRect.width / 2) - (loadingStatusRect.width) / 2;
		loadingStatusRect.y += loadingStatusBoxRect.y;
		loadingStatusFontSize = 0.10 * screenRect.height;
		
		var narrToDisplay : int;
		do
		{
			narrToDisplay = Random.Range(1, numOfNarrFolders + 1);
		} while (narrToDisplay == lastNarrShown);
		lastNarrShown = narrToDisplay;
		var path : String = "NarrativePanels/" + narrToDisplay;//Random.Range(1, numOfNarrFolders + 1);
		var panelTextures: Object[] = Resources.LoadAll(path, Texture);
		
		for(var i:int = 0; i < panelTextures.length; i++)
		{
			var tempTexture:Texture = panelTextures[i];
			panels.Add(tempTexture);
		}
		
		if(panels.Count > 0)
		{
			nextPanel = 1;
		}
		
		// setup confirmation window
		confirmationRect = Rect(.3 * screenRect.width, .3 * screenRect.height, .4*screenRect.width, .4* screenRect.height);
		confirmCancelRect = Rect(confirmationRect.x + (.1 * confirmationRect.width), confirmationRect.y + .7 * confirmationRect.height - padding,
								confirmationRect.width * .3, confirmationRect.height * .3);
		confirmContinueRect = Rect((confirmationRect.x + confirmationRect.width) - ((.1 * confirmationRect.width) + confirmCancelRect.width), confirmCancelRect.y, confirmCancelRect.width, confirmCancelRect.height);
		
		panelLabel = Rect(panelRect.x, panelRect.y - (0.1 * screenRect.height),panelRect.width, 0.1 * screenRect.height);
		var height:int = style.CalcHeight(GUIContent("TEST"), panelLabel.width);
		//panelLabel.y = panelRect.y - height * 2.2;
		//panelLabel.x = panelRect.x + panelRect.width;
		panelLabel.x = panelRect.x + panelRect.width + padding;
		panelLabel.y = panelRect.y;
		
		panelST = new ShadowedText("", panelLabel, style, false);
		panelST2 = new ShadowedText("", panelLabel, style, false);

		jobBoxRect = createRect(jobBox, 0,0,0.63, false, screenRect);
		jobBoxRect.x = screenRect.width / 2 - jobBoxRect.width / 2;
		jobBoxRect.y = screenRect.height / 2 - jobBoxRect.height / 2 - padding * 2;
		
		style.stretchWidth = true;
		style.stretchHeight = true;
		style.margin = RectOffset (0, 0, 0, 0);
		style.padding = RectOffset (0, 0, 0, 0);
		
		titleStyle.stretchWidth = true;
		titleStyle.stretchHeight = true;
		titleStyle.margin = RectOffset (0, 0, 0, 0);
		titleStyle.padding = RectOffset (0, 0, 0, 0);
		
		titleStyle.alignment = TextAnchor.UpperLeft;
		
		
		jobFontSize = CalcFontByRect(currentJobInformation, jobTextRect, jobFontSize);
		
		
		exploreCareersAB = new AnimatedButton(Color.green, websiteButton, jobWebsiteButtonRect, Vector2(screenRect.x, screenRect.y));
		beginMissionAB = new AnimatedButton(Color.yellow, missionBeginButton, loadingStatusBoxRect, Vector2(screenRect.x, screenRect.y));
		
		InspectionDisplay.fromLoading = true;
	}
	
	public function Render() 
	{
		//GUI.DrawTexture(Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight), backgroundText, ScaleMode.StretchToFill);
		AnimatedBackground(backgroundText);
		GUI.depth = 0;
		GUI.BeginGroup(screenRect);
			
				// New Loading Textures
		
		GUI.DrawTexture(loadingBGRect, loadingBackground, ScaleMode.StretchToFill);		
		//GUI.DrawTexture(loadingStatusBoxRect, loadingStatusBox);
		
		
		if(displayComicPanels)
		{
			GUI.DrawTexture(panelRect, panels[currentPanel]);
		
			if(!fading && !reset)
			{
				style.font = regularFont;
				style.fontSize = descFontSize;
				style.alignment = TextAnchor.UpperLeft;
				//GUI.Label(panelLabel, ((currentPanel+1) + "/" + panels.Count), style);
				
				panelST.Display(((currentPanel+1) + "/" + panels.Count), panelLabel, false);
				
				style.font = boldFont;
				style.fontSize = loadingStatusFontSize;
				style.alignment = TextAnchor.MiddleCenter;
			}
			
			if(panels.Count > 1)
				currentFrame--;
				
			// When it reaches frame 0 and it is not fading, set to fade
			if(!reset && !fading && currentFrame <= 0)
			{	
				fading = true;
				fade = 0f;
			}
			
			// if it is set to fade, fade...until it is no longer fading,
			// then if it's still on frame 0, reset the clock
			if(panels.Count > 1 && fading)
			{
				fade += 0.01;
				GUI.color.a = fade;
				
				style.font = regularFont;
				style.fontSize = descFontSize;
				//style.alignment = TextAnchor.MiddleRight;
				style.alignment = TextAnchor.UpperLeft;
				//GUI.Label(panelLabel, ((nextPanel+1) + "/" + panels.Count), style);
				
				panelST.Display(((nextPanel+1) + "/" + panels.Count), panelLabel, false);
				
				GUI.DrawTexture(panelRect, panels[nextPanel]);
				GUI.color.a = 1.0 - fade;
				
				//GUI.Label(panelLabel, ((currentPanel+1) + "/" + panels.Count), style);
				panelST2.Display(((currentPanel+1) + "/" + panels.Count), panelLabel, false);
				
				
				style.font = boldFont;
				style.fontSize = loadingStatusFontSize;
				style.alignment = TextAnchor.MiddleCenter;
				GUI.color.a = 1.0f;
				if(fade >= 1.0f)
				{
					reset = true;
					fading = false;
				}
			}
			else if(panels.Count > 1 && reset)
			{
				style.font = regularFont;
				style.fontSize = descFontSize;
				style.alignment = TextAnchor.UpperLeft;
				//GUI.Label(panelLabel, ((nextPanel+1) + "/" + panels.Count), style);
				panelST2.Display(((nextPanel+1) + "/" + panels.Count), panelLabel, false);
				style.font = boldFont;
				style.fontSize = loadingStatusFontSize;
				style.alignment = TextAnchor.MiddleCenter;
				
				GUI.DrawTexture(panelRect, panels[nextPanel]);
				
				currentPanel = (currentPanel + 1) % panels.Count;
				nextPanel = (nextPanel + 1) % panels.Count;
				
				/*
				currentPanel++;
				nextPanel++;
				if(currentPanel >= )
					currentPanel = 0;
				if(nextPanel >= panels.Count)
					nextPanel = 0;
				*/	
				currentFrame = framesPerSecond;
				fading = false;
				reset = false;
			}
		}
		else
		{
			GUI.DrawTexture(jobBoxRect, jobBox);
			/*
			setButtonTexture(viewJobWebsiteButton, viewJobWebsiteButtonPressed, style);
			if (GUI.Button(jobWebsiteButtonRect,"", style))
			{
				//Application.OpenURL("http://energy.gov/jobs");
				showConfirmation = true;
			}
			resetButtonTexture(style);
			*/
			
			//setButtonTexture(websiteButton, websiteButtonPressed, style);
			
			if(showConfirmation)
				GUI.enabled = false;
			
			if(exploreCareersAB.Render(style))
			{
				//Application.OpenURL("http://energy.gov/jobs");
				showConfirmation = true;
			}
			//resetButtonTexture(style);
			
			if(showConfirmation)
				GUI.enabled = true;
			
			
			style.font = regularFont;
			style.fontSize = jobFontSize;
			style.alignment = TextAnchor.UpperLeft;
			//GUI.Label(jobTextRect, currentJobInformation, style);			
			jobTextST.Display();
			//jobTitleUnderlineTextST.Display();
			jobTitleTextST.Display();
			
			style.font = boldFont;
			style.fontSize = loadingStatusFontSize;
			style.alignment = TextAnchor.MiddleCenter;
		
		}
		
		if(debugCycleJobDescriptions)
		{
			if(beginMissionAB.Render(style))
			{
				if(!showConfirmation)
				{
					//Initialize();
					//GetNewJob();
					Application.LoadLevel(Application.loadedLevel);
				}
			}
		}
		else if (hasLoaded)
		{
			if (hasFinishedDelay)
			{
				//setButtonTexture(missionBeginButton, missionBeginButtonPressed, style);	
						
				if(beginMissionAB.Render(style))
				{
					if(!showConfirmation)
					{
						//Since the timer starts as soon as the level loads, this resets it for when the player starts the mission
						//If statement added for non-IntelSystem scenes GPC 2/13/14
						if(GameObject.Find("Database")){
							var intelSystem:IntelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
							intelSystem.resetTimer();
						}
						
						var inspectionRef : InspectionDisplay = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
						
						if (inspectionRef)
							inspectionRef.SetEnabled(true);
						
						currentResponse.type = EventTypes.DONELOADING;
					}
				}
				//resetButtonTexture(style);
			}
			/*
			if (GUI.Button(toggleDescriptionRect, toggleText, style))
			{
				ToggleInformation();
			}
			*/
		}
		else if (!hasFinishedDelay)
		{
			GUI.DrawTexture(loadingStatusBoxRect, missionLoadingButton);
		}
		
		
		style.alignment = TextAnchor.UpperLeft;	
		
		if (showConfirmation)
		{
			RenderConfirmationWindow();
		}
		
		GUI.EndGroup();
	}
	
	private function RenderConfirmationWindow()
	{
		style.font = regularFont;
		style.fontSize = descFontSize * .9;
		style.alignment = TextAnchor.MiddleCenter;
		
		//setButtonTexture(infoBox, infoBox, style);
		GUI.DrawTexture(confirmationRect,infoBox);
		GUI.Box(confirmationRect, "Continue to DOE website?", style);
		//setButtonTexture(infoButton, infoButtonPressed, style);
		GUI.DrawTexture(confirmCancelRect,infoButton);
		GUI.DrawTexture(confirmContinueRect,infoButton);
		
		
		if (GUI.Button(confirmCancelRect, "Cancel", style))
		{
			showConfirmation = false;
		}
		if (GUI.Button(confirmContinueRect, "Continue", style))
		{
			//MetricContainer.IncrementSessionSiteClicks(); -- this line is causing an error
			Application.OpenURL("http://energy.gov/jobs/search");
			showConfirmation = false;
		}
		//resetButtonTexture(style);
		
		style.font = boldFont;
		style.fontSize = loadingStatusFontSize;
		style.alignment = TextAnchor.MiddleCenter;
	}
	
	private function DelayLoad(seconds:int):IEnumerator{
		if (seconds < 0) seconds = 0;
		yield WaitForSeconds(seconds);
		hasFinishedDelay = true;
	}
	
	public function LoadLevel(levelName:String){
		hasLoaded = false;
		hasFinishedDelay = false;
		var startTime : float = Time.time;
		if (guiCamera == null) {
			guiCamera = Camera.main;
		}
		//Removing warnings GPC 5/29/14
		//guiCamera.gameObject.SetActiveRecursively(true);
		guiCamera.gameObject.SetActive(true);
		
		//Testing to see what this works GPC 2/13/14 
		Application.LoadLevelAdditive(levelName); // This will freeze the game without pro version
		//Application.LoadLevel(levelName); // This will freeze the game without pro version
		
		yield WaitForSeconds(1);
		hasLoaded = true;
		
		var totalLoadTime : float = Time.time - startTime;
		
		DelayLoad(loadDelay-totalLoadTime);
		
		//Added if statement for non-IntelSystem levels GPC 2/13/14
		if(GameObject.Find("Database")){
			var intelSystem : IntelSystem = GameObject.Find("Database").GetComponent("IntelSystem");
			if (intelSystem == null) Debug.LogError("Could not find intel system to update the current level.");
			else {
				intelSystem.currentLevelName = levelName;
				intelSystem.levelName = levelName;
			}
		}
	}
	
	public function GetNewJob()
	{
		//style.font = regularFont;
		//style.fontSize = jobFontSize;
		//style.alignment = TextAnchor.UpperLeft;
		
		if(debugCycleJobDescriptions)
		{	

			currentJobDesc = "";
			
			if(!PlayerPrefs.HasKey("currentJobNum"))
			{
				currentJobNum = 0;
				
			}
			else
				currentJobNum = PlayerPrefs.GetInt("currentJobNum");
			
			currentJob = JobDatabase.GetJobAtIndex(currentJobNum);
			currentJobNum++;
			PlayerPrefs.SetInt("currentJobNum", currentJobNum);
		}
		else
		{
			if(PlayerPrefs.HasKey("currentJobNum"))
			{
				PlayerPrefs.DeleteKey("currentJobNum");
			}
			
			currentJobDesc = "";
			currentJob = JobDatabase.GetRandomJob();
		}
	
		currentJobDesc += currentJob.description + "\n\n";
		var height : float = style.CalcHeight(GUIContent(currentJobDesc), descRect.width);

		
		descRect.y = (screenHeight - height) / 2;
		
		descFontSize = Mathf.Min(Screen.width, Screen.height) * 0.035;
		currentJobInformation = currentJobDesc;
		
		titleStyle.fontSize = jobFontSize;
		
		//if(debugCycleJobDescriptions && currentJobNum > 0)
		
		jobTextRect = new Rect(STARTjobTextRect.x, STARTjobTextRect.y, STARTjobTextRect.width, STARTjobTextRect.height);
		jobTextRect.height -= titleStyle.CalcHeight(GUIContent(currentJob.title), jobTextRect.width);
		
		jobFontSize = calcFontSize(18);
		jobFontSize = CalcFontByRect(currentJobInformation, jobTextRect, jobFontSize) * (1f + GUIManager.Instance().loadingScaling.job);
		
		titleStyle.fontSize = jobFontSize * 1.5 * (1f + GUIManager.Instance().loadingScaling.title);
		
		
		
		
		
		var titleRect : Rect = Rect(jobTextRect.x, jobTextRect.y,
		jobTextRect.width,
		titleStyle.CalcHeight(GUIContent(currentJob.title), jobTextRect.width));
		titleRect.width *= 1.35f;
		
		jobTitleTextST = new ShadowedText(currentJob.title, titleRect, titleStyle, false);
		
		jobTextRect.y = titleRect.y + titleRect.height + padding;
		
		jobTextST = new ShadowedText(currentJobInformation, jobTextRect, style, false);
		
		/*
		var underlineText:String = "";
		
		for(var j:int = 0; j < currentJob.title.length; j++)
		{
			underlineText += "_";
		}
		
		jobTitleUnderlineTextST = new ShadowedText(underlineText, titleRect, titleStyle, false);
		*/
	
	}
	
	// calculates and sets font size to fit text within a given rect, starting from a given initial size
	private function CalcFontByRect(label : String, r : Rect, initial : float) : float
	{
		var size : float = initial;
		style.fontSize = size;
		while (style.CalcHeight(GUIContent(label), r.width) > r.height)
		{	
			size *= .9;
			style.fontSize = size;
		}
		return size;
	}
	
	private function SetupRectangles(){
		blackBackground = RectFactory.NewRect(0,0,1,1);
		background = RectFactory.NewRect(0,0,1,1);
		
		leftOffset = screenWidth * leftOffsetScale;
		topOffset = screenHeight * topOffsetScale;
		
		loadingWidth = screenWidth * loadingWidthScale;
		loadingHeight = screenHeight * loadingHeightScale;
		loadingRect = Rect(screenWidth - loadingWidth, 0, loadingWidth, loadingHeight);
		
		descWidth = screenWidth * descWidthScale;
		descRect = Rect(leftOffset, topOffset,
							descWidth, screenHeight - (2 * topOffset));
							
		toggleDescriptionRect = Rect(leftOffset, topOffset + screenHeight - (2 * topOffset),
							descWidth, screenHeight - (2 * topOffset));
							
		iconWidth = screenWidth * iconWidthScale;
		iconHeight = screenHeight * iconHeightScale;
		iconRect = Rect(screenWidth - iconWidth - leftOffset, topOffset, iconWidth, iconHeight);
		
		onlineHeight = screenHeight * onlineHeightScale;
		onlineRect = Rect(screenWidth - iconWidth - leftOffset, topOffset + iconHeight + 2*leftOffset, iconWidth, onlineHeight);
	}
	
	private function ToggleInformation(){
		overviewInformationShowing = !overviewInformationShowing;
		if (overviewInformationShowing){
			toggleText = "More Information";
			currentJobInformation = currentJobDesc; 
		} else {
			toggleText = "Less Information";
			currentJobInformation = currentJob.description;
		}
	}
}