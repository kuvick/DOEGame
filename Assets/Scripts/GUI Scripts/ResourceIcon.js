#pragma strict

private var isAllocated : boolean = false;
private var building : BuildingOnGrid;
public var unallocatedTex : Texture2D;
public var allocatedTex : Texture2D;
public var brokenTex : Texture2D;
public var type : ResourceType;
private var currentTex : Texture2D;
public var ioType : IOType;
private var index : int;

private var currentScale : Vector3;
private var smallScale : Vector3 = Vector3(5,5,5);
private var flashScale : Vector3 = Vector3(6,6,6);
//private var bigScale : Vector3 = Vector3(8,8,8);

private var flashIcon : GameObject;

private var transparentColor : Color = Color(1,1,1,0);
private var solidColor : Color = Color(1,1,1,1);

private var selectedBuilding:GameObject;

private var linkUIRef : LinkUI;

private var unallColor : Color = Color(1.0,1.0,1.0,.5);
//private var unallColor : Color = Color(1.0,1.0,1.0,1);
private var allColor : Color = Color(1.0,1.0,1.0,1.0);

private var flashActive : boolean = false;
private var inactive : boolean = false;

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
	if (flashActive)
	{
		if (LinkUI.fadeTimer >= 0)
			flashIcon.renderer.material.color = Color.Lerp(transparentColor, solidColor, LinkUI.fadeTimer);
	}
	if (inactive)
	{
		if (LinkUI.fadeTimer >= 0)
			renderer.material.color = Color.Lerp(Color.gray, Color.white, LinkUI.fadeTimer);
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
	
	// generate background icon flash
	flashIcon = Instantiate(Resources.Load("IconPlane") as GameObject, transform.position, Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0));
	flashIcon.transform.localScale = flashScale;
	flashIcon.transform.position = gameObject.transform.position;
	flashIcon.transform.position.y = 74;
	flashIcon.transform.parent = gameObject.transform;
	flashIcon.renderer.material.mainTexture = Resources.Load("flash_icon") as Texture2D;
	flashIcon.collider.enabled = false;
	flashIcon.layer = 10;
	flashIcon.name = "ResourceFlash";
	
	SetAllocated(false);
	if (ioType == IOType.OptOut)
	{
		index = -1;
		SetFlashActive(true);
		SetFixed(false);
		/*solidColor = Color.red;
		renderer.material.mainTexture = brokenTex;*/
	}
}

public function SetFlashSolidColor (color : Color)
{
	solidColor = color;
}

public function SetActive(active : boolean)
{
	if (active)
		renderer.material.color = Color.white;
	/*else
		renderer.material.color = Color.gray; */
	inactive = !active;
}

public function SetAllocated (allo : boolean)
{
	isAllocated = allo;
	if (isAllocated)
	{
		//Disabling texture change to see if this makes the game more readible GPC 3/8/14
		//currentTex = allocatedTex;
		//gameObject.renderer.material.color = allColor;
	}
	else
	{
		currentTex = unallocatedTex;
		//gameObject.renderer.material.color = unallColor;
	}
	gameObject.renderer.material.mainTexture = currentTex;
}

public function SetFlashActive(active : boolean)
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

public function SetFixed(fix : boolean)
{
	if (ioType == IOType.OptOut)
	{
		if (fix)
			currentTex = unallocatedTex;
		else
		{
			currentTex = brokenTex;
			SetFlashSolidColor(Color.red);
		}
		renderer.material.mainTexture = currentTex;
	}
}

public function Delete()
{
	DestroyImmediate(flashIcon);
}