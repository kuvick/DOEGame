#pragma strict

class SoundType{
	private var audioClip : AudioClip;
	public var audioClipName : String;
	public var loopClipName : String;
	private final var pathToSounds : String = "sounds/";
	
	public function CacheSoundClip(){
		if (audioClipName != null) return;
		if (audioClip == null){
			Debug.LogWarning("Sound clip was not set for " + this.ToString());
			return;
		}
		
		audioClipName = audioClip.name;
		
		audioClip = null;
	}
	
	// returns the main audio clip
	public function GetClip(){
		var clip = Resources.Load(pathToSounds + audioClipName);
		if (clip == null){
			Debug.LogWarning("Sound clip was not set");
		}
		return (clip);
	}
	
	// returns the looping audio clip
	public function GetLoopClip()
	{
		var clip = Resources.Load(pathToSounds + loopClipName);
		if (clip == null){
			Debug.LogWarning("Sound clip was not set");
		}
		return (clip);
	}
}