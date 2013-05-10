#pragma strict
import System.IO;

public class MetricDisplay
{
	private var container :  MetricContainer;
	
	private var EndData : List.<EndGameData>;
	private var LinkDataList : List.<LinkData>;
	private var TurnDataList : List.<TurnData>;
	private var NarrDataList : List.<NarrativeData>;
	
	//End Game Data
	private var numberOfFiles : int = 0;
	private var numberOfTurnFiles : int = 0;
	
	private var averageScore : int = 0;
	private var scoreCount : int = 0;
	private var highestScore : int = 0;
	private var lowestScore : int = -1;
	
	private var averageTimeInSeconds : int = 0;
	private var timeCount : int = 0;
	private var highestTime : int = 0;
	private var lowestTime : int = -1;
	
	private var averageTurns : int = 0;
	private var turnCount : int = 0;
	private var highestTurns : int = 0;
	private var lowestTurns : int = -1;
	
	private var averageTimesUndone : int = 0;	
	private var undoCount : int = 0;
	private var highestUndoCount : int = 0;
	private var lowestUndoCount : int = -1;
	
	//Link Metrics
	public var linkArray : float[,];	
	public var numberOfLinks : float = 0;	
	public var numberOfTurns : float = 0;
	
	//Narrative Metrics
	private var averageNextTimeList : List.<float>;
	private var nextCount : List.<int>;
	private var numberOfNarrFiles : int;
	private var totalSkips : float;
	private var skipPercentage : float;
	
	private var averageTimeSpent : float;	
	private var highestTimeSpent : float;
	private var lowestTimeSpent : float = -1;			
	
	public function MetricDisplay()
	{
		container = new MetricContainer();
		EndData = new List.<EndGameData>();
		LinkDataList = new List.<LinkData>();					
		TurnDataList = new List.<TurnData>();
		NarrDataList = new List.<NarrativeData>();
		
		averageNextTimeList = new List.<float>();
		nextCount = new List.<int>();
	}
	
	public function GatherData(sceneName : String) : boolean
	{
		if(GatherEndData(sceneName) && GatherLinkData(sceneName) && GatherTurnData(sceneName))
		{
			GatherNarrativeData(sceneName);
			return true;
		}
		return false;
	}
	
	public function AnalyzeData()
	{
		//Calculate Averages
		averageScore /= scoreCount;
		averageTimeInSeconds /= timeCount;
		averageTurns /= turnCount;
		averageTimesUndone /= undoCount;
	}
	
	private function GatherEndData(sceneName : String) : boolean
	{
		
		var path : String = Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/END/");
		
		if(Directory.Exists(path))
		{	
			var info : DirectoryInfo = new DirectoryInfo(path);
			var fileInfo = info.GetFiles();

			numberOfFiles = fileInfo.Length;
			
			for(var i = 0; i < fileInfo.Length; i++)
			{	
	        	if(fileInfo[i].Name.Contains("_END") && !fileInfo[i].Name.Contains(".meta"))
	        	{
					EndData.Add(container.LoadEndData(Path.Combine(path,fileInfo[i].Name)));	
				}							        		     
			}
			
			//Calculate Averages for EndGameData
			var end : EndGameData;
			for(i = 0; i < EndData.Count; i++)//var end : EndGameData in EndData)
			{
				end = EndData[i];
				averageScore += end.Score;
				scoreCount++;
				
				if(end.Score > highestScore)
					highestScore = end.Score;
				if(lowestScore == -1)
					lowestScore = end.Score;
				else if(end.Score < lowestScore)					
					lowestScore = end.Score;
				
				averageTimeInSeconds += end.TimeInSeconds;
				timeCount++;
				
				if(end.TimeInSeconds > highestTime)
					highestTime = end.TimeInSeconds;
				if(lowestTime == -1)
					lowestTime = end.TimeInSeconds;
				else if(end.TimeInSeconds < lowestTime)
					lowestTime = end.TimeInSeconds;
				
				averageTurns += end.Turns;
				turnCount++;
				
				if(end.Turns > highestTurns)
					highestTurns = end.Turns;
				if(lowestTurns == -1)
					lowestTurns = end.Turns;
				else if(end.Turns < lowestTurns)
					lowestTurns = end.Turns;
				
				averageTimesUndone += end.TimesUndoPressed;											
				undoCount++;
				
				if(end.TimesUndoPressed > highestUndoCount)
					highestUndoCount = end.TimesUndoPressed;	
				if(lowestUndoCount == -1)
					lowestUndoCount = end.TimesUndoPressed;			
				if(end.TimesUndoPressed < lowestUndoCount)
					lowestUndoCount = end.TimesUndoPressed;
			}
			return true;
		}
		else
		{
			Debug.Log("Path: " + path + " Does Not Exist");
			return false;
		}
	}
	
	private function GatherLinkData(sceneName : String) : boolean
	{
		//Debug.Log("Gathering Link Data");
		var path : String = Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/LINK/");
		
		if(Directory.Exists(path))
		{	
			var info : DirectoryInfo = new DirectoryInfo(path);
			var fileInfo = info.GetFiles();		
				
			numberOfFiles = fileInfo.Length;
			
			//Debug.Log("There are " + numberOfFiles + " files in this directory");
			for(var i = 0; i < fileInfo.Length; i++)
			{	
	        	if(fileInfo[i].Name.Contains("_LINK") && !fileInfo[i].Name.Contains(".meta"))
	        	{	
	        		//Debug.Log("Reading File: " + fileInfo[i].Name);
	        		var list : List.<LinkData> = container.LoadLinkData(Path.Combine(path,fileInfo[i].Name));
	        		for(i = 0; i < list.Count; i++)//var link : LinkData in list)
	        		{
	        			LinkDataList.Add(list[i]);//link);
	        		}				
				}							        		     
			}
			//Debug.Log("Number of Links: " + LinkDataList.Count);
			numberOfLinks = LinkDataList.Count;
			return true;
		}
		else
		{
			Debug.Log("Path: " + path + " Does Not Exist");
			return false;
		}
	}
	
