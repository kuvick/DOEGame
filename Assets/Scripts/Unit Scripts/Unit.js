/*
Unit.js
By Derrick Huey
*/
#pragma strict
import System.Collections.Generic;

protected var currentBuilding : BuildingOnGrid;
protected var previousBuilding : BuildingOnGrid;
protected var foundPath : List.<BuildingOnGrid> = new List.<BuildingOnGrid>();
protected var foundPathIndex : int = 0; // used to keep track of undo actions
protected var type : UnitType;
protected var actionList : List.<UnitAction> = new List.<UnitAction>();
protected var currentTarget : BuildingOnGrid = null;

protected var intelSystem : IntelSystem;

private var open = new List.<BuildingOnGrid>();
private var nextOpen = new List.<BuildingOnGrid>();
private var closed = new List.<BuildingOnGrid>();

private var validTargets = new List.<BuildingOnGrid>();
private var targetHighlightColor : Color = new Color(0,1,1,.5);

private var test : boolean = false;

private var unitOffset : Vector3 = new Vector3 (HexagonGrid.tileWidth / 2, 50, HexagonGrid.tileWidth / 2);

private var point:Vector3;
private var mouseOverGUI : boolean;
private var mousePos:Vector2;
private var selectedBuilding:GameObject;
private var isSelected : boolean = false;
private var pathDrawn : boolean = false;
private var pathDrawnTimer : float;
private var pathDrawnTimerDuration : float = 3.0f;

// Screen width and height
private var screenWidth: float;
private var screenHeight: float;
private var buttonOffset:Vector2 = new Vector2(.75, .5);
private var offsetScale : float = 0.06;
private var smallButtonScale : float = 0.05; // normal resource icon/button size
private var smallButtonSize : float;
private var largeButtonScale : float = 0.10; // resource icon/button size when building selected
private var largeButtonSize : float;
private var guiEnabledColor : Color = new Color(1,1,1,1);
private var guiDisabledColor : Color = new Color(1,1,1,2);

public var unitSkin : GUISkin;

function Start () {
	UnitManager.AddUnit(this); // adds unit to the Unit Manager unit list
	
	// Store window dimensions and calculate padding
	screenWidth = ScreenSettingsManager.instance.screenWidth;
	screenHeight = ScreenSettingsManager.instance.screenHeight;
	
	smallButtonSize = screenHeight * smallButtonScale;
	largeButtonSize = screenHeight * largeButtonScale;
	buttonOffset *= offsetScale * screenHeight;
}

function Initiate() {
	// find and set current building
	var buildingCoord : Vector3 = gameObject.transform.position;
	buildingCoord.y = 0;
	currentBuilding = Database.getBuildingOnGrid (buildingCoord);
	SetPosition();
	Debug.Log("Building is: " + currentBuilding.buildingName);
	intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
}

// sees if there is a valid path between the unit's current building and the target building
// uses a modified breadth-first search that uses distance from the target as a weight when necessary
function FindPath (target : BuildingOnGrid) : boolean 
{
	if (target == null || !BuildingCheck(target)) // Check if building is a valid target
		return false;
	// reset colors of current found path
	if (foundPath.Count > 0)
		SetLinkColors(currentBuilding, foundPath[0], 0, Color.white);
	
	// reset pathing variables and lists
	var found : boolean = false;
	foundPath.Clear();
	open.Clear();
	nextOpen.Clear();
	closed.Clear();
	
	var activeLinkedNeighbors;
	var current : BuildingOnGrid = currentBuilding;
	open.Add(current);
	
	while (!closed.Contains(target) && open.Count > 0 && current != target && current != null)
	{
		PopulateNextOpen(target);
		if (nextOpen.Contains(target))
		{
			current = target;
			continue;
		}
		open.Clear();
		for (var i:int = 0; i < nextOpen.Count; i++)
			open.Add(nextOpen[i]);
		nextOpen.Clear();
	}
	
	if (current == target && target != null)
	{
		foundPath.Add(current);
		while (current.pathParent != null)
		{
			foundPath.Add(current.pathParent);
			current = current.pathParent;
		}
		foundPath.Reverse();
		foundPath.RemoveAt(0);
		found = true;
	}
	
	ClearAllPathVars ();
	return found;
}

// Checks if a building a valid target, overridden by children for specific checks
protected function BuildingCheck (target : BuildingOnGrid)
{
	if (Database.isActive(Database.findBuildingIndex(target)))
		return true;
	return false;
}

