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

	if(!created)
	{
		DontDestroyOnLoad(this);
		created = true;
	}
	else
	{	
		Destroy(this.gameObject);
	}
}

public function playButtonClick(buttonAudioNumber)
{
	switch(buttonAudioNumber)
	{
		case 1:
			audioSource.PlayOneShot(buttonClick1);
			break;
		case 2:
			audioSource.PlayOneShot(buttonClick2);
			break;
		default:
			audioSource.PlayOneShot(buttonClick1);
			break;	
	};

}


