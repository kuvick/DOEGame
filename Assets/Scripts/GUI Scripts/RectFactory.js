#pragma strict
/****************************************************************************************************************
	RectFactory.js
		Will be responible for creating rectangles for gui purposes.
		It will convert any given points into actual screen points to account for any bars that are added
		then it will give them a height and width acording to the actual scaled screen dimensions.
		
		Exposes the following functions:
			Rect NewRect(float topLeftX, float topLeftY)
			Rect NewRect(float topLeftX, float topLeftY, float screenWidthPercent, float screenHeightPercent)
			
		
		Email issues to Jared Mavis - jmavis@ucsc.edu
****************************************************************************************************************/

// The standard height and width of all rectangles when a new rectangle's dimensions are not specified 
public static var standardWidthPercent : float = .25;
public static var standardHeightPercent : float = .1;

/*
	Rect NewRect(float topLeftX, float topLeftY)
		Will return a new rectange with the given top left point and with standard rectangle width and height
		as a percentage of the remaining screen dimensions

	Called if there are no sizes given to the NewRect function
*/
public static function NewRect(_topLeftX : float, _topLeftY : float) : Rect{
	return (NewRect(_topLeftX, _topLeftY, standardWidthPercent, standardHeightPercent));
}

/*
	Rect NewRect(float topLeftX, float topLeftY, float screenWidthPercent, float screenHeightPercent)
		Will return a new rectange with the given top left point and with the given height and width as a
		percentage of the actual remaining screen dimensions
*/
public static function NewRect(_topLeftX : float, _topLeftY : float, _screenWidthPercent : float, _screenHeightPercent : float) : Rect{
	// Retrieve Values from the screen settings manager
	var screenWidth : float = ScreenSettingsManager.instance.screenWidth;
	var screenHeight : float = ScreenSettingsManager.instance.screenHeight;
	var horizontalBarHeight : float = ScreenSettingsManager.instance.horizontalBarHeight;
	var verticalBarWidth : float = ScreenSettingsManager.instance.verticalBarWidth;
	
	// Add on any bar size to the given top left coordinate
	var shiftedTopLeftX = _topLeftX + verticalBarWidth;
	var shiftedTopLeftY = _topLeftY + horizontalBarHeight;
	
	var rectWidth = screenWidth * _screenWidthPercent;
	var rectHeight = screenHeight * _screenHeightPercent;
	
	return (new Rect(shiftedTopLeftX, shiftedTopLeftY, rectWidth, rectHeight));
}