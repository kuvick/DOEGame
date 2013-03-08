#pragma strict

/*	LinkUI.js
	Author: Justin Hinson
	
	This script displays an input and output button for each object tagged "Building".
	Buildings may be linked by clicking and dragging from one buildings input to 
	another's output, or vice versa. Buildings may only be linked if they are within
	each others linkRange.
	
*/

private var numBuildings:int;
private var inputBuilding:GameObject;
private var outputBuilding:GameObject;
private var selectedOutputIndex : int;
private var inputOffset:Vector2 = new Vector2(-20, -40);	//Used to set position of button relative to building
private var outputOffset:Vector2 = new Vector2(20, -40);
private var ioButtonWidth = 35;
private var ioButtonHeight = 35;
private var cancelBtnHeight:int = 27;
private var cancelBtnWidth:int = 80;
private var target:Transform;			//Transform of building that button corresponds to
private var point:Vector3;				//Used to obtain position of IO button in screen space
private var inputRect:Rect;				//Rect for Area of input button
private var outputRect:Rect;			//Rect for Area of output button
private var cancelBtnRect:Rect;
private var mousePos:Vector2;
private var selectedBuilding:GameObject;
static public var cancelLinkMode:boolean;
static private var mouseOverGUI:boolean;	//Use this to disable raycasting when clicking on the GUI

//Reference for linked buildings. 
//Buildings i and j are linked if linkReference[i,j] == true OR linkReference[j,i] == true
public var linkReference:boolean[,];
public var buildings:GameObject[];
static public var linkRange:Vector3;// = Vector3(400, 400, 400);
static var tileRange = Database.TILE_RANGE;
private var gridBuilding:BuildingOnGrid;
private var selectedGridBuilding:BuildingOnGrid;
private var selectedBuildingOutputs:List.<ResourceType>;
private var buildingInputNum:int;
private var buildingOutputNum:int;
private var optionalOutputUsed : boolean = false;
private var outputCount:int;
private var inputCount:int;
private var cancelRect:Rect = Rect(Screen.width/2 - cancelBtnWidth, Screen.height - 50, cancelBtnWidth, cancelBtnHeight);

public var unallocatedInputTex : Texture2D[];
public var allocatedInputTex : Texture2D[];
public var unallocatedOutputTex : Texture2D[];
public var allocatedOutputTex : Texture2D[];

private var displayLink : DisplayLinkRange;


function Start () {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
	cancelLinkMode = false;
	mouseOverGUI = false;
	displayLink = gameObject.GetComponent(DisplayLinkRange);
	Debug.Log("linkui" + buildings.Length);
}

//This function returns true if buildings b1 and b2 are linked
function isLinked(b1:GameObject, b2:GameObject){
	var b1Index:int;
	var b2Index:int;
	
	for(var b:int; b < buildings.length; b++){
		if(buildings[b] == b1)
			b1Index = b;
		else if(buildings[b] == b2)
			b2Index = b;
	}
	return ((linkReference[b1Index, b2Index]) || (linkReference[b2Index, b1Index]));
}

// This function is used to link buildings b1 and b2
// An error message is printed if the buildings are already linked
function linkBuildings(b1:GameObject, b2:GameObject){

	var linkBuilding = Database.getBuildingOnGrid(b2.transform.position);
	var building1TileCoord = HexagonGrid.worldToTileCoordinates(b1.transform.position.x, b1.transform.position.z);
	var building2TileCoord = HexagonGrid.worldToTileCoordinates(b2.transform.position.x, b2.transform.position.z);
	
	var building1Index:int = Database.findBuildingIndex(new Vector3(building1TileCoord.x, building1TileCoord.y, 0.0));
	var building2Index:int = Database.findBuildingIndex(new Vector3(building2TileCoord.x, building2TileCoord.y, 0.0));
	var resource:ResourceType;
	var hasOptional:boolean = (linkBuilding.optionalOutput != ResourceType.None && !linkBuilding.optionalOutputAllocated//linkBuilding.optionalOutputName.length > 0 && linkBuilding.optionalOutputNum.length > 0
								&& linkBuilding.unit == UnitType.Worker && linkBuilding.isActive);
	
	/*if(linkBuilding.outputName.length > 0)
		resource = linkBuilding.outputName[0];*/
	if (optionalOutputUsed)
		resource = linkBuilding.optionalOutput;
	else
		resource = linkBuilding.unallocatedOutputs[selectedOutputIndex];
	Debug.Log("resource: " + resource.ToString());
	if(GameObject.Find("Database").GetComponent(Database).linkBuildings(building2Index, building1Index, resource, optionalOutputUsed) && (!isLinked(b1, b2)))
	{
		linkReference[building1Index, building2Index] = true;
		Debug.Log("should link");
		//These next two lines may not have to be here, will test further -WF
		/*inputCount = Database.getBuildingOnGrid(b1.transform.position).inputNum.length;
		outputCount = linkBuilding.outputNum.length;*/
	}
	optionalOutputUsed = false;
}

