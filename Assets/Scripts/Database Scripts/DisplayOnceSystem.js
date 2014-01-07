#pragma strict
/*
DisplayOnceSystem.js

Created so that tutorial pointers and the inspection display only gets displayed once.

*/


// to use this script, set this to false
// to turn it off, set this to true
private var disableThisSystem: boolean = false;

//Disabled due to errors GPC 1/5/2014
//private var disableThisSystem: boolean = true;

//Note, this will delete ALL PLAYERPREF KEYS
public function DeleteKeys()
{
	if(!disableThisSystem)
		PlayerPrefs.DeleteAll();
}


public function GetKeyString(index:int, isATutorialPointer:boolean):String
{
	return Application.loadedLevelName + isATutorialPointer + index;
}

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

public function HasDisplayed(name:String)
{	
	if(!disableThisSystem)
		PlayerPrefs.SetInt(name, 1);
}

public function HasDisplayed(index:int, isATutorialPointer:boolean)
{	
	if(!disableThisSystem)
	{
		var name:String = GetKeyString(index, isATutorialPointer);
		PlayerPrefs.SetInt(name,1);
	}
}



