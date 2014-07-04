/* Revised/Replaced Coding by Katharine Uvick

	Calculating percentages based on design of Score Screen
	which involved a 1920 x 1080 size design (hence why
	these numbers are used in the calculations).

*/
import Prime31;

#pragma strict

public class ScoreMenu extends GUIControl
{
	
	private var saveSystem : SaveSystem;
	private var intelSystem : IntelSystem;
	
	// For Testing Purposes:
	public var GOTSCORE : int;
	public var USER : String;
	public var LEVELNAME : String;
	public var doTest : boolean;
	
	// BG Textures
	public var scoreScreenSkin : GUISkin;
	public var background : Texture;
	//public var lineOverlay : Texture;
	public var infoBox : Texture;
	//public var infoBox : TransparentGradientTexture;
	private var infoBoxRect:Rect;
	
	private var rankChangeAnimation:AnimatedText = new AnimatedText();
	
	// Honors Textures
	public var honorsTextures : List.<HonorIcon> = new List.<HonorIcon>();
	public var noHonorTexture:Texture;
	
	// Ratings Textures
	public var ratings : List.<Texture> = new List.<Texture>();
	private var missionRating : int = 0;
	
	//Share Button
	//public var shareButton : Texture;
	//public var shareButtonPressed : Texture;
	//private var shareButtonRect : Rect;
	//private var shareButtonX : float = 1476;
	//private var shareButtonY : float = 23;
	
	// Retry Button
	public var retryButton : Texture;
	public var retryButtonPressed : Texture;
	private var retryButtonRect : Rect;
	private var retryButtonX : float = 69;
	private var retryButtonY : float = 946;
	
	
	// Cont Button
	public var contButton : Texture;
	public var contButtonPressed : Texture;
	private var contButtonRect : Rect;
	private var contButtonX : float = 1341;
	private var contButtonY : float = 945;
	
	// Codex Icon
	public var codexIcon : Texture;
	private var codexIconRect : Rect;
	
	// Tech BG
	public var techBG : Texture;
	private var techBGRect : Rect;
	
	// Tech Image
	public var ecrbPlaceholder : Texture;
	private var techImage : Texture;
	private var techImageRect : Rect;
	private var techEntry : CodexEntry;
	
	// Text
	private var textX : float = 810;
	private var textY : float = 174;
	private var boxWidth : float = 1025;
	private var boxHeight : float = 60;
	
	private var agentName : String = "NoName";
	private var agentNameRect : Rect;
	
	private var agentRank : String = "NoRank";
	private var agentRankRect : Rect;
	
	private var missionScore : String = "00000";
	private var missionScoreRect : Rect;
	
	private var honorsBoxGap : float = 312;
	private var totalScore : String = "00000000";
	private var totalScoreRect : Rect;
	
	// Honors
	private var honorsBoxWidth : float = 1104;
	private var honorScoreOffsetX : float = 168;
	private var honorScoreOffsetY : float = 200;
	private var honorsLeftX : float = 140;
	private var honorsLeftY : float = 530;
	private var honorsRect : List.<Rect> = new List.<Rect>();
	private var honorStarRect : List.<Rect> = new List.<Rect>();
	private var numOfStarsAnimatedHonors:int = 0;
	private var numOfStarsAnimated:int = 0;
	private var starAnimationSpeed:float = 0.7f;
	private var honorsAnimation : AnimatedImage[] = new AnimatedImage[3];
	private var currentHonorToAnimate : int = 0;
	private var starAnimation : AnimatedImage[] = new AnimatedImage[5];
	private var starHonorsAnimation : AnimatedImage = new AnimatedImage();
	private var starExtraHonorsAnimation : AnimatedImage = new AnimatedImage();
	private var renderLastHonorsStar:boolean = false;
	public var honorsExplanations : List.<String> = new List.<String>();
	private var displayExplanation : boolean = false;
	private var explanationRenderSpace : Rect;
	private var explanationText:String="";
	public var explanationBG:Texture;
	
	
	// Promotion Bar
	private var expWithinRank : float = 0;
	private var expEarned : float = 0;
	private var expBarX : float = 846;
	private var expBarY : float = 728;
	private var expBarRect : Rect;
	
	public var expBarBG : Texture;
	public var expBarExp : Texture;
	private var expFill : float = 0;
	public var expEarnedBar : Texture;
	private var expEarnedFill : float = 0;
	private var currentMinExpGoal : float = 0;
	private var goalWidth : float = 0;
	private var filledUp : boolean = false;
	private var timesFilled : int = 0;
	private var counter : int = 0;
	
	
	private var barDisplay : float = 0;			//Used for when the bar fills
	private var barFillSpeed : float = 0.005;	//Speed at which bar fills
	private var timesRankIncreased : int = -1;
	private var startRank : int = 0;
	
	public var playerDataPref : GameObject;
	
	private var levelSelectRef : LevelSelectMenu;
	
	private var screenRect : Rect;
	private var codexRect:Rect;
	
	private var boldStyle:GUIStyle;
	private var yellowStyle:GUIStyle;
	private var redStyle:GUIStyle;
	private var codexTitleStyle:GUIStyle;
	
	//Additional Text:
	private var agentNameTitleRect:Rect;
	private var agentRankTitleRect:Rect;
	private var missionScoreTitleRect:Rect;
	private var promotionStatusRect:Rect;
	private var titleRect:Rect;
	private var honorTitleRect:Rect;
	public var technologyName:String = "";
	private var technologyNameRect:Rect;
	private var addedToCodexRect:Rect;
	
	private var standardFontSize:int;
	private var largerFontSize:int;
	
	public var waitForNarrativeUI:boolean = false;
	
	public var dashboardButton:Texture;
	private var dashboardButtonRect:Rect;

	public var displayToolTipsOnEntry:boolean = false;
	public var displayToolTipsOnScore:boolean = false;
	private var inspectionDispRef : InspectionDisplay;
	
	public var starFillTexture:Texture;
	public var starUnfilledTexture:Texture;
	private var starRect : List.<Rect> = new List.<Rect>();
	private var numOfStars : int;
	private var numOfStarsCould : int;
	
	private var techAlreadyUnlocked:boolean = false;
	
	private var currentScreen:CurrentScoreScreen = CurrentScoreScreen.CodexScreen;
	
