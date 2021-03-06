/********************************************************** 
StartMenu.js

Description: 

Author: Katharine Uvick, Francis Yuan
**********************************************************/

#pragma strict

public class StartMenuScaling
{

}

public class StartMenu extends GUIControl
{
	// Textures
		//Start Menu:
		
	private static var playStartScreen = true;	
	public var splashRedAxonBG:Texture; //Legacy name
	//public var splashRedAxonIcon:Texture;
	public var presentsText:Texture;
	
	public var splashDOEBG:Texture;
	public var splashDOEIcon:Texture;
	public var backgroundText:Texture;
	//public var lineOverlayText:Texture;
	//public var facebookButton:Texture;
	//public var facebookButtonPressed:Texture;
		//private var facebookButtonRect:Rect;
	public var loginButton:Texture;
	//public var loginButtonPressed:Texture;
		private var loginButtonRect:Rect;
	public var logo:Texture;
		private var logoRect:Rect;
	public var optionsButton:Texture;
	//public var optionsButtonPressed:Texture;
		private var optionsButtonRect:Rect;
	public var exitButton:Texture;
	//public var exitButtonPressed:Texture;
	public var creditsButton:Texture;
	//public var creditsButtonPressed:Texture;
		private var creditsButtonRect:Rect;
	
	// Options Screen:
	private var optionsTitleST:ShadowedText;
	public var optionsIcon:Texture;
	public var optionsBannerTexture:Texture;
		private var optionsBannerRect:Rect;
		private var sfxSliderVal:float;
		private var lastSFXVal:float;
		private var musicSliderVal:float;
		private var lastMusicVal:float;
		private var sfxRect:Rect;
		private var sfxLabelRect:Rect;
		private var musicRect:Rect;
		private var musicLabelRect:Rect;
		
		//Profile Select:
	public var agentLoginText:Texture;
		private var titleTextRect:Rect;
	public var titleBGText:Texture;
		private var titleBGRect:Rect;
	public var deleteButtonText:Texture;
	public var profileOptText:Texture;
	public var mainMenuButtonText:Texture;
	//public var mainMenuButtonTextPressed:Texture;
		private var upperRightButtonRect:Rect;
	public var profileBGText:Texture;
	
	public var transparentBlackTexture:Texture;
		
		
		//New Profile:
	public var nameBannerText:Texture;
		private var agentNameRect:Rect;
	public var approveButtonText:Texture;
	//public var approveButtonTextPressed:Texture;
	public var keys : List.<Texture> = new List.<Texture>();
		private var keysRect : List.<Rect> = new List.<Rect>();

	private var percentage: float;
	private var buttonSideBuffer: float = 0.05;


	// Set the first level the game is to load when the player
	// clicks "new game"
	public var firstLevel:String = "CE9Narr";

	// Skins for Start Screen
	public var startMenuSkin:GUISkin;
	public var optionsSkin:GUISkin;
	
	// Start Screen rectangles
	private var background:Rect;
	private var title:Rect;
	private var quitButton:Rect;
	private var resumeGameButton:Rect;
	private var newGameButton:Rect;
	private var levelSelectButton:Rect;
	private var linkFacebookButton:Rect;
	private var splashRect : Rect;

	private var fontHeightPercent:float = 0.04;				// Height of the font of the buttons as a percentage of screen height	
	private var fontHeight:float;

	// Screen flow control variables
	private static var showSplash:boolean = true;
	private var currentTexture:Texture = splashDOEBG;
	private var currentIcon:Texture = splashDOEIcon;
	
	private var levelToResume:String;
	
	// Variables for Profile Selection
	private var profileSelectButton : Rect;
	private var profileSelectWidth : float;
	private var profileSelectHeight : float;
	private var showProfiles : boolean;
	private var saveSystem : SaveSystem;
	private var players : List.<String>;
	private var newUsername : String = "";
	
	// Profile Select Scroll:
	private var levelSelectScrollPos:Vector2;
	private var scrollContent : Rect;
	private var profileScrollArea: Rect;
	private var scrollThumbWidth:float=0.03;
	public var profileSelectSkin:GUISkin;
	private var profileFontSizePercent:float = 0.1;
	
	private var currentScreen : CurrentStartScreen;
	
	private var firstTime:boolean;
	public var firstTimeLevelToLoad:String = "";
	
	public var deleteProfileButton:Texture;
	//public var deleteProfileButtonPressed:Texture;
	private var deleteProfileButtonRect:Rect;
	
