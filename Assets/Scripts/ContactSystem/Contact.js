#pragma strict

public class Contact extends DataEntry  {
	public var name : String;
	public var portrait : String; // Name inside the Resources/Contacts/ folder
	public var isUnlocked : boolean;
	public var description : String;
	
	private var pathToContacts = "Contacts/";
	
	public function GetPortraitTexture() : Texture2D {
		var portraitTexture : Texture2D;
		
		try {
			portraitTexture = Resources.Load(pathToContacts + portrait);
			if (portraitTexture == null) {
				throw new System.NullReferenceException();
			}
		} catch (err){
			Debug.LogWarning("Could not find portrait for " + name + " setting it to the default.");
			portraitTexture = Resources.Load(pathToContacts + Strings.lockedPortrait);
		}
		
		return (portraitTexture);
	}
	
	public override function PerformClick(){
		
	}
}