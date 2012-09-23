/*
DefaultBuildingEditor.js
Original Script by Katharine Uvick

This script will create a window which can be accessed under Window/Game Data Manipulation
(should use Game Data Manipulation as the extention for all editor scripts to manipulate
game data).

Can be used to create new buildings, edit old buildings, or delete buildings.


UNDER CONSTRUCTION

*/

#pragma strict

class DefaultBuildingEditor extends EditorWindow
{
	static var selectedBuilding : int;
    static var defaultBuildingsLength : int;
    static var defaultBuildings : Array = new Array();
    
    static var buildingIndex : int;
    
    static var currentBuildingName : String;
    static var currentRequisitionCost : int;
    static var currentPollutionCost : int;
    static var currentInputName : Array = new Array();
    static var currentInputNum : Array = new Array();
    static var currentOutputName : Array = new Array();
    static var currentOutputNum : Array = new Array();
    static var currentOptionalOutputName : Array = new Array();
    static var currentOptionalOutputNum : Array = new Array();
    
    
    static var tempBuilding : Building;
    


    // Add menu to Windows menu
    @MenuItem ("Window/Game Data Manipulation/Default Building Editor")
    static function Init ()
    {
        // Get existing open window or if none, make a new one:        
        var window = ScriptableObject.CreateInstance.<DefaultBuildingEditor>();
        
        selectedBuilding = -1;
        
        window.Show();
    }
    
    function OnGUI ()
    {
    	var tempName : String;
    	var tempValue : int;
    	
    	//Default View:***************************************************
    	if(selectedBuilding == -1)
    	{
    		var i : int = 0;
    		
    		if( defaultBuildingsLength > 0)
    		{
    			// Displays list of all buildings currently stored, for user to select and edit attributes.
    			GUILayout.Label ("Current Buildings (" + defaultBuildingsLength + "):", EditorStyles.boldLabel);
    			
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
					    currentOptionalOutputName = defaultBuilding.optionalOutputName;
					    currentOptionalOutputNum = defaultBuilding.optionalOutputNum;
					    
					    buildingIndex = i;
			      	
						selectedBuilding = 0;
			      	}
			      	i++;
		      	}
	      	}// end of if( defaultBuildingsLength > 0)
	      	
	      	// Button to add an new building
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
			    currentOptionalOutputName = new Array();
				currentOptionalOutputNum = new Array();
	      	
