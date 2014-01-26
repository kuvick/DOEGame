﻿import System.Collections.Generic;
import System.Xml;
import System.IO;

#pragma strict

#pragma strict
enum DeveloperType
{
	None,
	SpecialMention,
	Artist,
	Programmer,
	Designer,
	Audio
}


public class Developer
{
	public var firstName:String;
	public var lastName:String;
	public var isLeader:boolean;
	@XmlArray("Teams")
  	@XmlArrayItem("Team")
	public var teams:DeveloperType[];
	
	function ToString():String
	{
		return firstName + " " + lastName;
	}
}

@XmlRoot("DeveloperList")
public class DeveloperList
{
	@XmlArray("Developers")
  	@XmlArrayItem("Developer")
  	public var developers : List.<Developer> = new List.<Developer>();
  	
	public function Load(): DeveloperList
 	{
	 	
		var textAsset:TextAsset = Resources.Load("DeveloperList") as TextAsset;
	 	
	 	var serializer : XmlSerializer = new XmlSerializer(DeveloperList);
	 	var strReader : StringReader = new StringReader(textAsset.text);
	 	var xmlFromText : XmlTextReader = new XmlTextReader(strReader);
	 	
	 	var devList : DeveloperList = serializer.Deserialize(xmlFromText) as DeveloperList;
	 	strReader.Close();
		xmlFromText.Close();
		
		//Debug.Log("Loading of levels complete.");
		return devList;
	 }
	 
 	public function Save()
 	{
 		var serializer : XmlSerializer = new XmlSerializer(DeveloperList);
		var path : String = Path.Combine(Application.persistentDataPath, "DeveloperList.xml");
		var stream : Stream = new FileStream(path, FileMode.Create);
		
		serializer.Serialize(stream, this);
	 	stream.Close();
 	}
 	
}

private var developerList : DeveloperList = new DeveloperList();
public var skin:GUISkin;
public var stdFont:Font;
public var boldFont:Font;

private var fontSizePercent:float = 0.025;

private var artists: List.<Developer>;
private var programmers: List.<Developer>;
private var designers: List.<Developer>;
private var audioDevs: List.<Developer>;
private var specialMention: List.<Developer>;

private var credits:List.<String> = new List.<String>();
private var creditsRect:List.<Rect> = new List.<Rect>();

public var logo:Texture;
private var logoRect:Rect;
private var logoPercent = 0.5;

private var triggeredReturn:boolean;

private var speed:float = 0.8;

function Start ()
{
	developerList = developerList.Load();
	triggeredReturn = false;
	
	
	var logoHeight:float = logoPercent*Screen.height;
	var logoWidth:float = ((logo.width + 0f)/(logo.height + 0f)) * logoHeight;
	
	logoRect = new Rect(Screen.width / 2 - logoWidth / 2, Screen.height, logoWidth, logoHeight);
	
	artists = generateList(developerList, DeveloperType.Artist);
	programmers = generateList(developerList, DeveloperType.Programmer);
	designers = generateList(developerList, DeveloperType.Designer);
	audioDevs = generateList(developerList, DeveloperType.Audio);
	specialMention = generateList(developerList, DeveloperType.SpecialMention);
	
	credits.Add("\n\nART\n");
	credits.Add(generateCreditString(artists));
	credits.Add("\n\nAUDIO\n");
	credits.Add(generateCreditString(audioDevs));
	credits.Add("\n\nDESIGN\n");
	credits.Add(generateCreditString(designers));
	credits.Add("\n\nPROGRAMMING\n");
	credits.Add(generateCreditString(programmers));
	credits.Add("\n\nSPECIAL MENTION\n");
	credits.Add(generateCreditString(specialMention));
	
	skin.label.fontSize = fontSizePercent * Screen.height * 1.5;
	skin.label.alignment = TextAnchor.UpperCenter;
	
	var content: GUIContent = new GUIContent();
	var creditsHeight:float;
	
	//Calculating the height of each rect (each one comes after the other)
	for(var i:int = 0; i < credits.Count; i++)
	{
		content.text = credits[i];
		creditsHeight = skin.label.CalcHeight(content, Screen.width);
		if(i > 0)
			creditsRect.Add(new Rect(0, creditsRect[i-1].y + creditsRect[i-1].height, Screen.width, creditsHeight));
		else
			creditsRect.Add(new Rect(0, logoRect.y + logoRect.height, Screen.width, creditsHeight));
	}
	
	credits.Add("Thanks for playing!");
	content.text = "Thanks for playing!";
	creditsHeight = skin.label.CalcHeight(content, Screen.width);
	creditsRect.Add(new Rect(0, creditsRect[creditsRect.Count-1].y + creditsRect[creditsRect.Count-1].height + Screen.height/2, Screen.width, creditsHeight));
}

function generateCreditString(devs: List.<Developer>):String
{
	var list : String = "";
	
	for(var i: int = 0; i < devs.Count; i++)
	{
		list = list + devs[i].ToString() + "\n";
	}
	
	return list;
}

// Use if you want to sort alphabeltically based on last names
function compareLastNames(dev1:Developer, dev2:Developer)
{
	return dev1.lastName.CompareTo(dev2.lastName);
  
}

// Use if you want to sort alphabetically based on first names
function compareFirstNames(dev1:Developer, dev2:Developer)
{
	return dev1.firstName.CompareTo(dev2.firstName); 
}

// Use if you want to sort alphabetically with leaders first
function compareLastNamesWithLeadersFirst(dev1:Developer, dev2:Developer)
{
	if (dev1.isLeader && !dev2.isLeader)
		return 1;
	if (!dev1.isLeader && dev2.isLeader)
		return -1;

	return dev1.lastName.CompareTo(dev2.lastName);
}

function generateList(devs: DeveloperList, type:DeveloperType): List.<Developer>
{
	var list : List.<Developer> = new List.<Developer>();
	for(var i :int = 0; i < devs.developers.Count; i++)
	{
		for(var j:int = 0; j < devs.developers[i].teams.length; j++)
		{
			if(devs.developers[i].teams[j] == type)
				list.Add(devs.developers[i]);
		}
	}
	
	list.Sort(compareLastNames);
	
	return list;
}

function OnGUI()
{
	GUI.skin = skin;
	
	GUI.DrawTexture(logoRect, logo, ScaleMode.StretchToFill);
	logoRect.y -= speed;
	
	for(var i:int = 0; i < credits.Count; i++)
	{
		if(i % 2 == 1)
			skin.label.font = stdFont;
		else
			skin.label.font = boldFont;
		
		GUI.Label(creditsRect[i], credits[i]);
		
		if(creditsRect[creditsRect.Count-1].y > Screen.height / 2)
		{
			var newRect:Rect= creditsRect[i];
			newRect.y -= speed;
			creditsRect[i] = newRect;
		}
		else
		{
			ReturnToMain();
		}
	}
	
}

function ReturnToMain()
{
	if(!triggeredReturn)
	{
		triggeredReturn = true;
		yield WaitForSeconds(1.0f);
		Application.LoadLevel("StartScreen");
	}
}