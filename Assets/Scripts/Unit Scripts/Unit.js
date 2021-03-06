/*
Unit.js
By Derrick Huey
*/
#pragma strict

import System.Collections.Generic;

protected var currentBuilding : BuildingOnGrid;
private var currentIndex : int = 0; // index in the current building's unit list
protected var previousBuilding : BuildingOnGrid;
protected var currentPath : List.<BuildingOnGrid> = new List.<BuildingOnGrid>();
public var type : UnitType;
protected var actionList : List.<UnitAction> = new List.<UnitAction>();
protected var currentTarget : BuildingOnGrid = null;

protected var intelSystem : IntelSystem;
protected var linkUIRef : LinkUI;

private var open = new List.<BuildingOnGrid>();
private var nextOpen = new List.<BuildingOnGrid>();
private var closed = new List.<BuildingOnGrid>();

/*private var validSpecificTargets = new List.<BuildingOnGrid>();
private var validGeneralTargets = new List.<BuildingOnGrid>();*/
private var validTargets = new List.<BuildingOnGrid>();
private var targetHighlightColor : Color = new Color(0,1,1,.5); // for specific targets (ie optional output for worker)
private var generalHighlightColor : Color = new Color(0,1,0,.5); // for general targets (any active building there is a path to)

private var unitOffset : Vector3 = new Vector3 (HexagonGrid.tileWidth / 2, 75, -50);//HexagonGrid.tileWidth + HexagonGrid.tileWidth / 3, 75, HexagonGrid.tileHalfHeight);//(HexagonGrid.tileWidth / 4 * 3) + 10, 50, 0);//(HexagonGrid.tileWidth / 4) - 10);
private var unitSwappedOffset : Vector3 = Vector3 (-HexagonGrid.tileWidth / 2, 75, -50);//-HexagonGrid.tileWidth + HexagonGrid.tileWidth / 2, 75, HexagonGrid.tileHalfHeight);

private var selectedBuilding:GameObject;
private var isSelected : boolean = false;
private var pathMadeTurn : int;

private var targetIcon : GameObject;
public var targetIconTex : Texture2D;
private var targetOffset : Vector3 = Vector3(HexagonGrid.tileHalfWidth, 50, 0);

private var currentState : UnitState;
public var unitIcons : Texture2D[];

public var unitSkin : GUISkin;

protected var selectionSound : AudioClip;

private var isFading : boolean = false;
private var fadeTimer : float = 0.0;
private var fadeScaler : float = 1.0;
private var fadeCount : float = 0;
private var targetFadeTimer : float = 0.0;
private var targetFadeScaler : float = 1.0;
private var transparentColor : Color = Color(1,1,1,0);
private var solidColor : Color = Color(1,1,1,1);

//Unit movement (added by GPC 11/10)
private var moveSpeed:int = 10;
private var moveTarget:Vector3;
private var moveCommand:boolean = false;

private var inputController: InputController;

private var display : InspectionDisplay;

enum UnitState
{
	Inactive,
	Active,
	Selected,
	InTransit
}

function Start () {
	UnitManager.AddUnit(this); // adds unit to the Unit Manager unit list
	
	// slant icon slightly forward towards the camera
	gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
	
	gameObject.layer = 10;
	
	renderer.material.mainTextureScale = Vector2(-1,-1);
	
	// set-up unit target icon
	targetIcon = Instantiate(Resources.Load("IconPlane") as GameObject, transform.position, Quaternion.identity);
	targetIcon.renderer.material.mainTexture = targetIconTex;
	targetIcon.renderer.enabled = false;
	targetIcon.transform.localScale = Vector3(6,6,6);
	targetIcon.collider.enabled = false;
	targetIcon.layer = 10;
	// slant icon slightly forward towards the camera
	targetIcon.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
	
	//Added -GPC 11/10/13
	//moveTarget = gameObject.transform.position;
}

