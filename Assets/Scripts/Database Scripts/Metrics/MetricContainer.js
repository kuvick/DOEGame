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
	
	public var InputBuildingLocation : Vector3;
	public var InputBuildingName : String;
	
	public var OutputBuildingLocation : Vector3;
	public var OutputBuildingName : String;
	
	public var oldOutputBuildingLocation : Vector3;
	public var oldInputBuildingLocation: Vector3;
	
	function LinkData(){}
	
	function LinkData(Type: String, 
				Turn: int,
				InputBuildingLocation : Vector3, 
				InputBuildingName : String,
				OutputBuildingLocation : Vector3,
				OutputBuildingName : String,
				oldOutputBuildingLocation : Vector3,
				oldInputBuildingLocation : Vector3 )
	{
		this.Type = Type;
		this.Turn = Turn;
		this.InputBuildingLocation = InputBuildingLocation;
		this.InputBuildingName = InputBuildingName;
		this.OutputBuildingLocation = OutputBuildingLocation;
		this.OutputBuildingName = OutputBuildingName;
		this.oldOutputBuildingLocation = oldOutputBuildingLocation;
		this.oldInputBuildingLocation = oldInputBuildingLocation;
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

public class NarrativeData
{	
	public var timeSpentTotal : float;
	public var timeBeforeClick : List.<float>;
	public var wasSkipped : boolean = false;
	
	function NarrativeData(){}
	
	function NarrativeData(timeSpentTotal : float,wasSkipped : boolean)
	{
		this.timeSpentTotal = timeSpentTotal;
		this.wasSkipped = wasSkipped;
	}	
}

@XmlRoot("MetricCollection")
public class MetricContainer
{
	@XmlArrayItem("ID")
	public var ID : String;

	@XmlArray("Turns")
	@XmlArrayItem("Turn")
	public var Turns : List.<TurnData>;	
	
	
	@XmlArray("Links")
	@XmlArrayItem("Link")
	public var Links : List.<LinkData>;	
	
	@XmlAttribute("EndGameData")	
	public var EndGame : EndGameData;
	
	@XmlAttribute("Narratives")
	public var Narrative : NarrativeData;
	
	function MetricContainer()
	{
		Turns = new List.<TurnData>();	
		Links = new List.<LinkData>();	
		Narrative = new NarrativeData();
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
	
	public function SaveNarrative(path : String)
	{
		var pattern : String = "[^0-9]";
		var Now : String = System.DateTime.Now.ToString();		
		
		//Remove all characters except numbers
		Now = Regex.Replace(Now, pattern, String.Empty);
		
		Debug.Log("Now : " + Now);
		
		path = Path.Combine(path, Now + "_NAR.xml");
	
		var serializer : XmlSerializer = new XmlSerializer(NarrativeData);		
		var stream : FileStream = new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this.Narrative);		
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
	
	public static function LoadLinkData(path : String) : List.<LinkData>
	{
		var serializer : XmlSerializer = new XmlSerializer(List.<LinkData>);
		var stream : FileStream = new FileStream(path, FileMode.Open);
		var result : List.<LinkData> = serializer.Deserialize(stream) as List.<LinkData>;
		stream.Close();
		return result;		
	}
	
	public static function LoadTurnData(path : String) : List.<TurnData>
	{
		var serializer : XmlSerializer = new XmlSerializer(List.<TurnData>);
		var stream : FileStream = new FileStream(path, FileMode.Open);
		var result : List.<TurnData> = serializer.Deserialize(stream) as List.<TurnData>;
		stream.Close();
		return result;		
	}
	
	public static function LoadEndData(path : String) : EndGameData
	{
		var serializer : XmlSerializer = new XmlSerializer(EndGameData);
		var stream : FileStream = new FileStream(path, FileMode.Open);
		var result : EndGameData = serializer.Deserialize(stream) as EndGameData;
		stream.Close();
		return result;	
	}
	
	public static function LoadNarrativeData(path : String) : NarrativeData
	{
		var serializer : XmlSerializer = new XmlSerializer(NarrativeData);
		var stream : FileStream = new FileStream(path, FileMode.Open);
		var result : NarrativeData = serializer.Deserialize(stream) as NarrativeData;
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
				InputBuildingLocation : Vector3, 
				InputBuildingName : String,
				OutputBuildingLocation : Vector3,
				OutputBuildingName : String,
				oldOutputBuildingLocation : Vector3,
				oldInputBuildingLocation : Vector3 )
	{
		Links.Add(new LinkData(
					Type, Turn,
					InputBuildingLocation, InputBuildingName, 
					OutputBuildingLocation, OutputBuildingName,
					oldOutputBuildingLocation, oldInputBuildingLocation));
	}
}
