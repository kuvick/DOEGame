/**********************************************************
MainMenu.js

Description: 

Author: Francis Yuan
**********************************************************/
#pragma strict

public class MainMenu extends GUIControl
{
	// Font Sizes
	private var scoreFontHeight:float;			
	private var menuFontHeight:float;		
	
	// Skins for GUI components
	public var mainMenuSkin:GUISkin;
	
	// Main Menu Rectangles
	private var gameMenuButton:Rect;   		
	private var waitButton:Rect; 				
	private var undoButton:Rect;				
	private var intelButton:Rect; 	
	private var scoreRect:Rect;
	private var turnRect:Rect;
	
	// Main Menu Scaling
	private var hexButtonHeightPercent:float = 0.2;		// Width of a Main menu button as a percent of height
	private var scoreFontHeightPercent:float = 0.04;	// Height of the font as a percentage of screen height
	private var menuFontHeightPercent:float = 0.03;		// Height of the font as a percentage of screen height
	
	private var hexButtonPadding:float;					// Padding around the Main menu buttons
	private var hexButtonHeight:float;					// Width of a a Main menu button in actual pixels		
	
	// Main Menu Textures
	private var undoTexture:Texture;					// Texture to display for the undo button
	private var waitTexture:Texture;					// Texture to display for the wait button
	private var intelTexture:Texture;					// Texture to display for the intel button
	
	public var undoTextureNeutral:Texture;				// Texture for the undo button when unclicked
	public var undoTextureClicked:Texture;				// Texture for the undo button when clicked
	public var waitTextureNeutral:Texture;				// Texture for the wait button when unclicked
	public var waitTextureClicked:Texture;				// Texture for the wait button when clicked
	public var intelTextureNeutral:Texture;				// Texture for the intel button when unclicked
	public var intelTextureClicked:Texture;				// Texture for the intel button when clicked
	
	function Start () 
	{
		super.Start();
		InitializeMainMenu();
	}
	
