#pragma strict

/*	LinkUI.js
	Author: Justin Hinson
	
	This script displays an input and output button for each object tagged "Building".
	Buildings may be linked by clicking and dragging from one buildings input to 
	another's output, or vice versa. Buildings may only be linked if they are within
	each others linkRange.
	
*/

//private enum mousePhases {BeforeClick, InputSelected, OutputSelected, ClickEnded}
//private var phase:mousePhases = mousePhases.BeforeClick;
private var numBuildings:int;
private var inputBuilding:GameObject;
private var outputBuilding:GameObject;
private var inputOffset:Vector2 = new Vector2(-20, -40);	//Used to set position of button relative to building
private var outputOffset:Vector2 = new Vector2(20, -40);
private var ioButtonWidth = 27;
private var ioButtonHeight = 27;
private var cancelBtnHeight:int = 27;
private var cancelBtnWidth:int = 80;
private var target:Transform;		//Transform of building that button corresponds to
private var point:Vector3;			//Used to obtain position of IO button in screen space
private var inputRect:Rect;			//Rect for Area of input button
private var outputRect:Rect;		//Rect for Area of output button
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
private var buildingInputNum:int;
private var buildingOutputNum:int;
private var outputCount:int;
private var inputCount:int;

private var displayLink : DisplayLinkRange;


function Start () {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
	cancelLinkMode = false;
	mouseOverGUI = false;
	displayLink = gameObject.GetComponent(DisplayLinkRange);
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

//This function is used to link buildings b1 and b2
//An error message is printed if the buildings are already linked
function linkBuildings(b1:GameObject, b2:GameObject){

	var linkBuilding = Database.getBuildingOnGrid(b2.transform.position);
	var building1TileCoord = HexagonGrid.worldToTileCoordinates(b1.transform.position.x, b1.transform.position.z);
	var building2TileCoord = HexagonGrid.worldToTileCoordinates(b2.transform.position.x, b2.transform.position.z);
	
	var building1Index:int = Database.findBuildingIndex(new Vector3(building1TileCoord.x, building1TileCoord.y, 0.0));
	var building2Index:int = Database.findBuildingIndex(new Vector3(building2TileCoord.x, building2TileCoord.y, 0.0));
	var resource:String = "";
	var hasOptional:boolean = (linkBuilding.optionalOutputName.length > 0 && linkBuilding.optionalOutputNum.length > 0);
	
	if(linkBuilding.outputName.length > 0)
		resource = linkBuilding.outputName[0];
	
	//Debug.Log("Building 1 index: " + building1Index + " Building 2 index: " + building2Index);
	
	if(GameObject.Find("Database").GetComponent(Database).linkBuildings(building2Index, building1Index, resource, hasOptional) && (!isLinked(b1, b2)))
	{
		linkReference[building1Index, building2Index] = true;
		
		//These next two lines may not have to be here, will test further -WF
		inputCount = Database.getBuildingOnGrid(b1.transform.position).inputNum.length;
		outputCount = linkBuilding.outputNum.length;
	}
}

//This function returns true if b2 is in b1's range
static function isInRange(b1:GameObject, b2:GameObject)
{
	var b1Position:Vector3 = b1.transform.position;
	var b2Position:Vector3 = b2.transform.position;
		
	if(Mathf.Abs(b2Position.x - b1Position.x) <= (HexagonGrid.tileWidth * tileRange))
		return true;
		
	return false;
}

function UpdateBuildingCount(curBuildings:GameObject[]):void
{
	buildings = curBuildings;
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
	//Debug.Log("Updating building count from LinkUI.js");
}

function OnGUI()
{
	if(ModeController.getCurrentMode() == GameState.LINK)
		cancelLinkMode = false;
	else
		cancelLinkMode = true;
	
	if(buildings.Length == 0)
		return; //no point in updating 
	
	//Draw IO buttons
	for(var building:GameObject in buildings)
	{
		//Debug.Log("GUI GUI");
		if(building == null) return;
		
		target = building.transform;
		gridBuilding = Database.getBuildingOnGrid(target.position);
		
		if(gridBuilding == null || gridBuilding.inputNum.length <= 0 || gridBuilding.outputNum.length <= 0)
			return;
			
		inputCount = gridBuilding.inputNum.length;
		outputCount = gridBuilding.outputNum.length;
		
		buildingOutputNum = gridBuilding.outputNum[0];
																
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
			if(building == null || selectedBuilding == null || !isInRange(building.gameObject, selectedBuilding.gameObject)) continue;
		
			for(var input = 0; input < inputCount; input++)
			{
				buildingInputNum = gridBuilding.inputNum[input];
				if(input > 0)
					inputRect.y += 30;
					
				for(var i = 0; i < buildingInputNum; i++)
				{
					if(i > 0)
						inputRect.y += 30;

					GUILayout.BeginArea(inputRect);
					GUILayout.Button("I");
					if(mousePos.x >= inputRect.x && mousePos.x <= inputRect.x + inputRect.width &&
						mousePos.y >= inputRect.y && mousePos.y <= inputRect.y + inputRect.height)
					{
						mouseOverGUI = true;
					
						if(Input.GetMouseButtonDown(0))
						{
							inputBuilding = building;
						}
					}
					GUILayout.EndArea();
				}
			}

		}
		
		//Instructions for output button
		else
		{	
			ModeController.setCurrentMode(GameState.LINK);
		
			for(var j = 0; j < buildingOutputNum; j++)
			{
				if(j > 0)
					outputRect.y += 30;
				
				GUILayout.BeginArea(outputRect);
				GUILayout.Button("O");
				if(mousePos.x >= outputRect.x && mousePos.x <= outputRect.x + outputRect.width &&
					mousePos.y >= outputRect.y && mousePos.y <= outputRect.y + outputRect.height)
				{
					mouseOverGUI = true;
				
					if(Input.GetMouseButtonDown(0))
					{
						outputBuilding = building;
					}
				}
				GUILayout.EndArea();
			}
		}
	}
	
	if(!cancelLinkMode)
	{
		//Draw Cancel button
		var cancelRect:Rect = Rect(Screen.width - 100, Screen.height - 50, cancelBtnWidth, cancelBtnHeight);
		GUILayout.BeginArea(cancelRect);
		GUILayout.Button("Cancel");
		if(mousePos.x >= cancelRect.x && mousePos.x <= cancelRect.x + cancelRect.width &&
					mousePos.y >= cancelRect.y && mousePos.y <= cancelRect.y + cancelRect.height)
		{
			mouseOverGUI = true;
		}
		GUILayout.EndArea();
	}
}

function Update() 
{
	//get current mouse position & adjust y-value for screen space
	mousePos = Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
	
	mouseOverGUI = false;
	selectedBuilding = ModeController.getSelectedBuilding();
	
	if(!cancelLinkMode && Input.GetMouseButtonDown(0))
	{
		Debug.Log(ModeController.getCurrentMode());
		cancelLinkMode = true;
		displayLink.DestroyRangeTiles();
		outputBuilding = null;
	}
	
	if(inputBuilding != null && outputBuilding != null)
	{
		if(isInRange(inputBuilding, outputBuilding)) //If the buildings are within range, connect them
		{
			linkBuildings(inputBuilding, outputBuilding);
			//Debug.Log("Link count: " + this.gameObject.GetComponent(DrawLinks).addObjectsToBuildings());
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