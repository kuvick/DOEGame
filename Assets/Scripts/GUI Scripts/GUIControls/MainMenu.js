/**********************************************************
MainMenu.js

Description: 

Author: Francis Yuan
**********************************************************/
#pragma strict

public class MainMenu extends GUIControl
{
	// Skin for Main Menu
	public var mainMenuSkin:GUISkin;
			
	// Main Menu Rectangles
	private var pauseButton:Rect;   		
	private var waitButton:Rect; 				
	private var undoButton:Rect;				
	private var intelButton:Rect; 	
	private var scoreRect:Rect;
	private var turnRect:Rect;
	
	// Main Menu Scaling
	private var hexButtonHeightPercent:float = 0.2;		// Height of the hex button font as a percentage of screen height
	private var scoreFontHeightPercent:float = 0.04;	// Height of the score font as a percentage of screen height
	private var pauseFontHeightPercent:float = 0.03;	// Height of the pausefont as a percentage of screen height
				
	private var hexButtonHeight:float;					
	private var scoreFontHeight:float;			
	private var pauseFontHeight:float;		
	
	// Main Menu Textures
	private var undoTexture:Texture;				
	private var waitTexture:Texture;				
	private var intelTexture:Texture;					
	
	public var undoTexture_Inactive:Texture;			
	public var undoTexture_Active:Texture;				
	public var waitTexture_Inactive:Texture;
	public var waitTexture_Active:Texture;		
	public var intelTexture_Inactive:Texture;		
	public var intelTexture_Active:Texture;		
	
	// Score and turn ints
	private var score:int;
	private var turn:int;
	private var intelSystem : IntelSystem;
	
	public function Start () 
	{
		super.Start();		
	}
	
	// For when the level is loaded and there is an intel system
	public function LoadLevelReferences()
	{
		intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
	}
	
	public function Initialize()
	{	
		super.Initialize();

		hexButtonHeight = hexButtonHeightPercent * screenHeight;
		var totalButtonPadding : float = hexButtonHeight + padding;
		
		scoreFontHeight = scoreFontHeightPercent * screenHeight;
		mainMenuSkin.label.fontSize = scoreFontHeight;
		
		pauseFontHeight = pauseFontHeightPercent * screenHeight;
		mainMenuSkin.button.fontSize = pauseFontHeight;
		
		pauseButton = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, hexButtonHeight, hexButtonHeight);														
		waitButton = Rect(verticalBarWidth + padding, horizontalBarHeight + screenHeight - (1.7 * totalButtonPadding), hexButtonHeight, hexButtonHeight);						
		var undoButtonPos:Vector2 = HexCalc(Vector2(waitButton.x, waitButton.y), hexButtonHeight, 3);
		undoButton = Rect(undoButtonPos.x, undoButtonPos.y, hexButtonHeight , hexButtonHeight);																					
		intelButton = Rect(verticalBarWidth + screenWidth - totalButtonPadding, horizontalBarHeight + screenHeight - totalButtonPadding, hexButtonHeight, hexButtonHeight); 	
		
		scoreRect = Rect(verticalBarWidth + screenWidth - padding, horizontalBarHeight + padding, 0, 0);
		turnRect = Rect(verticalBarWidth + screenWidth - padding, horizontalBarHeight + (2 * padding) + scoreFontHeight, 0, 0);
		
		// Add the buttons' rects to the rectList for checking input collision
		rectList.Add(pauseButton);
		rectList.Add(waitButton);
		rectList.Add(undoButton);
		rectList.Add(intelButton);
		
	}
	
	public function Render()
	{   
		GUI.skin = mainMenuSkin;
		
		// Set icon textures to default
		waitTexture = waitTexture_Inactive;
		undoTexture = undoTexture_Inactive;
		intelTexture = intelTexture_Inactive;
		
		// Calculate the mouse position
		var mousePos:Vector2;
		mousePos.x = Input.mousePosition.x;
		mousePos.y = Screen.height - Input.mousePosition.y;
	    
	    // If the mouse or the finger is hovering/tapping one of the buttons, change the button's texture
		if (waitButton.Contains(mousePos))
		{
			waitTexture = waitTexture_Active;
		}
		
		if (undoButton.Contains(mousePos))
		{
			undoTexture = undoTexture_Active;
		}
		
		if (intelButton.Contains(mousePos))
		{
			intelTexture = intelTexture_Active;
		}
		
		// Draw the buttons and respond to interaction
		if(GUI.Button(pauseButton, "Pause"))
		{
			currentResponse.type = EventTypes.PAUSE;
		}
		
		if(GUI.Button(intelButton, intelTexture))
		{
			currentResponse.type = EventTypes.INTEL;
		}
		
		if(GUI.Button(waitButton, waitTexture))
		{
			currentResponse.type = EventTypes.WAIT;
			//currentResponse.type = EventTypes.BUILDING;
		}
		
		if(GUI.Button(undoButton, undoTexture))
		{
			currentResponse.type = EventTypes.UNDO;
		}
		
		if (GUI.Button(RectFactory.NewRect(0, .95, .1, .05), "Toggle ViewType")){ // This is just temporary until we find another place for it
			var camera : CameraControl = GameObject.Find("Main Camera").GetComponent(CameraControl);
			camera.ToggleZoomType();
		}
		
		GUI.Label(scoreRect, score.ToString());
		if(intelSystem != null)
		{
			GUI.Label(turnRect, "Turn: " + intelSystem.currentTurn);
		}
	}
	
	private function HexCalc(position:Vector2, length:float, side:int):Vector2
	{
		var angle = (90 - (side * 60) + 30) * Mathf.PI/180;
		var offsetLength = length * 0.85;
		var sin = Mathf.Sin(angle) * offsetLength;
		var cos = Mathf.Cos(angle) * offsetLength;
		
		var newPosition:Vector2 = Vector2(position.x + cos, position.y - sin);
		
		return newPosition;
	}
}
