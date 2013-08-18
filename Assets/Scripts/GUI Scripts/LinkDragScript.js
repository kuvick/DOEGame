/*
LinkDragScript.js, originally by K. Uvick

Script to visually show the player dragging the link from one building to the next.

*/

#pragma strict

public class LinkDragScript extends GUIControl
{
	public var orb : Texture;
	public var line : Texture;
	private var dragging : boolean = false;
	private var draggingSpec : boolean = false;
	private var orbPercent : float = 0.02;
	
	// Script Ref.
	private var inputController : InputController;
	private var drawLinks : DrawLinks;
	private var linkUI : LinkUI;
	private var thisCamera : Camera;
	
	private var lineRenderer : LineRenderer;
	private var startDrag : boolean = true;
	private var outputBuilding : GameObject;
	private var resourceType : ResourceType;
	
	public var terrainHeight : float = 35;
	
	function Start ()
	{
		drawLinks = gameObject.GetComponent("DrawLinks");
		linkUI = gameObject.GetComponent("LinkUI");
		inputController = GameObject.Find("HexagonGrid").GetComponent("InputController");
		thisCamera = GameObject.Find("Main Camera").camera;
		
		/*
		Used to check to make sure scripts loaded properly
		
		if(drawLinks != null && linkUI != null && inputController != null)
			Debug.Log("Victory!");
		else
		{
			Debug.Log("DrawLink: " + (drawLinks != null));
			Debug.Log("LinkUI: " + (linkUI != null));
			Debug.Log("Input: " + (inputController != null));
		}
		*/
	}
	
	function Update ()
	{	
	
		//linkUI.READcancelLinkMode();
		//Debug.Log("**********************output: " + (linkUI.getSelectedOutputBuilding() != null));
		//Debug.Log("asdf--------resource: " + (linkUI.getSelectedResource() != ResourceType.None));
		
		//if(linkUI.getSelectedResource() != ResourceType.None && linkUI.getSelectedOutputBuilding() != null)
		//if(linkUI.getSelectedResource() != ResourceType.None && linkUI.getSelectedOutputBuilding() != null)
		//if(draggingSpec && ModeController.getSelectedBuilding() != null && (!Input.GetMouseButtonUp(0) && ((Input.touchCount <= 0) || Input.GetMouseButtonDown(0)) ))
		if(inputController.getState() == ControlState.DraggingLink && 
		   ModeController.getSelectedBuilding() != null && 
		   ModeController.getSelectedBuilding().name != "BuildingSite" && 
		   Database.getBuildingOnGrid(ModeController.getSelectedBuilding().transform.position).isActive)
		{
				//var buildingData:BuildingData = ModeController.getSelectedBuilding().GetComponent("BuildingData");
				//Debug.Log("is active: " + buildingData.buildingData.isActive);
				
				//Code snippet borrowed from HexagonGrid section
			 	//get the mouse coordinates, project them onto the plane to get world coordinates of the mouse
				var ray: Ray = thisCamera.ScreenPointToRay(Input.mousePosition);
				var enter: float = 0f; //enter stores the distance from the ray to the plane
				HexagonGrid.plane.Raycast(ray, enter);
				var mousePos: Vector3 = ray.GetPoint(enter);
				//var mousePos : Vector3 =  thisCamera.ScreenToWorldPoint(Vector3 (linkUI.getMousePos()[0],linkUI.getMousePos()[1],400));
				//mousePos = Vector3(mousePos.x, terrainHeight, mousePos.z);
			
				if(startDrag)
				{
					dragging = true;
					outputBuilding = ModeController.getSelectedBuilding();
					resourceType = linkUI.getSelectedResource();
					if(resourceType == ResourceType.None)
						resourceType = 2;
					
					lineRenderer = outputBuilding.AddComponent(LineRenderer);
					
					lineRenderer.material = new Material(Shader.Find("Particles/Additive"));
					//lineRenderer.material.mainTexture = drawLinks.linkTextures[resourceType - 1];
					lineRenderer.material.mainTexture = line;
					lineRenderer.SetColors(Color.white, Color.white);
					lineRenderer.SetWidth(10, 10);
					lineRenderer.SetPosition(0, outputBuilding.transform.position);
					lineRenderer.SetPosition(1, mousePos);
					
					startDrag = false;
				}
				
				
				lineRenderer.SetPosition(1, mousePos);	


		}
		else
		{
			dragging = false;
			if(lineRenderer != null)
			{
				Destroy(lineRenderer);
			}
			startDrag = true;
		}
	}
	
}// End of LinkDragScript.js

function OnGUI()
{
	if(dragging)
	{
		var orbSide : float = Screen.width * orbPercent;
		var position : Rect = Rect(linkUI.getMousePos()[0] - orbSide/2, linkUI.getMousePos()[1] - orbSide/2, orbSide, orbSide);
		GUI.DrawTexture(position, orb);
	}
}

function isDragging(bool:boolean)
{
	draggingSpec = bool;
}