	private var showConfirmation : boolean = false;
	private var style : GUIStyle = GUIStyle();
	public var regularFont : Font;
	public var infoBox:Texture;
	public var infoButton:Texture;
	//public var infoButtonPressed:Texture;
	private var confirmationRect : Rect;
	private var confirmCancelRect : Rect;
	private var confirmContinueRect : Rect;
	
	
	
	private var startButtonAB:AnimatedButton;
	private var optionsButtonAB:AnimatedButton;
	private var creditsButtonAB:AnimatedButton;
	private var quitButtonAB:AnimatedButton;
	private var mainMenuButtonAB:AnimatedButton;
	private var deleteProfileButtonAB:AnimatedButton;
	
	private var welcomeText:ShadowedText;
	
	//New Profile
	
	private var enterNameST: ShadowedText;
	private var acceptST: ShadowedText;
	private var cancelST: ShadowedText;
	
	public var acceptText:Texture;
	private var acceptAB: AnimatedButton;
	private var acceptRect:Rect;
	public var cancelText:Texture;
	private var cancelAB: AnimatedButton;
	private var cancelRect:Rect;
	
	// adjust size of splash screen images
	public var splashScale : float;
	
	public enum CurrentStartScreen
	{
		FirstScreen,
		ProfileSelect,
		NewProfile,
		Options, 
		WelcomePlayer
	}
		
	
	public function Start ()
	{
		super.Start();
		if (!PlayerPrefs.HasKey(Strings.RESUME)){
			Debug.LogError("There was no level to resume.");
		} else {
			levelToResume = PlayerPrefs.GetString(Strings.RESUME);
		}
		
		currentScreen = CurrentStartScreen.FirstScreen;
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		style.normal.textColor = Color.white;
		style.active.textColor = Color.white;
		style.hover.textColor = Color.white;
		style.wordWrap = true;
		style.stretchWidth = true;
		style.stretchHeight = true;
		style.margin = RectOffset (0, 0, 0, 0);
		style.padding = RectOffset (0, 0, 0, 0);
		style.font = regularFont;
		style.fontSize = (screenHeight * 0.04) * .9;
		style.alignment = TextAnchor.MiddleCenter;
		showConfirmation = false;
		
		// setup confirmation window
		confirmationRect = Rect(.3 * screenWidth, .3 * screenHeight, .4*screenWidth, .4* screenHeight);
		confirmCancelRect = Rect(confirmationRect.x + (.1 * confirmationRect.width), confirmationRect.y + .7 * confirmationRect.height - padding,
								confirmationRect.width * .3, confirmationRect.height * .3);
		confirmContinueRect = Rect((confirmationRect.x + confirmationRect.width) - ((.1 * confirmationRect.width) + confirmCancelRect.width), confirmCancelRect.y, confirmCancelRect.width, confirmCancelRect.height);
		
		var playerData : GameObject = GameObject.Find("Player Data");
		saveSystem = playerData.GetComponent("SaveSystem");
		players = saveSystem.LoadNames();
		if (saveSystem.currentPlayer && saveSystem.currentPlayer.name == "")
			saveSystem.deletePlayer("");
		
		var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);

		percentage = screenWidth / 1920 * 1.15; //Assumes images made to spec of 1920 px
		currentScreen = CurrentStartScreen.FirstScreen;
		
		var generalButtonWidth : float = (creditsButton.width * percentage);
		var generalButtonHeight : float = (creditsButton.height * percentage);
		
		// Start Screen:				
		fontHeight = fontHeightPercent * screenHeight;
		startMenuSkin.button.fontSize = fontHeight;

		SetUpForAnimatedBackground(backgroundText);
		background = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		creditsButtonRect = Rect((buttonSideBuffer * screenHeight), (buttonSideBuffer * screenHeight), generalButtonWidth, generalButtonHeight);
		
		
		// The distance from the bottom of the screen for the buttons
		var distFromBottomOfScreen : float = screenHeight - (buttonSideBuffer * screenHeight) - generalButtonHeight;
		//loginButtonRect = Rect(buttonSideBuffer * screenHeight, distFromBottomOfScreen, loginButton.width * percentage, loginButton.height * percentage);
		loginButtonRect = Rect(buttonSideBuffer * screenHeight, distFromBottomOfScreen, generalButtonWidth, generalButtonHeight);
		//facebookButtonRect = Rect(screenWidth/2 - (facebookButton.width * percentage)/2 - (buttonSideBuffer * screenHeight), distFromBottomOfScreen, facebookButton.width * percentage, facebookButton.height * percentage);
		
