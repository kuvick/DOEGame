#pragma strict

public class UpgradeCounter extends InspectionComponent
{
	private var totalParts : int = 0; // total number of parts an upgrade has
	private var obtainedParts : int = 0; // number of parts of the upgrade the player has picked up
	public var id : UpgradeID; // id of the upgrade
	
	private var topOffset : float;
	private var topOffsetScale : float = 0.05;
	private var width : float;
	private var widthScale : float = 0.1;
	
	private var event:EventScript;
	
	public function getEvent():EventScript
	{
		return event;
	}
	
	public function setEvent(eventPointer:EventScript)
	{
		event = eventPointer;
	}
	
	public function Initialize(id : UpgradeID, icon : Texture2D, disp : Tooltip, eventPointer: EventScript)
	{
		this.id = id;
		event = eventPointer;
		normalTexture = icon;
		selectedTexture = icon;
		topOffset = Screen.height * topOffsetScale;
		width = Screen.width * widthScale;
		rect = Rect((Screen.width / 2) - (width / 2), topOffset, width, width);
		Initialize(disp);
	}
	
	public function Initialize(id : UpgradeID, icon : Texture2D, text : String, pic : Texture2D, eventPointer: EventScript)
	{
		this.id = id;
		event = eventPointer;
		normalTexture = icon;
		selectedTexture = icon;
		topOffset = Screen.height * topOffsetScale;
		width = Screen.width * widthScale;
		rect = Rect((Screen.width / 2) - (width / 2), topOffset, width, width);
		Initialize(text, pic);
	}
	
	public function IncrementTotal()
	{
		totalParts++;
	}
	
	public function IncrementObtained()
	{
		if (obtainedParts < totalParts)
			obtainedParts++;
	}
	
	public function DecrementObtained()
	{
		if (obtainedParts > 0)
			obtainedParts--;
	}
	
	public function CheckIsComplete() : boolean
	{
		return totalParts == obtainedParts;
	}
	
	public function Draw()
	{
		super();
		GUI.skin.button.normal.background = currentTexture;
		GUI.skin.button.active.background = currentTexture;
		GUI.skin.button.hover.background = currentTexture;
		if (GUI.Button(rect, String.Empty + obtainedParts + "/" + totalParts))
			SendToDisplay();//display.Activate(dispText, this);
	}
	public function getTotalParts():int
	{
		return totalParts;
	}
	public function getObtainedParts():int
	{
		return obtainedParts;
	}
}