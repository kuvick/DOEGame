#pragma strict

public class BackgroundSounds {
	//public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.High;
	public var priority : SoundManager.SoundPriority = SoundManager.SoundPriority.Low;	// changed so it's on a seperate priority from all the other sounds
	public var startMenuMusic : SoundType;
	public var inGameMusic : SoundType;
	public var pauseMenuMusic : SoundType;
	public var levelSelectMusic : SoundType;
	public var failureMenuMusic : SoundType;
	public var scoreMenuMusic : SoundType;
	public var loadingMenuMusic : SoundType;
	public var creditsMenuMusic : SoundType;
	
	public function CacheSounds(){
		startMenuMusic.CacheSoundClip();
		inGameMusic.CacheSoundClip();
		pauseMenuMusic.CacheSoundClip();
		levelSelectMusic.CacheSoundClip();
		failureMenuMusic.CacheSoundClip();
		loadingMenuMusic.CacheSoundClip();
		scoreMenuMusic.CacheSoundClip();
		creditsMenuMusic.CacheSoundClip();
	}	
}