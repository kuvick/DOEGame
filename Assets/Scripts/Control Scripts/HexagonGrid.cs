using UnityEngine;
using System.Collections;

public class HexagonGrid : MonoBehaviour {
	
	
	/* To do: storing tile data, not sure what to do with these yet (if part of sprint 1)*/
	public struct Tile{
		TerrainType terrainType;
		int building; //temp	
	}
	public enum TerrainType{
		Land, Water	
	}
	public Tile[][] map;
	
	//---------------------------------------------------------------------------------------------
	public Camera mainCamera;
	public Material selectionMaterial;
	public ParticleSystem.Particle[] particles;	
	//plane for raycasting, uses y = 0 as the ground, y-up
	public Plane plane;
	
	public int width;//number of tiles horizontally
	public int height;//number of tiles vertically
	public float terrainWidth;//width of the hexagonal grid, in world coordinates
	public float terrainHeight;
	public float tileWidth;//width of a hexagon tile
	public float sideSize;//size of a single side of the hexagon
	public float peakSize;//see the ascii art
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
	
	private Mesh hexagon;//hexagon mesh for showing selection
	private GameObject selectionHexagon;
	// Use this for initialization
	void Start (){ 		
		plane = new Plane(new Vector3(0, 1, 0), new Vector3());
		terrainWidth =400;
		terrainHeight = 400;
		width = 20;
		height = 20;
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
		if(mainCamera == null){
			Debug.LogError("Camera not set");
		}
		
	}

	/*
	 * Creates the hexagon that will highlight specific tiles
	 * */
	private void createSelectionHexagon(){
		selectionHexagon = new GameObject("selectionHexagon");
		MeshFilter meshFilter;
		meshFilter = selectionHexagon.AddComponent("MeshFilter") as MeshFilter;
		meshFilter.mesh  = hexagon;
		MeshRenderer meshRenderer;
		meshRenderer = selectionHexagon.AddComponent ("MeshRenderer") as MeshRenderer;
		if(selectionMaterial == null){
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
	private void createHexagonMesh(){
		hexagon = new Mesh();
		Vector3[] vertices = new Vector3[6];
		int[] indices = {0, 5, 1, 1, 5, 2, 5, 4, 2, 2, 4, 3};
		float radius = sideSize;
		for(int i = 0; i < 6; ++i){
			float radian = (float)i / 6.0f * Mathf.PI * 2.0f + Mathf.PI / 2.0f;//add PI/2 to start point at top
			float x = tileWidth / 2.0f + Mathf.Cos (radian)* radius;
			float z = sideSize + Mathf.Sin (radian) * radius;
			vertices[i] = new Vector3(x, 0, z);
			//Debug.Log (vertices[i].ToString());
		}
		hexagon.vertices = vertices;
		hexagon.triangles = indices;
		hexagon.RecalculateNormals();
	}
	
	public void setGridVisbility(bool visible){
		this.renderer.enabled = visible;
	}
	public void setSelectionHexagonVisbility(bool visible){
		selectionHexagon.renderer.enabled = visible;
	}
	
	private void createHexagonGridParticles(){
		particles = new ParticleSystem.Particle[height * width];
		for(int y = 0; y < height; ++y){
			for(int x = 0; x < width; ++x){
				Vector3 position = new Vector3(x * tileWidth + (y % 2) * tileWidth / 2 + tileWidth / 2 , 0, y * sideSize * 1.5f + (sideSize * 1.5f  + peakSize) / 2);
				ParticleSystem.Particle particle = new ParticleSystem.Particle();
				particle.position = position;
				particle.rotation = 45;
				particle.size = tileWidth * 1.7f;//need to fix this number, I do not know how to get it mathematically
				particles[y * width + x] = particle;		
			}
		}
		
		particleSystem.SetParticles(particles, height * width);
		
	}
	/*this function was used for making a hexagonal mesh grid, but  we no longer need it for now*/
//	private void createGrid(){	
//		for(int y = 0; y < height; ++y){
//			for(int x = 0; x < width; ++x){
//				GameObject go = new GameObject("tile_r" + y + "_c" + x);
//				MeshFilter meshFilter;
//				meshFilter = go.AddComponent("MeshFilter") as MeshFilter;
//				MeshRenderer meshRenderer;
//				meshRenderer = go.AddComponent ("MeshRenderer") as MeshRenderer;
//				//go.renderer.material = selectionMaterial;
//				meshFilter.mesh  = hexagon;
//				go.transform.parent = this.transform;//y*h+(x%2)*h/2
//				go.transform.position = new Vector3(x * tileWidth + (y % 2) * tileWidth / 2 , 0, y * sideSize * 1.5f);
//			}
//		}
//			
//	
//	}
	
	
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
	public Vector2 worldToTileCoordinates(float x, float y){
		int xTile, yTile;
		int xSection = (int)(x / tileWidth);
		int ySection = (int)(y / (sideSize + peakSize));
		float xSectionPosition = x - xSection * tileWidth;
		float ySectionPosition = y - ySection * (sideSize + peakSize);
		int sectionType;//see ascii art above
		if(ySection % 2 == 0)
			sectionType = 0;
		else 
			sectionType = 1;	
		float slope = peakSize / (tileWidth / 2.0f);
		if(sectionType == 0){
			//default to be in the big area
			yTile = ySection;
			xTile = xSection;
			if(ySectionPosition < peakSize - slope * xSectionPosition){//in lower left triangle
				xTile = xSection - 1;
				yTile = ySection - 1;
			}
			else if(ySectionPosition < -peakSize + slope * xSectionPosition){// in lower right triangle
				xTile = xSection;
				yTile = ySection - 1;
			}
		}
		else{ //section 1
			//right side
			if(xSectionPosition > tileWidth / 2.0f){
				if(ySectionPosition < peakSize * 2 - slope * xSectionPosition){//in bottom middle area
					xTile = xSection;
					yTile = ySection - 1;
				}
				else{
					xTile = xSection;
					yTile = ySection;
				}
			}//on left side
			else{
				if(ySectionPosition < slope * xSectionPosition){//in bottom middle area
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
	
	// Update is called once per frame
	void Update () {	
		//get the mouse coordinates, project them onto the plane to get world coordinates of the mouse
		Vector3 mousePosition = new Vector3(Input.mousePosition.x, Input.mousePosition.y);
		Ray ray = mainCamera.ScreenPointToRay(mousePosition);
		float enter = 0f;//enter stores the distance from the ray to the plane
		plane.Raycast(ray, out enter);
		Vector3 worldPoint = ray.GetPoint(enter);
		Vector2 mouseTile = worldToTileCoordinates(worldPoint.x, worldPoint.z);
		selectionHexagon.transform.position = new Vector3(mouseTile.x * tileWidth + (mouseTile.y % 2) * tileWidth / 2 , 0.05f, mouseTile.y * sideSize * 1.5f);
	}
}
