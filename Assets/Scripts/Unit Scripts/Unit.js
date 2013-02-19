/*
Unit.js
By Derrick Huey
*/
#pragma strict
import System.Collections.Generic;

protected var currentBuilding : BuildingOnGrid;
protected var currentBuildingIndex : int;
protected var previousBuilding : BuildingOnGrid;
protected var targetBuilding : BuildingOnGrid;
protected var targetBuildingIndex : int;
protected var foundPath : List.<BuildingOnGrid> = new List.<BuildingOnGrid>();
protected var buildingPathIndices : int[];
protected var foundPathIndex : int = 0;

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
	UnitManager.AddUnit(this);
}

function Initiate() {
	var buildingCoord : Vector3 = gameObject.transform.position;
	buildingCoord.y = 0;
	currentBuilding = Database.getBuildingOnGrid (buildingCoord);
	Debug.Log("Building is: " + currentBuilding.buildingName);
}

// sees if there is a valid path between the unit's current building and the target building
// uses a modified breadth-first search that uses distance from the target as a weight when necessary
function FindPath (target : BuildingOnGrid) : boolean {
	if (!Database.isActive(Database.findBuildingIndex(target)))
		return false;
	if (target == null)
		return false;
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
	//SetLinkColors();
	ClearAllPathVars ();
	return found;
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
	for (var i:int = 0; i < bUnit.linkedTo.length; i++)
	{
		temp = Database.getBuildingOnGridAtIndex(bUnit.linkedTo[i]);
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

private function SetLinkColors() {
	for (var temp : BuildingOnGrid in foundPath)
	{
		DrawLinks.SetLinkColor(Database.findBuildingIndex(temp), Database.findBuildingIndex(temp.pathParent), Color.red);
	}
}

function SetTarget (targ : BuildingOnGrid) {
	targetBuilding = targ;
}

function DoAction () {
	if (foundPath.Count < 1) return;
	previousBuilding = currentBuilding;
	currentBuilding = foundPath[0];
	foundPath.RemoveAt(0);
	//DrawLinks.SetLinkColor(Database.findBuildingIndex(currentBuilding), Database.findBuildingIndex(previousBuilding), Color.blue);
	var tileCoord : Vector3 = currentBuilding.coordinate;
	var worldCoord : Vector3 = HexagonGrid.TileToWorldCoordinates(tileCoord.x, tileCoord.y);
	/*worldCoord.x += HexagonGrid.tileWidth / 2;
	worldCoord.y = 50;
	worldCoord.z += HexagonGrid.tileWidth / 2;*/
	worldCoord += unitOffset;
	gameObject.transform.position = worldCoord;
	Debug.Log("Unit moved to " + currentBuilding.buildingName);
	//gameObject.transform.position = currentBuilding.position;
}

function UndoAction () {

}

function Update() {
	mousePos = Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
	
	//mouseOverGUI = false;
	selectedBuilding = ModeController.getSelectedBuilding();
	
	if (isSelected && selectedBuilding != null && selectedBuilding != currentBuilding.buildingPointer)
	{
		var selectedGridBuilding = Database.getBuildingOnGrid(selectedBuilding.transform.position);
		if (FindPath(selectedGridBuilding))
			Debug.Log("Path found");
		else
			Debug.Log("Path not found");
		isSelected = false;
	}
}

// draw Unit movement selection button on current building
function OnGUI() {
	if (selectedBuilding == currentBuilding.buildingPointer)
	{
		var point : Vector3 = Camera.main.WorldToScreenPoint(currentBuilding.buildingPointer.transform.position);
			
		point.y = Screen.height - point.y; //adjust height point
			
		if(point.y < 0) //Adjust y value of button for screen space
			point.y -= Screen.height;
			
		var unitRect:Rect = Rect(point.x + unitButtonOffset.x, 
							point.y + unitButtonOffset.y, unitButtonWidth, unitButtonHeight);
	
		GUILayout.BeginArea(unitRect);
		GUILayout.Button("U");
		if(mousePos.x >= unitRect.x && mousePos.x <= unitRect.x + unitRect.width &&
			mousePos.y >= unitRect.y && mousePos.y <= unitRect.y + unitRect.height)
		{
			mouseOverGUI = true;
					
			if(Input.GetMouseButtonDown(0))
			{
				isSelected = true;
				Debug.Log("Unit selected");
			}
		}
		else mouseOverGUI = false;
		GUILayout.EndArea();
	}
}

