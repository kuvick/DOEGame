#pragma strict

public class Contact extends DataEntry  {
	public var name : String;
	public var portrait : Texture2D;
	@XmlAttribute("isUnlocked")
	public var isUnlocked : boolean;
	public var description : String;
	
	public override function PerformClick(){
		
	}
}