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
var color1:Color = Color.blue;		
var color2:Color = Color.blue;			//Color of link line
private static var buildings:GameObject[];		//Array of all buildings in scene
private var lineAnchor:GameObject;
private var numLinks:int;

function Start() {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	linkProspects = new boolean[buildings.Length, buildings.Length];
	linksDrawn = new boolean[buildings.Length, buildings.Length];
	Debug.Log("drawlinks");
	addObjectsToBuildings();
}

static function SetLinkColor (b1 : int, b2 : int, c : Color) {
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

function UpdateBuildingCount(curBuildings:GameObject[]):void
{
	buildings = curBuildings;
	linkProspects = new boolean[buildings.Length, buildings.Length]; // reset the length of the possible prospects
	linksDrawn = linksDrawn = new boolean[buildings.Length, buildings.Length];
	
	Debug.Log("Updating building count from DrawLinks.js " + buildings.Length);
}

function Update(){
	
	if(buildings.Length <= 0) return;
	
	//Iterate through linkReference array. If buildings are linked, draw line.
	for(var b1 = 0; b1 < buildings.Length; b1++){
	
		if(buildings[b1].gameObject == null) return;
		
		b1Position = buildings[b1].transform.position;

		for(var b2 = 0; b2 < buildings.Length; b2++){
		
			if(buildings[b2] == null) return;
			
			b2Position = buildings[b2].transform.position;
			var isLinked:boolean = gameObject.GetComponent(LinkUI).isLinked(buildings[b1], buildings[b2]);
			
			if(isLinked){
				for(var child:Transform in buildings[b1].transform){
					if(child.gameObject.GetComponent(LineRenderer) == null && 
						!linksDrawn[b1, b2]){
						var lineRenderer:LineRenderer = child.gameObject.AddComponent(LineRenderer);
						lineRenderer.material = new Material(Shader.Find("Particles/Additive"));
						lineRenderer.SetColors(color1, color2);
						lineRenderer.SetWidth(10, 10);
						lineRenderer.SetPosition(0, b1Position);
						lineRenderer.SetPosition(1, b2Position);
						linksDrawn[b1, b2] = true;
						child.name = b2Position.ToString(); // used for changing the colors of specific links
						break;
					}
				}
			}
		}
	}
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
