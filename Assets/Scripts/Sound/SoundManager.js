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
	public var buildingPlacedSound : AudioClip;
	public var linkSounds : LinkSounds;
	public var unitSounds : UnitSounds;
	public var menuSounds : MenuSounds;
	public var objectiveSounds : ObjectiveSounds;
	public var buildingSelcted : AudioClip;
	public var backgroundSounds : BackgroundSounds;
	
	private static var instance : SoundManager = null; 
	
	public function Awake() {
		audioSource = gameObject.GetComponent(AudioSource);
		if (audioSource == null) {
			Debug.LogWarning("No audio source attached to AudioManager making a new one");
			audioSource = gameObject.AddComponent("AudioSource");
		}
		linkSounds.Init();
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
	        instance = obj as SoundManager;
	        Debug.Log("Could not locate a SoundManager object. SoundManager was generated automaticly.");
	    }
		
	    return instance;
	}

	public function PlayLinkMade(linkResource: ResourceType){
		PlayOneShot(linkSounds.GetSound(linkResource));
	}
	
	public function PlayUnitSelected(unitSelected : Unit){
		Debug.Log("Playing unit selected");
		switch (unitSelected.type){
			case (UnitType.Researcher):
				PlayOneShot(unitSounds.resercherSelection);
				break;
			case (UnitType.Worker):
				PlayOneShot(unitSounds.workerSelection);
				break;
			case (UnitType.Regulator):
				PlayOneShot(unitSounds.regulatorSelection);
				break;
			case (UnitType.EnergyAgent):
				PlayOneShot(unitSounds.energyAgentSelection);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	public function PlayPrimaryObjectiveComplete(){
		PlayOneShot(objectiveSounds.primaryObjectiveCompleted);
	}
	
	public function PlayPrimaryObjectiveExpired(){
		PlayOneShot(objectiveSounds.primaryObjectiveExpired);
	}
	
	public function PlaySecondaryObjectiveComplete(){
		PlayOneShot(objectiveSounds.secondaryObjectiveCompleted);
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
	
	public function playButtonClick(){
		Debug.Log("Playing click");
		PlayOneShot(menuSounds.menuButtonClicked);
	}
	
	private function PlayOneShot(clipToPlay : AudioClip){
		if (clipToPlay == null) {
			Debug.LogError("Trying to play clip: " + clipToPlay.ToString() + " and it was not set");
			return;
		}
		audioSource.PlayOneShot(clipToPlay);
	}
	
	private function alreadyPlayingLoopedSound(soundToPlay: AudioClip) : boolean{
		return (audioSource.clip == soundToPlay && audioSource.loop == true);
	}
}