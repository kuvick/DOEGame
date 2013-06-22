#pragma strict
/// Utils.js
/// Provides misc functions to be used throughout the game


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