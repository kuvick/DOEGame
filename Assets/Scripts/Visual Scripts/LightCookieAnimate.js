/* 
LightCookieAnimate.js
Initially by Katharine

This script will eventually animate
the light cookie by replacing it,
to make it look like clouds are moving, or
however the light texture is scripted.

Based off this script:
http://wiki.unity3d.com/index.php?title=Animating_Tiled_texture

That is if you want to do frame by frame animation.
----

The other possibility is moving the light itself,
since using the texture offset doesn't seem to be
a possibility for this (but would work if it were
a material and not a cookie with a straight up 2D
texture on it).

For this one, you have to set the light cookie as the one
in the inspector for the light, not in this component.

*/

#pragma strict

// Opt 1 Variables
public var lightCookies : Texture2D[];			// The various frames for the frame by frame shadow animation
public var framesPerSecond : int;				// How many fps are desired
public var frameByFrameAnimation : boolean;		// Turn on or off this option

// Opt 2 Variables
private var initialPosition : Vector3;					// The initial position of the light
public var speed : float;								// How fast the texture will move
public var loopDistance : float;						// The distance from the initial position the light can go (can use this check to see when the texture will overlap with its initial position)
private var maxDistance : float;						// The maximum distance the light can go before it returns to the initial position
public var resetLightPositionOnMaxDistance : boolean;	// If the light reaches max distance, reset to initial position

function Start()
{
	if(!frameByFrameAnimation)
	{
		initialPosition = light.transform.position;
		maxDistance = initialPosition.y + loopDistance;
	}
}

function Update()
{
	if(frameByFrameAnimation)
	{
		// Calculate index
		var index : int = Time.time * framesPerSecond;
		// repeat when exhausting all frames
		index = index % lightCookies.Length;
		light.cookie = lightCookies[index];
	}
	else
	{
		light.transform.Translate(0,speed,0,Space.World);
		
		if(resetLightPositionOnMaxDistance)
		{
			if(light.transform.position.y >= maxDistance)
			{
				light.transform.position = initialPosition;
			}
		}
	}

}
