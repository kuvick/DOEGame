#pragma strict
/// Utils.js
/// Provides misc functions to be used throughout the game

// exits game and calls necessary functions
public static function QuitGame()
{
	#if (!UNITY_WEBPLAYER)
	MetricContainer.SaveSessionData(Path.Combine(Application.persistentDataPath, "Metrics/Session/"));
	MetricContainer.SaveGeneralData(Path.Combine(Application.persistentDataPath, "Metrics/"));
	#endif
	Application.Quit();
}

/// Will return the width and height in percentages of what the texture should be so that it is not distorted
public static function CalcTextureDimensionsWithDesiredHeight(texture : Texture2D, desiredHeightAsPercentage : float) : Vector2{
	// check if using the desired height we would stretch the asset
	if (desiredHeightAsPercentage * ScreenSettingsManager.screenHeight > texture.height){
		// if it would be stretched then make it at large as possible without distortion
		desiredHeightAsPercentage = texture.height / ScreenSettingsManager.screenHeight;
	}
	
	var assetRatio : float = parseFloat(texture.height) / parseFloat(texture.width);
	
	var widthPercentage : float = ((desiredHeightAsPercentage * ScreenSettingsManager.screenHeight) / assetRatio) / ScreenSettingsManager.screenWidth;
	return (new Vector2(widthPercentage, desiredHeightAsPercentage));
}

/// Will return the width and height in percentages of what the texture should be so that it is not distorted
public static function CalcTextureDimensionsWithDesiredWidth(texture : Texture2D, desiredWidthAsPercentage : float) : Vector2{
	// check if using the desired height we would stretch the asset
	if (desiredWidthAsPercentage * ScreenSettingsManager.screenWidth > texture.width){
		// if it would be stretched then make it at large as possible without distortion
		desiredWidthAsPercentage = texture.width / ScreenSettingsManager.screenWidth;
	}
	var assetRatio : float = parseFloat(texture.width) / parseFloat(texture.height);
	var heightPercentage : float = ((desiredWidthAsPercentage * ScreenSettingsManager.screenWidth) / assetRatio) / ScreenSettingsManager.screenHeight;
	
	return (new Vector2(desiredWidthAsPercentage, heightPercentage));
}

// Converts unrotated xz coordinates to proper coordinates rotated with the camera
public static function ConvertToRotated(toConvert : Vector3) : Vector3
{
	return Vector3(toConvert.x * Mathf.Sin(Mathf.PI * .75) + toConvert.z * Mathf.Cos(Mathf.PI * .75), 
				toConvert.y, toConvert.x * Mathf.Cos(Mathf.PI * .75) - toConvert.z * Mathf.Sin(Mathf.PI * .75));
}

// Scales down the font size to fit within the given Rectangle
public static function ScaleFontSize(txt : String, style : GUIStyle, width : float, height : float) : float
{
	var fontSize : float = style.fontSize;
	var content : GUIContent = GUIContent(txt);
	if (style.CalcHeight(content, width) > height)
	{
		while (style.CalcHeight(content, width) > height)
			style.fontSize *= .9f;
	}
	else
	{
		while (style.CalcHeight(content, width) < height)
			style.fontSize *= 1.1f;
		style.fontSize *= .9f;
	}
	return style.fontSize;
}