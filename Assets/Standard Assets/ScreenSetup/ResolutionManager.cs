using UnityEngine;
using System.Collections;

/*
 * ResolutionManager.cs
 * 	Responsible for performing relevant calculations for screen resizing to a set aspect ratio
 * 
 */

public class ResolutionManager : MonoBehaviour {
	public static float widthShift = 0; // records the width of any side bars added ot the screen.
	public static float scaleWidth = 1; // record the percentage of the width available after adding side bars
	public static float heightShift = 0; // records the height of any top bars added ot the screen.
	public static float scaleHeight = 1; // record the percentage of the height available after adding top bars
	
	private static ResolutionManager rm_instance = null;
	
	public static ResolutionManager instance{
		get {
            if (rm_instance == null) {
                //  FindObjectOfType(...) returns the first ResolutionManager in the scene.
                rm_instance =  FindObjectOfType(typeof (ResolutionManager)) as ResolutionManager;
            }
 
            // If it is still null, create a new instance
            if (rm_instance == null) {
                GameObject obj = new GameObject("ResolutionManager");
                rm_instance = obj.AddComponent(typeof (ResolutionManager)) as ResolutionManager;
       			DontDestroyOnLoad(obj.transform.gameObject);
            }
 
            return rm_instance;
        }
	}
	
	// Use this for initialization
	public void InitializeResolutionSettings (float targetaspect) {	
		
	    // determine the game window's current aspect ratio
	    float windowaspect = (float)Screen.width / (float)Screen.height;
		
	    // current viewport height should be scaled by this amount
	    scaleHeight = windowaspect / targetaspect;		
	
	    // obtain camera component so we can modify its viewport
	    Camera camera = Camera.main;
	
	    // if scaled height is less than current height, add letterbox
	    if (scaleHeight < 1.0f)
	    {
	        Rect rect = camera.rect;
	
	        rect.width = 1.0f;
	        rect.height = scaleHeight;
	        rect.x = 0;
	        rect.y = (1.0f - scaleHeight) / 2.0f;
			
			heightShift = rect.y;
	        
	        camera.rect = rect;
	    } 
		else // add pillarbox
	    {
	        scaleWidth = 1.0f / scaleHeight;
			scaleHeight = 1;
	
	        Rect rect = camera.rect;
	
	        rect.width = scaleWidth;
	        rect.height = 1.0f;
	        rect.x = (1.0f - scaleWidth) / 2.0f;
	        rect.y = 0;
			
			widthShift = rect.x;
	
	        camera.rect = rect;
	    }
	}
}