function Initiate() {
	// find and set current building
	var buildingCoord : Vector3 = gameObject.transform.position;
	buildingCoord.y = 0;
	currentBuilding = Database.getBuildingOnGrid (buildingCoord);
	currentBuilding.units.Add(this);
	currentIndex = currentBuilding.units.Count - 1;
	SetPosition(false);
	//Debug.Log("Building is: " + currentBuilding.buildingName);
	intelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
	linkUIRef = GameObject.Find("Main Camera").GetComponent(LinkUI);
	CheckActive(false);
	inputController = GameObject.Find("HexagonGrid").GetComponent("InputController");
	display = GameObject.Find("GUI System").GetComponent(InspectionDisplay);
	//MoveToTarget(false);
}

// set the unit's current state and change icon to appropriate texture
private function SetState(state : UnitState)
{
	currentState = state;
	renderer.material.mainTexture = unitIcons[state];
}

public function CheckActive(notFirstTurn : boolean)
{
	if (currentBuilding.isActive){
		if (currentState == UnitState.Inactive && notFirstTurn){
			OnActivate();
		}
		SetState(UnitState.Active);
		
	} else
		SetState(UnitState.Inactive);
}

// sees if there is a valid path between the unit's current building and the target building
// uses a modified breadth-first search that uses distance from the target as a weight when necessary
function FindPath (target : BuildingOnGrid, checkValid : boolean) : List.<BuildingOnGrid>//boolean 
{
	var foundPath : List.<BuildingOnGrid> = new List.<BuildingOnGrid>();
	//foundPath.Clear();
	if (target == null || (checkValid && !BuildingCheck(target))) // Check if building is a valid target
		return foundPath;
	
	// reset pathing variables and lists
	var found : boolean = false;
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
	//return found;
	return foundPath;
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
				//nextOpen.Add(temp);
				AddSorted(nextOpen, temp);
			}
		}
	}
}

private function AddSorted(buildingList : List.<BuildingOnGrid>, toAdd : BuildingOnGrid)
{
	for (var i : int = 0; i < buildingList.Count; i++)
	{
		if (toAdd.pathParentDistFromTarg > buildingList[i].pathParentDistFromTarg)
			break;
	}
	if (i == buildingList.Count)
		buildingList.Add(toAdd);
	else
		buildingList.Insert(i+1, toAdd);
}

// returns a list of all active buildings that are linked to the specified building
private function FindActiveLinkedNeighbors (bUnit : BuildingOnGrid) : List.<BuildingOnGrid> {
	var activeLinked : List.<BuildingOnGrid> = new List.<BuildingOnGrid>();
	var temp : BuildingOnGrid;

	for (var i : int = 0; i < bUnit.allInputs.Count; i++)// in bUnit.inputLinkedTo)
	{
		var index : int = bUnit.allInputs[i].linkedTo;
		temp = Database.getBuildingOnGridAtIndex(index);
		if (temp.isActive)
			activeLinked.Add(temp);
	}
	for (i = 0; i < bUnit.allOutputs.Count; i++)// in bUnit.outputLinkedTo)
	{
		index = bUnit.allOutputs[i].linkedTo;
		temp = Database.getBuildingOnGridAtIndex(index);
		if (temp.isActive)
			activeLinked.Add(temp);
	}
	if (bUnit.optOutput.linkedTo >= 0)//ionalOutputAllocated)
	{
		temp = Database.getBuildingOnGridAtIndex(bUnit.optOutput.linkedTo);//ionalOutputLinkedTo);
		if (temp.isActive)
			activeLinked.Add(temp);
	}
	return activeLinked;
}

// sets the appropriate link path parent of a building
private function SetParent (child : BuildingOnGrid, pparent : BuildingOnGrid, targ : BuildingOnGrid) : BuildingOnGrid {
	var tempDist : float = Vector3.Distance(pparent.coordinate, targ.coordinate);
	// change the child's parent if:
	// a) a parent has not yet been set or
	// b) the child's current parent distance from the start is = to the new one and the new parent distance from the target is less than the current parent's or
	// c) the child's current parent distance from start is > the new one
	if (child.pathParentDistFromTarg < 0 || 
		(child.pathParentDistFromStart == pparent.pathParentDistFromStart + 1 && tempDist < child.pathParentDistFromTarg) || 
		child.pathParentDistFromStart > pparent.pathParentDistFromStart + 1)
	{
		child.pathParent = pparent;
		child.pathParentDistFromTarg = tempDist;
		child.pathParentDistFromStart = pparent.pathParentDistFromStart + 1;
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
		l[i].pathParentDistFromTarg = -1;
		l[i].pathParentDistFromStart = 0;
	}
}

