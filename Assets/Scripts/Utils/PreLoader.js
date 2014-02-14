// Preloader for if on Android device and need to download OBB expansion file
// Example taken from this post: 
// http://forum.unity3d.com/threads/208869-Not-possible-to-upload-expansion-OBB-files-to-Google-Play/page2?p=1424452&viewfull=1#post1424452
#pragma strict

public var uitext : GUIText;

function Start () {
	#if (!UNITY_ANDROID)
		Application.LoadLevel (1);
		return;
	#endif
	
	var expPath : String = GooglePlayDownloader.GetExpansionFilePath();

	if (expPath == null)
	{
	    StartCoroutine(NoStorageX());
    }
    else
    {
    	var mainPath : String = GooglePlayDownloader.GetMainOBBPath(expPath);
    	
    	if (mainPath != null) 
    	{ 
    		Application.LoadLevel (1);
    		return;
    	}
    	else
    	{
      		uitext.text = "Need to Download Media. Please Stay Connected!";
      		uitext.material.color = Color.white;
			
      		StartCoroutine(LoadMyLevel());  
        } 
	}
}

private function LoadMyLevel() {

    var expPath : String = GooglePlayDownloader.GetExpansionFilePath();

    var mainPath : String = GooglePlayDownloader.GetMainOBBPath(expPath);

    yield WaitForSeconds(1.5f);

    GooglePlayDownloader.FetchOBB();

    while( mainPath == null)
    {
      mainPath = GooglePlayDownloader.GetMainOBBPath(expPath);
      yield WaitForSeconds(0.5f);
    }

    if (mainPath != null)
    	Application.LoadLevel(1);
}

 

private function NoStorageX() {

	uitext.text = "No Storage is Available! Please insert SD-Card";
	uitext.material.color = Color.red;
	
	yield WaitForSeconds(20);
    Application.Quit();
}

function Update () {

}