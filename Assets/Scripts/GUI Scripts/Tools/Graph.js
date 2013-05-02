#pragma strict


class Point
{
	var position : Vector2;
	var color : Color;
	
	public function Point(x : float, y : float, color : Color)
	{
		this.position = new Vector2(x,y);
		this.color = color;
	}
	
	public function Point(position : Vector2, color : Color)
	{
		this.position = position;
		this.color = color;
	}
	
}

class Line
{
	var Start : Vector2;
	var End : Vector2;
	var Vector : Vector2;
	
	var m : float;
	var b : float;
	
	public function Line(Start : Vector2, End : Vector2)
	{
		this.Start = Start;
		this.End = End;
		
		this.Vector = new Vector2(End.x - Start.x, End.y - Start.y);
		this.m = this.Vector.y / this.Vector.x;
		this.b = -1 * ((m * Start.x) - Start.y);
	}
	
	public function isOnLine(point : Vector2) : boolean
	{
		if(point.y == (m * point.x) + b)
		{
			return true;
		}
		return false;
	}
}

public class Graph{	
	private var border : Rect;
	
	public  var xVarLowerBound : int = 0;
	public  var xVarUpperBound : int = 100;
	
	public  var yVarLowerBound : int = 0;
	public  var yVarUpperBound : int = 100;
	
	public var Points : List.<Point>;
	public var Lines : List.<Line>;
	
	public var xVarLabel : String;
	public var yVarLabel : String;
	
	private var texture : Texture2D;

	public function Graph()
	{
		Initialize();
	}
	public function Initialize()
	{	
		texture = new Texture2D(512,512);							
		border = new Rect(0,0, 512, 512);
		//Renderer.material.mainTexture = texture; 
		Points = new List.<Point>();
		Lines = new List.<Line>();
				
		Points.Add(new Point(new Vector2(10,   10), new Color(.9f,0f,0f)));
		Points.Add(new Point(new Vector2(12,  50), new Color(.9f,0f,0f)));
		Points.Add(new Point(new Vector2(50, 50), new Color(.9f,0f,0f)));
		Points.Add(new Point(new Vector2(50,  10), new Color(.9f,0f,0f)));		
		
		for(var i : int = 0; i < Points.Count - 1; i++)
		{
			var startX = (Points[i].position.x/xVarUpperBound) * texture.width;
			var startY = (Points[i].position.y/yVarUpperBound) * texture.height;
			
			var endX = (Points[i+1].position.x/xVarUpperBound) * texture.width;
			var endY = (Points[i+1].position.y/yVarUpperBound) * texture.height;
						
			Lines.Add(new Line(new Vector2(startX, startY), new Vector2(endX, endY)));
		}	
		
		for (var y : int = 0; y < texture.height; ++y) {
			for (var x : int = 0; x < texture.width; ++x) {
				for(var index : int = 0; index < Lines.Count; index++)
				{
					if(Lines[index].isOnLine(new Vector2(x,y)))
						texture.SetPixel (x, y, new Color(.9,0,0));
				}

			}		
		}					
        texture.Apply();
	}
	
	public function Render()
	{
		GUI.Box(border, texture);
	}
}