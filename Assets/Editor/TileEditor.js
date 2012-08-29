#pragma strict

/*
This editor is accessed by selecting the HexagonGrid object and looking at its properties in the Inpsector.
To paint/change the tile type of the terrain, select the tile type you want to paint and then click the begin painting button.
Dragging your mouse over tiles in the scene view will change their tile type. Turn on the TileType gizmo for viewing which
TileType the tiles currently have.


*/
@CustomEditor(HexagonGrid)
class TileEditor extends Editor
{
	//Land Painting
    private var tileType:TileType = TileType.Land;
    private var painting:boolean = false;
    
    //Building Placing
    private var buildingType:BuildingType = BuildingType.None;
    private var placing:boolean = false;
    //  Add menu named "My Window" to the Window menu
//    @MenuItem ("Window/Game Data Manipulation/Tile Editor")
//    static function Init ()
//    {
//        // Get existing open window or if none, make a new one:        
//        var window = ScriptableObject.CreateInstance.<TileEditor>();
//        
//        window.Show();
//    }
    
    function OnInspectorGUI (){
    	DrawDefaultInspector();
		//Painting
        GUILayout.Label("Select tile type and drag/paint", EditorStyles.boldLabel); //Painting Label
        //myString = EditorGUILayout.TextField ("Text Field", myString);
        //Rect(3, 2, position.width - 16, 30), "Tile Type: ", 
        tileType = EditorGUILayout.EnumPopup("Tile Type: ", tileType); //Drop-down menu for tile types
        if(!painting) //Painting button (toggle)
        {
	        if(GUILayout.Button("Begin painting"))
	        {
	        	painting = true;
	        }
	    }
	    else
	    { 
	    	if(GUILayout.Button("Stop painting"))
	    	{
	        	painting = false;
	    	}
		}
      	//Placing
      	GUILayout.Label("Select a tile and choose a building to place", EditorStyles.boldLabel); //Placing Label
	    if(!placing) //Placing button (toggle)
	    {
	    	if(GUILayout.Button("Begin placing"))
	    	{
	    		placing = true;
	    	}
	    }
	    else
	    {
	    	if(GUILayout.Button("Stop placing"))
	    	{
	    		placing = false;
	    	}
	    }
	    buildingType = EditorGUILayout.EnumPopup("Building Type: ", buildingType); //Drop-down menu for building types
    }
    
	function OnSceneGUI()
	{
		var e:Event = Event.current;
		var controlID:int = GUIUtility.GetControlID(FocusType.Passive);
		
		if(e.isMouse) //Mouse Event
		{
			var gridObject:GameObject = GameObject.Find("HexagonGrid");
			if(gridObject)
			{
		    	var grid:HexagonGrid = gridObject.GetComponent("HexagonGrid") as HexagonGrid;
		    	if(grid)
		    	{
		    		var ray:Ray = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
					var enter: float = 0f; //enter stores the distance from the ray to the plane
					grid.plane.Raycast(ray, enter);
					var worldPoint: Vector3 = ray.GetPoint(enter);    				    	
					
		    		if(Event.current.type == EventType.MouseDrag && painting) //Painting + Mouse Drag
		    		{
		    			var inputTile: Vector2 = grid.worldToTileCoordinates(worldPoint.x, worldPoint.z);
		    			Debug.Log(inputTile);
						grid.setTileType(inputTile.x, inputTile.y, tileType);
						EditorUtility.SetDirty(grid);//calling SetDirty causes the scene to remember/save the values changed in the grid
		    		}
		    		else if(Event.current.type == EventType.MouseDown && placing) //Placing + Mouse Button Down
		    		{
		    			if(e.button == 0) //Left Click
						{
							HexagonGrid.selectedTilePos = grid.worldToTileCoordinates(worldPoint.x, worldPoint.z);
							grid.setBuildingType(HexagonGrid.selectedTilePos.x, HexagonGrid.selectedTilePos.y, buildingType);
							Debug.Log(HexagonGrid.selectedTilePos);
							
							//TODO - PlaceBuilding.Place() is not working.
							/*
							//Find the center of the hexagon tile
							var buildingPos: Vector3;
							buildingPos.x = grid.hexagon.vertices[1].x + (grid.tileWidth / 2.0);
							buildingPos.y = grid.hexagon.vertices[1].y;
							buildingPos.z = grid.hexagon.vertices[1].z + grid.sideSize;
							
							//Get an instance of PlaceBuilding
							PlaceBuilding.Place(buildingPos, true); //Place the building in the center of the hexagon tile
							*/
							EditorUtility.SetDirty(grid);
						}
						else if(e.button == 1) //Right Click
						{
							HexagonGrid.selectedTilePos.x = -1; //Reset selected tile
							HexagonGrid.selectedTilePos.y = -1;
						}
		    		}
		    	}
		    }
		}
	    else if(Event.current.type == EventType.layout){
            HandleUtility.AddDefaultControl(controlID);
            //I don't really understand this part, but its necessary from what I've read for intercepting mouse clicks - Stephen
        }
	    	
	}
    function OnEnable()
    {


	}
	
	function OnDisable()
	{
		painting = false;
		placing = false;
	}
	
	function OnDestroy()
	{
    	OnDisable();
	}

}