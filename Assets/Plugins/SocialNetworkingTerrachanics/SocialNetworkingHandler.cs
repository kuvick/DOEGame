using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Prime31;

public class SocialNetworkingHandler : MonoBehaviour {
	#if UNITY_IPHONE || UNITY_ANDROID
	// Use this for initialization
	void Start () {
	
	}

	void OnEnable()
	{
		FacebookManager.sessionOpenedEvent += FacebookLoginEvent;
		FacebookManager.reauthorizationSucceededEvent += FacebookReathorizeEvent;
		TwitterManager.loginSucceededEvent += TwitterLoginEvent;
	}

	void OnDisable()
	{
		FacebookManager.sessionOpenedEvent -= FacebookLoginEvent;
		FacebookManager.reauthorizationSucceededEvent -= FacebookReathorizeEvent;
		TwitterManager.loginSucceededEvent -= TwitterLoginEvent;
	}
	#endif

	// common event handler used for all Facebook graph requests that logs the data to the console
	void completionHandler( string error, object result )
	{
		if( error != null )
			Debug.LogError( error );
		else
			Prime31.Utils.logObject( result );
	}

	public void Initialize()
	{
		#if UNITY_ANDROID
		FacebookAndroid.init(false);
		TwitterAndroid.init( "atsVn98cE4BN2Od6Dqr8SaIGF", "HBXXCCOtXHUf0YPDZACy15X0jUERtgUAZBPr7edhKtoQTi3zmk" );
		#endif
		#if UNITY_IPHONE
		FacebookBinding.init();
		TwitterBinding.init( "atsVn98cE4BN2Od6Dqr8SaIGF", "HBXXCCOtXHUf0YPDZACy15X0jUERtgUAZBPr7edhKtoQTi3zmk" );
		#endif
	}

	public void HandleFacebook()
	{
		Application.CaptureScreenshot( "score.png" );
		#if UNITY_ANDROID
		if (!FacebookAndroid.isSessionValid())
			FacebookAndroid.login();//WithPublishPermissions( new string[] { "publish_actions" } );
		else
			PostFacebook ();
		#endif
		#if UNITY_IPHONE
		if (!FacebookBinding.isSessionValid())
		{
			var permissions = new string[] { "email" };
			FacebookBinding.login();//WithReadPermissions( permissions );
		}
		else
			PostFacebook ();
		#endif
	}

	public void PostFacebook()
	{
		#if UNITY_ANDROID
		if (FacebookAndroid.isSessionValid())
		{
			/*var pathToImage = Application.persistentDataPath + "/" + "score.png";
			var bytes = System.IO.File.ReadAllBytes( pathToImage );*/
			//Facebook.instance.postImage( bytes, "im an image posted from Android", completionHandler );
			var parameters = new Dictionary<string,string>
			{
				{ "link", "https://play.google.com/store/apps/details?id=gov.doe.Terrachanics" },
				{ "name", "Terrachanics" },
				{ "picture", "https://lh4.ggpht.com/0QYIvg5ePEu9OKFXydpp0jJVbywtq1fDwkZGFrAOA7hqBONRRQQFoTtvuTlwGy_8qZHP=w300-rw" },
				{ "caption", "I scored in Terrachanics!" },
			};
			FacebookAndroid.showDialog( "stream.publish", parameters );
		}
		#endif
		#if UNITY_IPHONE
		if (FacebookBinding.isSessionValid())
		{
			/*var pathToImage = Application.persistentDataPath + "/" + "score.png";
			var bytes = System.IO.File.ReadAllBytes( pathToImage );*/
			//Facebook.instance.postImage( bytes, "im an image posted from iOS", completionHandler );
			var parameters = new Dictionary<string,string>
			{
				{ "link", "https://play.google.com/store/apps/details?id=gov.doe.Terrachanics" },
				{ "name", "Terrachanics" },
				{ "picture", "https://lh4.ggpht.com/0QYIvg5ePEu9OKFXydpp0jJVbywtq1fDwkZGFrAOA7hqBONRRQQFoTtvuTlwGy_8qZHP=w300-rw" },
				{ "caption", "I scored in Terrachanics!" },
			};
			FacebookBinding.showDialog( "stream.publish", parameters );
		}
		#endif
	}

	void FacebookLoginEvent()
	{
		PostFacebook();
		#if UNITY_ANDROID

		#endif
		#if UNITY_IPHONE
		/*if (!FacebookBinding.getSessionPermissions().Contains( "publish_actions" ))
		{
			var permissions = new string[] { "publish_actions" };
			FacebookBinding.reauthorizeWithPublishPermissions( permissions, FacebookSessionDefaultAudience.Everyone );
		}
		else
			PostFacebook();*/
		#endif
		Debug.Log( "Successfully logged in to Facebook" );
	}

	void FacebookReathorizeEvent()
	{
		PostFacebook();
		Debug.Log( "Successfully reauthorized in Facebook" );
	}

	public void HandleTwitter()
	{
		Application.CaptureScreenshot( "score.png" );
		#if UNITY_ANDROID
		if (!TwitterAndroid.isLoggedIn())
		{
			TwitterAndroid.showLoginDialog();
		}
		else
			PostTwitter ();
		#endif
		#if UNITY_IPHONE
		if (!TwitterBinding.isLoggedIn())
		{
			TwitterBinding.showLoginDialog();
		}
		else
			PostTwitter ();
		#endif
	}

	public void PostTwitter()
	{
		#if UNITY_ANDROID
		if (TwitterAndroid.isLoggedIn())
		{
			var pathToImage = Application.persistentDataPath + "/" + "score.png";
			var bytes = System.IO.File.ReadAllBytes( pathToImage );
			
			TwitterAndroid.postStatusUpdate( "I scored in #Terrachanics!", bytes );
		}
		#endif
		#if UNITY_IPHONE
		if (TwitterBinding.isLoggedIn())
		{
			var pathToImage = Application.persistentDataPath + "/" + "score.png";
			
			TwitterBinding.postStatusUpdate( "I scored in #Terrachanics!", pathToImage );
		}
		#endif
	}

	void TwitterLoginEvent(string username)
	{
		Debug.Log( "Successfully logged in to Twitter" );
		PostTwitter ();
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