	private var switchScreens : RectAnimations = new RectAnimations();
	private var continueButtonAB : AnimatedButton;
	private var viewEntryButtonAB : AnimatedButton;
	private var retryButtonAB:AnimatedButton;
	private var newCodexUnlockedST : ShadowedText;
	private var codexTextST : ShadowedText;
	private var labTextST : ShadowedText;
	private var techBGRectCodexScreen : Rect;
	private var techImageRectCodexScreen : Rect;
	public var viewEntry:Texture;
	public var codexInfoBox:Texture;
	private var codexInfoBoxRect:Rect;
	
	
	private var titleST : ShadowedText;
	private var agentNameST : ShadowedText;
	private var agentRankST : ShadowedText;
	private var missionScoreST : ShadowedText;
	private var statusST : ShadowedText;
	private var honorST : ShadowedText;
	
	private var inspectionActivated:boolean = false;
	
	// Social media buttons
	private var facebookButtonAB:AnimatedButton;
		public var facebookIconText: Texture;
		private var facebookIconRect: Rect;
		private var facebookX: float=1563;
		private var facebookY: float=10;
		private var facebookPercent:float=0.12;
	private var twitterButtonAB:AnimatedButton;
		public var twitterIconText: Texture;
		private var twitterIconRect: Rect;
		/*private var twitterX: float=1563;
		private var twitterY: float=24;
		private var twitterPercent:float=0.12;*/
	
	public enum CurrentScoreScreen
	{
		Narrative,
		CodexScreen,
		Transitioning,
		MainScreen
	}
	
	public function SwitchFromNarrative()
	{
		currentScreen = CurrentScoreScreen.CodexScreen;
		waitForNarrativeUI = false;
	}

