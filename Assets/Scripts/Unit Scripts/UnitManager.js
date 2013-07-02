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
	Debug.Log("Unit added");
}

static function InitiateUnits() {
	Debug.Log("Initiating units " + unitList.Count);
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
			buildings[i].units[0].DeactivateFade();
		else
			ActivateUnitFade(buildings[i].units);
	}
}

// activates alternating unit icon fades
static function ActivateUnitFade(unitSet : List.<Unit>)
{
	for (var i : int = 0; i < unitSet.Count; i++)
		unitSet[i].ActivateFade(i, unitSet.Count);
}