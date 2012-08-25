#pragma strict
/**
Summary of HexagonGrid
Requirements:
	-This grid must be attached to a GameObject with a particle system. 
		-The Gameobject should be located at (0, 0.1, 0). The y = 0.1 is so that it sits above the terrain.
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
	-The tile type of a particular tile (x, y) can be found through getTile(x, y).type . getTile returns a Tile Object.
*/
enum TileType{
	Land,
	Water,
	GeothermalVent,
	Mine
}

enum BuildingType
{
	None,
	PowerPlant,
	Factory
}

class Tile{
	var type:TileType = TileType.Land;
	var bType:BuildingType = BuildingType.None;
}
var tileMap:Tile[] = new Tile[15 * 10];
static var mainCamera: Camera;//set this in the editor, although the script fallbacks to the default camera.
var selectionMaterial: Material;//material for highlighting a specific hexagon.
private var hexParticles: ParticleSystem.Particle[];//particles for creating the hex grid
static var plane:Plane = new Plane(new Vector3(0, 1, 0), 0); //plane for raycasting, uses y = 0 as the ground, y-up
var width: int = 15; //number of tiles horizontally
var height: int = 10; //number of tiles vertically
//var terrainWidth: float; //width of the hexagonal grid, in world coordinates
//var terrainHeight: float;
var showGrid:boolean = true;
static var tileWidth: float = 130.0f; //width of a hexagon tile
static var sideSize: float = tileWidth / Mathf.Cos(Mathf.PI / 6.0f) / 2.0f; //size of a single side of the hexagon
static var peakSize: float = sideSize * Mathf.Sin (Mathf.PI / 6.0f); //see the ascii art below
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
	
	

public var hexagon: Mesh; //hexagon mesh for showing selection
private var selectionHexagon: GameObject;
static public var selectionPosition: Vector3;

function Start(){
	mainCamera = Camera.main;
	
	//plane.SetNormalAndPosition();

	
	//to avoid creating it twice because of the gizmo, probably doesn't affect anything after the game is exported
	if(hexagon == null){
		createHexagonMesh();
	}
	createSelectionHexagon();	
	createHexagonGridParticles();
	//createGrid();
	if(mainCamera == null){
		Debug.LogError("Camera not set");
	}
	
	gameObject.AddComponent("InputController");
}

//used for drawing a grid without needing to run the scene
function OnDrawGizmos(){
	if(hexagon == null){
		createHexagonMesh();
	}
	
	var worldPosition: Vector3;
	var savedVertex: Vector3;
	var nextVertex: Vector3;
	for(var y:int = 0; y < height; ++y){
		for(var x:int = 0; x < width; ++x){
		
			worldPosition = tileToWorldCoordinates(x, y);
			savedVertex = hexagon.vertices[0] + worldPosition;
			for(var z:int = 1; z < 6; ++z){
				nextVertex = hexagon.vertices[z] + worldPosition;
				Gizmos.DrawLine(savedVertex, nextVertex);
				savedVertex = nextVertex;
			}
		}
	}
}

//converts mouse coordinates to world coordinates to tile coordinates, moves a selection hexagon around the grid.
function Update(){
	//shows or hides the grid since this script is attached to a particle system
	renderer.enabled = showGrid;
	var mouseTile:Vector2 = ScreenPosToTilePos(Input.mousePosition);

	//added math helper function
	//this is no longer needed ->var selectionPosition:Vector3 = new Vector3(mouseTile.x * tileWidth + (mouseTile.y % 2) * tileWidth / 2 , 0.05f, mouseTile.y * sideSize * 1.5f);
	selectionPosition = tileToWorldCoordinates(mouseTile.x, mouseTile.y);
	//set y to be just above the ground plane at 0.1 so it doesn't get clipped.
	selectionPosition.y = 0.2f;
	selectionHexagon.transform.position = selectionPosition;

	/*
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
				+ mouseTile.y);*/

	//placing a building	

			
	//var buildPosition: Vector3 = new Vector3(worldPoint.x, 15, worldPoint.z);	
}

//get a tile object at coordinate x, y
function getTile(x:int, y:int):Tile{
	if(y * width + x < tileMap.Length){
		return tileMap[y * width + x];
	}
	Debug.LogError("out of bounds for tileMap");
	return null;
}

//set the type of a tile at coordinate x, y
function setTileType(x:int, y:int, tileType:TileType):void{
	if(y * width + x < tileMap.Length){
		tileMap[y * width + x].type = tileType;
	}
	else Debug.LogError("out of bounds for tileMap");
}

//Set the type of building for the tile at coordinate x, y
function setBuildingType(x:int, y:int, buildingType:BuildingType):void{
	if(y * width + x < tileMap.Length){
		tileMap[y * width + x].bType = buildingType;
	}
	else Debug.LogError("out of bounds for tileMap");
}

// note this should use the position argument, that will come latter
static function GetPositionToBuild(position: Vector3):Vector3 {
	return (new Vector3(selectionPosition.x + tileWidth/2,
			15, 
			selectionPosition.z  + (sideSize + peakSize*2)/2));
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
			var position: Vector3 = tileToWorldCoordinates(x, y);
			//need to add half the size of the hexagon since the particles are centered	
			position.x += tileWidth / 2.0f;
			position.z += (sideSize * 1.5f  + peakSize) / 2;
			//old math new Vector3(x * tileWidth + (y % 2) * tileWidth / 2 + tileWidth / 2 , 0, y * sideSize * 1.5f + (sideSize * 1.5f  + peakSize) / 2);
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
 static function worldToTileCoordinates(x:float, y:float): Vector2{
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
 
 // Convert the given screen location into its corrisponding tile location
 static function ScreenPosToTilePos(inputPos: Vector2) :Vector2{
 	//get the mouse coordinates, project them onto the plane to get world coordinates of the mouse
	var ray: Ray = mainCamera.ScreenPointToRay(inputPos);
	var enter: float = 0f; //enter stores the distance from the ray to the plane
	plane.Raycast(ray, enter);
	var worldPoint: Vector3 = ray.GetPoint(enter);
	var inputTile: Vector2 = worldToTileCoordinates(worldPoint.x, worldPoint.z);
	return (inputTile);
 }

/**returns the lower left corner world coordinates of the tile, (x, 0, z)
*/
function tileToWorldCoordinates(tileX:int, tileY:int):Vector3{
  return new Vector3(tileX * tileWidth + (tileY % 2) * tileWidth / 2 , 0, tileY * sideSize * 1.5f);	
}