		generalButtonWidth = (optionsButton.width * percentage);
		generalButtonHeight = (optionsButton.height * percentage);
		quitButton = Rect(screenWidth - generalButtonWidth - (buttonSideBuffer * screenHeight), (buttonSideBuffer * screenHeight), generalButtonWidth, generalButtonHeight);
		optionsButtonRect = Rect( screenWidth - generalButtonWidth - (buttonSideBuffer * screenHeight), distFromBottomOfScreen, generalButtonWidth, generalButtonHeight);
		
		profileSelectWidth = profileBGText.width * percentage;
		profileSelectHeight = profileBGText.height * percentage;
		
		
		profileSelectButton = Rect(screenWidth * 0.01, (screenHeight - profileSelectHeight) * 0.95, profileSelectWidth, profileSelectHeight);
		showProfiles = false;
		
		
		startButtonAB = new AnimatedButton(Color.green, loginButton, loginButtonRect);
		creditsButtonAB = new AnimatedButton(Color.blue, creditsButton, creditsButtonRect);
		optionsButtonAB = new AnimatedButton(Color.blue, optionsButton, optionsButtonRect);
		quitButtonAB = new AnimatedButton(Color.blue, exitButton, quitButton);
		
		//logoRect = Rect(screenWidth / 2 - (logo.width * percentage) / 2, screenHeight / 2 - (logo.height * percentage) / 2, logo.width * percentage, logo.height * percentage );
		logoRect = Rect(screenWidth / 2 - (logo.width * percentage) / 2, screenHeight / 2 - (logo.height * percentage) / 2, logo.width * percentage, logo.height * percentage);
		
		//RiffSplashScreens();
		//SetSplash(showSplash);//nextLevel.playSplash);
		
		SetSplash(playStartScreen);
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.startMenuMusic;
		
		// Profile Select Screen:
		//titleBGRect = Rect(0,0, screenWidth,  titleBGText.height * percentage);
		//titleTextRect = Rect(buttonSideBuffer * screenHeight, titleBGRect.height / 2 -  (agentLoginText.height * percentage) / 2, agentLoginText.width * percentage, agentLoginText.height * percentage);
		//upperRightButtonRect = Rect(screenWidth -  (buttonSideBuffer * screenHeight) - (mainMenuButtonText.width * percentage), titleBGRect.height / 2 -  (mainMenuButtonText.height * percentage) / 2, (mainMenuButtonText.width * percentage), (mainMenuButtonText.height * percentage));
		upperRightButtonRect = createRect(mainMenuButtonText,0.81,0.022, 0.12, true);
		
		profileScrollArea = Rect(buttonSideBuffer * screenHeight, (titleBGText.height * percentage) + (buttonSideBuffer * screenHeight), screenWidth -  2 * (buttonSideBuffer * screenHeight), screenHeight - (titleBGText.height * percentage) -  (buttonSideBuffer * screenHeight));
		
		scrollContent = Rect(0,0,profileScrollArea.width, 2000);
		
		profileSelectSkin.button.fontSize = profileFontSizePercent * screenHeight;
		profileSelectSkin.label.fontSize = profileFontSizePercent * screenHeight;
		
		startMenuSkin.label.fontSize = 0.030 * screenWidth;
		
		titleBGRect = createRect(agentLoginText,0,0, 0.246, false);
		
		// New Profile Screen:
		agentNameRect = Rect(buttonSideBuffer * screenHeight, buttonSideBuffer * screenHeight, titleTextRect.width, titleTextRect.height);
		
		//Options Screen:
		optionsBannerRect = createRect(optionsBannerTexture,0,0, 0.246, false);
		sfxRect = createRect(new Vector2(500, 100),0,0, 0.09, false);
		musicRect = createRect(new Vector2(500, 100),0,0, 0.09, false);
		sfxLabelRect = createRect(new Vector2(500, 100),0,0, 0.09, false);
		musicLabelRect = createRect(new Vector2(500, 100),0,0, 0.09, false);
		
		sfxRect.x = Screen.width / 2 - sfxRect.width / 2;
		sfxRect.y = (Screen.height / 2 - sfxRect.height / 2) - sfxRect.height;
		sfxLabelRect.x = sfxRect.x;
		sfxLabelRect.y = (Screen.height / 2 - sfxRect.height / 2) - (sfxRect.height * 2);
		