	public function Initialize()
	{
		super.Initialize();
		
		for(var t:int = 0; t < starAnimation.length; t++)
		{
			starAnimation[t] = new AnimatedImage();
			starAnimation[t].AdjustAnimationIncrease(starAnimationSpeed);
		}
		
		for(var q:int = 0; q < honorsAnimation.length; q++)
		{
			honorsAnimation[q] = new AnimatedImage();
			honorsAnimation[q].AdjustAnimationIncrease(starAnimationSpeed);
		}

		var narrUI:NarrativeUI = gameObject.GetComponent(NarrativeUI);
		numOfStars = 0;
		
		if(narrUI != null)
		{
			narrUI.setEndRender(false);
			currentScreen = CurrentScoreScreen.Narrative;
		}
		else
			currentScreen = CurrentScoreScreen.CodexScreen;
		
		
		counter = 0;
		var playerData : GameObject = GameObject.Find("Player Data");		
		saveSystem = playerData.GetComponent("SaveSystem");
		
		
		if(!doTest)
		{
			var database : GameObject = GameObject.Find("Database");
			intelSystem = database.GetComponent(IntelSystem);
			generateText();
		}
		else
		{
			test();
			Debug.Log("Testing...");
		}
		
		// To help maintain a 16:9 ratio for the screen, and for the screen to be in the center
		screenRect = createRect(new Vector2(1920, 1080),0,0, 1, true);
		screenRect.x = (screenWidth / 2) - (screenRect.width / 2);
		screenRect.y = (screenHeight / 2) - (screenRect.height / 2);
		
		//standardFontSize = 0.040 * screenHeight;
		//largerFontSize = 0.054 * screenHeight;
		
		standardFontSize = 0.022 * screenWidth;
		largerFontSize = 0.030 * screenWidth;
		
		scoreScreenSkin.label.fontSize = standardFontSize;
		scoreScreenSkin.customStyles[1].fontSize = standardFontSize;
		scoreScreenSkin.customStyles[2].fontSize = standardFontSize;
		scoreScreenSkin.customStyles[3].fontSize = standardFontSize;
		
		boldStyle = scoreScreenSkin.customStyles[1];
		yellowStyle = scoreScreenSkin.customStyles[2];
		redStyle = scoreScreenSkin.customStyles[3];
		
		codexTitleStyle = scoreScreenSkin.customStyles[4];
		codexTitleStyle.fontSize = 0.045 * screenWidth;
		
		var designWidth : float = 1920;
		var designHeight : float = 1080;
		
		
		//infoBoxRect = createRect(infoBox, 81 / designWidth, 74 / designHeight, infoBox.height / designHeight, false, screenRect);
		//infoBoxRect = createRect(infoBox.topTexture, 81 / designWidth, 74 / designHeight, infoBox.topTexture.height / designHeight, false, screenRect);
		infoBoxRect = createRect(Vector2(1768, 847), 81 / designWidth, 74 / designHeight, 847 / designHeight, false, screenRect);
		
		
		
		//createRect(texture:Texture,xPercent:float,yPercent:float, heightPercentage:float, adjustSizeIfOutsideBoundaries:boolean, compareToRect:Rect);
		
		//shareButtonRect = createRect(shareButton,1340 / designWidth, 27/designHeight, shareButton.height / designHeight, false, screenRect);
		retryButtonRect = createRect(retryButton, 81 / designWidth, 936/designHeight, retryButton.height / designHeight, false, screenRect);
		contButtonRect = createRect(contButton, 1225 / designWidth, 936/designHeight, contButton.height / designHeight, false, screenRect);
		dashboardButtonRect = createRect(dashboardButton,0f,936/designHeight, dashboardButton.height / designHeight, false, screenRect);
		
		dashboardButtonRect.x = ((contButtonRect.x - (retryButtonRect.xMax)) / 2 - dashboardButtonRect.width / 2) + retryButtonRect.xMax;
		
		//dashboardButton
		
		var textBox : Vector2 = new Vector2(boxWidth, boxHeight);
		
		agentNameRect = createRect(textBox, textX / designWidth, textY / designHeight, 0.05, false, screenRect);
		
		agentRankRect = createRect(textBox, textX / designWidth, (textY + boxHeight) / designHeight, 0.05, false, screenRect);
		
		missionScoreRect = createRect(textBox, textX / designWidth, (textY + (boxHeight*2)) / designHeight, 0.05, false, screenRect);
						
		titleRect  = createRect(new Vector2(1066, 96), (textX - 700) / designWidth, 72/designHeight, 96 / designHeight, false, screenRect);
		
		agentNameTitleRect = createRect(textBox, (textX - 700) / designWidth, textY / designHeight, 0.05, false, screenRect);
		agentRankTitleRect = createRect(textBox, (textX - 700) / designWidth, (textY + boxHeight) / designHeight, 0.05, false, screenRect);
		missionScoreTitleRect = createRect(textBox, (textX - 700) / designWidth, (textY + (boxHeight*2)) / designHeight, 0.05, false, screenRect);
		promotionStatusRect = createRect(textBox, (textX - 700) / designWidth, (textY + (boxHeight*3)) / designHeight, 0.05, false, screenRect);
																																										
		honorTitleRect = createRect(textBox, 135 / designWidth, 420 / designHeight, 0.05, false, screenRect);
		
		techBGRect = createRect(techBG, 1354 / designWidth, 419 /designHeight, techBG.height / designHeight, false, screenRect);
		codexIconRect = createRect(codexIcon, 109 / designWidth, 817 /designHeight, codexIcon.height / designHeight, false, screenRect);
		techImageRect = createRect(new Vector2(327, 283), 1387 / designWidth, 465 /designHeight, 0.262, false, screenRect);

		/*

		//Calculating Rect.
			// Share Button
		shareButtonRect = RectFactory.NewRect(shareButtonX / designWidth, 
											  shareButtonY / designHeight,
											  shareButton.width / designWidth,
											  shareButton.height / designHeight);
			// Retry Button
		retryButtonRect = RectFactory.NewRect(retryButtonX / designWidth, 
											  retryButtonY / designHeight,
											  retryButton.width / designWidth,
											  retryButton.height / designHeight);
			// Cont Button
		contButtonRect = RectFactory.NewRect( contButtonX / designWidth, 
											  contButtonY / designHeight,
											  contButton.width / designWidth,
											  contButton.height / designHeight);
											  
			// Text
			
		agentNameRect = RectFactory.NewRect(  textX / designWidth, 
											  textY / designHeight,
											  boxWidth / designWidth,
											  boxHeight / designHeight);
											  
		agentRankRect = RectFactory.NewRect(  textX / designWidth, 
											 (textY + boxHeight) / designHeight,
											  boxWidth / designWidth,
											  boxHeight / designHeight);
											  
		missionScoreRect = RectFactory.NewRect(textX / designWidth, 
											  (textY + (boxHeight*2)) / designHeight,
											   boxWidth / designWidth,
											   boxHeight / designHeight);
	
		totalScoreRect = RectFactory.NewRect(textX / designWidth, 
											  (textY + (boxHeight*3) + honorsBoxGap) / designHeight,
											   boxWidth / designWidth,
											   boxHeight / designHeight);
												   							   
	   */	
	   
			// Honors
	
		for(var i :int = 0; i < honorsTextures.Count; i++)
		{
		
			var width : float = honorsLeftX + ((honorsBoxWidth / 3) * i);
			
			var rect : Rect = new Rect();
			rect = createRect(honorsTextures[i].earned, width / designWidth, honorsLeftY / designHeight, honorsTextures[i].earned.height / designHeight, false, screenRect);

			/*
				 	 	 	 RectFactory.NewRect( width / designWidth, 
											  honorsLeftY / designHeight,
											  honorsTextures[i].earned.width / designWidth,
											  honorsTextures[i].earned.height / designHeight);
			*/
			
			/*
			var rectScore : Rect = new Rect();
			rectScore = createRect(honorsTextures[i].earned, (width + honorScoreOffsetX) / designWidth, (honorsLeftY + honorScoreOffsetY) / designHeight, honorsTextures[i].earned.height / designHeight, false, screenRect);
			*/								  
			var rectScore : Rect = new Rect();								  
			rectScore = createRect(starFillTexture, (width + honorScoreOffsetX) / designWidth,(honorsLeftY + honorScoreOffsetY) / designHeight, starFillTexture.height / designHeight, false, screenRect);
			
			
			if(honorsTextures[i].type == HonorType.Resourceful)
				rectScore.x = (rect.x + (rect.width / 2)) - (rectScore.width);
			else
				rectScore.x = (rect.x + (rect.width / 2)) - (rectScore.width / 2);
			
			
			
			honorsRect.Add(rect);
			honorStarRect.Add(rectScore);
		}
		
		var tempRect : Rect = new Rect();
		tempRect = createRect(starFillTexture, 0,0, starFillTexture.height / designHeight, false, screenRect);
		
		var middleStart:float = (missionScoreRect.width / 2) - (tempRect.width * 5) / 2;
		
		for(var j:int = 0; j < 5; j++)
		{
			tempRect = new Rect();
			tempRect = createRect(starFillTexture, 0,0, starFillTexture.height / designHeight, false, screenRect);
			tempRect.x = middleStart + (j * tempRect.width);
			
			starRect.Add(tempRect);
		}
		
		
			// Exp Bar:
			/*
		expBarRect = RectFactory.NewRect( expBarX / designWidth, 
										  expBarY / designHeight,
										  expBarBG.width / designWidth,
										  expBarBG.height / designHeight);
				*/						  
				
		expBarRect = createRect(expBarBG, 0.457, 0.33, 0.033, false, screenRect);
				
		expFill = expWithinRank / currentMinExpGoal;
		expEarnedFill = (expWithinRank + expEarned) / currentMinExpGoal;
		barDisplay = expFill;	// starts off at exp length
		//Debug.Log("EXP FILL" + expFill);
		//Debug.Log("EXP EARNED FILL" + expEarnedFill);
		goalWidth = expEarnedFill * expBarRect.width;
		
		levelSelectRef = gameObject.GetComponent(LevelSelectMenu);
		backgroundMusic = SoundManager.Instance().backgroundSounds.scoreMenuMusic;
		
		
		var codexBox : Vector2 = new Vector2(1744, 104);
		
		technologyNameRect = createRect(codexBox, 235 / designWidth, 844/designHeight, codexBox.x / designHeight, false, screenRect);
		addedToCodexRect = createRect(codexBox, 0, 844/designHeight, codexBox.x / designHeight, false, screenRect);
		//addedToCodexRect.x = technologyNameRect.x + (technologyName.Length * (scoreScreenSkin.customStyles[3].fontSize/1.6));
		addedToCodexRect.x = technologyNameRect.x + redStyle.CalcSize(GUIContent(technologyName)).x;

		GUI.Label(technologyNameRect, technologyName, redStyle);
		GUI.Label(addedToCodexRect, " added to the Codex", yellowStyle);
		
		inspectionDispRef = gameObject.GetComponent(InspectionDisplay);
		
		var displayTips:boolean = true;
		if(displayToolTipsOnEntry && PlayerPrefs.HasKey("displayToolTipsOnEntry"))
		{
			if(PlayerPrefs.GetInt("displayToolTipsOnEntry") == 0);
				displayTips = false;
		}
		
		if(displayToolTipsOnEntry && displayTips)
		{
			//var inspectionDisplay:InspectionDisplay = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
			inspectionDispRef.FromScoreScreen();
			PlayerPrefs.SetInt("displayToolTipsOnEntry", 0);
			
		}
		
		codexRect = new Rect( screenRect.x, screenRect.y, screenRect.width, screenRect.height);
		
		//mainMenuButtonAB
		
		codexInfoBoxRect = createRect(codexInfoBox, 347f / 1920f, 190f /1080f, 736f / 1080f, false,  codexRect);
		techBGRectCodexScreen = createRect(techBG, 82f / 1920f, 177f /1080f, 748f / 1080f, false,  codexRect);
		techImageRectCodexScreen = createRect(techImage, 147f / 1920f, 269f /1080f, 565f / 1080f, false,  codexRect);
		
		var viewEntryRect:Rect  = createRect(viewEntry, 333f / 1290f, 421f /618f, 122f / 618f, false,  codexInfoBoxRect);	
		
		continueButtonAB = new AnimatedButton(Color.blue, contButton, contButtonRect, Vector2(codexRect.x, codexRect.y));
		viewEntryButtonAB = new AnimatedButton(Color.green, viewEntry, viewEntryRect, Vector2(codexRect.x + codexInfoBoxRect.x, codexRect.y + codexInfoBoxRect.y));
		
		var codexTextRect : Rect = createRect(Vector2(930, 78), 495f / 1920f, 63f /1080f, 78f / 1080f, false,  codexRect);
		codexTextRect.x = Screen.width / 2 - codexTextRect.width / 2;
	
		newCodexUnlockedST = new ShadowedText("New Entry Unlocked!", new Color(190f / 255f, 41f / 255f, 8f / 255f, 1f), Color.black, 0.5f, codexTextRect, codexTitleStyle);
		
		codexTextRect = createRect(Vector2(950, 524), 526f / 1533f, 18f / 736f, 524f / 736f, false,  codexInfoBoxRect);	
		
		var codexText:String;
		var lab:String = "";
		if(technologyName != "" || techAlreadyUnlocked)
		{
			codexText = saveSystem.codexData.GetCodexEntry(technologyName).name + "\n\n" + saveSystem.codexData.GetCodexEntry(technologyName).description;
			screenRect = new Rect( screenRect.width, screenRect.y, screenRect.width, screenRect.height);
			
			if(saveSystem.codexData.GetCodexEntry(technologyName).lab != "")
				lab = saveSystem.codexData.GetCodexEntry(technologyName).lab;
		}
		else
		{
			currentScreen = CurrentScoreScreen.MainScreen;
		}
		
		codexTextST = new ShadowedText(codexText, codexTextRect, boldStyle, true);
		var labStyle:GUIStyle = new GUIStyle(boldStyle);
		labStyle.fontSize *= 1.5f; // DERRICK LOOK HERE FOR SCALE
		if(lab != "")
		{
			var labRect:Rect = Rect(codexTextRect.x, codexInfoBoxRect.y + codexTextRect.y + padding + boldStyle.CalcHeight(GUIContent(codexText), codexTextRect.width),codexTextRect.width,boldStyle.CalcHeight(GUIContent(lab), codexTextRect.width));
			
			labTextST = new ShadowedText(lab, new Color(247f/255f, 216f/255f, 39f/255f, 1f), Color.black, 0.5f, labRect, boldStyle);
		}
		else
			labTextST = new ShadowedText("", Rect(0,0,0,0), false);
		
		retryButtonAB = new AnimatedButton(Color.blue, retryButton, retryButtonRect, Vector2(codexRect.x, codexRect.y));
		
		
		titleST  = new ShadowedText("Agent Performance Evaluation", titleRect, boldStyle, true);
		agentNameST   = new ShadowedText("Agent Name", agentNameTitleRect  , boldStyle, true);
		agentRankST   = new ShadowedText("Agent Rank", agentRankTitleRect  , boldStyle, true);
		missionScoreST   = new ShadowedText("Mission Score", missionScoreTitleRect  , boldStyle, true);
		statusST   = new ShadowedText("Promotion Status", promotionStatusRect  , boldStyle, true);
		honorST   = new ShadowedText("Honors", honorTitleRect  , boldStyle, true);
		
		facebookIconRect = createRect(facebookIconText, facebookX / designWidth, facebookY / designHeight, facebookPercent, false, screenRect);
		facebookButtonAB =  new AnimatedButton(Color.blue, facebookIconText, facebookIconRect, Vector2(screenRect.x, screenRect.y));
		twitterIconRect = Rect(facebookIconRect.x - (1.25 * facebookIconRect.width), facebookIconRect.y, facebookIconRect.width, facebookIconRect.height);
		twitterButtonAB = new AnimatedButton(Color.blue, twitterIconText, twitterIconRect, Vector2(screenRect.x, screenRect.y));
				
		#if UNITY_ANDROID
		FacebookAndroid.init(false);
		TwitterAndroid.init( "atsVn98cE4BN2Od6Dqr8SaIGF", "HBXXCCOtXHUf0YPDZACy15X0jUERtgUAZBPr7edhKtoQTi3zmk" );
		#endif
		#if UNITY_IPHONE
		FacebookBinding.init();
		TwitterBinding.init( "atsVn98cE4BN2Od6Dqr8SaIGF", "HBXXCCOtXHUf0YPDZACy15X0jUERtgUAZBPr7edhKtoQTi3zmk" );
		#endif
	}
	
