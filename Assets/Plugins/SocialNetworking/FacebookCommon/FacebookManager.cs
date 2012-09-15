using UnityEngine;
using System;
using System.Collections.Generic;
using System.Collections;


public class FacebookManager : MonoBehaviour
{
#if UNITY_ANDROID || UNITY_IPHONE
	// Fired after a successful login attempt was made
	public static event Action loginSucceededEvent;
	
	// Fired just before the login succeeded event. For interal use only.
	public static event Action preLoginSucceededEvent;
	
	// Fired when an error occurs while logging in
	public static event Action<string> loginFailedEvent;
	
	// Fired when the user logs out
	public static event Action loggedOutEvent;
	
	// Fired when the access token is extended. Returns the date that the new token will expire
	public static event Action<DateTime> accessTokenExtendedEvent;
	
	// Fired when the access token fails to be extended
	public static event Action failedToExtendTokenEvent;
	
	// Fired when the session is invalidated
	public static event Action sessionInvalidatedEvent;
	
	// Fired when the post message or custom dialog completes
	public static event Action dialogCompletedEvent;
	
	// Fired when the post message or custom dialog fails
	public static event Action<string> dialogFailedEvent;
	
	// Fired when the post message or a custom dialog does not complete
	public static event Action dialogDidNotCompleteEvent;
	
	// Fired when a custom dialog completes with the url passed back from the dialog
	public static event Action<string> dialogCompletedWithUrlEvent;
	
	// Fired when a rest request finishes
	public static event Action<object> customRequestReceivedEvent;
	
	// Fired when a rest request fails
	public static event Action<string> customRequestFailedEvent;
	
	// Fired when the Facebook composer completes. True indicates success and false cancel/failure.
	public static event Action<bool> facebookComposerCompletedEvent;
	

    void Awake()
    {
		// Set the GameObject name to the class name for easy access from Obj-C
		gameObject.name = this.GetType().ToString();
		DontDestroyOnLoad( this );
    }



	public void facebookLoginSucceeded( string empty )
	{
		if( preLoginSucceededEvent != null )
			preLoginSucceededEvent();
		
		if( loginSucceededEvent != null )
			loginSucceededEvent();
	}
	
	
	public void facebookLoginDidFail( string error )
	{
		if( loginFailedEvent != null )
			loginFailedEvent( error );
	}
	
	
	public void facebookDidLogout( string empty )
	{
		if( loggedOutEvent != null )
			loggedOutEvent();
	}
	
	
	public void facebookDidExtendToken( string secondsSinceEpoch )
	{
		if( accessTokenExtendedEvent != null )
		{
			var seconds = double.Parse( secondsSinceEpoch );
			var intermediate = new DateTime( 1970, 1, 1, 0, 0, 0, DateTimeKind.Utc );
			var date = intermediate.AddSeconds( seconds );
			accessTokenExtendedEvent( date );
		}
	}
	
	
	public void facebookFailedToExtendToken( string empty )
	{
		if( failedToExtendTokenEvent != null )
			failedToExtendTokenEvent();
	}

	
	public void facebookSessionInvalidated( string empty )
	{
		if( sessionInvalidatedEvent != null )
			sessionInvalidatedEvent();
	}
	
	
	public void facebookDialogDidComplete( string empty )
	{
		if( dialogCompletedEvent != null )
			dialogCompletedEvent();
	}
	
	
	public void facebookDialogDidCompleteWithUrl( string url )
	{
		if( dialogCompletedWithUrlEvent != null )
			dialogCompletedWithUrlEvent( url );
	}


	public void facebookDialogDidNotComplete( string empty )
	{
		if( dialogDidNotCompleteEvent != null )
			dialogDidNotCompleteEvent();
	}
	
	
	public void facebookDialogDidFailWithError( string error )
	{
		if( dialogFailedEvent != null )
			dialogFailedEvent( error );
	}


	public void facebookDidReceiveCustomRequest( string result )
	{
		if( customRequestReceivedEvent != null )
		{
			object obj = Prime31.MiniJSON.jsonDecode( result );
			customRequestReceivedEvent( obj );
		}
	}
	
	
	public void facebookCustomRequestDidFail( string error )
	{
		if( customRequestFailedEvent != null )
			customRequestFailedEvent( error );
	}
	
	
	public void facebookComposerCompleted( string result )
	{
		if( facebookComposerCompletedEvent != null )
			facebookComposerCompletedEvent( result == "1" );
	}

#endif
}