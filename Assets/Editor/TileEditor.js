#pragma strict

@CustomEditor(HexagonGrid)
class TileEditor extends Editor
{
	//Land Painting
    private var tileType:TileType = TileType.Land;
    private var painting:boolean = false;
    
    //Building Placing
    private var buildingType:BuildingType = BuildingType.None;
    private var placing:boolean = false;
    public static var selectedTilePos: Vector2 = new Vector2(-1, -1); //Current hex that is being selected
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
						grid.setTileType(inputTile.y, inputTile.x, tileType);
						EditorUtility.SetDirty(grid);
		    		}
		    		else if(Event.current.type == EventType.MouseDown && placing) //Placing + Mouse Button Down
		    		{
		    			if(e.button == 0) //Left Click
						{
							selectedTilePos = grid.worldToTileCoordinates(worldPoint.x, worldPoint.z);
							grid.setBuildingType(selectedTilePos.y, selectedTilePos.x, buildingType);
							Debug.Log(selectedTilePos);
							
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
							selectedTilePos.x = -1; //Reset selected tile
							selectedTilePos.y = -1;
						}
		    		}
		    	}
		    }
		}
	    else if(Event.current.type == EventType.layout){
            HandleUtility.AddDefaultControl(controlID);
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