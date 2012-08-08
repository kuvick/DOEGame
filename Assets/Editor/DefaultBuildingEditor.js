/*
DefaultBuildingEditor.js
Original Script by Katharine Uvick

This script will create a window which can be accessed under Window/Game Data Manipulation
(should use Game Data Manipulation as the extention for all editor scripts to manipulate
game data).

Can be used to create new buildings, edit old buildings, or delete buildings.


UNDER CONSTRUCTION

*/


class DefaultBuildingEditor extends EditorWindow
{

    // Add menu to Windows menu
    @MenuItem ("Window/Game Data Manipulation/Default Building Editor")
    static function Init ()
    {
        // Get existing open window or if none, make a new one:        
        var window = ScriptableObject.CreateInstance.<DefaultBuildingEditor>();
        
        window.Show();
    }
    
    function OnGUI ()
    {
        
    }
    
    function OnEnable()
    {
    /*
		if(EditorPrefs.HasKey("startingRequisitionPoints"))
		{
			myString = EditorPrefs.GetInt("startingRequisitionPoints");
			RequisitionSystem.startingRequisitionPoints = startingRequisitionPoints;
		}
	*/
			
	}
	
	function OnDisable()
	{
	/*
		RequisitionSystem.startingRequisitionPoints = startingRequisitionPoints;
    	EditorPrefs.SetInt("startingRequisitionPoints", startingRequisitionPoints);
	*/
	}
	
	function OnDestroy()
	{
    	OnDisable();
	}

}