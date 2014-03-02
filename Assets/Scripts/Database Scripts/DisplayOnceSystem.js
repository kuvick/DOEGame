#pragma strict
/*
DisplayOnceSystem.js

Created so that tutorial pointers and the inspection display only gets displayed once.

*/
public class DisplayOnceSystem
{

// to use this script, set this to false
// to turn it off, set this to true
private var disableThisSystem: boolean = false;

//Disabled due to errors GPC 1/5/2014
//private var disableThisSystem: boolean = true;

public function DisplayOnceSystem()
{

}

public function DisplayOnceSystem(inGame : boolean)
{
	disableThisSystem = inGame;
}

// Note, this will delete ALL PLAYERPREF KEYS
// This is used to delete all keys when a player is deleted.
public function DeleteKeys()
{
	if(!disableThisSystem)
		PlayerPrefs.DeleteAll();
}

// Creates the string for the asset in order to store it.
// Uses the level name, whether it is a pointer (or a slide), and it's index within the array
public function GetKeyString(index:int, isATutorialPointer:boolean):String
{
	var name : String = "";
	
	if(Application.loadedLevelName == "LoadingScreen")
	{
		if(PlayerPrefs.HasKey(Strings.NextLevel))
			name = PlayerPrefs.GetString(Strings.NextLevel);
	}
	
	if(name == "")
	{
		name = Application.loadedLevelName;
	}
	
	//Debug.Log(name + isATutorialPointer + index);
	
	return name + isATutorialPointer + index;
}

// Creates the string for the asset in order to store it.
// Uses the level name, whether it is a pointer (or a slide), and it's index within the array
public function GetKeyString(index:int, isATutorialPointer:boolean, isOnGUIScreen:boolean):String
{
	var name : String = "";
	
	if(Application.loadedLevelName == "LoadingScreen")
	{
		if(PlayerPrefs.HasKey(Strings.NextLevel))
			name = PlayerPrefs.GetString(Strings.NextLevel);
	}
	
	if(name == "")
	{
		name = Application.loadedLevelName;
	}
	
	//Debug.Log(name + isATutorialPointer + index);
	
	return name + isATutorialPointer + index + isOnGUIScreen;
}

// Returns true if the asset has already been displayed (which means the stored
// value will be 1. Returns false if it is displaying for the first time.
public function WasAlreadyDisplayed(index:int, isATutorialPointer:boolean):boolean
{
	if(!disableThisSystem)
	{
		var name:String = GetKeyString(index, isATutorialPointer);
		
		if(PlayerPrefs.HasKey(name))
			if(PlayerPrefs.GetInt(name) == 1)
				return true;
			else
				return false;
	}
	else
		return false;
}

// Same as the above function, for use if you already know the string.
public function WasAlreadyDisplayed(name:String):boolean
{	
	if(!disableThisSystem)
	{
		if(PlayerPrefs.HasKey(name))
			if(PlayerPrefs.GetInt(name) == 1)
				return true;
			else
				return false;
	}
	else
		return false;
}

// This function notes when a tutorial asset has been seen.
// This function to be used if the key string is known.
public function HasDisplayed(name:String)
{	
	if(!disableThisSystem)
		PlayerPrefs.SetInt(name, 1);
}

// This function is the same as the above, to be used if the
// key string is not known.
public function HasDisplayed(index:int, isATutorialPointer:boolean)
{	
	if(!disableThisSystem)
	{
		var name:String = GetKeyString(index, isATutorialPointer);
		PlayerPrefs.SetInt(name,1);
	}
}

//**************
// Returns true if the asset has already been displayed (which means the stored
// value will be 1. Returns false if it is displaying for the first time.
public function WasAlreadyDisplayed(index:int, isATutorialPointer:boolean, isOnGUIScreen:boolean):boolean
{
	if(!disableThisSystem)
	{
		var name:String = GetKeyString(index, isATutorialPointer, isOnGUIScreen);
		
		if(PlayerPrefs.HasKey(name))
			if(PlayerPrefs.GetInt(name) == 1)
				return true;
			else
				return false;
	}
	else
		return false;
}
// This function is the same as the above, to be used if the
// key string is not known.
public function HasDisplayed(index:int, isATutorialPointer:boolean, isOnGUIScreen:boolean)
{	
	if(!disableThisSystem)
	{
		var name:String = GetKeyString(index, isATutorialPointer, isOnGUIScreen);
		PlayerPrefs.SetInt(name,1);
	}
}



}
