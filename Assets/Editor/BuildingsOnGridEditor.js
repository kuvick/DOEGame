/*
BuildingsOnGridEditor.js
Original Script by Katharine Uvick

This script will create a window which can be accessed under Window/Game Data Manipulation
(should use Game Data Manipulation as the extention for all editor scripts to manipulate
game data).

Can be used to EDIT buildings that have been placed on the grid.


UNDER CONSTRUCTION

*/

#pragma strict

class BuildingsOnGridEditor extends EditorWindow
{
	static var defaultBuildings : Array = new Array();

	static var selectedBuilding : int;
    static var buildingsOnGridLength : int;
    static var buildingsOnGrid : Array = new Array();
    
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
    
    static var tempBuilding : BuildingOnGrid;
    
    
    static var currentIsActive : boolean;
    static var currentCoordinate : Vector3;
    static var currentTileType : String;
    static var currentUnitType : UnitType;
    static var currentIdea : String;
    static var currentEvent : String;
    
    
    
    
    // Add menu to Windows menu
    @MenuItem ("Window/Game Data Manipulation/Buildings On Grid Editor")
    static function Init ()
    {
        // Get existing open window or if none, make a new one:        
        var window = ScriptableObject.CreateInstance.<BuildingsOnGridEditor>();
        
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
    		
    		if( buildingsOnGridLength > 0)
    		{
    			// Displays list of all buildings currently stored, for user to select and edit attributes.
    			GUILayout.Label ("Buildings On Grid (" + buildingsOnGridLength + "):", EditorStyles.boldLabel);
    			
		        for (var building : BuildingOnGrid in buildingsOnGrid)
				{
			      	if(GUILayout.Button("Edit " + building.buildingName + ", " + building.coordinate))
			      	{
			      	
						currentBuildingName = building.buildingName;
					    currentRequisitionCost = building.requisitionCost;
					    currentPollutionCost = building.pollutionOutput;
					    currentInputName = building.inputName;
					    currentInputNum = building.inputNum;
					    currentOutputName = building.outputName;
					    currentOutputNum = building.outputNum;
					    currentOptionalOutputName = building.optionalOutputName;
					    currentOptionalOutputNum = building.optionalOutputNum;
					    
					    
					    currentIsActive = building.isActive;
    					currentCoordinate = building.coordinate;
    					currentTileType = building.tileType;
					    currentUnitType = building.unit;
						currentIdea = building.idea;
						currentEvent = building.event;
					    
					    buildingIndex = i;
			      	
						selectedBuilding = 0;
			      	}
			      	i++;
		      	}
	      	}// end of if( buildingsOnGridLength > 0)
	      	
	      	
	      	// Buttons to force the editor to save, load,
	      	// or reset the data to defaults.
	      	if(GUILayout.Button("Force Save"))
		  	{
				OnDisable();
		  	}
		  	if(GUILayout.Button("Force Load"))
		  	{
				OnEnable();
		  	}
	      	
      	}// end of default view
      	
		//Edit Building View:***************************************************     	
      	else if(selectedBuilding == 0)
      	{
    		GUILayout.Label ("Edit " + currentBuildingName, EditorStyles.boldLabel);
    		GUILayout.Label ("Coordinate: " + currentCoordinate, EditorStyles.boldLabel);
    		GUILayout.Label ("TileType: " + currentTileType, EditorStyles.boldLabel);
    		GUILayout.Label ("Building Name: " + currentBuildingName, EditorStyles.boldLabel);

    		currentRequisitionCost = EditorGUILayout.IntField("Requisition Cost:", currentRequisitionCost);
    		currentPollutionCost = EditorGUILayout.IntField("Pollution Output:", currentPollutionCost);
    	
    		currentIsActive = EditorGUILayout.Toggle("Start Active?", currentIsActive);
    		currentUnitType = EditorGUILayout.EnumPopup("Unit:", currentUnitType);
    		currentIdea = EditorGUILayout.TextField("Idea:", currentIdea);
    		currentEvent = EditorGUILayout.TextField("Event:", currentEvent);
    		
    		
			
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

			    currentIsActive = false;
			    currentUnitType = UnitType.None;
				currentIdea = "";
				currentEvent = "";
	      	}	
    		
