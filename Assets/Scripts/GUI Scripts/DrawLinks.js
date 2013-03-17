#pragma strict

/*	DrawLinks.js
	Author: Justin Hinson
	
	Requirements: -All building game objects must be tagged as "Building"
	
	Description:
	This script draws a line (using LineRenderer) between all buildings that are linked.
	This script uses isLinked from LinkUI.js to determine of two buildings are linked, 
	therefore this script must be attatched to the same object as LinkUI.js
*/

 
//Buildings i and j are linked if linkReference[i,j] == true OR linkReference[j,i] == true
private var linkProspects:boolean[,];	//Used to determine the number of possible links.
private static var linksDrawn:boolean[,];		//Used to determine if links have already been drawn.
private var b1Position:Vector3;		
private var b2Position:Vector3;			//These hold position of linked buildings
public var linkTextures : Texture[];
private static var buildings:GameObject[];		//Array of all buildings in scene
private var lineAnchor:GameObject;
private var numLinks:int;
private static var linkColors : Color[,];
private var resourceColors : Color[];
private var numResourceTypes : int = 8;

function Start() {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	linkProspects = new boolean[buildings.Length, buildings.Length];
	linksDrawn = new boolean[buildings.Length, buildings.Length];
	linkColors = new Color[buildings.Length, buildings.Length];
	Debug.Log("drawlinks");
	addObjectsToBuildings();
	resourceColors = new Color[numResourceTypes];
	resourceColors[ResourceType.Coal - 1] = Color.gray;
	resourceColors[ResourceType.Gas - 1] = Color.red;
	resourceColors[ResourceType.Power - 1] = Color.blue;
	resourceColors[ResourceType.Petrol - 1] = new Color(1.0, 0.5, 0.0); // orange
	resourceColors[ResourceType.Fund - 1] = Color.green;
	resourceColors[ResourceType.Waste - 1] = new Color(0.588, 0.294, 0.0); // brown
	resourceColors[ResourceType.Ethanol - 1] = Color.yellow;
	resourceColors[ResourceType.Uranium - 1] = new Color(0.49, 0.149, 0.804); // purple
}

// used to set links to a specific color
static function SetLinkColor (b1 : int, b2 : int, c : Color) 
{
	for(var child:Transform in buildings[b1].transform)
	{
		if (child.name==buildings[b2].transform.position.ToString())
		{
			var temp : LineRenderer = child.gameObject.GetComponent(LineRenderer);
			temp.SetColors(c, c);
			break;
		}
	}
	for(var child:Transform in buildings[b2].transform)
	{
		if (child.name==buildings[b1].transform.position.ToString())
		{
			temp = child.gameObject.GetComponent(LineRenderer);
			temp.SetColors(c, c);
			break;
		}
	}
}

// used to reset links to their original color
static function SetLinkColor (b1 : int, b2 : int, reset : boolean) 
{
	for(var child:Transform in buildings[b1].transform)
	{
		if (child.name==buildings[b2].transform.position.ToString())
		{
			var temp : LineRenderer = child.gameObject.GetComponent(LineRenderer);
			temp.SetColors(Color.white, Color.white);//linkColors[b1, b2], linkColors[b1, b2]);
			break;
		}
	}
	for(var child:Transform in buildings[b2].transform)
	{
		if (child.name==buildings[b1].transform.position.ToString())
		{
			temp = child.gameObject.GetComponent(LineRenderer);
			temp.SetColors(Color.white, Color.white);//linkColors[b1, b2], linkColors[b1, b2]);
			break;
		}
	}
}

function CreateLinkDraw(b1 : int, b2 : int, resource : ResourceType)
{
	// make sure buildings are valid
	if (buildings[b1] == null || buildings[b2] == null)
		return;
		
	// make sure buildings are linked
	var isLinked:boolean = gameObject.GetComponent(LinkUI).isLinked(buildings[b1], buildings[b2]);
	if (!isLinked)
		return;
	
	// set the link color based on resource type
	linkColors[b1, b2] = linkColors[b2,b1] = resourceColors[resource - 1];
	
	// create the line renderer to draw
	AddLineRenderer(b1, b2, resource, true);
	AddLineRenderer(b1, b2, resource, false);
}

function AddLineRenderer(b1 : int, b2 : int, resource : ResourceType, useFirst : boolean)
{
	var toAddTo : int;
	var childName : String;
	b1Position = buildings[b1].transform.position;
	b2Position = buildings[b2].transform.position;
	if (useFirst)
	{
		toAddTo = b1;
		childName = b2Position.ToString();
	}
	else
	{
		toAddTo = b2;
		childName = b1Position.ToString();
	}
	
	for(var child:Transform in buildings[toAddTo].transform)
	{
		if(child.gameObject.GetComponent(LineRenderer) == null && 
			!linksDrawn[b1, b2])
		{
			var lineRenderer:LineRenderer = child.gameObject.AddComponent(LineRenderer);
			lineRenderer.material = new Material(Shader.Find("Particles/Additive"));
			lineRenderer.material.mainTexture = linkTextures[resource - 1];
			//lineRenderer.material.SetColor ("_TintColor", linkColors[b1,b2]);
			lineRenderer.SetColors(Color.white, Color.white);//linkColors[b1, b2], linkColors[b1, b2]);
			lineRenderer.SetWidth(10, 10);
			lineRenderer.SetPosition(0, b1Position);
			lineRenderer.SetPosition(1, b2Position);
			linksDrawn[b1, b2] = linksDrawn[b2, b1] = true;
			child.name = childName; // used for changing the colors of specific links
			break;
		}
	}
}

function UpdateBuildingCount(curBuildings:GameObject[]):void
{
	buildings = curBuildings;
	linkProspects = new boolean[buildings.Length, buildings.Length]; // reset the length of the possible prospects
	linksDrawn = linksDrawn = new boolean[buildings.Length, buildings.Length];
	
	Debug.Log("Updating building count from DrawLinks.js " + buildings.Length);
}

function Update()
{
	
}


//This function determines the number of possible links each building has
//and adds that many gameObjects to that building.
function addObjectsToBuildings(){	
	var linkUIRef : LinkUI = gameObject.GetComponent(LinkUI);

	for(var b1:int; b1 < buildings.Length; b1++){
		numLinks = 0;
		
		for(var b2:int; b2 < buildings.Length; b2++){
			if(linkUIRef.isInRange(buildings[b1], buildings[b2]) && !linkUIRef.isLinked(buildings[b1], buildings[b2]) &&
										b1 != b2 &&
										(!linkProspects[b1, b2] ||
										!linkProspects[b2, b1])){
				numLinks++;
				linkProspects[b1, b2] = true;
			}
		}
		
		for(var i:int = 0; i < numLinks; i++){
			lineAnchor = new GameObject("Line Anchor");
			lineAnchor.transform.parent = buildings[b1].transform;
		}
	}
	
	return numLinks;
}

function removeLink(b1: int, b2: int)
{
	linksDrawn[b1,b2] = linksDrawn[b2, b1] = false;
}
