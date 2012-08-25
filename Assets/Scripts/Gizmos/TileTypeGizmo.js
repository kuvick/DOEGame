#pragma strict

/*
Author: Stephen Hopkins

Turn on this gizmo to see the type of each tile on the terrain. Uses icons in the Gizmos folder.
*/

function OnDrawGizmos () {
    var grid:HexagonGrid = GetComponent("HexagonGrid") as HexagonGrid;
    Gizmos.matrix = Matrix4x4.Scale(new Vector3(1, 1, 1));
    if(grid){
    	for(var y:int = 0; y < grid.height; ++y){
    		for(var x:int = 0; x < grid.width; ++x){
    			var iconPos:Vector3 = HexagonGrid.tileToWorldCoordinates(x, y);
    			iconPos.y = 10;
    			iconPos.x += grid.tileHalfWidth;//center the icon over the tile
    			iconPos.z += grid.tileHalfHeight;
    			switch(grid.getTile(x, y).type){
    				case TileType.Land:
    					Gizmos.DrawIcon(iconPos, "land.jpg", true);
    					break;
    				case TileType.Hill:
    					Gizmos.DrawIcon(iconPos, "hill.jpg", true);
    					break;
    				case TileType.Water:
    					Gizmos.DrawIcon(iconPos, "water.jpg", true);
    				 	break;			
					case TileType.GeothermalVent:
						Gizmos.DrawIcon(iconPos, "vent.jpg", true);
						break;				
					case TileType.Mine:
						Gizmos.DrawIcon(iconPos, "mine.jpg", true);
						break;
					default:
						break;
				}
					  		
    		}
    		
    	}
    
    }
}