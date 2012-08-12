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
	static var selectedBuilding : int;
    static var defaultBuildingsLength : int;
    static var defaultBuildings : Array = new Array();
    
    var buildingIndex : int;
    
    var currentBuildingName : String;
    var currentRequisitionCost : int;
    var currentPollutionCost : int;
    var currentInputName : Array = new Array();
    var currentInputNum : Array = new Array();
    var currentOutputName : Array = new Array();
    var currentOutputNum : Array = new Array();
    
    
    var tempBuilding : Building;

    // Add menu to Windows menu
    @MenuItem ("Window/Game Data Manipulation/Default Building Editor")
    static function Init ()
    {
        // Get existing open window or if none, make a new one:        
        var window = ScriptableObject.CreateInstance.<DefaultBuildingEditor>();
        
        selectedBuilding = -1;
        
        defaultBuildingsLength = defaultBuildings.length;
        
        window.Show();
    }
    
    function OnGUI ()
    {
    
    	if(selectedBuilding == -1)
    	{
    		var i : int = 0;
    		
    		if( defaultBuildingsLength > 0)
    		{
    			GUILayout.Label ("Current Buildings:", EditorStyles.boldLabel);
		        for (var defaultBuilding : Building in defaultBuildings)
				{
			      	if(GUILayout.Button("Edit " + defaultBuilding.buildingName))
			      	{
			      	
						currentBuildingName = defaultBuilding.buildingName;
					    currentRequisitionCost = defaultBuilding.requisitionCost;
					    currentPollutionCost = defaultBuilding.pollutionOutput;
					    currentInputName = defaultBuilding.inputName;
					    currentInputNum = defaultBuilding.inputNum;
					    currentOutputName = defaultBuilding.outputName;
					    currentOutputNum = defaultBuilding.outputNum;
					    
					    buildingIndex = i;
			      	
						selectedBuilding = 0;
			      	}
			      	i++;
		      	}
	      	}
	      	
	      	GUILayout.Label ("~~~~~~~~~~~~~~~", EditorStyles.boldLabel);	      	
	      	if(GUILayout.Button("Add Building"))
	      	{
	      	
				currentBuildingName = "";
			    currentRequisitionCost = 0;
			    currentPollutionCost = 0;
			    currentInputName = new Array();
			    currentInputNum = new Array();
			    currentOutputName = new Array();
			    currentOutputNum = new Array();
	      	
				selectedBuilding = -2;
	      	}
	      	
      	}
    	else if(selectedBuilding == -2)
    	{
    	
    		GUILayout.Label ("Create New Building", EditorStyles.boldLabel);
    		GUILayout.Label ("Important, use exact name of obj file!", EditorStyles.whiteBoldLabel);
    		currentBuildingName = EditorGUILayout.TextField("Building Name:", currentBuildingName);
    		currentRequisitionCost = EditorGUILayout.IntField("Requisition Cost:", currentRequisitionCost);
    		currentPollutionCost = EditorGUILayout.IntField("Pollution Output:", currentPollutionCost);
    		
    		
    		
			
			if(currentInputName.length > 0)
	      	{
				for (i = 0; i < currentInputName.length; i++)
				{
					GUILayout.Label ("Input #" + (i + 1) + ":", EditorStyles.boldLabel);
					currentInputName[i] = EditorGUILayout.TextField("Name:", currentInputName[i]);
					currentInputNum[i] = EditorGUILayout.IntField("Amount:", currentInputNum[i]);
				}
				
			}
			else
			{
				GUILayout.Label ("Input #1:", EditorStyles.boldLabel);
				currentInputName.push("");
				currentInputNum.push(0);
				currentInputName[0] = EditorGUILayout.TextField("Name:", currentInputName[0]);
				currentInputNum[0] = EditorGUILayout.IntField("Amount:", currentInputNum[0]);
			}
			
			if(GUILayout.Button("Add Input"))
	      	{
				currentInputName.push("");
				currentInputNum.push(0);
	      	}
	      	if(GUILayout.Button("Remove Last Input"))
	      	{
				currentInputName.pop();
				currentInputNum.pop();
	        }
	        
	        
			if(currentOutputName.length > 0)
	      	{
				for (i = 0; i < currentOutputName.length; i++)
				{
					GUILayout.Label ("Output #" + (i + 1) + ":", EditorStyles.boldLabel);
					currentOutputName[i] = EditorGUILayout.TextField("Name:", currentOutputName[i]);
					currentOutputNum[i] = EditorGUILayout.IntField("Amount:", currentOutputNum[i]);
				}
				
			}
			else
			{
				GUILayout.Label ("Output #1:", EditorStyles.boldLabel);
				currentOutputName.push("");
				currentOutputNum.push(0);
				currentOutputName[0] = EditorGUILayout.TextField("Name:", currentOutputName[0]);
				currentOutputNum[0] = EditorGUILayout.IntField("Amount:", currentOutputNum[0]);
			}
			
			if(GUILayout.Button("Add Output"))
	      	{
				currentOutputName.push("");
				currentOutputNum.push(0);
	      	}
	      	if(GUILayout.Button("Remove Last Output"))
	      	{
				currentOutputName.pop();
				currentOutputNum.pop();
	        }
	        
	        
        
        
            GUILayout.Label ("~~~~~~~~~~~~~~~", EditorStyles.boldLabel);
            if(GUILayout.Button("Clear Data"))
	      	{
			    currentBuildingName = "";
			    currentRequisitionCost = 0;
			    currentPollutionCost = 0;
			    currentInputName = new Array();
			    currentInputNum = new Array();
			    currentOutputName = new Array();
			    currentOutputNum = new Array();
	      	}	
    		
    		if(GUILayout.Button("Add This Building"))
	      	{
	      		tempBuilding = new Building();
	      		tempBuilding.buildingName = currentBuildingName;
	      		
	      		for (i = 0; i < currentInputName.length; i++)
				{
					tempBuilding.inputName.push(currentInputName[i]);
					tempBuilding.inputNum.push(currentInputNum[i]);
				}
				for (i = 0; i < currentOutputName.length; i++)
				{
					tempBuilding.outputName.push(currentOutputName[i]);
					tempBuilding.outputNum.push(currentOutputNum[i]);
				}
								
				tempBuilding.requisitionCost = currentRequisitionCost;
				tempBuilding.pollutionOutput = currentPollutionCost;

	      		defaultBuildings.push(tempBuilding);
	      		updateData();
	      			      		
				selectedBuilding = -1;
	      	}
      		if(GUILayout.Button("Cancel"))
	      	{
				selectedBuilding = -1;
	      	}
      	}
      	else if(selectedBuilding == 0)
      	{
    		GUILayout.Label ("Edit " + currentBuildingName, EditorStyles.boldLabel);
    		GUILayout.Label ("Important, use exact name of obj file!", EditorStyles.whiteBoldLabel);
    		currentBuildingName = EditorGUILayout.TextField("Building Name:", currentBuildingName);
    		currentRequisitionCost = EditorGUILayout.IntField("Requisition Cost:", currentRequisitionCost);
    		currentPollutionCost = EditorGUILayout.IntField("Pollution Output:", currentPollutionCost);
    		
    		
    		
			
			if(currentInputName.length > 0)
	      	{
				for (i = 0; i < currentInputName.length; i++)
				{
					GUILayout.Label ("Input #" + (i + 1) + ":", EditorStyles.boldLabel);
					currentInputName[i] = EditorGUILayout.TextField("Name:", currentInputName[i]);
					currentInputNum[i] = EditorGUILayout.IntField("Amount:", currentInputNum[i]);
				}
				
			}
			else
			{
				GUILayout.Label ("Input #1:", EditorStyles.boldLabel);
				currentInputName.push("");
				currentInputNum.push(0);
				currentInputName[0] = EditorGUILayout.TextField("Name:", currentInputName[0]);
				currentInputNum[0] = EditorGUILayout.IntField("Amount:", currentInputNum[0]);
			}
			
			if(GUILayout.Button("Add Input"))
	      	{
				currentInputName.push("");
				currentInputNum.push(0);
	      	}
	      	if(GUILayout.Button("Remove Last Input"))
	      	{
				currentInputName.pop();
				currentInputNum.pop();
	        }
	        
	        
			if(currentOutputName.length > 0)
	      	{
				for (i = 0; i < currentOutputName.length; i++)
				{
					GUILayout.Label ("Output #" + (i + 1) + ":", EditorStyles.boldLabel);
					currentOutputName[i] = EditorGUILayout.TextField("Name:", currentOutputName[i]);
					currentOutputNum[i] = EditorGUILayout.IntField("Amount:", currentOutputNum[i]);
				}
				
			}
			else
			{
				GUILayout.Label ("Output #1:", EditorStyles.boldLabel);
				currentOutputName.push("");
				currentOutputNum.push(0);
				currentOutputName[0] = EditorGUILayout.TextField("Name:", currentOutputName[0]);
				currentOutputNum[0] = EditorGUILayout.IntField("Amount:", currentOutputNum[0]);
			}
			
			if(GUILayout.Button("Add Output"))
	      	{
				currentOutputName.push("");
				currentOutputNum.push(0);
	      	}
	      	if(GUILayout.Button("Remove Last Output"))
	      	{
				currentOutputName.pop();
				currentOutputNum.pop();
	        }
	        
	        
        
        
            GUILayout.Label ("~~~~~~~~~~~~~~~", EditorStyles.boldLabel);
            if(GUILayout.Button("Clear Data"))
	      	{
			    currentBuildingName = "";
			    currentRequisitionCost = 0;
			    currentPollutionCost = 0;
			    currentInputName = new Array();
			    currentInputNum = new Array();
			    currentOutputName = new Array();
			    currentOutputNum = new Array();
	      	}	
    		
    		if(GUILayout.Button("Confirm Changes"))
	      	{
	      		tempBuilding = new Building();
	      		tempBuilding.buildingName = currentBuildingName;
	      		
	      		for (i = 0; i < currentInputName.length; i++)
				{
					tempBuilding.inputName.push(currentInputName[i]);
					tempBuilding.inputNum.push(currentInputNum[i]);
				}
				for (i = 0; i < currentOutputName.length; i++)
				{
					tempBuilding.outputName.push(currentOutputName[i]);
					tempBuilding.outputNum.push(currentOutputNum[i]);
				}
								
				tempBuilding.requisitionCost = currentRequisitionCost;
				tempBuilding.pollutionOutput = currentPollutionCost;

	      		defaultBuildings[buildingIndex] = tempBuilding;
	      		updateData();
	      			      		
				selectedBuilding = -1;
	      	}
	      	if(GUILayout.Button("Delete Building"))
	      	{
	      		defaultBuildings.Splice(buildingIndex, 1);
				selectedBuilding = -1;
	      	}
      		if(GUILayout.Button("Cancel"))
	      	{
				selectedBuilding = -1;
	      	}
	      	
	      	
	      	
      		
      	}
      	 

    }// end of OnGUI
    
    function OnEnable()
    {
		if(EditorPrefs.HasKey("defaultBuildingsLength"))
		{
			defaultBuildingsLength = EditorPrefs.GetInt("defaultBuildingsLength");
			
			
			if( defaultBuildingsLength > 0)
			{
				var temp : Building;
				var tempString : String = "";
			
				for(i = 0; i < defaultBuildingsLength; i++)
				{
					temp = new Building();
					
					tempString = "buildingName" + i;

					if(EditorPrefs.HasKey(tempString))
					{
						temp.buildingName = EditorPrefs.GetString(tempString);
					}
					
					tempString = "buildingRequisitionCost" + i;

					if(EditorPrefs.HasKey(tempString))
					{
						temp.requisitionCost = EditorPrefs.GetInt(tempString);
					}
					
					tempString = "buildingPollutionOutput" + i;

					if(EditorPrefs.HasKey(tempString))
					{
						temp.pollutionOutput = EditorPrefs.GetInt(tempString);
					}
					
					tempString = "buildingInputLength" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						var inputLength : int = EditorPrefs.GetInt(tempString);
							
						if( inputLength > 0)
						{
							for(j = 0; j < inputLength; j++)
							{
								tempString = "buildingInputName" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.inputName.push(EditorPrefs.GetInt(tempString));
								}
								
								tempString = "buildingInputNum" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.inputNum.push(EditorPrefs.GetInt(tempString));
								}
								
							}
						}//end of inputLength > 0
					}
					
					tempString = "buildingOutputLength" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						var outputLength : int = EditorPrefs.GetInt(tempString);
							
						if( outputLength > 0)
						{
							for(j = 0; j < outputLength; j++)
							{
								tempString = "buildingOutputName" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.outputName.push(EditorPrefs.GetInt(tempString));
								}
								
								tempString = "buildingOutputNum" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.outputNum.push(EditorPrefs.GetInt(tempString));
								}
								
							}
						}//end of outputLength > 0
					}
					
					
					
				}//end of for loop
			}// end of if length > 0
		}// end of if HasKey
		
		
		
		
		
		
		
		
		
		updateData();
	
			
	}
	
	function OnDisable()
	{
		var i : int = 0;
		var tempString : String = "";
		
		EditorPrefs.SetInt("defaultBuildingsLength", defaultBuildingsLength);
		
		for (var defaultBuilding : Building in defaultBuildings)
		{
			tempString = "buildingName" + i;
			EditorPrefs.SetString(tempString, defaultBuilding.buildingName);
			
			tempString = "buildingRequisitionCost" + i;
			EditorPrefs.SetInt(tempString, defaultBuilding.requisitionCost);
			
			tempString = "buildingPollutionOutput" + i;
			EditorPrefs.SetInt(tempString, defaultBuilding.pollutionOutput);
			
			tempString = "buildingInputLength" + i;
			EditorPrefs.SetInt(tempString, defaultBuilding.inputName.length);			
			
			var j : int = 0;
			for (var inputName : String in defaultBuilding.inputName)
			{
				tempString = "buildingInputName" + i + "_" + j;
				EditorPrefs.SetString(tempString, inputName);
				j++;
			}
			
			j = 0;
			for (var inputNum : int in defaultBuilding.inputNum)
			{
				tempString = "buildingInputNum" + i + "_" + j;
				EditorPrefs.SetInt(tempString, inputNum);
				j++;
			}
			
			tempString = "buildingOutputLength" + i;
			EditorPrefs.SetInt(tempString, defaultBuilding.outputName.length);		
			
			j = 0;
			for (var outputName : String in defaultBuilding.outputName)
			{
				tempString = "buildingOutputName" + i + "_" + j;
				EditorPrefs.SetString(tempString, outputName);
				j++;
			}
			
			j = 0;
			for (var outputNum : int in defaultBuilding.outputNum)
			{
				tempString = "buildingOutputNum" + i + "_" + j;
				EditorPrefs.SetInt(tempString, outputNum);
				j++;
			}
			

			i++;
			
			
		}
		
		updateData();
	
	}
	
	function OnDestroy()
	{
    	OnDisable();
	}
	
	
	
	function updateData()
	{

		Database.buildings.clear();
		for (var defaultBuilding : Building in defaultBuildings)
		{
			Database.buildings.push(defaultBuilding);
		}
		
		defaultBuildingsLength = Database.buildings.length;
		
	}

}