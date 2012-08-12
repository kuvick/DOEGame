/*
RequisitionSystemData.js
Original Script by Katharine Uvick

This script will create a window which can be accessed under Window/Game Data Manipulation
(should use Game Data Manipulation as the extention for all editor scripts to manipulate
game data)

Will be used to edit the different values of variables used in the Requisition System.

*/


class RequisitionSystemData extends EditorWindow
{
	var startingRequisitionPoints : int;
	var lengthOfStorm : int;
	var pollutionReductionByStorm : int;
	
    static var stormIntervalArrayLength : int;
    static var stormInterval : Array = new Array();
    
    var turnsBetweenPayDay : int;
	var requisitionPayDay : int;
	var pollutionPenaltyPercent : int;
	var pollutionPenalty : int;
    
    // Add menu to Windows menu
    @MenuItem ("Window/Game Data Manipulation/Requisition System")
    static function Init ()
    {
        // Get existing open window or if none, make a new one:        
        var window = ScriptableObject.CreateInstance.<RequisitionSystemData>();
        
        window.Show();
    }
    
    function OnGUI ()
    {
    	
        GUILayout.Label ("Requisition Points Variables", EditorStyles.boldLabel);
        startingRequisitionPoints = EditorGUILayout.IntField("Starting Requisition Points:", startingRequisitionPoints);
        
        GUILayout.Label ("Storm Variables", EditorStyles.boldLabel);
        lengthOfStorm = EditorGUILayout.IntField("Length of Storm:", lengthOfStorm);
		pollutionReductionByStorm = EditorGUILayout.IntField("Pollution Reduction:", pollutionReductionByStorm);
		
		
		GUILayout.Label ("Storm Cycle", EditorStyles.boldLabel);
		if(stormIntervalArrayLength > 0)
      	{
			for (i = 0; i < stormInterval.length; i++)
			{
				stormInterval[i] = EditorGUILayout.IntField("Days Between Storm:", stormInterval[i]);
			}
		}
		else
		{
			stormInterval.clear();
			stormInterval.push(1);
			stormIntervalArrayLength++;
			stormInterval[0] = EditorGUILayout.IntField("Days Between Storm:", stormInterval[0]);
		}
		
		if(GUILayout.Button("Add to Cycle"))
      	{
			stormInterval.push(1);
			stormIntervalArrayLength++;
      	}
      	if(GUILayout.Button("Remove Cycle"))
      	{
			stormInterval.pop();
			
			var tempString : String = "daysTilStorm" + (stormInterval.length - 1);
			
			if(EditorPrefs.HasKey(tempString))
				EditorPrefs.DeleteKey(tempString);
				
			stormIntervalArrayLength--;
        }
        
        GUILayout.Label ("Pay Day Variables", EditorStyles.boldLabel);
        turnsBetweenPayDay = EditorGUILayout.IntField("Turns Between Pay Day:", turnsBetweenPayDay);
		requisitionPayDay = EditorGUILayout.IntField("Requisition Points Earned by Player:", requisitionPayDay);
		pollutionPenaltyPercent = EditorGUILayout.IntField("Percent of Pollution for Penalty:", pollutionPenaltyPercent);
		pollutionPenalty = EditorGUILayout.IntField("Amount of Pollution Penalty:", pollutionPenalty);
        
        /*
      	if(GUILayout.Button("Update Data"))
      	{
			updateData();
      	}
      	*/
      	
      	updateData();
        
    }
    
    function OnEnable()
    {
		if(EditorPrefs.HasKey("startingRequisitionPoints"))
		{
			startingRequisitionPoints = EditorPrefs.GetInt("startingRequisitionPoints");
			
		}
		if(EditorPrefs.HasKey("lengthOfStorm"))
		{
			lengthOfStorm = EditorPrefs.GetInt("lengthOfStorm");
			
		}
		if(EditorPrefs.HasKey("pollutionReductionByStorm"))
		{
			pollutionReductionByStorm = EditorPrefs.GetInt("pollutionReductionByStorm");
			
		}
		if(EditorPrefs.HasKey("turnsBetweenPayDay"))
		{
			turnsBetweenPayDay = EditorPrefs.GetInt("turnsBetweenPayDay");
			
		}
		if(EditorPrefs.HasKey("requisitionPayDay"))
		{
			requisitionPayDay = EditorPrefs.GetInt("requisitionPayDay");
			
		}
		if(EditorPrefs.HasKey("pollutionPenaltyPercent"))
		{
			pollutionPenaltyPercent = EditorPrefs.GetInt("pollutionPenaltyPercent");
			
		}
		if(EditorPrefs.HasKey("pollutionPenalty"))
		{
			pollutionPenalty = EditorPrefs.GetInt("pollutionPenalty");
			
		}
		if(EditorPrefs.HasKey("stormIntervalArrayLength"))
		{
			stormIntervalArrayLength = EditorPrefs.GetInt("stormIntervalArrayLength");
			
			//Debug.Log("ArrayLength:" + stormIntervalArrayLength);
			
			if( stormIntervalArrayLength > 0)
			{
				for(i = 0; i < stormIntervalArrayLength; i++)
				{
					var tempString : String = "daysTilStorm" + i;
					if(EditorPrefs.HasKey(tempString))
					{
						//Debug.Log(tempString + ": " + EditorPrefs.GetInt(tempString));
						stormInterval.Add(EditorPrefs.GetInt(tempString));
					}
				}
			}
	
		}
		
		updateData();
	}
	
	function OnDisable()
	{
		updateData();
    	EditorPrefs.SetInt("startingRequisitionPoints", startingRequisitionPoints);
    	EditorPrefs.SetInt("lengthOfStorm", lengthOfStorm);
    	EditorPrefs.SetInt("pollutionReductionByStorm", pollutionReductionByStorm);
    	EditorPrefs.SetInt("turnsBetweenPayDay", turnsBetweenPayDay);
    	EditorPrefs.SetInt("requisitionPayDay", requisitionPayDay);
    	EditorPrefs.SetInt("pollutionPenaltyPercent", pollutionPenaltyPercent);
    	EditorPrefs.SetInt("pollutionPenalty", pollutionPenalty);
    	
		var i : int = 0;
		
		EditorPrefs.SetInt("stormIntervalArrayLength", stormIntervalArrayLength);
		
		for (var daysTilStorm : int in stormInterval)
		{
			var tempString : String = "daysTilStorm" + i;
			EditorPrefs.SetInt(tempString, daysTilStorm);
			i++;
		}
    	
	}
	
	function OnDestroy()
	{
    	OnDisable();
	}
	
	// This function is used to set the variables
	function updateData()
	{
		RequisitionSystem.startingRequisitionPoints = startingRequisitionPoints;
		RequisitionSystem.lengthOfStorm = lengthOfStorm;
		RequisitionSystem.pollutionReductionByStorm = pollutionReductionByStorm;
		RequisitionSystem.turnsBetweenPayDay = turnsBetweenPayDay;
		RequisitionSystem.requisitionPayDay = requisitionPayDay;
		RequisitionSystem.pollutionPenaltyPercent = pollutionPenaltyPercent;
		RequisitionSystem.pollutionPenalty = pollutionPenalty;
		

		RequisitionSystem.stormIntervals.clear();
		for (var daysTilStorm : int in stormInterval)
		{
			RequisitionSystem.stormIntervals.push(daysTilStorm);
		}
		RequisitionSystem.turnsBetweenStorm = stormInterval[0];
		stormIntervalArrayLength = stormInterval.length;
		
	}

}