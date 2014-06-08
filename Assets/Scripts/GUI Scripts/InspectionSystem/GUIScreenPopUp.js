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

private var inputController : InputController;

private var currentTriggerIndex:int = 0;
public var turnTriggers : TurnTrigger[];
private var tutorialPointers:TutorialPointers;

private var dOS:DisplayOnceSystem;
public var currentToolTipIndex:int = 0;

private var mainMenu:MainMenu;

private var cameraControlRef : CameraControl;

private var shadowText : ShadowedText;

//public var designerHeightTweak:float = 0;

function Start () 
{
	dOS = new DisplayOnceSystem();
	
	var padding : float = Screen.height * 0.02;
	
	screenMiddle = Vector2(Screen.width, Screen.height) / 2.0;
	dispHeight = Screen.height * dispHeightScale;
	dispWidth = dispHeight * dispWidthScale;
	dispRightOffset = dispRightOffsetScale * Screen.width;
	dispTopOffset = dispTopOffsetScale * Screen.height;
	//FIX THIS!!! GPC 4/19/14
	var templateRect = Rect(Screen.width - dispWidth - dispRightOffset + padding * 2, dispTopOffset, dispWidth - padding * 5, dispHeight);
	dispRect = templateRect;
	//dispRect.y += 100;
	
	//dispTopRect = Rect(dispRect.x, dispRect.y, dispRect.width, dispRect.height / 2f);
	//dispBotRect = Rect(dispRect.x + padding, dispRect.y + (dispRect.height / 2f) + padding, dispRect.width - padding * 2, dispRect.height / 2f);
	dispBotRect = Rect(templateRect.x + padding, templateRect.y + (templateRect.height / 2f) + padding, templateRect.width - padding * 2, templateRect.height / 2f);
	nextRect = Rect(templateRect.x, dispBotRect.y + (dispBotRect.height / 2f), templateRect.width, dispBotRect.height / 2f);
	borderOffset = Screen.height * borderOffsetScale;
	borderRect = Rect(Screen.width - dispWidth - dispRightOffset,dispTopOffset - borderOffset,dispWidth,dispHeight + borderOffset * 2);
	
	dispPicSize = Screen.width * dispPicSizeScale * 2;
	dispPicRect = Rect(dispRect.x - dispPicSize, dispTopOffset, dispPicSize, dispPicSize);
	
	shadowText = new ShadowedText("", Rect(0,0,0,0), false);
	
	var hexagonGrid:GameObject = GameObject.Find("HexagonGrid");
	if(hexagonGrid != null)
		inputController = hexagonGrid.GetComponent(InputController);

	CheckTriggerToDisplay();

}

function Update () 
{
	if(currentTapWait > 0)
		currentTapWait--;
			
	if (currentTooltip && ((currentTooltip.type == TooltipType.Notification && Time.time > notificationTimer) || CheckForInteraction()))
		NextTooltip();
}

function OnGUI()
{
	if(componentSelected)
	{
		GUI.depth = -1;
		Render();
	}
	else if(componentSelected)
	{
		GUI.depth = 1;
		Render();
	}
	
	if(tutorialPointers != null)
		tutorialPointers.Render();
}

public function Activate (disp : Tooltip, comp : InspectionComponent)
{
	componentSelected = true;
	disp.SetComponent(comp);
	SoundManager.Instance().playInspectionOpen();
	if (disp.arrow.icon)
		tutorialPointers.AddPointerToStart(disp.arrow);
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
		
		//Added to allow designer to manually adjust y coordinate for longer descriptions (GPC 4/22/14)
		dispRect.y += currentTooltip.designerHeightTweak;
		//GUI.Label(currentTooltip.text);
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

	if (renderDouble)
		RenderBoth();
	else
		RenderSingle();
}

public function NextTooltip()
{
	if (tooltipList.Count <= 0)
		return;
	if (currentTooltip.GetComponent())
		currentTooltip.GetComponent().SetSelected(false);
	tooltipList.RemoveAt(0);
	if (tooltipList.Count == 0)
	{
		SoundManager.Instance().playInspectionClose();
		componentSelected = false;
		currentTooltip = null;
		yield WaitForSeconds(0.5);
	
	}
	else
	{
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
	if (currentTooltip.cameraTarget)
		cameraControlRef.MoveCameraToPoint(currentTooltip.cameraTarget.transform.position);
	currentTooltip.hasDisplayed = true;
		//Disabled for testing GPC 4/21/14
		//inputController.SetEnabled(false);
	FormatDisplay();
	
	
	/*if(currentTooltip.toggleUndoButton || currentTooltip.toggleWaitButton)
		var mainMenu:MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
	if(currentTooltip.toggleUndoButton)
		mainMenu.disableUndoButton = !mainMenu.disableUndoButton;
	if(currentTooltip.toggleWaitButton)
		mainMenu.disableSkipButton = !mainMenu.disableSkipButton;*/
}

private function RenderSingle()
{
	//GUI.Box(dispRect, dispContent);
	shadowText.Display(currentTooltip.text, dispRect, true);
	if (componentSelected && GUI.Button(nextRect, String.Empty))//GUI.Button(dispRect, dispContent))
	{	
		dOS.HasDisplayed(currentToolTipIndex, false, true);
		
		
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
		dOS.HasDisplayed(currentToolTipIndex, false, true);
			
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

private var tapWait:int = 25;
private var currentTapWait:int = 0;
private function CheckForInteraction() : boolean
{
	if (!currentTooltip)
		return false;
	if(currentTapWait <= 0 && currentTooltip.interaction == Interaction.Tap)
	{
		if(Input.GetKey(KeyCode.Mouse0) || Input.touches.Length > 0)
		{
			currentTapWait = tapWait;
			return true;
		}
		else
			return false;		
	}
	
	return false;
}


//CODE TO ALLOW TOOLTIPS TO APPEAR OTHER PLACES THAT AREN'T IN-GAME
// Taken from IntelSystem.js and modified
private function CheckTriggerToDisplay()
{
	if (currentTriggerIndex >= turnTriggers.length)
		return;
	for(currentTriggerIndex = 0;currentTriggerIndex < turnTriggers.length; currentTriggerIndex++)
	{
		if(dOS.WasAlreadyDisplayed(currentToolTipIndex, false, true))
			currentToolTipIndex++;
		else
			Activate(turnTriggers[currentTriggerIndex].tooltip, null);
	}
}

public function FromScoreScreen()
{
	tutorialPointers = GameObject.Find("GUI System").GetComponent(TutorialPointers);
	tutorialPointers.FromScoreScreen(true);
	CheckTriggerToDisplay();
}