#pragma strict

/*	LinkUI.js
	Author: Justin Hinson
	
	This script displays an input and output button for each object tagged "Building".
	Buildings may be linked by clicking and dragging from one buildings input to 
	another's output, or vice versa. Buildings may only be linked if they are within
	each others linkRange.
	
*/

public var linkUISkin : GUISkin;

private var numBuildings:int;
private var inputBuilding:GameObject;
private var outputBuilding:GameObject;
private var selectedResource : ResourceType;

private var buildingIsSelected : boolean = false;

private var unallocatedOffset:Vector2 = new Vector2(-40, -40);	//Used to set position of button relative to building
private var allocatedOffset:Vector2 = new Vector2(20, -40);
private var offsetScale : float = 0.06;
private var inputOffset:Vector2 = new Vector2(-1.75, .75);	//Used to set position of button relative to building
private var outputOffset:Vector2 = new Vector2(-1.5, -2.0);
private var ioButtonWidth = 35;
private var ioButtonHeight = 35;
private var cancelBtnHeight:int = 27;
private var cancelBtnWidth:int = 80;
private var smallButtonScale : float = 0.075; // normal resource icon/button size
private var smallButtonSize : float;
private var largeButtonScale : float = 0.20; // resource icon/button size when building selected
private var largeButtonSize : float;
private var buttonSpacingScale : float = 0.0005;
private var buttonSpacing : float;

private var guiEnabledColor : Color = new Color(1,1,1,1);
private var guiDisabledColor : Color = new Color(1,1,1,2);

private var noHighlightColor : Color = new Color(1,1,1,0);
private var usableHighlightColor : Color = new Color(1,1,0,.5);
private var targetHighlightColor : Color = new Color(0,1,1,.5);
private var selectedHighlightColor : Color = new Color(0,0,0,.5);
private var buildingHighlightColor : Color;

// Screen width and height
private var screenWidth: float;
private var screenHeight: float;

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
private var allocatedInSelected : boolean = false;
private var allocatedOutSelected : boolean = false;
private var allocatedInOutSelected : boolean = false;
private var optionalOutputUsed : boolean = false;
private var selectedInIndex : int;
private var selectedOutIndex : int;
private var outputCount:int;
private var inputCount:int;
private var cancelRect:Rect = Rect(Screen.width/2 - cancelBtnWidth, Screen.height - 50, cancelBtnWidth, cancelBtnHeight);

public var unallocatedInputTex : Texture2D[];
public var allocatedInputTex : Texture2D[];
public var unallocatedOutputTex : Texture2D[];
public var allocatedOutputTex : Texture2D[];

private var activeButtonRects : List.<Rect> = new List.<Rect>();

private var displayLink : DisplayLinkRange;


