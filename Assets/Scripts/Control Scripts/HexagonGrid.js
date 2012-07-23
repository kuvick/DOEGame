#pragma strict

//TODO
/*
public struct Tile{
	TerrainType terrainType;
	int building; //temp	
}
public enum TerrainType{
	Land, Water	
}
public Tile[][] map;
*/

var mainCamera: Camera;
var selectionMaterial: Material;
private var particles: ParticleSystem.Particle[];
private var plane:Plane; //plane for raycasting, uses y = 0 as the ground, y-up
var width: int; //number of tiles horizontally
var height: int; //number of tiles vertically
var terrainWidth: float; //width of the hexagonal grid, in world coordinates
var terrainHeight: float;
var tileWidth: float; //width of a hexagon tile
var sideSize: float; //size of a single side of the hexagon
var peakSize: float; //see the ascii art
var building : Transform; // for placing a building on terrain
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

function Start()
{
	mainCamera = Camera.main;
	plane = new Plane();
	plane.SetNormalAndPosition(new Vector3(0, 1, 0), new Vector3());
	terrainWidth = 500;
	terrainHeight = 500;
	width = 10;
	height = 8;
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

function Update()
{
	//get the mouse coordinates, project them onto the plane to get world coordinates of the mouse
	var mousePosition: Vector3 = new Vector3(Input.mousePosition.x, Input.mousePosition.y);
	var ray: Ray = mainCamera.ScreenPointToRay(mousePosition);
	var enter: float = 0f; //enter stores the distance from the ray to the plane
	//TODO
	plane.Raycast(ray, enter);
	///////
	var worldPoint: Vector3 = ray.GetPoint(enter);
	var mouseTile: Vector2 = worldToTileCoordinates(worldPoint.x, worldPoint.z);
	selectionHexagon.transform.position = new Vector3(mouseTile.x * tileWidth + (mouseTile.y % 2) * tileWidth / 2 , 0.05f, mouseTile.y * sideSize * 1.5f);
	
	//placing a building
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
		
	var buildPosition: Vector3 = new Vector3(worldPoint.x, -200, worldPoint.z);
	if ( Input.GetMouseButtonDown(0) )
   	{

      var hit : RaycastHit;      
      if (Physics.Raycast (ray, hit, 1000.0f))
      {
      	 var building = Instantiate(building, buildPosition, Quaternion.identity);
         Debug.Log(hit.collider.gameObject.name);         
      }
   	}
	
	
}

/*
 * Creates the hexagon that will highlight specific tiles
 * */
private function createSelectionHexagon()
{
	selectionHexagon = new GameObject();
	var meshFilter: MeshFilter = selectionHexagon.AddComponent("MeshFilter");
	meshFilter.mesh = hexagon;
	var meshRenderer: MeshRenderer = selectionHexagon.AddComponent("MeshRenderer");
	if(selectionMaterial == null)
	{
		Debug.LogError ("selection material not linked for HexagonGrid");
	}
	selectionHexagon.renderer.material = selectionMaterial;
}

/*hexagon vertex ordering, registration point is lower left corner (not on the hexagon)
 * 
 *     0
 *    /\   
 * 1/   \5
 * |     |
 * |     |
 *2|     |
 *  \   /4
 *  3\/
 * */
private function createHexagonMesh()
{
	hexagon = new Mesh();
	var vertices: Vector3[];
	vertices = new Vector3[6];
	var indices = new Array(0, 5, 1, 1, 5, 2, 5, 4, 2, 2, 4, 3);
	var radius: float = sideSize;
	for(var i:int = 0; i < 6; ++i)
	{
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

function setGridVisibility(visible:boolean)
{
	renderer.enabled = visible;
}

function setSelectionHexagonVisbility(visible:boolean)
{
	selectionHexagon.renderer.enabled = visible;
}

private function createHexagonGridParticles()
{
	particles = new ParticleSystem.Particle[height * width];
	for(var y:int = 0; y < height; ++y)
	{
		for(var x:int = 0; x < width; ++x)
		{
			var position: Vector3 = new Vector3(x * tileWidth + (y % 2) * tileWidth / 2 + tileWidth / 2 , 0, y * sideSize * 1.5f + (sideSize * 1.5f  + peakSize) / 2);
			var particle: ParticleSystem.Particle = new ParticleSystem.Particle();
			particle.position = position;
			particle.rotation = 45;
			particle.size = tileWidth * 1.7f;//need to fix this number, I do not know how to get it mathematically
			particles[y * width + x] = particle;
		}
	}
	particleSystem.SetParticles(particles, height * width);
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
 function worldToTileCoordinates(x:float, y:float): Vector2
 {
	var xTile: int;
	var yTile: int;
	var xSection: int = Mathf.FloorToInt (x / tileWidth);
	var ySection: int = Mathf.FloorToInt(y / (sideSize + peakSize));
	var xSectionPosition: float = x - xSection * tileWidth;
	var ySectionPosition: float = y - ySection * (sideSize + peakSize);
	var sectionType: int;
	if(ySection % 2 == 0)
	{
		sectionType = 0;
	}
	else
	{
		sectionType = 1;
	}
	var slope: float = peakSize / (tileWidth / 2.0f);
	if(sectionType == 0)
	{
		//default to be in the big area
		yTile = ySection;
		xTile = xSection;
		if(ySectionPosition < peakSize - slope * xSectionPosition) //in lower left triangle
		{
			xTile = xSection - 1;
			yTile = ySection - 1;
		}
		else if(ySectionPosition < -peakSize + slope * xSectionPosition) //in lower right triangle
		{
			xTile = xSection;
			yTile = ySection - 1;
		}
	}
	else //section 1
	{
		//right side
		if(xSectionPosition > tileWidth / 2.0f)
		{
			if(ySectionPosition < peakSize * 2 - slope * xSectionPosition) //in bottom middle area
			{
				xTile = xSection;
				yTile = ySection - 1;
			}
			else
			{
				xTile = xSection;
				yTile = ySection;
			}
		}
		//on left side
		else{
			if(ySectionPosition < slope * xSectionPosition) //in bottom middle area
			{
				xTile = xSection;
				yTile = ySection -1;
			}
			else
			{
				xTile = xSection -1;
				yTile = ySection;
			}
		}
	}
	return new Vector2(xTile, yTile);	
 }