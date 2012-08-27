/*using UnityEngine;
using System.Collections;
using LitJson;

public class FacebookInterface : MonoBehaviour {

	// Use this for initialization
	IEnumerator Start () {
		Debug.Log("Start");
		WWW www = new WWW("https://graph.facebook.com/19292868552/");
		yield return www;
	    if (www.error == null)
	    {
	      //Sucessfully loaded the JSON string
	      Debug.Log("Loaded following JSON string" + www.data);
	 
	      //Process books found in JSON file
	      JsonData json = JsonMapper.ToObject(www.data);
			Debug.Log ("company_overview = " + json["company_overview"]);
	    }
	    else
	    {
	      Debug.Log("ERROR: " + www.error);
		}
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
 */
using UnityEngine;
using Facebook;

/*
 * 
 * 
 * 
 */

public class FacebookInterface : MonoBehaviour
{
	public static string MagicToken;
	
	public static string GetUserProperty(string user, string prop)
	{
		try
		{
			FacebookAPI api = new FacebookAPI(MagicToken);
			Facebook.JSONObject request = api.Get("/" + user);
			
			if (!request.Dictionary.ContainsKey(prop)){
				Debug.LogError("Could Not Find : " + prop + " inside of " + user + "'s data");
				return null;
			}
			
			return request.Dictionary[prop].String;
		}
		catch
		{
			Debug.LogError("Could Not Find : " + user);
			return null;
		}
    }
}