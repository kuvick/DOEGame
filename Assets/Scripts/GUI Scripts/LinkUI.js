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
private var inputOffset:Vector2 = new Vector2(-1.5, .5);	//Used to set position of button relative to building
private var outputOffset:Vector2 = new Vector2(-1.5, -1.5);
private var ioButtonWidth = 35;
private var ioButtonHeight = 35;
private var cancelBtnHeight:int = 27;
private var cancelBtnWidth:int = 80;
private var smallButtonScale : float = 0.05; // normal resource icon/button size
private var smallButtonSize : float;
private var largeButtonScale : float = 0.10; // resource icon/button size when building selected
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
	
	// if an allocated output was selected, perform a chain break link reallocation
	if (allocatedOutSelected)
	{
		var oldInputBuildingIndex : int = GameObject.Find("Database").GetComponent(Database).ChainBreakLink(building2Index, building1Index, selectedOutIndex, selectedResource, optionalOutputUsed, allocatedInSelected);
		if (oldInputBuildingIndex > -1)
		{
			linkReference[building1Index, building2Index] = true;
			var oldInputBuilding : GameObject = Database.getBuildingAtIndex(oldInputBuildingIndex);
			removeLink(b2, oldInputBuilding);
			gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource);
			allocatedOutSelected = false;
		}
	}
	// if an allocated input was selected, perform an overload link reallocation
	if (allocatedInSelected)
	{
		var oldOutputBuildingIndex : int = GameObject.Find("Database").GetComponent(Database).OverloadLink(building2Index, building1Index, selectedInIndex, selectedResource, optionalOutputUsed, allocatedOutSelected);
		if (oldOutputBuildingIndex > -1)
		{
			linkReference[building1Index, building2Index] = true;
			var oldOutputBuilding : GameObject = Database.getBuildingAtIndex(oldOutputBuildingIndex);
			removeLink(b1, oldOutputBuilding);
			gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource);
			allocatedInSelected = false;
		}
		
	}
	// otherwise, perform a normal building link
	else if(GameObject.Find("Database").GetComponent(Database).linkBuildings(building2Index, building1Index, selectedResource, optionalOutputUsed) && (!isLinked(b1, b2)))
	{
		linkReference[building1Index, building2Index] = true;
		gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource);
	}
	
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
		
		outputRect = Rect(point.x + outputOffset.x, point.y + outputOffset.y, smallButtonSize, smallButtonSize);
		inputRect = Rect(point.x + inputOffset.x, point.y + inputOffset.y, smallButtonSize, smallButtonSize);
		
		inputRect = DrawInputButtons(inputRect, gridBuilding.unallocatedInputs, unallocatedInputTex, building, false);
		//inputRect.x += smallButtonSize + (2 * buttonSpacing);
		inputRect = DrawInputButtons(inputRect, gridBuilding.allocatedInputs, allocatedInputTex, building, true);
		
		outputRect = DrawOutputButtons(outputRect, gridBuilding.unallocatedOutputs, unallocatedOutputTex, building, false);
		//outputRect.x += smallButtonSize + (2 * buttonSpacing);
		outputRect = DrawOutputButtons(outputRect, gridBuilding.allocatedOutputs, allocatedOutputTex, building, true);
		/*if (building == selectedBuilding)
			buildingHighlightColor = selectedHighlightColor;*/
		var optionalButtonSize = largeButtonSize;
		if (selectedBuilding != building || gridBuilding.unit != UnitType.Worker || !gridBuilding.isActive)
		{
			GUI.enabled = false;
			GUI.color = guiDisabledColor;
			optionalButtonSize = smallButtonSize;
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
	
	/*if(selectedBuilding == null)
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
			if(gridBuilding == null)
				return;
	
			inputCount = gridBuilding.unallocatedInputs.Count;//gridBuilding.inputNum.length;
			outputCount = gridBuilding.unallocatedOutputs.Count;//gridBuilding.outputNum.length;
																	
			point = Camera.main.WorldToScreenPoint(target.position);
			
			point.y = Screen.height - point.y; //adjust height point
			
			if(point.y < 0) //Adjust y value of button for screen space
				point.y -= Screen.height;
			
			//Set position of buttons
			var unallocatedRect:Rect = Rect(point.x + unallocatedOffset.x, 
							point.y + unallocatedOffset.y, ioButtonWidth, ioButtonHeight);
			var allocatedRect:Rect = Rect(point.x + allocatedOffset.x, 
							point.y + allocatedOffset.y, ioButtonWidth, ioButtonHeight);
						
			//prototype
			if(building != selectedBuilding)
			{
				
				if(building == null || selectedBuilding == null || !isInRange(building, selectedBuilding)) continue;
				// iterate through input arrays and draw appropriate input buttons
				DrawInputButtons(unallocatedRect, gridBuilding.unallocatedInputs, unallocatedInputTex, building, false);
				DrawInputButtons(allocatedRect, gridBuilding.allocatedInputs, allocatedInputTex, building, true);
			}
			
			//Instructions for output button
			else
			{	
				ModeController.setCurrentMode(GameState.LINK);

				unallocatedRect = DrawOutputButtons(unallocatedRect, gridBuilding.unallocatedOutputs, unallocatedOutputTex, building, false);
				allocatedRect = DrawOutputButtons(allocatedRect, gridBuilding.allocatedOutputs, allocatedOutputTex, building, true);
				
				if (gridBuilding.optionalOutput == ResourceType.None)
					continue;

				var optionalRect : Rect;
				if (gridBuilding.optionalOutputAllocated)
					optionalRect = allocatedRect;
				else
					optionalRect = unallocatedRect;
					
				optionalRect.y += ioButtonHeight + 3;
					
				GUILayout.BeginArea(optionalRect);
				// if the selected building's optional outputs aren't active, deactivate button
				if (gridBuilding.unit != UnitType.Worker || !gridBuilding.isActive)
					GUI.enabled = false;
				if (GUILayout.Button("OO")) 
				{
					outputBuilding = building;
					optionalOutputUsed = true;
					selectedResource = selectedGridBuilding.optionalOutput;
				}
				GUI.enabled = true;
				GUILayout.EndArea();
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
	}*/
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
		if (GUI.Button(buttonRect, textureArray[resourceList[i] - 1]))
		{
			inputBuilding = building;
			selectedInIndex = i;
			allocatedInSelected = isAllocated;
		}
		GUI.enabled = true;
		// increment position offset
		buttonRect.x += drawnButtonSize + buttonSpacing;
	}
	GUI.color = guiEnabledColor;
	return buttonRect;
}