//This function returns true if b2 is in b1's range
static function isInRange(b1:GameObject, b2:GameObject)
{
	var b1Position:Vector3 = b1.transform.position;
	var b2Position:Vector3 = b2.transform.position;
	
		
	//if(Mathf.Abs(b2Position.x - b1Position.x) < (HexagonGrid.tileWidth * tileRange))
	if(Vector3.Distance(b1Position, b2Position) < (HexagonGrid.tileWidth * (tileRange)))
	{
		//Debug.Log("in range");
		return true;
		}
	//Debug.Log("not in range");
	return false;
}

function UpdateBuildingCount(curBuildings:GameObject[]):void
{
	buildings = curBuildings;
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
}

function OnGUI()
{
	if(ModeController.getCurrentMode() == GameState.LINK)
		cancelLinkMode = false;
	else
		cancelLinkMode = true;
	
	if(buildings.Length == 0)
		return; 
	
	if(selectedBuilding == null)
		return;
		
	selectedGridBuilding = Database.getBuildingOnGrid(selectedBuilding.transform.position);
	selectedBuildingOutputs = selectedGridBuilding.unallocatedOutputs;
	
	if(selectedGridBuilding.buildingName != "BuildingSite")
	{
		//Draw IO buttons
		for(var building:GameObject in buildings)
		{
			//Debug.Log("GUI GUI");
			if(building == null) return;
			
			target = building.transform;
			gridBuilding = Database.getBuildingOnGrid(target.position);
			if(gridBuilding == null)// || gridBuilding.outputNum.length <= 0)// || gridBuilding.inputNum.length <= 0)
				return;
			//Debug.Log("building: " + gridBuilding.buildingName);// + " input count: " + inputCount);	
			inputCount = gridBuilding.unallocatedInputs.Count;//gridBuilding.inputNum.length;
			outputCount = gridBuilding.unallocatedOutputs.Count;//gridBuilding.outputNum.length;
			
			//buildingOutputNum = gridBuilding.outputNum[0];
																	
			point = Camera.main.WorldToScreenPoint(target.position);
			
			point.y = Screen.height - point.y; //adjust height point
			
			if(point.y < 0) //Adjust y value of button for screen space
				point.y -= Screen.height;
			
			//Set position of buttons
			var inputRect:Rect = Rect(point.x + inputOffset.x, 
							point.y + inputOffset.y, ioButtonWidth, ioButtonHeight);
			var outputRect:Rect = Rect(point.x + outputOffset.x, 
							point.y + outputOffset.y, ioButtonWidth, ioButtonHeight);
						
			//prototype
			if(building != selectedBuilding)
			{
				
				if(building == null || selectedBuilding == null || !isInRange(building, selectedBuilding)) continue;
				//Debug.Log("should draw" + gridBuilding.buildingName);
				// iterate through input arrays and draw appropriate input buttons
				for(var input = 0; input < inputCount; input++)
				{
					//Debug.Log("should draw");
					//buildingInputNum = gridBuilding.inputNum[input];
					if(input > 0)
						inputRect.y += ioButtonHeight + 3;
					
					//for(var i = 0; i < gridBuilding.unallocatedInputs.Count; i++)
					//{
						/*if(input > 0)
							inputRect.y += 30;*/
						GUI.enabled = false;
						
						// check if the selected building has a matching output, if so make input button active
						if (selectedBuildingOutputs.Contains(gridBuilding.unallocatedInputs[input]))
						//for (var outp:String in selectedBuildingOutputs)
						//{
							//if (gridBuilding.inputName[input] == outName)
						{
							GUI.enabled = true;
							//break;
						}
						//}
						// if selected building's optional outputs are active, check if it has a matching output
						// if so make input button active
						if (selectedGridBuilding.unit == UnitType.Worker && selectedGridBuilding.isActive)
						{
							//for (outName in selectedGridBuilding.optionalOutputName)
							//{
								if (gridBuilding.unallocatedInputs[input] == selectedGridBuilding.optionalOutput)//gridBuilding.inputName[input] == outName)
								{
									GUI.enabled = true;
									//break;
								}
						//}
						}
						
						GUILayout.BeginArea(inputRect);
						if (GUILayout.Button(unallocatedInputTex[gridBuilding.unallocatedInputs[input] - 1]))//"I"))
							inputBuilding = building;
						/*if(mousePos.x >= inputRect.x && mousePos.x <= inputRect.x + inputRect.width &&
							mousePos.y >= inputRect.y && mousePos.y <= inputRect.y + inputRect.height)
						{
							mouseOverGUI = true;
						
							if(Input.GetMouseButtonDown(0))
							{
								inputBuilding = building;
							}
						}
						else mouseOverGUI = false;*/
						GUILayout.EndArea();
						GUI.enabled = true;
					//}
				}
	
			}
			
			//Instructions for output button
			else
			{	
				//if(gridBuilding.unallocatedOutputs.Count <= 0)//outputNum.length <= 0)
					//continue;//return;
				ModeController.setCurrentMode(GameState.LINK);
				//buildingOutputNum = gridBuilding.outputNum[0];
				// iterate through output arrays and draw appropriate output buttons
				for(var j = 0; j < gridBuilding.unallocatedOutputs.Count; j++)
				{
					if(j > 0)
						outputRect.y += ioButtonHeight + 3;
					
					GUILayout.BeginArea(outputRect);
					if (GUILayout.Button(unallocatedOutputTex[gridBuilding.unallocatedOutputs[j] - 1]))//"O")) 
					{
						outputBuilding = building;
						selectedOutputIndex = j;
						Debug.Log("output index: " + selectedOutputIndex);
					}
					/*if(mousePos.x >= outputRect.x && mousePos.x <= outputRect.x + outputRect.width &&
						mousePos.y >= outputRect.y && mousePos.y <= outputRect.y + outputRect.height)
					{
						mouseOverGUI = true;
					
						if(Input.GetMouseButtonDown(0))
						{
							outputBuilding = building;
						}
					}
					else mouseOverGUI = false;*/
					GUILayout.EndArea();
				}
				if (gridBuilding.optionalOutput == ResourceType.None)//optionalOutputNum.length <= 0)
					continue;//return;
				//buildingOutputNum = gridBuilding.optionalOutputNum[0];
				// iterate through optional output arrays and draw appropriate output buttons
				/*for (j = 0; j < buildingOutputNum; j++)
				{*/
					outputRect.y += ioButtonHeight + 3;
					
					GUILayout.BeginArea(outputRect);
					// if the selected building's optional outputs aren't active, deactivate button
					if (gridBuilding.unit != UnitType.Worker || !gridBuilding.isActive)
						GUI.enabled = false;
					if (GUILayout.Button("OO")) 
					{
						outputBuilding = building;
						optionalOutputUsed = true;
					}
					/*if(mousePos.x >= outputRect.x && mousePos.x <= outputRect.x + outputRect.width &&
						mousePos.y >= outputRect.y && mousePos.y <= outputRect.y + outputRect.height)
					{
						mouseOverGUI = true;
					
						if(Input.GetMouseButtonDown(0))
						{
							outputBuilding = building;
						}
					}
					else mouseOverGUI = false;*/
					GUI.enabled = true;
					GUILayout.EndArea();
				
				//}
			}
		}
		
		if(!cancelLinkMode)
		{
			//Draw Cancel button
			GUILayout.BeginArea(cancelRect);
			GUILayout.Button("Cancel");
			if(mousePos.x >= cancelRect.x && mousePos.x <= cancelRect.x + cancelRect.width &&
						mousePos.y >= cancelRect.y && mousePos.y <= cancelRect.y + cancelRect.height)
			{
				if(Input.GetMouseButtonDown(0))
				{
					cancelLinkMode = true;
					displayLink.DestroyRangeTiles();
					outputBuilding = null;
				}
				mouseOverGUI = true;
			}
			else mouseOverGUI = false;
			GUILayout.EndArea();
		}
	}
}

function Update() 
{
	//get current mouse position & adjust y-value for screen space
	mousePos = Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
	
	//mouseOverGUI = false;
	selectedBuilding = ModeController.getSelectedBuilding();
	
	if(inputBuilding != null && outputBuilding != null)
	{
		if(isInRange(inputBuilding, outputBuilding)) //If the buildings are within range, connect them
		{
			linkBuildings(inputBuilding, outputBuilding);
		}
		
		inputBuilding = null; outputBuilding = null; //resets either way
	}
	

}

static function MouseOverLinkGUI():boolean{
	return mouseOverGUI;
}

static function CancelLinkMode():boolean{
	return cancelLinkMode;
}

static function setLinkMode(mode:boolean){
	cancelLinkMode = mode;
}