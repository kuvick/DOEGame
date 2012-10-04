#pragma strict

/*
	FacebookProtocol.js
		Will interface between the game and the facebook api to:
			Log the user in
			Log the user out
			Initialize the api
			Post scores to facebook
	Email issues to Jared Mavis (jmavis@ucsc.edu)
*/


// this code will only work when used on android so check to not cause errors when working on other devices
#if UNITY_ANDROID
static var APP_ID : String = "267632503355296"; // the unique id given by facebook for our application
static var siteLink : String = "http://doe.gov"; // the site that the post will link to
static var siteCaption : String = "DOE official site"; // the title of the link above
static var siteImage : String = "http://prime31.com/assets/images/banners/tweetsBannerLogo.png"; // the image assosiated with the post
static var permisions : String[] = ["publish_stream"]; // the permission that the user will need to give the app when asked
static var hasInitialized : boolean = false;
static var hasLoggedIn : boolean = false;

function Start(){
	//Init();
}

// Initializes the facebook plugin
static function Init () {
	if (InternetConnection.isConnected()){
		FacebookAndroid.init( APP_ID );
		hasInitialized = true;
		Debug.Log("FacebookProtocol : initialized");
	} else {
		Debug.Log("FacebookProtocol : no internet connection");
	}
}

static function PostAchievmentToFacebook(achievment:String, description:String){
	var comment : String = "I just earned " + achievment + " for " + description + ".";
	if (hasLoggedIn){
		PostComment(comment);
	} else {
		Debug.Log("FacebookProtocol : needed to log in");
		Login();
		PostComment(comment);
	}
}

// Creates a dialog with the given score and level included in a facebok post.
// the user has a choice to add some to the post
static function PostScoreToFacebook(score:int, level:String){
	var comment : String = "I just scored " + score + " points on " + level + ". Beat that!";
	if (hasLoggedIn){
		PostComment(comment);
	} else {
		Debug.Log("FacebookProtocol : needed to log in");
		Login();
		//PostComment(comment);
	}
}

private static function PostComment(comment:String){
	FacebookAndroid.showPostMessageDialogWithOptions(siteLink, siteCaption, siteImage, comment);	
}

// Does appropriate tests then pops up a dialog to allow the user to login and give the app necessary permissions
static function Login(){
	if (!hasInitialized){
		Debug.Log("FacebookProtocol : needed to initialize");
		Init();
	}
	if (InternetConnection.isConnected()){
		FacebookAndroid.loginWithRequestedPermissions(permisions);
		hasLoggedIn = true;
		Debug.Log("FacebookProtocol : logged in");
	} else {
		Debug.Log("FacebookProtocol : no internet connection");
	}
}
#endif