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
public var deactivatedTexture : Texture;
public var linkParticleSystem : ParticleSystem;
private var linkResources : ResourceType[,];
private static var buildings:GameObject[];		//Array of all buildings in scene
private var lineAnchor:GameObject;
private var numLinks:int;
private static var linkColors : Color[,];
private var resourceColors : Color[];
//private var numResourceTypes : int = 8;
private var numResourceTypes : int = 11;

function Start() {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	linkProspects = new boolean[buildings.Length, buildings.Length];
	linksDrawn = new boolean[buildings.Length, buildings.Length];
	linkColors = new Color[buildings.Length, buildings.Length];
	linkResources = new ResourceType[buildings.Length, buildings.Length];
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
	resourceColors[ResourceType.Knowledge - 1] = Color.magenta;
	resourceColors[ResourceType.Workforce - 1] = Color.blue;
	resourceColors[ResourceType.Commerce - 1] = Color.cyan;
	//resourceColors[ResourceType.Uranium - 1] = new Color(0.49, 0.149, 0.804); // purple
}

// used for visually deactivating or reactivating links
function SetLinkTexture (b1 : int, b2 : int, reset : boolean)
{
	// set whether to use deactivated link or activated link texture
	var tempTex : Texture;
	if (reset)
		tempTex = linkTextures[linkResources[b1, b2] - 1];
	else
		tempTex = deactivatedTexture;
	
	// loop through b1's transforms
	for(var child:Transform in buildings[b1].transform)
	{
		// find the appropriate line renderer and change to the new texture
		if (child.name==buildings[b2].transform.position.ToString())
		{
			var temp : LineRenderer = child.gameObject.GetComponent(LineRenderer);
			temp.material.mainTexture = tempTex;
			break;
		}
	}
	// loop through b2's transforms
	for(var child:Transform in buildings[b2].transform)
	{
		// find the appropriate line renderer and change to the new texture
		if (child.name==buildings[b1].transform.position.ToString())
		{
			temp = child.gameObject.GetComponent(LineRenderer);
			temp.material.mainTexture = tempTex;
			break;
		}
	}
}

// b2 = output building
// b1 = input building
function CreateLinkDraw(b1 : int, b2 : int, resource : ResourceType, optionalUsed : boolean, skipAnimation:boolean)
{
	//Debug.Log("LINKDRAW");
	// make sure buildings are valid
	if (buildings[b1] == null || buildings[b2] == null)
		return;
		
	// make sure buildings are linked
	/*var isLinked:boolean = gameObject.GetComponent(LinkUI).isLinked(buildings[b1], buildings[b2]);
	if (!isLinked)
		return;*/
	
	// set link resource type
	linkResources[b1, b2] = linkResources[b2, b1] = resource;
	
	// set the link color based on resource type
	linkColors[b1, b2] = linkColors[b2,b1] = resourceColors[resource - 1];
	
	AddParticleSystem(b1, b2, resource, optionalUsed, false, skipAnimation);
}

function CreateTraceDraw(b1 : int, b2 : int)
{
	// make sure buildings are valid
	if (buildings[b1] == null || buildings[b2] == null)
		return;
		
	AddParticleSystem(b1, b2, ResourceType.Power, false, true, false);
	StartCoroutine(TraceRemove(b1, b2));
}

function TraceRemove(b1 : int, b2 : int)
{
	yield WaitForSeconds(1f);
	removeLink(b1, b2);
}

// Creates the particle system for link visual
function AddParticleSystem (inputBuilding : int, outputBuilding : int, resource : ResourceType, optionalUsed : boolean, isTrace : boolean, skipAnimation:boolean)
{
	var temp : ParticleSystem = Instantiate(linkParticleSystem, buildings[outputBuilding].transform.position, Quaternion.identity);
	temp.gameObject.transform.position.y = 10;
	temp.gameObject.transform.parent = Database.getBuildingAtIndex(outputBuilding).transform;
	temp.gameObject.transform.localPosition.x = 0;
	temp.gameObject.transform.localPosition.z = 0;
	var tempTag : String = String.Empty;
	if (optionalUsed)
		tempTag = "Optional";
	tempTag += "Link";
	temp.gameObject.tag = tempTag;
	temp.gameObject.name = outputBuilding + " " + inputBuilding;
	var buildDistance : float = Vector3.Distance(buildings[outputBuilding].transform.position, buildings[inputBuilding].transform.position);
		
	temp.startLifetime = buildDistance / temp.startSpeed;
	temp.renderer.material.mainTexture = linkTextures[resource - 1];
	var targetVec : Vector3 = buildings[inputBuilding].transform.position - buildings[outputBuilding].transform.position;
	var angleModifier : float = 1.0f;
	if (targetVec.x < 0)
		angleModifier = -1.0f;
	var rotateDegrees : float = Vector3.Angle(Vector3.forward, targetVec);
	temp.gameObject.transform.rotation = Quaternion.Euler(0, rotateDegrees * angleModifier, 0);
	temp.startRotation = (rotateDegrees * angleModifier) * Mathf.Deg2Rad;
	
	// set up a collider for direct link selection for reallocation
	var tempCollider : BoxCollider = temp.gameObject.AddComponent(BoxCollider);
	tempCollider.center.z = targetVec.magnitude / 2f;
	tempCollider.size = Vector3(50f, 5f, targetVec.magnitude - HexagonGrid.tileWidth);
	
	if (!isTrace)
	{
		// if the 2 buildings are mutually linked, adjust the object positions to be side by side
		if (CheckForMutualLink(outputBuilding, inputBuilding))
		{
			var offset : Vector3 = Vector3(targetVec.z, targetVec.y, targetVec.x);
			offset.Normalize();
			temp.gameObject.transform.localPosition -= Utils.ConvertToRotated((25 * offset));
			
			var inputLink : GameObject = GameObject.Find(inputBuilding + " " + outputBuilding);
			if (inputLink)
				inputLink.transform.localPosition += Utils.ConvertToRotated((25 * offset));
		}
	}
	else
	{
		temp.gameObject.name += "Trace";
		//removeLink(inputBuilding, outputBuilding);
		temp.gameObject.transform.position.y += 5;
		temp.emissionRate = 2f;
		temp.maxParticles = 30;
	}
	
	StartCoroutine(LinkCreateAnimation(temp, skipAnimation));
}

