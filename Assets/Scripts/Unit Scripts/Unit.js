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

private var open = new List.<BuildingOnGrid>();
private var nextOpen = new List.<BuildingOnGrid>();
private var closed = new List.<BuildingOnGrid>();

private var unitOffset : Vector3 = new Vector3 (HexagonGrid.tileWidth / 2, 50, HexagonGrid.tileWidth / 2);

private var point:Vector3;
private var mouseOverGUI : boolean;
private var unitButtonOffset:Vector2 = new Vector2(-20, -40);	//Used to set position of button relative to building
private var unitButtonWidth = 27;
private var unitButtonHeight = 27;
private var mousePos:Vector2;
private var selectedBuilding:GameObject;
private var isSelected : boolean = false;

function Start () {
	UnitManager.AddUnit(this); // adds unit to the Unit Manager unit list
}

function Initiate() {
	// find and set current building
	var buildingCoord : Vector3 = gameObject.transform.position;
	buildingCoord.y = 0;
	currentBuilding = Database.getBuildingOnGrid (buildingCoord);
	SetPosition();
	Debug.Log("Building is: " + currentBuilding.buildingName);
}

// sees if there is a valid path between the unit's current building and the target building
// uses a modified breadth-first search that uses distance from the target as a weight when necessary
function FindPath (target : BuildingOnGrid) : boolean {
	if (target == null || !BuildingCheck(target)) // Check if building is a valid target
		return false;
		
	// reset pathing variables and lists
	var found : boolean = false;
	foundPath.Clear();
	open.Clear();
	nextOpen.Clear();
	closed.Clear();
	
	var activeLinkedNeighbors;
	var current : BuildingOnGrid = currentBuilding;
	open.Add(current);
	
	while (!closed.Contains(target) && current != target && current != null)
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
	SetLinkColors();
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
private function SetLinkColors() {
	for (var temp : BuildingOnGrid in foundPath)
	{
		DrawLinks.SetLinkColor(Database.findBuildingIndex(temp), Database.findBuildingIndex(temp.pathParent), Color.red);
	}
}

// performs unit actions on new turn
function DoAction () {
	if (foundPath.Count < 1) return;
	previousBuilding = currentBuilding; // set previous building in case of undo
	currentBuilding = foundPath[0]; // set current building to next building in the path
	foundPath.RemoveAt(0);
	DrawLinks.SetLinkColor(Database.findBuildingIndex(currentBuilding), Database.findBuildingIndex(previousBuilding), Color.blue);
	SetPosition(); // move unit to its new position
	currentBuilding.unit = type;
	previousBuilding.unit = UnitType.None;
}

function UndoAction () {

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
	
	// if unit is selected, and a different building has been selected
	if (isSelected && selectedBuilding != null && selectedBuilding != currentBuilding.buildingPointer)
	{
		var selectedGridBuilding = Database.getBuildingOnGrid(selectedBuilding.transform.position);
		// check if a path has been found to the selected building
		if (FindPath(selectedGridBuilding)) // if so, display message indicating so on status marquee
		{
			Debug.Log("Path found");
			StatusMarquee.SetText("Unit target set", true);
		}
		else // if not, display message that a path was not found on status marquee
		{
			Debug.Log("Path not found");
			StatusMarquee.SetText("Invalid unit target", true);
		}
		isSelected = false;
	}
}

function OnGUI() {
	// if the current building is the one that is selected, draw button to select unit for movement
	if (selectedBuilding == currentBuilding.buildingPointer)
	{
		var point : Vector3 = Camera.main.WorldToScreenPoint(currentBuilding.buildingPointer.transform.position);
			
		point.y = Screen.height - point.y; //adjust height point
			
		if(point.y < 0) //Adjust y value of button for screen space
			point.y -= Screen.height;
			
		var unitRect:Rect = Rect(point.x + unitButtonOffset.x, 
							point.y + unitButtonOffset.y, unitButtonWidth, unitButtonHeight);
	
		GUILayout.BeginArea(unitRect);
		if (!currentBuilding.isActive)
			GUI.enabled = false;
		if (GUILayout.Button("U"))
		{
			isSelected = true;
			Debug.Log("Unit selected");
		}
		GUI.enabled = true;
		GUILayout.EndArea();
	}
}

