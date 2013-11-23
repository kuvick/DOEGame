#pragma strict
import System.Collections.Generic;
import System.Xml;
import System.IO;

public class CodexData
{
	
	@XmlArray("codices")
  	@XmlArrayItem("CodexEntry")
	public var codices : List.<CodexEntry>;
	
	public function CodexData()
	{
		codices = new List.<CodexEntry>();
	}
	
	public function CodexUnlocked(codexName : String)
	{
		for (var codex : CodexEntry in codices)
		{
			if (codex.name == codexName)
			{
				return (true);
			}
		}
		return (false);
	}
	
	public function Load()
	{
		/*
 		var path : String = Path.Combine(Application.persistentDataPath, "CodexData.xml");
 		
 		if (!File.Exists(path)){
 	 		Debug.LogError("Could not find " + path);
 	 	}
 		
 	 	var serializer : XmlSerializer = new XmlSerializer(CodexData);
 	 	
	 	var stream : Stream = new FileStream(path, FileMode.Open);
	 	var codexData : CodexData = serializer.Deserialize(stream) as CodexData;
	 	stream.Close();
	 	*/
	 	
		var textAsset:TextAsset = Resources.Load("CodexData") as TextAsset;
	 	
	 	var serializer : XmlSerializer = new XmlSerializer(CodexData);
	 	var strReader : StringReader = new StringReader(textAsset.text);
	 	var xmlFromText : XmlTextReader = new XmlTextReader(strReader);
	 	
	 	var codexData : CodexData = serializer.Deserialize(xmlFromText) as CodexData;
	 	strReader.Close();
		xmlFromText.Close();

	 	codices = codexData.codices;
	 }
	
	public function UnlockCodex(codexName : String):boolean
	{
		/*
		Debug.Log("Unlocking " + codexName);
		for (var codex : CodexEntry in codices)
		{
			if (codex.name.Equals(codexName))
			{
				codex.isUnlocked = true;
				return;
			}
		}
		Debug.Log("Could not find " + codexName + " to unlock");
		*/
		
		for (var codex : CodexEntry in codices)
		{
			if (codex.name.Equals(codexName))
			{
				return true;
			}
		}
		Debug.Log("Could not find " + codexName + " to unlock");
		return false;
		
	}
	
	public function GetCodexEntry(codexName : String):CodexEntry
	{
		for (var codex : CodexEntry in codices)
		{
			if (codex.name.Equals(codexName))
			{
				return codex;
			}
		}
		Debug.Log("Could not find " + codexName);
		return null;
	}
	
	/*
	public function LockCodex(codexName : String)
	{
		for (var codex : CodexEntry in codices)
		{
			if (codex.name.Equals(codexName))
			{
				codex.isUnlocked = false;
				return;
			}
		}
		Debug.Log("Could not find " + codexName + " to lock");
	}
	*/
	
	/*
	public function isUnlocked(codexName : String):boolean
	{
		for (var codex : CodexEntry in codices)
		{
			if (codex.name.Equals(codexName))
			{
				if(codex.isUnlocked)
					return true;
				else
					return false;
			}
		}
		return false;
	}
	*/
}