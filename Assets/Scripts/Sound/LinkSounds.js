#pragma strict

public class LinkSounds {
	public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.Medium;
	public var petroleumLink : SoundType;
	public var powerLink : SoundType;
	public var coalLink : SoundType;
	public var uraniumLink : SoundType;
	public var ethanolLink : SoundType;
	public var moneyLink : SoundType;
	public var wasteLink : SoundType;
	public var fuelLink : SoundType;
	public var genericLink : SoundType;
	public var knowledgeLink : SoundType;
	public var workforceLink : SoundType;
	public var commerceLink : SoundType;
	
	public var linkDenied : SoundType;
	
	public var linkDragStart : SoundType;
	public var linkDrag : SoundType;
	
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
		linkSoundTable.Add(ResourceType.Knowledge, knowledgeLink);
		linkSoundTable.Add(ResourceType.Workforce, workforceLink);
		linkSoundTable.Add(ResourceType.Commerce, commerceLink);
	} 
	
	public function CacheSounds(){
		petroleumLink.CacheSoundClip();
		powerLink.CacheSoundClip();
		coalLink.CacheSoundClip();
		uraniumLink.CacheSoundClip();
		ethanolLink.CacheSoundClip();
		moneyLink.CacheSoundClip();
		wasteLink.CacheSoundClip();
		fuelLink.CacheSoundClip();
		knowledgeLink.CacheSoundClip();
		workforceLink.CacheSoundClip();
		commerceLink.CacheSoundClip();
		genericLink.CacheSoundClip();
		linkDenied.CacheSoundClip();
		linkDragStart.CacheSoundClip();
		linkDrag.CacheSoundClip();
	}	
	
	public function GetSound(resource: ResourceType) : SoundType{
		if (!linkSoundTable.ContainsKey(resource)) throw new System.Exception("Did not find " + resource + " linking sound");
		return (linkSoundTable[resource]);
	}
}