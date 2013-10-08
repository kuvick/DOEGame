#pragma strict

public class UnitSounds {
	public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.Maximum;
	public var researcherSelection : SoundType;
	public var researcherActivate : SoundType;
	public var researcherOrder : SoundType;
	public var researchedArrived : SoundType;
	public var workerSelection : SoundType;
	public var workerActivate : SoundType;
	public var workerOrder : SoundType;
	public var workerArrived : SoundType;
	
	public function CacheSounds(){
		researcherSelection.CacheSoundClip();
		researcherActivate.CacheSoundClip();
		researcherOrder.CacheSoundClip();
		researchedArrived.CacheSoundClip();
		workerSelection.CacheSoundClip();
		workerActivate.CacheSoundClip();
		workerOrder.CacheSoundClip();
		workerArrived.CacheSoundClip();
	}	
}