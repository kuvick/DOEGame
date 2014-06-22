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

private var menu:MainMenu;

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
private var selectedHighlightColor : Color =  new Color(0,0,0,.5);
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
static var tileRange : float = Database.TILE_RANGE;
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


public var inputTopRing:Texture2D;
public var inputBottomRing:Texture2D;
public var outputTopRing:Texture2D;
public var outputBottomRing:Texture2D;
public var resourceIcons : ResourceImage[];

//public var unallocatedInputTex : Texture2D[];
public var allocatedInputTex : Texture2D[];

public var unallocatedInputTex : FullResourceImage[];
public var unallocatedOutputTex : FullResourceImage[];

//public var unallocatedOutputTex : Texture2D[];
public var allocatedOutputTex : Texture2D[];
public var inputIcons : GameObject[];
public var outputIcons : GameObject[];
public var optionalOutputIcons : GameObject[];

public var inactiveRingTexture : Texture2D;
public var activeRingTexture : Texture2D;
public var startingRingTexture : Texture2D;
public var activeObjectiveRingTexture : Texture2D;
public var inactiveObjectiveRingTexture : Texture2D;
public var buildingSiteRingTexture : Texture2D;
public var validTargetRingTexture : Texture2D;

private var premadeInputBuildings : List.<GameObject> = new List.<GameObject>();
private var premadeOutputBuildings : List.<GameObject> = new List.<GameObject>();

public var resourceSpacing : Vector3; // spacing between resources
public var outputStartPos : Vector3; // output icon start position relative to building
public var inputStartPos : Vector3; // input icon start position relative to building

private var activeButtonRects : List.<Rect> = new List.<Rect>();

private var displayLink : DisplayLinkRange;

public var useDragLink : boolean = true;
private var linkCaseOverride : boolean = false;

public static var fadeTimer : float = 0.5;
private static var fadeScaler : float = 1.0;

class ResourceImage
{
	public var icon:Texture2D;
	public var color:Color;
}

class FullResourceImage
{
	public var icon:Texture2D;
	public var topLayer:Texture2D;
	public var bottomLayer:Texture2D;
	public var color:Color;
	private var oldColor:Color;
	
	public function Draw(rect:Rect)
	{
		oldColor = GUI.color;
		GUI.color = Color.white;
		GUI.DrawTexture(rect, bottomLayer, ScaleMode.StretchToFill);
		GUI.DrawTexture(rect, topLayer, ScaleMode.StretchToFill);
		GUI.color = oldColor;
		GUI.DrawTexture(rect, icon, ScaleMode.StretchToFill);
	}
}

function Start () {

	unallocatedInputTex = new FullResourceImage[resourceIcons.length];
	unallocatedOutputTex = new FullResourceImage[resourceIcons.length];
	for(var m:int = 0; m < resourceIcons.length; m++)
	{
		unallocatedInputTex[m] = new FullResourceImage();
		unallocatedInputTex[m].icon = resourceIcons[m].icon;
		unallocatedInputTex[m].color = resourceIcons[m].color;
		unallocatedInputTex[m].topLayer = inputTopRing;
		unallocatedInputTex[m].bottomLayer = inputBottomRing;

		unallocatedOutputTex[m] = new FullResourceImage();
		unallocatedOutputTex[m].icon = resourceIcons[m].icon;
		unallocatedOutputTex[m].color = resourceIcons[m].color;
		unallocatedOutputTex[m].topLayer = outputTopRing;
		unallocatedOutputTex[m].bottomLayer = outputBottomRing;
	}

	menu = GameObject.Find("GUI System").GetComponent(MainMenu);
	buildings = gameObject.FindGameObjectsWithTag("Building");
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
	cancelLinkMode = false;
	mouseOverGUI = false;
	displayLink = gameObject.GetComponent(DisplayLinkRange);
	
	// Store window dimensions and calculate padding
	screenWidth = ScreenSettingsManager.instance.screenWidth;
	screenHeight = ScreenSettingsManager.instance.screenHeight;
	
	smallButtonSize = screenHeight * smallButtonScale;
	largeButtonSize = screenHeight * largeButtonScale;
	buttonSpacing = screenHeight * buttonSpacingScale;
	
	inputOffset *= offsetScale * screenHeight;
	outputOffset *= offsetScale * screenHeight;
	activeButtonRects.Clear();
	fadeTimer = 0.5f;
	fadeScaler = 1.0f;
}

