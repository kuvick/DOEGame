var newSkin : GUISkin;
var mapTexture : Texture2D; //will be used eventually when art is available
var levelNames: String[]; //input names into the inspector panel to create buttons for the levels
var levelsPerRow : int = 5;
var levelsCompleted : int; //not sure how you want to integrate this into the full game but for
					      //now levelsUnlocked is how you test locking and unlocking levels
					  

@HideInInspector
var numberOfLevels : int;

function Start() {

	numberOfLevels = levelNames.length;
	PlayerPrefs.SetInt("currentLevel", levelsCompleted); //Just get rid of this and move the functionality into whatever script determines level completion
	}

function levelSelectMenu() {

	var nextLevel = PlayerPrefs.GetInt("currentLevel") +1;
	var horizOffsetAmount = 500;
	var vertOffsetAmount = 300;
	var numberDone = 0; //Counts up to 5 GUI boxes then resets and moves everything down

	for	(var i = 1; i <= numberOfLevels; i++){
	
		if (numberDone >= levelsPerRow){
			vertOffsetAmount -= 150;
			horizOffsetAmount = 500;
			numberDone = 0;
		}
	
		GUI.BeginGroup(Rect((Screen.width / 2) - horizOffsetAmount,(Screen.height / 2) - vertOffsetAmount, 250, 250));
    
    		GUI.Box(Rect(90, 120, 120, 20), "" + levelNames[i-1]);

			if (i <= nextLevel) {
   		 		if(GUI.Button(Rect(100, 20, 100, 100), "Graphic Here")) { //Replace "" with mapTexture when assets available
    				Application.LoadLevel(i); //Automatically assigns each button to scene 1-numberOfLevels
   			   }
   			}else{
   				GUI.Box(Rect(100, 20, 100, 100), "Locked");
   		
   			}  	    
    	GUI.EndGroup();
    	
    horizOffsetAmount -= 150; 
    numberDone++;	

	} 	
	
    if(GUI.Button(Rect(Screen.width-1000, Screen.height-100, 60, 40), "<- Menu")) {
   		Application.LoadLevel(0); //This is assuming that the main menu will be scene 0
    } 
      
}

function OnGUI () { 
    GUI.skin = newSkin;    
    levelSelectMenu();
}