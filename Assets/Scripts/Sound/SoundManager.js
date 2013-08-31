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
	private var soundSourcePool : List.<AudioSource> = new List.<AudioSource>(); // a pool of audiosources so we can play as many sounds as needed.
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
	
	public function PlayLinkDraging(){
		playSoundOnLoop(linkSounds.linkDrag);
	}
	
	public funciton StopLinkDraging(){
		
	}
	
	/// Unit sounds
	public function PlayUnitSelected(unitSelected : Unit){
		switch (unitSelected.type){
			case (UnitType.Researcher):
				PlayOneShot(unitSounds.researcherSelection);
				break;
			case (UnitType.Worker):
				PlayOneShot(unitSounds.workerSelection);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	public function PlayUnitActiviated(unitActivate : Unit){
		switch (unitActivate.type){
			case (UnitType.Researcher):
				PlayOneShot(unitSounds.researcherActivate);
				break;
			case (UnitType.Worker):
				PlayOneShot(unitSounds.workerActivate);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	public function PlayUnitOrdered(unitOrdered : Unit){
		switch (unitOrdered.type){
			case (UnitType.Researcher):
				PlayOneShot(unitSounds.researcherOrder);
				break;
			case (UnitType.Worker):
				PlayOneShot(unitSounds.workerOrder);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	public function PlayUnitArrived(unitArrived : Unit){
	Debug.Log("Playing unit arrived");
		switch (unitArrived.type){
			case (UnitType.Researcher):
				PlayOneShot(unitSounds.researchedArrived);
				break;
			case (UnitType.Worker):
				PlayOneShot(unitSounds.workerArrived);
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
	
	public function playClipOnLoop(soundToPlay : AudioClip){
		
	}
	
	/// Will play a single instnace of the given sound. If all the audiosources are already playing then it will
	/// make a new one and use it to play.
	private function PlayOneShot(clipToPlay : AudioClip, volume : float){
		if (clipToPlay == null) {
			Debug.LogError("Trying to play clip: " + clipToPlay.ToString() + " and it was not set");
			return;
		}
		source : AudioSource
		soundSourcePool[i].clip = clipToPlay;
				soundSourcePool[i].volume = volume;
				soundSourcePool[i].Play();
	}
	
	private function PlayOneShot(clipToPlay : AudioClip){
		PlayOneShot(clipToPlay, 1);
	}
	
	private function alreadyPlayingLoopedSound(soundToPlay: AudioClip) : boolean{
		return (musicSource.clip == soundToPlay && musicSource.loop == true);
	}
	
	private function AlreadyPlayingSoundClip(soundClip : AudioClip) : boolean {
		for (var i : int = 0; i < soundSourcePool.Count; i++){
			if (soundSourcePool[i].isPlaying && soundSourcePool[i].clip == soundClip){
				return (true);
			}
		}
		return (false);
	}
	
	private function AddAudioSource(){
		var newAudio : AudioSource = gameObject.AddComponent("AudioSource");
		newAudio.loop = false;
		soundSourcePool.Add(newAudio);
	}
	
	private function GetAvailableAudioSource() : AudioSource {
		for (var i : int = 0; i < soundSourcePool.Count; i++){
			if (!soundSourcePool[i].isPlaying){
				return (soundSourcePool[i]);
			}
		}
		AddAudioSource();
		return (soundSourcePool[soundSourcePool.Count-1]);
	}
}