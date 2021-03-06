#pragma strict
import System.Collections.Generic;
import System.Xml;
import System.Xml.Serialization;
import System.IO;

public class BuildingSerialData
{
	//@XmlAttribute("BuildingData")
	public var Name : String;
	public var Location : Vector3;
	public var Inputs : ResourceType[];
	public var Outputs : ResourceType[];
	public var OptionalOutput : ResourceType;
	public var Active : boolean;

	function BuildingSerialData(){}
	
	function BuildingSerialData(Name : String, Location : Vector3, Inputs : ResourceType[], Outputs : ResourceType[], OptionalOutput : ResourceType, Active : boolean)
	{
		this.Name = Name;
		this.Location = Location;
		this.Inputs = Inputs;
		this.Outputs = Outputs;
		this.OptionalOutput = OptionalOutput; 
		this.Active = Active;
	}
}

public class UnitSerialData
{
	//@XmlAttribute("UnitData")
	public var Location : Vector3;
	public var Type : UnitType;
	
	function UnitSerialData(){}
	
	function UnitSerialData(Location : Vector3, Type : UnitType)
	{
		this.Location = Location;
		this.Type = Type;
	}
}

public class EventSerialData
{
	//@XmlAttribute("EventData")
	public var Name : String;
	public var Title : String;
	public var Description : String;
	public var Type : BuildingEventType;
	public var Turns : int;
	public var Points : int;
	public var Location : Vector3;
	
	function EventSerialData(){}
	
	function EventSerialData(Name : String, Title : String, Description : String, Type: BuildingEventType, Turns : int, Points: int, Location : Vector3)
	{
		this.Name = Name;
		this.Title = Title;
		this.Description = Description;
		this.Type = Type;
		this.Turns = Turns;
		this.Points = Points;
		this.Location = Location;
	}
}

@XmlRoot("LevelCollection")
public class LevelSerializer
{
	@XmlArray("Buildings")
	@XmlArrayItem("Building")
	public var Buildings : List.<BuildingSerialData>;	


	@XmlArray("Units")
	@XmlArrayItem("Unit")
	public var Units : List.<UnitSerialData>;
	
	@XmlArray("Events")
	@XmlArrayItem("Event")
	public var Events : List.<EventSerialData>;
	function LevelSerializer()
	{
		Buildings = new List.<BuildingSerialData>();
		Units = new List.<UnitSerialData>();
		Events = new List.<EventSerialData>();
	}

	public function Save(path : String)	
	{
		var serializer : XmlSerializer = new XmlSerializer(LevelSerializer);		
		var stream : FileStream = new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this);		
		stream.Close();		
	} 
	
	public static function Load(path : String) : LevelSerializer
	{
		var serializer : XmlSerializer = new XmlSerializer(LevelSerializer);
		var stream : FileStream = new FileStream(path, FileMode.Open);
		var result : LevelSerializer = serializer.Deserialize(stream) as LevelSerializer;
		stream.Close();
		return result;	
	}
	
	public static function LoadFromText(text : String) : LevelSerializer
	{
		var serializer : XmlSerializer = new XmlSerializer(LevelSerializer);
		return serializer.Deserialize(new StringReader(text)) as LevelSerializer;
	}
	
}