using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using Prime31;


public class Facebook : P31RestKit
{
	public string accessToken;
	public string appAccessToken;
	
	
	private static Facebook _instance = null;
	public static Facebook instance
	{
		get
		{
			if( _instance == null )
				_instance = new Facebook();

			return _instance;
		}
	}
	
	
	public Facebook()
	{
		_baseUrl = "https://graph.facebook.com/";
		forceJsonResponse = true;
	}

	
	
	#region Private
	
	protected override IEnumerator send( string path, HTTPVerb httpVerb, Dictionary<string,object> parameters, Action<string, object> onComplete )
	{
		if( parameters == null )
			parameters = new Dictionary<string, object>();
		
		// add the access token if we dont have one in the dictionary
		if( !parameters.ContainsKey( "access_token" ) )
			parameters.Add( "access_token", accessToken );
		
		return base.send( path, httpVerb, parameters, onComplete );
	}
	
	#endregion
	
	
	#region Public
	
	// Sends off a graph request. The completion handler will return a Hashtable or Arraylist if successful depending on the path called.
	// See Facebook's documentation for the returned data and parameters
	public void graphRequest( string path, Action<string, object> completionHandler )
	{
		get( path, null, completionHandler );
	}
	
	
	public void graphRequest( string path, HTTPVerb verb, Action<string, object> completionHandler )
	{
		graphRequest( path, verb, null, completionHandler );
	}
	
	
	public void graphRequest( string path, HTTPVerb verb, Dictionary<string, object> parameters, Action<string, object> completionHandler )
	{
		surrogateMonobehaviour.StartCoroutine( send( path, verb, parameters, completionHandler ) );
	}
	
	#endregion
	
	
	#region Graph API Examples
	
	// Posts the message to the user's wall
    public void postMessage( string message, Action<string, object> completionHandler )
    {
		var parameters = new Dictionary<string,object>
		{
			{ "message", message }
		};
		post( "me/feed", parameters, completionHandler );
    }
	
	
	// Posts the message to the user's wall with a link and a name for the link
    public void postMessageWithLink( string message, string link, string linkName, Action<string, object> completionHandler )
    {
		var parameters = new Dictionary<string,object>
		{
			{ "message", message },
			{ "link", link },
			{ "name", linkName }
		};
		post( "me/feed", parameters, completionHandler );
    }
	

	// Posts the message to the user's wall with a link, a name for the link, a link to an image and a caption for the image
    public void postMessageWithLinkAndLinkToImage( string message, string link, string linkName, string linkToImage, string caption, Action<string, object> completionHandler )
    {
		var parameters = new Dictionary<string,object>
		{
			{ "message", message },
			{ "link", link },
			{ "name", linkName },
			{ "picture", linkToImage },
			{ "caption", caption }
		};
		post( "me/feed", parameters, completionHandler );
    }
	

	// Posts an image on the user's wall along with a caption.
    public void postImage( byte[] image, string message, Action<string, object> completionHandler )
    {
		var parameters = new Dictionary<string,object>()
		{
			{ "picture", image },
			{ "message", message  }
		};
		post( "me/photos", parameters, completionHandler );
    }
	

	// Posts an image to a specific album along with a caption.
    public void postImageToAlbum( byte[] image, string caption, string albumId, Action<string, object> completionHandler )
    {
		var parameters = new Dictionary<string,object>()
		{
			{ "picture", image },
			{ "message", caption  }
		};
		post( albumId, parameters, completionHandler );
    }

	
	// Sends a request to fetch the currently logged in users friends
    public void getFriends( Action<string, object> completionHandler )
    {
		get( "me/friends", completionHandler );
    }

	#endregion
	
	
	#region App Access Token
	
	// Fetches the app access token
	public void getAppAccessToken( string appId, string appSecret, Action<string> completionHandler )
	{
		var parameters = new Dictionary<string,object>()
		{
			{ "client_id", appId },
			{ "client_secret", appSecret },
			{ "grant_type", "client_credentials" }
		};
		
		get( "oauth/access_token", parameters, ( error, obj ) =>
		{
			if( obj is string )
			{
				var text = obj as string;
				if( text.StartsWith( "access_token=" ) )
				{
					appAccessToken = text.Replace( "access_token=", string.Empty );
					completionHandler( appAccessToken );
				}
				else
				{
					completionHandler( null );
				}
			}
			else
			{
				completionHandler( null );
			}
		});
	}
	
	
	// Posts a score for your app
	public void postScore( string userId, int score, Action<bool> completionHandler )
	{
		if( appAccessToken == null )
		{
			Debug.Log( "you must first retrieve the app access token before posting a score" );
			completionHandler( false );
			return;
		}
		
		if( userId == null )
		{
			Debug.Log( "a valid userId is required to post a score" );
			completionHandler( false );
			return;
		}
		
		// post the score to the proper path
		var path = userId + "/scores";
		var parameters = new Dictionary<string,object>()
		{
			{ "score", score.ToString() },
			{ "app_access_token", appAccessToken },
			{ "access_token", appAccessToken }
		};
		
		post( path, parameters, ( error, obj ) =>
		{
			if( error == null && obj is bool )
			{
				var result = (bool)obj;
				completionHandler( result );
			}
			else
			{
				completionHandler( false );
			}
		});
	}
	
	
	// Retrieves the scores for your app
	public void getScores( string userId, Action<string, object> onComplete )
	{
		var path = userId + "/scores";
		get( path, onComplete );
	}
	
	#endregion
	
}