function Start () {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
	cancelLinkMode = false;
	mouseOverGUI = false;
	displayLink = gameObject.GetComponent(DisplayLinkRange);
	Debug.Log("linkui" + buildings.Length);
	
	// Store window dimensions and calculate padding
	screenWidth = ScreenSettingsManager.instance.screenWidth;
	screenHeight = ScreenSettingsManager.instance.screenHeight;
	
	smallButtonSize = screenHeight * smallButtonScale;
	largeButtonSize = screenHeight * largeButtonScale;
	buttonSpacing = screenHeight * buttonSpacingScale;
	
	inputOffset *= offsetScale * screenHeight;
	outputOffset *= offsetScale * screenHeight;
	activeButtonRects.Clear();
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

//Removes links between b1 and  b2
function removeLink(b1: GameObject, b2:GameObject)
{
	var b1Index: int;
	var b2Index: int;
	for(var b: int = 0; b < buildings.length; b++)
	{
		if(buildings[b] == b1)
			b1Index = b;
		else if(buildings[b] == b2)
			b2Index = b;
	}
	
	if(linkReference[b1Index, b2Index])
		linkReference[b1Index, b2Index] = false;
	if(linkReference[b2Index, b1Index]) 
		linkReference[b2Index, b1Index] = false;
	
	
	// Destroys LineRenderer within game object	 
 	for(var child:Transform in b1.transform)
	{
		if (child.name==b2.transform.position.ToString())
		{
			Destroy(child.gameObject.GetComponent(LineRenderer));			
			break;
		}
	}
	for(var child:Transform in b2.transform)
	{
		if (child.name==b1.transform.position.ToString())
		{
			Destroy(child.gameObject.GetComponent(LineRenderer));			
			break;
		}
	}
	
	this.gameObject.GetComponent(DrawLinks).removeLink(b1Index, b2Index);
}

// This function is used to link buildings b1 and b2
// An error message is printed if the buildings are already linked
function linkBuildings(b1:GameObject, b2:GameObject){
	if (!linkClear(b1.transform.position, b2.transform.position)){
		Debug.Log("Link was not clear");
		return;
	} 

	var linkBuilding = Database.getBuildingOnGrid(b2.transform.position);
	var building1TileCoord = HexagonGrid.worldToTileCoordinates(b1.transform.position.x, b1.transform.position.z);
	var building2TileCoord = HexagonGrid.worldToTileCoordinates(b2.transform.position.x, b2.transform.position.z);
	
	var building1Index:int = Database.findBuildingIndex(new Vector3(building1TileCoord.x, building1TileCoord.y, 0.0));
	var building2Index:int = Database.findBuildingIndex(new Vector3(building2TileCoord.x, building2TileCoord.y, 0.0));
	var resource:ResourceType;
	var hasOptional:boolean = (linkBuilding.optionalOutput != ResourceType.None && !linkBuilding.optionalOutputAllocated//linkBuilding.optionalOutputName.length > 0 && linkBuilding.optionalOutputNum.length > 0
								&& linkBuilding.unit == UnitType.Worker && linkBuilding.isActive);
	var oldInputBuildingIndex : int = 0;
	var oldOutputBuildingIndex : int = 0;
	
	// if an allocated input was selected, perform an overload link reallocation
	if (allocatedInSelected)
	{
		oldOutputBuildingIndex = GameObject.Find("Database").GetComponent(Database).OverloadLink(building2Index, building1Index, selectedInIndex, selectedResource, optionalOutputUsed, allocatedOutSelected);
		if (oldOutputBuildingIndex > -1)
		{
			linkReference[building1Index, building2Index] = true;
			var oldOutputBuilding : GameObject = Database.getBuildingAtIndex(oldOutputBuildingIndex);
			removeLink(b1, oldOutputBuilding);
			gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource);			
		}		
	}
	
	// if an allocated output was selected, perform a chain break link reallocation
	if (allocatedOutSelected && oldOutputBuildingIndex > -1)
	{
		oldInputBuildingIndex = GameObject.Find("Database").GetComponent(Database).ChainBreakLink(building2Index, building1Index, selectedOutIndex, selectedResource, optionalOutputUsed, allocatedInSelected);
		if (oldInputBuildingIndex > -1)
		{
			linkReference[building1Index, building2Index] = true;
			var oldInputBuilding : GameObject = Database.getBuildingAtIndex(oldInputBuildingIndex);
			removeLink(b2, oldInputBuilding);
			gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource);
		}
	}
	// otherwise, perform a normal building link
	else if(GameObject.Find("Database").GetComponent(Database).linkBuildings(building2Index, building1Index, selectedResource, optionalOutputUsed) && (!isLinked(b1, b2)))
	{
		linkReference[building1Index, building2Index] = true;
		gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource);
	}
	allocatedInSelected = false;
	allocatedOutSelected = false;
	allocatedInOutSelected = false;
	
}

// See if we can draw a line between the two points without hitting a barrier
static function linkClear(point1 : Vector3, point2 : Vector3) : boolean{
	var mask : int = Masks.BARRIER_MASK;
	
	var outHit : RaycastHit;
	
	return (!Physics.Linecast(point1, point2, outHit, mask));
}

