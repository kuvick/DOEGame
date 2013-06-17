#pragma strict
import System.Collections.Generic;
import System.Xml;
import System.IO;

@XmlRoot("CodexData")
public class CodexData extends MonoBehaviour {
	@XmlArray("codices")
	public var codices : List.<CodexEntry>;
	
	private static var instance : CodexData = null; 

	//Returns an instance of the CodexData, if any exists. If not, an instance will be created.
	public static function Instance() : CodexData {
		// Search for an instance of CodexData
	    if (instance == null) {
	        instance = FindObjectOfType(typeof (CodexData)) as CodexData;
	    }
	
	    // If it is still null, create a new instance
	    if (instance == null) {
	        var obj:GameObject = Instantiate(Resources.Load("Codices"));
	        instance = obj as CodexData;
	        Debug.Log("Could not locate a CodexData object. CodexData was generated automaticly.");
	    }
		
	    return instance;
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