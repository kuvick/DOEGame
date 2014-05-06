#pragma strict

public class MenuSounds {
	public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.High;
	public var menuButtonClicked : SoundType;
	public var menuActionAcknowledged : SoundType;
	public var menuActionCanceled : SoundType;
	public var menuUndo : SoundType;
	public var menuWait : SoundType;
	public var buildingMenuOpen : SoundType;
	public var inspectionOpen : SoundType;
	public var inspectionClose : SoundType;
	public var narrativeTyping : SoundType;
	
	public function CacheSounds(){
		menuButtonClicked.CacheSoundClip();
		menuActionAcknowledged.CacheSoundClip();
		menuActionCanceled.CacheSoundClip();
		menuUndo.CacheSoundClip();
		menuWait.CacheSoundClip();
		buildingMenuOpen.CacheSoundClip();
		inspectionOpen.CacheSoundClip();
		inspectionClose.CacheSoundClip();
		narrativeTyping.CacheSoundClip();
	}	
}