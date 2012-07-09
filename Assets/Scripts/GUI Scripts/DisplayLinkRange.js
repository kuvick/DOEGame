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

//public var linkRange:Vector3 = Vector3(700, 700, 700);
public var selectedBuildingColor:Color = Color.red;;
public var inRangeColor:Color = Color.green;

private var buildings:GameObject[];
private var selectedBuilding:GameObject;
private var buildingSelected:boolean;
private var defaultColors:Color[];			//stores the default color of the all buildings

function Start () {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	defaultColors = new Color[buildings.length];
	
	for(var i:int = 0; i < buildings.length; i++)
		defaultColors[i] = buildings[i].renderer.material.color;
}

function getSelectedBuilding(){
	  var hit : RaycastHit;
      var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
      
      if (Physics.Raycast (ray, hit, 1000.0))
      {
      	var target = hit.collider.gameObject;
      	
      	if(target.tag == "Building"){
      		if(buildingSelected){
      		
      			//Restore all buildings original colors
      			for(var i:int = 0; i < buildings.length; i++)
      				buildings[i].renderer.material.color = defaultColors[i];
      		}
      		
      		selectedBuilding = target;
      		buildingSelected = true;
      		return true;
      	}
      }
      return false;
}

function Update() {
	if(Input.GetMouseButtonDown(0)){
		if(getSelectedBuilding()){
			selectedBuilding.renderer.material.color = selectedBuildingColor;
			
			for(var b:GameObject in buildings){
				var isInRange:boolean = gameObject.GetComponent(LinkUI).isInRange(selectedBuilding, b);
				
				if(selectedBuilding != b && isInRange){
					b.renderer.material.color = inRangeColor;
				}
			}
		}
	}
}