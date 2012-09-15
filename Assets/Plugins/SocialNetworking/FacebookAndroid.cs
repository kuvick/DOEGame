using UnityEngine;
using System.Collections;
using System.Collections.Generic;


#if UNITY_ANDROID
public class FacebookAndroid
{
	private static AndroidJavaObject _facebookPlugin;
	
	
	static FacebookAndroid()
	{
		if( Application.platform != RuntimePlatform.Android )
			return;
		
		// find the plugin instance
		using( var pluginClass = new AndroidJavaClass( "com.prime31.FacebookPlugin" ) )
			_facebookPlugin = pluginClass.CallStatic<AndroidJavaObject>( "instance" );
		
		// on login, set the access token
		FacebookManager.preLoginSucceededEvent += () =>
		{
			Facebook.instance.accessToken = getAccessToken();
		};

	}

	
	// Initializes the Facebook object with your appId.  Returns true if the user is already authenticated.
	public static void init( string appId )
	{
		if( Application.platform != RuntimePlatform.Android )
			return;

		_facebookPlugin.Call( "init", appId );
		Facebook.instance.accessToken = getAccessToken();
	}
	
	
	// Checks to see if the current session is valid
	public static bool isSessionValid()
	{
		if( Application.platform != RuntimePlatform.Android )
			return false;
		
		return _facebookPlugin.Call<bool>( "isSessionValid" );
	}


	// Gets the current access token
	public static string getAccessToken()
	{
		if( Application.platform != RuntimePlatform.Android )
			return string.Empty;
			
		return _facebookPlugin.Call<string>( "getSessionToken" );
	}
	
	
	// Extends the logged in user's access token
	public static void extendAccessToken()
	{
		if( Application.platform != RuntimePlatform.Android )
			return;
			
		_facebookPlugin.Call( "extendAccessToken" );
	}
	

	// Shows the login dialog with specific permissions
	public static void login()
	{
		loginWithRequestedPermissions( new string[] {} );
	}
	
	// for iOS compatibility
	public static void loginWithRequestedPermissions( string[] permissions, string urlSchemeSuffix )
	{
		loginWithRequestedPermissions( permissions );
	}

	public static void loginWithRequestedPermissions( string[] permissions )
	{
		if( Application.platform != RuntimePlatform.Android )
			return;

		var loginMethod = AndroidJNI.GetMethodID( _facebookPlugin.GetRawClass(), "showLoginDialog", "([Ljava/lang/String;)V" );
		AndroidJNI.CallVoidMethod( _facebookPlugin.GetRawObject(), loginMethod, AndroidJNIHelper.CreateJNIArgArray( new object[] { permissions } ) );
	}


	// Logs the user out and invalidates the token
	public static void logout()
	{
		if( Application.platform != RuntimePlatform.Android )
			return;
			
		_facebookPlugin.Call( "logout" );
		Facebook.instance.accessToken = string.Empty;
	}


	// Shows the Facebook post message dialog
	public static void showPostMessageDialog()
	{
		showDialog( "stream.publish", null );
	}


	// Shows the Facebook post message dialog with additional options.  Pass null or string.empty for those that you do not want to include
	public static void showPostMessageDialogWithOptions( string link, string linkName, string linkToImage, string caption )
	{
		var parameters = new Dictionary<string,string>
		{
			{ "link", link },
			{ "name", linkName },
			{ "picture", linkToImage },
			{ "caption", caption }
		};
		showDialog( "stream.publish", parameters );
	}
	
	
	// Full access to any existing or new Facebook dialogs that get added.  See Facebooks documentation for parameters and dialog types
	public static void showDialog( string dialogType, Dictionary<string,string> parameters )
	{
		if( Application.platform != RuntimePlatform.Android )
			return;

		// load up the Bundle
		using( var bundle = new AndroidJavaObject( "android.os.Bundle" ) )
		{
			var putStringMethod = AndroidJNI.GetMethodID( bundle.GetRawClass(), "putString", "(Ljava/lang/String;Ljava/lang/String;)V" );
			var args = new object[2];
			
			// add all our dictionary elements into the Bundle
			if( parameters != null )
			{
				foreach( var kv in parameters  )
				{
					args[0] = new AndroidJavaObject( "java.lang.String", kv.Key );
					args[1] = new AndroidJavaObject( "java.lang.String", kv.Value );
					AndroidJNI.CallVoidMethod( bundle.GetRawObject(), putStringMethod, AndroidJNIHelper.CreateJNIArgArray( args ) );
				}
			}
			
			// call off to java land
			_facebookPlugin.Call( "showDialog", dialogType, bundle );
		}
	}


	// Calls a custom Rest API method with the key/value pairs in the Dictionary.  Pass in a null dictionary if no parameters are needed.
	public static void restRequest( string restMethod, string httpMethod, Dictionary<string,string> parameters )
	{
		if( Application.platform != RuntimePlatform.Android )
			return;
		
		// add in the method
		if( parameters == null )
			parameters = new Dictionary<string, string>();
		parameters.Add( "method", restMethod );
		
		// load up the Bundle
		using( var bundle = new AndroidJavaObject( "android.os.Bundle" ) )
		{
			var putStringMethod = AndroidJNI.GetMethodID( bundle.GetRawClass(), "putString", "(Ljava/lang/String;Ljava/lang/String;)V" );
			var args = new object[2];
			
			// add all our dictionary elements into the Bundle
			foreach( var kv in parameters  )
			{
				args[0] = new AndroidJavaObject( "java.lang.String", kv.Key );
				args[1] = new AndroidJavaObject( "java.lang.String", kv.Value );
				AndroidJNI.CallVoidMethod( bundle.GetRawObject(), putStringMethod, AndroidJNIHelper.CreateJNIArgArray( args ) );
			}
			
			// call off to java land
			_facebookPlugin.Call( "restRequest", httpMethod, bundle );
		}
	}
	
	
	// Calls a custom Graph API method with the key/value pairs in the Dictionary.  Pass in a null dictionary if no parameters are needed.
	public static void graphRequest( string graphPath, string httpMethod, Dictionary<string,string> parameters )
	{
		if( Application.platform != RuntimePlatform.Android )
			return;
		
		// load up the Bundle
		using( var bundle = new AndroidJavaObject( "android.os.Bundle" ) )
		{
			var putStringMethod = AndroidJNI.GetMethodID( bundle.GetRawClass(), "putString", "(Ljava/lang/String;Ljava/lang/String;)V" );
			var args = new object[2];
			
			// add all our dictionary elements into the Bundle
			if( parameters != null )
			{
				foreach( var kv in parameters  )
				{
					args[0] = new AndroidJavaObject( "java.lang.String", kv.Key );
					args[1] = new AndroidJavaObject( "java.lang.String", kv.Value );
					AndroidJNI.CallObjectMethod( bundle.GetRawObject(), putStringMethod, AndroidJNIHelper.CreateJNIArgArray( args ) );
				}
			}
			
			// call off to java land
			_facebookPlugin.Call( "graphRequest", graphPath, httpMethod, bundle );
		}
	}


}
#endif
