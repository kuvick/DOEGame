#pragma strict
import System.Collections.Generic;
import System.Xml;
import System.IO;

public class CodexData {
	public var codices : List.<CodexEntry>;
	
	public function CodexData(){
		codices = new List.<CodexEntry>();
	}
	
	public function CodexUnlocked(codexName : String){
		for (var codex : CodexEntry in codices){
			if (codex.name == codexName){
				return (true);
			}
		}
		return (false);
	}
	
	public function LoadFromSource(){
 		var path : String = Path.Combine(Application.dataPath, "Resources/CodexData.xml");
 		
 		if (!File.Exists(path)){
 	 		Debug.LogError("Could not find " + path);
 	 	}
 		
 	 	var serializer : XmlSerializer = new XmlSerializer(CodexData);
 	 	
	 	var stream : Stream = new FileStream(path, FileMode.Open);
	 	var codexData : CodexData = serializer.Deserialize(stream) as CodexData;
	 	stream.Close();

	 	codices = codexData.codices;
	 }
	
	public function UnlockCodex(codexName : String){
		Debug.Log("Unlocking " + codexName);
		for (var codex : CodexEntry in codices){
			if (codex.name.Equals(codexName)){
				codex.isUnlocked = true;
				return;
			}
		}
		Debug.Log("Could not find " + codexName + " to unlock");
	}
	
	public function LockCodex(codexName : String){
		for (var codex : CodexEntry in codices){
			if (codex.name.Equals(codexName)){
				codex.isUnlocked = false;
				return;
			}
		}
		Debug.Log("Could not find " + codexName + " to lock");
	}
}