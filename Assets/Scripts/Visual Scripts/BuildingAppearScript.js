#pragma strict

private var normalTexture:Texture;
private var blueTexture:Texture;
private var nameOfObj:String;
private var originalMaterial:Material;
private var blueMaterial : Material;
private var color1:Color;
private var color2:Color;
private var phaseTwo:boolean;
private var speed:float = 0.05;

function Start ()
{
	phaseTwo = false;
	nameOfObj = this.gameObject.name;
	blueTexture = Resources.Load("BuildingSite/" + nameOfObj) as Texture;
	normalTexture = this.gameObject.renderer.material.mainTexture;
	//this.gameObject.renderer.material.color.a = 0.5f;
	originalMaterial = this.gameObject.renderer.material;
	blueMaterial = Resources.Load("BuildingSite/BuildingAppear") as Material;
	
	this.gameObject.renderer.material = blueMaterial;
	
	blueMaterial.SetTexture("_MainTex", normalTexture);
	blueMaterial.SetTexture("_SubTex", blueTexture);
	
	blueMaterial.mainTextureScale = Vector2(1,1);
	blueMaterial.mainTextureOffset = Vector2(0,0);
	blueMaterial.SetTextureOffset("_SubTex", Vector2(0,0));
	blueMaterial.SetTextureScale("_SubTex", Vector2(1,1));
	
	color1 = Color.white;
	color2 = Color.white;
	color1.a = 0f;
	color2.a = 0f;
	
	blueMaterial.SetColor("_Color1", color1);
	blueMaterial.SetColor("_Color2", color2);
}

function Update ()
{
	if(!phaseTwo && color2.a <= 1.0)
	{
		color2.a += speed;
		if(color2.a >= 1.0)
			phaseTwo = true;
	}
	else
	{
		color1.a += speed;
		color2.a = 1.0 - color1.a;
		if(color1.a >= 1.0)
		{
			color1.a = 1.0f;
			Terminate();
		}
	}
	
	blueMaterial.SetColor("_Color1", color1);
	blueMaterial.SetColor("_Color2", color2);
	
}


private function Terminate()
{
	this.gameObject.renderer.material = originalMaterial;
	Destroy(this);
}
