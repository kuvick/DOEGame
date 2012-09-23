/*
LoadDataFromEditors
Started By Katharine Uvick

Use this script to load data from Editors in-game, for each editor a different function, and add the function
to the start function.

*/

function Start ()
{
	loadFromBuildingsOnGridEditor();
	loadFromDefaultBuildingEditor();
}

function loadFromBuildingsOnGridEditor()
{
	Database.buildingsOnGrid.clear();
	var j : int = 0;
	
	if(EditorPrefs.HasKey("buildingsOnGridLength"))
	{
		var buildingsOnGridLength = EditorPrefs.GetInt("buildingsOnGridLength");
		
		
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
					var tempUnit = EditorPrefs.GetString(tempString);
					
					if( tempUnit == UnitType.None.toString() )
						temp.unit = UnitType.None;
					else if( tempUnit == UnitType.Worker.toString() )
						temp.unit = UnitType.Worker;
					else if( tempUnit == UnitType.Researcher.toString() )
						temp.unit = UnitType.Researcher;	
					else if( tempUnit == UnitType.Regulator.toString() )
						temp.unit = UnitType.Regulator;
					else if( tempUnit == UnitType.EnergyAgent.toString() )
						temp.unit = UnitType.EnergyAgent;	
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
				
				PlaceBuilding.Place(temp.coordinate, true, temp.idea, temp.event, temp.isActive); // to place on grid
				Database.copyBuildingOnGrid( temp, Database.buildingsOnGrid[Database.buildingsOnGrid.length - 1] );	// thus changes to any custom values
				
			}//end of for loop
		}// end of if length > 0
	}// end of if HasKey
}

function loadFromDefaultBuildingEditor()
{
	Database.buildings.clear();
	var i : int;
	var j : int;

#if UNITY_EDITOR
	if(EditorPrefs.HasKey("defaultBuildingsLength"))
	{
		Debug.Log("Loading Data: " + EditorPrefs.GetInt("defaultBuildingsLength"));
		
		var defaultBuildingsLength : int = EditorPrefs.GetInt("defaultBuildingsLength");
		
		
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
				
				Debug.Log("Pushing building: " + temp.buildingName);
				Database.buildings.push(temp);
				
			}//end of for loop
		}// end of if length > 0
	}// end of if HasKey
#endif
}// end of loadFromDefaultBuildingEditor()
