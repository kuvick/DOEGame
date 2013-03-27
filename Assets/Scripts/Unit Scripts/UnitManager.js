/*
UnitManager.js
By Derrick Huey
*/
#pragma strict

private static var unitList : List.<Unit> = new List.<Unit>();
public var upgradeTextures : Texture[];

private var heldUpgradeButtonOffset:Vector2 = new Vector2(-20, -50);	//Used to set position of button relative to building
private var neededUpgradeButtonOffset:Vector2 = new Vector2(10, -50);
private var upgradeButtonWidth = 27;
private var upgradeButtonHeight = 27;

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

function OnGUI ()
{
	var buildings : BuildingOnGrid[] = Database.getBuildingsOnGrid().ToBuiltin(BuildingOnGrid);
	for (var b : BuildingOnGrid in buildings)
	{
		if (b.heldUpgrade != UpgradeType.None)
		{
			var point : Vector3 = Camera.main.WorldToScreenPoint(b.buildingPointer.transform.position);
			
			point.y = Screen.height - point.y; //adjust height point
			
			if(point.y < 0) //Adjust y value of button for screen space
				point.y -= Screen.height;
			
			var heldUpgradeRect:Rect = Rect(point.x + heldUpgradeButtonOffset.x, 
							point.y + heldUpgradeButtonOffset.y, upgradeButtonWidth, upgradeButtonHeight);
	
			GUI.Button(heldUpgradeRect, upgradeTextures[b.heldUpgrade - 1]);
		}
		/*if (b.neededUpgrade != UpgradeType.None)
		{
			point = Camera.main.WorldToScreenPoint(b.buildingPointer.transform.position);
			
			point.y = Screen.height - point.y; //adjust height point
			
			if(point.y < 0) //Adjust y value of button for screen space
				point.y -= Screen.height;
			
			var neededUpgradeRect:Rect = Rect(point.x + neededUpgradeButtonOffset.x, 
							point.y + neededUpgradeButtonOffset.y, upgradeButtonWidth, upgradeButtonHeight);
			GUI.enabled = false;
			GUI.Button(neededUpgradeRect, upgradeTextures[b.neededUpgrade - 1]);
			GUI.enabled = true;
		}*/
	}
}

static function AddUnit (temp : Unit) {
	unitList.Add(temp);
	Debug.Log("Unit added");
}

static function InitiateUnits() {
	Debug.Log("Initiating units " + unitList.Count);
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

static function CheckMouseNotOverGUI() : boolean
{
	for (var u : Unit in unitList)
	{
		if (u.MouseOnGUI())
			return false;
	}
	return true;
}