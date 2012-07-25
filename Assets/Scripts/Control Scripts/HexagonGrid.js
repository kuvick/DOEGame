#pragma strict
/**
Summary of HexagonGrid
Requirements:
	-This grid must be attached to a particle system
		-see the example scene in the test folder for setting up the particle system. Everything must match
	    -the particle system must have looping turned off. Play on awake turned off, turn everything off except renderer.
	    In renderer use horizontal billboard and attach the HexParticleMaterial. If the particles start to separate when they are close to the screen, 
	    increase the max particle size attribute of the renderer
	-The mainCamera must be linked to the script
	-The material for the selection hexagon must be linked to the script
	-The ground plane for the terrain should have y = 0;
	-The game should not use negative tile coordinates
Usage:
	-Hexagon tiles use (x, y) coordinate system. (0, 0, 0) world coordinates, is (0, 0) in tile coordinates,
    	-uses the positive x/z axis for the tiles
    -The size/number of hexagon tiles is controlled by the width, and terrainWidth variables.
    	-the terrain width is the width in world coordinates of the ground plane
    	-width is the number of hexagonal tiles that fits across this ground plane
    	-height is the number of hexagon tiles you want vertically
	-The grid can be turned on or off with the showGrid boolean or the setGridVisibility function
	-The selection hexagon can be turned on or off with the setSelectionHexagonVisibility function
*/


var mainCamera: Camera;//set this in the editor, although the script fallbacks to the default camera.
var selectionMaterial: Material;//material for highlighting a specific hexagon.
private var hexParticles: ParticleSystem.Particle[];//particles for creating the hex grid
private var plane:Plane; //plane for raycasting, uses y = 0 as the ground, y-up
var width: int; //number of tiles horizontally
var height: int; //number of tiles vertically
var terrainWidth: float; //width of the hexagonal grid, in world coordinates
var terrainHeight: float;
var showGrid:boolean = true;
var tileWidth: float; //width of a hexagon tile
var sideSize: float; //size of a single side of the hexagon
var peakSize: float; //see the ascii art below
/*<-------> tileWidth
 *   
 *    /\   |peakSize
 *  /   \  |
 * |     |         |
 * |     | sideSize|
 * |     |         |
 *  \   /
 *   \/
 * 
 * */
	
	

 
private var hexagon: Mesh; //hexagon mesh for showing selection
private var selectionHexagon: GameObject;

// for placing a building on terrain
var buildingPrefabs = new Array(); 
var buildingPrefab0 : Transform; 
var buildingPrefab1 : Transform;
var buildingPrefab2 : Transform; 
var buildingPrefab3 : Transform;
var buildingPrefab4 : Transform; 
var buildingPrefab5 : Transform;
var buildingPrefab6 : Transform; 
var buildingPrefab7 : Transform;

static var changeBuilding : int;

function Start(){
	mainCamera = Camera.main;
	plane = new Plane();
	plane.SetNormalAndPosition(new Vector3(0, 1, 0), new Vector3());
	terrainWidth = 2000;
	width = 15;
	height = 10;
	tileWidth = terrainWidth / width;
	sideSize = tileWidth / Mathf.Cos(Mathf.PI / 6.0f) / 2.0f;
	peakSize = sideSize * Mathf.Sin (Mathf.PI / 6.0f);
	Debug.Log ("tileWidth: " + tileWidth);
	Debug.Log ("sideSize: " + sideSize);
	Debug.Log("peakSize: " + peakSize);
	createHexagonMesh();
	createSelectionHexagon ();	
	createHexagonGridParticles();
	//createGrid();
	if(mainCamera == null)
	{
		Debug.LogError("Camera not set");
	}
	
}


function Awake()
{
	//setting up the buildings prefab array
	buildingPrefabs[0] = buildingPrefab0;
	buildingPrefabs[1] = buildingPrefab1;
	buildingPrefabs[2] = buildingPrefab2;
	buildingPrefabs[3] = buildingPrefab3;
	buildingPrefabs[4] = buildingPrefab4;
	buildingPrefabs[5] = buildingPrefab5;
	buildingPrefabs[6] = buildingPrefab6;
	buildingPrefabs[7] = buildingPrefab7;
}

//converts mouse coordinates to world coordinates to tile coordinates, moves a selection hexagon around the grid.
function Update(){
	//shows or hides the grid since this script is attached to a particle system
	renderer.enabled = showGrid;
	
	//get the mouse coordinates, project them onto the plane to get world coordinates of the mouse
	var mousePosition: Vector3 = new Vector3(Input.mousePosition.x, Input.mousePosition.y);
	var ray: Ray = mainCamera.ScreenPointToRay(mousePosition);
	var enter: float = 0f; //enter stores the distance from the ray to the plane
	plane.Raycast(ray, enter);
	var worldPoint: Vector3 = ray.GetPoint(enter);
	var mouseTile: Vector2 = worldToTileCoordinates(worldPoint.x, worldPoint.z);
	//0.05f y coordinate the the selection hexagon clips above the terrain//i will clean up the math later
	var selectionPosition:Vector3 = new Vector3(mouseTile.x * tileWidth + (mouseTile.y % 2) * tileWidth / 2 , 0.05f, mouseTile.y * sideSize * 1.5f);
	selectionHexagon.transform.position = selectionPosition;
	
	
	Debug.Log(	"Position X : " 
				+ Input.mousePosition.x 
				+ " Position Y : " 
				+ Input.mousePosition.y 
				+ " Position Z :" 
				+ Input.mousePosition.z 
				+ " worldx :" 
				+ worldPoint.x 
				+ " worldy :" 
				+ worldPoint.y 
				+ " worldz :" 
				+ worldPoint.z 
				+ " mousetilex" 
				+ mouseTile.x
				+ " mousetiley"
				+ mouseTile.y);
	
	//placing a building	

			
	//var buildPosition: Vector3 = new Vector3(worldPoint.x, 15, worldPoint.z);
	var buildPosition: Vector3 = new Vector3(selectionPosition.x + tileWidth/2,
											15, 
											selectionPosition.z  + (sideSize + peakSize*2)/2);
	
	if ( Input.GetMouseButtonDown(0) ){

      var hit : RaycastHit;      
      if (Physics.Raycast (ray, hit, 1000.0f)){
      
      	 var build = null;
      	 switch(changeBuilding)
      	 {
      	 	case 0:
      	 		build = Instantiate(buildingPrefab0, buildPosition, Quaternion.identity);
      	 	break;
      	 	case 1:
      	 		build = Instantiate(buildingPrefab1, buildPosition, Quaternion.identity);
      	 	break;
		 }
		 
         Debug.Log(hit.collider.gameObject.name);         
      }
   	}		
}

