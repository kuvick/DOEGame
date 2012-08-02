#pragma strict

/* DisplayLinkRange.js
	Author: Justin Hinson
	
	Description:
	This Script allows the user to select a building, and highlights all 
	buildings and tiles that are within linkRange specified in LinkUI.js
	This Script uses isInRange from LinkUI.js to determine if two buildings
	are in range of each other, therefore this script must be attatched to the
	same object as LinkUI.js
	
	Notes: Tiles are not highlighted yet.

*/

public var selectedBuildingColor:Color = Color.red;;
static public var inRangeColor:Color = Color.green;

static private var buildings:GameObject[];
private var selectedBuilding:GameObject;
private var buildingSelected:boolean;
static public var defaultColors:Color[];			//stores the default color of all buildings
private var rangeRing:GameObject;

function Start () {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	
	defaultColors = new Color[buildings.Length];
	
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
	if (selectedBuilding != null){
		selectedBuilding.renderer.material.color = selectedBuildingColor;

		//Highlight all tiles in range
		drawRange();
	}
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

static function restoreColors(){
	if(buildings != null){
		for(var i = 0; i < buildings.Length; i++){
			buildings[i].renderer.material.color = Color.green; // this needs to be changes to no color
		}
	}
}


function drawRange(){
	
	
	
}