/**********************************************************
EditorMenu.js

Description: In-game level editor menu GUIControl

Author: Derrick Huey
**********************************************************/
#pragma strict
import System.Collections.Generic;

enum EditorState
{
	Explore,
	Building,
	Unit,
	Objective
}

public class EditorMenu extends GUIControl
{
	private var currentState : EditorState;
	
	// button rectangles
	private var buildingButton: Rect;
	private var unitButton : Rect;
	private var unitSelection : Rect;
	private var objectiveButton : Rect;
	private var objectiveSelection : Rect;
	private var timerText : Rect;
	private var timerMinus : Rect;
	private var timerPlus : Rect;
	
	private var buttonWidth : float;
	private var buttonHeight : float;
	
	private var unitType : int = 0;
	private var unitStrings : String[] = ["Researcher","Worker"];
	
	private var objectiveTurns : int = 0;
	private var objectiveType : int = 0;
	private var objectiveStrings : String[] = ["Primary","Secondary"];
	
	private var buildingMenuRef : BuildingMenu;
	
	public var unitRef : GameObject[]; // 0 = researcher, 1 = worker
	public var objectiveIcons : Texture2D[]; // 0 = primary, 1 = secondary
	
	public function Start()
	{
		super();
		
		buildingMenuRef = GetComponent(BuildingMenu);
	}
	
	public function Initialize()
	{
		super();
		
		var buttonWidth : float = screenWidth * .15;
		var buttonHeight : float = screenHeight * .1;
		var spacing : float = buttonHeight / 4;
		var topOffset : float = buttonHeight;
		var leftOffset : float = screenWidth - (1.5 * buttonWidth);
		var start : float = buttonHeight;
		
		buildingButton = Rect(leftOffset, start, buttonWidth, buttonHeight);
		start += buttonHeight * 2;
		unitButton = Rect(leftOffset, start, buttonWidth, buttonHeight);
		start += buttonHeight + spacing;
		unitSelection = Rect(leftOffset, start, buttonWidth, buttonHeight / 2);
		start += spacing * 3;
		objectiveButton = Rect(leftOffset, start, buttonWidth, buttonHeight);
		start += buttonHeight + spacing;
		objectiveSelection = Rect(leftOffset, start, buttonWidth, buttonHeight / 2);
		start += spacing * 3;
		timerText = Rect(leftOffset, start, buttonWidth, buttonHeight / 2);
		start += spacing * 2;
		timerMinus = Rect(leftOffset, start, buttonWidth / 2, buttonHeight / 2);
		timerPlus = Rect(leftOffset + buttonWidth / 2, start, buttonWidth / 2, buttonHeight / 2);
		
		rectList.Add(buildingButton);
		rectList.Add(unitButton);
		rectList.Add(objectiveButton);
	}
	
	// change editor state based on button pressed
	public function Render()
	{
		if (GUI.Button(buildingButton, "Building"))
			currentState = EditorState.Building;
		if (GUI.Button(unitButton, "Unit"))
			currentState = EditorState.Unit;
		unitType = GUI.SelectionGrid(unitSelection, unitType, unitStrings, 2);
		if (GUI.Button(objectiveButton, "Objective"))
			currentState = EditorState.Objective;
		objectiveType = GUI.SelectionGrid(objectiveSelection, objectiveType, objectiveStrings, 2);
		GUI.Label(timerText, "Turns: " + objectiveTurns);
		if (GUI.Button(timerMinus, "-") && objectiveTurns > 0)
			objectiveTurns--;
		if (GUI.Button(timerPlus, "+"))
			objectiveTurns++;
	}
	
	// called in BuildingInteractionManager on click
	public function DoAction(selectedCoord)
	{
		var selectedBuilding : GameObject = ModeController.getSelectedBuilding();
		var tempObj : GameObject;
		switch (currentState)
		{
			case EditorState.Building:
				// if a building was selected, can't build
				if (selectedBuilding != null)
					return;
				buildingMenuRef.SetEditorSelectedTile(selectedCoord);
				RecieveEvent(EventTypes.BUILDING);
				currentState = EditorState.Explore;
				break;
			case EditorState.Unit:
				if (selectedBuilding == null)
					return;
				tempObj = Instantiate(unitRef[unitType], selectedBuilding.transform.position, Quaternion.identity);
				var tempUnit : Unit;
				if (unitType == 0)
					tempUnit = tempObj.GetComponent(ResearcherUnit);
				else
					tempUnit = tempObj.GetComponent(WorkerUnit);
				tempUnit.Initiate();
				currentState = EditorState.Explore;
				break;
			case EditorState.Objective:
				if (selectedBuilding == null)
					return;
				var objective : EventScript = selectedBuilding.AddComponent(EventScript);
				objective.event = new BuildingEvent();
				objective.event.icon = objectiveIcons[objectiveType];
				objective.event.type = objectiveType;
				objective.event.time = objectiveTurns;
				objective.Initialize();
				/*tempObj = Instantiate(iconRef, selectedBuilding.transform.position, Quaternion.identity);
				tempObj.renderer.material.mainTexture = objectiveIcons[objectiveType];*/
				currentState = EditorState.Explore;
				break;
		}
	}
}