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
static public var inRangeColor:Color = Color.green;

static private var buildings:GameObject[];
private var selectedBuilding:GameObject;
private var previousBuilding:GameObject = null;
private var buildingSelected:boolean;
static public var defaultColors:Color[]; //stores the default color of all buildings
private var rangeRing:GameObject;
private static var hexagon: Mesh; //hexagon mesh for showing selection
var selectionMaterial: Material;//material for highlighting a specific hexagon.
static var selectionPosition:Vector3;
static var tileWidth:float;
static var sideSize:float;

function Start () 
{
	buildings = gameObject.FindGameObjectsWithTag("Building");
	tileWidth = HexagonGrid.tileWidth;
	sideSize = HexagonGrid.sideSize;
	createHexagonMesh();
	defaultColors = new Color[buildings.Length];
	
	Debug.Log("Building length " + buildings.Length);
	for(var i:int = 0; i < buildings.Length; i++){
		defaultColors[i] = buildings[i].renderer.material.color;
		
		//Create a ring denoting the link range around each building
		rangeRing = new GameObject("RangeRing");
		rangeRing.transform.parent = buildings[i].transform;
		rangeRing.transform.position = buildings[i].transform.position;
		rangeRing.layer = 2;			//Ignore Raycast
		rangeRing.AddComponent(SphereCollider);
		rangeRing.GetComponent(SphereCollider).radius = LinkUI.linkRange.x;
	}	
}


function Update() {
	
	restoreColors();
	selectedBuilding = ModeController.getSelectedBuilding();
	
	if(selectedBuilding == null)
	{
		//Debug.Log("No selected building, cannot update link display!");
		return;
	}
	
	selectedBuilding.renderer.material.color = selectedBuildingColor;

	/*Highlight all buildings in range
	for(var b:GameObject in buildings){
		var isInRange:boolean = gameObject.GetComponent(LinkUI).isInRange(selectedBuilding, b);
		if(selectedBuilding != b && isInRange){
			b.renderer.material.color = inRangeColor;
		}	
	}
	*/
	if(selectedBuilding != previousBuilding){
		HighlightBuildingsInRange(selectedBuilding);
		HighlightTilesInRange();
	}
	
	previousBuilding = selectedBuilding;
	
}

function OnDisable(){
	DestroyRangeTiles();
	previousBuilding = null;
}

static function HighlightBuildingsInRange(selectedBuilding:GameObject){
	buildings = GameObject.FindGameObjectsWithTag("Building");
	for(var b:GameObject in buildings){
		var isInRange:boolean = LinkUI.isInRange(selectedBuilding, b);
		
		if(selectedBuilding != b && isInRange){
			Debug.Log("Changing Color of " + b.ToString());
			b.renderer.material.color = inRangeColor;
		}
	}
}


function HighlightTilesInRange(){
	DestroyRangeTiles();
	/*TODO: update this to correct range from buildings*/
	//var range = selectedBuilding.transform.FindChild("RangeRing").GetComponent(SphereCollider).radius / tileWidth;
	Debug.Log("Range " + Database.TILE_RANGE);
	var position:Vector3 = selectedBuilding.transform.position;
	var mouseTile:Vector2 = HexagonGrid.worldToTileCoordinates(position.x, position.z);
	var x = mouseTile.x;
	var y = mouseTile.y;
	var minX = x - Database.TILE_RANGE;
	var maxX = x + Database.TILE_RANGE;
	
	for(var i = minX; i <= maxX; i++){
		if(i != x){
			selectionPosition = tileToWorldCoordinates(i, y);
			selectionPosition.y = 0.2f;
			createSelectionHexagon().transform.position = selectionPosition;
		}
	}
	
	for(var yOff = 1; yOff <= Database.TILE_RANGE; yOff++){
		if((y + yOff) % 2 == 1) maxX--;
		else minX++;
		for(var j = minX; j <= maxX; j++){
			selectionPosition = tileToWorldCoordinates(j, (y + yOff));
			selectionPosition.y = 0.2f;
			createSelectionHexagon().transform.position = selectionPosition;
			
			selectionPosition = tileToWorldCoordinates(j, (y - yOff));
			selectionPosition.y = 0.2f;
			createSelectionHexagon().transform.position = selectionPosition;
		}
	}
	
}

/*
 * Creates the hexagon that will highlight specific tiles
 * */
private function createSelectionHexagon(){
	var selectionHexagon = new GameObject("RangeHexagon");
	var meshFilter: MeshFilter = selectionHexagon.AddComponent("MeshFilter");
	meshFilter.mesh = hexagon;
	var meshRenderer: MeshRenderer = selectionHexagon.AddComponent("MeshRenderer");
	
	if(selectionMaterial == null){
		Debug.LogError ("selection material not linked for HexagonGrid");
	}
	selectionHexagon.renderer.material = selectionMaterial;
	selectionHexagon.tag = "RangeTile";
	return selectionHexagon;
}

/*
 * Clears highlighted tiles that show range	
*/
function DestroyRangeTiles(){
	
	if(GameObject.FindGameObjectsWithTag("RangeTile") == null)
	{
		Debug.Log("No range tiles to destroy");
		return;
	}

	for(var tile:GameObject in GameObject.FindGameObjectsWithTag("RangeTile"))
		GameObject.Destroy(tile);
}

static function restoreColors(){
	
	if(buildings.Length == 0) return;
	
	if(buildings != null){
		for(var i = 0; i < buildings.Length; i++){
			if(buildings[i] == null) return;
		
			buildings[i].renderer.material.color = Color.clear; // this needs to be changes to no color
		}
	}
}

private function createHexagonMesh(){
	hexagon = new Mesh();
	var vertices: Vector3[];
	vertices = new Vector3[6];
	var indices = new Array(0, 5, 1, 1, 5, 2, 5, 4, 2, 2, 4, 3);
	var radius: float = sideSize;
	for(var i:int = 0; i < 6; ++i){
		var radian: float = i / 6.0f * Mathf.PI * 2.0f + Mathf.PI / 2.0f; //add PI/2 to start point at top
		var x: float = tileWidth / 2.0f + Mathf.Cos (radian)* radius;
		var z: float = sideSize + Mathf.Sin (radian) * radius;
		vertices[i] = new Vector3(x, 0, z);
		//Debug.Log (vertices[i].ToString());
	}
	hexagon.vertices = vertices;
	hexagon.triangles = indices;
	hexagon.RecalculateNormals();
}

static function tileToWorldCoordinates(tileX:int, tileY:int):Vector3{
	return new Vector3(tileX * tileWidth + (tileY % 2) * tileWidth / 2 , 0, tileY * sideSize * 1.5f);	
}

