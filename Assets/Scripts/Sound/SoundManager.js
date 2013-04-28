#pragma strict

/************
SoundManager.js
	A singleton responsible for playing sound effects and background music
	It will hold references to the various sound effects it should play
	The background music of each screen is held in the specific gui control and that calls
		the sound mamanger
Last Modified By: Jared Mavis
************/


public class SoundManager extends MonoBehaviour {
	private var audioSource : AudioSource;
	public var buttonClick1 : AudioClip;
	public var buttonClick2 : AudioClip;
	public var linkingSound : AudioClip;
	public var buildingPlacedSound : AudioClip;
	
	public static var instance : SoundManager = null; 
	
	public function Awake() {
		audioSource = gameObject.GetComponent(AudioSource);
		if (audioSource == null) {
			Debug.LogWarning("No audio source attached to AudioManager making a new one");
			audioSource = gameObject.AddComponent("AudioSource");
		}
	}
	
	//Returns an instance of the SoundManager, if any exists. If not, an instance will be created.
	public static function Instance() : SoundManager {
		// Search for an instance of SoundManager
	    if (instance == null) {
	        instance = FindObjectOfType(typeof (SoundManager)) as SoundManager;
	    }
	
	    // If it is still null, create a new instance
	    if (instance == null) {
	        var obj:GameObject = Instantiate(Resources.Load("SoundManager"));
	        Debug.Log("Could not locate a SoundManager object. SoundManager was generated automaticly.");
	    }
		
	    return instance;
	}

	public function PlayLinkMade(){
		PlayOneShot(linkingSound);
	}
	
	public function PlayBuildingPlaced(){
		PlayOneShot(buildingPlacedSound);
	}
	
	public function playSoundOnLoop(soundToPlay: AudioClip){
		audioSource.loop = true;
		playSound(soundToPlay);
	}
	
	private function playSound(soundToPlay: AudioClip){
		if (alreadyPlayingLoopedSound(soundToPlay)){
			return; // don't restart the sound
		}
		audioSource.clip = soundToPlay;
		audioSource.Play();
	}
	
	public function stopSound(){
		audioSource.Stop();
	}
	
	public function playButtonClick(buttonAudioNumber){
		Debug.Log("Playing click");
		switch(buttonAudioNumber) {
			case 1:
				PlayOneShot(buttonClick1);
				break;
			case 2:
				PlayOneShot(buttonClick2);
				break;
			default:
				PlayOneShot(buttonClick1);
				break;	
		};
	}
	
	private function PlayOneShot(clipToPlay : AudioClip){
		if (clipToPlay == null) {
			Debug.LogError("Trying to play clip that was not set");
			return;
		}
		audioSource.PlayOneShot(clipToPlay);
	}
	
	private function alreadyPlayingLoopedSound(soundToPlay: AudioClip) : boolean{
		return (audioSource.clip == soundToPlay && audioSource.loop == true);
	}
}