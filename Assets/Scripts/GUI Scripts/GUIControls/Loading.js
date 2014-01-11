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
public class Loading extends GUIControl
{
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
	private var numOfNarrFolders = 14;		// THIS should be the number of folders there are in Resources/NarrativePanels folder
	public var currentPanel:int = 0;
	public var nextPanel:int = 0;
	private var framesPerSecond:int = 150;	// This is how long (frames) a panel is displayed before switching to the next
	private var currentFrame:int;
	private var fading:boolean;
	private var reset:boolean;
	private var fade:float;
	
	private var panelLabel:Rect;
	
	public function Initialize()
	{
		super.Initialize();
		
		currentFrame = framesPerSecond;
		currentPanel = 0;
		nextPanel = 0;
		fading = false;
		reset = false;
		fade = 1.0;
		SetupRectangles();
							
		initialDescFontSize = screenHeight * descFontScale;
		style.normal.textColor = Color.white;
		style.active.textColor = Color.white;
		style.hover.textColor = Color.white;
		style.font = regularFont;
		style.wordWrap = true;
		/*style.normal.background = null;
		style.active.background = null;
		style.hover.background = null;*/
		//style.richText = true;
		// Add the background rect to the rectList for checking input collision
		
		
		rectList.Add(background);
		backgroundMusic = SoundManager.Instance().backgroundSounds.loadingMenuMusic;
		
	
		var percentage:float = screenWidth / 1920; //Assumes images made to spec of 1920 px
		
		loadingBGRect = createRect(loadingBackground,0,0.04, 0.86, false);
		
		loadingStatusBoxRect = createRect(loadingStatusBox, 0, 0.81, 0.15, false);
		loadingStatusBoxRect.x = (screenWidth / 2) - (loadingStatusBoxRect.width) / 2;
		
		
		jobWebsiteButtonRect = createRect(viewJobWebsiteButton,0.55,0.61, 0.099, true);
		
		//fullDescriptButtonRect = createRect(viewFullDescriptButton,0.55,0.67, 0.099, true);
		//jobOnlineButtonRect = createRect(viewJobOnlineButton,0.55,0.55, 0.099, true);
		panelRect = createRect(placeholderPanel,0.05,0.26, 0.5, true, Rect(0,0,screenWidth / 2, screenHeight));
		
		jobWebsiteButtonRect.y = panelRect.y + panelRect.height - jobWebsiteButtonRect.height;
		jobWebsiteButtonRect.x = screenWidth - jobWebsiteButtonRect.width - panelRect.x;
		
		
		
		jobTextRect = createRect( Vector2(810, 414), 0.55,0.16, 0.38, true);
		
		jobTextRect.y = panelRect.y;
		
		// So the job text rect will go all the way to just a little bit above the jobs online button
		jobTextRect.height = jobWebsiteButtonRect.y -(jobTextRect.y + padding);
		
		loadingStatusRect = createRect( Vector2(855, 134), 0, 0.08, 0.85, true, loadingStatusBoxRect);
		loadingStatusRect.x = (screenWidth / 2) - (loadingStatusRect.width) / 2;
		loadingStatusRect.y += loadingStatusBoxRect.y;
		loadingStatusFontSize = 0.10 * screenHeight;
		
		var path : String = "NarrativePanels/" + Random.Range(1, numOfNarrFolders + 1);
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
		confirmationRect = Rect(.3 * screenWidth, .3 * screenHeight, .4*screenWidth, .4* screenHeight);
		confirmCancelRect = Rect(confirmationRect.x + (.2 * confirmationRect.width), confirmationRect.y + .7 * confirmationRect.height,
								confirmationRect.width * .2, confirmationRect.height * .2);
		confirmContinueRect = Rect(confirmCancelRect.x + confirmCancelRect.width * 2, confirmCancelRect.y, confirmCancelRect.width, confirmCancelRect.height);
		
		panelLabel = Rect(panelRect.x, panelRect.y - (0.1 * Screen.height),panelRect.width, 0.1 * Screen.height);
		style.stretchWidth = true;
		style.stretchHeight = true;
		style.margin = RectOffset (0, 0, 0, 0);
		style.padding = RectOffset (0, 0, 0, 0);
	}
	
	public function Render() 
	{
		GUI.depth = 0;
			
				// New Loading Textures
		
		GUI.DrawTexture(Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight), backgroundText);
		GUI.DrawTexture(loadingBGRect, loadingBackground);
		
		GUI.DrawTexture(loadingBGRect, loadingBackground);
		
		GUI.DrawTexture(loadingStatusBoxRect, loadingStatusBox);
		
