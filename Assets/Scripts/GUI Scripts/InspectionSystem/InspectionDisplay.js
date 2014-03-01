#pragma strict

public var skin : GUISkin;
public var border : Texture2D;

private var componentSelected : boolean = false;

private var dispText : String = String.Empty;
private var dispRect : Rect;
private var dispTopRect : Rect;
private var dispBotRect : Rect;
private var nextRect : Rect;
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
//private var dispRightOffsetScale : float = .025;
private var dispRightOffsetScale : float = .06;
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

public var notificationLength : float = 3f;
private var notificationTimer : float;

//Added GPC 9/3/13
private var intelSys:IntelSystem;

private var inputController : InputController;

//THESE VARIABLES ARE ONLY FOR IF IT IS NOT IN GAME:
public var notInGame:boolean = false;
private var currentTriggerIndex:int = 0;
public var turnTriggers : TurnTrigger[];
private var tutorialPointers:TutorialPointers;

private var dOS:DisplayOnceSystem;
public var currentToolTipIndex:int = 0;

function Start () 
{
	dOS = new DisplayOnceSystem();
	screenMiddle = Vector2(Screen.width, Screen.height) / 2.0;
	dispHeight = Screen.height * dispHeightScale;
	dispWidth = dispHeight * dispWidthScale;
	dispRightOffset = dispRightOffsetScale * Screen.width;
	dispTopOffset = dispTopOffsetScale * Screen.height;
	dispRect = Rect(Screen.width - dispWidth - dispRightOffset,dispTopOffset,dispWidth,dispHeight);
	dispTopRect = Rect(dispRect.x, dispRect.y, dispRect.width, dispRect.height / 2f);
	dispBotRect = Rect(dispRect.x, dispRect.y + (dispRect.height / 2f), dispRect.width, dispRect.height / 2f);
	nextRect = Rect(dispRect.x, dispBotRect.y + (dispBotRect.height / 2f), dispRect.width, dispBotRect.height / 2f);
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
	skin.box.normal.background = null;
	skin.box.active.background = null;
	skin.box.hover.background = null;
	//Added GPC 9/3/13
	if(GameObject.Find("Database") != null){
		intelSys = GameObject.Find("Database").GetComponent(IntelSystem);
	}
	
	var hexagonGrid:GameObject = GameObject.Find("HexagonGrid");
	if(hexagonGrid != null)
		inputController = hexagonGrid.GetComponent(InputController);

	if(notInGame)
	{
		tutorialPointers = GameObject.Find("GUI System").GetComponent(TutorialPointers);
		CheckTriggerToDisplay();
	}

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
	if (currentTooltip && currentTooltip.type == TooltipType.Notification && Time.time > notificationTimer)
		NextTooltip();
}

function OnGUI()
{
	if(notInGame && componentSelected)
	{
		GUI.depth = -1;
		Render();
	}
	else if(componentSelected)
	{
		GUI.depth = 1;
		Render();
	}
	
	if(notInGame && tutorialPointers != null)
		tutorialPointers.Render();
}

public function Activate (disp : Tooltip, comp : InspectionComponent)
{
	componentSelected = true;
	if (intelSys)
		intelSys.toolTipOnScreen = true;
	disp.SetComponent(comp);
	SoundManager.Instance().playInspectionOpen();
	if (disp.hasPriority || tooltipList.Count < 1)
	{
		tooltipList.Insert(0, disp);
		SetTooltip();
	}
	else
	{
		tooltipList.Add(disp);
		if (currentTooltip.type == TooltipType.Notification)
			NextTooltip();
	}
	/*currentTooltip = tooltipList[0];
	FormatDisplay();*/
}

// This function is needed since with the if statement above,
// when clicking on the objective icons on the HUD, it will only
// display the first notification box until clicked, and then it will
// show all subsquent notifications clikced since. I don't want to break
// The code in other places, thus I have this other chain just for the 
// HUD's Objective Icons.
// See SendToDisplayFromHUD() in InspectionComponent
// and OnSelectedFromHUD() in ObjectiveIcon
// and this line objIconScript.OnSelectedFromHUD(); in MainMenu (at the
// time of writing, it is line 331).
public function ActivateAndDeactivate(disp : Tooltip)
{
	componentSelected = true;
	if (intelSys)
		intelSys.toolTipOnScreen = true;
	SoundManager.Instance().playInspectionOpen();
	if (disp.hasPriority || tooltipList.Count < 1)
	{
		tooltipList.Insert(0, disp);
		SetTooltip();
	}
	else
	{
		tooltipList.Add(disp);
		NextTooltip();
	}
}