// activates icon fading, putting it in the proper order compared to other units
public function ActivateFade (fadeIndex : int, totalUnits : int)
{
	var newFadeCount = 1 - (totalUnits / 2.0);
	if (!isFading || newFadeCount != fadeCount)
	{
		isFading = true;
		fadeTimer = (fadeIndex - 1) * -1;
		if (fadeTimer >= 1) fadeScaler = -1;
		else fadeScaler = 1;
		fadeCount = newFadeCount;
	}
}

public function DeactivateFade ()
{
	isFading = false;
	renderer.material.color = solidColor;
	gameObject.collider.enabled = true;
}

// performs unit actions on new turn
function DoAction () : boolean
{
	if (currentPath.Count < 1) return false;// || !FindPath(currentTarget)) return;
	previousBuilding = currentBuilding; // set previous building in case of undo
	currentBuilding = currentPath[0]; // set current building to next building in the path
	currentPath.RemoveAt(0);
	
	//GPC ONLY DO ACTION AFTER UNIT HAS STOPPED MOVING
	
	//SetPosition(false); // move unit to its new position
	//MoveToTarget(false);
	if (currentPath.Count < 1)
	{
		SetState(UnitState.Active);
		targetIcon.renderer.enabled = false;
		SoundManager.Instance().PlayUnitArrived(this);
	}
	currentBuilding.unit = type;
	previousBuilding.unit = UnitType.None;
	currentBuilding.units.Add(this);
	previousBuilding.units.Remove(this);
	if (type != UnitType.Researcher)
		actionList.Add(new UnitAction(previousBuilding, intelSystem.currentTurn - 1, UpgradeID.None, UpgradeID.None));
	//Debug.Log(actionList.Count);
	
	//Added GPC 2/20/14
	var pointerScript1 : TutorialPointers = GameObject.Find("GUI System").GetComponent(TutorialPointers);
	pointerScript1.checkForLink();
	display.checkForLink();
	return true;
}

function UndoAction () : boolean
{
	if (actionList.Count < 1)
		return false;
	
	// if the current turn is the proper undo turn
	if (intelSystem.currentTurn == actionList[actionList.Count - 1].turn)
	{
		// re-add the current building to the path list and move back to the previous building
		currentBuilding.unit = UnitType.None;
		currentBuilding.units.Remove(this);
		currentPath.Insert(0, currentBuilding);
		previousBuilding = currentBuilding;
		currentBuilding = actionList[actionList.Count - 1].move;
		//SetPosition(false);
		currentBuilding.unit = type;
		currentBuilding.units.Add(this);
		actionList.RemoveAt(actionList.Count - 1); // pop from end of the action list
		CheckPathBroken();
		if (intelSystem.currentTurn == pathMadeTurn)
		{
			currentPath.Clear();
			SetState(UnitState.Active);
			targetIcon.renderer.enabled = false;
		}
		if (currentPath.Count > 0)
			SetState(UnitState.InTransit);
		return true;
	}
	return false;
}

// moves unit to the position of the current building
public function SetPosition(swap : boolean) {
	var tileCoord : Vector3 = currentBuilding.coordinate;
	var worldCoord : Vector3 = HexagonGrid.TileToWorldCoordinates(tileCoord.x, tileCoord.y);
	var usedOffset : Vector3 = swap ? unitSwappedOffset : unitOffset;
	worldCoord += Utils.ConvertToRotated(usedOffset);
	
	//This is what is used to move the unit normally, from point to point; needed to be cut out:
	gameObject.transform.position = worldCoord;
	//Debug.Log("Unit moved to " + currentBuilding.buildingName);
}