function DrawOutputButtons (buttonRect : Rect, resourceList : List.<ResourceType>, textureArray : Texture2D[],
								building : GameObject, isAllocated : boolean) : Rect
{
	var drawnButtonSize : float = smallButtonSize;
	for(var i = 0; i < resourceList.Count; i++)
	{
		GUI.enabled = false;	// output buttons unselected buildings are disabled
		GUI.color = guiDisabledColor;	// counteracts inactive button transparency
		// output buttons only active if building is active and selected
		if (building == selectedBuilding && selectedGridBuilding.isActive)
		{
			drawnButtonSize = largeButtonSize;
			GUI.enabled = true;
			GUI.color = guiEnabledColor;
		}
		else
			drawnButtonSize = smallButtonSize;
			
		buttonRect.width = drawnButtonSize;
		buttonRect.height = drawnButtonSize;
		GUIManager.Instance().SetNotOnOtherGUI(!buttonRect.Contains(mousePos));
		if (GUI.Button(buttonRect, textureArray[resourceList[i] - 1]))
		{
			outputBuilding = building;
			selectedResource = resourceList[i];
			selectedOutIndex = i;
			allocatedOutSelected = isAllocated;
			selectedGridBuilding.unitSelected = false;
		}
		GUI.enabled = true;
		// increment position offset
		buttonRect.x += drawnButtonSize + buttonSpacing;
	}
	GUI.color = guiEnabledColor;
	return buttonRect;
}

private function ResetLinkVariables()
{
	inputBuilding = null;
	outputBuilding = null;
	optionalOutputUsed = false;
	selectedResource = ResourceType.None;
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
		allocatedInSelected = Database.getBuildingOnGrid(selectedBuilding.transform.position).allocatedInputs.Contains(selectedResource);
	}
	
	if(inputBuilding != null && outputBuilding != null)
	{
		if(isInRange(inputBuilding, outputBuilding)) //If the buildings are within range, connect them
		{
			linkBuildings(inputBuilding, outputBuilding);
		}
		
		ResetLinkVariables();//inputBuilding = null; outputBuilding = null; //resets either way
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