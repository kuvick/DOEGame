#pragma strict

/************
AudioSourceSetup.js

Last Modified By: Chris Peterson
Date: 1/15/13

************/

public var audioSource : AudioSource;

public var buttonClick1 : AudioClip;
public var buttonClick2 : AudioClip;

private static var created = false;

function Awake () {
}

public function playSoundOnce(soundToPlay: AudioClip){
	audioSource.loop = false;
	playSound(soundToPlay);
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

public function stopMusic(){
	audioSource.Stop();
}

public function playButtonClick(buttonAudioNumber)
{
	Debug.Log("Playing press");
	switch(buttonAudioNumber)
	{
		case 1:
			audioSource.PlayOneShot(buttonClick1,1);
			break;
		case 2:
			audioSource.PlayOneShot(buttonClick2,1);
			break;
		default:
			audioSource.PlayOneShot(buttonClick1,1);
			break;	
	};
}


private function alreadyPlayingLoopedSound(soundToPlay: AudioClip) : boolean{
	return (audioSource.clip == soundToPlay && audioSource.loop == true);
}