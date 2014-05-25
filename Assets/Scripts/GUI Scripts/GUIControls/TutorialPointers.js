/**********************************************************
TutorialPointers.js
Originally By Katharine Uvick

Description: See comments below for use.
**********************************************************/

#pragma strict

public var pointers:List.<TutorialArrow> = new List.<TutorialArrow>();
private var renderList : List.<ArrowRender> = new List.<ArrowRender>();
private var mainMenu:MainMenu;
private var intelSystem:IntelSystem;
//private var inputController:InputController;
private var database:Database;
private var iconSizePercent:float = 0.15;
private var mainCamera:Camera;
private var currentArrow:TutorialArrow;
private var hasPointers:boolean;
private var pointerSpeed:float = 75;
private var textDisplayRect:Rect;
public var style:GUIStyle;
private var linkMade:boolean;
private var tapWait:int = 25;
private var currentTapWait:int = 0;
private var currentColor:Color;
private var flashSpeed:float = 0.01;
private var transitionToClear:boolean = true;
private var arrowNumOrder:int = 0;

private var tutorialCircle:Texture;
private var tutorialCircleRect:Rect;
private var displayCircle:boolean = false;
private var currentCircleSize:float;
private var decreaseAmount: float = 0.025;
private var circleSizeStart:float = 2.0;

private var dOS:DisplayOnceSystem;

private var inspDispRef : InspectionDisplay;

//THESE VARIABLES ARE ONLY FOR IF IT IS NOT IN GAME:
public var notInGame:boolean = false;
private var OnScoreScreen:boolean = false;
private var onMissionSelect:boolean = false;

function Start()
{
	currentColor = Color.white;
	
	tutorialCircle = Resources.Load("tutorialCircle") as Texture;
	
	dOS = new DisplayOnceSystem(!notInGame);
	
	linkMade = false;
	
	if(!notInGame)
	{
		mainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
		intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
		database = GameObject.Find("Database").GetComponent(Database);
		mainCamera = GameObject.Find("Main Camera").GetComponent(Camera);
		inspDispRef = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
	}
		
	if(pointers.Count > 0)
	{
		currentArrow = null;
		checkTrigger();
		hasPointers = true;
		waitingForRelease = false;
		
		textDisplayRect = new Rect(0,Screen.height * 0.1,Screen.width * 0.40, Screen.height);
		textDisplayRect.x = Screen.width / 2 - textDisplayRect.width / 2;
		
		style.fontSize = Screen.width * 0.02;
		
		//inputController = GameObject.Find("HexagonGrid").GetComponent("InputController");
	}
	else
		hasPointers = false;
}

public function Disable()
{
	hasPointers = false;
	pointers.Clear();
}
public function Enable(OnMS:boolean)
{
	hasPointers = true;
	onMissionSelect = OnMS;
}

