#pragma strict

public var skin : GUISkin;
public var border : Texture2D;

private var componentSelected : boolean = false;

private var dispText : String = String.Empty;
private var dispRect : Rect;
private var borderRect : Rect;
private var borderOffset : float;
private var borderOffsetScale : float = 0.015;
private var dispWidth : float;
private var dispWidthScale : float = .25;
private var dispHeight : float = 1;
private var dispRightOffset : float;
private var dispRightOffsetScale : float = .025;
private var dispTopOffset : float;
private var dispTopOffsetScale : float = .2;
private var fontScale : float = .035;
private var screenMiddle : Vector2;

private var selectedComponent : InspectionComponent;

function Start () 
{
	screenMiddle = Vector2(Screen.width, Screen.height) / 2.0;
	dispWidth = Screen.width * dispWidthScale;
	dispRightOffset = dispRightOffsetScale * Screen.width;
	dispTopOffset = dispTopOffsetScale * Screen.height;
	dispRect = Rect(Screen.width - dispWidth - dispRightOffset,dispTopOffset,dispWidth,dispHeight);
	borderOffset = Screen.height * borderOffsetScale;
	borderRect = Rect(Screen.width - dispWidth - dispRightOffset,dispTopOffset - borderOffset,dispWidth,dispHeight + borderOffset * 2);
	skin.label.fontSize = fontScale * Screen.height;
	skin.label.fontStyle = FontStyle.Bold;
}

function Update () 
{
	if (componentSelected && Input.GetMouseButtonDown(0))
	{
		componentSelected = false;
		selectedComponent.SetSelected(false);
		selectedComponent = null;
	}
}

function OnGUI()
{
	if (componentSelected)
		Render();
}

public function Activate(disp : String, selected : InspectionComponent)
{
	componentSelected = true;
	selectedComponent = selected;
	selectedComponent.SetSelected(true);
	dispText = disp;
	FormatDisplay();
}

// calculates and sets the proper rectangle height and centers it on the screen
private function FormatDisplay()
{
	dispHeight = skin.label.CalcHeight(GUIContent(dispText), dispWidth);
	dispRect.height = dispHeight;
	borderRect.height = dispHeight + borderOffset * 2;
	//dispRect.y = screenMiddle.y - (dispHeight / 2.0);
}

private function Render()
{
	GUI.skin = skin;
	
	GUI.Box(dispRect, String.Empty);
	GUI.DrawTexture(borderRect, border);
	GUI.Label(dispRect, dispText);
}