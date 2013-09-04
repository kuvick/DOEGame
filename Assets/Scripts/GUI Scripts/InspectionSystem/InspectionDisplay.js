#pragma strict

public var skin : GUISkin;
public var border : Texture2D;

private var componentSelected : boolean = false;

private var dispText : String = String.Empty;
private var dispRect : Rect;
private var dispTopRect : Rect;
private var dispBotRect : Rect;
private var borderRect : Rect;
private var borderOffset : float;
private var borderOffsetScale : float = 0.015;
private var dispWidth : float;
//private var dispWidthScale : float = .8; // width based on box height
private var dispWidthScale : float = 1.0; // width based on box height
private var dispHeight : float;
//private var dispHeightScale : float = .5;
private var dispHeightScale : float = .6;

private var dispRightOffset : float;
private var dispRightOffsetScale : float = .025;
private var dispTopOffset : float;

//private var dispTopOffsetScale : float = .25;
private var dispTopOffsetScale : float = .17;
private var fontScale : float = .035;
private var screenMiddle : Vector2;

private var dispPic : Texture2D;
private var dispPicRect : Rect;
private var dispPicSize : float;
private var dispPicSizeScale : float = .1;
private var doDispPic : boolean = false;
private var dispContent : GUIContent;

private var renderDouble : boolean = false;

private var selectedComponent : InspectionComponent;

private var tooltipList : List.<Tooltip> = new List.<Tooltip>();
private var currentTooltip : Tooltip;

//Added GPC 9/3/13
private var intelSys:IntelSystem;

function Start () 
{
	screenMiddle = Vector2(Screen.width, Screen.height) / 2.0;
	dispHeight = Screen.height * dispHeightScale;
	dispWidth = dispHeight * dispWidthScale;
	dispRightOffset = dispRightOffsetScale * Screen.width;
	dispTopOffset = dispTopOffsetScale * Screen.height;
	dispRect = Rect(Screen.width - dispWidth - dispRightOffset,dispTopOffset,dispWidth,dispHeight);
	dispTopRect = Rect(dispRect.x, dispRect.y, dispRect.width, dispRect.height / 2f);
	dispBotRect = Rect(dispRect.x, dispRect.y + (dispRect.height / 2f), dispRect.width, dispRect.height / 2f);
	borderOffset = Screen.height * borderOffsetScale;
	borderRect = Rect(Screen.width - dispWidth - dispRightOffset,dispTopOffset - borderOffset,dispWidth,dispHeight + borderOffset * 2);
	
	dispPicSize = Screen.width * dispPicSizeScale * 2;
	dispPicRect = Rect(dispRect.x - dispPicSize, dispTopOffset, dispPicSize, dispPicSize);
	skin.label.fontSize = fontScale * Screen.height;
	
	
	//Apply Scaling
	
	
	skin.label.fontStyle = FontStyle.Bold;
	skin.button.normal.background = null;
	skin.button.active.background = null;
	skin.button.hover.background = null;
	skin.button.wordWrap = true;
	skin.box.normal.background = border;
	skin.box.active.background = border;
	skin.box.hover.background = border;
	//Added GPC 9/3/13
	intelSys = GameObject.Find("Database").GetComponent(IntelSystem);
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

public function Activate (disp : Tooltip)
{
	componentSelected = true;
	if (disp.hasPriority)
		tooltipList.Insert(0, disp);
	else
		tooltipList.Add(disp);
	FormatDisplay();
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
	currentTooltip = tooltipList[0];
	if (currentTooltip.pic && currentTooltip.text != String.Empty)
	{
		renderDouble = true;
	}
	else if (currentTooltip.pic)
	{
		renderDouble = false;
		dispContent = GUIContent(currentTooltip.pic);
	}
	else
	{
		renderDouble = false;
		dispContent = GUIContent(currentTooltip.text);
	}
	/*dispHeight = skin.label.CalcHeight(GUIContent(dispText), dispWidth);
	dispRect.height = dispHeight;
	borderRect.height = dispHeight + borderOffset * 2;*/
	//dispRect.y = screenMiddle.y - (dispHeight / 2.0);
}

private function Render()
{
	GUI.skin = skin;
	
	GUI.Box(borderRect, String.Empty);
	
	//When the inspection window is pressed while the component is selected (GPC 9/3/13)
	/*if(componentSelected && GUI.Button(dispRect, dispText))
	{
		if(!intelSys.checkTriggers()){
			componentSelected = false;
			if (selectedComponent)
				selectedComponent.SetSelected(false);
			selectedComponent = null;
			doDispPic = false;
		}
	}*/
	
	/*if (doDispPic)
		GUI.DrawTexture(dispPicRect, dispPic);*/
	if (renderDouble)
		RenderBoth();
	else
		RenderSingle();
}

private function NextTooltip()
{
	tooltipList.RemoveAt(0);
	if (tooltipList.Count == 0)
	{
		componentSelected = false;
	}
	else
	{
		FormatDisplay();
	}
}

private function RenderSingle()
{
	if (componentSelected && GUI.Button(dispRect, dispContent))
	{
		NextTooltip();
	}
}

private function RenderBoth()
{
	if (componentSelected && (GUI.Button(dispTopRect, currentTooltip.pic) || GUI.Button(dispBotRect, currentTooltip.text)))
	{
		NextTooltip();
	}
}

// class to define a tooltip turn trigger
public class TurnTrigger
{
	public var turn : int;
	public var tooltip : Tooltip;
	/*public var dispText : String;
	public var dispPic : Texture2D;*/
}

public class Tooltip
{
	public var text : String;
	public var pic : Texture;
	public var hasPriority : boolean;
}