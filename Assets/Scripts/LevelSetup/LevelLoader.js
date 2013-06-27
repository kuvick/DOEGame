#pragma strict

private var serializer : LevelSerializer;

function Start () {
	serializer = new LevelSerializer();
	LoadLevel(Application.persistentDataPath);
	
}

function Update () {

}

private function LoadLevel(path : String)
{
	serializer.Load(path);
	
	for(var b : int = 0; b < serializer.Buildings.Count; b++)
	{
		
	}
	
	for(var u : int = 0; u < serializer.Units.Count; u++)
	{
	
	}
	
	for(var e : int = 0; e < serializer.Events.Count; e++)
	{
	
	}
}