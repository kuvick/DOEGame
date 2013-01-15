#pragma strict

private var defaultBuildingList : DefaultBuildingData[];
private var scrollPosition : Vector2;		// used for scrollbar for building menu
private var selectedBuildingSite : boolean;
private var buildingLocationMenu : Vector2;
private var buildingSiteLocation : Vector3;
private var buildingData : BuildingData;
public var toolbar : ToolBar;

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
        scrollPosition = GUI.BeginScrollView (Rect (buildingLocationMenu.x, buildingLocationMenu.y, 200 , 200), scrollPosition, Rect (0, 0, 200, (PlaceBuilding.buildingPrefabs.Length + 1) * 90), false, true);
        
        var i : int = 0;
        for(var building : GameObject in PlaceBuilding.buildingPrefabs)
        {
        	if(GUI.Button(Rect(5, 20 + (95*i), 90, 90), building.name))
        	{
        		PlaceBuilding.changeBuilding = i;
        		toolbar.buildingMenuOpen = false;
        		selectedBuildingSite = false;
        		PlaceBuilding.Place(gameObject.transform.position, false);
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
	toolbar = GameObject.Find("Main Camera").GetComponent("ToolBar");

	selectedBuildingSite = true;
	buildingLocationMenu = mousePosition;
	toolbar.buildingMenuOpen = true;
}