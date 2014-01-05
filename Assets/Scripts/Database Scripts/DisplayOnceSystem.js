#pragma strict
/*
DisplayOnceSystem.js

Created so that tutorial pointers and the inspection display only gets displayed once.

*/

//Note, this will delete ALL PLAYERPREF KEYS
public function DeleteKeys()
{
	PlayerPrefs.DeleteAll();
}


public function GetKeyString(index:int, isATutorialPointer:boolean):String
{
	return Application.loadedLevelName + isATutorialPointer + index;
}

public function WasAlreadyDisplayed(index:int, isATutorialPointer:boolean):boolean
{
	var name:String = GetKeyString(index, isATutorialPointer);
	
	if(PlayerPrefs.HasKey(name))
		if(PlayerPrefs.GetInt(name) == 1)
			return true;
		else
			return false;
}

public function WasAlreadyDisplayed(name:String):boolean
{	
	if(PlayerPrefs.HasKey(name))
		if(PlayerPrefs.GetInt(name) == 1)
			return true;
		else
			return false;
}

public function HasDisplayed(name:String)
{	
	PlayerPrefs.SetInt(name, 1);
}

public function HasDisplayed(index:int, isATutorialPointer:boolean)
{	
	var name:String = GetKeyString(index, isATutorialPointer);
	PlayerPrefs.SetInt(name,1);
}



