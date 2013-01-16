#pragma strict

// The desired ratio
enum Ratio {_4x3, _3x2, _16x9, _5x3, _16x10};

public var wantedScreenRatio : Ratio;

function Awake () {
	var ratioAmount : float = ConvertRatio(wantedScreenRatio);
	
	ScreenSettingsManager.instance.CalculateSettings(ratioAmount);
}

function ConvertRatio(setRatio : Ratio){
	switch (setRatio){
		case Ratio._4x3:
			return(4.0f / 3.0f);
		case Ratio._3x2:
			return(3.0f / 2.0f);
		case Ratio._16x9:
			return(16.0f / 9.0f);
		case Ratio._5x3:
			return(5.0f / 3.0f);
		case Ratio._16x10:
			return(16.0f / 10.0f);
		default:
			return(4.0f / 3.0f);	
	}
}