		/*
		GUI.DrawTexture(fullDescriptButtonRect, viewFullDescriptButton);
		GUI.DrawTexture(jobOnlineButtonRect, viewJobOnlineButton);
		if (GUI.Button(jobOnlineButtonRect,"", style))
		{
			Application.OpenURL(currentJob.url);
		}
		*/
		
		setButtonTexture(viewJobWebsiteButton, viewJobWebsiteButtonPressed, style);
		if (GUI.Button(jobWebsiteButtonRect,"", style))
		{
			//Application.OpenURL("http://energy.gov/jobs");
			showConfirmation = true;
		}
		resetButtonTexture(style);
		GUI.DrawTexture(panelRect, panels[currentPanel]);
	
		style.font = regularFont;
		style.fontSize = descFontSize;
		style.alignment = TextAnchor.MiddleLeft;
		GUI.Label(panelLabel, ((currentPanel+1) + "/" + panels.Count), style);
		style.font = boldFont;
		style.fontSize = loadingStatusFontSize;
		style.alignment = TextAnchor.MiddleCenter;
		
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
			GUI.DrawTexture(panelRect, panels[nextPanel]);
			GUI.color.a = 1.0f;
			if(fade >= 1.0f)
			{
				reset = true;
				fading = false;
			}
		}
		else if(panels.Count > 1 && reset)
		{
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
		
		
		
		style.font = regularFont;
		style.fontSize = descFontSize;
		style.alignment = TextAnchor.UpperLeft;
		GUI.Label(jobTextRect, currentJobInformation, style);
		
		style.font = boldFont;
		style.fontSize = loadingStatusFontSize;
		style.alignment = TextAnchor.MiddleCenter;
		
		if (hasLoaded)
		{
			if (hasFinishedDelay)
			{
				setButtonTexture(loadingStatusBox, loadingStatusBoxPressed, style);		
				if (GUI.Button(loadingStatusBoxRect, "Begin Mission", style))
				{
					//Since the timer starts as soon as the level loads, this resets it for when the player starts the mission
					var intelSystem:IntelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
					intelSystem.resetTimer();
					currentResponse.type = EventTypes.DONELOADING;
				}
				resetButtonTexture(style);
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
			GUI.Label(loadingStatusRect, "Loading...", style);
		}
		
		
		style.alignment = TextAnchor.UpperLeft;	
		
		if (showConfirmation)
			RenderConfirmationWindow();
	}
	
	private function RenderConfirmationWindow()
	{
		GUI.Box(confirmationRect, "Continue to DOE website?");
		if (GUI.Button(confirmCancelRect, "Cancel"))
			showConfirmation = false;
		if (GUI.Button(confirmContinueRect, "Continue"))
		{
			Application.OpenURL("http://energy.gov/jobs");
			showConfirmation = false;
		}
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
		guiCamera.gameObject.SetActiveRecursively(true);
		
		Application.LoadLevelAdditive(levelName); // This will freeze the game without pro version
		
		yield WaitForSeconds(3);
		hasLoaded = true;
		
		var totalLoadTime : float = Time.time - startTime;
		
		DelayLoad(loadDelay-totalLoadTime);
		
		var intelSystem : IntelSystem = GameObject.Find("Database").GetComponent("IntelSystem");
		if (intelSystem == null) Debug.LogError("Could not find intel system to update the current level.");
		else {
			intelSystem.currentLevelName = levelName;
			intelSystem.levelName = levelName;
		}
	}
	
	public function GetNewJob()
	{
		currentJob = JobDatabase.GetRandomJob();
		//currentJobDesc = "Latest Job:\n\n";
		//currentJobDesc += currentJob.title + "\n\n";
		currentJobDesc = currentJob.title + "\n\n";
		currentJobDesc += currentJob.description + "\n\n";
		//currentJobDesc += "Sub Agency: " + currentJob.agency;
		//currentJobDesc += "\nSalary Range: $" + currentJob.salaryMin + " - $" + currentJob.salaryMax;
		//currentJobDesc += "\nOpen Period: " + currentJob.openPeriodStart + " to " + currentJob.openPeriodEnd;
		//currentJobDesc += "\nPosition Information: " + currentJob.positionInformation;
		//currentJobDesc += "\nLocation: " + currentJob.location;
		//currentJobDesc += "\nWho May Be Considered:\n" + currentJob.whoConsidered;
		
		style.font = regularFont;//boldFont;
		descFontSize = CalcFontByRect(currentJobDesc, descRect, initialDescFontSize);//titleFontSize;
		var height : float = style.CalcHeight(GUIContent(currentJobDesc), descRect.width);
		descRect.y = (screenHeight - height) / 2;
		
		descFontSize = screenHeight * 0.04;
		currentJobInformation = currentJobDesc;
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