private function PopulateNextOpen (targ : BuildingOnGrid) {
	var activeLinkedNeighbors : List.<BuildingOnGrid>;
	for (var i:int = 0; i < open.Count; i++)
	{
		closed.Add(open[i]);
		activeLinkedNeighbors = FindActiveLinkedNeighbors (open[i]);
		for (var j:int = 0; j < activeLinkedNeighbors.Count; j++)
		{
			if (closed.Contains(activeLinkedNeighbors[j]))
				continue;
			var temp:BuildingOnGrid = SetParent(activeLinkedNeighbors[j], open[i], targ);
			if (nextOpen.Contains(activeLinkedNeighbors[j]))
			{
				nextOpen[nextOpen.IndexOf(activeLinkedNeighbors[j])] = temp;
			}
			else
			{
				nextOpen.Add(temp);
			}
		}
	}
}

// returns a list of all active buildings that are linked to the specified building
private function FindActiveLinkedNeighbors (bUnit : BuildingOnGrid) : List.<BuildingOnGrid> {
	var activeLinked : List.<BuildingOnGrid> = new List.<BuildingOnGrid>();
	var temp : BuildingOnGrid;

	for (var i : int in bUnit.inputLinkedTo)
	{
		temp = Database.getBuildingOnGridAtIndex(i);
		if (temp.isActive)
			activeLinked.Add(temp);
	}
	for (var i : int in bUnit.outputLinkedTo)
	{
		temp = Database.getBuildingOnGridAtIndex(i);
		if (temp.isActive)
			activeLinked.Add(temp);
	}
	return activeLinked;
}

// sets the appropriate link path parent of a building
private function SetParent (child : BuildingOnGrid, pparent : BuildingOnGrid, targ : BuildingOnGrid) : BuildingOnGrid {
	var tempDist : float = Vector3.Distance(pparent.coordinate, targ.coordinate);
	if (child.pathParentDist < 0 || tempDist < child.pathParentDist)
	{
		child.pathParent = pparent;
		child.pathParentDist = tempDist;
	}
	return child;
}

// resets the path variables in all buildings checked
private function ClearAllPathVars () {
	ClearListPathVars(open);
	ClearListPathVars(nextOpen);
	ClearListPathVars(closed);
}

// resets the path variables of the given list
private function ClearListPathVars (l : List.<BuildingOnGrid>) {
	var i : int;
	for (i = 0; i < l.Count; i++)
	{
		l[i].pathParent = null;
		l[i].pathParentDist = -1;
	}
}

// changes the color of all links in the found path to red
private function SetLinkColors(col : Color) 
{
	for (var temp : BuildingOnGrid in foundPath)
	{
		DrawLinks.SetLinkColor(Database.findBuildingIndex(temp), Database.findBuildingIndex(temp.pathParent), col);
	}
}

// recursively changes the color of all links in the found path to red
private function SetLinkColors(b1 : BuildingOnGrid, b2: BuildingOnGrid, index : int, col : Color) 
{
	var b1Index : int = Database.findBuildingIndex(b1);
	var b2Index : int = Database.findBuildingIndex(b2);
	if (b1.outputLinkedTo.Contains(b2Index) || b1.inputLinkedTo.Contains(b2Index))
		DrawLinks.SetLinkColor(b1Index, b2Index, col);
	// terminating case: if b2 is the last building in foundPath
	if (foundPath.Count < 1 || b2 == foundPath[foundPath.Count - 1])
		return;
	SetLinkColors(foundPath[index], foundPath[index + 1], index + 1, col);
}

// performs unit actions on new turn
function DoAction () 
{
	if (foundPath.Count < 1 || !FindPath(currentTarget)) return;
	previousBuilding = currentBuilding; // set previous building in case of undo
	currentBuilding = foundPath[0]; // set current building to next building in the path
	foundPath.RemoveAt(0);
	DrawLinks.SetLinkColor(Database.findBuildingIndex(currentBuilding), Database.findBuildingIndex(previousBuilding), true);
	SetPosition(); // move unit to its new position
	currentBuilding.unit = type;
	previousBuilding.unit = UnitType.None;
	if (type != UnitType.Researcher)
		actionList.Add(new UnitAction(previousBuilding, intelSystem.currentTurn - 1, UpgradeType.None, UpgradeType.None));
	Debug.Log(actionList.Count);
}

function UndoAction () 
{
	if (type != UnitType.Researcher)
	{
		foundPath.Clear();
		FindPath(currentTarget);
	}
	
	if (actionList.Count < 1)
		return;
	
	// if the current turn is the proper undo turn
	if (intelSystem.currentTurn == actionList[actionList.Count - 1].turn)
	{
		// re-add the current building to the path list and move back to the previous building
		/*DrawLinks.SetLinkColor(Database.findBuildingIndex(currentBuilding), 
								Database.findBuildingIndex(actionList[actionList.Count - 1].move), Color.red);*/
		currentBuilding.unit = UnitType.None;
		foundPath.Insert(0, currentBuilding);
		currentBuilding = actionList[actionList.Count - 1].move;
		SetPosition();
		currentBuilding.unit = type;
		actionList.RemoveAt(actionList.Count - 1); // pop from end of the action list
	}
}

