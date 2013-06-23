/**********************************************************
Loading.js

Description: 

Notes: 

Kathrine - Temporary script for the demo, will eventually use this when
we have access to Unity Pro:

http://docs.unity3d.com/Documentation/ScriptReference/Application.LoadLevelAsync.html

Author: Katherine Uvick, Francis Yuan
**********************************************************/
#pragma strict
public class Loading extends GUIControl
{
	// Loading Screen Rectangles
	private var background:Rect;
	private var loadingRect : Rect;
	private var onlineRect : Rect;
	private var iconRect : Rect;
	
	// Loading Screen Textures
	public var loadingTexture : Texture;
	public var iconTexture : Texture;
	public var backgroundTexture : Texture2D;
	public var foregroundTexture : Texture2D;
	public var onlineTexture : Texture2D;
	
	private var style : GUIStyle = GUIStyle();
	public var boldFont : Font;
	public var regularFont : Font;
	
	private var titleRect : Rect;
	private var descRect : Rect;
	
	private var titleFontScale : float = 0.08;
	private var titleFontSize : float;
	private var descFontScale : float = 0.06;
	private var descFontSize : float;
	
	private var leftOffsetScale : float = 0.01;
	private var leftOffset : float;
	
	private var titleTopOffsetScale : float = .25;
	private var titleWidthScale : float = .4;
	private var titleHeightScale : float = .15;
	
	private var descTopOffsetScale : float = .4;
	private var descWidthScale : float = .6;
	private var descHeightScale : float = .66;
	
	private var currentJob : Job;
	private var currentJobDesc : String;
	
	public function Start ()
	{
		super.Start();
		
	}
	
	public function Initialize()
	{
		super.Initialize();
		background = Rect(verticalBarWidth, horizontalBarHeight, screenWidth, screenHeight);
		
		leftOffset = screenWidth * leftOffsetScale;
		
		titleRect = Rect(leftOffset, screenHeight * titleTopOffsetScale,
							screenWidth * titleWidthScale, screenHeight * titleHeightScale);
		titleFontSize = screenHeight * titleFontScale;
		
		descRect = Rect(leftOffset, screenHeight * descTopOffsetScale,
							screenWidth - leftOffset, screenHeight * descHeightScale);
		descFontSize = screenHeight * descFontScale;
		style.normal.textColor = Color.white;
		style.font = regularFont;
		style.wordWrap = true;
		//style.richText = true;
		// Add the background rect to the rectList for checking input collision
		rectList.Add(background);
	}
	
	public function Render() 
	{
		GUI.DrawTexture(background, backgroundTexture, ScaleMode.ScaleToFit);
		GUI.DrawTexture(background, foregroundTexture, ScaleMode.ScaleToFit);
		style.font = boldFont;
		style.fontSize = titleFontSize;
		GUI.Label(titleRect, currentJob.title, style);
		GUI.DrawTexture(iconRect, iconTexture, ScaleMode.ScaleToFit);
		style.font = regularFont;
		style.fontSize = descFontSize;
		GUI.Label(descRect, currentJobDesc, style);
	}
	
	public function DelayLoad(seconds:int):IEnumerator
	{
		yield WaitForSeconds(seconds);
		currentResponse.type = EventTypes.DONELOADING;
	}
	
	public function GetNewJob()
	{
		currentJob = JobDatabase.GetRandomJob();
		currentJobDesc = "Sub Agency: " + currentJob.agency;
		currentJobDesc += "\nSalary Range: $" + currentJob.salaryMin + " - $" + currentJob.salaryMax;
		currentJobDesc += "\nOpen Period: " + currentJob.openPeriodStart + " to " + currentJob.openPeriodEnd;
		currentJobDesc += "\nPosition Information: " + currentJob.positionInformation;
		currentJobDesc += "\nLocation: " + currentJob.location;
		currentJobDesc += "\nWho May Be Considered:\n" + currentJob.whoConsidered;
		
		style.font = boldFont;
		style.fontSize = titleFontSize;
		var titleSize : Vector2 = style.CalcSize(GUIContent(currentJob.title));
		titleRect.width = titleSize.x;
		titleRect.height = titleSize.y;
		
		iconRect = Rect(titleRect.width + (2 * leftOffset), screenHeight * titleTopOffsetScale,
						titleSize.y, titleSize.y);
	}
}