using UnityEngine;
using System.Collections;


public class FacebookEventListener : MonoBehaviour
{
#if UNITY_IPHONE || UNITY_ANDROID
	// Listens to all the events.  All event listeners MUST be removed before this object is disposed!
	void OnEnable()
	{
		FacebookManager.loginSucceededEvent += facebookLogin;
		FacebookManager.loginFailedEvent += facebookLoginFailed;
		FacebookManager.loggedOutEvent += facebookDidLogoutEvent;
		FacebookManager.accessTokenExtendedEvent += facebookDidExtendTokenEvent;
		FacebookManager.sessionInvalidatedEvent += facebookSessionInvalidatedEvent;

		FacebookManager.dialogCompletedEvent += facebokDialogCompleted;
		FacebookManager.dialogCompletedWithUrlEvent += facebookDialogCompletedWithUrl;
		FacebookManager.dialogDidNotCompleteEvent += facebookDialogDidntComplete;
		FacebookManager.dialogFailedEvent += facebookDialogFailed;
		FacebookManager.customRequestReceivedEvent += facebookReceivedCustomRequest;
		FacebookManager.customRequestFailedEvent += facebookCustomRequestFailed;
		FacebookManager.facebookComposerCompletedEvent += facebookComposerCompletedEvent;
	}

	
	void OnDisable()
	{
		// Remove all the event handlers when disabled
		FacebookManager.loginSucceededEvent -= facebookLogin;
		FacebookManager.loginFailedEvent -= facebookLoginFailed;
		FacebookManager.loggedOutEvent -= facebookDidLogoutEvent;
		FacebookManager.accessTokenExtendedEvent -= facebookDidExtendTokenEvent;
		FacebookManager.sessionInvalidatedEvent -= facebookSessionInvalidatedEvent;

		FacebookManager.dialogCompletedEvent -= facebokDialogCompleted;
		FacebookManager.dialogCompletedWithUrlEvent -= facebookDialogCompletedWithUrl;
		FacebookManager.dialogDidNotCompleteEvent -= facebookDialogDidntComplete;
		FacebookManager.dialogFailedEvent -= facebookDialogFailed;
		FacebookManager.customRequestReceivedEvent -= facebookReceivedCustomRequest;
		FacebookManager.customRequestFailedEvent -= facebookCustomRequestFailed;
		FacebookManager.facebookComposerCompletedEvent -= facebookComposerCompletedEvent;
	}

	

	void facebookLogin()
	{
		Debug.Log( "Successfully logged in to Facebook" );
	}
	
	
	void facebookLoginFailed( string error )
	{
		Debug.Log( "Facebook login failed: " + error );
	}
	
	
	void facebookDidLogoutEvent()
	{
		Debug.Log( "facebookDidLogoutEvent" );
	}
	
	
	void facebookDidExtendTokenEvent( System.DateTime newExpiry )
	{
		Debug.Log( "facebookDidExtendTokenEvent: " + newExpiry );
	}
	
	
	void facebookSessionInvalidatedEvent()
	{
		Debug.Log( "facebookSessionInvalidatedEvent" );
	}

	
	void facebokDialogCompleted()
	{
		Debug.Log( "facebokDialogCompleted" );
	}
	
	
	void facebookDialogCompletedWithUrl( string url )
	{
		Debug.Log( "facebookDialogCompletedWithUrl: " + url );
	}
	
	
	void facebookDialogDidntComplete()
	{
		Debug.Log( "facebookDialogDidntComplete" );
	}
	
	
	void facebookDialogFailed( string error )
	{
		Debug.Log( "facebookDialogFailed: " + error );
	}
	
	
	void facebookReceivedCustomRequest( object obj )
	{
		Debug.Log( "facebookReceivedCustomRequest" );
	}
	
	
	void facebookCustomRequestFailed( string error )
	{
		Debug.Log( "facebookCustomRequestFailed failed: " + error );
	}
	

	void facebookComposerCompletedEvent( bool didSucceed )
	{
		Debug.Log( "facebookComposerCompletedEvent did succeed: " + didSucceed );
	}

#endif
}
