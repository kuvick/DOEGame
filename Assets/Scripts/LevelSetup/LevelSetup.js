#pragma strict

enum Ratio {_4x3, _3x2};

public var wantedScreenRatio : Ratio;

function Awake () {
	var ratioAmount : float;
	if (wantedScreenRatio == Ratio._4x3){
		ratioAmount = 4.0f / 3.0f;
	} else if (wantedScreenRatio == Ratio._3x2){
		ratioAmount = 3.0f / 2.0f;
	}
	ScreenSettingsManager.instance.CalculateSettings(ratioAmount);
}
