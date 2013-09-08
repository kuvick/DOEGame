#pragma strict
/*
	InternetConnection.js
		Will handle detecting internet connections on several devices
	Email issues to Jared Mavis (jmavis@ucsc.edu)
*/

// will return true if the device is connnected to the internet or false otherwise
static function isConnected() : boolean {
#if UNITY_EDITOR
    if (Network.player.ipAddress.ToString() != "127.0.0.1") {
        return(true);       
    }
#endif

#if UNITY_IPHONE
    if (Application.internetReachability != NetworkReachability.NotReachable) {
        return(true); 
    }
#endif

#if UNITY_ANDROID
    if (Application.internetReachability == NetworkReachability.NotReachable) {
        return(true); 
    }
#endif

	return (false);
}