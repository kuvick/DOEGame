﻿#pragma strict

private var activeImage : Texture2D;
private var inactiveImage : Texture2D;
private var validImage : Texture2D;

private var currState : IndicatorState;
private var currImage : Texture2D;

private var spriteIndex : float;
private var spriteSize : Vector2;

public var resourceRing: GameObject;

public var linkUI : LinkUI;

private var parentName:String;

private var thisTransform : Transform;
private var thisMaterial : Material;

private var ringAnimation : InGameAnimation = new InGameAnimation();

enum IndicatorState
{
	Neutral,
	Active,
	Valid
}

function Start () {
	/*spriteSize = Vector2(1.0f / 3f, 1f);
	
	thisTransform = gameObject.transform;
	thisMaterial = gameObject.renderer.material;
	
	thisMaterial.color = Color.clear;
	
	yield WaitForSeconds(0.1);
	parentName = this.gameObject.transform.parent.name;
	//Debug.Log(this.gameObject.transform.parent.name + "/ResourceRing");
	linkUI = GameObject.Find("Main Camera").GetComponent(LinkUI);*/
	Initialize();
}

function Initialize()
{
	spriteSize = Vector2(1.0f / 3f, 1f);
	
	thisTransform = gameObject.transform;
	thisMaterial = gameObject.renderer.material;
	
	//thisMaterial.color = Color.clear;
	
	//yield WaitForSeconds(0.1);
	parentName = this.gameObject.transform.parent.name;
	//Debug.Log(this.gameObject.transform.parent.name + "/ResourceRing");
	linkUI = GameObject.Find("Main Camera").GetComponent(LinkUI);	
}

public function SetResourceRing(obj:GameObject)
{
	resourceRing = obj;
}

public function SetImages(active : Texture2D, inactive : Texture2D, valid : Texture2D)
{
	activeImage = active;
	inactiveImage = inactive;
	validImage = valid;
}

function Update()
{
	if(isAnimated)
	{
		if(!ringAnimation.AnimateRing())
		{
			isAnimated = false;
			currImage = ringAnimation.getEndTexture();
		}
	}	
}

private function RotateActive()
{
	while(currState == IndicatorState.Active)
	{
		thisTransform.Rotate(0f,10f,0f);

		yield WaitForSeconds(.1f);
	}
}

private function AnimateValid()
{
	/*
	while(currState == IndicatorState.Valid)
	{
		var offset : Vector2 = Vector2(spriteIndex * spriteSize.x, 0);
		//thisMaterial.mainTextureOffset = offset;
		//thisMaterial.mainTextureScale = spriteSize;
		spriteIndex++;
		if (spriteIndex > 2)
			spriteIndex = 0f;
		yield WaitForSeconds(.5f);
	}
	*/
	
	while(currState == IndicatorState.Valid)
	{
		//thisMaterial.mainTextureScale = Vector2(thisMaterial.mainTextureScale.x + 0.01, thisMaterial.mainTextureScale.y + 0.01);
		
		resourceRing.transform.localScale = Vector3(resourceRing.transform.localScale.x + 0.5, resourceRing.transform.localScale.y + 0.5, resourceRing.transform.localScale.z + 0.5);
		if(resourceRing.transform.localScale.x >= 15)
			resourceRing.transform.localScale = Vector3(5,5,5);
		
		yield WaitForSeconds(.01f);
	}
	resourceRing.transform.localScale = Vector3(15,15,15);
	
}


private var isAnimated:boolean = false;
private var previousTexture:Texture;

function SetState (state : IndicatorState)
{
	if (currState == state || parentName == "BuildingSite")
		return;
	currState = state;
	
	switch (currState)
	{
		case IndicatorState.Active:
			//currImage = activeImage;
			//renderer.material.mainTextureOffset = Vector2(1,1);
			//renderer.material.mainTextureScale = Vector2(-1,-1);
			//renderer.material.color = Color.white;
			//StartCoroutine(RotateActive());
			/*if(linkUI!= null && resourceRing != null && parentName != "BuildingSite")
				linkUI.setActiveRingMaterial(true, resourceRing);*/
			if(currImage != null && previousTexture != activeImage)
			{
				ringAnimation.setVariablesForAnimation(resourceRing.renderer.material, resourceRing, inactiveImage, activeImage, 0.05, Vector3(15,15,15));
				isAnimated = true;
			}
			
			currImage = activeImage;
			break;
		/*
		case IndicatorState.Valid:
			currImage = validImage;
			spriteIndex = 0f;
			thisMaterial.color = Color.white;
			StartCoroutine(AnimateValid());
			break;
		*/
		case IndicatorState.Valid:
			/*if(linkUI!= null && resourceRing != null && parentName != "BuildingSite")
				linkUI.setValidTargetRingMaterial(resourceRing);*/
			previousTexture = currImage;
			currImage = validImage;
			StartCoroutine(AnimateValid());
			break;
		case IndicatorState.Neutral:
			currImage = inactiveImage;
			//thisMaterial.color = Color.clear;
			/*if(linkUI!= null && resourceRing != null && parentName != "BuildingSite")
				linkUI.setActiveRingMaterial(false, resourceRing);*/
			break;
	}
	//if(resourceRing != null)
		resourceRing.renderer.material.mainTexture = currImage;
}