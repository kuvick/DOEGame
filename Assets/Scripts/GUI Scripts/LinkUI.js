#pragma strict

/*	LinkUI.js
	Author: Justin Hinson
	
	This script displays an input and output button for each object tagged "Building".
	Buildings may be linked by clicking and dragging from one buildings input to 
	another's output, or vice versa. 
	
*/

private enum mousePhases {BeforeClick, InputSelected, OutputSelected, ClickEnded}
private var phase:mousePhases = mousePhases.BeforeClick;
private var numBuildings:int;
private var inputBuilding:GameObject;
private var outputBuilding:GameObject;
private var inputOffset:Vector2 = new Vector2(-20, -40);	//Used to set position of button relative to building
private var outputOffset:Vector2 = new Vector2(20, -40);
private var buttonWidth = 27;
private var buttonHeight = 27;
private var target:Transform;		//Transform of building that button corresponds to
private var point:Vector3;			//Used to obtain position of button in screen space
private var inputRect:Rect;			//Rect for Area of input button
private var outputRect:Rect;		//Rect for Area of output button
private var mousePos:Vector2;		//Position of mouse in screen space

//Reference for linked buildings. 
//Buildings i and j are linked if linkReference[i,j] == true OR linkReference[j,i] == true
public var linkReference:boolean[,];
public var buildings:GameObject[];

function Start () {
	buildings = gameObject.FindGameObjectsWithTag("Building");
	numBuildings = buildings.length;
	linkReference = new boolean[numBuildings, numBuildings];
}

//This function is used to link buildings b1 and b2
//An error message is printed if the buildings are already linked
function linkBuildings(b1:GameObject, b2:GameObject){
	var b1Index:int;
	var b2Index:int;
	
	for(var b:int; b < buildings.length; b++){
		if(buildings[b] == b1)
			b1Index = b;
		else if(buildings[b] == b2)
			b2Index = b;
	}
	
	if(linkReference[b1Index, b2Index] || linkReference[b2Index, b1Index])
		Debug.Log("Buildings \"" + b1.name + "\" and \"" + b2.name + 
				"\" are already linked");
	else{
		linkReference[b1Index, b2Index] = true;
		Debug.Log("Buildings Linked");
	}
}

function OnGUI(){
	for(var building:GameObject in buildings){
		target = building.transform;				
		point = Camera.main.WorldToScreenPoint(target.position);
		point.y = Screen.height - point.y;
		
		//Adjust y value of button for screen space
		if(point.y < 0)
			point.y -= Screen.height;
		
		//Set position of buttons
		var inputRect:Rect = Rect(point.x + inputOffset.x, 
						point.y + inputOffset.y, buttonWidth, buttonHeight);
		var outputRect:Rect = Rect(point.x + outputOffset.x, 
						point.y + outputOffset.y, buttonWidth, buttonHeight);

		//Instructions for input button
		GUILayout.BeginArea(inputRect);
		GUILayout.Button("I");
		if(mousePos.x >= inputRect.x && mousePos.x <= inputRect.x + inputRect.width &&
			mousePos.y >= inputRect.y && mousePos.y <= inputRect.y + inputRect.height){
		
			switch(phase)
			{
			case mousePhases.BeforeClick:
				if(Input.GetMouseButtonDown(0)){
					inputBuilding = building;
					phase = mousePhases.InputSelected;
				}
				break;
			case mousePhases.InputSelected:
				if(Input.GetMouseButtonUp(0)){
					phase = mousePhases.BeforeClick;
				}
				break;
			case mousePhases.OutputSelected:
				inputBuilding = building;
				if(Input.GetMouseButtonUp(0)){
					if(inputBuilding != building){
						phase = mousePhases.ClickEnded;
					}
					else{
						Debug.Log("Building can not be linked to itself");
						phase = mousePhases.BeforeClick;
					}
				}
				break;
			}
		}
		
		GUILayout.EndArea();
		
		//Instructions for output button
		GUILayout.BeginArea(outputRect);
		GUILayout.Button("O");
		if(mousePos.x >= outputRect.x && mousePos.x <= outputRect.x + outputRect.width &&
			mousePos.y >= outputRect.y && mousePos.y <= outputRect.y + outputRect.height){
			
			switch(phase)
			{
			case mousePhases.BeforeClick:
				if(Input.GetMouseButtonDown(0)){
					outputBuilding = building;
					phase = mousePhases.OutputSelected;
				}
				break;
			case mousePhases.InputSelected:
				outputBuilding = building;
				if(Input.GetMouseButtonUp(0)){
					if(inputBuilding != building){
						phase = mousePhases.ClickEnded;
					}
					else{
						Debug.Log("Building can not be linked to itself");
						phase = mousePhases.BeforeClick;
					}
				}
				break;
			case mousePhases.OutputSelected:
				if(Input.GetMouseButtonUp(0)){
					phase = mousePhases.BeforeClick;
				}
				break;
			}
		}
		GUILayout.EndArea();
	}
}

function Update() {
	//get current mouse position & adjust y-value for screen space
	mousePos = Vector2(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
	
	//If buildings have been selected, link them
	if(phase == mousePhases.ClickEnded){
		linkBuildings(inputBuilding, outputBuilding);
		phase = mousePhases.BeforeClick;
	}
}