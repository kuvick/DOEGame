import System.Collections.Generic;
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
	Audio, 
	ArtistPast,
	ProgrammerPast,
	DesignerPast,
	AudioPast
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
private var artistsPast: List.<Developer>;
private var programmersPast: List.<Developer>;
private var designersPast: List.<Developer>;
private var audioDevsPast: List.<Developer>;

private var credits:List.<String> = new List.<String>();
private var creditsRect:List.<Rect> = new List.<Rect>();

public var logo:Texture;
private var logoRect:Rect;
private var logoPercent = 0.5;

private var triggeredReturn:boolean;

private var speed:float = 0.8;

private var tapToContinueRect:Rect;

private var style:GUIStyle;

// used to prevent accidental double-click to skip from win screen
private var isActive : boolean = false;

function Start ()
{
	//developerList = developerList.Load();
	triggeredReturn = false;
	
	var logoHeight:float = logoPercent*Screen.height;
	var logoWidth:float = ((logo.width + 0f)/(logo.height + 0f)) * logoHeight;
	
	logoRect = new Rect(Screen.width / 2 - logoWidth / 2, Screen.height, logoWidth, logoHeight);
	
	/*
	artists = generateList(developerList, DeveloperType.Artist);
	programmers = generateList(developerList, DeveloperType.Programmer);
	designers = generateList(developerList, DeveloperType.Designer);
	audioDevs = generateList(developerList, DeveloperType.Audio);
	specialMention = generateList(developerList, DeveloperType.SpecialMention);
	
	artistsPast = generateList(developerList, DeveloperType.ArtistPast);
	programmersPast = generateList(developerList, DeveloperType.ProgrammerPast);
	designersPast = generateList(developerList, DeveloperType.DesignerPast);
	audioDevsPast = generateList(developerList, DeveloperType.AudioPast);
	
	credits.Add("\n\nPresent\n");
	credits.Add("\n\nART\n");
	credits.Add(generateCreditString(artists));
	credits.Add("\n\nAUDIO\n");
	credits.Add(generateCreditString(audioDevs));
	credits.Add("\n\nDESIGN\n");
	credits.Add(generateCreditString(designers));
	credits.Add("\n\nPROGRAMMING\n");
	credits.Add(generateCreditString(programmers));
	
	credits.Add("\n\n\nPast\n");
	credits.Add("\n\nART\n");
	credits.Add(generateCreditString(artistsPast));
	//credits.Add("\n\nAUDIO\n");
	//credits.Add(generateCreditString(audioDevsPast));
	credits.Add("\n\nDESIGN\n");
	credits.Add(generateCreditString(designersPast));
	credits.Add("\n\nPROGRAMMING\n");
	credits.Add(generateCreditString(programmersPast));
	
	credits.Add("\n\n\nSpecial Mention\n");
	credits.Add(generateCreditString(specialMention));
	*/
	
	credits.Add("\n\nLead Designer\n");
	credits.Add("Glen Cooney");
	credits.Add("\n\nLead Artist\n");
	credits.Add("Katharine Uvick");
	credits.Add("\n\nProducer\n");
	credits.Add("Glen Cooney");
	credits.Add("\n\nProject Manager\n");
	credits.Add("Christopher Morrison");
	credits.Add("\n\nGame Design\n");
	credits.Add("Dustin Dano\n Katharine Uvick\n Ryan Vachon");
	credits.Add("\n\nProgramming Team Manager\n");
	credits.Add("Glen Cooney");
	credits.Add("\n\nProgrammers\n");
	credits.Add("Katharine Uvick\n Derrick Huey");
	credits.Add("\n\nArtists\n");
	credits.Add("Noelle Hébert\n Craig Landen\n Danny Tran");
	credits.Add("\n\nAudio Team\n");
	credits.Add("Luke Roberts");
	credits.Add("\n\nQuality Assurance\n");
	credits.Add("Sarah Patterson");
	credits.Add("\n\n\n\nPAST MEMBERS\n\n\nSenior Designer\n");
	credits.Add("Craig Ellsworth");
	credits.Add("\n\nDesigners\n");
	credits.Add("Gina El-Reedy\nDonny Torrey\nErik Martin\nTim Michaels\nChase Sandmann");
	credits.Add("\n\nLead Programmer\n");
	credits.Add("Ajinkya Wughulde");
	credits.Add("\n\nProgrammers\n");
	credits.Add("Will Fallows\nStephen Hopkins\nJared Mavis\nChris Peterson\nTeng Lu\nFrancis Yuan");
	credits.Add("\n\nLead Artists\n");
	credits.Add("Michael Rosgen\nRobin Clark\nChris Velez");
	credits.Add("\n\nArtists\n");
	credits.Add("Rebecca Williams\nKaitlyn McIntosh");
	credits.Add("\n\nSpecial Thanks to:\n");
	credits.Add("Heather Plunkard\nJerrod Johnson\nLuciano Fenu\nJason Frostock\nAmina Obe\n");
	
	
	
	
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
	
	style = new GUIStyle();
	style.font = skin.label.font;
	style.fontSize = skin.label.fontSize;
	style.alignment = TextAnchor.UpperLeft;
	style.normal.textColor = Color.white;
	
	var padding : float = Screen.height * 0.02;
	var size:Vector2 = style.CalcSize(GUIContent("Tap to continue."));
	tapToContinueRect = Rect(Screen.width - size.x - padding, Screen.height - size.y - padding, size.x, size.y);
	
	StartCoroutine(DoubleTapCheck());
}

// to prevent potential double click skip after win screen
private function DoubleTapCheck()
{
	// empty loop to wait until player is no longer touching screen
	while (Input.GetKeyUp(KeyCode.Mouse0) || Input.touchCount > 0) 
		yield;
	// allow for touch skip after player has stopped touching the screen initially
	isActive = true;
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
	
	GUI.Label(tapToContinueRect, "Tap to continue.", style);
	if(isActive && (Input.GetKeyUp(KeyCode.Mouse0) || Input.touchCount > 0))
		Application.LoadLevel("StartScreen");
	
	GUI.DrawTexture(logoRect, logo, ScaleMode.StretchToFill);
	logoRect.y -= speed;
	
	for(var i:int = 0; i < credits.Count; i++)
	{
		/*
		if(i == 0 || i == 9)
			skin.label.font = boldFont;
		else if(i < 9 && i % 2 == 1)
			skin.label.font = boldFont;
		else if(i < 9)
			skin.label.font = stdFont;
		else if(i > 9 && i % 2 == 1)
			skin.label.font = stdFont;
		else
			skin.label.font = boldFont;
		*/
		
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
