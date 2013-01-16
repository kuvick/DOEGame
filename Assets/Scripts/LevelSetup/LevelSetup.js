#pragma strict

enum Ratio {_4x3, _3x2, _16x9, _5x3, _16x10};

public var wantedScreenRatio : Ratio;

function Awake () {
	var ratioAmount : float;
	
	switch (wantedScreenRatio){
		case Ratio._4x3:
			ratioAmount = 4.0f / 3.0f;
			break;
		case Ratio._3x2:
			ratioAmount = 3.0f / 2.0f;
			break;
		case Ratio._16x9:
			ratioAmount = 16.0f / 9.0f;
			break;
		case Ratio._5x3:
			ratioAmount = 5.0f / 3.0f;
			break;
		case Ratio._16x10:
			ratioAmount = 16.0f / 10.0f;
			break;
		default:
			ratioAmount = 4.0f / 3.0f;	
	}
	
	ScreenSettingsManager.instance.CalculateSettings(ratioAmount);
}
