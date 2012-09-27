#pragma strict

/*
Author: Stephen Hopkins

Turn on this gizmo to see the type of each tile on the terrain. Tiles with an X in them are not buildable on. Uses icons in the Gizmos folder. 3d gizmos needs to be turned off
or if its turned on, move the slider to the right.
*/

private var slope1:Vector3 = new Vector3(1, 0, -1);
private var slope2:Vector3 = new Vector3(1, 0, 1);
private var xLineLength:float = HexagonGrid.tileHalfWidth * 0.65;
private var showTileType:boolean = false;//tile type has no use now, not showing for now
function OnDrawGizmos () {
    var grid:HexagonGrid = GetComponent("HexagonGrid") as HexagonGrid;
    if(grid){
    	for(var y:int = 0; y < grid.height; ++y){
    		for(var x:int = 0; x < grid.width; ++x){
    			var iconPos:Vector3 = HexagonGrid.tileToWorldCoordinates(x, y);
    			iconPos.y = 10;
    			iconPos.x += grid.tileHalfWidth;//center the icon over the tile
    			iconPos.z += grid.tileHalfHeight;
    			var buildable:boolean = grid.getTile(x, y).buildable;
    			if(!buildable){
    				Gizmos.color = Color.red;	
    				var upperLeft:Vector3 = iconPos - slope1 * xLineLength;
    				var bottomLeft:Vector3 = iconPos - slope2 * xLineLength;
    				var bottomRight:Vector3 = iconPos + slope1 * xLineLength;
    				var upperRight:Vector3 = iconPos + slope2 * xLineLength;
    				Gizmos.DrawLine(upperLeft, bottomRight);
    				Gizmos.DrawLine(bottomLeft, upperRight);
    			}
    			if(showTileType){
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
}