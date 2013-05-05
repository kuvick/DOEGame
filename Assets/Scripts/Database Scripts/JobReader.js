#pragma strict
import System.Collections.Generic;
import System.Xml;

public class JobReader
{
	private var fileAsset : TextAsset;
	private var xmlDoc : XmlDocument;
	private var jobNodes : XmlNodeList;
	
	private var months : String[] = ["January","February","March","April","May","June",
				"July","August","September","October","November","December"];
	
	public function LoadFile(file : String)
	{
		fileAsset = Resources.Load(file) as TextAsset;
		xmlDoc = new XmlDocument();
		xmlDoc.LoadXml(fileAsset.text);
		Resources.UnloadAsset(fileAsset);
		
		jobNodes = xmlDoc.GetElementsByTagName("PositionProfile");
	}
	
	public function GetJobList() : List.<Job>
	{
		var tempList : List.<Job> = new List.<Job>();
		var node : XmlNode;
		for (var i : int = 0; i < jobNodes.Count; i++)//var node : XmlNode in jobNodes)
		{
			node = jobNodes[i];
			var tempJob = new Job();
			
			tempJob.title = node.Item["PositionTitle"].InnerText;
			tempJob.agency = node.Item["PositionOrganization"].Item["OrganizationIdentifiers"].Item["OrganizationName"].InnerText;
			tempJob.salaryMin = node.Item["OfferedRemunerationPackage"].Item["RemunerationRange"].Item["RemunerationMinimumAmount"].InnerText;
			tempJob.salaryMax = node.Item["OfferedRemunerationPackage"].Item["RemunerationRange"].Item["RemunerationMaximumAmount"].InnerText;
			tempJob.openPeriodStart = FormatDate(node.Item["PositionPeriod"].Item["StartDate"].InnerText);
			tempJob.openPeriodEnd = FormatDate(node.Item["PositionPeriod"].Item["EndDate"].InnerText);
			tempJob.positionInformation = node.Item["UserArea"].Item["GOVT_XMLJobBody"].Item["Overview"].Item["JobStatusText"].InnerText;
			tempJob.location = node.Item["PositionLocation"].Item["LocationName"].InnerText;
			tempJob.whoConsidered = node.Item["UserArea"].Item["GOVT_WhoMayApply"].InnerText;
			tempList.Add(tempJob);
			//Debug.Log(node.Item["PositionTitle"].InnerText);
		}
		return tempList;
	}
	
	private function FormatDate(date : String) : String
	{
		var dateSplit : String[] = date.Split("-"[0]);
		Debug.Log(dateSplit.length);
		return months[parseInt(dateSplit[1]) - 1] + " " + parseInt(dateSplit[2]) + ", " + parseInt(dateSplit[0]);
	}
}

class Job extends System.ValueType
{
	public var title : String;
	public var agency : String;
	public var salaryMin : String;
	public var salaryMax : String;
	public var openPeriodStart : String;
	public var openPeriodEnd : String;
	public var positionInformation : String;
	public var location : String;
	public var whoConsidered : String;
}