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

/*
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
*/

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

public function SaveCurrentPlayer(){
	SavePlayer(currentPlayer.name);
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
	Debug.Log("Player " + playerName + " does not exist");
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
		//var path : String = Path.Combine(Application.persistentDataPath, "ProfileSystem.xml");
		var stream : MemoryStream = new MemoryStream();//new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this);
	 	//stream.Close();
	 	var tmp : String = System.Convert.ToBase64String(stream.ToArray());
	 	PlayerPrefs.SetString("profiles", tmp);
	 	//Debug.Log("Saved: " + path);
 	}
 	
 	public function Load(): ProfileSystem
 	{
 		//var path : String = Path.Combine(Application.persistentDataPath, "ProfileSystem.xml");
 		var tmp : String = PlayerPrefs.GetString("profiles", String.Empty);
 		//Debug.Log("Loaded: " + path);
 		
 	 	var serializer : XmlSerializer = new XmlSerializer(ProfileSystem);
 	 	if (tmp == String.Empty)
 	 	{//!File.Exists(path)){
 	 		SetUpProfiles();
 	 		return this;
 	 	}
	 	var stream : MemoryStream = new MemoryStream(System.Convert.FromBase64String(tmp));//Stream = new FileStream(path, FileMode.Open);
	 	var system : ProfileSystem = serializer.Deserialize(stream) as ProfileSystem;
	 	//stream.Close();

	 	return system;
	 }
  	
  	/// Generates the intital content of the profile system
  	/// Used for the first loading or if the file is deleted
  	private function SetUpProfiles(){
  		if (lastLoggedInPlayer == null){
  			Debug.LogError("Attempting to setup profiles when there was no last player.");
  			return;
  		}
  		if (Players.Count == 0){
  			Debug.LogWarning("Attempting to setup profiles when there were no players adding the last logged in one.");
  			Players.Add(lastLoggedInPlayer);
  		}
  		if (lastLoggedInPlayer.codexData.codices.Count == 0){
			Debug.Log("No codex data for " + lastLoggedInPlayer.name + " loading it from source.");
			lastLoggedInPlayer.codexData.LoadFromSource();
		}
		
		if (lastLoggedInPlayer.contactData.contacts.Count == 0){
			Debug.Log("No contact data for " + lastLoggedInPlayer.name + " loading it from source.");
			lastLoggedInPlayer.contactData.LoadFromSource();
		}
		
		var codexSource : CodexData = new CodexData();
		codexSource.LoadFromSource();
		var contactSource = new ContactData();
  		contactSource.LoadFromSource();
		
  		for (var player : Player in Players){
  			if (player.codexData.codices.Count == 0){
  				Debug.Log("No codex data for " + player.name + " loading it from source.");
  				player.codexData = codexSource;
  			}
  			
  			if (player.contactData.contacts.Count == 0){
  				Debug.Log("No contact data for " + player.name + " loading it from source.");
  				player.contactData = contactSource;
  			}
  		}

  		Save();
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
	public var levelDataList : List.<LevelData> = new List.<LevelData>();
	public var levelLockIndex : int;
  	public var contactData : ContactData;
  	public var codexData : CodexData;
	
	// This updates the score or adds it if it wasn't there before
	// Also, it outputs the difference between the stored score
	// and the new score, which can be used to add to experience
	function updateScore(levelName : String, levelScore : int): int
	{
		var scoreDifference : int = 0;
		
		var levelDataExists : boolean = false;
		for(var i : int = 0; i < levelDataList.Count; i++)
		{
			if(levelDataList[i].levelName == levelName)
			{
				// If the new score is higher:
				if(levelDataList[i].levelScore < levelScore)
				{
					scoreDifference = levelScore - levelDataList[i].levelScore;
					levelDataList[i].levelScore = levelScore;
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
			levelDataList.Add(levelData);
			scoreDifference = levelScore;
		}
		
		return scoreDifference;
	}
	
	// Returns the player's score for a particular level
	// Returns 0 if the player has not played the level
	function getPlayerScore(levelName : String): int
	{
		for(var i : int = 0; i < levelDataList.Count; i++)
		{
			if(levelDataList[i].levelName == levelName)
			{
				return levelDataList[i].levelScore;
			}
		}
		
		return 0;
	}
	
	public function unlockContact(contactName : String){
		contactData.UnlockContact(contactName);
	}
	
	public function lockContact(contactName : String){
		contactData.LockContact(contactName);
	}
	
	public function unlockCodex(codexName : String){
		codexData.UnlockCodex(codexName);
	}
	
	public function lockCodex(codexName : String){
		codexData.LockCodex(codexName);
	}
	
	public function completeLevel(levelName : String){
		var levelDataExists : boolean = false;
		for(var i : int = 0; i < levelDataList.Count; i++)
		{
			if(levelDataList[i].levelName == levelName){
				levelDataExists = true;
				levelDataList[i].levelCompleted = true;
				return;
			}
		}
		// If the level data is not found, create new entry
		if(!levelDataExists)
		{
			var levelData : LevelData = new LevelData();
			levelData.levelName = levelName;
			levelData.levelCompleted = true;
			levelDataList.Add(levelData);
		}
	}
	
	public function unlockLevel(levelName : String){
		var levelDataExists : boolean = false;
		for(var i : int = 0; i < levelDataList.Count; i++)
		{
			if(levelDataList[i].levelName == levelName){
				levelDataExists = true;
				levelDataList[i].levelUnlocked = true;
				return;
			}
		}
		// If the level data is not found, create new entry
		if(!levelDataExists)
		{
			var levelData : LevelData = new LevelData();
			levelData.levelName = levelName;
			levelData.levelUnlocked = true;
			levelDataList.Add(levelData);
		}
	}
	
	public function levelHasBeenCompleted(levelName : String) : boolean{
		for(var i : int = 0; i < levelDataList.Count; i++)
		{
			if(levelDataList[i].levelName == levelName){
				return (levelDataList[i].levelCompleted);
			}
		}
		//Debug.LogError("Could not find the completion status of " + levelName);
		//It isn't an error, just hasn't been completed yet...
		Debug.Log("Could not find the completion status of " + levelName);
		return (false);
	}
	
	public function levelHasBeenUnlocked(levelName : String) : boolean{
		for(var i : int = 0; i < levelDataList.Count; i++)
		{
			if(levelDataList[i].levelName == levelName){
				return (levelDataList[i].levelUnlocked);
			}
		}
		Debug.Log("Could not find the unlock status of " + levelName);
		return (false);
	}
}// End of Player

// Information to be stored about the player
// per level
public class LevelData
{
	@XmlAttribute("levelName")
	public var levelName : String;
	public var levelScore : int;
	public var levelUnlocked : boolean;
	public var levelCompleted : boolean;
}
