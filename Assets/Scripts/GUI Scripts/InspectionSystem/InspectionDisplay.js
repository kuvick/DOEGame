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
private var dispWidthScale : float = .8; // width based on box height
private var dispHeight : float;
private var dispHeightScale : float = .5;
private var dispRightOffset : float;
private var dispRightOffsetScale : float = .025;
private var dispTopOffset : float;
private var dispTopOffsetScale : float = .25;
private var fontScale : float = .035;
private var screenMiddle : Vector2;

private var dispPic : Texture2D;
private var dispPicRect : Rect;
private var dispPicSize : float;
private var dispPicSizeScale : float = .1;
private var doDispPic : boolean = false;

private var selectedComponent : InspectionComponent;

function Start () 
{
	screenMiddle = Vector2(Screen.width, Screen.height) / 2.0;
	dispHeight = Screen.height * dispHeightScale;
	dispWidth = dispHeight * dispWidthScale;
	dispRightOffset = dispRightOffsetScale * Screen.width;
	dispTopOffset = dispTopOffsetScale * Screen.height;
	dispRect = Rect(Screen.width - dispWidth - dispRightOffset,dispTopOffset,dispWidth,dispHeight);
	borderOffset = Screen.height * borderOffsetScale;
	borderRect = Rect(Screen.width - dispWidth - dispRightOffset,dispTopOffset - borderOffset,dispWidth,dispHeight + borderOffset * 2);
	dispPicSize = Screen.width * dispPicSizeScale;
	dispPicRect = Rect(dispRect.x - dispPicSize, dispTopOffset, dispPicSize, dispPicSize);
	skin.label.fontSize = fontScale * Screen.height;
	skin.label.fontStyle = FontStyle.Bold;
	skin.button.normal.background = border;
	skin.button.active.background = border;
	skin.button.hover.background = border;
	skin.button.wordWrap = true;
}

function Update () 
{
	/*if (componentSelected && Input.GetMouseButtonDown(0))
	{
		componentSelected = false;
		if (selectedComponent)
			selectedComponent.SetSelected(false);
		selectedComponent = null;
		doDispPic = false;
	}*/
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

public function Activate(pic : Texture2D, disp : String)
{
	doDispPic = true;
	dispPic = pic;
	Activate(disp);
}

public function Activate(disp : String, selected : InspectionComponent)
{
	selectedComponent = selected;
	selectedComponent.SetSelected(true);
	Activate(disp);
}

public function Activate(pic : Texture2D, disp : String, selected : InspectionComponent)
{
	selectedComponent = selected;
	selectedComponent.SetSelected(true);
	Activate(pic, disp);
}

// calculates and sets the proper rectangle height and centers it on the screen
private function FormatDisplay()
{
	/*dispHeight = skin.label.CalcHeight(GUIContent(dispText), dispWidth);
	dispRect.height = dispHeight;
	borderRect.height = dispHeight + borderOffset * 2;*/
	//dispRect.y = screenMiddle.y - (dispHeight / 2.0);
}

private function Render()
{
	GUI.skin = skin;
	
	GUI.Box(dispRect, String.Empty);
	//GUI.DrawTexture(borderRect, border);
	//GUI.Label(dispRect, dispText);
	if(componentSelected && GUI.Button(dispRect, dispText))
	{
		componentSelected = false;
		if (selectedComponent)
			selectedComponent.SetSelected(false);
		selectedComponent = null;
		doDispPic = false;
	}
	
	if (doDispPic)
		GUI.DrawTexture(dispPicRect, dispPic);
}

// class to define a tooltip turn trigger
public class TurnTrigger
{
	public var turn : int;
	public var dispText : String;
	public var dispPic : Texture2D;
}