/*
Unit.js
By Derrick Huey
*/
#pragma strict

private static var unitList : List.<Unit> = new List.<Unit>();

function Start () {

}

function Update () {

}

static function AddUnit (temp : Unit) {
	unitList.Add(temp);
	Debug.Log("Unit added");
}

static function InitiateUnits() {
	Debug.Log("Initiating units");
	for (var temp : Unit in unitList)
	{
		temp.Initiate();
	}
}

static function DoUnitActions () {
	for (var i:int = 0; i < unitList.Count; i++)
	{
		unitList[i].DoAction();
	}
}

static function UndoUnitActions() {
	for (var i:int = 0; i < unitList.Count; i++)
	{
		unitList[i].UndoAction();
	}
}