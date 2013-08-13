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

private var unallColor : Color = Color(1.0,1.0,1.0,.5);
private var allColor : Color = Color(1.0,1.0,1.0,1.0);

enum IOType
{
	In,
	Out,
	OptOut
}

function Update () {
	selectedBuilding = ModeController.getSelectedBuilding();
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

public function Initialize(building : BuildingOnGrid)
{
	linkUIRef = GameObject.FindWithTag("MainCamera").GetComponent(LinkUI);
	
	this.building = building;
	
	currentTex = unallocatedTex;
	gameObject.renderer.material.mainTexture = currentTex;
	
	currentScale = smallScale;
	gameObject.transform.localScale = currentScale;
	
	gameObject.renderer.material.mainTextureScale = Vector2(-1,-1);
	gameObject.renderer.material.mainTextureOffset = Vector2(1,1);
	
	// slant icon slightly forward towards the camera
	gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
	
	if (ioType == IOType.OptOut)
		index = -1;
	SetAllocated(false);
}

public function SetAllocated (allo : boolean)
{
	isAllocated = allo;
	if (isAllocated)
	{
		currentTex = allocatedTex;
		//gameObject.renderer.material.color = allColor;
	}
	else
	{
		currentTex = unallocatedTex;
		//gameObject.renderer.material.color = unallColor;
	}
	gameObject.renderer.material.mainTexture = currentTex;
}

public function SetActive(active : boolean)
{
	gameObject.renderer.material.color = active ? allColor : unallColor;
}

public function SetIndex (index : int)
{
	this.index = index;
}