// moves unit to the position of the current building
public function MoveToTarget(swap : boolean) {
	var tileCoord : Vector3 = currentBuilding.coordinate;
	var worldCoord : Vector3 = HexagonGrid.TileToWorldCoordinates(tileCoord.x, tileCoord.y);
	var usedOffset : Vector3 = swap ? unitSwappedOffset : unitOffset;
	worldCoord += Utils.ConvertToRotated(usedOffset);
	
	//this.MoveToPoint(worldCoord);
	
	//MAKE A SEPARATE INITIALIZE FUNCTION
	
	moveTarget = worldCoord;
	moveCommand = true;
	//gameObject.transform.position = worldCoord;
	//Debug.Log("Unit moved to " + currentBuilding.buildingName);
}

//private function MoveToPoint(){
//	//gameObject.transform.position = worldCoord;
//	gameObject.transform.position = Vector3.MoveTowards(gameObject.transform.position,worldCoord,moveSpeed);
//}

// set unit's target and place target icon on the building
private function SetTarget(targ : BuildingOnGrid)
{
	currentTarget = targ;
	targetIcon.transform.position = currentTarget.buildingPointer.transform.position;
	targetIcon.transform.position += targetOffset;
	targetIcon.renderer.enabled = true;
}

function Update() {
	selectedBuilding = ModeController.getSelectedBuilding();
	
	// unit icon fade
	if (isFading)
	{
		if (fadeTimer >= 1 || fadeTimer <= fadeCount)
			fadeScaler *= -1;
		if (fadeTimer >= 0)
			renderer.material.color = Color.Lerp(transparentColor, solidColor, fadeTimer);
		gameObject.collider.enabled = fadeTimer > .5; // enable icon for clicking if transparency greater than half
		fadeTimer += Time.smoothDeltaTime * fadeScaler;
	}
	// target icon fade
	targetFadeTimer += Time.smoothDeltaTime * targetFadeScaler;
	if (targetFadeTimer >= 1 || targetFadeTimer <= 0)
		targetFadeScaler *= -1;
	targetIcon.renderer.material.color = Color.Lerp(transparentColor, solidColor, targetFadeTimer);
	
	//Added by GPC 11/10/13
	//Movement
	if((moveTarget != gameObject.transform.position) && moveCommand){
		if(Vector3.Distance(gameObject.transform.position, moveTarget) != 0){
			//gameObject.transform.position = Vector3.MoveTowards(gameObject.transform.position,moveTarget,moveSpeed);
			gameObject.transform.position = Vector3.Lerp(gameObject.transform.position,moveTarget,moveSpeed * Time.deltaTime);
		}else{
			moveCommand = false;
		}
	}
}

// determines which buildings a unit can move to
private function FindValidTargets()
{
	/*validSpecificTargets.Clear();
	validGeneralTargets.Clear();*/
	validTargets.Clear();
	var buildings : List.<BuildingOnGrid> = Database.getBuildingsOnGrid();
	for (var i : int = 0; i < buildings.Count; i++)
	{
		if (buildings[i] == currentBuilding)
			continue;
		if (FindPath(buildings[i], true).Count > 0 || FindPath(buildings[i], false).Count > 0)
			validTargets.Add(buildings[i]);
			//validSpecificTargets.Add(buildings[i]);
		/*else if (FindPath(buildings[i], false).Count > 0)
			validGeneralTargets.Add(buildings[i]);*/
	}
}

// Checks if any links in the current path have been broken, and if so clears it
public function CheckPathBroken()
{
	if (!CheckPathsEqual(FindPath(currentTarget, false), currentPath))
	{
		currentPath.Clear();
	}
}

// compares 2 lists of BuildingOnGrid
private function CheckPathsEqual(pathA : List.<BuildingOnGrid>, pathB : List.<BuildingOnGrid>) : boolean
{
	if (pathA.Count != pathB.Count)
		return false;
	for (var i : int = 0; i < pathA.Count; i++)
	{
		if (pathA[i] != pathB[i])
			return false;
	}
	return true;
}

