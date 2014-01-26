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
	
	
	function HasOutputToUse(building:BuildingOnGrid):boolean
	{
		//If the building is active and:
			// Has optional output, allocated or unallocated
			// or has a worker unit and has optional output (allocated or unallocated)
	
		if(building.isActive &&
			(building.allOutputs.Count > 0 ||//ocatedOutputs.Count > 0 ||
			building.unallOutputs.Count > 0 ||//ocatedOutputs.Count > 0 ||
			(building.optionalOutputFixed && building.optOutput.resource != ResourceType.None)))//ionalOutput != ResourceType.None)))
		{
			return true;
		}

		return false;
	}
	
	
	function Update ()
	{	
		var dragMode : DragMode = inputController.GetDragMode();
		if(inputController.getState() == ControlState.Dragging && dragMode >= DragMode.Link &&
		   ModeController.getSelectedBuilding() != null && 
		   ModeController.getSelectedBuilding().name != "BuildingSite")
		{
			if (!Database.getBuildingOnGrid(ModeController.getSelectedBuilding().transform.position).isActive)
			{
				SoundManager.Instance().PlayLinkDenied();
				ModeController.setSelectedBuilding(null);
				return;
			} 
			else if(dragMode ==  DragMode.Link && 
					!HasOutputToUse(Database.getBuildingOnGrid(ModeController.getSelectedBuilding().transform.position)))
			{
				SoundManager.Instance().PlayLinkDenied();
				ModeController.setSelectedBuilding(null);
				return;
			}
			//var buildingData:BuildingData = ModeController.getSelectedBuilding().GetComponent("BuildingData");
			
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
				GUIManager.Instance().FadeMenus();
				dragging = true;
				outputBuilding = ModeController.getSelectedBuilding();
				resourceType = linkUI.getSelectedResource();
				if(resourceType == ResourceType.None)
					resourceType = 2;
				
				
				// New, since you can't add multiple line renderers,
				// this will hopefully catch that and use the one
				// that's apparently already there?
				lineRenderer = outputBuilding.GetComponent(LineRenderer);
				if(lineRenderer == null)
					lineRenderer = outputBuilding.AddComponent(LineRenderer);
				
				lineRenderer.material = new Material(Shader.Find("Particles/Additive"));
				//lineRenderer.material.mainTexture = drawLinks.linkTextures[resourceType - 1];
				lineRenderer.material.mainTexture = line;
				
				// line renderer settings, defaulting for links
				var lineColor : Color = Color.white;
				var startPos : Vector3 = outputBuilding.transform.position;
				// change appropriately for unit targeting
				if (dragMode == DragMode.Unit)
				{
					lineColor = Color.red;
					var buildingData : BuildingOnGrid = Database.getBuildingOnGrid(startPos);
					startPos = buildingData.units[buildingData.selectedUnitIndex].gameObject.transform.position;
				}
					
				lineRenderer.SetColors(lineColor, lineColor);
				lineRenderer.SetWidth(10, 10);
		
				lineRenderer.SetPosition(0, startPos);
				lineRenderer.SetPosition(1, mousePos);
				
				startDrag = false;
				SoundManager.Instance().PlayLinkDraging();
			}
			
			lineRenderer.SetPosition(1, mousePos);	
		}
		else
		{
			GUIManager.Instance().UnFadeMenus();
			SoundManager.Instance().StopLinkDraging();
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