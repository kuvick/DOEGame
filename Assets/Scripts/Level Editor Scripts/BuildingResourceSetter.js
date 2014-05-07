#pragma strict
private static var MAX_TYPES : int = 8; // maximum number of resource types

private var resourceTypeArray : ResourceType[] = [ ResourceType.Coal, ResourceType.Fund,
				ResourceType.Gas, ResourceType.Petrol, ResourceType.Power, ResourceType.Waste,
				ResourceType.Ethanol, ResourceType.Uranium ];
private var inputs : int[] = new int[MAX_TYPES]; // keeps track of number of each type of input
private var outputs : int[] = new int[MAX_TYPES]; // keeps track of number of each type of output

private var inputTex : FullResourceImage[]; // input textures
private var outputTex : FullResourceImage[]; // output textures
private var skin : GUISkin;

private var screenPos : Vector3; // building position on screen
private var worldPos : Vector3;
private var inputOffset : Vector3; // offset from screen position for input buttons
private var outputOffset : Vector3; // offset from screen position for output buttons
private var buttonSize : float;
private var inputRects : Rect[] = new Rect[MAX_TYPES];
private var outputRects : Rect[] = new Rect[MAX_TYPES];
private var i : int;
private var selectedBuilding : GameObject;

function Start () {
	var linkUIRef : LinkUI = Camera.main.gameObject.GetComponent(LinkUI);
	inputTex = linkUIRef.unallocatedInputTex;
	outputTex = linkUIRef.unallocatedOutputTex;
	skin = GUISkin();
	skin.button.fontSize = Screen.width * .025;
	skin.button.alignment = TextAnchor.MiddleCenter;
	skin.button.font = Resources.Load("Orbitron-Bold") as Font;
	var tempColor : Color = Color (1, 1, 1);
	skin.button.normal.textColor = tempColor;
	skin.button.active.textColor = tempColor;
	skin.button.hover.textColor = tempColor;
	worldPos = transform.position;
	buttonSize = Screen.width * .05;
	inputOffset = Vector3(-buttonSize * 4, buttonSize, 0);
	outputOffset = Vector3(-buttonSize * 4, -buttonSize * 2, 0);
	for (i = 0; i < MAX_TYPES; i++)
	{
		inputRects[i] = Rect(0, 0, buttonSize, buttonSize);
		outputRects[i] = Rect(0, 0, buttonSize, buttonSize);
	}
}

function Update () {
	selectedBuilding = ModeController.getSelectedBuilding();
}

function OnGUI()
{
	GUI.skin = skin;
	if (selectedBuilding == gameObject)
	{
		screenPos = Camera.main.WorldToScreenPoint(worldPos);
		screenPos.y = Screen.height - screenPos.y; //adjust height point
		if(screenPos.y < 0) //Adjust y value of button for screen space
			screenPos.y -= Screen.height;
		inputRects[0].x = screenPos.x + inputOffset.x;
		inputRects[0].y = screenPos.y + inputOffset.y;
		outputRects[0].x = screenPos.x + outputOffset.x;
		outputRects[0].y = screenPos.y + outputOffset.y;
		// draw output buttons
		for (i = 0; i < MAX_TYPES; i++)
		{
			if (i > 0)
			{
				inputRects[i].x = inputRects[i - 1].x + buttonSize;
				inputRects[i].y = inputRects[i - 1].y;
				outputRects[i].x = outputRects[i - 1].x + buttonSize;
				outputRects[i].y = outputRects[i - 1].y;
			}
			DrawButton(i, outputTex, outputs, outputRects[i]);
			DrawButton(i, inputTex, inputs, inputRects[i]);
		}
	}
}

private function DrawButton (index : int, texArray : FullResourceImage[], ioCount : int[], drawRect : Rect)
{
	//SetGUITex (texArray[index]);
	
	texArray[index].Draw(drawRect);
	
	if (GUI.Button(drawRect, String.Empty + ioCount[index]))
		ioCount[index]++;
}
/*
private function SetGUITex(tex : Texture2D)
{
	skin.button.active.background = tex;
	skin.button.hover.background = tex;
	skin.button.normal.background = tex;
}
*/
// check if mouse/tap is over any of the GUI buttons
public function MouseOnGUI(pos : Vector2) : boolean
{
	var inputPos: Vector2;
	inputPos.x = pos.x;
	inputPos.y = Screen.height - pos.y;
	for (i = 0; i < MAX_TYPES; i++)
	{
		if (inputRects[i].Contains(inputPos) || outputRects[i].Contains(inputPos))
			return true;
	}
	return false;
}