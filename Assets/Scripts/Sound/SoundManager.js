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
	
	public var buildingPlacedSound : SoundType;
	public var linkSounds : LinkSounds;
	public var unitSounds : UnitSounds;
	public var menuSounds : MenuSounds;
	public var objectiveSounds : ObjectiveSounds;
	public var buildingSelcted : SoundType;
	public var backgroundSounds : BackgroundSounds;
	
	private static var instance : SoundManager = null; 
	
	public enum SoundPriority {Maximum=1, High=2, Medium=3, Low=4, Minimum=5};

	public var maxPriorityVolume : float = 1;
	public var highPriorityVolume : float = .75;
	public var mediumPriorityVolume : float = .5;
	public var lowPriorityVolume : float = .25;
	public var minimumPriorityVolume : float = .1;
	
	private var startMaxPriorityVolume : float = 1;
	private var startHighPriorityVolume : float = .75;
	private var startMediumPriorityVolume : float = .5;
	private var startLowPriorityVolume : float = .25;
	private var startMinimumPriorityVolume : float = .1;
	
	private var saveSystem : SaveSystem;
	private var waitingOnCurrentPlayer:boolean = false;
	
	public function Awake() {
		var playerData : GameObject = GameObject.Find("Player Data");
		
		if(playerData != null)
			saveSystem = playerData.GetComponent("SaveSystem");
		
		if(saveSystem != null && saveSystem.currentPlayer.name == "")
			waitingOnCurrentPlayer = true;
		
		startMaxPriorityVolume = maxPriorityVolume;
		startHighPriorityVolume = highPriorityVolume;
		startMediumPriorityVolume = mediumPriorityVolume;
		startLowPriorityVolume = lowPriorityVolume;
		startMinimumPriorityVolume = minimumPriorityVolume;
		
		
		if(saveSystem != null)
		{
			lowPriorityVolume = saveSystem.currentPlayer.musicLevel;
			//Determining sound effect volumes:
			var maxLevel : float = saveSystem.currentPlayer.sfxLevel;
			
			maxPriorityVolume *= maxLevel;
			highPriorityVolume *= maxLevel;
			mediumPriorityVolume *= maxLevel;
			minimumPriorityVolume *= maxLevel;
		}	
	
		var otherSoundManager:GameObject = GameObject.Find("SoundManager(Clone)");
		if(otherSoundManager != null && otherSoundManager != this.gameObject)
			Destroy(this.gameObject);
		
		otherSoundManager = GameObject.Find("SoundManager");
		if(otherSoundManager != null && otherSoundManager != this.gameObject)
			Destroy(this.gameObject);
		
		otherSoundManager = GameObject.Find("Sound Manager");	
		if(otherSoundManager != null && otherSoundManager != this.gameObject)
			Destroy(this.gameObject);
	
	
		musicSource = AddAudioSource();
		musicSource.loop = true;
		
		defaultClipSource = AddAudioSource();
		
		checkPriorityVolumes();
		
		linkSounds.Init();
		CacheAllSounds();
	}
	
	function Update()
	{
		if(waitingOnCurrentPlayer && saveSystem != null && saveSystem.currentPlayer && saveSystem.currentPlayer.name != "")
		{
			setVolumes(saveSystem.currentPlayer.sfxLevel, saveSystem.currentPlayer.musicLevel);
			musicSource.volume = lowPriorityVolume;
			waitingOnCurrentPlayer = false;
		}
	}
	
	public function UpdateMusicVol(val:float)
	{
		musicSource.volume = val;
	}
	
	public function GetMusicVol() : float
	{
		return musicSource.volume;
	}
	
	public function OnLevelWasLoaded(){
		CacheAllSounds();
	}
	
	// Store all the sounds as strings to save memorys
	private function CacheAllSounds(){
		buildingPlacedSound.CacheSoundClip();
		buildingSelcted.CacheSoundClip();
		linkSounds.CacheSounds();
		unitSounds.CacheSounds();
		menuSounds.CacheSounds();
		objectiveSounds.CacheSounds();
		backgroundSounds.CacheSounds();
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
	        DontDestroyOnLoad(obj);
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
	public function playLinkingSound(clipToPlay : SoundType){
		playOneShot(clipToPlay.GetClip(), linkSounds.priority);
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
	
	private var linkDraggingStartPlayed = false;
	public function PlayLinkDraging(){
		if (linkSounds.linkDragStart == null || linkSounds.linkDrag == null){
			Debug.LogError("A link draging sound was not set");
			return;
		}
		if (!linkDraggingStartPlayed){
			linkDraggingStartPlayed = true;
			var source : AudioSource = AddAudioSource();
			var linkDragStart : AudioClip = linkSounds.linkDragStart.GetClip();
			playClip(linkDragStart, source, linkSounds.priority);
			/*yield WaitForSeconds (linkDragStart.length);
			if (!linkDraggingStartPlayed) return; // if we stopped dragging before the starting sound finished
			playClipLooped(linkSounds.linkDrag.GetClip(), source, linkSounds.priority);*/
		}
	}
	
	public function StopLinkDraging(){
		//var sourcePlayingDragClip : AudioSource = getSoundSourcePlayingClip(linkSounds.linkDrag.GetClip());
		var sourcePlayingDragStartClip : AudioSource = getSoundSourcePlayingClip(linkSounds.linkDragStart.GetClip());
		/*if (sourcePlayingDragClip != null){
			RemoveAudioSource(sourcePlayingDragClip);
		}*/
		if (sourcePlayingDragStartClip != null){
			RemoveAudioSource(sourcePlayingDragStartClip);
		}
		linkDraggingStartPlayed = false;
	}
	
	/// Unit sounds
	private function playUnitSound(clipToPlay : SoundType){
		playOneShot(clipToPlay.GetClip(), unitSounds.priority);
	}
	
	public function PlayUnitSelected(unitSelected : Unit){
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
	private function playObjectiveSound(clipToPlay : SoundType){
		playOneShot(clipToPlay.GetClip(), objectiveSounds.priority);
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
		playOneShot(buildingPlacedSound.GetClip(), 1);
	}
	
	/// Menu sounds
	private function playMenuSound(clipToPlay : SoundType){
		playOneShot(clipToPlay.GetClip(), menuSounds.priority);
	}
	
	public function playButtonClick(){
		playMenuSound(menuSounds.menuButtonClicked);
	}
	
	public function playCancel() {
		playMenuSound(menuSounds.menuActionCanceled);
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
	
	private var playTyping : boolean = false;
	public function playNarrativeTyping()
	{
		playTyping = true;
		// checks to make sure sound is playing, if randomly stops restarts it
		while (playTyping)
		{
			if (!defaultClipSource.isPlaying)
			{
				playClipLooped(menuSounds.narrativeTyping.GetClip(), defaultClipSource, menuSounds.priority);
			}
			yield;
		}
	}
	
	public function stopNarrativeTyping()
	{
		var sourcePlayingClip : AudioSource = getSoundSourcePlayingClip(menuSounds.narrativeTyping.GetClip());
		if (sourcePlayingClip)
			sourcePlayingClip.loop = false;
		playTyping = false;
	}
	
	public function playMusic(musicClip : SoundType){
		if (alreadyPlayingLoopedSound(musicClip.GetClip())){
			return; // don't restart the sound
		}
		continueMusicLoop = false; // ensures that if a new song is started, does not randomly continue the previous
		if (musicClip.loopClipName == String.Empty)
			playClipLooped(musicClip.GetClip(), musicSource, backgroundSounds.priority);
		else
			playClipIntroToLooped(musicClip.GetClip(), musicClip.GetLoopClip(), musicSource, backgroundSounds.priority);
	}
	
	public function stopMusic(){
		musicSource.Stop();
	}
	
	public function playClipLooped(clipToPlay : AudioClip, source : AudioSource, priority : SoundPriority){
		playClip(clipToPlay, source, priority, true);
	}
	
	private static var continueMusicLoop : boolean; // used to make sure the loop section is not played at the wrong time
	// if a music has an intro and separate loop section, plays the intro first before switching to the looping clip
	private function playClipIntroToLooped(introClip : AudioClip, loopClip : AudioClip, source : AudioSource, priority : SoundPriority)
	{
		continueMusicLoop = true;
		playClip(introClip, source, priority, false);
		yield WaitForSeconds(introClip.length);
		if (continueMusicLoop)
			playClip(loopClip, source, priority, true);
		continueMusicLoop = false;
	}
	
	// will play a single clip without looping it
	private function playClip(clipToPlay : AudioClip, source : AudioSource, priority : SoundPriority){
		playClip(clipToPlay, source, priority, false);
	}
	
	public function playClip(clipToPlay : AudioClip, source : AudioSource, priority : SoundPriority, shouldLoop : boolean){
		if (source == null) source = AddAudioSource();
		source.loop = shouldLoop;
		source.priority = priority;
		source.volume = getVolume(priority);
		source.clip = clipToPlay;
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
		if (Application.loadedLevelName == "LoadingScreen" && !GUIManager.Instance().gameObject.GetComponent(Loading).hasFinishedDelay) return;
		//Debug.Log("test after load");
		var sourcePlayingClip : AudioSource = getSoundSourcePlayingClip(clipToPlay);
		if (sourcePlayingClip == null){
			if (defaultClipSource.isPlaying){
				playClipAndDelete(clipToPlay, priority);
			} else {
				playClip(clipToPlay, defaultClipSource, priority);
			}
		} else {
			if (!sourcePlayingClip.isPlaying)
				playClip(clipToPlay, sourcePlayingClip, priority); // restart the sound if it is already in progress
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
		if (sourceToRemove == null) return;
		sourceToRemove.Stop(); 
		if (sourceToRemove != defaultClipSource){
			soundSourcePool.Remove(sourceToRemove);
			Destroy(sourceToRemove);
		}	
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
	
	public function setVolumes(sfxVal:float, musicVal:float)
	{
		lowPriorityVolume = musicVal;
		maxPriorityVolume = startMaxPriorityVolume * sfxVal;
		highPriorityVolume = startHighPriorityVolume * sfxVal;
		mediumPriorityVolume = startMediumPriorityVolume * sfxVal;
		minimumPriorityVolume = startMinimumPriorityVolume * sfxVal;	
	}
}