#pragma strict
public var buildingTint:Color = Color.white;	//uses tag 'Building'
public var terrainObjTint:Color = Color.white; // uses tag 'TerrainObj'
public var terrainTint:Color = Color.white;	// searches for 'Terrain'
public var customTint:Color = Color.white;	// will search for tag specified in 'customTingTagName'
public var useCustomTint:boolean = false;
public var customTintTagName:String;



function Start ()
{
	buildingTint.a = 1f;
	terrainObjTint.a = 1f;
	terrainTint.a = 1f;
	customTint.a = 1f;

	var i:int = 0;
	var childImage : GameObject;

	var buildings: GameObject[] = GameObject.FindGameObjectsWithTag("Building");
	var terrainObj: GameObject[] = GameObject.FindGameObjectsWithTag("TerrainObj");
	
	for(i = 0; i < buildings.length; i++)
	{
		childImage = buildings[i].transform.Find(buildings[i].name + "Image").gameObject;
		childImage.renderer.material.color = buildingTint;
	}
	
	for(i = 0; i < terrainObj.length; i++)
	{
		terrainObj[i].renderer.material.color = terrainObjTint;
	}
	
	var terrain: GameObject = GameObject.Find("Terrain");
	
	if(terrain != null)
	{
		terrain.renderer.material.color = terrainTint;
	}
	
	if(useCustomTint)
	{
		var customTintObj: GameObject[] = GameObject.FindGameObjectsWithTag(customTintTagName);
		
		for(i = 0; i < customTintObj.length; i++)
		{
			customTintObj[i].renderer.material.color = customTint;
		}
	}
}

function Update ()
{

}