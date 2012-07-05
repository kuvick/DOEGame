#pragma strict

/*	DrawLinks.js
	Author: Justin Hinson
	
	Description:
	This script draws a line (using LineRenderer) between all buildings that are linked.
	This script uses linkReference from LinkUI to update the list of linked buildings, 
	therefore this script must be attatched to the same object as LinkUI.
	
	Notes:
	I'm not sure if LineRenderer is the best option for drawing lines. The LineRenderer
	line must be continuous, so each link requires a new renderer. It works for now though.
	This website has more information:  
		http://www.everyday3d.com/blog/index.php/2010/03/15/3-ways-to-draw-3d-lines-in-unity3d/
	
*/

//Reference for linked buildings. 
//Buildings i and j are linked if linkReference[i,j] == true OR linkReference[j,i] == true
private var linkReference:boolean[,];
private var b1Position:Vector3;		//These hold position of linked buildings
private var b2Position:Vector3;
var color1:Color = Color.blue;		//Color of link line
var color2:Color = Color.blue;
private var buildings:GameObject[];		//Array of all buildings in scene


function Start() {
	buildings = gameObject.FindGameObjectsWithTag("Building");
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
	return linkReference[b1Index, b2Index];
}

function Update(){
	//Get updated link reference
	linkReference = gameObject.GetComponent(LinkUI).linkReference;
	
	//Iterate through linkReference array. If buildings are linked, draw line.
	for(var b1:GameObject in buildings){
		b1Position = b1.transform.position;

		for(var b2:GameObject in buildings){
			b2Position = b2.transform.position;
			
			if(isLinked(b1, b2)){
				var lineAnchor:GameObject = new GameObject();
				var lineRenderer:LineRenderer = lineAnchor.AddComponent(LineRenderer);
				lineRenderer.material = new Material(Shader.Find("Particles/Additive"));
				lineRenderer.SetColors(color1, color2);
				lineRenderer.SetWidth(5, 5);
				lineRenderer.SetPosition(0, b1Position);
				lineRenderer.SetPosition(1, b2Position);
			}
		}
	}
}