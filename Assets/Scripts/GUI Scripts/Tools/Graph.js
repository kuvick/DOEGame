#pragma strict

class Bar
{
	private var height : float = 0;
	private var width : float = 0;	
	private var name : String;
	private var count : int = 0;
	private var texture : Texture2D;
	private var style : GUIStyle;
	private var color : Color;
	
	public var bounds : Rect;
	
	public function Bar(height : int, width : int, position : Vector2, name : String, count : int, color : Color)
	{
		this.height = height;
		this.width = width;
		this.name = name;
		this.count = count;
		this.color = color;
		
		texture = new Texture2D(1,1);
		texture.SetPixel(0, 0, color);
		texture.wrapMode = TextureWrapMode.Repeat;
		style = new GUIStyle();
		style.normal.background = texture;
		style.normal.textColor = Color.white;
		style.alignment = TextAnchor.MiddleCenter;
		texture.Apply();
		
		bounds = new Rect(position.x, position.y,width, height);
	}
	
	public function Render()
	{
		GUI.Label(bounds, this.name + "\n" + count, style);
	}
}

public class Graph{	
	public var border : Rect;
	
	public  var xVarLowerBound : int = 0;
	public  var xVarUpperBound : int = 100;
	
	public  var yVarLowerBound : int = 0;
	public  var yVarUpperBound : int = 100;		
	
	public var label : String = "Number of Turn Types";
	public var xVarLabel : String;
	public var yVarLabel : String;
	
	private var texture : Texture2D;
	
	private var numberOfRows : int  = 0;
	private var numberOfColumns : int = 0;
	
	private var widthPercent : float = 0.9f;
	private var heightPercent : float = 0.75f;
	
	private var BarList : List.<Bar>;
	private var barWidth : int = 0;

	public function Graph(numberOfRows : int, numberOfColumns : int)
	{
		this.numberOfRows = numberOfRows;
		this.numberOfColumns = numberOfColumns;
		
		Initialize();		
	}
	
	public function Initialize()
	{	
		
		border = new Rect(Screen.width * ((1 - widthPercent) / 2), 5 ,Screen.width * widthPercent, Screen.height * heightPercent);							
		texture = new Texture2D(border.width * widthPercent, border.height * heightPercent);							
		
		BarList = new List.<Bar>();
		
		//Create Grid
		for (var y : int = 0; y < texture.height; ++y) {
			for (var x : int = 0; x < texture.width; ++x) {
				//If its a column
				for(var column : int = 1; column <= numberOfColumns; column++)
				{
					if(x == (texture.width / numberOfColumns* column) )
					{
						texture.SetPixel (x, y, new Color(.5, .5, .5));
					}										
				}
				//If its a Row
				for(var row : int = 1; row <= numberOfRows; row++)
				{
					if(y == (texture.height / numberOfRows* row) )
					{
						texture.SetPixel (x, y, new Color(.5, .5, .5));
					}										
				}

			}		
		}					
        texture.Apply();      
	}
	
	public function CreateBars(list : List.<TurnData>)
	{	
		var linkCount : float = 0;
		var OverloadCount : float = 0;
		var ChainBreakCount : float = 0;
		var WaitCount : float = 0;
		var BuildingSiteCount : float = 0;				
		
		
		//Count number of each element
		for(var i : int = 0; i < list.Count; i++)
		{
			switch(list[i].Type)
			{
				case "BuildingSite":
					BuildingSiteCount++;
					break;
				case "Wait":
					WaitCount++;
					break;
				case "Chainbreak":
					ChainBreakCount++;
					break;
				case "Overload Link":
					OverloadCount++;
					break;
				case "Building Link":
					linkCount++;
					break;
			}
		}
		
		barWidth = texture.width / 6;
		//Bar(height : float, width : float, position : Vector2, name : String, count : int)
		var t : float = texture.height * (linkCount / list.Count);
		var xPos : float = border.x + border.width * (1 - widthPercent) / 2;
		BarList.Add(new Bar(texture.height * (linkCount / list.Count), barWidth, new Vector2(xPos, border.y + texture.height - (texture.height * (linkCount / list.Count) - 5)),"Building Links", linkCount, Color.red)); //Links
		xPos += barWidth;
		BarList.Add(new Bar(texture.height * (OverloadCount / list.Count), barWidth, new Vector2(xPos, border.y + texture.height - (texture.height * (OverloadCount / list.Count) - 5)),"Overload Link", OverloadCount, Color.green)); //Overload
		xPos += barWidth;
		BarList.Add(new Bar(texture.height * (ChainBreakCount / list.Count), barWidth, new Vector2(xPos, border.y + texture.height - (texture.height * (ChainBreakCount / list.Count) - 5)),"Chainbreak Link", ChainBreakCount, Color.yellow)); //ChainBreak
		xPos += barWidth;
		BarList.Add(new Bar(texture.height * (WaitCount / list.Count), barWidth, new Vector2(xPos,border.y + texture.height - (texture.height * (WaitCount / list.Count) - 5)),"Wait", WaitCount, Color.blue)); //Wait
		xPos += barWidth;
		BarList.Add(new Bar(texture.height * (BuildingSiteCount / list.Count), barWidth, new Vector2(xPos, border.y + texture.height - (texture.height * (BuildingSiteCount / list.Count) - 5)),"Building Site", BuildingSiteCount, Color.grey)); //BuildingSite
		
		
	}
	
	public function Render()
	{
		GUI.Box(border, texture);		
		GUI.Label(new Rect(border.x + border.width / 3, border.y + texture.height, border.width / 3, border.height / 10), label);
		
		for(var b : Bar in BarList)
		{
			b.Render();
		}
	}
}