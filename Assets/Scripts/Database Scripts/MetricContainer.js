#pragma strict
import System.Collections.Generic;
import System.Xml;
import System.Xml.Serialization;
import System.IO;

public class TurnData
{
	@XmlAttribute("TurnData")
	public var Name : String;
	public var Turn: int;	
	public var RemainingEvents: int;
	public var Type : String;

	function TurnData(){}
	
	function TurnData(Name : String, Turn : int, RemainingEvents : int, Type : String)
	{
		this.Name = Name;
		this.Turn = Turn;		
		this.RemainingEvents = RemainingEvents;
		this.Type = Type;
	}
}

public class LinkData
{
	@XmlAttribute("LinkData")
	public var Type : String;
	
	public var InputBuildingIndex : int;
	public var InputBuildingName : String;
	
	public var OutputBuildingIndex : int;
	public var OutputBuildingName : String;
	
	public var oldOutputBuildingIndex : int = -1;
	public var oldInputBuildingIndex : int = -1;
	
	function LinkData(){}
	
	function LinkData(Type: String, 
				InputBuildingIndex : int, 
				InputBuildingName : String,
				OutputBuildingIndex : int,
				OutputBuildingName : String,
				oldOutputBuildingIndex : int,
				oldInputBuildingIndex : int )
	{
		this.Type = Type;
		this.InputBuildingIndex = InputBuildingIndex;
		this.InputBuildingName = InputBuildingName;
		this.OutputBuildingIndex = OutputBuildingIndex;
		this.OutputBuildingName = OutputBuildingName;
		this.oldOutputBuildingIndex = oldOutputBuildingIndex;
		this.oldInputBuildingIndex = oldInputBuildingIndex;
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
				InputBuildingIndex : int, 
				InputBuildingName : String,
				OutputBuildingIndex : int,
				OutputBuildingName : String,
				oldOutputBuildingIndex : int,
				oldInputBuildingIndex : int )
	{
		Links.Add(new LinkData(
					Type, 
					InputBuildingIndex, 
					InputBuildingName, 
					OutputBuildingIndex, 
					OutputBuildingName,
					oldOutputBuildingIndex, 
					oldInputBuildingIndex));
	}
}
