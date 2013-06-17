#pragma strict

public class CodexEntry extends DataEntry {
	public var name : String;
	@XmlAttribute("isUnlocked")
	public var isUnlocked : boolean;
	public var portrait : Texture2D;
	public var urlLink: String;
}