				selectedBuilding = -2;
	      	}
	      	
	      	// Buttons to force the editor to save, load,
	      	// or reset the data to defaults.
	      	if(GUILayout.Button("Force Save"))
		  	{
				OnDisable();
				updateData();
		  	}
		  	if(GUILayout.Button("Force Load"))
		  	{
				OnEnable();
		  	}
		  	GUILayout.Label ("WARNING: will delete all other buildings:", EditorStyles.boldLabel);
		  	if(GUILayout.Button("Reset to Defaults"))
		  	{
				initalizeBuildings();
		  	}
	      	
      	}// end of default view
      	
      	//Create New Building View:***************************************************
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
					
					tempName = currentInputName[i];					
					currentInputName[i] = EditorGUILayout.TextField("Name:", tempName);
					tempValue = currentInputNum[i];
					currentInputNum[i] = EditorGUILayout.IntField("Amount:", tempValue);
				}
				
			}
			else
			{
				GUILayout.Label ("Input #1:", EditorStyles.boldLabel);
				currentInputName.push("");
				currentInputNum.push(0);
				tempName = currentInputName[0];
				currentInputName[0] = EditorGUILayout.TextField("Name:", tempName);
				tempValue = currentInputNum[0];
				currentInputNum[0] = EditorGUILayout.IntField("Amount:", tempValue);
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
					
					tempName = currentOutputName[i];					
					currentOutputName[i] = EditorGUILayout.TextField("Name:", tempName);
					tempValue = currentOutputNum[i];
					currentOutputNum[i] = EditorGUILayout.IntField("Amount:", tempValue);
				}
				
			}
			else
			{
				GUILayout.Label ("Output #1:", EditorStyles.boldLabel);
				currentOutputName.push("");
				currentOutputNum.push(0);
				currentOutputName[0] = EditorGUILayout.TextField("Name:", "");
				currentOutputNum[0] = EditorGUILayout.IntField("Amount:", 0);
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
	        
	        if(currentOptionalOutputName.length > 0)
	      	{
				for (i = 0; i < currentOptionalOutputName.length; i++)
				{
					GUILayout.Label ("Optional Output #" + (i + 1) + ":", EditorStyles.boldLabel);
					
					tempName = currentOptionalOutputName[i];					
					currentOptionalOutputName[i] = EditorGUILayout.TextField("Name:", tempName);
					tempValue = currentOptionalOutputNum[i];
					currentOptionalOutputNum[i] = EditorGUILayout.IntField("Amount:", tempValue);
				}
				
				if(GUILayout.Button("Add Output"))
		      	{
					currentOptionalOutputName.push("");
					currentOptionalOutputNum.push(0);
		      	}
		      	if(GUILayout.Button("Remove Last Output"))
		      	{
					currentOptionalOutputName.pop();
					currentOptionalOutputNum.pop();
		        }
				
			}
			else
			{
				GUILayout.Label ("Add Optional Output?", EditorStyles.boldLabel);
				if(GUILayout.Button("Add Output"))
		      	{
					currentOptionalOutputName.push("");
					currentOptionalOutputNum.push(0);
		      	}
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
			    currentOptionalOutputName = new Array();
				currentOptionalOutputNum = new Array();
			    
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
				for (i = 0; i < currentOptionalOutputName.length; i++)
				{
					tempBuilding.optionalOutputName.push(currentOptionalOutputName[i]);
					tempBuilding.optionalOutputNum.push(currentOptionalOutputNum[i]);
				}
								
				tempBuilding.requisitionCost = currentRequisitionCost;
				tempBuilding.pollutionOutput = currentPollutionCost;

	      		defaultBuildings.push(tempBuilding);
	      			      		
				selectedBuilding = -1;
	      	}
      		if(GUILayout.Button("Cancel"))
	      	{
				selectedBuilding = -1;
	      	}
      	}// end of create view
      	
		//Edit Building View:***************************************************     	
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
					
					tempName = currentInputName[i];					
					currentInputName[i] = EditorGUILayout.TextField("Name:", tempName);
					tempValue = currentInputNum[i];
					currentInputNum[i] = EditorGUILayout.IntField("Amount:", tempValue);
				}
				
			}
			else
			{
				GUILayout.Label ("Input #1:", EditorStyles.boldLabel);
				currentInputName.push("");
				currentInputNum.push(0);
				currentInputName[0] = EditorGUILayout.TextField("Name:", "");
				currentInputNum[0] = EditorGUILayout.IntField("Amount:", 0);
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
					
					tempName = currentOutputName[i];					
					currentOutputName[i] = EditorGUILayout.TextField("Name:", tempName);
					tempValue = currentOutputNum[i];
					currentOutputNum[i] = EditorGUILayout.IntField("Amount:", tempValue);
				}
				
			}
			else
			{
				GUILayout.Label ("Output #1:", EditorStyles.boldLabel);
				currentOutputName.push("");
				currentOutputNum.push(0);
				currentOutputName[0] = EditorGUILayout.TextField("Name:", "");
				currentOutputNum[0] = EditorGUILayout.IntField("Amount:", 0);
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
	        
			if(currentOptionalOutputName.length > 0)
	      	{
				for (i = 0; i < currentOptionalOutputName.length; i++)
				{
					GUILayout.Label ("Optional Output #" + (i + 1) + ":", EditorStyles.boldLabel);
					
					tempName = currentOptionalOutputName[i];					
					currentOptionalOutputName[i] = EditorGUILayout.TextField("Name:", tempName);
					tempValue = currentOptionalOutputNum[i];
					currentOptionalOutputNum[i] = EditorGUILayout.IntField("Amount:", tempValue);
				}
				
				if(GUILayout.Button("Add Output"))
		      	{
					currentOptionalOutputName.push("");
					currentOptionalOutputNum.push(0);
		      	}
		      	if(GUILayout.Button("Remove Last Output"))
		      	{
					currentOptionalOutputName.pop();
					currentOptionalOutputNum.pop();
		        }
				
			}
			else
			{
				GUILayout.Label ("Add Optional Output?", EditorStyles.boldLabel);
				if(GUILayout.Button("Add Output"))
		      	{
					currentOptionalOutputName.push("");
					currentOptionalOutputNum.push(0);
		      	}
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
			    currentOptionalOutputName = new Array();
			    currentOptionalOutputNum = new Array();
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
				for (i = 0; i < currentOptionalOutputName.length; i++)
				{
					tempBuilding.optionalOutputName.push(currentOptionalOutputName[i]);
					tempBuilding.optionalOutputNum.push(currentOptionalOutputNum[i]);
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
				
				deleteBuilding( buildingIndex );
				defaultBuildingsLength--;
				
	      	}
      		if(GUILayout.Button("Cancel"))
	      	{
				selectedBuilding = -1;
	      	}
      		
      	} // end of Edit Building view
      	
      	
      	
      	/*
      	GUILayout.Label ("~~~~~~~~~~~~~~~", EditorStyles.boldLabel);
      	
      	//Was used to temporarily delete all editor prefs, affects ALL stored editor prefs
      	
      	if(GUILayout.Button("Clear ALL DATA, BE CAREFUL"))
      	{
			EditorPrefs.DeleteAll();
      	}
      	
      	
      	
      	if(GUILayout.Button("Check Data"))
      	{
			printBuildings();
      	}
      	
      	*/
      	 

    }// end of OnGUI
    
    
    // Used to load all data into the script.
    function OnEnable()
    {
    	defaultBuildings.clear();
    	var j : int = 0;
    	
		if(EditorPrefs.HasKey("defaultBuildingsLength"))
		{
			defaultBuildingsLength = EditorPrefs.GetInt("defaultBuildingsLength");
			
			
			if( defaultBuildingsLength > 0)
			{
				var temp : Building;
				var tempString : String = "";
				var i : int = 0;
			
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
									temp.inputName.push(EditorPrefs.GetString(tempString));
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
									temp.outputName.push(EditorPrefs.GetString(tempString));
								}
								
								tempString = "buildingOutputNum" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.outputNum.push(EditorPrefs.GetInt(tempString));
								}
								
							}
						}//end of outputLength > 0
					}
					
					tempString = "buildingOptionalOutputLength" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						var optionalOutputLength : int = EditorPrefs.GetInt(tempString);
							
						if( optionalOutputLength > 0)
						{
							
							for(j = 0; j < optionalOutputLength; j++)
							{
								tempString = "buildingOptionalOutputName" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.optionalOutputName.push(EditorPrefs.GetString(tempString));
								}
								
								tempString = "buildingOptionalOutputNum" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.optionalOutputNum.push(EditorPrefs.GetInt(tempString));
								}
								
							}
						}//end of optionalOutputLength > 0
					}
					
					defaultBuildings.push(temp);
					
				}//end of for loop
			}// end of if length > 0
		}// end of if HasKey
		
	
			
	}// end of OnEnable
	
	
	// Given the index within defaultBuildings,
	// it will go through and delete all the
	// stored data within EditorPrefs relating
	// to that building
	function deleteBuilding( index : int )
	{
		var tempString : String;
	
		tempString = "buildingName" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		tempString = "buildingRequisitionCost" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		
		tempString = "buildingPollutionOutput" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		
		tempString = "buildingInputLength" + index;
		var buildingInputLength : int;
		if(EditorPrefs.HasKey(tempString))
		{
			buildingInputLength = EditorPrefs.GetInt(tempString);
			EditorPrefs.DeleteKey(tempString);
		}
				
		
		var j : int = 0;
		for (j = 0; j < buildingInputLength; j++)
		{
			tempString = "buildingInputName" + index + "_" + j;
			if(EditorPrefs.HasKey(tempString))
				EditorPrefs.DeleteKey(tempString);
		
			j++;
		}
		
		j = 0;
		for (j = 0; j < buildingInputLength; j++)
		{
			tempString = "buildingInputNum" + index + "_" + j;
			if(EditorPrefs.HasKey(tempString))
				EditorPrefs.DeleteKey(tempString);
			j++;
		}
		
		
		tempString = "buildingOutputLength" + index;
		var buildingOutputLength : int;
		if(EditorPrefs.HasKey(tempString))
		{
			buildingOutputLength = EditorPrefs.GetInt(tempString);
			EditorPrefs.DeleteKey(tempString);
		}
	
		
		j = 0;
		for (j = 0; j < buildingOutputLength; j++)
		{
			tempString = "buildingOutputName" + index + "_" + j;
			if(EditorPrefs.HasKey(tempString))
				EditorPrefs.DeleteKey(tempString);
			j++;
		}
		
		j = 0;
		for (j = 0; j < buildingOutputLength; j++)
		{
			tempString = "buildingOutputNum" + index + "_" + j;
			if(EditorPrefs.HasKey(tempString))
				EditorPrefs.DeleteKey(tempString);
			j++;
		}	
		
		tempString = "buildingOptionalOutputLength" + index;
		var buildingOptionalOutputLength : int;
		if(EditorPrefs.HasKey(tempString))
		{
			buildingOptionalOutputLength = EditorPrefs.GetInt(tempString);
			EditorPrefs.DeleteKey(tempString);
		}
		
		j = 0;
		for (j = 0; j < buildingOptionalOutputLength; j++)
		{
			tempString = "buildingOptionalOutputName" + index + "_" + j;
			if(EditorPrefs.HasKey(tempString))
				EditorPrefs.DeleteKey(tempString);
			j++;
		}
		
		j = 0;
		for (j = 0; j < buildingOptionalOutputLength; j++)
		{
			tempString = "buildingOptionalOutputNum" + index + "_" + j;
			if(EditorPrefs.HasKey(tempString))
				EditorPrefs.DeleteKey(tempString);
			j++;
		}
		
	}// end of deleteBuilding
	
	
	
	// Used to store all data into EditorPrefs
	function OnDisable()
	{
		var i : int = 0;
		var tempString : String = "";
		var tempName : String;
		var tempValue : int;
		
		EditorPrefs.SetInt("defaultBuildingsLength", defaultBuildings.length);
		
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
			for (j = 0; j < defaultBuilding.inputName.length; j++)
			{
				tempString = "buildingInputName" + i + "_" + j;
				
				tempName = defaultBuilding.inputName[j];
				EditorPrefs.SetString(tempString, tempName);
			}
			
			j = 0;
			for (j = 0; j < defaultBuilding.inputNum.length; j++)
			{
				tempString = "buildingInputNum" + i + "_" + j;
				tempValue = defaultBuilding.inputNum[j];

				EditorPrefs.SetInt(tempString, tempValue);
			}
			
			tempString = "buildingOutputLength" + i;
			EditorPrefs.SetInt(tempString, defaultBuilding.outputName.length);		
			
			j = 0;
			for (j = 0; j < defaultBuilding.outputName.length; j++)
			{
				tempString = "buildingOutputName" + i + "_" + j;
				tempName = defaultBuilding.outputName[j];
				EditorPrefs.SetString(tempString, tempName);
			}
			
			j = 0;
			for (j = 0; j < defaultBuilding.outputNum.length; j++)
			{
				tempString = "buildingOutputNum" + i + "_" + j;
				tempValue = defaultBuilding.outputNum[j];
				EditorPrefs.SetInt(tempString, tempValue);
			}
			
			tempString = "buildingOptionalOutputLength" + i;
			EditorPrefs.SetInt(tempString, defaultBuilding.optionalOutputName.length);		
			
			j = 0;
			for (j = 0; j < defaultBuilding.optionalOutputName.length; j++)
			{
				tempString = "buildingOptionalOutputName" + i + "_" + j;
				tempName = defaultBuilding.optionalOutputName[j];
				EditorPrefs.SetString(tempString, tempName);
			}
			
			j = 0;
			for (j = 0; j < defaultBuilding.optionalOutputNum.length; j++)
			{
				tempString = "buildingOptionalOutputNum" + i + "_" + j;
				tempValue = defaultBuilding.optionalOutputNum[j];
				EditorPrefs.SetInt(tempString, tempValue);
			}
			
			

			i++;
			
			
		}
		
		updateData();
	
	}// end of OnDisable
	
	function OnDestroy()
	{
    	OnDisable();
	}
	
	
	
	// Used to update data of Database, but
	// only works if editor is open, else
	// uses LoadDataFromEditor.js script
	function updateData()
	{
		var temp: Building;

		Database.buildings.clear();
		for (var defaultBuilding : Building in defaultBuildings)
		{
			temp = new Building();
			temp.buildingName = defaultBuilding.buildingName;
			temp.inputName = temp.inputName.Concat(defaultBuilding.inputName);
			temp.inputNum = temp.inputNum.Concat(defaultBuilding.inputNum);
			temp.outputName = temp.outputName.Concat(defaultBuilding.outputName);
			temp.outputNum = temp.outputNum.Concat(defaultBuilding.outputNum);			
			temp.optionalOutputName = temp.optionalOutputName.Concat(defaultBuilding.optionalOutputName);
			temp.optionalOutputNum = temp.optionalOutputNum.Concat(defaultBuilding.optionalOutputNum);			
			temp.requisitionCost = defaultBuilding.requisitionCost;
			temp.pollutionOutput = defaultBuilding.pollutionOutput;
					
			Database.buildings.push(temp);
		}
		
		defaultBuildingsLength = Database.buildings.length;
		
	}// end of updateData
	
	// Used to set up the default
	// values for buildings
	function initalizeBuildings()
	{
		var i : int = 0;
		for (i = 0; i < defaultBuildingsLength; i++)
		{
			deleteBuilding(i);
		}
	
		Debug.Log("Initalizing Buildings");
		
		defaultBuildings.clear();
		
		var temp = new Building();
		temp.buildingName = "House";
		temp.inputName.push("Fuel");
		temp.inputNum.push(1);
		temp.inputName.push("Power");
		temp.inputNum.push(1);
		temp.outputName.push("Car");
		temp.outputNum.push(1);
		temp.requisitionCost = 1;
		temp.pollutionOutput = 2;
		defaultBuildings.push(temp);	
		
		//Gas Station
		temp = new Building();
		temp.buildingName = "GasStation";
		temp.inputName.push("Power");
		temp.inputNum.push(1);
		temp.inputName.push("Petroleum");
		temp.inputNum.push(1);
		temp.outputName.push("Gas");
		temp.outputNum.push(1);
		temp.requisitionCost = 1;
		temp.pollutionOutput = 2;
		defaultBuildings.push(temp);
		
		//Refinery
		temp = new Building();
		temp.buildingName = "Refinery";
		temp.inputName.push("Power");
		temp.inputNum.push(1);
		temp.inputName.push("Car");
		temp.inputNum.push(1);
		temp.outputName.push("Petroleum");
		temp.outputNum.push(1);
		temp.requisitionCost = 1;
		temp.pollutionOutput = 2;
		defaultBuildings.push(temp);
		
		
		//Power Plant
		temp = new Building();
		temp.buildingName = "PowerPlant";
		temp.inputName.push("Car");
		temp.inputNum.push(1);
		temp.inputName.push("Petroleum");
		temp.inputNum.push(1);
		temp.outputName.push("Power");
		temp.outputNum.push(1);
		temp.requisitionCost = 1;
		temp.pollutionOutput = 2;
		defaultBuildings.push(temp);
		
		//City
		temp = new Building();
		temp.buildingName = "City";
		temp.inputName.push("Power");
		temp.inputNum.push(3);
		temp.outputName.push("Money");
		temp.outputNum.push(1);
		temp.requisitionCost = 1;
		temp.pollutionOutput = 2;
		defaultBuildings.push(temp);
		
		//Dam
		temp = new Building();
		temp.buildingName = "HydroDam";
		temp.inputName.push("Car");
		temp.inputNum.push(1);
		temp.outputName.push("Power");
		temp.outputNum.push(3);
		temp.requisitionCost = 1;
		temp.pollutionOutput = 2;
		defaultBuildings.push(temp);
		
		defaultBuildingsLength = defaultBuildings.length;
		
		updateData();
		OnDisable();
		
		
		
	}// end of initalizeBuildings
	
	//*******************************************************************************FUNCTIONS TO BE USED BY OTHER SCRIPTS:
	/*
	Use:
	DefaultBuildingEditor.getArrayOfNames();
	Purpose: will return an array of names, to be used to display a list of all the default buildings
	so the level designer can select one to place on the grid.
	*/
	static function getArrayOfNames() : String[]
	{
		var arrayOfNames : String[] = new String[defaultBuildingsLength];
		
		var i : int = 0;
		var tempString : String = "";
		
 		for (var defaultBuilding : Building in defaultBuildings)
		{
			tempString = defaultBuilding.buildingName;
			arrayOfNames[i] = tempString;
	      	i++;
		}
		
		return arrayOfNames;
	
	}// end of getArrayOfNames
	

}// end of DefaultBuildingEditor class