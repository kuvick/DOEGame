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

private var mainMenu:MainMenu;

private var cameraControlRef : CameraControl;

private var shadowText : ShadowedText;

private var isEnabled : boolean;

public static var fromLoading : boolean = false;

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
	//skin.label.fontSize = fontScale * Screen.height * 1.3;
	//skin.box.fontSize = fontScale * Screen.height * 1.3;
	linkMade = false;
	
	shadowText = new ShadowedText("", Rect(0,0,0,0), false);
	
	//Apply Scaling
	

	//skin.label.fontStyle = FontStyle.Bold;
	
	//Do these do anything? GPC 4/19/14
//	skin.button.normal.background = null;
//	skin.button.active.background = null;
//	skin.button.hover.background = null;
//	skin.button.wordWrap = true;
//	skin.box.normal.background = null;
//	skin.box.active.background = null;
//	skin.box.hover.background = null;
	
	//Added GPC 9/3/13
	if(GameObject.Find("Database") != null){
		intelSys = GameObject.Find("Database").GetComponent(IntelSystem);
	}
	
	var hexagonGrid:GameObject = GameObject.Find("HexagonGrid");
	if(hexagonGrid != null)
		inputController = hexagonGrid.GetComponent(InputController);
		
	tutorialPointers = GameObject.Find("GUI System").GetComponent(TutorialPointers);

	if(!notInGame && GameObject.Find("GUI System") != null)
	{
		mainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
		cameraControlRef = GameObject.Find("Main Camera").GetComponent(CameraControl);
		isEnabled = !fromLoading;
		fromLoading = false;
	}
	
	if(notInGame)
	{
		CheckTriggerToDisplay();
		isEnabled = true;
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
	if(currentTapWait > 0)
		currentTapWait--;
			
	if (currentTooltip && ((currentTooltip.type == TooltipType.Notification && Time.time > notificationTimer) || CheckForInteraction()))
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
	else if(notInGame)
		tutorialPointers = GameObject.Find("GUI System").GetComponent(TutorialPointers);
}

public function Activate (disp : Tooltip, comp : InspectionComponent)
{
	componentSelected = true;
	if (intelSys)
		intelSys.toolTipOnScreen = true;
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
		if(intelSys)
			intelSys.toolTipOnScreen = false;
		currentTooltip = null;
		yield WaitForSeconds(0.5);
		
		//Testing GPC 4/21/14
		//if (inputController)
			//inputController.SetEnabled(true);
	}
	else
	{
		//Testing GPC 4/21/14
		//if (inputController)
			//inputController.SetEnabled(true);
		SetTooltip();
	}
}

private function SetTooltip()
{
	var componentType;
	currentTooltip = tooltipList[0];
	if (!notInGame && currentTooltip.hasDisplayed)
	{
		NextTooltip();
		return;
	}
	if (currentTooltip.GetComponent())
	{
		currentTooltip.GetComponent().SetSelected(true);
		componentType = currentTooltip.GetComponent().GetType();
	}
	if (currentTooltip.type == TooltipType.Notification)
		notificationTimer = Time.time + notificationLength;
	else if (inputController && currentTooltip.type == TooltipType.Alert)
	if (currentTooltip.cameraTarget)
		cameraControlRef.MoveCameraToPoint(currentTooltip.cameraTarget.transform.position);
	if (!currentTooltip.GetComponent() || (componentType != typeof(ObjectiveIcon) && componentType != typeof(ObjectiveIndicator)))
		currentTooltip.hasDisplayed = true;
	if (currentTooltip.interaction == Interaction.Linking)
	{
		var db : Database = GameObject.Find("Database").GetComponent(Database);
		db.isWaitingForLink = true;
	}
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
	shadowText.Display(currentTooltip.text, dispRect);
	/*if (componentSelected && GUI.Button(nextRect, String.Empty))//GUI.Button(dispRect, dispContent))
	{	
		if(notInGame)
			dOS.HasDisplayed(currentToolTipIndex, false, true);
		else
			dOS.HasDisplayed(currentToolTipIndex, false, false);
		
		
		currentToolTipIndex++;
		NextTooltip();
	}*/
}

private function RenderBoth()
{
	GUI.DrawTexture(dispTopRect, currentTooltip.pic);
	GUI.Label(dispBotRect, currentTooltip.text);
	/*if (componentSelected && GUI.Button(nextRect, String.Empty))//(GUI.Button(dispTopRect, currentTooltip.pic) || GUI.Button(dispBotRect, currentTooltip.text)))
	{
		if(notInGame)
			dOS.HasDisplayed(currentToolTipIndex, false, true);
		else
			dOS.HasDisplayed(currentToolTipIndex, false, false);
			
		currentToolTipIndex++;
		NextTooltip();
	}*/
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
private var linkMade:boolean;
private function CheckForInteraction() : boolean
{
	if (!isEnabled || !currentTooltip)
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
	else if(currentTooltip.interaction == Interaction.SingleBuilding)
	{
		if(ModeController.selectedBuilding == currentTooltip.arrow.buildingOne)
			return true;
		else
			return false;
	}
	else if(currentTooltip.interaction == Interaction.Linking)
	{
		/*
		if(inputController.GetDragMode() == DragMode.Link)
		{
			waitingForRelease = true;
			return false;
		}
		else if(waitingForRelease)
		{
			if(inputController.getState() != ControlState.Dragging )
				return true;
			else
				return false;
		}
		*/
		if(linkMade)
		{
			var db : Database = GameObject.Find("Database").GetComponent(Database);
			db.isWaitingForLink = false;
			linkMade = false;
			return true;
		}
		else
			return false;
	}
	else if(currentTooltip.interaction == Interaction.Undo)
	{
		if(mainMenu.GiveResponse().type == EventTypes.UNDO)
			return true;
		else
			return false;
	}
	else if(currentTooltip.interaction == Interaction.Wait)
	{
		if(mainMenu.GiveResponse().type == EventTypes.WAIT)
			return true;
		else
			return false;
	}
	else if(currentTooltip.interaction == Interaction.Pause)
	{
		if(mainMenu.GiveResponse().type == EventTypes.PAUSE)
			return true;
		else
			return false;
	}
	
	return false;
}

public function checkForLink(buildingA : GameObject, buildingB : GameObject)
{
//	if(currentArrow == null)
//		return;
//		
//	if(currentArrow.buildingOne == b1 || currentArrow.buildingTwo == b1)
//	{
//		if(currentArrow.buildingOne == b2 || currentArrow.buildingTwo == b2)
//			linkMade = true;
//	}
	//If code has reached here, then a link has been made
	//Altered GPC 2/20/14
	if (!currentTooltip)
		return;
	var buildingAFound : boolean = (buildingA == currentTooltip.linkBuildingA) || (buildingA == currentTooltip.linkBuildingB);
	var buildingBFound : boolean = (buildingB == currentTooltip.linkBuildingA) || (buildingB == currentTooltip.linkBuildingB);

	linkMade = buildingAFound && buildingBFound;
}

// for units
public function checkForLink()
{
	linkMade = true;
}

public function SetEnabled (enabled : boolean)
{
	isEnabled = enabled;
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
	
	public var designerHeightTweak:float = 0;
	
	public var cameraTarget : GameObject;
	
	public var interaction : Interaction;
	public var linkBuildingA : GameObject;
	public var linkBuildingB : GameObject;
	public var arrow : TutorialArrow;
	
	@System.NonSerializedAttribute
	public var hasDisplayed : boolean = false;
	
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