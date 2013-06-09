/**********************************************************
RankSystem.js

Description: Used to load the information about ranks from
a pre-made XML sheet with the levels and the rank names,
and the experience multiplier (how much is the previous score
multiplied by in order to get the next score).

Currently the experience per level is all calculated, not hardcoded,
but we might want to change this for balancing purposes (which shouldn't
be too hard). What it does is that each rank's minimum experience is:
the base min exp. (how much it is to get from lvl 0 to 1) times the
exp. multiplier raised to whatever level it is going to be next.

Originally by Katharine Uvick
**********************************************************/

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
	 
	 //Returns rank name as String:
	 public function getRankName(rank : int): String
	 {
	 	if(rank < Ranks.Count)
	 	{
	 		return Ranks[rank].Name;
	 	}
	 	else
	 		return generatePostCapRank(rank);
	 }
	 
	 // Generates it for all that are currently in the list
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
	 
	 // Generates and returns the minexp for a specific rank
	 public function generateMinExp(rank : int)
	 {
	 	return base_experience * Mathf.Pow(exp_multiplier, rank - 1);
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
	 	if(player.rank < Ranks.Count - 2)
	 	{
	 		// If the player meets the min. exp. of the next rank:
	 		if(player.exp >= Ranks[player.rank + 1].MinExp)
	 		{
	 			player.rank += 1;
	 			player.rankName = Ranks[player.rank].Name;
	 			Debug.Log("The player was promoted!");
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
	 			Debug.Log("The player was promoted!");
	 		}
	 		else
	 		{
	 			Debug.Log("The player was not promoted");
	 		}
	 	}
	 	
	 	return player; 	
	 	
	 }
	 
	 // Returns the current expGoal
	 public function expGoal(rank : int)
	 {
	 	if(rank < 0)
	 		return 0;
	 	else if(rank < Ranks.Count - 2)
	 	{
 			return Ranks[rank + 1].MinExp;
	 	}
	 	// For players past the level cap:
	 	else
	 	{
	 		var nextMinExp : int = base_experience * Mathf.Pow(exp_multiplier, rank);
	 		
	 		return nextMinExp;
	 	}
	 }
	 
	 
	 // Generates the experience earned while this current rank
	 public function expForThisRank(rank : int, totalExp : int) : int
	 {
	 	if(rank < Ranks.Count)
	 		return (totalExp - Ranks[rank].MinExp);
 		else
 		{
 			return (totalExp - generateMinExp(rank));
 		}
	 }
 	
}


public class Rank
{
	public var Name : String;
	public var Level : int;
	public var MinExp : int;
}