// moves unit to the position of the current building
private function SetPosition() {
	var tileCoord : Vector3 = currentBuilding.coordinate;
	var worldCoord : Vector3 = HexagonGrid.TileToWorldCoordinates(tileCoord.x, tileCoord.y);
	worldCoord += unitOffset;
	gameObject.transform.position = worldCoord;
	Debug.Log("Unit moved to " + currentBuilding.buildingName);
}

function Update() {
	mousePos = Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
	
	//mouseOverGUI = false;
	selectedBuilding = ModeController.getSelectedBuilding();
	if (currentBuilding.unitSelected && selectedBuilding == null)
		currentBuilding.unitSelected = false;
	// if unit is selected, and a different building has been selected
	else if (currentBuilding.unitSelected && selectedBuilding != null && validTargets.Contains(Database.getBuildingOnGrid(selectedBuilding.transform.position)))//selectedBuilding != currentBuilding.buildingPointer)
	{
		var selectedGridBuilding = Database.getBuildingOnGrid(selectedBuilding.transform.position);
		// check if a path has been found to the selected building
		if (FindPath(selectedGridBuilding)) // if so, display message indicating so on status marquee
		{
			Debug.Log("Path found");
			StatusMarquee.SetText("Unit target set", true);
			if (foundPath.Count > 0)
			{
				SetLinkColors(currentBuilding, foundPath[0], 0, Color.red);
				pathDrawnTimer = Time.time + pathDrawnTimerDuration;
				pathDrawn = true;
			}
			currentTarget = selectedGridBuilding;
		}
		else // if not, display message that a path was not found on status marquee
		{
			Debug.Log("Path not found");
			StatusMarquee.SetText("Invalid unit target", true);
		}
		currentBuilding.unitSelected = false;
	}
}

private function FindValidTargets()
{
	validTargets.Clear();
	var buildings = Database.getBuildingsOnGrid();
	for (var b : BuildingOnGrid in buildings)
	{
		if (b == currentBuilding)
			continue;
		if (FindPath(b))
			validTargets.Add(b);
	}
	foundPath.Clear();
}

function OnGUI() {
	var unitButtonSize : float = smallButtonSize;
	
	var point : Vector3 = Camera.main.WorldToScreenPoint(currentBuilding.buildingPointer.transform.position);
		
	point.y = Screen.height - point.y; //adjust height point
		
	if(point.y < 0) //Adjust y value of button for screen space
		point.y -= Screen.height;
	GUI.enabled = false;	// output buttons unselected buildings are disabled
	GUI.color = guiDisabledColor;	// counteracts inactive button transparency
	
	if (selectedBuilding == currentBuilding.buildingPointer && currentBuilding.isActive)
	{
		GUI.enabled = true;
		GUI.color = guiEnabledColor;
		unitButtonSize = largeButtonSize;
	}
	
	var unitRect:Rect = Rect(point.x + buttonOffset.x, 
						point.y + buttonOffset.y, unitButtonSize, unitButtonSize);
	GUI.skin = unitSkin;
	if (GUI.Button(unitRect, "U"))
	{
		currentBuilding.unitSelected = true;
		FindValidTargets();
		Debug.Log("Unit selected");
	}
	GUI.enabled = true;
	// highlight the unit's path if its current building is selected
	if (selectedBuilding == currentBuilding.buildingPointer)
	{
		if (foundPath.Count > 0 && !pathDrawn)
		{
			SetLinkColors(currentBuilding, foundPath[0], 0, Color.red);
			//pathDrawnTimer = Time.time + pathDrawnTimerDuration;
			pathDrawn = true;
		}
	}
	// if unit's path has been highlighted and a different building is selected, de-highlight the path
	else if(pathDrawn && foundPath.Count > 0 && Time.time > pathDrawnTimer)//selectedBuilding != currentBuilding.buildingPointer)
	{
		SetLinkColors(currentBuilding, foundPath[0], 0, Color.white);
		pathDrawn = false;
	}
	
	if (currentBuilding.unitSelected)
	{
		for (var b : BuildingOnGrid in validTargets)
			(b.highlighter.GetComponentInChildren(Renderer) as Renderer).material.SetColor("_Color", targetHighlightColor);
	}
}

class UnitAction extends System.ValueType
{
    var move : BuildingOnGrid;
    var turn : int;
    var pickedUpUpgrade : UpgradeType;
    var heldUpgrade : UpgradeType;
    
    public function UnitAction (m : BuildingOnGrid, t : int, p : UpgradeType, h : UpgradeType)
    {
        move = m;
        turn = t;
        pickedUpUpgrade = p;
        heldUpgrade = h;
    }
}