/* Revised/Replaced Coding by Katharine Uvick

	Calculating percentages based on design of the game complete screen
	which involved a 1920 x 1080 size design (hence why
	these numbers are used in the calculations).

*/


#pragma strict

public class GameComplete extends GUIControl
{
	public var background : Texture;
	public var ecrbLogo : Texture;
	private var ecrbLogoRect:Rect;
	//private var tapToContinueRect:Rect;
	private var congratsAgentRect:Rect;
	public var congratsAgent:Texture;
	public var goldCoin:Texture;
	private var goldCoinRects:List.<Rect> = new List.<Rect>();
	private var goldCoinSpeeds:List.<float> = new List.<float>();
	public var style:GUIStyle;
	
	
	public var continueButtonTexture:Texture;
	private var contButtonRect : Rect;
	private var continueButtonAB : AnimatedButton;
	
	public function Initialize()
	{
		super.Initialize();
		
		backgroundMusic = SoundManager.Instance().backgroundSounds.creditsMenuMusic;
		
		var halfScreenRect:Rect = Rect(0,0,screenWidth / 2, screenHeight);
		
		ecrbLogoRect = createRect(ecrbLogo, 0,0,0.9, true, halfScreenRect);
		ecrbLogoRect.x = halfScreenRect.width / 2 - ecrbLogoRect.width /2;
		ecrbLogoRect.y = halfScreenRect.height /2 - ecrbLogoRect.height /2;
		
		congratsAgentRect = createRect(congratsAgent, 0.15, 0, 0.9, true, halfScreenRect);
		
		congratsAgentRect.x = halfScreenRect.width / 2 - congratsAgentRect.width / 2 + halfScreenRect.width;
		congratsAgentRect.y = halfScreenRect.height / 2 - congratsAgentRect.height / 2;
		
		style.fontSize = 0.025 * Screen.height * 1.5;
		
		//var size:Vector2 = style.CalcSize(GUIContent("Tap to continue."));
		//tapToContinueRect = Rect(screenWidth - size.x - padding, screenHeight - size.y - padding, size.x, size.y);
		
		for(var i:int = 0; i < 5; i++)
		{
			var tempRect:Rect = createRect(goldCoin, 0,0, Random.Range(0.25, 0.35), false);
			var x:float = (screenWidth / 5) * i + padding;
			tempRect.x = x;
			tempRect.y = -tempRect.height * i;
			
			goldCoinSpeeds.Add(Random.Range(1, 7));
			goldCoinRects.Add(tempRect);
			
		}

		contButtonRect = createRect(continueButtonTexture, 0f,0f, continueButtonTexture.height / 1080.0, false);
		contButtonRect.x = Screen.width - contButtonRect.width - padding;
		contButtonRect.y = Screen.height - contButtonRect.height - padding;
		continueButtonAB = new AnimatedButton(Color.blue, continueButtonTexture, contButtonRect);
						
		PlayerPrefs.SetInt("DisplayedGameComplete", 1);
		
	}
	
	public function Render()
	{   
		//GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
		AnimatedBackground(background);
		RenderCoins();
		GUI.DrawTexture(ecrbLogoRect, ecrbLogo);
		GUI.DrawTexture(congratsAgentRect, congratsAgent);
		//GUI.Label(tapToContinueRect, "Tap to continue.", style);
		

		//if(Input.GetKeyUp(KeyCode.Mouse0) || Input.touchCount > 0)
		if(continueButtonAB.Render(style))
			Application.LoadLevel("Credits");
			

	}//end of Render
	
	
	
	private function RenderCoins()
	{
		for(var i: int = 0; i < 5; i++)
		{
			var tempRect:Rect = goldCoinRects[i];
			GUI.DrawTexture(goldCoinRects[i], goldCoin);
			
			tempRect.y += goldCoinSpeeds[i];
			
			if(tempRect.y > screenHeight)
			{
				tempRect = createRect(goldCoin, 0,0, Random.Range(0.25, 0.35), false);
				var x:float = (screenWidth / 5) * i + padding;
				tempRect.x = x;
				tempRect.y = -tempRect.height;
			
				goldCoinSpeeds[i] = Random.Range(1, 7);
			}
				
			goldCoinRects[i] = tempRect;
		}
	
	}
	
	
	
	
	
	
	
	
	
	
	
}// End of GameComplete