#pragma strict

@script ExecuteInEditMode()

private var tileCoord : Vector3;
private var worldCoord : Vector3;
private var centerOffset : Vector3 = Vector3(HexagonGrid.tileHalfWidth, 50, HexagonGrid.tileHalfHeight);
private var initial : boolean = false;

function Start () 
{
	
}

function Awake()
{
	if (Application.isPlaying)
	{
		Destroy(this);
	}
}

function Update () 
{
	if(!Application.isPlaying)
	{
		tileCoord = HexagonGrid.worldToTileCoordinates(gameObject.transform.position.x, gameObject.transform.position.z);
		CenterUnit();
	}
}

private function CenterUnit()
{
	worldCoord = HexagonGrid.TileToWorldCoordinates(tileCoord.x, tileCoord.y);
	worldCoord += centerOffset;
	gameObject.transform.position = worldCoord;
}