public function Render()
{
	if(hasPointers)
	{
		if(currentTapWait > 0)
			currentTapWait--;
	
		checkTrigger();
		
		if(currentArrow != null)
		{
			if(currentArrow.interaction == Interaction.Linking)
			{
				var newCurrentPoint:Vector3 = currentArrow.getCurrentPoint();
				
				if(currentArrow.isGoingStartToEnd())
				{
					newCurrentPoint = Vector3.MoveTowards(currentArrow.getCurrentPoint(), currentArrow.getEndPoint(), pointerSpeed * Time.deltaTime);
					if(Vector3.Distance(currentArrow.getCurrentPoint(), currentArrow.getEndPoint()) < currentArrow.getTolerance())
						currentArrow.setGoingStartToEnd(false);
				}
				else
				{
					newCurrentPoint = Vector3.MoveTowards(currentArrow.getCurrentPoint(), currentArrow.getStartPoint(), pointerSpeed * Time.deltaTime);
					if(Vector3.Distance(currentArrow.getCurrentPoint(), currentArrow.getStartPoint()) < currentArrow.getTolerance())
						currentArrow.setGoingStartToEnd(true);
				}
				
				currentArrow.setCurrentPoint(newCurrentPoint);
			}
			else
			{
				if(transitionToClear)
					currentColor.a = currentColor.a - flashSpeed;
				else
					currentColor.a = currentColor.a + flashSpeed;
					
				if(currentColor.a <= 0.5)
					transitionToClear = false;
				else if(currentColor.a >= 1)
					transitionToClear = true;
					
				GUI.color = currentColor;
			}
			
			
			if(currentArrow.interaction == Interaction.SingleBuilding ||
			currentArrow.interaction == Interaction.Linking)
			{
				var newLoc:Rect = convertToScreenRect(currentArrow.getCurrentPoint(), currentArrow.getDisplayRect());
				newLoc.x = newLoc.x - (newLoc.width/2) + (currentArrow.distanceFromBuilding.x * Screen.width);
				newLoc.y = newLoc.y + (newLoc.height/2) + (currentArrow.distanceFromBuilding.y * Screen.height * -1);
				currentArrow.setDisplayRect(newLoc);
			}
			
			GUI.DrawTexture(currentArrow.getDisplayRect(), currentArrow.icon);
			GUI.color = Color.white;
			GUI.Label(textDisplayRect, currentArrow.displayText, style);
			
			if(displayCircle)
			{
				GUI.color.a = 0.5f;
				GUI.DrawTexture(tutorialCircleRect, tutorialCircle);
				GUI.color.a = 1.0f;
				currentCircleSize = currentCircleSize - decreaseAmount;
				
				if(currentCircleSize < decreaseAmount * 2)
					displayCircle = false;
				else
				{
					tutorialCircleRect = createRect(tutorialCircle, 0,0,currentCircleSize);
					tutorialCircleRect.x = (currentArrow.getDisplayRect().x + currentArrow.getDisplayRect().width / 2) - tutorialCircleRect.width / 2;
					tutorialCircleRect.y = (currentArrow.getDisplayRect().y + currentArrow.getDisplayRect().height / 2) - tutorialCircleRect.height / 2;
				}
			}
			
			if(checkForInteraction(currentArrow))
			{
				currentArrow = null;
				waitingForRelease = false;
				dOS.HasDisplayed(arrowNumOrder, true);
				arrowNumOrder++;
			}
			
		}
		
	}//end of hasPointers
}// end of Render

private function RenderArrow(toRender : ArrowRender) : boolean
{
	if(toRender.arrow.interaction == Interaction.Linking)
	{
		var newCurrentPoint:Vector3 = toRender.arrow.getCurrentPoint();
		
		if(toRender.arrow.isGoingStartToEnd())
		{
			newCurrentPoint = Vector3.MoveTowards(toRender.arrow.getCurrentPoint(), toRender.arrow.getEndPoint(), pointerSpeed * Time.deltaTime);
			if(Vector3.Distance(toRender.arrow.getCurrentPoint(), toRender.arrow.getEndPoint()) < toRender.arrow.getTolerance())
				toRender.arrow.setGoingStartToEnd(false);
		}
		else
		{
			newCurrentPoint = Vector3.MoveTowards(toRender.arrow.getCurrentPoint(), toRender.arrow.getStartPoint(), pointerSpeed * Time.deltaTime);
			if(Vector3.Distance(toRender.arrow.getCurrentPoint(), toRender.arrow.getStartPoint()) < toRender.arrow.getTolerance())
				toRender.arrow.setGoingStartToEnd(true);
		}
		
		toRender.arrow.setCurrentPoint(newCurrentPoint);
	}
	else
	{
		if(toRender.transitionToClear)
			currentColor.a = currentColor.a - flashSpeed;
		else
			currentColor.a = currentColor.a + flashSpeed;
			
		if(currentColor.a <= 0.5)
			toRender.transitionToClear = false;
		else if(currentColor.a >= 1)
			toRender.transitionToClear = true;
			
		GUI.color = currentColor;
	}
	
	
	if(toRender.arrow.interaction == Interaction.SingleBuilding ||
	toRender.arrow.interaction == Interaction.Linking)
	{
		var newLoc:Rect = convertToScreenRect(toRender.arrow.getCurrentPoint(), toRender.arrow.getDisplayRect());
		newLoc.x = newLoc.x - (newLoc.width/2) + (toRender.arrow.distanceFromBuilding.x * Screen.width);
		newLoc.y = newLoc.y + (newLoc.height/2) + (toRender.arrow.distanceFromBuilding.y * Screen.height * -1);
		toRender.arrow.setDisplayRect(newLoc);
	}
	
	GUI.DrawTexture(toRender.arrow.getDisplayRect(), toRender.arrow.icon);
	GUI.color = Color.white;
	GUI.Label(textDisplayRect, toRender.arrow.displayText, style);
	
	if(toRender.displayCircle)
	{
		GUI.color.a = 0.5f;
		GUI.DrawTexture(toRender.circleRect, tutorialCircle);
		GUI.color.a = 1.0f;
		toRender.circleSize = toRender.circleSize - decreaseAmount;
		
		if(toRender.circleSize < decreaseAmount * 2)
			toRender.displayCircle = false;
		else
		{
			toRender.circleRect = createRect(tutorialCircle, 0,0,toRender.circleSize);
			toRender.circleRect.x = (toRender.arrow.getDisplayRect().x + toRender.arrow.getDisplayRect().width / 2) - toRender.circleRect.width / 2;
			toRender.circleRect.y = (toRender.arrow.getDisplayRect().y + toRender.arrow.getDisplayRect().height / 2) - toRender.circleRect.height / 2;
		}
	}
	
	if(checkForInteraction(toRender.arrow))
	{
		waitingForRelease = false;
		dOS.HasDisplayed(arrowNumOrder, true);
		arrowNumOrder++;
		
		return true;
	}
	return false;
}

