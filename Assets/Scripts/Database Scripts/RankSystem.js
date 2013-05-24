import System.Collections.Generic;
import System.Xml;
import System.IO;

#pragma strict

@XmlRoot("RankSystem")
public class RankSystem
{
	public var exp_multiplier : float;
	public var base_experience : int;
	
	@XmlArray("Ranks")
  	@XmlArrayItem("Rank")
  	public var Ranks : List.<Rank> = new List.<Rank>();

 	public function Load(): RankSystem
 	{
 		var path : String = Path.Combine(Application.dataPath, "RankSystem.xml");
 		Debug.Log("Loaded: " + path);
 		
 	 	var serializer : XmlSerializer = new XmlSerializer(RankSystem);
	 	var stream : Stream = new FileStream(path, FileMode.Open);
	 	var system : RankSystem = serializer.Deserialize(stream) as RankSystem;
	 	stream.Close();
	 	return system;
	 	
	 }
	 
	 public function generateNewPlayer(name : String): Player
	 {
	 	var player : Player = new Player();
	 	player.name = name;
	 	player.exp = 0;
	 	player.rank = 0;
	 	player.rankName = Ranks[0].Name;
	 	
	 	return player;
	 }
	 
	 public function generateMinExp()
	 {
	 	for(var i : int = 0; i < Ranks.Count; i++)
	 	{
	 		if(Ranks[i].Level <= 0)
	 		{
	 			Ranks[i].MinExp = 0;
	 		}
	 		else
	 		{
	 			Ranks[i].MinExp = base_experience * Mathf.Pow(exp_multiplier, Ranks[i].Level - 1);
	 		}
	 	}
	 }
	 
	 // Assumes that you're handing it a rank that's above the count
	 public function generatePostCapRank(rank : int): String
	 {
	 	var numToAdd : int = rank - (Ranks.Count - 1) + 1;
	 	Debug.Log(Ranks.Count + " count");
	 	return Ranks[Ranks.Count - 1].Name + " " + numToAdd;
	 }
	 
	 public function updateRank(player : Player): Player
	 {	 	
	 	if(player.rank < Ranks.Count - 1)
	 	{
	 		// If the player meets the min. exp. of the next rank:
	 		if(player.exp >= Ranks[player.rank + 1].MinExp)
	 		{
	 			player.rank += 1;
	 			player.rankName = Ranks[player.rank + 1].Name;
	 		}
	 		else
	 		{
	 			Debug.Log("The player was not promoted");
	 		}
	 	}
	 	// For players past the level cap:
	 	else
	 	{
	 		var nextMinExp : int = base_experience * Mathf.Pow(exp_multiplier, player.rank);
	 		if(player.exp >= nextMinExp)
	 		{
	 			player.rank += 1;
	 			player.rankName = generatePostCapRank(player.rank);
	 		}
	 		else
	 		{
	 			Debug.Log("The player was not promoted");
	 		}
	 	}
	 	
	 	return player; 	
	 	
	 }
 	
}


public class Rank
{
	public var Name : String;
	public var Level : int;
	public var MinExp : int;
}