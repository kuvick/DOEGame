#pragma strict
import System.Collections.Generic;
import System.Xml;
import System.IO;

@XmlRoot("ContactsData")
public class ContactData extends MonoBehaviour {
	@XmlArray("Contacts")
	public var contacts : List.<Contact>;
	
	private static var instance : ContactData = null; 

	//Returns an instance of the ContactData, if any exists. If not, an instance will be created.
	public static function Instance() : ContactData {
		// Search for an instance of ContactData
	    if (instance == null) {
	        instance = FindObjectOfType(typeof (ContactData)) as ContactData;
	    }
	
	    // If it is still null, create a new instance
	    if (instance == null) {
	        var obj:GameObject = Instantiate(Resources.Load("Contacts"));
	        instance = obj as ContactData;
	        Debug.Log("Could not locate a ContactData object. ContactData was generated automaticly.");
	    }
		
	    return instance;
	}
	
	public function UnlockContact(contactName : String){
		Debug.Log("Unlocking " + contactName);
		for (var contact : Contact in contacts){
			if (contact.name.Equals(contactName)){
				contact.isUnlocked = true;
				return;
			}
		}
		Debug.Log("Could not find " + contactName + " to unlock");
	}
	
	public function LockContact(contactName : String){
		for (var contact : Contact in contacts){
			if (contact.name.Equals(contactName)){
				contact.isUnlocked = false;
				return;
			}
		}
		Debug.Log("Could not find " + contactName + " to lock");
	}
}