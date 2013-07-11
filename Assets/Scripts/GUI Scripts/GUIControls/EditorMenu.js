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
	private var objectiveButton : Rect;
	
	private var buttonWidth : float;
	private var buttonHeight : float;
	
	private var buildingMenuRef : BuildingMenu;
	
	public var unitRef : GameObject;
	
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
		var spacing : float = buttonHeight * 2;
		var topOffset : float = buttonHeight;
		var leftOffset : float = screenWidth - (1.5 * buttonWidth);
		var start : float = buttonHeight;
		
		buildingButton = Rect(leftOffset, start, buttonWidth, buttonHeight);
		start += spacing;
		unitButton = Rect(leftOffset, start, buttonWidth, buttonHeight);
		start += spacing;
		objectiveButton = Rect(leftOffset, start, buttonWidth, buttonHeight);
		
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
		if (GUI.Button(objectiveButton, "Objective"))
			currentState = EditorState.Objective;
	}
	
	// called in BuildingInteractionManager on click
	public function DoAction(selectedCoord)
	{
		var selectedBuilding : GameObject = ModeController.getSelectedBuilding();
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
				var tempObj : GameObject = Instantiate(unitRef, selectedBuilding.transform.position, Quaternion.identity);
				var tempUnit : ResearcherUnit = tempObj.GetComponent(ResearcherUnit);
				tempUnit.Initiate();
				currentState = EditorState.Explore;
				break;
			case EditorState.Objective:
				if (selectedBuilding == null)
					return;
				var objective : EventScript = selectedBuilding.AddComponent(EventScript);
				currentState = EditorState.Explore;
				break;
		}
	}
}