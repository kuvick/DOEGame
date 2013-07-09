#pragma strict

public var style : GUIStyle = GUIStyle();
public var boldFont : Font;
public var regularFont : Font;


public var regMaterial : Material;
public var boldMaterial : Material;

public var useBold : boolean = false;

function Start ()
{
	gameObject.AddComponent("GUIText");
	
	gameObject.guiText.text = "Agent G.I. Joe Man";
	gameObject.guiText.font = regularFont;
	

}

function OnGUI ()
{	
	
	if(useBold)
	{
		gameObject.guiText.font = boldFont;
		gameObject.guiText.material = boldMaterial;
	}
	else
	{
		gameObject.guiText.font = regularFont;
		gameObject.guiText.material = regMaterial;
	}

}