public function Activate(disp : String)
{
	componentSelected = true;
	intelSys.toolTipOnScreen = true;
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
	
	GUI.DrawTexture(borderRect, border);
	
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
	if (currentTooltip.GetComponent())
		currentTooltip.GetComponent().SetSelected(false);
	tooltipList.RemoveAt(0);
	if (tooltipList.Count == 0)
	{
		SoundManager.Instance().playInspectionClose();
		componentSelected = false;
		if(intelSys)
			intelSys.toolTipOnScreen = false;
		currentTooltip = null;
		yield WaitForSeconds(0.5);
		if (inputController)
			inputController.SetEnabled(true);
	}
	else
	{
		if (inputController)
			inputController.SetEnabled(true);
		SetTooltip();
	}
}

private function SetTooltip()
{
	currentTooltip = tooltipList[0];
	if (currentTooltip.GetComponent())
		currentTooltip.GetComponent().SetSelected(true);
	if (currentTooltip.type == TooltipType.Notification)
		notificationTimer = Time.time + notificationLength;
	else if (inputController && currentTooltip.type == TooltipType.Alert)
		inputController.SetEnabled(false);
	FormatDisplay();
	
	
	if(currentTooltip.toggleUndoButton || currentTooltip.toggleWaitButton)
		var mainMenu:MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
	if(currentTooltip.toggleUndoButton)
		mainMenu.disableUndoButton = !mainMenu.disableUndoButton;
	if(currentTooltip.toggleWaitButton)
		mainMenu.disableSkipButton = !mainMenu.disableSkipButton;
}

private function RenderSingle()
{
	GUI.Box(dispRect, dispContent);
	if (componentSelected && GUI.Button(nextRect, String.Empty))//GUI.Button(dispRect, dispContent))
	{	
		if(notInGame)
			dOS.HasDisplayed(currentToolTipIndex, false, true);
		else
			dOS.HasDisplayed(currentToolTipIndex, false, false);
		
		currentToolTipIndex++;
		NextTooltip();
	}
}

private function RenderBoth()
{
	GUI.DrawTexture(dispTopRect, currentTooltip.pic);
	GUI.Label(dispBotRect, currentTooltip.text);
	if (componentSelected && GUI.Button(nextRect, String.Empty))//(GUI.Button(dispTopRect, currentTooltip.pic) || GUI.Button(dispBotRect, currentTooltip.text)))
	{
		if(notInGame)
			dOS.HasDisplayed(currentToolTipIndex, false, true);
		else
			dOS.HasDisplayed(currentToolTipIndex, false, false);
			
		currentToolTipIndex++;
		NextTooltip();
	}
}

public function MouseOnDisplay() : boolean
{
	var mousePos:Vector2;
	mousePos.x = Input.mousePosition.x;
	mousePos.y = Screen.height - Input.mousePosition.y;
	if (componentSelected && dispRect.Contains(mousePos))
		return true;
	return false;
}

public function IsActive() : boolean
{
	return componentSelected;
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
	public var type : TooltipType;
	public var text : String;
	public var pic : Texture;
	public var hasPriority : boolean;
	private var inspectedComponent : InspectionComponent;
	
	public var toggleUndoButton : boolean = false;
	public var toggleWaitButton : boolean = false;
	
	public function SetComponent(comp : InspectionComponent)
	{
		inspectedComponent = comp;
	}
	
	public function GetComponent() : InspectionComponent
	{
		return inspectedComponent;
	}
}

public enum TooltipType
{
	Alert, // dismissed after click
	Notification // dismissed automatically after x seconds
}


//CODE TO ALLOW TOOLTIPS TO APPEAR OTHER PLACES THAT AREN'T IN-GAME
// Taken from IntelSystem.js and modified
private function CheckTriggerToDisplay()
{
	if (currentTriggerIndex >= turnTriggers.length)
		return;
	for(currentTriggerIndex = 0;currentTriggerIndex < turnTriggers.length; currentTriggerIndex++)
	{
		if(!notInGame && dOS.WasAlreadyDisplayed(currentToolTipIndex, false, false))
			currentToolTipIndex++;
		else if(notInGame && dOS.WasAlreadyDisplayed(currentToolTipIndex, false, true))
			currentToolTipIndex++;
		else
			Activate(turnTriggers[currentTriggerIndex].tooltip, null);
	}
}

public function FromScoreScreen()
{
	notInGame = true;
	tutorialPointers = GameObject.Find("GUI System").GetComponent(TutorialPointers);
	tutorialPointers.FromScoreScreen(true);
	CheckTriggerToDisplay();
}