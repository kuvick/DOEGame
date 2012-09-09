/*
LoadDataFromEditors
Started By Katharine Uvick

Use this script to load data from Editors in-game, for each editor a different function, and add the function
to the start function.

*/

function Start ()
{
	//loadFromRequisitionSystemData();
	loadFromDefaultBuildingEditor();
}

/*
function loadFromRequisitionSystemData()
{
	if(EditorPrefs.HasKey("startingRequisitionPoints"))
	{
		RequisitionSystem.startingRequisitionPoints = EditorPrefs.GetInt("startingRequisitionPoints");
		
	}
	if(EditorPrefs.HasKey("lengthOfStorm"))
	{
		RequisitionSystem.lengthOfStorm = EditorPrefs.GetInt("lengthOfStorm");
		
	}
	if(EditorPrefs.HasKey("pollutionReductionByStorm"))
	{
		RequisitionSystem.pollutionReductionByStorm = EditorPrefs.GetInt("pollutionReductionByStorm");
		
	}
	if(EditorPrefs.HasKey("turnsBetweenPayDay"))
	{
		RequisitionSystem.turnsBetweenPayDay = EditorPrefs.GetInt("turnsBetweenPayDay");
		
	}
	if(EditorPrefs.HasKey("requisitionPayDay"))
	{
		RequisitionSystem.requisitionPayDay = EditorPrefs.GetInt("requisitionPayDay");
		
	}
	if(EditorPrefs.HasKey("pollutionPenaltyPercent"))
	{
		RequisitionSystem.pollutionPenaltyPercent = EditorPrefs.GetInt("pollutionPenaltyPercent");
		
	}
	if(EditorPrefs.HasKey("pollutionPenalty"))
	{
		RequisitionSystem.pollutionPenalty = EditorPrefs.GetInt("pollutionPenalty");
		
	}
	if(EditorPrefs.HasKey("stormIntervalArrayLength"))
	{
		var stormIntervalArrayLength : int = EditorPrefs.GetInt("stormIntervalArrayLength");
		var i : int;
		
		//Debug.Log("ArrayLength:" + stormIntervalArrayLength);
		
		if( stormIntervalArrayLength > 0)
		{
			RequisitionSystem.stormIntervals.clear();
			for(i = 0; i < stormIntervalArrayLength; i++)
			{
				var tempString : String = "daysTilStorm" + i;
				if(EditorPrefs.HasKey(tempString))
				{
					//Debug.Log(tempString + ": " + EditorPrefs.GetInt(tempString));
					RequisitionSystem.stormIntervals.Add(EditorPrefs.GetInt(tempString));
				}
			}
		}

	}
}// end of loadFromRequisitionSystemData()

*/

function loadFromDefaultBuildingEditor()
{
	Database.buildings.clear();
	var i : int;
	var j : int;

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
				
				Database.buildings.push(temp);
				
			}//end of for loop
		}// end of if length > 0
	}// end of if HasKey
	
}// end of loadFromDefaultBuildingEditor()