function AddPremadeLink(inputBuilding : GameObject, outputBuilding : GameObject)
{
	premadeInputBuildings.Add(inputBuilding);
	premadeOutputBuildings.Add(outputBuilding);
}

function GeneratePremadeLinks()
{
	for (var i : int = 0; i < premadeInputBuildings.Count; i++)
	{
		dragLinkCases(Database.getBuildingOnGrid(premadeInputBuildings[i].transform.position), Database.getBuildingOnGrid(premadeOutputBuildings[i].transform.position));
		DragLinkBuildings(premadeInputBuildings[i], premadeOutputBuildings[i]);
	}
	premadeInputBuildings.Clear();
	premadeOutputBuildings.Clear();
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

function getOutputLinked(b1:GameObject, b2:GameObject):int
{
	var b1Index:int;
	var b2Index:int;
	
	for(var b:int; b < buildings.length; b++){
		if(buildings[b] == b1)
			b1Index = b;
		else if(buildings[b] == b2)
			b2Index = b;
	}
	return b2Index;
}



public function setValidTargetRingMaterial(obj: GameObject)
{
	obj.renderer.material.mainTexture = validTargetRingTexture;
}
public function setActiveRingMaterial(bool:boolean, obj: GameObject)
{
	if(bool)
		obj.renderer.material.mainTexture = activeRingTexture;
	else
		obj.renderer.material.mainTexture = inactiveRingTexture;
}
public function setBuildingSiteRingMaterial(obj: GameObject)
{
	obj.renderer.material.mainTexture = buildingSiteRingTexture;
}

public function GenerateBuildingResourceIcons(building : BuildingOnGrid)
{
	var startPos : Vector3 = building.buildingPointer.transform.position;
	
	// generate building resource ring
	var tempRing : GameObject = Instantiate(Resources.Load("IconPlane") as GameObject, startPos, Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0));
	var tempIndicator:BuildingIndicator = building.buildingPointer.GetComponentInChildren(BuildingIndicator);
	tempIndicator.SetResourceRing(tempRing);
	tempRing.transform.parent = building.buildingPointer.transform;
	tempRing.transform.localPosition.y = 25;
	tempRing.name = "ResourceRing";
	tempRing.transform.localScale = Vector3(15,15,15);
	tempRing.layer = 10;
	tempRing.collider.enabled = false;
	
	// generate click area
	var tempCollider : GameObject = Instantiate(Resources.Load("IconPlane") as GameObject, startPos, Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0));
	tempCollider.transform.parent = building.buildingPointer.transform;
	tempCollider.transform.localPosition.y = 25;
	tempCollider.name = "ClickCollider";
	tempCollider.transform.localScale = Vector3(15,15,15);
	tempCollider.layer = 10;
	
	if (building.buildingName.Contains("Site"))
	{
		tempRing.renderer.material.mainTexture = buildingSiteRingTexture;
		return;
	}
	else if(building.isActive)
		//tempRing.renderer.material.mainTexture = activeRingTexture;
		tempIndicator.SetImages(startingRingTexture, inactiveRingTexture, validTargetRingTexture);
	else
	{
		//tempRing.renderer.material.mainTexture = ringTexture;
		if (building.hasEvent)
			tempIndicator.SetImages(activeObjectiveRingTexture, inactiveObjectiveRingTexture, validTargetRingTexture);
		else		
			tempIndicator.SetImages(activeRingTexture, inactiveRingTexture, validTargetRingTexture);
	}
	tempIndicator.SetState(IndicatorState.Active);
	
	startPos += Utils.ConvertToRotated(inputStartPos);
	/*GenerateIconSet(building.unallocatedInputs, inputIcons, 
					building.unallocatedInputIcons, startPos, 1f, building);*/
	GenerateIconSet(building.unallInputs, inputIcons, startPos, 1f, building);
	startPos = building.buildingPointer.transform.position;
	startPos += Utils.ConvertToRotated(outputStartPos);
	/*var optPos : Vector2 = GenerateIconSet(building.unallocatedOutputs, outputIcons, 
					building.unallocatedOutputIcons, startPos, -1f, building);*/
	var optPos : Vector2 = GenerateIconSet(building.unallOutputs, outputIcons, 
											startPos, -1f, building);
	startPos.x = optPos.x;
	startPos.z = optPos.y;
	if (building.optOutput.resource != ResourceType.None)//ionalOutput != ResourceType.None)
	{
		//var tempObject : GameObject = Instantiate(optionalOutputIcons[building.optionalOutput - 1], startPos, Quaternion.identity);
		var tempObject : GameObject = Instantiate(optionalOutputIcons[building.optOutput.resource - 1], startPos, Quaternion.identity);
		var tempScript : ResourceIcon = tempObject.GetComponent(ResourceIcon);
		tempScript.Initialize(building);
		//building.optionalOutputIcon = tempScript;
		building.optOutput.SetIcon(tempScript);
	}
}

