/**********************************************************
SaveSystem.js

Description: Used to save information in an XML sheet
Will eventually want to impliment encryption/decryption

Should call the save function whenever there is a change to the
player's data, thus functioning as an autosave.

Originally by Katharine Uvick
**********************************************************/

import System.Collections.Generic;
import System.Xml;
import System.IO;

#pragma strict

public var rankSystem : RankSystem = new RankSystem();
public var profileSystem : ProfileSystem = new ProfileSystem();
public var currentPlayer : Player;
private static var exists : boolean = false;

function Awake ()
{
	if(!exists)
	{
		DontDestroyOnLoad(this);
		exists = true;
	}
	else
	{	
		Destroy(this.gameObject);
	}
}

// Loads the ranks, generates the min. experience per rank,
// loads the profile system, and sets the current player
// to whomever was last to log in.
function Start ()
{
	
	rankSystem = rankSystem.Load();
	rankSystem.generateMinExp();
	profileSystem = profileSystem.Load();
	currentPlayer = profileSystem.lastLoggedInPlayer;
	
}

public function SavePlayer(playerName : String)
{
	for(var i : int = 0; i < profileSystem.Players.Count; i++)
	{
		if(profileSystem.Players[i].name == playerName)
		{
			profileSystem.Players[i] = currentPlayer;
			profileSystem.lastLoggedInPlayer = currentPlayer;
			profileSystem.Save();
			return true;
		}
	}
	Debug.Log("Player does not exist");
	return false;
}

public function LoadPlayer(playerName : String):boolean
{
	for(var i : int = 0; i < profileSystem.Players.Count; i++)
	{
		if(profileSystem.Players[i].name == playerName)
		{
			currentPlayer = profileSystem.Players[i];
			profileSystem.lastLoggedInPlayer = currentPlayer;
			profileSystem.Save();
			return true;
		}
	}
	Debug.Log("Player does not exist");
	return false;
}

public function LoadNames(): List.<String>
{
	var playerNames : List.<String> = new List.<String>();
	for(var i : int = 0; i < profileSystem.Players.Count; i++)
	{
		playerNames.Add(profileSystem.Players[i].name);
	}
	return playerNames;
	
}

// Adds new player, returns false if player already exists
public function createPlayer(name : String):boolean
{
	if(name != "")
	{
		for(var i : int = 0; i < profileSystem.Players.Count; i++)
		{
			if(profileSystem.Players[i].name == name)
			{
				Debug.Log("Player already exists");
				return false;
			}
		}
		var newPlayer : Player = rankSystem.generateNewPlayer(name);
		profileSystem.Players.Add(newPlayer);
		return true;
	}
	else
	{
		Debug.Log("Name was blank...");
		return false;
	}
}

public function logout()
{
	currentPlayer = null;
	profileSystem.lastLoggedInPlayer = currentPlayer;
	profileSystem.Save();
}

// Delete player from list, returns true if successful
public function deletePlayer(name : String): boolean
{
	for(var i : int = 0; i < profileSystem.Players.Count; i++)
	{
		if(profileSystem.Players[i].name == name)
		{
			profileSystem.Players.Remove(profileSystem.Players[i]);
			Debug.Log("Player " + name + " removed");
			
			if(currentPlayer.name == name)
			{
				currentPlayer = null;
				profileSystem.lastLoggedInPlayer = currentPlayer;
				profileSystem.Save();
			}
			
			return true;
		}
	}
	Debug.Log("Player does not exist");
	return false;
}


// Profile System, holds all the avaliable players
@XmlRoot("ProfileSystem")
public class ProfileSystem
{
	public var lastLoggedInPlayer : Player = new Player();
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
	 	
	 	for(var i : int = 0; i < Players.Count; i++)
		{
		/*
			if (Players[i].contactDataStorage.contacts == null){
				Players[i].contactDataStorage = ContactData.Instance();
			}
			if (Players[i].codexDataStorage.codices == null){
				Players[i].codexDataStorage = CodexData.Instance();
			}*/
		}
	 	
	 	return system;
	 	
	 }
  	
}

// Information to be stored about a player
// Uses the name as an attribute to identify the player
public class Player
{
	@XmlAttribute("name")
	public var name : String;
	public var exp : int;
	public var rank : int;
	public var rankName : String;
	@XmlArray("levelscores")
  	@XmlArrayItem("leveldata")
	public var levelScores : List.<LevelData> = new List.<LevelData>();
	//@XmlArray("contactData")
  	//@XmlArrayItem("ContactData")
  	//public var contactDataStorage : ContactData;
  	//@XmlArray("codexData")
  	//@XmlArrayItem("CodexData")
  	//public var codexDataStorage : CodexData;
	
	
	// This updates the score or adds it if it wasn't there before
	// Also, it outputs the difference between the stored score
	// and the new score, which can be used to add to experience
	function updateScore(levelName : String, levelScore : int): int
	{
		var scoreDifference : int = 0;
		
		var levelDataExists : boolean = false;
		for(var i : int = 0; i < levelScores.Count; i++)
		{
			if(levelScores[i].levelName == levelName)
			{
				// If the new score is higher:
				if(levelScores[i].levelScore < levelScore)
				{
					scoreDifference = levelScore - levelScores[i].levelScore;
					levelScores[i].levelScore = levelScore;
				}
				levelDataExists = true;
			}
		}
		// If the level data is not found, create new entry
		if(!levelDataExists)
		{
			var levelData : LevelData = new LevelData();
			levelData.levelName = levelName;
			levelData.levelScore = levelScore;
			levelScores.Add(levelData);
			scoreDifference = levelScore;
		}
		
		return scoreDifference;
	}
	
	// Returns the player's score for a particular level
	// Returns 0 if the player has not played the level
	function getPlayerScore(levelName : String): int
	{
		for(var i : int = 0; i < levelScores.Count; i++)
		{
			if(levelScores[i].levelName == levelName)
			{
				return levelScores[i].levelScore;
			}
		}
		
		return 0;
	}
	
	function unlockContact(contactName : String){
		
	}
	
}// End of Player

// Information to be stored about the player
// per level
public class LevelData
{
	@XmlAttribute("levelName")
	public var levelName : String;
	public var levelScore : int;
}