#pragma strict

class SoundType{
	public var audioClip : AudioClip;
	public var audioClipName : String;
	private final var pathToSounds : String = "sounds/";
	
	public function CacheSoundClip(){
		if (audioClip == null){
			Debug.LogWarning("Sound clip was not set for " + this.ToString());
			return;
		}
		audioClipName = audioClip.name;
		
		audioClip = null;
	}
	
	public function GetClip(){
		var clip = Resources.Load(pathToSounds + audioClipName);
		if (clip == null){
			Debug.LogWarning("Sound clip was not set");
		}
		return (clip);
	}
}