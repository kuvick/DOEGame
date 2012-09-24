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
static private var cancelLinkMode:boolean;
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

function Start () {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
	cancelLinkMode = false;
	mouseOverGUI = false;
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
	var b1Index:int;
	var b2Index:int;
	
	for(var b:int; b < buildings.length; b++){
		if(buildings[b] == b1)
			b1Index = b;
		else if(buildings[b] == b2)
			b2Index = b;
	}
	
	if(isLinked(b1, b2)){
		Debug.Log(b1.name + " and " + b2.name + 
				" are already linked");
	}
	else{
		linkReference[b1Index, b2Index] = true;
		Debug.Log("Buildings Linked");
	}
}

//This function returns true if b2 is in b1's range
static function isInRange(b1:GameObject, b2:GameObject)
{
	var b1Position:Vector3 = b1.transform.position;
	var b2Position:Vector3 = b2.transform.position;
		
	if(Mathf.Abs(b2Position.x - b1Position.x) <= HexagonGrid.tileWidth * tileRange)
		return true;
		
	return false;
}

function UpdateBuildingCount(curBuildings:GameObject[]):void
{
	buildings = curBuildings;
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
	Debug.Log("Updating building count from LinkUI.js");
}

function OnGUI()
{
	//cancelLinkMode = false;
	
	if(buildings.Length == 0)
		return; //no point in updating 
	
	//Draw IO buttons
	for(var building:GameObject in buildings)
	{
		target = building.transform;
		gridBuilding = Database.getBuildingOnGrid(target.position);
		Debug.Log(gridBuilding.inputNum.length);
		
		if(gridBuilding.inputNum.length > 0)
			buildingInputNum = gridBuilding.inputNum[0];
		
		if(gridBuilding.outputNum.length > 0)
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
			if(buildingInputNum == null || buildingOutputNum == null) return;
		
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
		
		//Instructions for output button
		else
		{	
		
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
	
	//Draw Cancel button
	var cancelRect:Rect = Rect(Screen.width - 100, Screen.height - 50, cancelBtnWidth, cancelBtnHeight);
	GUILayout.BeginArea(cancelRect);
	GUILayout.Button("Cancel");
	if(mousePos.x >= cancelRect.x && mousePos.x <= cancelRect.x + cancelRect.width &&
				mousePos.y >= cancelRect.y && mousePos.y <= cancelRect.y + cancelRect.height)
	{
		mouseOverGUI = true;
	
		if(Input.GetMouseButtonDown(0))
		{
			Debug.Log("Cancel hit");
			cancelLinkMode = true;
		}
	}
	GUILayout.EndArea();
}

function Update() 
{
	//get current mouse position & adjust y-value for screen space
	mousePos = Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
	
	mouseOverGUI = false;
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