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
	private var idNum : int;
	private var deviceName : String;
	private var modelName : String;
	private var FONTRATIO:float = 40; // kinda arbitrary

	public function Initialize(){
		super.Initialize();
		
		textStyle.fontSize = (Mathf.RoundToInt(Mathf.Min(ScreenSettingsManager.screenWidth, ScreenSettingsManager.screenHeight) / FONTRATIO));
		
		id = SystemInfo.deviceModel.Substring(0, 15);
		
		if (Database.playtestID == -1){
			Database.playtestID = Random.RandomRange(0, 99999999);
		}
		
		idNum = Database.playtestID;
		
		deviceName = /*SystemInfo.deviceName + ":"*/ "";
		//if (deviceName == "<unknown>") deviceName = "";// if the devices name is not set then don't display it
		modelName = SystemInfo.deviceModel.Substring(0, 20);
		
		SetupRectangles();
	}
	
	public function Render(){
		levelId = (GUIManager.Instance().thisIsALevel ? ("-" + Application.loadedLevelName) : "");
		id = idNum + "--" + deviceName + modelName + levelId;
		SetupRectangles();
		GUI.Label(idLabelRect, id);
	}
	
	private function SetupRectangles(){
		var content : GUIContent = new GUIContent(id);
	
		var size : Vector2 = textStyle.CalcSize(content);
		size.x /= ScreenSettingsManager.screenWidth;
		size.y = textStyle.CalcHeight(content, size.x) / ScreenSettingsManager.screenHeight;
		
		idLabelRect = new RectFactory.NewRect(.5-(size.x/2), .95, size.x, .05);
	}
}