#pragma strict



#if UNITY_ANDROID
static var APP_ID : String = "267632503355296";
static var siteLink : String = "http://doe.gov";
static var siteCaption : String = "DOE official site";
static var siteImage : String = "http://prime31.com/assets/images/banners/tweetsBannerLogo.png";
static var permisions : String[] = ["publish_stream"];


function Start(){
	Init();
}

static function Init () {
	FacebookAndroid.init( APP_ID );
}

static function PostScoreToFacebook(score:int, level:String){
	var comment : String = "I just scored " + score + " points on " + level + ". Beat that!";
	FacebookAndroid.showPostMessageDialogWithOptions(siteLink, siteCaption, siteImage, comment);	
}

static function Login(){
	FacebookAndroid.loginWithRequestedPermissions(permisions);
}
#endif
