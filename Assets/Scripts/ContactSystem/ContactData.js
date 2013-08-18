#pragma strict
import System.Collections.Generic;
import System.Xml;
import System.IO;

public class ContactData {
	public var contacts : List.<Contact>;

	public function ContactData(){
		contacts = new List.<Contact>();
	}
	
	public function ContactUnlocked(contactName : String){
		for (var contact : Contact in contacts){
			if (contact.name == contactName){
				return (true);
			}
		}
		return (false);
	}
	
	public function LoadFromSource(){
 		var path : String = Path.Combine(Application.persistentDataPath, "ContactData.xml");
 		
 		if (!File.Exists(path)){
 	 		Debug.LogError("Could not find " + path);
 	 	}
 		
 	 	var serializer : XmlSerializer = new XmlSerializer(ContactData);
 	 	
	 	var stream : Stream = new FileStream(path, FileMode.Open);
	 	var contactData : ContactData = serializer.Deserialize(stream) as ContactData;
	 	stream.Close();

	 	contacts = contactData.contacts;
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