public function AddPointerToStart(pointer : TutorialArrow)
{
	pointers.Insert(0, pointer);
	checkTrigger();
}

public function TriggerIsActive() : boolean
{
	return currentArrow != null;
}

public function GetCurrentArrow() : TutorialArrow
{
	return currentArrow;
}

public class TutorialArrow
{
	public var icon:Texture;
	public var interaction: Interaction;
	public var trigger: StartTrigger;
	public var displayText:String;
	
	// There necessity depends on
	// what is set for interaction
	// and trigger.
	public var buildingOne: GameObject;	//used for both if it is the start trigger and for the interaction
	public var buildingTwo: GameObject;
	public var distanceFromBuilding:Vector2;
	public var xyPercent: Vector2;	// since a screen doesn't stay a consistant size, this is for the percent location for the x and y compared to screen width.
	public var turn:int;
	
	// do not fill these out, it will calculate this
	private var startPoint:Vector3;
	private var endPoint:Vector3;
	private var currentPoint:Vector3;
	private var startToEnd:boolean;
	private var tolerance:float;
	private var displayRect:Rect;
	
	//Get
	public function getStartPoint():Vector3
	{
		return startPoint;
	}
	public function getEndPoint():Vector3
	{
		return endPoint;
	}
	public function getCurrentPoint():Vector3
	{
		return currentPoint;
	}
	public function isGoingStartToEnd():boolean
	{
		return startToEnd;
	}
	public function getTolerance():float
	{
		return tolerance;
	}
	public function getDisplayRect():Rect
	{
		return displayRect;
	}

	//Set
	public function setStartPoint(point:Vector3)
	{
		startPoint = point;
	}
	public function setEndPoint(point:Vector3)
	{
		endPoint = point;
	}
	public function setCurrentPoint(point:Vector3)
	{
		currentPoint = point;
	}
	public function setGoingStartToEnd(bool:boolean)
	{
		startToEnd = bool;
	}
	public function setTolerance(tol:float)
	{
		tolerance = tol;
	}
	public function setDisplayRect(rect:Rect)
	{
		displayRect = rect;
	}
		

}


