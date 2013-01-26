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
static public var inRangeColor:Color = Color.blue;

static private var buildings:List.<BuildingData>;
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

private var rangeTileContainer:GameObject;
function Start () 
{
	buildings = Database.instance.buildingDataList;
	rangeTileContainer = new GameObject("RangeTileContainer");
	/*defaultColors = new Color[buildings.Length];
	/*
	Debug.Log("Building length " + buildings.Length);
	for(var i:int = 0; i < buildings.Length; i++){
		defaultColors[i] = (buildings[i].GetComponentInChildren(Renderer) as Renderer).material.color;
		
		//Create a ring denoting the link range around each building
		rangeRing = new GameObject("RangeRing");
		rangeRing.transform.parent = buildings[i].transform;
		rangeRing.transform.position = buildings[i].transform.position;
		rangeRing.layer = 2;			//Ignore Raycast
		rangeRing.AddComponent(SphereCollider);
		rangeRing.GetComponent(SphereCollider).radius = LinkUI.linkRange.x;
	}	*/
}


function Update() {
	
	restoreColors();
	selectedBuilding = ModeController.getSelectedBuilding();
	
	if(selectedBuilding == null)
	{
		//Debug.Log("No selected building, cannot update link display!");
		return;
	}
	
	//(selectedBuilding.GetComponentInChildren(Renderer) as Renderer).material.color = selectedBuildingColor;

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

 function HighlightBuildingsInRange(selectedBuilding:GameObject){
	//need to rewrite this - stephen 1/25/2013
/*
	for(var b:GameObject in buildings){
		var isInRange:boolean = LinkUI.isInRange(selectedBuilding, b);
		
		if(selectedBuilding != b && isInRange){
			Debug.Log("Changing Color of " + b.ToString());
			(b.GetComponentInChildren(Renderer) as Renderer).material.color = inRangeColor;
		}
	}
	*/
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
	

	var rangeTile:GameObject;
	var hexagonGrid:HexagonGrid = (GameObject.Find("HexagonGrid").GetComponent("HexagonGrid") as HexagonGrid);
	var hex:GameObject = hexagonGrid.getSelectionHexagon();
	for(var i = minX; i <= maxX; i++){
		
		if(i != x && x >= 0 && x < hexagonGrid.width){			
			selectionPosition = HexagonGrid.tileToWorldCoordinates(i, y);
			selectionPosition.y = 0.2f;
			rangeTile = GameObject.Instantiate(hex, selectionPosition, Quaternion.identity);
			rangeTile.transform.parent = rangeTileContainer.transform;
		}
	}
	
	for(var yOff = 1; yOff <= Database.TILE_RANGE; yOff++){
		if((y + yOff) % 2 == 1) maxX--;
		else minX++;
		for(var j = minX; j <= maxX; j++){
			if(j >= 0 && j < hexagonGrid.width && y + yOff < hexagonGrid.height){
				selectionPosition = HexagonGrid.tileToWorldCoordinates(j, (y + yOff));
				selectionPosition.y = 0.2f;
				rangeTile = GameObject.Instantiate(hex, selectionPosition, Quaternion.identity);
				rangeTile.transform.parent = rangeTileContainer.transform;
			}
			if(j >= 0 && j < hexagonGrid.width && y - yOff >= 0){
				selectionPosition = HexagonGrid.tileToWorldCoordinates(j, (y - yOff));
				selectionPosition.y = 0.2f;
				rangeTile = GameObject.Instantiate(hex, selectionPosition, Quaternion.identity);
				rangeTile.transform.parent = rangeTileContainer.transform;
			}
		}
	}
	
	
}


/*
 * Clears highlighted tiles that show range	
*/
function DestroyRangeTiles(){
	
	for(var child:Transform in rangeTileContainer.transform){
		Destroy(child.gameObject);
		
	}
}

static function restoreColors(){
	/*
	if(buildings.Count == 0) return;
	
	if(buildings != null){
		for(var i = 0; i < buildings.Count; i++){
			if(buildings[i] == null) return;
		
			(buildings[i].GetComponentInChildren(Renderer) as Renderer).material.color = Color.clear; // this needs to be changes to no color
		}
	}
	*/
}




