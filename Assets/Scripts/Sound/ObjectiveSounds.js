#pragma strict

public class ObjectiveSounds {
	public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.Maximum;
	public var primaryObjectiveCompleted : SoundType;
	public var primaryObjectiveExpired : SoundType;
	public var secondaryObjectiveCompleted : SoundType;
	public var dataPieceUnlocked : SoundType;
	public var upgradeUnlocked : SoundType;
	
	public function CacheSounds(){
		primaryObjectiveCompleted.CacheSoundClip();
		primaryObjectiveExpired.CacheSoundClip();
		secondaryObjectiveCompleted.CacheSoundClip();
		dataPieceUnlocked.CacheSoundClip();
		upgradeUnlocked.CacheSoundClip();
	}	
}