	private function GatherTurnData(sceneName : String) : boolean
	{
		//Debug.Log("Gathering Link Data");
		var path : String = Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/TURN/");
		
		if(Directory.Exists(path))
		{	
			var info : DirectoryInfo = new DirectoryInfo(path);
			var fileInfo = info.GetFiles();		
				
			numberOfTurnFiles = fileInfo.Length;
			
			//Debug.Log("There are " + numberOfFiles + " files in this directory");
			for(var i = 0; i < fileInfo.Length; i++)
			{	
	        	if(fileInfo[i].Name.Contains("_TURN") && !fileInfo[i].Name.Contains(".meta"))
	        	{	
	        		//Debug.Log("Reading File: " + fileInfo[i].Name);
	        		var list : List.<TurnData> = container.LoadTurnData(Path.Combine(path,fileInfo[i].Name));
	        		for(var turn : TurnData in list)
	        		{
	        			TurnDataList.Add(turn);
	        		}				
				}							        		     
			}
			//Debug.Log("Number of Links: " + LinkDataList.Count);
			numberOfTurns = TurnDataList.Count;
			return true;
		}
		else
		{
			Debug.Log("Path: " + path + " Does Not Exist");
			return false;
		}
	}
	
	private function GatherNarrativeData(sceneName : String) : boolean
	{
		var path : String = Path.Combine(Application.dataPath, "Metrics/" + sceneName + "Narr/Narrative/");
		
		if(Directory.Exists(path))
		{
			var info : DirectoryInfo = new DirectoryInfo(path);
			var fileInfo = info.GetFiles();
			
			numberOfNarrFiles = fileInfo.Length;
			
			
			for(var i = 0; i < fileInfo.Length; i++)
			{	
	        	if(fileInfo[i].Name.Contains("_NAR") && !fileInfo[i].Name.Contains(".meta"))
	        	{
					NarrDataList.Add(container.LoadNarrativeData(Path.Combine(path,fileInfo[i].Name)));	
				}							        		     
			}
												
			var narr : NarrativeData;
			for(var x = 0; x < NarrDataList.Count; x++)
			{
				narr = NarrDataList[x];
				averageTimeSpent += narr.timeSpentTotal;				
				
				if(narr.timeSpentTotal > highestTimeSpent)
					highestTimeSpent = narr.timeSpentTotal;
				if(lowestTimeSpent == -1)
					lowestTimeSpent = narr.timeSpentTotal;
				else if(narr.timeSpentTotal < lowestTimeSpent)					
					lowestTimeSpent = narr.timeSpentTotal;
				
				if(narr.wasSkipped)
					totalSkips++;		
				for(var j = 0; j < narr.timeBeforeClick.Count; j++)
				{
					if(j >= averageNextTimeList.Count)
					{
						averageNextTimeList.Add(0);
						nextCount.Add(0);
					}
					averageNextTimeList[j] += narr.timeBeforeClick[j];
					nextCount[j] += 1;
				}	
			}
			
			for(var index = 0; index < averageNextTimeList.Count; index++)
			{
				averageNextTimeList[index] /= nextCount[index];
			}
			
			skipPercentage = totalSkips / NarrDataList.Count;
			averageTimeSpent /= NarrDataList.Count;			
			return true;			
		}
		else
		{
			Debug.Log("Path: " + path + " Does Not Exist");
			return false;
		}
	}
	
	public function GetEndGameDataAsString() : String
	{	
		var returnValue : String = "Files In Directory: " + numberOfFiles + "\n";
		returnValue += "Highest Score: " + highestScore + "    Average Score: " + averageScore + "    Lowest Score: " + lowestScore + "\n";
		returnValue += "Highest Turns: " + highestTurns + "    Average Turns: " + averageTurns + "    Lowest Turns: " + lowestTurns + "\n";
		returnValue += "Highest Time: " + highestTime + "    Average Time: " + averageTimeInSeconds  + "    Lowest Time: " + lowestTime + "\n";
		returnValue += "Most Undos: " + highestUndoCount + "    Average Undo's: "+ averageTimesUndone + "    Lowest Undo Count: " + lowestUndoCount;						
				
		return returnValue;
	}
	
	public function GetNarrativeDataAsString() : String
	{	
		
		var returnValue = "Skip Perecent: " + skipPercentage + "\n"
						+ "Highest Time Spent: " + highestTimeSpent.ToString("F2") + "    Average: " + averageTimeSpent.ToString("F2") + "    Lowest: " + lowestTimeSpent.ToString("F2") + "\n";
		
		for(var i = 0; i < averageNextTimeList.Count; i++)
		{
			returnValue += "Slide " + (i + 1) +": " + averageNextTimeList[i].ToString("F2") + "\n";
		}
		
		return returnValue;
	}
	
	public function GetTurnList() : List.<TurnData>
	{
		return TurnDataList;		
	}
	
	public function CreateLinkArray(numberOfBuildings : int)
	{
		linkArray = new float[numberOfBuildings, numberOfBuildings];
		
		for(var i = 0; i < LinkDataList.Count; i++)
		{
			var output : int = LinkDataList[i].OutputBuildingIndex;
			var input : int = LinkDataList[i].InputBuildingIndex;
			
			linkArray[output, input]++;			
		}
	}
}