public function CalculateDisplay(arrow:TutorialArrow):TutorialArrow
{
	arrow.setTolerance(5);
	arrow.setGoingStartToEnd(true);

	//location for pointer is in environment
	if(arrow.interaction == Interaction.SingleBuilding || arrow.interaction == Interaction.Linking)
	{
		//var tempRect : Rect = convertToScreenRect(arrow.buildingOne.transform.position + arrow.distanceFromBuilding, mainMenu.createRect(arrow.icon, 0,0,iconSizePercent,false));
		var tempRect : Rect = convertToScreenRect(arrow.buildingOne.transform.position, createRect(arrow.icon, 0,0,iconSizePercent));
		
		//arrow.setStartPoint(arrow.buildingOne.transform.position + arrow.distanceFromBuilding);
		//arrow.setCurrentPoint(arrow.buildingOne.transform.position + arrow.distanceFromBuilding);
		
		arrow.setStartPoint(arrow.buildingOne.transform.position);
		arrow.setCurrentPoint(arrow.buildingOne.transform.position);
		
		/*		
		if(arrow.interaction == Interaction.Linking)
			arrow.setEndPoint(arrow.buildingTwo.transform.position + arrow.distanceFromBuilding);
		else
			arrow.setEndPoint(arrow.buildingOne.transform.position + arrow.distanceFromBuilding);
		*/
		
		if(arrow.interaction == Interaction.Linking)
			arrow.setEndPoint(arrow.buildingTwo.transform.position);
		else
			arrow.setEndPoint(arrow.buildingOne.transform.position);
				
		arrow.setDisplayRect(tempRect);
	}
	
	//location for pointer is on GUI; doesn't need a start/end/current point
	else
	{
		arrow.setDisplayRect(createRect(arrow.icon, arrow.xyPercent.x, arrow.xyPercent.y,iconSizePercent));
	}
	
	return arrow;
}

public function convertToScreenRect(pos:Vector3, displayRect:Rect):Rect
{
	var point:Vector3 = mainCamera.WorldToScreenPoint(pos);
	displayRect.x = point.x - (displayRect.width / 2);
	displayRect.y = (Screen.height - point.y) - displayRect.height;
	return displayRect;
}

private function PopulateRenderList()
{
	if(pointers.Count > 0 && dOS.WasAlreadyDisplayed(arrowNumOrder, true))
	{
		currentArrow = null;
		pointers.Remove(pointers[0]);
		arrowNumOrder++;
	}
	else
	{
		for (var i : int = 0; i < pointers.Count; i++)
		{
			if (!CheckTrigger(pointers[i]))
				break;
		}
	}
}

private function CheckTrigger(toCheck : TutorialArrow) : boolean
{
	return false;
}

public function checkTrigger()
{
	var makeChange:boolean = false;
	
	if(!onMissionSelect && pointers.Count > 0 && dOS.WasAlreadyDisplayed(arrowNumOrder, true))
	{
		currentArrow = null;
		pointers.Remove(pointers[0]);
		arrowNumOrder++;
	}
	else
	{
		if(pointers.Count > 0)
		{
			// only set one to the current arrow, else
			// it will override the others
			if(pointers[0].trigger == StartTrigger.StartOfLevel)
			{
				makeChange = true;
			}
			else if(pointers[0].trigger == StartTrigger.ReachBuilding)
			{
				if(database.buildingsOnGrid != null && database.buildingsOnGrid.Count > 0)
					makeChange = database.isActive(pointers[0].buildingOne);
			}
			else if(pointers[0].trigger == StartTrigger.Turn)
			{
				if(intelSystem.currentTurn == pointers[0].turn)
					makeChange = true;
			}
			else if(pointers[0].trigger == StartTrigger.AfterPreviousArrow)
			{
				// if the current arrow is set to null, then the previous
				// one has expired
				if(currentArrow == null)
					makeChange = true;
			}
			else if(OnScoreScreen && pointers[0].trigger == StartTrigger.OnScoreScreen)
			{
				if(currentArrow == null)
					makeChange = true;
			}
			else if(pointers[0].trigger == StartTrigger.OnBuildingMenu && GUIManager.Instance().GetCurrentResponse().type == EventTypes.BUILDING)
			{
				if(currentArrow == null)
					makeChange = true;
			}
			if(makeChange)
			{
				currentArrow = pointers[0];
				currentArrow = CalculateDisplay(currentArrow);
				pointers.Remove(pointers[0]);
				//inspDispRef.NextTooltip();
				
				displayCircle = true;
				currentCircleSize = circleSizeStart;
				tutorialCircleRect = createRect(tutorialCircle, 0,0,currentCircleSize);
				tutorialCircleRect.x = (currentArrow.getDisplayRect().x + currentArrow.getDisplayRect().width / 2) - tutorialCircleRect.width / 2;
				tutorialCircleRect.y = (currentArrow.getDisplayRect().y + currentArrow.getDisplayRect().height / 2) - tutorialCircleRect.height / 2;
				
				if(currentArrow.interaction == Interaction.Linking)
				{
					var db : Database = GameObject.Find("Database").GetComponent(Database);
					db.isWaitingForLink = true;
					displayCircle = false;
				}
			}
		}
	}
}

