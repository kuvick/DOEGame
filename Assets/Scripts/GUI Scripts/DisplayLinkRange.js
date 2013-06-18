#pragma strict

/* DisplayLinkRange.js
	Author: Justin Hinson
	
	Description:
	This Script allows the user to select a building, and highlights all 
	buildings and tiles that are within linkRange specified in LinkUI.js
	This Script uses isInRange from LinkUI.js to determine if two buildings
	are in range of each other, therefore this script must be attatched to the
	same object as LinkUI.js

*/

public var selectedBuildingColor:Color = Color.red;
public var selectionMaterial: Material; 				//material for highlighting a specific hexagon.
public var inRangeColor:Color = Color.green;

private static var hexagon: Mesh; 						//hexagon mesh for showing selection

private static var buildings:GameObject[];
private static var selectedBuilding:GameObject;
private static var previousBuilding:GameObject;
private static var selectionPosition:Vector3;

private static var tileWidth:float;
private static var sideSize:float;

private var rangeRing:GameObject;

private var rangeTiles : GameObject[];
private var rangeTilesDisabled : boolean = false;

function Start () 
{
	buildings = gameObject.FindGameObjectsWithTag("Building");
	tileWidth = HexagonGrid.tileWidth;
	sideSize = HexagonGrid.sideSize;
	CreateHexagonMesh();

	Debug.Log("Building length " + buildings.Length);
	
	// Francis: I'm not sure if this is an unimplemented feature or one that wasn't
	// completely removed, leaving it here for now.
	for(var i:int = 0; i < buildings.Length; i++){
		//Create a ring denoting the link range around each building
		rangeRing = new GameObject("RangeRing");
		rangeRing.transform.parent = buildings[i].transform;
		rangeRing.transform.position = buildings[i].transform.position;
		rangeRing.layer = 2;			//Ignore Raycast
		rangeRing.AddComponent(SphereCollider);
		rangeRing.GetComponent(SphereCollider).radius = LinkUI.linkRange.x;
	}	
	GenerateRangeTiles();
	rangeTiles = GameObject.FindGameObjectsWithTag("RangeTile");
	SetRangeTilesEnabled(false);
}


function Update() {
	selectedBuilding = ModeController.getSelectedBuilding();
	
	if(selectedBuilding == null)
	{
		//RestoreColors();
		//DestroyRangeTiles();
		if (!rangeTilesDisabled)
			SetRangeTilesEnabled(false);
		return;
	}
	
	/*if(selectedBuilding.name != "BuildingSite")
	{
		(selectedBuilding.GetComponentInChildren(Renderer) as Renderer).material.color = selectedBuildingColor;
	}*/
	
	if ((selectedBuilding.name != "BuildingSite") && (selectedBuilding != previousBuilding) &&
			Database.getBuildingOnGrid(selectedBuilding.transform.position).isActive)
	{
		var position:Vector3 = selectedBuilding.transform.position;
		var mouseTile:Vector2 = HexagonGrid.worldToTileCoordinates(position.x, position.z);
		SetRangeTilesPosition(mouseTile.x, mouseTile.y);
		//SetRangeTilesEnabled(true);
		//HighlightBuildingsInRange(selectedBuilding);
		//HighlightTilesInRange();
	}
	else if (!Database.getBuildingOnGrid(selectedBuilding.transform.position).isActive)
		SetRangeTilesEnabled(false);
		//DestroyRangeTiles();
	previousBuilding = selectedBuilding;
}

private function GenerateRangeTiles()
{
	var x = 6;
	var y = 6;
	var minX = x - Database.TILE_RANGE;
	var maxX = x + Database.TILE_RANGE;
	
	for(var i = minX; i <= maxX; i++){
		if(i != x){
			selectionPosition = TileToWorldCoordinates(i, y);
			selectionPosition.y = 0.2f;
			CreateSelectionHexagon().transform.position = selectionPosition;
		}
	}
	
	for(var yOff = 1; yOff <= Database.TILE_RANGE; yOff++){
		if((y + yOff) % 2 == 1) maxX--;
		else minX++;
		for(var j = minX; j <= maxX; j++){
			selectionPosition = TileToWorldCoordinates(j, (y + yOff));
			selectionPosition.y = 0.2f;
			CreateSelectionHexagon().transform.position = selectionPosition;//
			
			selectionPosition = TileToWorldCoordinates(j, (y - yOff));
			selectionPosition.y = 0.2f;
			CreateSelectionHexagon().transform.position = selectionPosition;
		}
	}
}

private function SetRangeTilesEnabled(enable : boolean)
{
	for (var i : int = 0; i < rangeTiles.length; i++)
	{
		rangeTiles[i].renderer.enabled = enable;
	}
	rangeTilesDisabled = !enable;
}

private function SetRangeTilesPosition(x : int, y : int)
{
	var minX = x - Database.TILE_RANGE;
	var maxX = x + Database.TILE_RANGE;
	
	var index = 0;
	
	for(var i = minX; i <= maxX; i++){
		if(i != x){
			selectionPosition = TileToWorldCoordinates(i, y);
			selectionPosition.y = 0.2f;
			rangeTiles[index++].transform.position = selectionPosition;
		}
	}
	
	for(var yOff = 1; yOff <= Database.TILE_RANGE; yOff++){
		if((y + yOff) % 2 == 1) maxX--;
		else minX++;
		for(var j = minX; j <= maxX; j++){
			selectionPosition = TileToWorldCoordinates(j, (y + yOff));
			selectionPosition.y = 0.2f;
			rangeTiles[index++].transform.position = selectionPosition;//
			
			selectionPosition = TileToWorldCoordinates(j, (y - yOff));
			selectionPosition.y = 0.2f;
			rangeTiles[index++].transform.position = selectionPosition;
		}
	}
}