		musicRect.x = sfxRect.x;
		musicRect.y = (Screen.height / 2 - musicRect.height / 2) + (musicRect.height * 2);
		musicLabelRect.x = sfxRect.x;
		musicLabelRect.y = (Screen.height / 2 - musicRect.height / 2) + musicRect.height;
		
		startMenuSkin.horizontalSlider.fixedHeight = 0.05 * screenHeight;
		startMenuSkin.horizontalSliderThumb.fixedHeight = 0.05 * screenHeight;
		startMenuSkin.horizontalSliderThumb.fixedWidth = 0.09 * screenHeight;
		
		deleteProfileButtonRect = createRect(deleteProfileButton, 0, 0, 0.15, false);
		
		deleteProfileButtonRect.x = Screen.width / 2 - deleteProfileButtonRect.width / 2;
		deleteProfileButtonRect.y = (Screen.height / 2 - sfxRect.height / 2) + (sfxRect.height * 3.5);
		
		
		if(saveSystem.currentPlayer != null)
		{
			sfxSliderVal = saveSystem.currentPlayer.sfxLevel;
			musicSliderVal = saveSystem.currentPlayer.musicLevel;
		}
		else
		{
			sfxSliderVal = 1.0;
			musicSliderVal = 1.0;
		}
		
		mainMenuButtonAB = new AnimatedButton(Color.blue, mainMenuButtonText, upperRightButtonRect);
		deleteProfileButtonAB = new AnimatedButton(Color.blue, deleteProfileButton, deleteProfileButtonRect);
		var enterNameSTRect:Rect = createRect(Vector2(1350, 145), 65f / 1920f, 200f / 1080f, 145f / 1080f, false);
		var acceptSTRect:Rect = createRect(Vector2(440, 120), 0f, 826f / 1080f, 120f / 1080f, false);
		var cancelSTRect:Rect = createRect(Vector2(440, 120), 0f, 826f / 1080f, 120f / 1080f, false);
		
		acceptSTRect.x = padding + (acceptSTRect.width / 2);
		cancelSTRect.x = Screen.width - (padding + cancelSTRect.width + (acceptSTRect.width / 2));
		acceptSTRect.y = Screen.height * 0.6 + padding;
		cancelSTRect.y = Screen.height * 0.6 + padding;
		
		
		acceptRect = new Rect(0,acceptSTRect.y,loginButtonRect.width, loginButtonRect.height);
		cancelRect = new Rect(0,cancelSTRect.y,optionsButtonRect.width, optionsButtonRect.height);
		
		var widButtons: float = acceptRect.width + cancelRect.width + (padding * 3);
		var midwayStart:float = Screen.width / 2 - widButtons / 2;
		
		acceptRect.x = midwayStart;
		cancelRect.x = acceptRect.x + acceptRect.width + (padding * 3);
		
		acceptAB = new AnimatedButton(Color.green, acceptText, acceptRect);
		cancelAB = new AnimatedButton(Color.blue, cancelText, cancelRect);
		
		
		profileStyle = profileSelectSkin.customStyles[0];
		profileStyle.fontSize = 0.06 * screenWidth;
		enterNameST = new ShadowedText("Enter your name:", enterNameSTRect, profileStyle, true);
		acceptST  = new ShadowedText("Accept", acceptSTRect, profileStyle, true);
		cancelST  = new ShadowedText("Cancel", cancelSTRect, profileStyle, true);
		welcomeText = new ShadowedText("", Rect(0,0,0,0), profileStyle, true);
		