/*private function GenerateIconSet(ioputSet : List.<ResourceType>, iconPrefabSet : GameObject[], 
									buildingIconSet : List.<ResourceIcon>, startPos : Vector3, startSpacingDir : float,
									building : BuildingOnGrid) : Vector2*/
private function GenerateIconSet(ioputSet : List.<IOPut>, iconPrefabSet : GameObject[], 
									startPos : Vector3, startSpacingDir : float,
									building : BuildingOnGrid) : Vector2
{
	var xSpacing : float = 45;
	var zSpacing : float = 45;
	var pos : Vector3 = startPos;
	resourceSpacing.z = Mathf.Abs(resourceSpacing.z) * startSpacingDir;
	for (var i : int = 0; i < ioputSet.Count; i++)
	{
		//if (ioputSet[i] != ResourceType.None)
		if (ioputSet[i].resource != ResourceType.None)
		{
			//var tempObject : GameObject = Instantiate(iconPrefabSet[ioputSet[i] - 1],pos, Quaternion.identity);
			var tempObject : GameObject = Instantiate(iconPrefabSet[ioputSet[i].resource - 1],pos, Quaternion.identity);
			tempObject.transform.parent = building.buildingPointer.transform;
			var tempScript : ResourceIcon = tempObject.GetComponent(ResourceIcon);
			tempScript.Initialize(building);
			tempScript.SetIndex(i);
			//buildingIconSet.Add(tempScript);
			ioputSet[i].SetIcon(tempScript);
			pos += Utils.ConvertToRotated(resourceSpacing);
			resourceSpacing.z *= -1f;
		}
	}
	return Vector2(pos.x, pos.z);
}

//Removes links between b1 and  b2
function removeLink(b1: GameObject, b2:GameObject)
{
	/*var b1Index: int;
	var b2Index: int;
	var removeLinkReference : boolean = true;
	for(var b: int = 0; b < buildings.length; b++)
	{
		if(buildings[b] == b1)
			b1Index = b;
		else if(buildings[b] == b2)
			b2Index = b;
	}
	
	var b1Building : BuildingOnGrid = Database.getBuildingOnGrid(b1.transform.position);
	//var b2Building : BuildingOnGrid = Database.getBuildingOnGrid(b2Index);
	
	if (b1Building.inputLinkedTo.Contains (b2Index) || b1Building.outputLinkedTo.Contains(b2Index)
		|| b1Building.optionalOutputLinkedTo == b2Index)
		removeLinkReference = false;
	
	if(linkReference[b1Index, b2Index] && removeLinkReference)
		linkReference[b1Index, b2Index] = false;
	if(linkReference[b2Index, b1Index] && removeLinkReference) 
		linkReference[b2Index, b1Index] = false;
	
	
	// Destroys LineRenderer within game object	 
 	for(var child:Transform in b1.transform)
	{
		if (child.name==b2.transform.position.ToString())
		{
			Destroy(child.gameObject.GetComponent(LineRenderer));			
			//break;
		}
	}
	for(var child:Transform in b2.transform)
	{
		if (child.name==b1.transform.position.ToString())
		{
			Destroy(child.gameObject.GetComponent(LineRenderer));			
			//break;
		}
	}
	
	this.gameObject.GetComponent(DrawLinks).removeLink(b1Index, b2Index);*/
}

