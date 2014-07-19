#pragma strict
import System.Collections.Generic;

public static class JobDatabase
{
	private var initialized : boolean = false;
	private var reader : JobReader;
	private var jobFileName : String = "jobfeedTEST";
	private var jobList : List.<Job> = new List.<Job>();
	
	public function Initialize()
	{
		reader = new JobReader();
		reader.LoadFile(jobFileName);
		jobList = reader.GetJobList();
		initialized = true;
		//Debug.Log("initialize jobs: " + jobList.Count);
		//Debug.Log("job database initialized");
	}
	
	
	public function GetRandomJob() : Job
	{
		if (!initialized)
			Initialize();
		return jobList[Random.Range(0, jobList.Count)];
	}
	
	public function GetJobAtIndex(index:int)
	{
		if (!initialized)
			Initialize();
		
		//Debug.Log("Retrieving Job #" + (index % jobList.Count + 1) + " out of " + jobList.Count);	
		if(index < jobList.Count)
		{
			return jobList[index];
		}
		else
		{
			return jobList[index % jobList.Count];
		}
			
		
	}
}