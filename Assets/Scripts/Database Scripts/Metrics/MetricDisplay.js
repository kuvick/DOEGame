#pragma strict
import System.IO;

public class MetricDisplay
{
	private var container :  MetricContainer;
	
	private var EndData : List.<EndGameData>;
	private var LinkDataList : List.<LinkData>;
	private var TurnDataList : List.<TurnData>;
	
	private var numberOfFiles : int = 0;
	private var numberOfTurnFiles : int = 0;
	
	private var averageScore : int = 0;
	private var scoreCount : int = 0;
	
	private var averageTimeInSeconds : int = 0;
	private var timeCount : int = 0;
	
	private var averageTurns : int = 0;
	private var turnCount : int = 0;
	
	private var averageTimesUndone : int = 0;	
	private var undoCount : int = 0;
	
	public var linkArray : float[,];	
	public var numberOfLinks : float = 0;	
	public var numberOfTurns : float = 0;
	
	public function MetricDisplay()
	{
		container = new MetricContainer();
		EndData = new List.<EndGameData>();
		LinkDataList = new List.<LinkData>();					
		TurnDataList = new List.<TurnData>();
	}
	
	public function GatherData(sceneName : String) : boolean
	{
		if(GatherEndData(sceneName) && GatherLinkData(sceneName) && GatherTurnData(sceneName))
		{
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
				
				averageTimeInSeconds += end.TimeInSeconds;
				timeCount++;
				
				averageTurns += end.Turns;
				turnCount++;
				
				averageTimesUndone += end.TimesUndoPressed;											
				undoCount++;
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
	
	public function GetEndGameDataAsString() : String
	{	
		return "Files In Directory: " + numberOfFiles + "\n"
				+ "Average Score: " + averageScore + "\n"
				+ "Average Time: " + averageTimeInSeconds + "\n"
				+ "Average Turns: " + averageTurns + "\n"
				+ "Average Undo's: " + averageTimesUndone;		
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