using UnityEngine;
using System.Collections;
using System.IO;
using System;

public class GooglePlayDownloader
{
#if UNITY_ANDROID
	private static AndroidJavaClass detectAndroidJNI;
	private static string PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnE/bUmCTL6kZ8Q5X+DNmENgh8w8gv6aqTg7qxSptpLBxae94FHkorBPg9F7AOvKQjmh9OENulLjQ3kxmvM3aVQQqZz7yq1yoqNvndZ91c/xu1ywsaHUEkvSk2S0Or/Mz5Nf9VOK1SKh64tCn0zmAtc9Jst6yNt7+IeUo83tT3C07g/exny3AF3m0q4x6nFSrvLqkffZbe4HBxYHm1H+JmRMebXHkD0tWzK8A+fbqEQMFDR3DM8vqw34FGADp9CjgnLjeUIAiVYNE6DMfzHPCDBpK45GapGzOlr032GZC8T+amkh9+8rCpHfu3ncNsFTSdHA9TsNWwRtOor9zNriLEQIDAQAB";

	public static bool RunningOnAndroid()
	{
		if (detectAndroidJNI == null)
			detectAndroidJNI = new AndroidJavaClass("android.os.Build");
		return detectAndroidJNI.GetRawClass() != IntPtr.Zero;
	}
	
	private static AndroidJavaClass Environment;
	private const string Environment_MEDIA_MOUNTED = "mounted";

	static GooglePlayDownloader()
	{
		if (!RunningOnAndroid())
			return;

		Environment = new AndroidJavaClass("android.os.Environment");
		
		using (AndroidJavaClass dl_service = new AndroidJavaClass("com.unity3d.plugin.downloader.UnityDownloaderService"))
		{
	    // stuff for LVL -- MODIFY FOR YOUR APPLICATION!
			dl_service.SetStatic("BASE64_PUBLIC_KEY", PUBLIC_KEY);
	    // used by the preference obfuscater
			dl_service.SetStatic("SALT", new byte[]{1, 43, 256-12, 256-1, 54, 98, 256-100, 256-12, 43, 2, 256-8, 256-4, 9, 5, 256-106, 256-108, 256-33, 45, 256-1, 84});
		}
	}
	
	public static string GetExpansionFilePath()
	{
		populateOBBData();

		if (Environment.CallStatic<string>("getExternalStorageState") != Environment_MEDIA_MOUNTED)
			return null;
			
		const string obbPath = "Android/obb";
			
		using (AndroidJavaObject externalStorageDirectory = Environment.CallStatic<AndroidJavaObject>("getExternalStorageDirectory"))
		{
			string root = externalStorageDirectory.Call<string>("getPath");
			return String.Format("{0}/{1}/{2}", root, obbPath, obb_package);
		}
	}
	public static string GetMainOBBPath(string expansionFilePath)
	{
		populateOBBData();

		if (expansionFilePath == null)
			return null;
		string main = String.Format("{0}/main.{1}.{2}.obb", expansionFilePath, obb_version, obb_package);
		if (!File.Exists(main))
			return null;
		return main;
	}
	public static string GetPatchOBBPath(string expansionFilePath)
	{
		populateOBBData();

		if (expansionFilePath == null)
			return null;
		string main = String.Format("{0}/patch.{1}.{2}.obb", expansionFilePath, obb_version, obb_package);
		if (!File.Exists(main))
			return null;
		return main;
	}
	public static void FetchOBB()
	{
		using (AndroidJavaClass unity_player = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
		{
			AndroidJavaObject current_activity = unity_player.GetStatic<AndroidJavaObject>("currentActivity");
	
			AndroidJavaObject intent = new AndroidJavaObject("android.content.Intent",
															current_activity,
															new AndroidJavaClass("com.unity3d.plugin.downloader.UnityDownloaderActivity"));
	
			int Intent_FLAG_ACTIVITY_NO_ANIMATION = 0x10000;
			intent.Call<AndroidJavaObject>("addFlags", Intent_FLAG_ACTIVITY_NO_ANIMATION);
			intent.Call<AndroidJavaObject>("putExtra", "unityplayer.Activity", 
														current_activity.Call<AndroidJavaObject>("getClass").Call<string>("getName"));
			current_activity.Call("startActivity", intent);
	
			if (AndroidJNI.ExceptionOccurred() != System.IntPtr.Zero)
			{
				Debug.LogError("Exception occurred while attempting to start DownloaderActivity - is the AndroidManifest.xml incorrect?");
				AndroidJNI.ExceptionDescribe();
				AndroidJNI.ExceptionClear();
			}
		}
	}
	
	// This code will reuse the package version from the .apk when looking for the .obb
	// Modify as appropriate
	private static string obb_package;
	private static int obb_version = 0;
	private static void populateOBBData()
	{
		if (obb_version != 0)
			return;
		using (AndroidJavaClass unity_player = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
		{
			AndroidJavaObject current_activity = unity_player.GetStatic<AndroidJavaObject>("currentActivity");
			obb_package = current_activity.Call<string>("getPackageName");
			AndroidJavaObject package_info = current_activity.Call<AndroidJavaObject>("getPackageManager").Call<AndroidJavaObject>("getPackageInfo", obb_package, 0);
			obb_version = package_info.Get<int>("versionCode");
		}
	}
#endif
}
