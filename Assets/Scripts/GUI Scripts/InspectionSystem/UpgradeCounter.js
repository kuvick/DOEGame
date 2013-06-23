#pragma strict

public class UpgradeCounter extends InspectionComponent
{
	private var totalParts : int = 0; // total number of parts an upgrade has
	private var obtainedParts : int = 0; // number of parts of the upgrade the player has picked up
	public var id : UpgradeID; // id of the upgrade
	
	private var topOffset : float;
	private var topOffsetScale : float = 0.1;
	private var width : float;
	private var widthScale : float = 0.1;
	
	public function Initialize(id : UpgradeID, text : String, pic : Texture2D)
	{
		this.id = id;
		/*normalTexture = pic;
		selectedTexture = pic;*/
		topOffset = Screen.height * topOffsetScale;
		width = Screen.width * widthScale;
		rect = Rect((Screen.width / 2) - (width / 2), topOffset, width, topOffset);
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
		if (GUI.Button(rect, String.Empty + obtainedParts + "/" + totalParts))
			SendToDisplay();//display.Activate(dispText, this);
	}
}