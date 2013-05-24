import System.Collections.Generic;
import System.Xml;
import System.IO;

#pragma strict

public var rankSystem : RankSystem = new RankSystem();
public var profileSystem : ProfileSystem = new ProfileSystem();
public var currentPlayer : Player;

function Start ()
{
	rankSystem = rankSystem.Load();
	rankSystem.generateMinExp();
	
	//var testPlayer : Player = rankSystem.generateNewPlayer("Eris");
	
	//profileSystem.Players.Add(testPlayer);
	
	profileSystem = profileSystem.Load();
	
	currentPlayer = profileSystem.Players[0];
	
}

function Update ()
{

}

public function Save(playerName : String)
{

}

public function Load(playerName : String)
{

}

public function loadNames(): String[]
{

}

// XML Xerialization:
@XmlRoot("ProfileSystem")
public class ProfileSystem
{
	@XmlArray("Players")
  	@XmlArrayItem("Player")
  	public var Players : List.<Player> = new List.<Player>();
  	
  	public function Save()
	{
		var serializer : XmlSerializer = new XmlSerializer(ProfileSystem);
		var path : String = Path.Combine(Application.persistentDataPath, "ProfileSystem.xml");
		var stream : Stream = new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this);
	 	stream.Close();
	 	Debug.Log("Saved: " + path);
 	}
 	
 	public function Load(): ProfileSystem
 	{
 		var path : String = Path.Combine(Application.persistentDataPath, "ProfileSystem.xml");
 		Debug.Log("Loaded: " + path);
 		
 	 	var serializer : XmlSerializer = new XmlSerializer(ProfileSystem);
	 	var stream : Stream = new FileStream(path, FileMode.Open);
	 	var system : ProfileSystem = serializer.Deserialize(stream) as ProfileSystem;
	 	stream.Close();
	 	return system;
	 	
	 }
  	
}

public class Player
{
	@XmlAttribute("name")
	public var name : String;
	public var exp : int;
	public var rank : int;
	public var rankName : String;	
	
}