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
	// A pool of audiosources so we can play as many sounds as needed.
	// 0th element is dedicated to music
	// 1st element is a constantly allocated source for sounds
	// any additional sources will play and then be deleted
	private var soundSourcePool : List.<AudioSource> = new List.<AudioSource>(); 
	private var musicSource : AudioSource;
	private var defaultClipSource : AudioSource;
	
	public var buildingPlacedSound : AudioClip;
	public var linkSounds : LinkSounds;
	public var unitSounds : UnitSounds;
	public var menuSounds : MenuSounds;
	public var objectiveSounds : ObjectiveSounds;
	public var buildingSelcted : AudioClip;
	public var backgroundSounds : BackgroundSounds;
	
	private static var instance : SoundManager = null; 
	
	public enum SoundPriority {Maximum=1, High=2, Medium=3, Low=4, Minimum=5};

	public var maxPriorityVolume : float = 1;
	public var highPriorityVolume : float = .75;
	public var mediumPriorityVolume : float = .5;
	public var lowPriorityVolume : float = .25;
	public var minimumPriorityVolume : float = .1;
	
	public function Awake() {
		musicSource = AddAudioSource();
		musicSource.loop = true;
		
		defaultClipSource = AddAudioSource();
		
		checkPriorityVolumes();
		
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

	// make sure that all of the value fall inside
	public function checkPriorityVolumes(){
		if (maxPriorityVolume < 0 || maxPriorityVolume > 1){
			Debug.LogWarning("Max Priority Volume is out of bounds");
		}
		if (highPriorityVolume < 0 || highPriorityVolume > 1){
			Debug.LogWarning("High Priority Volume is out of bounds");
		}
		if (mediumPriorityVolume < 0 || mediumPriorityVolume > 1){
			Debug.LogWarning("Medium Priority Volume is out of bounds");
		}
		if (lowPriorityVolume < 0 || lowPriorityVolume > 1){
			Debug.LogWarning("Low Priority Volume is out of bounds");
		}
	}

	/// Linking sounds
	public function playLinkingSound(clipToPlay : AudioClip){
		playOneShot(clipToPlay, linkSounds.priority);
	}
	
	public function PlayLinkMade(linkResource: ResourceType){
		try {
			playLinkingSound(linkSounds.GetSound(linkResource));
		} catch (err : System.Exception) {
			Debug.LogError(err.ToString());
		}
	}
	
	public function PlayLinkDenied(){
		playLinkingSound(linkSounds.linkDenied);
	}
	
	private var linkDraringStartPlayed = false;
	public function PlayLinkDraging(){
		if (!linkDraringStartPlayed){
			linkDraringStartPlayed = true;
			var source : AudioSource = AddAudioSource();
			playClip(linkSounds.linkDragStart, source, linkSounds.priority);
			yield WaitForSeconds (linkSounds.linkDragStart.length);
			playClipLooped(linkSounds.linkDrag, source, linkSounds.priority);
		}
	}
	
	public function StopLinkDraging(){
		var sourcePlayingClip : AudioSource = getSoundSourcePlayingClip(linkSounds.linkDrag);
		if (sourcePlayingClip != null){
			sourcePlayingClip.Stop();
			if (sourcePlayingClip != defaultClipSource){
				RemoveAudioSource(sourcePlayingClip);
			}
		}
		linkDraringStartPlayed = false;
	}
	
	/// Unit sounds
	private function playUnitSound(clipToPlay : AudioClip){
		playOneShot(clipToPlay, unitSounds.priority);
	}
	
	public function PlayUnitSelected(unitSelected : Unit){
		Debug.Log("playing unit selected");
		switch (unitSelected.type){
			case (UnitType.Researcher):
				playUnitSound(unitSounds.researcherSelection);
				break;
			case (UnitType.Worker):
				playUnitSound(unitSounds.workerSelection);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	public function PlayUnitActiviated(unitActivate : Unit){
		switch (unitActivate.type){
			case (UnitType.Researcher):
				playUnitSound(unitSounds.researcherActivate);
				break;
			case (UnitType.Worker):
				playUnitSound(unitSounds.workerActivate);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	public function PlayUnitOrdered(unitOrdered : Unit){
		switch (unitOrdered.type){
			case (UnitType.Researcher):
				playUnitSound(unitSounds.researcherOrder);
				break;
			case (UnitType.Worker):
				playUnitSound(unitSounds.workerOrder);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	public function PlayUnitArrived(unitArrived : Unit){
		switch (unitArrived.type){
			case (UnitType.Researcher):
				playUnitSound(unitSounds.researchedArrived);
				break;
			case (UnitType.Worker):
				playUnitSound(unitSounds.workerArrived);
				break;
			default:
				Debug.LogWarning("Attempting to play unit selection sound for unimplemented unit");
		}
	}
	
	/// Objective sounds
	private function playObjectiveSound(clipToPlay : AudioClip){
		playOneShot(clipToPlay, objectiveSounds.priority);
	}
	
	public function PlayPrimaryObjectiveComplete(){
		playObjectiveSound(objectiveSounds.primaryObjectiveCompleted);
	}
	
	public function PlayPrimaryObjectiveExpired(){
		playObjectiveSound(objectiveSounds.primaryObjectiveExpired);
	}
	
	public function PlaySecondaryObjectiveComplete(){
		playObjectiveSound(objectiveSounds.secondaryObjectiveCompleted);
	}
	
	public function PlayDataPieceUnlocked(){
		playObjectiveSound(objectiveSounds.dataPieceUnlocked);
	}
	
	/// Building sounds
	public function PlayBuildingPlaced(){
		playOneShot(buildingPlacedSound, 1);
	}
	
	/// Menu sounds
	private function playMenuSound(clipToPlay : AudioClip){
		playOneShot(clipToPlay, menuSounds.priority);
	}
	
	public function playButtonClick(){
		playMenuSound(menuSounds.menuButtonClicked);
	}
	
	public function playUndo(){
		playMenuSound(menuSounds.menuUndo);
	}
	
	public function playWait(){
		playMenuSound(menuSounds.menuWait);
	}
	
	public function playBuildingMenuOpen(){
		playMenuSound(menuSounds.buildingMenuOpen);
	}
	
	public function playInspectionOpen(){
		playMenuSound(menuSounds.inspectionOpen);
	}
	
	public function playInspectionClose(){
		playMenuSound(menuSounds.inspectionClose);
	}
	
	public function playMusic(musicClip : AudioClip){
		if (alreadyPlayingLoopedSound(musicClip)){
			return; // don't restart the sound
		}
		playClipLooped(musicClip, musicSource, backgroundSounds.priority);
	}
	
	public function stopMusic(){
		musicSource.Stop();
	}
	
	private function playClipLooped(clipToPlay : AudioClip, source : AudioSource, priority : SoundPriority){
		playClip(clipToPlay, source, priority, true);
	}
	
	// will play a single clip without looping it
	private function playClip(clipToPlay : AudioClip, source : AudioSource, priority : SoundPriority){
		playClip(clipToPlay, source, priority, false);
	}
	
	public function playClip(clipToPlay : AudioClip, source : AudioSource, priority : SoundPriority, shouldLoop : boolean){
		source.loop = shouldLoop;
		source.priority = priority;
		source.volume = getVolume(priority);
		source.clip = clipToPlay;
		Debug.Log("playing clip " + clipToPlay + " with priority " + priority);
		source.Play();
		// future expansion - could reset the volumes after this sound has stoped playing
	}
	
	/// Will play a single instanace of the given sound. If all the audiosources are already playing then it will
	/// make a new one and use it to play.
	private function playOneShot(clipToPlay : AudioClip, priority : SoundPriority){
		if (clipToPlay == null) {
			Debug.LogError("Trying to play clip: " + clipToPlay.ToString() + " and it was not set");
			return;
		}
		var sourcePlayingClip : AudioSource = getSoundSourcePlayingClip(clipToPlay);
		if (sourcePlayingClip == null){
			if (defaultClipSource.isPlaying){
				playClipAndDelete(clipToPlay, priority);
			} else {
				playClip(clipToPlay, defaultClipSource, priority);
			}
		} else {
			playClip(clipToPlay, sourcePlayingClip, priority); // resart the sound if it is already in progress
		}
	}
	
	/// Will create an audio source to play the clip and then will delete it when the clip is done
	private function playClipAndDelete(clipToPlay : AudioClip, priority : SoundPriority){
		var source : AudioSource = AddAudioSource();
		playClip(clipToPlay, source, priority);
		yield WaitForSeconds (clipToPlay.length);
		RemoveAudioSource(source);
	}
	
	private function alreadyPlayingLoopedSound(soundToPlay: AudioClip) : boolean{
		return (musicSource.clip == soundToPlay && musicSource.loop == true);
	}
	
	private function AddAudioSource() : AudioSource{
		var newAudio : AudioSource = gameObject.AddComponent("AudioSource");
		newAudio.loop = false;
		soundSourcePool.Add(newAudio);
		return (newAudio);
	}
	
	private function RemoveAudioSource(sourceToRemove : AudioSource) {
		sourceToRemove.Stop();
		soundSourcePool.Remove(sourceToRemove);
		Destroy(sourceToRemove);
	}
	
	/// Will return the audio source that is playing the given clip or null if none are playing it
	private function getSoundSourcePlayingClip(clipToFind : AudioClip) : AudioSource{
		for (var source : AudioSource in soundSourcePool){
			if (source.isPlaying && source.clip == clipToFind) return (source);
		}
		return null;
	}
	
	private function getVolume(priority : SoundPriority) : float{
		switch (priority){
		case (SoundPriority.Maximum):
			return (maxPriorityVolume);
		case (SoundPriority.High):
			return (highPriorityVolume);
		case (SoundPriority.Medium):
			return (mediumPriorityVolume);
		case (SoundPriority.Low):
			return (lowPriorityVolume);
		default:
			return (minimumPriorityVolume);
		}
	}
}