#pragma strict

@CustomEditor(HexagonGrid)
class TileEditor extends Editor{

    
    
    private var tileType:TileType = TileType.Land;
    private var painting:boolean = false;
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

        GUILayout.Label ("Select tile type and drag/paint", EditorStyles.boldLabel);
           // myString = EditorGUILayout.TextField ("Text Field", myString);
        //Rect(3, 2, position.width - 16, 30), "Tile Type: ", 
        tileType = EditorGUILayout.EnumPopup("Tile Type: ", tileType);
        if(!painting){
	        if(GUILayout.Button("Begin painting")){
	        	painting = true;
	        }
	    }
	    else { 
	    	if(GUILayout.Button("Stop painting")){
	        	painting = false;
	    	}
		   	
		    
			    	
		}
      //
    }
    
	function OnSceneGUI(){
		var e:Event = Event.current;
		var controlID:int = GUIUtility.GetControlID(FocusType.Passive);
		if (Event.current.type == EventType.MouseDrag && painting){
		 	var gridObject:GameObject = GameObject.Find("HexagonGrid");
	    	if(gridObject){
	    		var grid:HexagonGrid = gridObject.GetComponent("HexagonGrid") as HexagonGrid;
	    		if(grid){
	    			var tileMap:Tile[] = grid.tileMap;
	    			var ray:Ray = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
					var enter: float = 0f; //enter stores the distance from the ray to the plane
					grid.plane.Raycast(ray, enter);
					var worldPoint: Vector3 = ray.GetPoint(enter);    				    	
					var inputTile: Vector2 = grid.worldToTileCoordinates(worldPoint.x, worldPoint.z);
					Debug.Log(inputTile);
					grid.setTileType(inputTile.y, inputTile.x, tileType);
					EditorUtility.SetDirty(grid);
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
	}
	
	function OnDestroy()
	{
		painting = false;
    	OnDisable();
	}

}