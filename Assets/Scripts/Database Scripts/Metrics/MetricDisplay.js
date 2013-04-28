#pragma strict
import System.IO;

public class MetricDisplay
{
	private var container :  MetricContainer;
	
	private var EndData : List.<EndGameData>;
	
	private var numberOfFiles : int = 0;
	
	private var averageScore : int = 0;
	private var scoreCount : int = 0;
	
	private var averageTimeInSeconds : int = 0;
	private var timeCount : int = 0;
	
	private var averageTurns : int = 0;
	private var turnCount : int = 0;
	
	private var averageTimesUndone : int = 0;	
	private var undoCount : int = 0;
	
	public function MetricDisplay()
	{
		EndData = new List.<EndGameData>();
	}
	
	public function GatherData(sceneName : String)
	{
		var path : String = Path.Combine(Application.dataPath, "Metrics/" + sceneName + "/END/");
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
		for(var end : EndGameData in EndData)
		{
			averageScore += end.Score;
			scoreCount++;
			
			averageTimeInSeconds += end.TimeInSeconds;
			timeCount++;
			
			averageTurns += end.Turns;
			turnCount++;
			
			averageTimesUndone += end.TimesUndoPressed;											
			undoCount++;
		}
	}
	
	public function AnalyzeData()
	{
		//Calculate Averages
		averageScore /= scoreCount;
		averageTimeInSeconds /= timeCount;
		averageTurns /= turnCount;
		averageTimesUndone /= undoCount;
		
		Debug.Log("Files In Directory: " + numberOfFiles);
		Debug.Log("Average Score: " + averageScore);
		Debug.Log("Average Time: " + averageTimeInSeconds);
		Debug.Log("Average Turns: " + averageTurns);
		Debug.Log("Average Undo's: " + averageTimesUndone);		
	}
}