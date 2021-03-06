/**********************************************************
GUIEventTypes.js

Description: 

Author: Francis Yuan
**********************************************************/
#pragma strict

public enum EventTypes
{
	// Placeholder event
	NULLEVENT,
	
	// Non-unique events
	MAIN,
	LEVELSELECT,
	BUILDING,
	
	// Start Menu events
	RESUME,
	NEWGAME,
	FACEBOOK,
	QUIT,
	
	// Level Select Events
	
	// Loading events
	DONELOADING,
	
	// Main Menu events
	PAUSE,
	INTEL,
	METRIC,
	WAIT,
	UNDO,
	
	// Pause Menu events
	RESTART,
	STARTMENU,
	SAVEQUIT,
	
	// Intel Menu events
	
	// Building Menu events
	
	// Score Menu events
	SCORESCREEN,
	
	// Failure Menu events
	FAILUREMENU,
	
	// ContacsMenu events
	//CONTACTSMENU,
	//CONTACTINPECTIONMENU,
	
	// CodexMenu
	CODEXMENU,
	
	EDITORMENU,
	
	CLEAR,
	
	GAMECOMPLETE
}

public class GUIEvent
{
	public var type:int = 0;
}