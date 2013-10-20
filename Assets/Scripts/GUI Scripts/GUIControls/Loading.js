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
	public var loadingTexture : Texture;
	public var iconTexture : Texture;
	//public var backgroundTexture : Texture2D;
	public var foregroundTexture : Texture2D;
	public var onlineTexture : Texture2D;
	
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
		private var loadingStatusBoxRect:Rect;
	public var viewFullDescriptButton:Texture;
		private var fullDescriptButtonRect:Rect;
	public var viewJobOnlineButton:Texture;
		private var jobOnlineButtonRect:Rect;
	public var viewJobWebsiteButton:Texture;
		private var jobWebsiteButtonRect:Rect;
	public var doeLogo:Texture;
		private var doeLogoRect:Rect;
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
	
	private var currentJob : Job;
	private var currentJobDesc : String;
	private var currentJobInformation : String;
	private var toggleText : String = "More information";
	private var overviewInformationShowing : boolean = true;
	
	private var hasLoaded : boolean = false;
	public static var hasFinishedDelay : boolean  = false;
	
	public function Initialize()
	{
		super.Initialize();
		
		
		SetupRectangles();
							
		initialDescFontSize = screenHeight * descFontScale;
		style.normal.textColor = Color.white;
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
		
		fullDescriptButtonRect = createRect(viewFullDescriptButton,0.55,0.67, 0.099, true);
		jobOnlineButtonRect = createRect(viewJobOnlineButton,0.55,0.55, 0.099, true);
		panelRect = createRect(placeholderPanel,0.05,0.26, 0.5, true, Rect(0,0,screenWidth / 2, screenHeight));
		
		jobTextRect = createRect( Vector2(810, 414), 0.55,0.16, 0.38, true);
		loadingStatusRect = createRect( Vector2(755, 134), 0, 0.08, 0.85, true, loadingStatusBoxRect);
		loadingStatusRect.x = (screenWidth / 2) - (loadingStatusRect.width) / 2;
		loadingStatusRect.y += loadingStatusBoxRect.y;
		loadingStatusFontSize = 0.10 * screenHeight;
		
	}
	
	public function Render() 
	{
		GUI.depth = 0;
		
		
		//GUI.DrawTexture(blackBackground, blackBackgroundTexture);
		//GUI.DrawTexture(background, backgroundTexture, ScaleMode.ScaleToFit);
		//GUI.DrawTexture(background, foregroundTexture, ScaleMode.ScaleToFit);
		
		if (hasLoaded){
			if (GUI.Button(onlineRect, onlineTexture, style)){
				Application.OpenURL(currentJob.url);
			}
			if (hasFinishedDelay){
				if (GUI.Button(loadingRect, "Continue", style)){
					currentResponse.type = EventTypes.DONELOADING;
				}
			}
			if (GUI.Button(toggleDescriptionRect, toggleText, style)){
				ToggleInformation();
			}	
		} else if (!hasFinishedDelay) {
			GUI.DrawTexture(loadingRect, loadingTexture, ScaleMode.ScaleToFit);
		}
		
		style.font = regularFont;
		style.fontSize = descFontSize;
		GUI.Label(descRect, currentJobInformation, style);
		GUI.DrawTexture(iconRect, iconTexture, ScaleMode.ScaleToFit);
		
		
			// New Loading Textures
	
	GUI.DrawTexture(Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight), backgroundText);
	GUI.DrawTexture(loadingBGRect, loadingBackground);
	
	GUI.DrawTexture(loadingBGRect, loadingBackground);
	GUI.DrawTexture(loadingStatusBoxRect, loadingStatusBox);
	
	GUI.DrawTexture(fullDescriptButtonRect, viewFullDescriptButton);
	GUI.DrawTexture(jobOnlineButtonRect, viewJobOnlineButton);
	
	GUI.DrawTexture(panelRect, placeholderPanel);
	
	
	style.font = regularFont;
	style.fontSize = descFontSize;
	GUI.Label(jobTextRect, currentJobInformation, style);	
	
	style.font = boldFont;
	style.fontSize = loadingStatusFontSize;
	style.alignment = TextAnchor.MiddleCenter;
	GUI.Label(loadingStatusRect, "Loading...", style);
	style.alignment = TextAnchor.UpperLeft;	
		
		
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
		var debugMenu : DebugInfoMenu = GameObject.Find("GUI System").GetComponent("DebugInfoMenu");
		if (intelSystem == null) Debug.LogError("Could not find intel system to update the current level.");
		else if (debugMenu == null) Debug.LogError("Could not find debug menu to update the current level.");
		else {
			intelSystem.currentLevelName = levelName;
			intelSystem.levelName = levelName;
			debugMenu.currentLevel = levelName;
		}
	}
	
	public function GetNewJob()
	{
		currentJob = JobDatabase.GetRandomJob();
		currentJobDesc = "Latest Job:\n\n";
		currentJobDesc = currentJob.title + "\n\n";
		currentJobDesc += "Sub Agency: " + currentJob.agency;
		currentJobDesc += "\nSalary Range: $" + currentJob.salaryMin + " - $" + currentJob.salaryMax;
		currentJobDesc += "\nOpen Period: " + currentJob.openPeriodStart + " to " + currentJob.openPeriodEnd;
		currentJobDesc += "\nPosition Information: " + currentJob.positionInformation;
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