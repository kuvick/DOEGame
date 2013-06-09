#pragma strict

public class LinkSounds {
	public var petroleumLink : AudioClip;
	public var powerLink : AudioClip;
	public var coalLink : AudioClip;
	public var uraniumLink : AudioClip;
	public var ethanolLink : AudioClip;
	public var moneyLink : AudioClip;
	public var wasteLink : AudioClip;
	public var fuelLink : AudioClip;
	public var genericLink : AudioClip;
	
	private var linkSoundTable : Hashtable;
	
	public function Init(){
		linkSoundTable = new Hashtable();
		linkSoundTable.Add(ResourceType.Coal, coalLink);
		linkSoundTable.Add(ResourceType.Gas, fuelLink);
		linkSoundTable.Add(ResourceType.Power, powerLink);
		linkSoundTable.Add(ResourceType.Petrol, petroleumLink);
		linkSoundTable.Add(ResourceType.Fund, moneyLink);
		linkSoundTable.Add(ResourceType.Waste, wasteLink);
		linkSoundTable.Add(ResourceType.Ethanol, ethanolLink);
		linkSoundTable.Add(ResourceType.Uranium, uraniumLink);
	} 
	
	public function GetSound(resource: ResourceType) : AudioClip{
		Debug.Log("Playing the link sound " + linkSoundTable[resource] + " for resource " + resource);
		return (linkSoundTable[resource]);
	}
}