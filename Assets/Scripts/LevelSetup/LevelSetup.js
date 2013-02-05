#pragma strict

// The desired ratio
enum Ratio {_4x3, _3x2, _16x9, _5x3, _16x10};

public var wantedScreenRatio : Ratio;

function Awake() {
	var ratioAmount : float = ConvertRatio(wantedScreenRatio);
	
	ScreenSettingsManager.instance.CalculateSettings(ratioAmount);
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