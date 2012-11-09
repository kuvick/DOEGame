#pragma strict

function Awake () {
	Debug.Log("test");
	ScreenSettingsManager.instance.CalculateSettings();
}
