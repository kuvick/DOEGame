#pragma strict

public var skin : GUISkin;
public var border : Texture2D;

private var componentSelected : boolean = false;

private var dispText : String = String.Empty;
private var dispRect : Rect;
private var dispWidth : float;
private var dispWidthScale : float = .25;
private var dispHeight : float = 1;
private var screenMiddle : Vector2;

function Start () 
{
	screenMiddle = Vector2(Screen.width, Screen.height) / 2.0;
	dispWidth = Screen.width * dispWidthScale;
	dispRect = Rect(screenMiddle.x - (dispWidth / 2.0),0,dispWidth,dispHeight);
	skin.label.fontSize = .025 * Screen.height;
	skin.label.fontStyle = FontStyle.Bold;
}

function Update () 
{
	if (componentSelected && Input.GetMouseButtonDown(0))
		componentSelected = false;
}

function OnGUI()
{
	if (componentSelected)
		Render();
}

public function Activate(disp : String)
{
	componentSelected = true;
	dispText = disp;
	FormatDisplay();
}

private function FormatDisplay()
{
	dispHeight = skin.label.CalcHeight(GUIContent(dispText), dispWidth);
	dispRect.height = dispHeight;
	dispRect.y = screenMiddle.y - (dispHeight / 2.0);
}

private function Render()
{
	GUI.skin = skin;
	
	GUI.Box(dispRect, String.Empty);
	GUI.DrawTexture(dispRect, border);
	GUI.Label(dispRect, dispText);
}