function HighlightBuildingsInRange(selectedBuilding:GameObject){
	buildings = GameObject.FindGameObjectsWithTag("Building");
	for(var i : int = 0; i < buildings.length; i++)
	{//var b:GameObject in buildings){
		var isInRange:boolean = LinkUI.isInRange(selectedBuilding, buildings[i]);//b);
		
		if(selectedBuilding != buildings[i] && isInRange)
		{//b && isInRange){
			(buildings[i].GetComponentInChildren(Renderer) as Renderer).material.color = inRangeColor;
		}
	}
}

function HightlightBuildingTilesInRange(selectedBuilding : GameObject)
{
	buildings = GameObject.FindGameObjectsWithTag("Building");
	if(selectedBuilding != null )
	{
		for(var i : int = 0; i < buildings.length; i++)
		{
			var isInRange : boolean = LinkUI.isInRange(selectedBuilding, buildings[i]);
			
			if(selectedBuilding != buildings[i] && isInRange)
			{//b && isInRange){
				var tempBuilding = Database.getBuildingOnGrid(selectedBuilding.transform.position);
				
				for(var j = 0; j < tempBuilding.unallocatedOutputs.Count; j++)
				{
					Database.checkForResource(Database.getBuildingOnGrid(buildings[i].transform.position), tempBuilding.unallocatedOutputs[j]);
				}			
			}
		}
	}
}

function OnGUI()
{	
	HightlightBuildingTilesInRange(ModeController.selectedBuilding);
}


function HighlightTilesInRange(){
	DestroyRangeTiles();
	
	Debug.Log("Range " + Database.TILE_RANGE);
	var position:Vector3 = selectedBuilding.transform.position;
	var mouseTile:Vector2 = HexagonGrid.worldToTileCoordinates(position.x, position.z);
	var x = mouseTile.x;
	var y = mouseTile.y;
	var minX = x - Database.TILE_RANGE;
	var maxX = x + Database.TILE_RANGE;
	
	for(var i = minX; i <= maxX; i++){
		if(i != x){
			selectionPosition = TileToWorldCoordinates(i, y);
			selectionPosition.y = 0.2f;
			CreateSelectionHexagon().transform.position = selectionPosition;
		}
	}
	
	for(var yOff = 1; yOff <= Database.TILE_RANGE; yOff++){
		if((y + yOff) % 2 == 1) maxX--;
		else minX++;
		for(var j = minX; j <= maxX; j++){			
			selectionPosition = TileToWorldCoordinates(j, (y + yOff));
			selectionPosition.y = 0.2f;
			CreateSelectionHexagon().transform.position = selectionPosition;//		
			
			
			selectionPosition = TileToWorldCoordinates(j, (y - yOff));
			selectionPosition.y = 0.2f;
			CreateSelectionHexagon().transform.position = selectionPosition;
		}
	}
}

/*
 * Creates the hexagon that will highlight specific tiles
 * */
private function CreateSelectionHexagon():GameObject{
	var selectionHexagon = new GameObject("RangeHexagon");
	var meshFilter: MeshFilter = selectionHexagon.AddComponent(MeshFilter);
	meshFilter.mesh = hexagon;
	var meshRenderer: MeshRenderer = selectionHexagon.AddComponent(MeshRenderer);
	if(selectionMaterial == null){
		Debug.LogError ("selection material not linked for HexagonGrid");
	}
	(selectionHexagon.GetComponentInChildren(Renderer) as Renderer).material = selectionMaterial;
	selectionHexagon.tag = "RangeTile";
	return selectionHexagon;
}

/*
 * Clears highlighted tiles that show range	
*/
static function DestroyRangeTiles(){
	var tileArray:GameObject[] = GameObject.FindGameObjectsWithTag("RangeTile");
	
	if(tileArray.Length == 0)
	{
		//Debug.Log("No range tiles to destroy");
		return;
	}

	for(var i : int = 0; i < tileArray.length; i++)//var tile:GameObject in tileArray)
	{
		GameObject.Destroy(tileArray[i]);//tile);
	}
}

static function RestoreColors(){
	
	if(buildings.Length == 0) return;
	
	if(buildings != null){
		for(var i = 0; i < buildings.Length; i++){
			if(buildings[i] == null) return;
		
			(buildings[i].GetComponentInChildren(Renderer) as Renderer).material.color = Color.white; // this needs to be changes to no color
		}
	}
}

static function ClearSelection()
{
	selectedBuilding = null;
	previousBuilding = null;
}

private function CreateHexagonMesh(){
	hexagon = new Mesh();
	var vertices: Vector3[] = new Vector3[6];;
	var uvs:Vector2[] = new Vector2[vertices.Length];
	var indices = new Array(0, 5, 1, 1, 5, 2, 5, 4, 2, 2, 4, 3);
	var radius: float = sideSize;
	for(var i:int = 0; i < 6; ++i){
		var radian: float = i / 6.0f * Mathf.PI * 2.0f + Mathf.PI / 2.0f; //add PI/2 to start point at top
		var x: float = tileWidth / 2.0f + Mathf.Cos (radian)* radius;
		var z: float = sideSize + Mathf.Sin (radian) * radius;
		vertices[i] = new Vector3(x, 0, z);
	}
	
	for (i = 0 ; i < uvs.Length; i++)
	{
        uvs[i] = Vector2 (vertices[i].x, vertices[i].z);
    }
	
	hexagon.vertices = vertices;
	hexagon.uv = uvs;
	hexagon.triangles = indices;
	hexagon.RecalculateNormals();
}


static function TileToWorldCoordinates(tileX:int, tileY:int):Vector3{
	return new Vector3(tileX * tileWidth + (tileY % 2) * tileWidth / 2 , 0, tileY * sideSize * 1.5f);	
}