// getter function for currentBuilding
public function GetCurrentBuilding() : BuildingOnGrid
{
	return currentBuilding;
}

function OnGUI() {
	selectedBuilding = ModeController.getSelectedBuilding();
}

public function OnSelected()
{
	if (currentBuilding.isActive)// && selectedBuilding == currentBuilding.buildingPointer)
	{
		ModeController.setSelectedBuilding(currentBuilding.buildingPointer);
		currentBuilding.unitSelected = true;
		currentBuilding.selectedUnitIndex = currentIndex;
		isSelected = true;
		inputController.selectUnit(true);
		FindValidTargets();

		// highlight applicable buildings
		for (var i : int = 0; i < validTargets.Count; i++)
			validTargets[i].indicator.SetState(IndicatorState.Valid);
		/*
		for (var i : int = 0; i < validGeneralTargets.Count; i++)
			validGeneralTargets[i].highlighter.renderer.material.color = generalHighlightColor;
		for (i = 0; i < validSpecificTargets.Count; i++)
			validSpecificTargets[i].highlighter.renderer.material.color = targetHighlightColor;*/
		SoundManager.Instance().PlayUnitSelected(this);
		SetState(UnitState.Selected);
		UnitManager.SetSelectedUnit(this);
	}
}

public function OnDeselect()
{
	selectedBuilding = ModeController.getSelectedBuilding();
	currentBuilding.unitSelected = false;
	currentBuilding.selectedUnitIndex = -1;
	// if unit is selected, and a different building has been selected, try to path
	if (isSelected && selectedBuilding != null && selectedBuilding != currentBuilding.buildingPointer)// && validTargets.Contains(Database.getBuildingOnGrid(selectedBuilding.transform.position)))//selectedBuilding != currentBuilding.buildingPointer)
	{
		var selectedGridBuilding = Database.getBuildingOnGrid(selectedBuilding.transform.position);
		// check if a path has been found to the selected building
		currentPath = FindPath(selectedGridBuilding, false);
		if (currentPath.Count > 0) // if so, display message indicating so on status marquee
		{
			Debug.Log("Path found");
			//StatusMarquee.SetText("Unit target set", true);
			SetTarget(selectedGridBuilding);//currentTarget = selectedGridBuilding;
			pathMadeTurn = intelSystem.currentTurn;
			Database.UndoStack.Add(UndoType.Wait);
			SetState(UnitState.InTransit);
			intelSystem.addTurn();
			intelSystem.comboSystem.incrementComboCount();
			intelSystem.incrementScore(true, intelSystem.comboSystem.comboScoreBasePoints);
			//ModeController.setSelectedBuilding(null);
			ModeController.setSelectedInputBuilding(null);
			SoundManager.Instance().PlayUnitOrdered(this);
		}
		else // if not, display message that a path was not found on status marquee
		{
			Debug.Log("Path not found");
			//StatusMarquee.SetText("Invalid unit target", true);
		}
	}
	// else simply deselect unit and set the proper icon texture
	else if (isSelected)
	{
		if (currentPath.Count > 0)
			SetState(UnitState.InTransit);
		else
			SetState(UnitState.Active);
	}
	ModeController.setSelectedBuilding(null);
	isSelected = false;
	inputController.selectUnit(false);
	linkUIRef.HighlightTiles(ResourceType.None);
}

protected function OnActivate(){
	//if (intelSystem.currentTurn > 0)
		SoundManager.Instance().PlayUnitActiviated(this);
}

class UnitAction extends System.ValueType
{
    var move : BuildingOnGrid;
    var turn : int;
    var pickedUpUpgrade : UpgradeID;
    var heldUpgrade : UpgradeID;
    
    public function UnitAction (m : BuildingOnGrid, t : int, p : UpgradeID, h : UpgradeID)
    {
        move = m;
        turn = t;
        pickedUpUpgrade = p;
        heldUpgrade = h;
    }
}