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
	
	// Start Menu events
	RESUME,
	NEWGAME,
	FACEBOOK,
	QUIT,
	
	// Loading events
	DONELOADING,
	
	// Main Menu events
	PAUSE,
	INTEL,
	WAIT,
	UNDO,
	
	// Pause Menu events
	RESTART,
	STARTMENU,
	SAVEQUIT
	
	// Intel Menu events
}

public class GUIEvent
{
	public var type:int = 0;
	public var number:float = 0.0;
	public var text:String = "";
}