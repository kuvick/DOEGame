#pragma strict

public class MetricMenu extends GUIControl
{
	// Event List
	private var eventList:EventLinkedList;

	// Intel Menu rectangles		
	private var background:Rect; 					
	private var closeButton:Rect;								
	
	// Intel Menu scaling
	private var closeButtonHeightPercent:float = 0.2;
	private var eventNodeHeightPercent:float = 0.03;
	private var fontHeightPercent:float = 0.02;
	
	private var closeButtonHeight:float;
	private var eventNodeHeight:float;
	private var fontHeight:float;

	private var database : Database;
	private var turn : int = 0;
	
	private var graph : Graph;
	private var buildings : List.<GameObject>;
	
	private var endGameString : String;
	
	private var showGraph : boolean = true;
	
	public function Start () 
	{
		super.Start();
	}
	
	public function LoadLevelReferences()
	{
		database = GameObject.Find("Database").GetComponent(Database);
	}
	
	public function Initialize()
	{
		super.Initialize();
		
		closeButtonHeight = closeButtonHeightPercent * screenHeight;
		eventNodeHeight = eventNodeHeightPercent * screenHeight * 4;
		
		fontHeight = fontHeightPercent * screenHeight;
		
		//EVENT LIST (ADDING RANDOM STUFF FOR TESTING)
		//background = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		closeButton = Rect(verticalBarWidth + padding, horizontalBarHeight + padding, closeButtonHeight, closeButtonHeight);					
		
		// Add the background's rect to the rectList for checking input collision
		//rectList.Add(background);
		
		buildings = new List.<GameObject>();
		
		for(var i = 0; i < database.buildingsOnGrid.Count; i++)
		{
			var building : GameObject = new GameObject();
			building.transform.position = database.buildingsOnGrid[i].buildingPointer.transform.position;
			buildings.Add(building);
		}
		
		GenerateLinks();
		
		graph = new Graph(6, 6);
		graph.CreateBars(database.m_display.GetTurnList());
		endGameString = database.m_display.GetEndGameDataAsString();
		
	}
	
	public function GenerateLinks()
	{
		database = GameObject.Find("Database").GetComponent(Database);
		database.m_display.CreateLinkArray(database.buildingsOnGrid.Count);
		
		for(var i = 0; i < database.buildingsOnGrid.Count; i++)
		{
			for(var j = 0; j < database.buildingsOnGrid.Count; j++)
			{
				if(database.m_display.linkArray[i,j] > 0)
				{					
					//Create Line Renderer between buildings[i] and buildings[j]
					var lr : LineRenderer = buildings[i].AddComponent(LineRenderer);
					lr.material = new Material(Shader.Find("Particles/Alpha Blended Premultiply"));
										
					var redValue : float = (database.m_display.linkArray[i,j] / (database.m_display.numberOfLinks / 2));
					
					var lineColor : Color;
					if(redValue < .33)
					{
						lineColor = new Color(0,0,redValue);		
					}
					else if(redValue < .66)
					{
						lineColor = new Color(0,redValue,0.5f);		
					}
					else
					{
						lineColor = new Color(redValue,0.5f,0.5f);		
					}
								
					
					lr.SetColors(lineColor, lineColor);
					lr.SetWidth(10, 10);
					lr.SetVertexCount(2);

					lr.SetPosition(0, buildings[i].transform.position);
					lr.SetPosition(1, buildings[j].transform.position);				
				}
			}
		}
		
		Debug.Log("Links Generated!");
	}
	
	/*		
		Buttons:
			Close - Closes the Intel Menu
	*/
	public function Render()
	{
		//GUI.Box(background, "");
				
		
		if(showGraph){
			rectList.Add(graph.border);
			graph.Render();
		}
		else{
			rectList.Remove(graph.border);
		}
		
		// Closes the event list
		if (GUI.Button(closeButton, "Close"))
		{
			//Destroy objects
			for(var i : int = 0; i < buildings.Count && buildings.Count != 0;)
			{
				GameObject.Destroy(buildings[0]);
				buildings.RemoveAt(0);
			}
			
			isInitialized = false;
			currentResponse.type = EventTypes.MAIN;
		}	
		
		GUI.Label(new Rect(this.graph.border.x, this.graph.border.y + this.graph.border.height, 200, 200), endGameString);
		showGraph = GUI.Toggle(new Rect(Screen.width - 100, Screen.height - 25, 100, 25), showGraph, "Toggle Graph");
	}
}