// This function is used to link buildings b1 and b2
// An error message is printed if the buildings are already linked
function linkBuildings(b1:GameObject, b2:GameObject){
	if (!linkClear(b1.transform.position, b2.transform.position)){
		Debug.Log("Link was not clear");
		return;
	} 

	// prevent buildings from linking to itself
	if (b1 == b2)
		return;
		
	var linkBuilding : BuildingOnGrid = Database.getBuildingOnGrid(b2.transform.position);
	var building1TileCoord = HexagonGrid.worldToTileCoordinates(b1.transform.position.x, b1.transform.position.z);
	var building2TileCoord = HexagonGrid.worldToTileCoordinates(b2.transform.position.x, b2.transform.position.z);
	
	var building1Index:int = Database.findBuildingIndex(new Vector3(building1TileCoord.x, building1TileCoord.y, 0.0));
	var building2Index:int = Database.findBuildingIndex(new Vector3(building2TileCoord.x, building2TileCoord.y, 0.0));
	var resource:ResourceType;
	var hasOptional:boolean = (linkBuilding.optOutput.resource != ResourceType.None && linkBuilding.optOutput.linkedTo >= 0//ionalOutput != ResourceType.None && !linkBuilding.optionalOutputAllocated//linkBuilding.optionalOutputName.length > 0 && linkBuilding.optionalOutputNum.length > 0
								&& linkBuilding.optionalOutputFixed && linkBuilding.isActive);
	var oldInputBuildingIndex : int = 0;
	var oldOutputBuildingIndex : int = 0;
	
	// if an allocated input was selected, perform an overload link reallocation
	if (allocatedInSelected)
	{
		Debug.Log("selected");
		oldOutputBuildingIndex = GameObject.Find("Database").GetComponent(Database).OverloadLink(building2Index, building1Index, selectedInIndex, selectedResource, optionalOutputUsed, allocatedOutSelected);
		if (oldOutputBuildingIndex > -1)
		{
			linkReference[building1Index, building2Index] = true;
			var oldOutputBuilding : GameObject = Database.getBuildingAtIndex(oldOutputBuildingIndex);
			removeLink(b1, oldOutputBuilding);
			//gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource, optionalOutputUsed);			
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
			//gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource, optionalOutputUsed);
		}
		
		//If the chain break causes the outputting building to be deactivated, undo the link.
		if(!Database.getBuildingOnGridAtIndex(building2Index).isActive)
		{
			var datab : Database = GameObject.Find("Database").GetComponent(Database);
			datab.undo();
			removeLink(b2, b1);
			SoundManager.Instance().playUndo();			
		}
		
		
	}
	// otherwise, perform a normal building link
	else if(GameObject.Find("Database").GetComponent(Database).linkBuildings(building2Index, building1Index, selectedResource, optionalOutputUsed) && (!isLinked(b1, b2)))
	{
		linkReference[building1Index, building2Index] = true;
		//gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource, optionalOutputUsed);
	}
	allocatedInSelected = false;
	allocatedOutSelected = false;
	allocatedInOutSelected = false;
}

