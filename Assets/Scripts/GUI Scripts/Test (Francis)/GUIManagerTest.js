/**********************************************************
GUIManager.js

Description: 

Author: 
**********************************************************/
#pragma strict

// Import
import System.Collections.Generic;

private var mainMenu:MainMenu;
private var pauseMenu:PauseMenu;
private var intelMenu:IntelMenu;

function Start () 
{
	GetGUIComponents();
}

private function GetGUIComponents():void
{
	mainMenu = GetComponent(MainMenu);
	pauseMenu = GetComponent(PauseMenu);
	intelMenu = GetComponent(IntelMenu);
}

function Update() 
{

}

function OnGUI()
{
	mainMenu.Render();
}