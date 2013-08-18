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
	private var musicSource : AudioSource;
	private var soundSource : AudioSource;
	public var buildingPlacedSound : AudioClip;
	public var linkSounds : LinkSounds;
	public var unitSounds : UnitSounds;
	public var menuSounds : MenuSounds;
	public var objectiveSounds : ObjectiveSounds;
	public var buildingSelcted : AudioClip;
	public var backgroundSounds : BackgroundSounds;
	
	private static var instance : SoundManager = null; 
	
	public function Awake() {
		musicSource = gameObject.AddComponent("AudioSource");
		soundSource = gameObject.AddComponent("AudioSource");
		soundSource.loop = false;
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
	    }
		
	    return instance;
	}

	/// Linking sounds
	public function PlayLinkMade(linkResource: ResourceType){
		try {
			PlayOneShot(linkSounds.GetSound(linkResource));
		} catch (err : System.Exception) {
			Debug.LogError(err.ToString());
		}
	}
	
	public function PlayLinkDenied(){
		PlayOneShot(linkSounds.linkDenied);
	}
	
	/// Unit sounds
	public function PlayUnitSelected(unitSelected : Unit){
		switch (unitSelected.type){
			case (UnitType.Researcher):
				PlayOneShot(unitSounds.resercherSelection);
				break;
			case (UnitType.Worker):
				PlayOneShot(unitSounds.workerSelection);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	/// Objective sounds
	public function PlayPrimaryObjectiveComplete(){
		PlayOneShot(objectiveSounds.primaryObjectiveCompleted);
	}
	
	public function PlayPrimaryObjectiveExpired(){
		PlayOneShot(objectiveSounds.primaryObjectiveExpired);
	}
	
	public function PlaySecondaryObjectiveComplete(){
		PlayOneShot(objectiveSounds.secondaryObjectiveCompleted);
	}
	
	public function PlayDataPieceUnlocked(){
		PlayOneShot(objectiveSounds.dataPieceUnlocked);
	}
	
	/// Building sounds
	public function PlayBuildingPlaced(){
		PlayOneShot(buildingPlacedSound);
	}
	
	/// Menu sounds
	public function playButtonClick(){
		PlayOneShot(menuSounds.menuButtonClicked);
	}
	
	public function playUndo(){
		PlayOneShot(menuSounds.menuUndo);
	}
	
	public function playWait(){
		PlayOneShot(menuSounds.menuWait);
	}
	
	public function playBuildingMenuOpen(){
		PlayOneShot(menuSounds.buildingMenuOpen);
	}
	
	/// Sound playing methods
	public function playSoundOnLoop(soundToPlay: AudioClip){
		musicSource.loop = true;
		playSound(soundToPlay);
	}
	
	private function playSound(soundToPlay: AudioClip){
		if (alreadyPlayingLoopedSound(soundToPlay)){
			return; // don't restart the sound
		}
		musicSource.clip = soundToPlay;
		musicSource.Play();
	}
	
	public function stopSound(){
		musicSource.Stop();
	}
	
	private function PlayOneShot(clipToPlay : AudioClip){
		if (clipToPlay == null) {
			Debug.LogError("Trying to play clip: " + clipToPlay.ToString() + " and it was not set");
			return;
		}
		if (soundSource.isPlaying && soundSource.clip == clipToPlay) return;
		soundSource.clip = clipToPlay;
		soundSource.Play();
	}
	
	private function alreadyPlayingLoopedSound(soundToPlay: AudioClip) : boolean{
		return (musicSource.clip == soundToPlay && musicSource.loop == true);
	}
}