	private var waitingOnHonor:boolean = false;
	
	public function Render()
	{   
		GUI.enabled = !inspectionDispRef.IsActive();
		if(!waitForNarrativeUI)
		{
			GUI.depth = 0;
			// Drawing background textures:
			GUI.skin = scoreScreenSkin;
			//GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
			AnimatedBackground(background);
		
			
			if(currentScreen == CurrentScoreScreen.Transitioning)
			{
				if(!switchScreens.Render(codexRect, screenRect))
					currentScreen = CurrentScoreScreen.MainScreen;
				else
				{
					codexRect = switchScreens.currentRect;
					screenRect = switchScreens.nextRect;
				}
			}
				
		
			//CODEX PART:
			
			if(currentScreen == CurrentScoreScreen.CodexScreen || currentScreen == CurrentScoreScreen.Transitioning)
			{
				GUI.BeginGroup(codexRect);
				
					GUI.DrawTexture(codexInfoBoxRect, codexInfoBox, ScaleMode.StretchToFill);
					
					GUI.DrawTexture(techBGRectCodexScreen, techBG, ScaleMode.StretchToFill);
					GUI.DrawTexture(techImageRectCodexScreen, techImage, ScaleMode.StretchToFill);
					
					GUI.BeginGroup(codexInfoBoxRect);
						boldStyle.wordWrap = true;
						boldStyle.alignment = TextAnchor.UpperLeft;
						codexTextST.Display();
						labTextST.Display();
						boldStyle.wordWrap = false;
						boldStyle.alignment = TextAnchor.MiddleLeft;
						if(viewEntryButtonAB.Render())
						{
							currentResponse.type = EventTypes.CODEXMENU;
							var codexMenu:CodexMenu = GameObject.Find("GUI System").GetComponent(CodexMenu);
							codexMenu.takeToCodexEntry(techEntry);
						}
					GUI.EndGroup();
					
					if(continueButtonAB.Render())
					{
						currentScreen = CurrentScoreScreen.Transitioning;
					}
					
					newCodexUnlockedST.Display();
				
				GUI.EndGroup();
			}
			
			//MAIN PART:
			
			if(!inspectionActivated && currentScreen == CurrentScoreScreen.MainScreen)
			{
				var displayTips:boolean = true;
				if(displayToolTipsOnScore && PlayerPrefs.HasKey("displayToolTipsOnScore"))
				{
					if(PlayerPrefs.GetInt("displayToolTipsOnScore") == 0);
						//displayTips = false;
				}
				
				if(displayToolTipsOnScore && displayTips)
				{
					//var inspectionDisplay:InspectionDisplay = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
					inspectionDispRef.FromScoreScreen();
					PlayerPrefs.SetInt("displayToolTipsOnScore", 1);
					
				
				}
				
				inspectionActivated = true;
				
			}
			
			if(currentScreen == CurrentScoreScreen.MainScreen || currentScreen == CurrentScoreScreen.Transitioning)
			{
				GUI.BeginGroup(screenRect);
				//GUI.DrawTexture(new Rect(0,0,lineOverlay.width, lineOverlay.height), lineOverlay);
				GUI.DrawTexture(infoBoxRect, infoBox);
				//infoBox.Display(infoBoxRect);
				
				
				boldStyle.fontSize = largerFontSize;
				//GUI.Label(titleRect, "Agent Performance Evaluation", boldStyle);
				titleST.Display();
				boldStyle.fontSize = standardFontSize;
				
				
				// Buttons are rendered:
				
				/*
				setButtonTexture(shareButton, shareButtonPressed);
				if(GUI.Button(shareButtonRect, ""))
				{
					currentResponse.type = EventTypes.FACEBOOK;
					PlayButtonPress();
				}
				*/
				//setButtonTexture(retryButtonRect, retryButton, retryButtonPressed);
				if(retryButtonAB.Render())
				{
					currentResponse.type = EventTypes.RESTART;
					PlayButtonPress();
				}
				//setButtonTexture(contButton, contButtonPressed);
				if(continueButtonAB.Render())
				{
					levelSelectRef.SetFromScoreScreen(false);
					currentResponse.type = EventTypes.LEVELSELECT;
					PlayButtonPress();
				}
				//resetButtonTexture();

				if (facebookButtonAB.Render())
				{
					#if UNITY_ANDROID
					if (!FacebookAndroid.isSessionValid())
					FacebookAndroid.loginWithPublishPermissions( ["publish_actions", "manage_friendlists"] );
					//FacebookAndroid.reauthorizeWithPublishPermissions(  ["publish_actions", "manage_friendlists"], FacebookSessionDefaultAudience.Everyone );
					else
					Facebook.instance.postMessage( "im posting this from Unity: " + Time.deltaTime, completionHandler );
					#endif
					#if UNITY_IPHONE
					
					#endif
					PlayButtonPress();
				}
				
				if (twitterButtonAB.Render())
				{
					#if UNITY_ANDROID
					if (!TwitterAndroid.isLoggedIn())
					{
						TwitterAndroid.showLoginDialog();
						PlayButtonPress();
					}
					else
					{
						Application.CaptureScreenshot( FacebookUIManager.screenshotFilename );
						var pathToImage = Application.persistentDataPath + "/" + FacebookUIManager.screenshotFilename;
						var bytes = System.IO.File.ReadAllBytes( pathToImage );
						TwitterAndroid.postStatusUpdate( "I scored in #Terrachanics!", bytes );
					}
					#endif
					#if UNITY_IPHONE
					if (!TwitterBinding.isLoggedIn())
						TwitterBinding.showLoginDialog();
					else
					{
						Application.CaptureScreenshot( FacebookUIManager.screenshotFilename );
						var pathToImage = Application.persistentDataPath + "/" + FacebookUIManager.screenshotFilename;
						TwitterBinding.postStatusUpdate( "I score in #Terrachanics!", pathToImage );
					}
					#endif
					//PlayButtonPress();
				}
				
				// Text is rendered:
				//GUI.Label(agentNameTitleRect, "Agent Name", boldStyle);
				agentNameST.Display();
				//GUI.Label(agentRankTitleRect, "Agent Rank", boldStyle);
				agentRankST.Display();
				//GUI.Label(missionScoreTitleRect, "Mission Score", boldStyle);
				missionScoreST.Display();
				//GUI.Label(promotionStatusRect, "Promotion Status", boldStyle);
				statusST.Display();
				//GUI.Label(honorTitleRect, "Honors", boldStyle);
				honorST.Display();
				
				
				
				GUI.Label(agentNameRect, agentName);
				if(!animateRankUp)
					GUI.Label(agentRankRect, agentRank);
				else
				{
					if(!rankChangeAnimation.Render(agentRankRect, agentRank, saveSystem.rankSystem.getRankName(startRank), true))
					{
						agentRank = saveSystem.rankSystem.getRankName(startRank);
						animateRankUp = false;
						rankChangeAnimation = new AnimatedText();
					}
					
				}

				//GUI.Label(missionScoreRect, missionScore + " XP");
				GUI.BeginGroup(missionScoreRect);
					for(var j:int = 0; j < numOfStarsCould; j++)
					{
						if(numOfStarsAnimated > j && numOfStars >= (j+1))
							GUI.DrawTexture(starRect[j], starFillTexture, ScaleMode.StretchToFill);
						else
							GUI.DrawTexture(starRect[j], starUnfilledTexture, ScaleMode.StretchToFill);
							
						if((currentScreen != CurrentScoreScreen.Transitioning) && j == numOfStarsAnimated && numOfStarsAnimated < numOfStars)
						{
							if(!isDelaying && !starAnimation[0].Render(starRect[j], starUnfilledTexture, starFillTexture, true, starAnimationSpeed))
							{
								numOfStarsAnimated++;
								//if(numOfStarsAnimated < 1)
									//numOfStarsAnimated++;
							}
							else if(isDelaying)
							{	
								GUI.DrawTexture(starRect[j], starFillTexture, ScaleMode.StretchToFill);
							}
						}
						
						/*
						if(numOfStarsAnimated == 5)
						{
							starAnimation = new AnimatedImage();
						}
						*/
					}
					
					if(numOfStarsAnimated == 5)
					{
						for(var m:int = 0; m < numOfStarsCould; m++)
						{
							if(!starAnimation[m].Render(starRect[m], starFillTexture, starFillTexture, true, starAnimationSpeed))
									numOfStarsAnimated++;
						}
					}
				
				GUI.EndGroup();
				
				//GUI.Label(totalScoreRect, totalScore);
				
				// Honors/bonus icons and scores are rendered:
				GUI.skin.label.alignment = TextAnchor.UpperLeft;
				for(var i: int = 0; i < honorsTextures.Count; i++)
				{
					// honors icons
					if(honorsTextures[i].couldBeEarned)
					{
						if(honorsTextures[i].hasEarned && honorsTextures[i].hasAnimated)
							GUI.DrawTexture(honorsRect[i], honorsTextures[i].earned);
						//else if((currentScreen != CurrentScoreScreen.Transitioning) && numOfStarsAnimated >= 1 && (honorsTextures[i].animationOrder == numOfStarsAnimatedHonors) && i == currentHonorToAnimate && honorsTextures[i].hasEarned && !honorsTextures[i].hasAnimated)
						else if((currentScreen != CurrentScoreScreen.Transitioning) && numOfStarsAnimated >= 1 && (honorsTextures[i].animationOrder == numOfStarsAnimatedHonors) && honorsTextures[i].hasEarned && !honorsTextures[i].hasAnimated)
						{
							if(!honorsAnimation[i].Render(honorsRect[i], honorsTextures[i].notEarned, honorsTextures[i].earned, true, starAnimationSpeed))
							{
								honorsTextures[i].hasAnimated = true;
								//currentHonorToAnimate++;
							}
						}
						else
						{
							GUI.DrawTexture(honorsRect[i], honorsTextures[i].notEarned);
							/*
							if(!honorsTextures[i].hasEarned && !honorsTextures[i].hasAnimated)
							{
								honorsTextures[i].hasAnimated = true;
								currentHonorToAnimate++;
							}*/
						}
					}
					else
					{
						GUI.DrawTexture(honorsRect[i], noHonorTexture);	
						/*if(!honorsTextures[i].hasAnimated)
						{
							honorsTextures[i].hasAnimated = true;
							currentHonorToAnimate++;
						}*/
					}
					
					
					// honors stars
					if(honorsTextures[i].couldBeEarned)
					{
						if((numOfStarsAnimatedHonors > honorsTextures[i].animationOrder) && honorsTextures[i].hasEarned)
							GUI.DrawTexture(honorStarRect[i], starFillTexture);
						else
						{
							GUI.DrawTexture(honorStarRect[i], starUnfilledTexture);
							
							if((numOfStarsAnimated >= 1) && (currentScreen != CurrentScoreScreen.Transitioning) && (honorsTextures[i].hasEarned) && (honorsTextures[i].animationOrder == numOfStarsAnimatedHonors) && (numOfStarsAnimatedHonors < (numOfStars - 1)))
							{
								//if(!isDelaying && !starHonorsAnimation.Render(honorStarRect[i], starUnfilledTexture, starFillTexture, true, starAnimationSpeed))
								if(!starHonorsAnimation.Render(honorStarRect[i], starUnfilledTexture, starFillTexture, true, starAnimationSpeed))
								{
									//Delay(i);
									numOfStarsAnimatedHonors++;
									
									if(honorsTextures[i].type == HonorType.Resourceful)
										renderLastHonorsStar = true;
								}
								/*
								else if(isDelaying)
								{
									GUI.DrawTexture(honorStarRect[i], starFillTexture);
								}*/
							}
						}
							
						if(honorsTextures[i].type == HonorType.Resourceful)
						{
							var tempRect = honorStarRect[i];
							
							tempRect.x += honorStarRect[i].width;
						
							if((numOfStarsAnimatedHonors >= (numOfStars - 1)) && renderLastHonorsStar && honorsTextures[i].hasEarned)
								GUI.DrawTexture(tempRect, starFillTexture);
							else
							{
								GUI.DrawTexture(tempRect, starUnfilledTexture);
								
								if((currentScreen != CurrentScoreScreen.Transitioning) && honorsTextures[i].hasEarned && renderLastHonorsStar)
								{
									if(renderLastHonorsStar && !starExtraHonorsAnimation.Render(tempRect, starUnfilledTexture, starFillTexture, true, starAnimationSpeed))
									{
										numOfStarsAnimatedHonors++;
										//numOfStarsAnimated++;
									}
									
								}
							}
								
							//honorStarRect[i].x -= honorStarRect[i].width;
							
						}//endofresourceful
						
					}	
					
					
					
					
					if(GUI.Button(honorsRect[i],""))
					{
						displayExp(honorsRect[i], honorsExplanations[i]);
					}
				}
				GUI.skin.label.alignment = TextAnchor.MiddleCenter;
				
				// Exp Bar:
				
				GUI.BeginGroup (expBarRect);
					GUI.Box (Rect (0,0, expBarRect.width, expBarRect.height), expBarBG);
					
					// SCORE FILL:
					GUI.BeginGroup (new Rect (0, 0, expBarRect.width * barDisplay, expBarRect.height));
						GUI.Box (Rect (0,0, expBarRect.width, expBarRect.height), expEarnedBar);
					GUI.EndGroup ();
					 
					// EXP FILL:
					if(!filledUp)
					{
						GUI.BeginGroup (new Rect (0, 0, expBarRect.width * expFill, expBarRect.height));
							GUI.Box (Rect (0,0, expBarRect.width, expBarRect.height), expBarExp);
						GUI.EndGroup ();
					}
					 
				GUI.EndGroup ();
				
				GUI.DrawTexture(techBGRect, techBG, ScaleMode.StretchToFill);
				GUI.DrawTexture(techImageRect, techImage, ScaleMode.StretchToFill);
				
				if(techEntry != null)
				{
					if(GUI.Button(techImageRect, ""))
					{
						currentResponse.type = EventTypes.CODEXMENU;
						var codexMenu2:CodexMenu = GameObject.Find("GUI System").GetComponent(CodexMenu);
						codexMenu2.takeToCodexEntry(techEntry);
					}
				}
			
			
				GUI.DrawTexture(codexIconRect, codexIcon, ScaleMode.StretchToFill);
				if(technologyName != null && technologyName != "")
				{
					var dispText : String = " added to the Codex";
					if (techAlreadyUnlocked)
						dispText = " is already in the Codex";
					GUI.Label(technologyNameRect, technologyName, redStyle);
					GUI.Label(addedToCodexRect, dispText, yellowStyle);
				}
				else	
					GUI.Label(technologyNameRect, "No new technology added.", redStyle);
				
				GUI.EndGroup();
				
				if(displayExplanation)
				{
					scoreScreenSkin.label.wordWrap = true;
					GUI.DrawTexture(explanationRenderSpace, explanationBG);
					GUI.Label(explanationRenderSpace, explanationText);
					scoreScreenSkin.label.wordWrap = false;
				}
			}//endofmainscreen
			
		}//endofwaitfornarrativeUI
		
		//Debug.Log("Animated: " + numOfStarsAnimated + " Honors: " + numOfStarsAnimatedHonors + " Delay?? " + isDelaying);
	}//endofrender
	
