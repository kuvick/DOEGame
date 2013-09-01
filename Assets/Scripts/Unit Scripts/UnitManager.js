/*
UnitManager.js
By Derrick Huey
*/
#pragma strict

private static var unitList : List.<Unit> = new List.<Unit>();
public var upgradeTextures : Texture[];

function Start () {
	InitiateUnits();
}

function Awake()
{
	unitList.Clear();
}

function Update () {

}

function GetUpgradeIcon (i : int) : Texture
{
	return upgradeTextures[i];
}

static function AddUnit (temp : Unit) {
	unitList.Add(temp);
}

static function InitiateUnits() {
	for (var i : int = 0; i < unitList.Count; i++)
	{
		unitList[i].Initiate();
	}
}

static function DoUnitActions () {
	for (var i:int = 0; i < unitList.Count; i++)
	{
		unitList[i].DoAction();
	}
	CheckUnitLocations();
}

static function UndoUnitActions() {
	for (var i:int = 0; i < unitList.Count; i++)
	{
		unitList[i].UndoAction();
	}
	CheckUnitLocations();
}

static function CheckUnitPathsBroken()
{
	for (var i : int = 0; i < unitList.Count; i++)
	{
		unitList[i].CheckPathBroken();
	}
}

static function DeselectUnits()
{
	for (var i : int = 0; i < unitList.Count; i++)
		unitList[i].OnDeselect();
}

static function CheckUnitsActive()
{
	for (var i : int = 0; i < unitList.Count; i++)
		unitList[i].CheckActive();
}

// checks if any units occupy the same building, and if so activates alternating icon fades
static function CheckUnitLocations()
{
	var buildings : List.<BuildingOnGrid> = Database.getBuildingsOnGrid();
	for (var i : int = 0; i < buildings.Count; i++)
	{
		if (buildings[i].units.Count == 1)
			//buildings[i].units[0].DeactivateFade();
			buildings[i].units[0].SetPosition(false);
		else if (buildings[i].units.Count > 1)
			//ActivateUnitFade(buildings[i].units);
			FlipUnitPositions(buildings[i].units);
	}
}

// activates alternating unit icon fades
static function ActivateUnitFade(unitSet : List.<Unit>)
{
	for (var i : int = 0; i < unitSet.Count; i++)
		unitSet[i].ActivateFade(i, unitSet.Count);
}

static function FlipUnitPositions(unitSet : List.<Unit>)
{
	var firstType : UnitType = unitSet[0].type;
	for (var i : int = 1; i < unitSet.Count; i++)
	{
		if (unitSet[i].type != firstType)
			unitSet[i].SetPosition(true);
	}
}