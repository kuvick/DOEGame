using UnityEngine;
using System.Collections;

/*
 * ScreenSettingsManager.cs
 * 	Responsible for calulating and storing all dynamically calculated screen settings
 * 
 *  Exposes the following:
 * 		-screenWidth
 * 		-screenHeight
 * 		-verticalBarWidth
 * 		-horizontalBarHeight
 */

public class ScreenSettingsManager : MonoBehaviour {
	// the altered screen width and height according to changes with the resolution
	public static float screenWidth = Screen.width;
	public static float screenHeight = Screen.height;
	
	// the size of each bar that may or may not have been added to accout for a different resolution
	public static float verticalBarWidth = 0;
	public static float horizontalBarHeight = 0;

	private static ScreenSettingsManager ssm_instance = null;
	
	private static bool SettingsCalculated = false;
	
	public static ScreenSettingsManager instance{
		get {			
            if (ssm_instance == null) {
                //  FindObjectOfType(...) returns the first ScreenSettingsManager object in the scene.
                ssm_instance = FindObjectOfType(typeof (ScreenSettingsManager)) as ScreenSettingsManager;
            }
 
            // If it is still null, create a new instance
            if (ssm_instance == null) {
                GameObject obj = new GameObject("ScreenSettingsManager");
                ssm_instance = obj.AddComponent(typeof (ScreenSettingsManager)) as ScreenSettingsManager;
				DontDestroyOnLoad(obj.transform.gameObject);
            }
 
            return ssm_instance;
        }
	}
	
	// will call all apropriate functions to dynamically calculate the screen settings
	public void CalculateSettings(float targetaspect){
		ResolutionManager.instance.InitializeResolutionSettings(targetaspect);
		if (SettingsCalculated == false)
		{
			CalulateScreenDimensions();
			CalculateBarSizes();
			
			SettingsCalculated = true;
		}
	}
	
	// will calulate the screen's width and height with respect to resolution changes
	private static void CalulateScreenDimensions(){
		screenWidth = Screen.width * ResolutionManager.scaleWidth;
		screenHeight = Screen.height * ResolutionManager.scaleHeight;
	}
	
	private static void CalculateBarSizes(){
		verticalBarWidth = Screen.width * ResolutionManager.widthShift;
		horizontalBarHeight = Screen.height * ResolutionManager.heightShift;
	}
	
	void Awake() 
	{
       	 DontDestroyOnLoad(transform.gameObject);
    }
}
