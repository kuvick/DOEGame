#pragma strict

public var nextLevel : String;
private static var exists : boolean = false;

function Awake ()
{
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