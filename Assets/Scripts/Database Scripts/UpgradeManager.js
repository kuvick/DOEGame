#pragma strict
import System.Collections.Generic;

private var iconSet : List.<UpgradeIcon>[];
private var dummyIconSet : List.<UpgradeIcon>;
private var counterSet : List.<UpgradeCounter>;
private var i : int = 0;
private var j : int = 0;
public var counterTexture : Texture2D;
public var iconTexture : Texture2D;

private var unitManager : UnitManager;

function Start () {
	CreateCounters();
	SetCounterRects();
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
	for (i = 0; i < dummyIconSet.Count; i++)
		dummyIconSet[i].Draw();
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
			counterSet[i].Initialize(events[i].event.upgrade, counterTexture, events[i].event.upgradeText, 
										events[i].event.upgradeTooltipPic);
		}
	}
	
	for (i = 0; i < events.length; i++)
	{
		if (events[i].event.upgrade != UpgradeID.None)
		{
			counterSet[events[i].event.upgrade - 1].Initialize(events[i].event.upgrade, counterTexture, events[i].event.upgradeText,
																events[i].event.upgradeTooltipPic);
			numCounters++;
		}
	}
	
	if (numCounters < counterSet.Count)
	{
		for (i = numCounters; i < counterSet.Count; i++)
		{
			counterSet.RemoveAt(i);
			i--;
		}	
	}
}

private function SetCounterRects()
{
	var topOffsetScale : float = 0.1;
	var topOffset = topOffsetScale * Screen.height;
	var counterWidthScale : float = 0.1;
	var counterWidth : float = Screen.width * counterWidthScale;
	var counterSpacingScale : float = .05;
	var counterSpacing : float = counterSpacingScale * Screen.width;
	
	var totalWidth : float = counterSet.Count * counterWidth + (counterSet.Count - 1) * counterSpacing;
	var left : float = Screen.width / 2 - totalWidth / 2;
	
	for (i = 0; i < counterSet.Count; i++)
	{
		counterSet[i].SetRect(Rect(left, topOffset, counterWidth, topOffset));
		left += counterWidth + counterSpacing;
	}
}

private function CreateIcons()
{
	var buildingDataSet : BuildingData[] = FindObjectsOfType(BuildingData) as BuildingData[];
	iconSet = new List.<UpgradeIcon>[counterSet.Count];
	dummyIconSet = new List.<UpgradeIcon>();
	for (i = 0; i < iconSet.length; i++)
		iconSet[i] = new List.<UpgradeIcon>();
	for (i = 0; i < buildingDataSet.length; i++)
	{
		if (buildingDataSet[i].buildingData.heldUpgrade != UpgradeID.None)
		{
			var tempData : BuildingOnGridData = buildingDataSet[i].buildingData;
			var tempPlane : GameObject = Instantiate(Resources.Load("IconPlane") as GameObject, tempData.buildingPointer.transform.position, Quaternion.identity);
			var temp : UpgradeIcon = tempPlane.AddComponent(UpgradeIcon);
			temp.Initialize(tempData.buildingPointer, tempData.heldUpgrade, iconTexture, tempData.heldUpgradeTooltipText, 
							tempData.heldUpgradeTooltipPic);
			if (tempData.heldUpgrade == UpgradeID.Dummy)
				dummyIconSet.Add(temp);
			else
			{
				iconSet[buildingDataSet[i].buildingData.heldUpgrade - 1].Add(temp);
				counterSet[buildingDataSet[i].buildingData.heldUpgrade - 1].IncrementTotal();
			}
		}
	}
}

private function FindUpgradeIconByBuilding(building : GameObject, id : UpgradeID) : UpgradeIcon
{
	if (id != UpgradeID.Dummy)
	{
		for (i = 0; i < iconSet[id - 1].Count; i++)
		{
			if (iconSet[id - 1][i].BuildingEquals(building))
				return iconSet[id - 1][i];
		}
	}
	else
	{
		for (i = 0; i < dummyIconSet.Count; i++)
		{
			if (dummyIconSet[i].BuildingEquals(building))
				return dummyIconSet[i];
		}
	}
	return null;
}

public function PickupUpgrade(building : GameObject, id : UpgradeID)
{
	var temp : UpgradeIcon = FindUpgradeIconByBuilding(building, id);
	if (temp)
	{
		temp.SetActive(false);
		if (id != UpgradeID.Dummy)
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
	if (id == UpgradeID.None)
		return false;
	return counterSet[id - 1].CheckIsComplete();
}

public class Upgrade extends System.ValueType
{
	var id : UpgradeID;
	var displayText : String;
}