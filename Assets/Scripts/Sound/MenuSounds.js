#pragma strict

public class MenuSounds {
	public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.High;
	public var menuButtonClicked : AudioClip;
	public var menuActionAcknowledged : AudioClip;
	public var menuActionCancled : AudioClip;
	public var menuUndo : AudioClip;
	public var menuWait : AudioClip;
	public var buildingMenuOpen : AudioClip;
	public var inspectionOpen : AudioClip;
	public var inspectionClose : AudioClip;
}