	function InitializeMainMenu()
	{
		hexButtonHeight = hexButtonHeightPercent * screenHeight;
		var totalButtonPadding : float = hexButtonHeight + padding;
		
		scoreFontHeight = scoreFontHeightPercent * screenHeight;
		mainMenuSkin.label.fontSize = scoreFontHeight;
		
		menuFontHeight = menuFontHeightPercent * screenHeight;
		mainMenuSkin.button.fontSize = menuFontHeight;
		
		gameMenuButton = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, hexButtonHeight, hexButtonHeight);														
		waitButton = Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - (1.7 * totalButtonPadding), hexButtonHeight, hexButtonHeight);						
		var undoButtonPos:Vector2 = HexCalc(Vector2(waitButton.x, waitButton.y), hexButtonHeight, 3);
		undoButton = Rect(undoButtonPos.x, undoButtonPos.y, hexButtonHeight , hexButtonHeight);																					
		intelButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, horizontalBarHeight + screenHeight - totalButtonPadding, hexButtonHeight, hexButtonHeight); 	
		
		scoreRect = Rect(verticalBarWidth + screenWidth - padding, horizontalBarHeight + padding, 0, 0);
		turnRect = Rect(verticalBarWidth + screenWidth - padding, horizontalBarHeight + (2 * padding) + scoreFontHeight, 0, 0);
		
		
		rectList.Add(gameMenuButton);
		rectList.Add(waitButton);
		rectList.Add(undoButton);
		rectList.Add(intelButton);
	}
	
	/*
		Draws all the buttons in the Main Menu.
		
		Buttons:
			Game Menu - Opens the Game Menu
			Wait - Advances the game a single turn
			Undo - Undoes the last action
			Intel - Opens the Intel screen
		
		Whenever a submenu is opened, the Main Menu is hidden in order to prevent conflicting clicks
	*/
	public function Render()
	{   
		GUI.skin = mainMenuSkin;
		
		// Set icon textures to default
		waitTexture = waitTextureNeutral;
		undoTexture = undoTextureNeutral;
		intelTexture = intelTextureNeutral;
		
		// Calculate the mouse position
		var mousePos:Vector2;
		mousePos.x = Input.mousePosition.x;
		mousePos.y = Screen.height - Input.mousePosition.y;
		
		// Calculate any touches
		// TODO: Test whether this code block actually works with touch controls
		var touchPos:Vector2;
		for (var i = 0; i < Input.touchCount; ++i) 
		{
	        if (Input.GetTouch(i).phase == TouchPhase.Began) 
	        {
	        	touchPos = Input.GetTouch(i).position;
	        }
	    }
	    
	    // If the mouse or the finger is hovering/tapping one of the buttons, change the button's texture
		if (waitButton.Contains(mousePos) || waitButton.Contains(touchPos))
		{
			waitTexture = waitTextureClicked;
		}
		
		if (undoButton.Contains(mousePos) || undoButton.Contains(touchPos))
		{
			undoTexture = undoTextureClicked;
		}
		
		if (intelButton.Contains(mousePos) || intelButton.Contains(touchPos))
		{
			intelTexture = intelTextureClicked;
		}
		
		// Draw the buttons and respond to interaction
		if(GUI.Button(gameMenuButton, "Menu"))
		{
			Debug.Log("Game Menu button clicked");
			
			/*
			if(!isPaused)
			{ 
				
				Debug.Log("Game is paused");
				isPaused = true; 
				savedShowToolbar = showToolbar;
				showToolbar = false;
				ModeController.setCurrentMode(GameState.PAUSE);
				
			}
			*/
		}
		
		if(GUI.Button(waitButton, waitTexture))
		{
			Debug.Log("Wait button clicked");
			/*
			IntelSystem.addTurn();
			*/
		}
		
		if(GUI.Button(undoButton, undoTexture))
		{
			
			Debug.Log("Debug button clicked");
			/*
			var data:Database = GameObject.Find("Database").GetComponent("Database");
			var didUndo = data.undo();
			if(didUndo)
			{
				IntelSystem.subtractTurn();
				Debug.Log("Undo Successful!");
			}
			else
				Debug.Log("Undo Failed!");
			*/
		}
		
		if(GUI.Button(intelButton, intelTexture))
		{
			Debug.Log("Intel button clicked");
			/*
			if(!eventListUsed)
			{
				eventListUsed = true;
				savedShowToolbar = showToolbar;
				showToolbar = false;	
				ModeController.setCurrentMode(GameState.INTEL);
			}
			*/
		}
		
		/*
		// Draw the score and label
		GUI.Label(Rect(verticalBarWidth + screenWidth - padding, horizontalBarHeight + padding, 0, 0), "0000000");
		GUI.Label(Rect(verticalBarWidth + screenWidth - padding, horizontalBarHeight + (2 * padding) + scoreFontHeight, 0, 0), "Turn: " + IntelSystem.currentTurn);
		*/
		
		GUI.Label(scoreRect, "0000000");
		GUI.Label(turnRect, "Turn: 0");
	}
	
	/*
		Helper function that finds the position of a hexagon bordering an equivalent base hexagon
		 
		Parameters:
			position - The top left hand corner of the bounding box of the base hexagon
			length - The length of a side of the bounding box of the base hexagon
			side - The side that borders the base hexagon, starting from the top right side at 1, moving clockwise around the hexagon
			
		Return:
			A Vector2 object describing the top left hand corner of the bounding box of a hexagon
			that borders the base hexagon
			
		Note:
			Assumes the hexagon is pointing upwards		
	*/
	function HexCalc(position:Vector2, length:float, side:int):Vector2
	{
		var angle = (90 - (side * 60) + 30) * Mathf.PI/180;
		var offsetLength = length * 0.85;
		var sin = Mathf.Sin(angle) * offsetLength;
		var cos = Mathf.Cos(angle) * offsetLength;
		
		var newPosition:Vector2 = Vector2(position.x + cos, position.y - sin);
		
		return newPosition;
	}
}
