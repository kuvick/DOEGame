#pragma strict

public class LinkSounds {
	public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.Medium;
	public var petroleumLink : AudioClip;
	public var powerLink : AudioClip;
	public var coalLink : AudioClip;
	public var uraniumLink : AudioClip;
	public var ethanolLink : AudioClip;
	public var moneyLink : AudioClip;
	public var wasteLink : AudioClip;
	public var fuelLink : AudioClip;
	public var genericLink : AudioClip;
	
	public var linkDenied : AudioClip;
	
	public var linkDrag : AudioClip;
	
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
		if (!linkSoundTable.ContainsKey(resource)) throw new System.Exception("Did not find " + resource + " linking sound");
		return (linkSoundTable[resource]);
	}
}