// When links are first made, animates quickly then gradually slows down

function LinkCreateAnimation(link : ParticleSystem, skipAnimation:boolean)
{
	var initialPlaybackSpeed : float;
	var slowdownStep : float;
	var tempSpeed : float;
	if(!skipAnimation)
	{
		//Debug.Log("Link Start" + link);
		initialPlaybackSpeed = link.playbackSpeed;
		link.playbackSpeed = link.startLifetime;
		yield WaitForSeconds(1f);
		if(link == null) // in case undo function is used
			return;	
		slowdownStep = (link.playbackSpeed - initialPlaybackSpeed) / 4f;
		tempSpeed = link.playbackSpeed - slowdownStep;
		while (tempSpeed > initialPlaybackSpeed)
		{
			link.playbackSpeed = tempSpeed;
			yield WaitForSeconds(.25f);
			if(link == null) // in case undo function is used
			return;
			tempSpeed -= slowdownStep;
		}
		link.playbackSpeed = initialPlaybackSpeed;
		//Debug.Log("Link End" + link);
	}
	else
	{
		var simulatedWaitTime:float = 0;
		
		//Debug.Log("Link Start" + link);
		initialPlaybackSpeed = link.playbackSpeed;
		link.playbackSpeed = link.startLifetime;
		simulatedWaitTime += 1f;
		if(link == null) // in case undo function is used
			return;	
		slowdownStep = (link.playbackSpeed - initialPlaybackSpeed) / 4f;
		tempSpeed = link.playbackSpeed - slowdownStep;
		while (tempSpeed > initialPlaybackSpeed)
		{
			link.playbackSpeed = tempSpeed;
			simulatedWaitTime += .25f;
			if(link == null) // in case undo function is used
			return;
			tempSpeed -= slowdownStep;
		}
		link.playbackSpeed = initialPlaybackSpeed;
		link.playbackSpeed = link.startLifetime;
		link.Simulate(simulatedWaitTime, true, false);
		link.playbackSpeed = initialPlaybackSpeed;
		link.Play();
	}
}

function SetLinkActive(active : boolean, inputBuilding : int, outputBuilding : int)
{
	var tempSystem : LinkParticleSystem = GameObject.Find(outputBuilding + " " + inputBuilding).GetComponent(LinkParticleSystem);
	if (active)
		tempSystem.Play();
	else
		tempSystem.Pause();
}

function UpdateBuildingCount(curBuildings:GameObject[]):void
{
	buildings = curBuildings;
	linkProspects = new boolean[buildings.Length, buildings.Length]; // reset the length of the possible prospects
	linksDrawn = linksDrawn = new boolean[buildings.Length, buildings.Length];
	
}

function ReplaceBuilding (replacement : BuildingReplacement)
{
	buildings[replacement.buildingIndex] = replacement.buildingObject;
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

// Destroys the link particle system game object between the given 2 buildings
// b2 = output building
// b1 = input building
function removeLink(b1: int, b2: int)
{
	linksDrawn[b1,b2] = linksDrawn[b2, b1] = false;
	Destroy(GameObject.Find(b2 + " " + b1));
	
	// if the buildings were mutually linked, move the remaining link back to normal position
	if (CheckForMutualLink(b2, b1))
	{
		var inputLink : GameObject = GameObject.Find(b1 + " " + b2);
		if (inputLink)
			inputLink.transform.localPosition = Vector3(0,10,0);
	}	
}

// check if the given buildings are mutually linked
private function CheckForMutualLink(outputBuilding : int, inputBuilding : int) : boolean
{
	var outputOnGrid : BuildingOnGrid = Database.getBuildingOnGridAtIndex(outputBuilding);
	
	if (outputOnGrid.FindLinkIndex(inputBuilding, outputOnGrid.allInputs) >= 0)//inputLinkedTo.Contains(inputBuilding))
		return true;
	return false;
}