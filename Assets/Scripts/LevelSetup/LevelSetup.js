#pragma strict

function Awake () {
	DontDestroyOnLoad (transform.gameObject);
	ScreenSettingsManager.instance.CalculateSettings();
}
