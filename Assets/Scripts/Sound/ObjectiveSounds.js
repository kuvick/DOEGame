#pragma strict

public class ObjectiveSounds {
	public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.Maximum;
	public var primaryObjectiveCompleted : AudioClip;
	public var primaryObjectiveExpired : AudioClip;
	public var secondaryObjectiveCompleted : AudioClip;
	public var dataPieceUnlocked : AudioClip;
	public var upgradeUnlocked : AudioClip;
}