    		if(GUILayout.Button("Confirm Changes"))
	      	{
	      		tempBuilding = new BuildingOnGrid();
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

			    tempBuilding.isActive = currentIsActive;
				tempBuilding.coordinate = currentCoordinate;
				tempBuilding.tileType = currentTileType;
			    tempBuilding.unit = currentUnitType;
				tempBuilding.idea = currentIdea;
				tempBuilding.event = currentEvent;

	      		buildingsOnGrid[buildingIndex] = tempBuilding;
	      			      		
				selectedBuilding = -1;
	      	}
	      	if(GUILayout.Button("Delete Building"))
	      	{
	      		buildingsOnGrid.Splice(buildingIndex, 1);				
				deleteBuilding( buildingIndex );
				buildingsOnGridLength = buildingsOnGrid.length;
				selectedBuilding = -1;				
	      	}
      		if(GUILayout.Button("Cancel"))
	      	{
				selectedBuilding = -1;
	      	}
      		
      	} // end of Edit Building view
      	


    }// end of OnGUI
    
    
    // Used to load all data into the script.
    function OnEnable()
    {
    	buildingsOnGrid.clear();
    	var j : int = 0;
    	
		if(EditorPrefs.HasKey("buildingsOnGridLength"))
		{
			buildingsOnGridLength = EditorPrefs.GetInt("buildingsOnGridLength");
			
			
			if( buildingsOnGridLength > 0)
			{
				var temp : BuildingOnGrid;
				var tempString : String = "";
				var i : int = 0;
			
				for(i = 0; i < buildingsOnGridLength; i++)
				{
					temp = new BuildingOnGrid();
					
					tempString = "buildingOnGridName" + i;

					if(EditorPrefs.HasKey(tempString))
					{
						temp.buildingName = EditorPrefs.GetString(tempString);
					}
					
					tempString = "buildingOnGridRequisitionCost" + i;

					if(EditorPrefs.HasKey(tempString))
					{
						temp.requisitionCost = EditorPrefs.GetInt(tempString);
					}
					
					tempString = "buildingOnGridPollutionOutput" + i;

					if(EditorPrefs.HasKey(tempString))
					{
						temp.pollutionOutput = EditorPrefs.GetInt(tempString);
					}
					
							
					//Specific to a building on the grid------
					tempString = "buildingOnGridIsActive" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						temp.isActive = EditorPrefs.GetBool(tempString);	
					}
					
					var tempVector : Vector3 = new Vector3(0,0,0);
					
					tempString = "buildingOnGridCoordinateX" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						tempVector.x = EditorPrefs.GetFloat(tempString);	
					}
					
					tempString = "buildingOnGridCoordinateY" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						tempVector.y = EditorPrefs.GetFloat(tempString);	
					}
					
					tempString = "buildingOnGridCoordinateZ" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						tempVector.z = EditorPrefs.GetFloat(tempString);	
					}
					
					temp.coordinate = tempVector;
					
					
					tempString = "buildingOnGridTileType" + i;
					if(EditorPrefs.HasKey(tempString))
					{
						temp.tileType = EditorPrefs.GetString(tempString);	
					}
					
					tempString = "buildingOnGridUnit" + i;
					if(EditorPrefs.HasKey(tempString))
					{
						temp.unit = EditorPrefs.GetInt(tempString);
					}
					
					tempString = "buildingOnGridIdea" + i;
					if(EditorPrefs.HasKey(tempString))
					{
						temp.idea = EditorPrefs.GetString(tempString);	
					}
					
					tempString = "buildingOnGridEvent" + i;
					if(EditorPrefs.HasKey(tempString))
					{
						temp.event = EditorPrefs.GetString(tempString);	
					}
								
					//----------------------------------------
					
					tempString = "buildingOnGridInputLength" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						var inputLength : int = EditorPrefs.GetInt(tempString);
							
						if( inputLength > 0)
						{
							
							for(j = 0; j < inputLength; j++)
							{
								tempString = "buildingOnGridInputName" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.inputName.push(EditorPrefs.GetString(tempString));
								}
								
								tempString = "buildingOnGridInputNum" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.inputNum.push(EditorPrefs.GetInt(tempString));
								}
								
							}
						}//end of inputLength > 0
					}
					
					tempString = "buildingOnGridOutputLength" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						var outputLength : int = EditorPrefs.GetInt(tempString);
							
						if( outputLength > 0)
						{
							
							for(j = 0; j < outputLength; j++)
							{
								tempString = "buildingOnGridOutputName" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.outputName.push(EditorPrefs.GetString(tempString));
								}
								
								tempString = "buildingOnGridOutputNum" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.outputNum.push(EditorPrefs.GetInt(tempString));
								}
								
							}
						}//end of outputLength > 0
					}
					
					tempString = "buildingOnGridOptionalOutputLength" + i;
					
					if(EditorPrefs.HasKey(tempString))
					{
						var optionalOutputLength : int = EditorPrefs.GetInt(tempString);
							
						if( optionalOutputLength > 0)
						{
							
							for(j = 0; j < optionalOutputLength; j++)
							{
								tempString = "buildingOnGridOptionalOutputName" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.optionalOutputName.push(EditorPrefs.GetString(tempString));
								}
								
								tempString = "buildingOnGridOptionalOutputNum" + i + "_" + j;
								if(EditorPrefs.HasKey(tempString))
								{
									temp.optionalOutputNum.push(EditorPrefs.GetInt(tempString));
								}
								
							}
						}//end of outputLength > 0
					}
					
					buildingsOnGrid.push(temp);
					
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
			
			
		//Specific to a building on the grid------
		tempString = "buildingOnGridIsActive" + index;		
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		
		tempString = "buildingOnGridCoordinateX" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		tempString = "buildingOnGridCoordinateY" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		tempString = "buildingOnGridCoordinateZ" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);		
		
		tempString = "buildingOnGridTileType" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		tempString = "buildingOnGridUnit" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		tempString = "buildingOnGridIdea" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
		
		tempString = "buildingOnGridEvent" + index;
		if(EditorPrefs.HasKey(tempString))
			EditorPrefs.DeleteKey(tempString);
					
		//----------------------------------------
		
		
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
		
		EditorPrefs.SetInt("buildingsOnGridLength", buildingsOnGrid.length);
		
		for (var building : BuildingOnGrid in buildingsOnGrid)
		{
			tempString = "buildingOnGridName" + i;
			EditorPrefs.SetString(tempString, building.buildingName);
			
			tempString = "buildingOnGridRequisitionCost" + i;
			EditorPrefs.SetInt(tempString, building.requisitionCost);
			
			tempString = "buildingOnGridPollutionOutput" + i;
			EditorPrefs.SetInt(tempString, building.pollutionOutput);
			
			//Specific to a building on the grid------
			tempString = "buildingOnGridIsActive" + i;
			EditorPrefs.SetBool(tempString, building.isActive);	
			
			tempString = "buildingOnGridCoordinateX" + i;
			EditorPrefs.SetFloat(tempString, building.coordinate.x);		
			
			tempString = "buildingOnGridCoordinateY" + i;
			EditorPrefs.SetFloat(tempString, building.coordinate.y);		
			
			tempString = "buildingOnGridCoordinateZ" + i;
			EditorPrefs.SetFloat(tempString, building.coordinate.z);
			
			tempString = "buildingOnGridTileType" + i;
			EditorPrefs.SetString(tempString, building.tileType);	

			tempString = "buildingOnGridUnit" + i;
			EditorPrefs.SetInt(tempString, building.unit);	

			tempString = "buildingOnGridIdea" + i;
			EditorPrefs.SetString(tempString, building.idea);
			
			tempString = "buildingOnGridEvent" + i;
			EditorPrefs.SetString(tempString, building.event);	
						
			//----------------------------------------
			
			tempString = "buildingOnGridInputLength" + i;
			EditorPrefs.SetInt(tempString, building.inputName.length);
			
			var j : int = 0;
			for (j = 0; j < building.inputName.length; j++)
			{
				tempString = "buildingOnGridInputName" + i + "_" + j;
				
				tempName = building.inputName[j];
				EditorPrefs.SetString(tempString, tempName);
			}
			
			j = 0;
			for (j = 0; j < building.inputNum.length; j++)
			{
				tempString = "buildingOnGridInputNum" + i + "_" + j;
				tempValue = building.inputNum[j];

				EditorPrefs.SetInt(tempString, tempValue);
			}
			
			tempString = "buildingOnGridOutputLength" + i;
			EditorPrefs.SetInt(tempString, building.outputName.length);		
			
			j = 0;
			for (j = 0; j < building.outputName.length; j++)
			{
				tempString = "buildingOnGridOutputName" + i + "_" + j;
				tempName = building.outputName[j];
				EditorPrefs.SetString(tempString, tempName);
			}
			
			j = 0;
			for (j = 0; j < building.outputNum.length; j++)
			{
				tempString = "buildingOnGridOutputNum" + i + "_" + j;
				tempValue = building.outputNum[j];
				EditorPrefs.SetInt(tempString, tempValue);
			}
			
			tempString = "buildingOnGridOptionalOutputLength" + i;
			EditorPrefs.SetInt(tempString, building.optionalOutputName.length);		
			
			j = 0;
			for (j = 0; j < building.optionalOutputName.length; j++)
			{
				tempString = "buildingOnGridOptionalOutputName" + i + "_" + j;
				tempName = building.optionalOutputName[j];
				EditorPrefs.SetString(tempString, tempName);
			}
			
			j = 0;
			for (j = 0; j < building.optionalOutputNum.length; j++)
			{
				tempString = "buildingOnGridOptionalOutputNum" + i + "_" + j;
				tempValue = building.optionalOutputNum[j];
				EditorPrefs.SetInt(tempString, tempValue);
			}
			
			

			i++;
			
			
		}	
	}// end of OnDisable
	
	function OnDestroy()
	{
    	OnDisable();
	}
	
	

	
	
	
	function loadDefaultBuildings()
	{
    	defaultBuildings.clear();
    	var j : int = 0;
    	
		if(EditorPrefs.HasKey("defaultBuildingsLength"))
		{
			var defaultBuildingsLength : int = EditorPrefs.GetInt("defaultBuildingsLength");
			
			
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
		
	
	}// end of loadDefaultBuildings
	
	
	
	//*******************************************************************************FUNCTIONS TO BE USED BY OTHER SCRIPTS:
	
	/*
	Use: BuildingsOnGridEditor.addBuildingToGrid(name: string, position: vector3, tileType: string)
	Purpose: To add a building to the grid...this function will take care of saving the data too
	*/
	function addBuildingToGrid( name : String, position : Vector3, tileType : String )
	{
		loadDefaultBuildings();
		
		var temp = new BuildingOnGrid();

		for (var defaultBuilding : Building in defaultBuildings)
		{
			if( name == defaultBuilding.buildingName )
			{
			
				temp.buildingName = name;
				
				temp.inputName = new Array();
				temp.inputName = temp.inputName.Concat(defaultBuilding.inputName);
				
				temp.inputNum = new Array();
				temp.inputNum = temp.inputNum.Concat(defaultBuilding.inputNum);
				
				temp.outputName = new Array();
				temp.outputName = temp.outputName.Concat(defaultBuilding.outputName);
				
				temp.outputNum = new Array();
				temp.outputNum = temp.outputNum.Concat(defaultBuilding.outputNum);
				
				temp.optionalOutputName = new Array();
				temp.optionalOutputName = temp.optionalOutputName.Concat(defaultBuilding.optionalOutputName);
				
				temp.optionalOutputNum = new Array();
				temp.optionalOutputNum = temp.optionalOutputNum.Concat(defaultBuilding.optionalOutputNum);
				
				temp.requisitionCost = defaultBuilding.requisitionCost;
				
				temp.pollutionOutput = defaultBuilding.pollutionOutput;
				
			}
	    }
	    
	    temp.coordinate = position;
	    temp.tileType = tileType;
	    temp.idea = "";
	    temp.event = "";
	    
	    buildingsOnGrid.push(temp);
		buildingsOnGridLength = buildingsOnGrid.length;
		OnDisable();	
	
	}
	

}// BuildingsOnGridEditor