//This function returns true if b2 is in b1's range
static function isInRange(b1:GameObject, b2:GameObject)
{
	var b1Position:Vector3 = b1.transform.position;
	var b2Position:Vector3 = b2.transform.position;
	
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

function ReplaceBuilding (replacement : BuildingReplacement)
{
	buildings[replacement.buildingIndex] = replacement.buildingObject;
}

function OnGUI()
{
	if(ModeController.getCurrentMode() == GameState.LINK)
		cancelLinkMode = false;
	else
		cancelLinkMode = true;
	
	if(buildings.Length == 0)
		return;
		
	GUI.skin = linkUISkin;
	
	buildingIsSelected = (selectedBuilding != null);
	if (buildingIsSelected)
		selectedGridBuilding = Database.getBuildingOnGrid(selectedBuilding.transform.position);
		
	for (var building : GameObject in buildings)
	{
		if(building == null) return;
		//if (buildingIsSelected && selectedGridBuilding.isActive)
		buildingHighlightColor = noHighlightColor;
		target = building.transform;
		gridBuilding = Database.getBuildingOnGrid(target.position);
		if(gridBuilding == null)
			return;
		if ((!buildingIsSelected || !selectedGridBuilding.isActive) && (gridBuilding.isActive || building.name == "BuildingSite"))
			buildingHighlightColor = usableHighlightColor;
		point = Camera.main.WorldToScreenPoint(target.position);
		point.y = Screen.height - point.y; //adjust height point
		if(point.y < 0) //Adjust y value of button for screen space
			point.y -= Screen.height;
		
		inputRect = Rect(point.x + inputOffset.x, point.y + inputOffset.y, smallButtonSize, smallButtonSize);
		var outputOffsetScale : float = 1.0f;
		if (buildingIsSelected && building == selectedBuilding && selectedGridBuilding.isActive)
			outputOffsetScale = 2.0f;
		outputRect = Rect(point.x + outputOffset.x * outputOffsetScale, point.y + outputOffset.y * outputOffsetScale, 
							smallButtonSize, smallButtonSize);
		
		inputRect = DrawInputButtons(inputRect, gridBuilding.unallocatedInputs, unallocatedInputTex, building, false);
		//inputRect.x += smallButtonSize + (2 * buttonSpacing);
		inputRect = DrawInputButtons(inputRect, gridBuilding.allocatedInputs, allocatedInputTex, building, true);
		
		outputRect = DrawOutputButtons(outputRect, gridBuilding.unallocatedOutputs, unallocatedOutputTex, building, false);
		//outputRect.x += smallButtonSize + (2 * buttonSpacing);
		outputRect = DrawOutputButtons(outputRect, gridBuilding.allocatedOutputs, allocatedOutputTex, building, true);
		/*if (building == selectedBuilding)
			buildingHighlightColor = selectedHighlightColor;*/
		var optionalButtonSize = largeButtonSize;
		var optionalActive : boolean = true;
		if (selectedBuilding != building || gridBuilding.unit != UnitType.Worker || !gridBuilding.isActive)
		{
			GUI.enabled = false;
			//GUI.color = guiDisabledColor;
			optionalButtonSize = smallButtonSize;
			optionalActive = false;
		}
		outputRect.width = optionalButtonSize;
		outputRect.height = optionalButtonSize;
		if (gridBuilding.optionalOutput != ResourceType.None) 
		{
			var optionalOutTex : Texture;
			if (!gridBuilding.optionalOutputAllocated)
				optionalOutTex = unallocatedOutputTex[gridBuilding.optionalOutput - 1];
			else
				optionalOutTex = allocatedOutputTex[gridBuilding.optionalOutput - 1];
			if (optionalActive && !activeButtonRects.Contains(outputRect))
				activeButtonRects.Add(outputRect);
			if (GUI.Button(outputRect, optionalOutTex))
			{
				outputBuilding = building;
				optionalOutputUsed = true;
				if (gridBuilding.optionalOutputAllocated)
					allocatedOutSelected = true;
				selectedResource = gridBuilding.optionalOutput;
			}
		}
		GUI.enabled = true;
		(gridBuilding.highlighter.GetComponentInChildren(Renderer) as Renderer).material.SetColor("_Color", buildingHighlightColor);
	}
}

// iterates through the given resource list and draws the appropriate input or output buttons
function DrawInputButtons (buttonRect : Rect, resourceList : List.<ResourceType>, textureArray : Texture2D[],
								building : GameObject, isAllocated : boolean) : Rect
{
	var drawnButtonSize : float = smallButtonSize;
	for(var i = 0; i < resourceList.Count; i++)
	{
		GUI.enabled = false;	// input buttons that don't correspond to the selected building's outputs are disabled
		GUI.color = guiDisabledColor;	// counteracts inactive button transparency
		// check if the selected building has a matching output, if so make input button active and enlarge
		if (buildingIsSelected && selectedGridBuilding.isActive && building != selectedBuilding && isInRange(selectedBuilding, building) 
				&& resourceList[i] == selectedResource)//(selectedGridBuilding.unallocatedOutputs.Contains(resourceList[i]) || selectedGridBuilding.allocatedOutputs.Contains(resourceList[i])))
		{
			//drawnButtonSize = largeButtonSize;
			buildingHighlightColor = targetHighlightColor;
			//GUI.enabled = true;
			//GUI.color = guiEnabledColor;
		}

		// if selected building's optional outputs are active, check if it has a matching output
		// if so make input button active
		if (buildingIsSelected && selectedGridBuilding.unit == UnitType.Worker && selectedGridBuilding.isActive &&
			resourceList[i] == selectedGridBuilding.optionalOutput && optionalOutputUsed)
		{
			buildingHighlightColor = targetHighlightColor;
		}
		
		buttonRect.width = drawnButtonSize;
		buttonRect.height = drawnButtonSize;
		if (RectInsideGUI(buttonRect)){
			if (GUI.Button(buttonRect, textureArray[resourceList[i] - 1]))
			{
				inputBuilding = building;
				selectedInIndex = i;
				allocatedInSelected = isAllocated;
			}
			GUI.enabled = true;
			// increment position offset
		}
		buttonRect.x += drawnButtonSize + buttonSpacing;
	}
	GUI.color = guiEnabledColor;
	return buttonRect;
}

function DrawOutputButtons (buttonRect : Rect, resourceList : List.<ResourceType>, textureArray : Texture2D[],
								building : GameObject, isAllocated : boolean) : Rect
{
	var drawnButtonSize : float = smallButtonSize;
	var thisBuildingSelected : boolean = false;
	
	GUI.enabled = false;	// output buttons unselected buildings are disabled
	GUI.color = guiDisabledColor;	// counteracts inactive button transparency
	// output buttons only active if building is active and selected
	if (building == selectedBuilding && selectedGridBuilding.isActive)
	{
		drawnButtonSize = largeButtonSize;
		GUI.enabled = true;
		GUI.color = guiEnabledColor;
		thisBuildingSelected = true;
	}
	else
		drawnButtonSize = smallButtonSize;
		
	buttonRect.width = drawnButtonSize;
	buttonRect.height = drawnButtonSize;
	
	for(var i = 0; i < resourceList.Count; i++)
	{
		if (RectInsideGUI(buttonRect)){
			GUIManager.Instance().SetNotOnOtherGUI(!buttonRect.Contains(mousePos));
			if (thisBuildingSelected && !activeButtonRects.Contains(buttonRect))
				activeButtonRects.Add(buttonRect);
			if (GUI.Button(buttonRect, textureArray[resourceList[i] - 1]))
			{
				outputBuilding = building;
				selectedResource = resourceList[i];
				selectedOutIndex = i;
				allocatedOutSelected = isAllocated;
				selectedGridBuilding.unitSelected = false;
			}
			// increment position offset
		}
		buttonRect.x += drawnButtonSize + buttonSpacing;
	}
	GUI.color = guiEnabledColor;
	GUI.enabled = true;
	return buttonRect;
}

private function ResetLinkVariables()
{
	inputBuilding = null;
	outputBuilding = null;
	optionalOutputUsed = false;
	selectedResource = ResourceType.None;
	activeButtonRects.Clear();
}

function Update() 
{
	//get current mouse position & adjust y-value for screen space
	mousePos = Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
	
	//mouseOverGUI = false;
	selectedBuilding = ModeController.getSelectedBuilding();
	if (selectedBuilding == null)
		ResetLinkVariables();
	/*if (selectedBuilding != outputBuilding)
		ResetLinkVariables();*/
	if (selectedResource != ResourceType.None && selectedBuilding != outputBuilding)
	{
		inputBuilding = selectedBuilding;
		var inputBuildingOnGrid : BuildingOnGrid = Database.getBuildingOnGrid(selectedBuilding.transform.position);
		allocatedInSelected = (inputBuildingOnGrid.allocatedInputs.Contains(selectedResource) && !inputBuildingOnGrid.unallocatedInputs.Contains(selectedResource));
	}
	
	if(inputBuilding != null && outputBuilding != null)
	{
		if(isInRange(inputBuilding, outputBuilding)) //If the buildings are within range, connect them
		{
			linkBuildings(inputBuilding, outputBuilding);
		}
		ModeController.setSelectedBuilding(null);
		ResetLinkVariables();//inputBuilding = null; outputBuilding = null; //resets either way
	}
	

}

private function RectInsideGUI(rectangle : Rect){
	var screen : Rect = RectFactory.NewRect(0,0,1,1);
	return (screen.Contains(rectangle.center));
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

function CheckMouseNotOverGUI() : boolean
{
	for (var r : Rect in activeButtonRects)
	{
		if (r.Contains(mousePos))
			return false;
	}
	return true;
}