private var waitingForRelease:boolean;
public function checkForInteraction(arrow:TutorialArrow):boolean
{
	if(currentTapWait <= 0 && arrow.interaction == Interaction.Tap)
	{
		if(Input.GetKey(KeyCode.Mouse0) || Input.touches.Length > 0)
		{
			currentTapWait = tapWait;
			return true;
		}
		else
			return false;		
	}
	else if(arrow.interaction == Interaction.SingleBuilding)
	{
		if(ModeController.selectedBuilding == arrow.buildingOne)
			return true;
		else
			return false;
	}
	else if(arrow.interaction == Interaction.Linking)
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
	else if(arrow.interaction == Interaction.Undo)
	{
		if(mainMenu.GiveResponse().type == EventTypes.UNDO)
			return true;
		else
			return false;
	}
	else if(arrow.interaction == Interaction.Wait)
	{
		if(mainMenu.GiveResponse().type == EventTypes.WAIT)
			return true;
		else
			return false;
	}
	else if(arrow.interaction == Interaction.Pause)
	{
		if(mainMenu.GiveResponse().type == EventTypes.PAUSE)
			return true;
		else
			return false;
	}
	
	return false;
}


//Altered GPC 2/20/14
public function checkForLink(b1 : GameObject, b2 : GameObject)
//public function checkForLink()
{
	if(currentArrow == null)
		return;
		
	if(currentArrow.buildingOne == b1 || currentArrow.buildingTwo == b1)
	{
		if(currentArrow.buildingOne == b2 || currentArrow.buildingTwo == b2)
			linkMade = true;
	}
	//If code has reached here, then a link has been made
	//Altered GPC 2/20/14

	//linkMade = true;
	
}

// for units
public function checkForLink()
{
	//If code has reached here, then a link has been made
	//Altered GPC 2/20/14

	linkMade = true;
	
}

public class ArrowRender
{
	var arrow : TutorialArrow;
	var circleRect : Rect;
	var circleSize : float;
	var displayCircle : boolean;
	var transitionToClear : boolean;
	
	public function ArrowRender(setArrow : TutorialArrow, cSize : float)
	{
		arrow = setArrow;
		circleSize = cSize;
	}
}

public enum Interaction
{
	Tap,
	Undo,
	Wait,
	Pause,
	SingleBuilding,
	Linking
}

public enum StartTrigger
{
	StartOfLevel,
	ReachBuilding,
	Turn,
	AfterPreviousArrow,
	OnScoreScreen,
	OnBuildingMenu
}

private function createRect(texture:Texture,xPercent:float,yPercent:float, heightPercentage:float):Rect
{

	var height:float = heightPercentage * Screen.height;
	var textX:float = texture.width;
	var textY:float = texture.height;
	var textRatio:float = textX / textY;
	var width:float = height * textRatio;
	var x:float = Screen.width * xPercent;
	var y:float = Screen.height * yPercent;
	
	return Rect(x, y, width, height);
}

public function FromScoreScreen(bool:boolean)
{
	OnScoreScreen = bool;
}