	// common event handler used for all Facebook graph requests that logs the data to the console
	private function completionHandler( error : String,  result : Object )
	{
		if( error != null )
			Debug.LogError( error );
		else
			Prime31.Utils.logObject( result );
	}
	
	
	// Used to find out the actual values for all the text that will be displayed,
	// and also to do the saving and calculations of rank, etc.
	function generateText()
	{
		numOfStars = 1;
		numOfStarsCould = 1;
		
		var animationOrder = 0;
		
		// Honors Icons
		for(var i:int = 0; i < honorsTextures.Count; i++)
		{
			//honorsTextures[i].earned
			if(honorsTextures[i].type == HonorType.Agile)
			{
				//Debug.Log(intelSystem.GetTimeLeft() + " ... time");
				
				honorsTextures[i].couldBeEarned = intelSystem.useTimer;
				
				if(honorsTextures[i].couldBeEarned)
					numOfStarsCould++;
				
				if(honorsTextures[i].couldBeEarned && intelSystem.GetTimeLeft() >= 30)
				{
					honorsTextures[i].score = 10;
					honorsTextures[i].hasEarned = true;
					honorsTextures[i].animationOrder = animationOrder;
					animationOrder++;
					//Debug.Log(honorsTextures[i].animationOrder + "...agile");
					numOfStars++;
				}
				
				if(!honorsTextures[i].couldBeEarned)
				{
					honorsTextures[i].score = 10;
					numOfStars++;
				}
			}
			else if(honorsTextures[i].type == HonorType.Efficient)
			{
				var mainMenu:MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
			
				honorsTextures[i].couldBeEarned = (!mainMenu.disableUndoButton || !mainMenu.disableSkipButton);
				
				if(honorsTextures[i].couldBeEarned)
					numOfStarsCould++;
			
				if(honorsTextures[i].couldBeEarned && !intelSystem.getUsedUndoOrWait())
				{
					honorsTextures[i].score = 10;
					honorsTextures[i].hasEarned = true;
					honorsTextures[i].animationOrder = animationOrder;
					animationOrder++;
					//Debug.Log(honorsTextures[i].animationOrder + "...efficient");
					numOfStars++;
				}
				
				if(!honorsTextures[i].couldBeEarned)
				{
					honorsTextures[i].score = 10;
					numOfStars++;
				}
				
			}
			else if(honorsTextures[i].type == HonorType.Resourceful)
			{
				honorsTextures[i].couldBeEarned = intelSystem.hasSecondaryEvent();
				
				if(honorsTextures[i].couldBeEarned)
					numOfStarsCould+=2;
				
				if(honorsTextures[i].couldBeEarned && intelSystem.getOptionalScore() > 0)
				{
					//honorsTextures[i].score = 1000;
					honorsTextures[i].score = 20; // +2 stars for optional objective; 25 points each
					honorsTextures[i].hasEarned = true;
					honorsTextures[i].animationOrder = animationOrder;
					animationOrder++;
					numOfStars += 2;
					//Debug.Log(honorsTextures[i].animationOrder + "...resourceful");
				}
				if(!honorsTextures[i].couldBeEarned)
				{
					honorsTextures[i].score = 20;
					numOfStars+=2;
				}
			}
		}
		numOfStarsCould = 5;
		
		/*
		var tempRect : Rect = new Rect();
		tempRect = createRect(starFillTexture, 0,0, starFillTexture.height / 1080, false, screenRect);
		
		var middleStart:float = (missionScoreRect.width / 2) - (tempRect.width * numOfStarsCould) / 2;
		
		for(var n:int = 0; n < numOfStarsCould; n++)
		{
			tempRect = new Rect();
			tempRect = createRect(starFillTexture, 0,0, starFillTexture.height / 1080, false, screenRect);
			tempRect.x = middleStart + (n * tempRect.width);
			
			starRect.Add(tempRect);
		}
		*/
	
		agentName = saveSystem.currentPlayer.name;
		agentRank = saveSystem.currentPlayer.rankName;
		startRank = saveSystem.currentPlayer.rank;
		if(saveSystem.currentPlayer.rank > 0)
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank) -
			saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank - 1);
		else
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank);
		
		//var tempScore : int = intelSystem.getOptionalScore() + intelSystem.getPrimaryScore() + (50 * intelSystem.GetTimeLeft());
		
		var tempScore : int = 100;
		
		// Adding in honors scores
		for(var j:int = 0; j < honorsTextures.Count; j++)
		{
			tempScore += honorsTextures[j].score;
		}
		
		missionScore = tempScore.ToString();
		expWithinRank = saveSystem.rankSystem.expForThisRank(saveSystem.currentPlayer.rank, saveSystem.currentPlayer.exp);	
		
		//Debug.Log("Total Score: " + tempScore);
		//var totScore : int = tempScore + AddComboPoints();
		//Debug.Log("Total Score with Combo: " + totScore);
		
		//totalScore = totScore.ToString() + ConvertComboToString();
	
		
		
		expEarned = saveSystem.currentPlayer.updateScore(intelSystem.levelName, tempScore);
		saveSystem.currentPlayer.exp += expEarned;
		//Debug.Log("EXP EARNED: " + expEarned);
		
		var previousRank : int = -1;
		var timesRankIncreased : int = -1;
		while(saveSystem.currentPlayer.rank != previousRank)
		{
			previousRank = saveSystem.currentPlayer.rank;
			saveSystem.currentPlayer = saveSystem.rankSystem.updateRank(saveSystem.currentPlayer);
			timesRankIncreased++;
		}
		//Debug.Log("Rank increased " + timesRankIncreased + " times.");
		
		//Debug.Log("Tech Name: " + technologyName);
		
		if(technologyName != "")
		{
			// if the function doesn't return true, sets technology name because either the codex did not contain the 
			// the tech, or the technology has already been unlocked.
			if(!saveSystem.UnlockCodex(saveSystem.currentPlayer, technologyName))
				technologyName = "";
		}
		
		if(technologyName != "")
		{
			techImage = saveSystem.codexData.GetCodexEntry(technologyName).icon;
			techEntry = saveSystem.codexData.GetCodexEntry(technologyName);
		}
		else
		{
			techImage = ecrbPlaceholder;
			techEntry = null;
		}
		
		//Debug.Log("Tech Name: " + technologyName);		
		saveSystem.SavePlayer(saveSystem.currentPlayer.name);
	}
	
	function SetTechAlreadyUnlocked(already : boolean)
	{
		techAlreadyUnlocked = already;
	}
	
	function AddComboPoints(): int
	{
		return (intelSystem.comboSystem.getComboCount() * 100);
	}
	
	function ConvertComboToString() : String
	{
		//return " (Combo: " + AddComboPoints() + ")";
	}
	
	// class for the honors/bonus icons
	// each has an HonorType (an enum),
	// a texture for whether or not it was
	// earned, and a score
	public class HonorIcon
	{
		var type : HonorType;
		var earned : Texture;
		var notEarned : Texture;
		var hasEarned : boolean;
		var score : int = 0;
		var couldBeEarned:boolean;
		var animationOrder:int;
		var hasAnimated:boolean = false;
	}
	
	enum HonorType
	{
		Agile,
		Efficient,
		Resourceful
	}
	
	private var isDelaying:boolean = false;
	private function Delay(i :int)
	{
	/*
		if(!isDelaying)
		{
			isDelaying = true;
			yield WaitForSeconds(0.1);
			numOfStarsAnimatedHonors++;
			numOfStarsAnimated++;
			
			if(honorsTextures[i].type == HonorType.Resourceful)
				renderLastHonorsStar = true;
				
			isDelaying = false;
		}
		*/
	}
	
	private var animateRankUp: boolean = false;
	function Update()
	{
		if(!waitForNarrativeUI && currentScreen == CurrentScoreScreen.MainScreen)
		{
			var currentWidth : float = expBarRect.width * barDisplay;
			
			if(currentWidth < goalWidth)
			{
				barDisplay = (counter * barFillSpeed) + expFill;
				counter++;
			}
		
			// Resets the bar for the next fill:
			if(currentWidth > expBarRect.width)
			{
				filledUp = true;
				timesFilled++;
				startRank++;
				
				animateRankUp =  true;
				
				expEarned = (expEarned + expWithinRank) - currentMinExpGoal;		
				currentMinExpGoal = saveSystem.rankSystem.expGoal(startRank) -
									saveSystem.rankSystem.expGoal(startRank - 1);
									
				expEarnedFill = expEarned / currentMinExpGoal;
				barDisplay = 0;
				goalWidth = expEarnedFill * expBarRect.width;
		
				goalWidth = expEarnedFill * expBarRect.width;
				expFill = 0;
				counter = 0;
				barDisplay = 0;
				expWithinRank = 0;
				//Debug.Log("******earned exp bar" + expEarned);
				//Debug.Log("******current min exp goal" + currentMinExpGoal);
				//Debug.Log("******exp earn fill" + expEarnedFill);
			}		
		}
	}
	
	//*******************************************************For Testing Purposes:
	/*
	The purpose of the below is to make up level data for
	testing the score screen:
	*/
	function test()
	{
		saveSystem.LoadPlayer(USER);
		agentName = saveSystem.currentPlayer.name;
		agentRank = saveSystem.currentPlayer.rankName;
		startRank = saveSystem.currentPlayer.rank;
		
		if(saveSystem.currentPlayer.rank > 0)
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank) -
			saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank - 1);
		else
			currentMinExpGoal = saveSystem.rankSystem.expGoal(saveSystem.currentPlayer.rank);
		
		Debug.Log("CurrentGoal" + currentMinExpGoal);
		var bonusScore : int = 0;
		for(var i: int = 0; i < honorsTextures.Count; i++)
		{
			//honorsTextures[i].score = ((i + 1) * 15) + 99;
			honorsTextures[i].score = 0;
			bonusScore = bonusScore + honorsTextures[i].score;
		}
		
		missionScore = GOTSCORE.ToString();
	
		expWithinRank = saveSystem.rankSystem.expForThisRank(saveSystem.currentPlayer.rank, saveSystem.currentPlayer.exp);	
		Debug.Log("Current bar exp: " + expWithinRank);
		var totScore : int = bonusScore + GOTSCORE;
		totalScore = totScore.ToString();
		
		expEarned = saveSystem.currentPlayer.updateScore(LEVELNAME, totScore);
		saveSystem.currentPlayer.exp += expEarned;
		
		Debug.Log("EXP EARNED: " + expEarned);
		
		var previousRank : int = -1;
		timesRankIncreased = -1;
		while(saveSystem.currentPlayer.rank != previousRank)
		{
			previousRank = saveSystem.currentPlayer.rank;
			saveSystem.currentPlayer = saveSystem.rankSystem.updateRank(saveSystem.currentPlayer);
			timesRankIncreased++;
		}
		Debug.Log("Rank increased " + timesRankIncreased + " times.");
		
		saveSystem.SavePlayer(saveSystem.currentPlayer.name);
	
	}
	
	private function displayExp(location:Rect, text:String)
	{
		explanationText = text;
		explanationRenderSpace = createRect(new Vector2(500, 200),0,0,0.3, false);
		explanationRenderSpace.x = location.x;
		explanationRenderSpace.y = location.y - explanationRenderSpace.height / 2;
		if(!displayExplanation)
		{
			displayExplanation = true;
			yield WaitForSeconds(5.0);
			displayExplanation = false;
		}
	}
	
}// End of ScoreMenuClass