function dragLinkCases(b1 : BuildingOnGrid, b2 : BuildingOnGrid)
{
	// case if player directly selected a link to reallocate
	
	// ... mutual linking...
	var mutualLink:boolean = false;
	if(isLinked(b1.buildingPointer, b2.buildingPointer))
	{
		//remember b2 is out and b1 is in
		// but already b1 has provided output to b2's input
		linkCaseOverride = true;
		
		//Case: Output is Unallocated
		for(var w = 0; w < b2.unallOutputs.Count; w++)//ocatedOutputs.Count; i++)
		{
			if (CheckForInput(b1, b2.unallOutputs[w].resource))//ocatedOutputs[i]))
			{
				selectedResource = b2.unallOutputs[w].resource;//ocatedOutputs[i];
			}					
		}
		
		
		var outputIndex : int = b2.FindResourceIndex(selectedResource, b2.unallOutputs);
		selectedOutIndex = outputIndex;
		mutualLink = true;
	}
	
	if (linkCaseOverride) // LINK REALLOCATION
	{
		if (optionalOutputUsed && CheckForInput(b1, b2.optOutput.resource))//ionalOutput))
		{
			selectedResource = b2.optOutput.resource;//ionalOutput;
			allocatedOutSelected = true;
			return true;
		}
		else if (!mutualLink && !optionalOutputUsed && CheckForInput(b1, b2.allOutputs[selectedOutIndex].resource))//ocatedOutputs[selectedOutIndex]))
		{
			selectedResource = b2.allOutputs[selectedOutIndex].resource;//ocatedOutputs[selectedOutIndex];
			allocatedOutSelected = true;
			return true;
		}
		// cancel link if no resource match found
		else if(!mutualLink)
		{
			//menu.missingResource();
			return false;
		}
	}
	
	//b2 : Output, b1: Input
	//if(b2.unallocatedOutputs.Count > 0 && b2.isActive)
	if(b2.unallOutputs.Count > 0 && b2.isActive)
	{
		//Case: Output is Unallocated
		for(var i = 0; i < b2.unallOutputs.Count; i++)//ocatedOutputs.Count; i++)
		{
			if (CheckForInput(b1, b2.unallOutputs[i].resource))//ocatedOutputs[i]))
			{
				selectedResource = b2.unallOutputs[i].resource;//ocatedOutputs[i];
				return true;
			}					
		}
	}				
	
	//Case : Optional Output 
	//if(b2.isActive && b2.optionalOutput != ResourceType.None && b2.optionalOutputFixed)//b2.unit != UnitType.None)
	if(b2.isActive && b2.optOutput.resource != ResourceType.None && b2.optionalOutputFixed)
	{
		if (CheckForInput(b1, b2.optOutput.resource))//ionalOutput))
		{
			selectedResource = b2.optOutput.resource;//ionalOutput;
			optionalOutputUsed = true;
			if (b2.optOutput.linkedTo >= 0)//ionalOutputAllocated)
				allocatedOutSelected = true;
			return true;
		}
	}
	
	//Case: Output is Allocated
	//if(b2.allocatedOutputs.Count > 0 && b2.isActive)
	if(b2.allOutputs.Count > 0 && b2.isActive)
	{
		//for(var k = 0; k < b2.allocatedOutputs.Count; k++)
		for(var k = 0; k < b2.allOutputs.Count; k++)
		{
			if (CheckForInput(b1, b2.allOutputs[k].resource))//ocatedOutputs[k]))
			{
				selectedResource = b2.allOutputs[k].resource;//ocatedOutputs[k];
				selectedOutIndex = k;
				allocatedOutSelected = true;
				return true;
			}
		}
		
	}
	//menu.missingResource();
	return false;
}

// checks whether a building's inputs contain the given resource
private function CheckForInput(building : BuildingOnGrid, resource : ResourceType) : boolean
{
	//Case: Input is unallocated
	if(building.unallInputs.Count > 0)//ocatedInputs.Count > 0)
	{
		for(var j : int = 0; j < building.unallInputs.Count; j++)//ocatedInputs.Count; j++)
		{
			if(building.unallInputs[j].resource == resource)//ocatedInputs[j] == resource)
			{	
				selectedResource = resource;
				return true;
			}
		}
	}
	
	//Case : Input is allocated
	if(building.allInputs.Count > 0)//ocatedInputs.Count > 0)
	{
		for(j = 0; j < building.allInputs.Count; j++)//ocatedInputs.Count; j++)
		{
			if(building.allInputs[j].resource == resource)//ocatedInputs[j] == resource)
			{
				selectedResource = resource;
				allocatedInSelected = true;
				return true;
			}
		}
	}
	return false;
}