		optionsTitleST = new ShadowedText("Options", optionsSkin.customStyles[0], optionsIcon);
		
	}
	
	private var profileStyle:GUIStyle;
	
	public function Render()
	{
		//GUI.DrawTexture(background, currentTexture, ScaleMode.ScaleAndCrop);
		//if (showSplash)
		if (playStartScreen)
		{
			GUI.DrawTexture(background, currentTexture, ScaleMode.StretchToFill);
			var newWidth : float = currentIcon.width * percentage * (1f + splashScale);
			var newHeight: float = currentIcon.height * percentage * (1f + splashScale);
			var iconRect : Rect = new Rect(screenWidth / 2 - newWidth / 2, screenHeight / 2 - newHeight / 2, newWidth, newHeight );
		
			GUI.DrawTexture(iconRect, currentIcon, ScaleMode.ScaleAndCrop);
		}
		else
		{
			AnimatedBackground(currentTexture);
		
			//GUI.DrawTexture(new Rect(0,0,lineOverlayText.width, lineOverlayText.height), lineOverlayText);
			GUI.skin = startMenuSkin;
			
			
			if(currentScreen == CurrentStartScreen.FirstScreen)
			{
			
				GUI.DrawTexture(logoRect, logo, ScaleMode.StretchToFill);
				
				/*
				setButtonTexture(creditsButton, creditsButtonPressed);
				if (GUI.Button(creditsButtonRect, ""))
				{
					PlayButtonPress();
					Application.LoadLevel("Credits");
				}
				
				setButtonTexture(optionsButton, optionsButtonPressed);
				if (GUI.Button(optionsButtonRect, ""))
				{
					/*
					//So it can pass to the loading screen where to go next
					var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
					nextLevel.nextLevel = firstLevel;
					Debug.Log("Going to " + firstLevel);
					currentResponse.type = EventTypes.NEWGAME;
					
					//Debug.Log("Options button was pressed.");
					
					
					if(saveSystem.currentPlayer != null)
					{
						sfxSliderVal = saveSystem.currentPlayer.sfxLevel;
						musicSliderVal = saveSystem.currentPlayer.musicLevel;
					}
					else
					{
						sfxSliderVal = 1.0;
						musicSliderVal = 1.0;
					}
					
					currentScreen = CurrentStartScreen.Options;
					players = saveSystem.LoadNames();
					PlayButtonPress();
				}
				
				
				setButtonTexture(loginButton, loginButtonPressed);
				if (GUI.Button(loginButtonRect, ""))
				{
					players = saveSystem.LoadNames();
					if(players.Count <=0 || players[0] == "")
					{
						firstTime = true;
						newUsername = "Enter Name";
						currentScreen = CurrentStartScreen.NewProfile;
					}
					else
					{
						firstTime = false;
						currentScreen = CurrentStartScreen.ProfileSelect;
					}
					PlayButtonPress();
				}

				
				resetButtonTexture();				
				
				
				setButtonTexture(facebookButton, facebookButtonPressed);
				if (GUI.Button(facebookButtonRect, ""))
				{
					currentResponse.type = EventTypes.FACEBOOK;
					PlayButtonPress();
				}
				
				setButtonTexture(exitButton, exitButtonPressed);
				if (GUI.Button(quitButton, ""))
				{
					Utils.QuitGame();
					//Application.Quit();
				}
				*/
				//resetButtonTexture();
				
				
				if(startButtonAB.Render())
				{
					players = saveSystem.LoadNames();
					if(players.Count <=0 || players[0] == "")
					{
						firstTime = true;
						newUsername = "";
						currentScreen = CurrentStartScreen.NewProfile;
					}
					else
					{
						saveSystem.LoadPlayer(players[0]);
						currentResponse.type = EventTypes.LEVELSELECT;
					}
					PlayButtonPress();
				}
				if (creditsButtonAB.Render())
				{
					PlayButtonPress();
					Application.LoadLevel("Credits");
				}
				if (optionsButtonAB.Render())
				{
					/*
					//So it can pass to the loading screen where to go next
					var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent(NextLevelScript);
					nextLevel.nextLevel = firstLevel;
					Debug.Log("Going to " + firstLevel);
					currentResponse.type = EventTypes.NEWGAME;
					*/
					//Debug.Log("Options button was pressed.");
					
					
					if(saveSystem.currentPlayer != null)
					{
						sfxSliderVal = saveSystem.currentPlayer.sfxLevel;
						musicSliderVal = saveSystem.currentPlayer.musicLevel;
					}
					else
					{
						sfxSliderVal = 1.0;
						musicSliderVal = 1.0;
					}
					
					currentScreen = CurrentStartScreen.Options;
					players = saveSystem.LoadNames();
					PlayButtonPress();
				}
				if (quitButtonAB.Render())
				{
					Utils.QuitGame();
					//Application.Quit();
				}
				

				
			}// end of first screen
			else if(currentScreen == CurrentStartScreen.ProfileSelect || currentScreen == CurrentStartScreen.NewProfile)
			{
				// loads the first player on the list, essentially making only one player
				// while leaving in the functionality in case we want to go back.
				if(firstTime)
				{
					players = saveSystem.LoadNames();
					GUI.skin.verticalScrollbarThumb.fixedWidth = screenWidth * scrollThumbWidth;
					
					//GUI.DrawTexture(titleBGRect, titleBGText, ScaleMode.StretchToFill);
					//GUI.DrawTexture(titleTextRect, agentLoginText, ScaleMode.ScaleToFit);
					//setButtonTexture(mainMenuButtonText, mainMenuButtonTextPressed);
					if (currentScreen != CurrentStartScreen.NewProfile && mainMenuButtonAB.Render())
					{
						currentScreen = CurrentStartScreen.FirstScreen;
						PlayButtonPress();
					}
					//resetButtonTexture();
					
					// ANDROID BACK BUTTON
					if(Input.GetKeyUp(KeyCode.Escape))
					{
						currentScreen = CurrentStartScreen.FirstScreen;
						PlayButtonPress();
					}
					
					scrollContent.height = (players.Count + 1) * (profileSelectHeight + (buttonSideBuffer * screenHeight));
					
					
					GUI.skin.verticalScrollbarThumb.fixedWidth = screenWidth * scrollThumbWidth;
				/*
					levelSelectScrollPos = GUI.BeginScrollView
					(
						profileScrollArea,				
						levelSelectScrollPos,
						scrollContent,
						false, 
						false
					);				

*/
						var profileButton : Rect = Rect(0, 0, profileSelectWidth, profileSelectHeight);
						var midPoint : float = profileSelectHeight / 2 - (deleteButtonText.height * percentage) / 2;
						var deleteButton : Rect = Rect(profileSelectWidth + (buttonSideBuffer * screenHeight), midPoint,deleteButtonText.width * percentage, deleteButtonText.height * percentage);								
						
						var distanceFromTop : float = 0;
						
						/*
						for(var i : int = 0; i < players.Count; i++)
						{
							GUI.skin = profileSelectSkin;
							midPoint = profileButton.y + profileSelectHeight / 2 - (deleteButtonText.height * percentage) / 2;
							deleteButton = Rect(profileSelectWidth + (buttonSideBuffer * screenHeight), midPoint,deleteButtonText.width * percentage, deleteButtonText.height * percentage);
							if (GUI.Button(profileButton, players[i]))
							{
								saveSystem.LoadPlayer(players[i]);
								currentResponse.type = EventTypes.LEVELSELECT;
								PlayButtonPress();
							}
							GUI.skin = startMenuSkin;
							if (GUI.Button(deleteButton, deleteButtonText))
							{
								saveSystem.deletePlayer(players[i]);
								PlayButtonPress();
							}
							distanceFromTop +=  profileSelectHeight + (buttonSideBuffer * screenHeight);
							profileButton.y = distanceFromTop;
						}
						*/
						
						GUI.skin = profileSelectSkin;

						if(currentScreen == CurrentStartScreen.NewProfile)
						{
							GUI.skin.textField.fontSize = profileFontSizePercent * screenHeight;
							
							profileButton = Rect(0, Screen.height * 0.3, Screen.width, Screen.height * 0.3);
							
							newUsername = GUI.TextField(profileButton, newUsername, 10);
							
							
							if(newUsername.Length > 0)
								newUsername = char.ToUpper(newUsername[0]) + newUsername.Substring(1);
							
							
							//midPoint = profileButton.y + profileSelectHeight / 2 - (deleteButtonText.height * percentage *.8f) / 2;
							//deleteButton = Rect(profileSelectWidth + (buttonSideBuffer * screenHeight), midPoint, (deleteButtonText.width * percentage *.8f), (deleteButtonText.height * percentage *.8f));
							//setButtonTexture(approveButtonText, approveButtonText);
							enterNameST.Display();
							//acceptST.Display();
							//cancelST.Display();
							
							//if(GUI.Button(cancelST.displayRect, ""))
							if(cancelAB.Render())
							{
								currentScreen = CurrentStartScreen.FirstScreen;
								PlayButtonPress();
							}
						
							
							//if(GUI.Button(acceptST.displayRect, ""))
							if(acceptAB.Render())
							{
								if(newUsername != "Enter Name" && newUsername != "")
								{
									saveSystem.createPlayer(newUsername, sfxSliderVal, musicSliderVal);
									saveSystem.LoadPlayer(newUsername);
									
									currentScreen = CurrentStartScreen.WelcomePlayer;
									// If it is the first time a player is loading the game
									//(aka no profile has been created until this one)
									// Then it either loads the dashboard next or the specified
									// level under the variable firstTimeLevelToLoad.

									/*
									if(firstTimeLevelToLoad == "")
										currentResponse.type = EventTypes.LEVELSELECT;
									else
									{
										PlayerPrefs.SetString(Strings.NextLevel, firstTimeLevelToLoad);
										Application.LoadLevel("LoadingScreen");
									}
									*/	
									PlayButtonPress();
								}
							}
							GUI.skin = startMenuSkin;
						}
						/*
						else
						{
							GUI.skin = profileSelectSkin;
							if (GUI.Button(profileButton, "NEW AGENT"))
							{
								newUsername = "Enter Name";
								currentScreen = CurrentStartScreen.NewProfile;
								PlayButtonPress();
							}
						}
						*/
						GUI.skin = startMenuSkin;
						
						
		
						//When we have options for the profile, put these buttons in, instead of just the delete button
						/*
						var optButton : Rect = Rect(profileSelectWidth + (buttonSideBuffer * screenHeight), midPoint,deleteButtonText.width * percentage, deleteButtonText.height * percentage);
						var deteteButton : Rect = Rect(profileSelectWidth + 2 * (buttonSideBuffer * screenHeight) + (deleteButtonText.width*percentage), midPoint,deleteButtonText.width * percentage, deleteButtonText.height * percentage);
						if (GUI.Button(optButton, profileOptText))
						{
							Debug.Log("Options for profile button pressed");
						}
						if (GUI.Button(deleteButton, deleteButtonText))
						{
							//saveSystem.deletePlayer(players[i]);
							showProfiles = false;
						}
						*/
						// If we eventually want a loggout button:				
						/*
						if (GUI.Button(Rect(screenWidth * 0.01, profileSelectHeight * (players.Count + 1), profileSelectWidth, profileSelectHeight), "Logout"))
						{
							saveSystem.logout();
							showProfiles = false;
						}
						*/
		
					//GUI.EndScrollView();  //End Scroll bar
				}

			}// end of profile select
			else if(currentScreen == CurrentStartScreen.WelcomePlayer)
			{
				profileButton = Rect(0, Screen.height * 0.3, Screen.width, Screen.height * 0.3);
				welcomeText.Display("\nWelcome to the ECRB,\n Agent " + newUsername + "!", profileButton, false);
				SendToLevelSelect();
			}
			/*
			else if(currentScreen == CurrentStartScreen.NewProfile)
			{
			
				GUI.DrawTexture(titleBGRect, nameBannerText, ScaleMode.StretchToFill);
				
				//newUsername = GUI.TextField (Rect (screenWidth * 0.01 + profileSelectWidth, 5, 200, 20), newUsername, 25);
				
				/*
				
				//newUsername = "AGENT";
				GUI.skin = profileSelectSkin;
				GUI.Label(agentNameRect, newUsername);
				GUI.skin = startMenuSkin;
				
				var keyRect : Rect;
				
				var count : int =  0;
				
				var keyWidth : float = keys[0].width * percentage;
				var keyHeight : float = keys[0].height * percentage;
				var keyBufferSpace : float = 0.01 * screenWidth;
				var keysPerRow: int = screenWidth / (keyWidth + 2 * keyBufferSpace);
				var keysCol : int = keys.Count / keysPerRow;
				
				var keyX : float = keyBufferSpace;
				var keyY : float = titleBGRect.height;
				
				for(var k : int = 0; k < keysCol; k++)
				{
					keyY = titleBGRect.height + (keyHeight + keyBufferSpace) * k;
					for(var j : int = 0; j < keysPerRow; j++)
					{
						keyX = keyBufferSpace + (keyWidth + keyBufferSpace) * j;
						keyRect = Rect(keyX,keyY,keyWidth, keyHeight);
						if(GUI.Button(keyRect, keys[count]))
						{
							if(keys[count].name == "backspace")
							{
								if(newUsername != "")
								{
									newUsername = newUsername.Substring(0, newUsername.length - 1);
								}
							}
							else
							{
								if(newUsername == "")
								{
									newUsername += keys[count].name.ToUpper();
								}
								else
								{
									newUsername += keys[count].name;
								}
							}
						}
						count++;
					}
				}
				
				*/	
			//}// end of new profile
			else if(currentScreen == CurrentStartScreen.Options)
			{
				GUI.skin = startMenuSkin;
				
				//setButtonTexture(deleteProfileButton, deleteProfileButtonPressed);
				if(deleteProfileButtonAB.Render())
				{
					showConfirmation = true;
				}
				//resetButtonTexture();
				
				//GUI.DrawTexture(optionsBannerRect, optionsBannerTexture,ScaleMode.StretchToFill);
				
				optionsTitleST.Display();

				
				if(saveSystem.currentPlayer != null)
				{
					sfxSliderVal = saveSystem.currentPlayer.sfxLevel;
					musicSliderVal = saveSystem.currentPlayer.musicLevel;
				}
				
				if(!showConfirmation)
				{
					GUI.Label(sfxLabelRect, "Effect Volume");
					sfxSliderVal = GUI.HorizontalSlider (sfxRect, sfxSliderVal, 0.0, 1.0);
					GUI.Label(musicLabelRect, "Music Volume");
					musicSliderVal = GUI.HorizontalSlider (musicRect, musicSliderVal, 0.0, 1.0);
				}
				
				if(saveSystem.currentPlayer != null)
				{
					saveSystem.currentPlayer.sfxLevel = sfxSliderVal;
					saveSystem.currentPlayer.musicLevel = musicSliderVal;
				}
				
				//setButtonTexture(mainMenuButtonText, mainMenuButtonTextPressed);				
				if (mainMenuButtonAB.Render())
				{
					if(saveSystem.currentPlayer != null)
						saveSystem.SaveCurrentPlayer();
						
					currentScreen = CurrentStartScreen.FirstScreen;
					PlayButtonPress();
				}
				//resetButtonTexture();
				
				//	ANDROID BACK BUTTON
				if(Input.GetKeyUp(KeyCode.Escape))
				{
					if(saveSystem.currentPlayer != null)
						saveSystem.SaveCurrentPlayer();
						
					currentScreen = CurrentStartScreen.FirstScreen;
					PlayButtonPress();
				}
				
				SoundManager.Instance().setVolumes(sfxSliderVal, musicSliderVal);
				
				if(lastSFXVal != sfxSliderVal)
				{
					lastSFXVal = sfxSliderVal;
					PlayButtonPress();
				}
				
				if(lastMusicVal != musicSliderVal)
				{
					lastMusicVal = musicSliderVal;
					SoundManager.Instance().UpdateMusicVol(musicSliderVal);
				}
				
				//**********************
				// Confirmation Box:
				if(showConfirmation)
				{
					setButtonTexture(infoBox, infoBox, style);
					GUI.Box(confirmationRect, "Are you sure you want to delete player data?", style);
					setButtonTexture(infoButton, infoButton, style);
					if (GUI.Button(confirmCancelRect, "Cancel", style))
						showConfirmation = false;
					if (GUI.Button(confirmContinueRect, "Continue", style))
					{
						for(var l:int = 0; l < players.Count; l++)
							saveSystem.deletePlayer(players[l]);
							
						var displayOnce:DisplayOnceSystem = new DisplayOnceSystem();
						displayOnce.DeleteKeys();
						PlayButtonPress();
						showConfirmation = false;
						currentScreen = CurrentStartScreen.FirstScreen;
					}
					resetButtonTexture(style);
					
					//	ANDROID BACK BUTTON
					if(Input.GetKeyUp(KeyCode.Escape))
						showConfirmation = false;
				}
				//**********************
				
			}// end of options
			
		}
	}
	
	private var waiting:boolean = false;
	private function SendToLevelSelect()
	{
		if(!waiting)
		{
			waiting = true;
			yield WaitForSeconds(3);
			if(firstTimeLevelToLoad == "")
				currentResponse.type = EventTypes.LEVELSELECT;
			else
			{
				PlayerPrefs.SetString(Strings.NextLevel, firstTimeLevelToLoad);
				Application.LoadLevel("LoadingScreen");
			}
		}
	}
	
	
	public function SetSplash(show:boolean)
	{
		showSplash = playStartScreen;
		//showSplash = show;
		if (show)
		{
			RiffSplashScreens();
		}
		else
		{
			currentTexture = backgroundText;
			currentScreen = CurrentStartScreen.FirstScreen;
		}
	}
	
	private function RiffSplashScreens():IEnumerator
	{
		//showSplash = true;
		//if (showSplash)
		if (playStartScreen)
		{
			#if (!UNITY_WEBPLAYER)
			MetricContainer.StartSession();
			MetricContainer.LoadGeneralData(Path.Combine(Application.persistentDataPath, "Metrics/GENERAL.xml"));
			MetricContainer.IncrementGeneralTimesPlayed();
			#endif
			currentTexture = splashDOEBG;
			currentIcon = splashDOEIcon;
			yield WaitForSeconds(2);
			currentTexture = splashRedAxonBG;
			//currentIcon = splashRedAxonIcon;
			currentIcon = presentsText;
			yield WaitForSeconds(2);
			showSplash = false;
			playStartScreen = false;
		}
		currentTexture = backgroundText;
		currentScreen = CurrentStartScreen.FirstScreen;
	}
}