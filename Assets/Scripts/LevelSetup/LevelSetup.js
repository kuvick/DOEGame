#pragma strict

// The desired ratio
enum Ratio {_4x3, _3x2, _16x9, _5x3, _16x10};

public var wantedScreenRatio : Ratio;

public var backgroundMusic : String;

function Awake() {
	var ratioAmount : float = ConvertRatio(wantedScreenRatio);
	
	ScreenSettingsManager.instance.CalculateSettings(ratioAmount);
	SoundManager.Instance(); // load up the sounds if needed
	if (backgroundMusic != null && backgroundMusic != String.Empty)
		SoundManager.Instance().backgroundSounds.inGameMusic.audioClipName = backgroundMusic;
}

function OnDestroy () {
	PlayerPrefs.SetString(Strings.RESUME, Application.loadedLevelName); // when we exit the level mark it as the one we should resume to
}

function ConvertRatio(setRatio : Ratio)
{
	var converted:float = 0;
	switch (setRatio)
	{
		case Ratio._4x3:
			converted = (4.0f / 3.0f);
			break;
		case Ratio._3x2:
			converted = (3.0f / 2.0f);
			break;
		case Ratio._16x9:
			converted = (16.0f / 9.0f);
			break;
		case Ratio._5x3:
			converted = (5.0f / 3.0f);
			break;
		case Ratio._16x10:
			converted = (16.0f / 10.0f);
			break;
		default:
			converted = (4.0f / 3.0f);	
	}
	
	return converted;
}

public static function getNextLevel() : String{
	var nextLevel : NextLevelScript = GameObject.Find("NextLevel").GetComponent("NextLevelScript");
	//Debug.Log("next level = " + nextLevel.nextLevel);
	return (nextLevel.nextLevel);
}