function DragLinkBuildings(b1:GameObject, b2:GameObject){

	if (!linkClear(b1.transform.position, b2.transform.position)){
		Debug.Log("Link was not clear");
		return;
	} 	
	// prevent buildings from linking to itself
	if (b1 == b2)
		return;

	var linkBuilding = Database.getBuildingOnGrid(b2.transform.position);
	var building1TileCoord = HexagonGrid.worldToTileCoordinates(b1.transform.position.x, b1.transform.position.z);
	var building2TileCoord = HexagonGrid.worldToTileCoordinates(b2.transform.position.x, b2.transform.position.z);
	
	var building1Index:int = Database.findBuildingIndex(new Vector3(building1TileCoord.x, building1TileCoord.y, 0.0));
	var building2Index:int = Database.findBuildingIndex(new Vector3(building2TileCoord.x, building2TileCoord.y, 0.0));
	var hasOptional:boolean = (linkBuilding.optOutput.resource != ResourceType.None && linkBuilding.optOutput.linkedTo >= 0//ionalOutput != ResourceType.None && !linkBuilding.optionalOutputAllocated//linkBuilding.optionalOutputName.length > 0 && linkBuilding.optionalOutputNum.length > 0
								&& linkBuilding.optionalOutputFixed && linkBuilding.isActive);
	var oldInputBuildingIndex : int = 0;
	var oldOutputBuildingIndex : int = 0;
	
	var b1OnGrid : BuildingOnGrid = Database.getBuildingOnGridAtIndex(building1Index);
	var b2OnGrid : BuildingOnGrid = Database.getBuildingOnGridAtIndex(building2Index);
	
	if(!dragLinkCases(b1OnGrid, b2OnGrid))
		return;
	// if an allocated input was selected, perform an overload link reallocation
	if (allocatedInSelected)// && linkCaseOverride)
	{
		oldOutputBuildingIndex = GameObject.Find("Database").GetComponent(Database).OverloadLink(building2Index, building1Index, selectedInIndex, selectedResource, optionalOutputUsed, allocatedOutSelected);
		if (oldOutputBuildingIndex > -1)
		{
			linkReference[building1Index, building2Index] = true;
			var oldOutputBuilding : GameObject = Database.getBuildingAtIndex(oldOutputBuildingIndex);
			removeLink(b1, oldOutputBuilding);
			//removeLink(oldOutputBuilding, b1);
			//gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource, optionalOutputUsed);			
			// if input building and old output building were mutually linked, redraw the link that still remains
			/*var oldOutputBuildingOnGrid : BuildingOnGrid = Database.getBuildingOnGridAtIndex(oldOutputBuildingIndex);
			var possibleInputIndex : int = oldOutputBuildingOnGrid.inputLinkedTo.IndexOf(building1Index);
			if (possibleInputIndex >= 0)
			{
				gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, oldOutputBuildingIndex, oldOutputBuildingOnGrid.allocatedInputs[possibleInputIndex]);
			}*/
		}		
	}
	
	// if an allocated output was selected, perform a chain break link reallocation
	if (linkCaseOverride && allocatedOutSelected && oldOutputBuildingIndex > -1)
	{
		oldInputBuildingIndex = GameObject.Find("Database").GetComponent(Database).ChainBreakLink(building2Index, building1Index, selectedOutIndex, selectedResource, optionalOutputUsed, allocatedInSelected);
		if (oldInputBuildingIndex > -1)
		{
			linkReference[building1Index, building2Index] = true;
			var oldInputBuilding : GameObject = Database.getBuildingAtIndex(oldInputBuildingIndex);
			//removeLink(b2, oldInputBuilding);
			removeLink(oldInputBuilding, b2);
			//gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource, optionalOutputUsed);
		}
		
		//If the chain break causes the outputting building to be deactivated, undo the link.
		if(!Database.getBuildingOnGridAtIndex(building2Index).isActive)
		{
			var intelSystem:IntelSystem = GameObject.Find("Database").GetComponent(IntelSystem);
			intelSystem.decrementScore(true, intelSystem.comboSystem.comboScoreBasePoints);
			intelSystem.comboSystem.resetComboCount();
			SoundManager.Instance().playUndo();
			menu.RecieveEvent(EventTypes.UNDO);
			var datab : Database = GameObject.Find("Database").GetComponent(Database);
			datab.RevertMutual();
		}
		
	}
	// otherwise, perform a normal building link
	else if(GameObject.Find("Database").GetComponent(Database).linkBuildings(building2Index, building1Index, selectedResource, optionalOutputUsed) && (!isLinked(b1, b2)))
	{
		linkReference[building1Index, building2Index] = true;
		//gameObject.GetComponent(DrawLinks).CreateLinkDraw(building1Index, building2Index, selectedResource, optionalOutputUsed);
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
	
	if(Vector3.Distance(b1Position, b2Position) <= (HexagonGrid.tileWidth * (tileRange)))
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

function HighlightTiles(res : ResourceType)
{
	selectedBuilding = ModeController.getSelectedBuilding();
	buildingIsSelected = (selectedBuilding != null);
	if (buildingIsSelected)
		selectedGridBuilding = Database.getBuildingOnGrid(selectedBuilding.transform.position);
	var building : GameObject;	
	for (var i : int = 0; i < buildings.length; i++)
	{
		building = buildings[i];
		if(building == null) return;
		buildingHighlightColor = noHighlightColor;
		var buildingState : IndicatorState = IndicatorState.Neutral;
		target = building.transform;
		gridBuilding = Database.getBuildingOnGrid(target.position);
		if(gridBuilding == null)
			return;
		if (/*(!buildingIsSelected || !selectedGridBuilding.isActive) &&*/ (gridBuilding.isActive || building.name == "BuildingSite"))
		{
			buildingHighlightColor = usableHighlightColor;
			buildingState = IndicatorState.Active;
		}
		if(ModeController.selectedBuilding != null && ModeController.selectedBuilding != building && isInRange(building, ModeController.selectedBuilding))
		{
			if (res == ResourceType.None)
			{
				var tempBuilding = Database.getBuildingOnGrid(ModeController.selectedBuilding.transform.position);
				
				for(var j = 0; j < tempBuilding.unallOutputs.Count; j++)//ocatedOutputs.Count; j++)
				{
					if(Database.checkForResource(Database.getBuildingOnGrid(buildings[i].transform.position), tempBuilding.unallOutputs[j].resource))//ocatedOutputs[j]))
					{
						buildingHighlightColor = targetHighlightColor;
						buildingState = IndicatorState.Valid;
					}
				}		
				//if(tempBuilding.optionalOutput != ResourceType.None && tempBuilding.optionalOutputFixed)
				if(tempBuilding.optOutput.resource != ResourceType.None && tempBuilding.optionalOutputFixed)
				{
					if(tempBuilding.optOutput.linkedTo < 0 && Database.checkForResource(Database.getBuildingOnGrid(buildings[i].transform.position), tempBuilding.optOutput.resource))//ionalOutput))
					{
						buildingHighlightColor = targetHighlightColor;
						buildingState = IndicatorState.Valid;
					}
				}
			}
			else
			{
				if(Database.checkForResource(Database.getBuildingOnGrid(buildings[i].transform.position), res))//ocatedOutputs[j]))
				{
					buildingHighlightColor = targetHighlightColor;
					buildingState = IndicatorState.Valid;
				}
			}
		}
		//(gridBuilding.highlighter.GetComponentInChildren(Renderer) as Renderer).material.SetColor("_Color", buildingHighlightColor);
		
		if(gridBuilding.indicator == null)
			gridBuilding.indicator = gridBuilding.buildingPointer.GetComponentInChildren(BuildingIndicator);
		
		gridBuilding.indicator.SetState(buildingState);
	}
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
			resourceList[i] == selectedGridBuilding.optOutput.resource && optionalOutputUsed)//ionalOutput && optionalOutputUsed)
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

public function SetOutputBuilding (outBuilding : GameObject)
{
	outputBuilding = outBuilding;
}

public function SetSelectedResource (resource : ResourceType)
{
	selectedResource = resource;
}

public function SetSelectedOutIndex (outIndex : int)
{
	if (outIndex < 0)
		optionalOutputUsed = true;
	else
		selectedOutIndex = outIndex;
}

// sets whether a link has been directly been set to reallocate
public function SetLinkCaseOverride(setting : boolean)
{
	linkCaseOverride = setting;
}

public function SetAllocatedOutSelected (allocatedSelected : boolean)
{
	allocatedOutSelected = allocatedSelected;
}

public function SetUnitSelected (selected : boolean)
{
	selectedGridBuilding.unitSelected = selected;
}

public function ResetLinkVariables()
{
	inputBuilding = null;
	outputBuilding = null;
	selectedBuilding = null;
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
	{
		ResetLinkVariables();
		ModeController.setSelectedInputBuilding(null);
	}
	/*if (selectedBuilding != outputBuilding)
		ResetLinkVariables();*/
	if (selectedResource != ResourceType.None && selectedBuilding != outputBuilding)
	{
		inputBuilding = selectedBuilding;
		var inputBuildingOnGrid : BuildingOnGrid = Database.getBuildingOnGrid(selectedBuilding.transform.position);
		//allocatedInSelected = (inputBuildingOnGrid.allocatedInputs.Contains(selectedResource) && !inputBuildingOnGrid.unallocatedInputs.Contains(selectedResource));
		allocatedInSelected = (inputBuildingOnGrid.FindResourceIndex(selectedResource, inputBuildingOnGrid.allInputs) >= 0
								 && inputBuildingOnGrid.FindResourceIndex(selectedResource, inputBuildingOnGrid.unallInputs) < 0);
	}
	
	if(useDragLink)
	{
		if(ModeController.getSelectedInputBuilding() != null)
		{
			inputBuilding = ModeController.getSelectedInputBuilding();
			outputBuilding = ModeController.getSelectedBuilding();
		}
	}
	
	if(inputBuilding != null && outputBuilding != null)
	{
		if(isInRange(inputBuilding, outputBuilding)) //If the buildings are within range, connect them
		{	
			if(!useDragLink)
				linkBuildings(inputBuilding, outputBuilding);
			else
				DragLinkBuildings(inputBuilding, outputBuilding);
		}
		ModeController.setSelectedBuilding(null);
		ModeController.setSelectedInputBuilding(null);
		ResetLinkVariables();//inputBuilding = null; outputBuilding = null; //resets either way
		HighlightTiles(ResourceType.None);
	}
	
	//Debug.Log(fadeTimer);
	fadeTimer += Time.smoothDeltaTime * fadeScaler;
	Mathf.Clamp(fadeTimer, 0, 1);
	if (fadeTimer >= 1 || fadeTimer <= 0)
		fadeScaler *= -1;
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
	for (var i : int = 0; i < activeButtonRects.Count; i++)//var r : Rect in activeButtonRects)
	{
		if (activeButtonRects[i].Contains(mousePos))//r.Contains(mousePos))
			return false;
	}
	return true;
}

public function getSelectedResource():ResourceType
{
	return selectedResource;
}
public function getSelectedOutputBuilding():GameObject
{
	return outputBuilding;
}

public function getMousePos():Vector2
{
	return mousePos;
}

public function READcancelLinkMode()
{
	Debug.Log("Link Mode: " + cancelLinkMode);
}