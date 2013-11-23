#pragma strict

public var activeImage : Texture2D;
public var validImage : Texture2D;

private var currState : IndicatorState;
private var currImage : Texture2D;

private var spriteIndex : float;
private var spriteSize : Vector2;

enum IndicatorState
{
	Neutral,
	Active,
	Valid
}

function Start () {
	spriteSize = Vector2(1.0f / 3f, 1f);
	
	renderer.material.color = Color.clear;
}

function Update () {
	
}

private function RotateActive()
{
	while(currState == IndicatorState.Active)
	{

			gameObject.transform.Rotate(0f,10f,0f);

		yield WaitForSeconds(.1f);
	}
}

private function AnimateValid()
{
	while(currState == IndicatorState.Valid)
	{

			var offset : Vector2 = Vector2(spriteIndex * spriteSize.x, 0);
			renderer.material.mainTextureOffset = offset;
			renderer.material.mainTextureScale = spriteSize;
			spriteIndex++;
			if (spriteIndex > 2)
				spriteIndex = 0f;
		yield WaitForSeconds(.5f);
	}
}

function SetState (state : IndicatorState)
{
	if (currState == state)
		return;
	currState = state;
	switch (currState)
	{
		case IndicatorState.Active:
			currImage = activeImage;
			renderer.material.mainTextureOffset = Vector2(1,1);
			renderer.material.mainTextureScale = Vector2(-1,-1);
			renderer.material.color = Color.white;
			StartCoroutine(RotateActive());
			break;
		case IndicatorState.Valid:
			currImage = validImage;
			spriteIndex = 0f;
			renderer.material.color = Color.white;
			StartCoroutine(AnimateValid());
			break;
		case IndicatorState.Neutral:
			currImage = null;
			renderer.material.color = Color.clear;
			break;
	}
	gameObject.renderer.material.mainTexture = currImage;
}