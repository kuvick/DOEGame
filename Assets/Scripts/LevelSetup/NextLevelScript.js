#pragma strict

public var nextLevel : String = "";
private static var exists : boolean = false;

function Awake ()
{
	//If nextLevel string is blank, load LevelSelectScreen scene by default (GPC 10/3/13)
	if(nextLevel == ""){
		nextLevel = "LevelSelectScreen";
	}

	if(!exists)
	{
		DontDestroyOnLoad(this);
		exists = true;
	}
	else
	{	
		Destroy(this.gameObject);
	}
}