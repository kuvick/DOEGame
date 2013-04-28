#pragma strict
import System.Collections.Generic;
import System.Xml;
import System.Xml.Serialization;
import System.IO;
import System.Text.RegularExpressions;

public class TurnData
{
	@XmlAttribute("TurnData")
	public var Name : String;
	public var Turn: int;	
	public var RemainingEvents: int;
	public var Type : String;
	public var TimeSinceLevelLoad: float;

	function TurnData(){}
	
	function TurnData(Name : String, Turn : int, RemainingEvents : int, Type : String)
	{
		this.Name = Name;
		this.Turn = Turn;		
		this.RemainingEvents = RemainingEvents;
		this.Type = Type;
		this.TimeSinceLevelLoad = Time.timeSinceLevelLoad;
	}
}

public class LinkData
{
	@XmlAttribute("LinkData")
	public var Type : String;
	public var Turn : int;
	
	public var InputBuildingIndex : int;
	public var InputBuildingName : String;
	
	public var OutputBuildingIndex : int;
	public var OutputBuildingName : String;
	
	public var oldOutputBuildingIndex : int = -1;
	public var oldInputBuildingIndex : int = -1;
	
	function LinkData(){}
	
	function LinkData(Type: String, 
				Turn: int,
				InputBuildingIndex : int, 
				InputBuildingName : String,
				OutputBuildingIndex : int,
				OutputBuildingName : String,
				oldOutputBuildingIndex : int,
				oldInputBuildingIndex : int )
	{
		this.Type = Type;
		this.Turn = Turn;
		this.InputBuildingIndex = InputBuildingIndex;
		this.InputBuildingName = InputBuildingName;
		this.OutputBuildingIndex = OutputBuildingIndex;
		this.OutputBuildingName = OutputBuildingName;
		this.oldOutputBuildingIndex = oldOutputBuildingIndex;
		this.oldInputBuildingIndex = oldInputBuildingIndex;
	}
}

public class EndGameData
{	
	public var TimeInSeconds : int;
	public var Score : int;
	public var TotalEvents: int;
	public var EventsIncomplete : int;
	public var Turns : int;
	public var TimesUndoPressed : int;
	
	function EndGameData(){};
	
	function EndGameData(Score : int, totalEvents : int, eventsIncomplete : int, turns : int, TimesUndoPressed : int)
	{
		this.TimeInSeconds = Time.timeSinceLevelLoad;
		this.Score = Score;
		this.TotalEvents = totalEvents;
		this.EventsIncomplete = eventsIncomplete;
		this.Turns = turns;
		this.TimesUndoPressed = TimesUndoPressed;
	}
}

@XmlRoot("MetricCollection")
public class MetricContainer
{
	@XmlArray("Turns")
	@XmlArrayItem("Turn")
	public var Turns : List.<TurnData>;	
	
	
	@XmlArray("Links")
	@XmlArrayItem("Link")
	public var Links : List.<LinkData>;	
	
	@XmlAttribute("EndGameData")	
	public var EndGame : EndGameData;
	
	function MetricContainer()
	{
		Turns = new List.<TurnData>();	
		Links = new List.<LinkData>();	
	}
	
	public function Save(path : String)	
	{
		var serializer : XmlSerializer = new XmlSerializer(MetricContainer);		
		var stream : FileStream = new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this);		
		stream.Close();		
	} 
	
	public function SaveLink(path : String)
	{
		var pattern : String = "[^0-9]";
		var Now : String = System.DateTime.Now.ToString();		
		
		//Remove all characters except numbers
		Now = Regex.Replace(Now, pattern, String.Empty);
		
		Debug.Log("Now : " + Now);
		
		path = Path.Combine(path, Now + "_LINK.xml");
	
	
		var serializer : XmlSerializer = new XmlSerializer(List.<LinkData>);		
		var stream : FileStream = new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this.Links);		
		stream.Close();	
	}

	public function SaveTurn(path : String)
	{
		var pattern : String = "[^0-9]";
		var Now : String = System.DateTime.Now.ToString();		
		
		//Remove all characters except numbers
		Now = Regex.Replace(Now, pattern, String.Empty);
		
		Debug.Log("Now : " + Now);
		
		path = Path.Combine(path, Now + "_TURN.xml");
		
		var serializer : XmlSerializer = new XmlSerializer(List.<TurnData>);		
		var stream : FileStream = new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this.Turns);		
		stream.Close();	
	}
			
	public function SaveEndGame(path: String)
	{		
		var pattern : String = "[^0-9]";
		var Now : String = System.DateTime.Now.ToString();		
		
		//Remove all characters except numbers
		Now = Regex.Replace(Now, pattern, String.Empty);
		
		Debug.Log("Now : " + Now);
		
		path = Path.Combine(path, Now + "_END.xml");
	
		var serializer : XmlSerializer = new XmlSerializer(EndGameData);		
		var stream : FileStream = new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this.EndGame);		
		stream.Close();	
	}
	
	public static function Load(path : String) : MetricContainer
	{
		var serializer : XmlSerializer = new XmlSerializer(MetricContainer);
		var stream : FileStream = new FileStream(path, FileMode.Open);
		var result : MetricContainer = serializer.Deserialize(stream) as MetricContainer;
		stream.Close();
		return result;	
	}
	
	public static function LoadFromText(text : String) : MetricContainer
	{
		var serializer : XmlSerializer = new XmlSerializer(MetricContainer);
		return serializer.Deserialize(new StringReader(text)) as MetricContainer;
	}
	
	//Add and LinkData element to the Container
	public function addLinkData(link : LinkData)
	{
		Links.Add(link);
	}
	
	public function addLinkData(Type: String, 
				Turn: int,
				InputBuildingIndex : int, 
				InputBuildingName : String,
				OutputBuildingIndex : int,
				OutputBuildingName : String,
				oldOutputBuildingIndex : int,
				oldInputBuildingIndex : int )
	{
		Links.Add(new LinkData(
					Type, Turn,
					InputBuildingIndex, InputBuildingName, 
					OutputBuildingIndex, OutputBuildingName,
					oldOutputBuildingIndex, oldInputBuildingIndex));
	}
}
