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
private var smallScale : Vector3 = Vector3(5,5,5);
private var flashScale : Vector3 = Vector3(6,6,6);
//private var bigScale : Vector3 = Vector3(8,8,8);

private var flashIcon : GameObject;

private var fadeTimer : float = 0.0;
private var fadeScaler : float = 1.0;
private var transparentColor : Color = Color(1,1,1,0);
private var solidColor : Color = Color(1,1,1,1);

private var selectedBuilding:GameObject;

private var linkUIRef : LinkUI;

private var unallColor : Color = Color(1.0,1.0,1.0,.5);
//private var unallColor : Color = Color(1.0,1.0,1.0,1);
private var allColor : Color = Color(1.0,1.0,1.0,1.0);

private var flashActive : boolean = false;

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
	if (fadeTimer >= 1 || fadeTimer <= 0)
			fadeScaler *= -1;
	fadeTimer += Time.smoothDeltaTime * fadeScaler;
	if (flashActive)
	{
		if (fadeTimer >= 0)
			flashIcon.renderer.material.color = Color.Lerp(transparentColor, solidColor, fadeTimer);
	}
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
	
	gameObject.layer = 10;
	
	flashIcon = Instantiate(Resources.Load("IconPlane") as GameObject, transform.position, Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0));
	flashIcon.transform.localScale = flashScale;
	flashIcon.transform.position = gameObject.transform.position;
	flashIcon.transform.position.y = 74;
	flashIcon.renderer.material.mainTexture = Resources.Load("flash_icon") as Texture2D;
	//flashIcon.collider.active = false;
	flashIcon.layer = 10;
	
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
	//gameObject.renderer.material.color = active ? allColor : unallColor;
	//if (ioType != IOType.In)
		flashActive = active;
	if (!flashActive)
		flashIcon.renderer.material.color = transparentColor;
}

public function SetIndex (index : int)
{
	this.index = index;
}