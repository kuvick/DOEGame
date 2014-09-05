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
		// attempt to find whether there is an intro and loop component
		var clip = Resources.Load(pathToSounds + audioClipName + "_intro");
		// if not, find clip as is
		if (clip == null){
			clip = Resources.Load(pathToSounds + audioClipName);
			if (clip == null)
				Debug.LogWarning("Sound clip was not set");
		}
		// if there is an intro component, set the loop component name
		else
			loopClipName = audioClipName + "_loop";
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