#pragma strict

public class FailureMenu extends GUIControl{	
	//The Bounds for the recangles
	private var retryLevelButtonRect : Rect;
	private var quitButtonRect : Rect;
	private var levelSelectButtonRect : Rect;
	
	private var missionFailedTextLabelRect : Rect;

	public var failureScreenSkin:GUISkin;
	public var background : Texture;

	//need to replace text with GUI texture (if needed)
	private var scoreStrings : String[] = ["Restart", "Level Select", "Quit"];

	public function Initialize(){
		super.Initialize();
		
		SetupButtons();
	}
	
	public function Render(){   
		GUI.skin = failureScreenSkin;
		GUI.DrawTexture(RectFactory.NewRect(0,0,1,1), background);
		
		GUI.Label(missionFailedTextLabelRect, "MISSION FAILED");
		
		//Retry Level Button
		if(GUI.Button(retryLevelButtonRect, scoreStrings[0]))
		{
			Application.LoadLevel(Application.loadedLevelName);//GUIManager.currLevel);//"Prototype - Level1");
		}

		// level select
		if(GUI.Button(levelSelectButtonRect, scoreStrings[1]))
		{
			currentResponse.type = EventTypes.LEVELSELECT;
		}
		
		// quit
		if(GUI.Button(quitButtonRect, scoreStrings[2]))
		{
			Application.Quit();
		}
	}
	
	function SetupButtons(){		
		retryLevelButtonRect = RectFactory.NewRect(0.307, .296, .4, .157);
		quitButtonRect = RectFactory.NewRect(.307, .685, .4, .157);
		levelSelectButtonRect = RectFactory.NewRect(.307, .5, .4, .157);
		missionFailedTextLabelRect = RectFactory.NewRect(.35, .185, .458, .073);
		rectList.Add(RectFactory.NewRect(0,0,1,1));
	}
}