/*
 * Creates the hexagon that will highlight specific tiles
 * */
private function createSelectionHexagon(){
	selectionHexagon = new GameObject("SelectionHexagon");
	var meshFilter: MeshFilter = selectionHexagon.AddComponent("MeshFilter");
	meshFilter.mesh = hexagon;
	var meshRenderer: MeshRenderer = selectionHexagon.AddComponent("MeshRenderer");
	if(selectionMaterial == null){
		Debug.LogError ("selection material not linked for HexagonGrid");
	}
	selectionHexagon.renderer.material = selectionMaterial;
}

/*hexagon vertex ordering, registration point is the 'o', lower left corner (not on the hexagon)
 * 
 *     0
 *    /\   
 * 1/   \5
 * |     |
 * |     |
 *2|     |
 *  \   /4
 *o 3\/
 * */
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
//show or hide the grid
function setGridVisibility(visible:boolean){
	showGrid = visible;
	renderer.enabled = showGrid;
}

//show or hide the hexagon under the mouse
function setSelectionHexagonVisbility(visible:boolean){
	selectionHexagon.renderer.enabled = visible;
}


/*
creates the hexagonal grid by manually placing sprite particles
*/
private function createHexagonGridParticles(){
	hexParticles = new ParticleSystem.Particle[height * width];
	for(var y:int = 0; y < height; ++y){
		for(var x:int = 0; x < width; ++x){
			var position: Vector3 = new Vector3(x * tileWidth + (y % 2) * tileWidth / 2 + tileWidth / 2 , 0, y * sideSize * 1.5f + (sideSize * 1.5f  + peakSize) / 2);
			var particle: ParticleSystem.Particle = new ParticleSystem.Particle();
			particle.position = position;
			particle.rotation = 45;
			particle.size = tileWidth * 1.7f;//need to fix this number, I do not know how to get it mathematically
			hexParticles[y * width + x] = particle;
		}
	}
	particleSystem.SetParticles(hexParticles, height * width);
}
	
/*| 0,2 |
 *`,   ,`   section 0
 *  `,` ---------------------------------
 *   |0,1
 *   |   section 1
 * _,`,_
 *,`   `,---------------------------------------- 
 *|	    |
 *| 0,0 | section 0
 * `, ,`
 *   `   ---------------------------------	  	
*/
	
/*
 * see these for reference
 * http://www.gamedev.net/page/resources/_/technical/game-programming/coordinates-in-hexagon-based-tile-maps-r1800
 * converts world coordinates to tile coordinates
 * */
 function worldToTileCoordinates(x:float, y:float): Vector2{
	var xTile: int;
	var yTile: int;
	var xSection: int = Mathf.FloorToInt (x / tileWidth);
	var ySection: int = Mathf.FloorToInt(y / (sideSize + peakSize));
	var xSectionPosition: float = x - xSection * tileWidth;
	var ySectionPosition: float = y - ySection * (sideSize + peakSize);
	var sectionType: int;
	if(ySection % 2 == 0){
		sectionType = 0;
	}
	else{
		sectionType = 1;
	}
	var slope: float = peakSize / (tileWidth / 2.0f);
	if(sectionType == 0){
		//default to be in the big area
		yTile = ySection;
		xTile = xSection;
		if(ySectionPosition < peakSize - slope * xSectionPosition){ //in lower left triangle
			xTile = xSection - 1;
			yTile = ySection - 1;
		}
		else if(ySectionPosition < -peakSize + slope * xSectionPosition){ //in lower right triangle
			xTile = xSection;
			yTile = ySection - 1;
		}
	}
	else{ //section 1
		//right side
		if(xSectionPosition > tileWidth / 2.0f){
			if(ySectionPosition < peakSize * 2 - slope * xSectionPosition){ //in bottom middle area
				xTile = xSection;
				yTile = ySection - 1;
			}
			else{
				xTile = xSection;
				yTile = ySection;
			}
		}
		//on left side
		else{
			if(ySectionPosition < slope * xSectionPosition){ //in bottom middle area
				xTile = xSection;
				yTile = ySection -1;
			}
			else{
				xTile = xSection -1;
				yTile = ySection;
			}
		}
	}
	return new Vector2(xTile, yTile);	
 }