#pragma strict

private var isAllocated : boolean = false;
private var building : BuildingOnGrid;
public var unallocatedTex : Texture2D;
public var allocatedTex : Texture2D;
public var type : ResourceType;
private var currentTex : Texture2D;
public var ioType : IOType;
private var index : int;

private var currentScale : Vector3;
private var smallScale : Vector3 = Vector3(4,4,4);
private var bigScale : Vector3 = Vector3(8,8,8);

private var selectedBuilding:GameObject;

private var linkUIRef : LinkUI;

enum IOType
{
	In,
	Out,
	OptOut
}

function Update () {
	selectedBuilding = ModeController.getSelectedBuilding();
	/*var look : Vector3 = Camera.main.transform.position - transform.position;
	transform.up = look.normalized;*/
	//transform.rotation = Quaternion.LookRotation(look) * Quaternion.Euler(90, 0, 0);
	/*if (selectedBuilding == building.buildingPointer && ioType == IOType.Out && building.isActive)
		currentScale = bigScale;
	else
		currentScale = smallScale;
	gameObject.transform.localScale = currentScale;*/
}

public function OnSelected()
{
	if (selectedBuilding == building.buildingPointer && building.isActive)
	{
		linkUIRef.SetOutputBuilding(building.buildingPointer);
		linkUIRef.SetSelectedResource(type);
		linkUIRef.SetSelectedOutIndex(index);
		linkUIRef.SetAllocatedOutSelected(isAllocated);
		linkUIRef.SetUnitSelected(false);
	}
}

/*public function OnMouseExit()
{
	BuildingInteractionManager.SetObjSelected(false);
}*/

/*public function OnMouseOver()
{
	if (selectedBuilding == building.buildingPointer && building.isActive)
		BuildingInteractionManager.SetObjSelected(true);
}*/

public function Initialize(building : BuildingOnGrid)
{
	linkUIRef = GameObject.FindWithTag("MainCamera").GetComponent(LinkUI);
	
	this.building = building;
	
	currentTex = unallocatedTex;
	gameObject.renderer.material.mainTexture = currentTex;
	
	currentScale = smallScale;
	gameObject.transform.localScale = currentScale;
	
	gameObject.renderer.material.mainTextureScale = Vector2(-1,-1);
	
	if (ioType == IOType.OptOut)
		index = -1;
}

public function SetAllocated (allo : boolean)
{
	isAllocated = allo;
	if (isAllocated)
		currentTex = allocatedTex;
	else
		currentTex = unallocatedTex;
	gameObject.renderer.material.mainTexture = currentTex;
}

public function SetIndex (index : int)
{
	this.index = index;
}