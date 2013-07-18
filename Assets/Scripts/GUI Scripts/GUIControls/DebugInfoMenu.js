/**********************************************************
BuildingMenu.js

Description: 

Author: Francis Yuan
**********************************************************/

#pragma strict

public class DebugInfoMenu extends GUIControl{
	public var textStyle : GUIStyle;
	
	private var idLabelRect : Rect;
	private var levelId : String;
	private var id : String;
	private var displayID : String;
	private var idNum : int;
	private var deviceName : String;
	private var modelName : String;
	private var FONTRATIO:float = 40; // kinda arbitrary

	public function Initialize(){
		super.Initialize();
		
		textStyle.fontSize = (Mathf.RoundToInt(Mathf.Min(ScreenSettingsManager.screenWidth, ScreenSettingsManager.screenHeight) / FONTRATIO));
		
		if (Database.playtestID == "000-0000"){
			Database.playtestID = Database.GenerateID();
		}
		
		id = Database.playtestID;
		SetupRectangles();
	}
	
	public function Render(){
		levelId = (GUIManager.Instance().thisIsALevel ? ("--" + Application.loadedLevelName) : "");
		displayID = id + levelId;
		SetupRectangles();
		GUI.Label(idLabelRect, displayID);
	}
	
	private function SetupRectangles(){
		var content : GUIContent = new GUIContent(id);
	
		var size : Vector2 = textStyle.CalcSize(content);
		size.x /= ScreenSettingsManager.screenWidth;
		size.y = textStyle.CalcHeight(content, size.x) / ScreenSettingsManager.screenHeight;
		
		idLabelRect = new RectFactory.NewRect(.5-size.x, .95, size.x*2, .05);
	}
}