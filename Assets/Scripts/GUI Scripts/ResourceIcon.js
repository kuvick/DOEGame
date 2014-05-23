#pragma strict

private var isAllocated : boolean = false;
private var building : BuildingOnGrid;
//public var unallocatedTex : Texture2D;
//public var allocatedTex : Texture2D;
public var brokenTex : Texture2D;

public var IconTex : Texture2D;
public var TopBGTex : Texture2D;
public var BottomBGTex : Texture2D;

private var resourceColor: Color;
private var resourceColorTransparent: Color;

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
private var transparentRedColor : Color;

private var selectedBuilding:GameObject;

private var linkUIRef : LinkUI;

private var unallColor : Color = Color(1.0,1.0,1.0,.5);
//private var unallColor : Color = Color(1.0,1.0,1.0,1);
private var allColor : Color = Color(1.0,1.0,1.0,1.0);

private var flashActive : boolean = false;

private var inactive : boolean = false;

private var iconAnimation : InGameAnimation = new InGameAnimation();
private var in2active : boolean = false;
private var active2in : boolean = false;

private var highlightIcon:boolean = false;

enum IOType
{
	In,
	Out,
	OptOut
}

function Update ()
{
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
	
	if(in2active)
	{
		if(isAllocated && highlightIcon)
			highlightIcon = false;
		
		if(!iconAnimation.AnimateResource(this.gameObject, currentScale, resourceColor, resourceColorTransparent, Color.white, resourceColor, ioType))
			in2active = false;
	}
	else if(highlightIcon)
	{
		if(!iconAnimation.AnimateResource(this.gameObject, currentScale, resourceColorTransparent, resourceColorTransparent, Color.white, resourceColor, ioType))
			highlightIcon = false;
	}
	/*
	else if(active2in)
	{
		if(!iconAnimation.AnimateResource(this.gameObject, currentScale, resourceColorTransparent, resourceColor, resourceColor, Color.white))
			active2in = false;
	}
	*/
}

public function SelectForReallocation()
{
	highlightIcon = true;
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
	resourceColor = Color.white;
	transparentRedColor = Color.red;
	transparentRedColor.a = 0.5f;
	
	this.building = building;
	
	resourceColor.a = 1.0f;
	resourceColorTransparent = resourceColor;
	resourceColorTransparent.a = 0.5f;
	
	//currentTex = unallocatedTex;
	
	//gameObject.renderer.material.mainTexture = currentTex;
	
	gameObject.renderer.material.SetTexture("_IconTex", IconTex);
	gameObject.renderer.material.SetTexture("_TopBGTex", TopBGTex);
	gameObject.renderer.material.SetTexture("_BottomBGTex", BottomBGTex);	
	
	currentScale = smallScale;
	gameObject.transform.localScale = currentScale;
	
	//gameObject.renderer.material.mainTextureScale = Vector2(-1,-1);
	//gameObject.renderer.material.mainTextureOffset = Vector2(1,1);
	
	gameObject.renderer.material.SetTextureScale("_IconTex", Vector2(-1,-1));
	gameObject.renderer.material.SetTextureScale("_TopBGTex", Vector2(-1,-1));
	gameObject.renderer.material.SetTextureScale("_BottomBGTex", Vector2(-1,-1));
	
	gameObject.renderer.material.SetTextureOffset("_IconTex", Vector2(1,1));
	gameObject.renderer.material.SetTextureOffset("_TopBGTex", Vector2(1,1));
	gameObject.renderer.material.SetTextureOffset("_BottomBGTex", Vector2(1,1));
	
	gameObject.renderer.material.SetColor("_Color2", resourceColor);
	gameObject.renderer.material.SetColor("_Color3", resourceColor);	
	gameObject.renderer.material.SetColor("_Color1", Color.white); 	//UNALLOCATED SET
	
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
	
	SetAllocated(false, false);
	if (ioType == IOType.OptOut)
	{
		index = -1;
		//SetFlashActive(true);
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

public function SetAllocated (allo : boolean, animate:boolean)
{
	isAllocated = allo;
	if (isAllocated)
	{
		//Disabling texture change to see if this makes the game more readible GPC 3/8/14
		//currentTex = allocatedTex;
		
		//ALLOCATED SET
		if(!animate)
		{
			resourceColor.a = 0.5f;
			gameObject.renderer.material.SetColor("_Color2", resourceColor);
			gameObject.renderer.material.SetColor("_Color3", resourceColor);
			resourceColor.a = 1.0f;	
			gameObject.renderer.material.SetColor("_Color1", resourceColor); 	//ALLOCATED SET
		}
		else
		{
			in2active = true;
			active2in = false;
		}
	}
	else
	{
		//currentTex = unallocatedTex;
		//if(!animate)
		//{
			resourceColor.a = 1.0f;
			gameObject.renderer.material.SetColor("_Color2", resourceColor);
			gameObject.renderer.material.SetColor("_Color3", resourceColor);	
			gameObject.renderer.material.SetColor("_Color1", Color.white); 	//UNALLOCATED SET
		//}
		//else
		//{
			in2active = false;
			active2in = true;
		//}
		//gameObject.renderer.material.color = unallColor;
	}
	//gameObject.renderer.material.mainTexture = currentTex;	
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
		{
			//currentTex = unallocatedTex;
			resourceColor.a = 1.0f;
			gameObject.renderer.material.SetColor("_Color2", resourceColor);
			gameObject.renderer.material.SetColor("_Color3", resourceColor);	
			gameObject.renderer.material.SetColor("_Color1", Color.white); 	//UNALLOCATED SET
		}
		else
		{
			//currentTex = brokenTex;
			resourceColor.a = 0.5f;
			var transparentWhite:Color = Color.white;
			transparentWhite.a = 0.5f;
			gameObject.renderer.material.SetColor("_Color2", transparentRedColor);
			gameObject.renderer.material.SetColor("_Color3", transparentRedColor);	
			gameObject.renderer.material.SetColor("_Color1", Color.white);
			//SetFlashSolidColor(Color.red);
		}
		renderer.material.mainTexture = currentTex;
	}
}

public function Delete()
{
	DestroyImmediate(flashIcon);
}