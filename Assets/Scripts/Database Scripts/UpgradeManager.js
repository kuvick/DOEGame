#pragma strict
import System.Collections.Generic;

private var iconSet : List.<UpgradeIcon>[];
private var counterSet : List.<UpgradeCounter>;
private var i : int = 0;
private var j : int = 0;

private var unitManager : UnitManager;

function Start () {
	CreateCounters();
	CreateIcons();
}

function Update () {
	for (i = 0; i < counterSet.Count; i++)
		counterSet[i].Update();
		
	for (i = 0; i < iconSet.length; i++)
	{
		for (j = 0; j < iconSet[i].Count; j++)
			iconSet[i][j].Update();
	}
}

function OnGUI()
{
	for (i = 0; i < counterSet.Count; i++)
		counterSet[i].Draw();
		
	for (i = 0; i < iconSet.length; i++)
	{
		for (j = 0; j < iconSet[i].Count; j++)
			iconSet[i][j].Draw();
	}
}

private function CreateCounters()
{
	var events : EventScript[] = FindObjectsOfType(EventScript) as EventScript[];
	var numCounters : int = 0;
	
	counterSet = new List.<UpgradeCounter>();
	
	for (i = 0; i < events.length; i++)
	{
		counterSet.Add(new UpgradeCounter());
		if (events[i].event.upgrade != UpgradeID.None)
		{
			counterSet[i].Initialize(events[i].event.upgrade, events[i].event.upgradeText);
		}
	}
	
	for (i = 0; i < events.length; i++)
	{
		if (events[i].event.upgrade != UpgradeID.None)
		{
			counterSet[events[i].event.upgrade - 1].Initialize(events[i].event.upgrade, events[i].event.upgradeText);
			numCounters++;
		}
	}
	
	if (numCounters < counterSet.Count)
	{
		for (i = numCounters; i < counterSet.Count; i++)
			counterSet.RemoveAt(i);
		//counterSet.RemoveRange(numCounters, counterSet.Count - numCounters);
	}
}

private function CreateIcons()
{
	var buildingDataSet : BuildingData[] = FindObjectsOfType(BuildingData) as BuildingData[];
	iconSet = new List.<UpgradeIcon>[counterSet.Count];
	for (i = 0; i < iconSet.length; i++)
		iconSet[i] = new List.<UpgradeIcon>();
	for (i = 0; i < buildingDataSet.length; i++)
	{
		if (buildingDataSet[i].buildingData.heldUpgrade != UpgradeID.None)
		{
			var temp : UpgradeIcon = new UpgradeIcon();
			var tempData : BuildingOnGridData = buildingDataSet[i].buildingData;
			temp.Initialize(tempData.buildingPointer, tempData.heldUpgrade, tempData.heldUpgradeText);
			iconSet[buildingDataSet[i].buildingData.heldUpgrade - 1].Add(temp);
			counterSet[buildingDataSet[i].buildingData.heldUpgrade - 1].IncrementTotal();
		}
	}
}

private function FindUpgradeIconByBuilding(building : GameObject, id : UpgradeID) : UpgradeIcon
{
	for (i = 0; i < iconSet[id - 1].Count; i++)
	{
		if (iconSet[id - 1][i].BuildingEquals(building))
			return iconSet[id - 1][i];
	}
	return null;
}

public function PickupUpgrade(building : GameObject, id : UpgradeID)
{
	var temp : UpgradeIcon = FindUpgradeIconByBuilding(building, id);
	if (temp)
	{
		temp.SetActive(false);
		counterSet[id - 1].IncrementObtained();
	}
}

public function ReturnUpgrade(building : GameObject, id : UpgradeID)
{
	var temp : UpgradeIcon = FindUpgradeIconByBuilding(building, id);
	if (temp)
	{
		temp.SetActive(true);
		counterSet[id - 1].DecrementObtained();
	}
}

public function CheckUpgradeComplete (id : UpgradeID) : boolean
{
	return counterSet[id - 1].CheckIsComplete();
}

public class Upgrade extends System.ValueType
{
	var id : UpgradeID;
	var displayText : String;
}