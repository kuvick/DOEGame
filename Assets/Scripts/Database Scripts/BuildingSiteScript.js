#pragma strict

private var defaultBuildingList : DefaultBuildingData[];
private var scrollPosition : Vector2;		// used for scrollbar for building menu
private var selectedBuildingSite : boolean;
private var buildingLocationMenu : Vector2;
private var buildingSiteLocation : Vector3;
private var buildingData : BuildingData;
public var guiManager : GUIManager;

function Start ()
{
	selectedBuildingSite = false;

	scrollPosition = Vector2.zero;
	buildingLocationMenu = Vector2.zero;
	var defaultBuildingScript : DefaultBuildings = GameObject.Find("Database").GetComponent("DefaultBuildings");
	defaultBuildingList = defaultBuildingScript.defaultBuildings;
	
	buildingData = gameObject.GetComponent("BuildingData");
	buildingSiteLocation = buildingData.buildingData.coordinate;


}

function OnGUI()
{
	
	if(selectedBuildingSite)
	{
        
        
        var database:Database = GameObject.Find("Database").GetComponent("Database");
        scrollPosition = GUI.BeginScrollView (Rect (buildingLocationMenu.x, buildingLocationMenu.y, 200 , 200), scrollPosition, Rect (0, 0, 200, ( database.availableBuildingList.Count + 1) * 90), false, true);
        var i : int = 0;
        for(var building : GameObject in database.availableBuildingList){
        	if(GUI.Button(Rect(5, 20 + (95*i), 90, 90), building.name))
        	{
        		//PlaceBuilding.changeBuilding = i;
        		guiManager.buildingMenuOpen = false;
        		selectedBuildingSite = false;
        		var buildPosition:Vector3 = gameObject.transform.position;
        		var newBuilding:GameObject = Instantiate(building, gameObject.transform.position, Quaternion.identity);
        		var newBuildingData:BuildingData = newBuilding.GetComponent("BuildingData");
        		newBuildingData.coordinate = HexagonGrid.worldToTileCoordinates(buildPosition.x, buildPosition.z); 
				newBuilding.tag = "Building";
				Database.instance.addBuildingData(newBuildingData);
				Database.instance.removeBuildingData(GetComponent("BuildingData"));
        		Destroy(gameObject);
        	}

			i++;
		}
		
		
		GUI.EndScrollView ();
		
		if(GUI.Button(Rect(buildingLocationMenu.x, buildingLocationMenu.y + 200, 90, 45), "Cancel"))
    	{
    		selectedBuildingSite = false;
    	}
	}
}


function OpenBuildingMenu(mousePosition : Vector2)
{
	guiManager = GameObject.Find("Main Camera").GetComponent("GUIManager");

	selectedBuildingSite = true;
	buildingLocationMenu = mousePosition;
	guiManager.buildingMenuOpen = true;
}