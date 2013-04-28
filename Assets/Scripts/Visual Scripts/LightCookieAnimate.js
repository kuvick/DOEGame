/* 
ParticleSystemScript.js
Initially by Katharine

This script will eventually animate
the light cookie by replacing it,
to make it look like clouds are moving, or
however the light texture is scripted.

Based off this script:
http://wiki.unity3d.com/index.php?title=Animating_Tiled_texture
*/

#pragma strict


public var lightCookies : Texture2D[];
public var framesPerSecond : int;


function Update ()
{
	// Calculate index
	var index : int = Time.time * framesPerSecond;
	// repeat when exhausting all frames
	index = index % lightCookies.Length;
	light.cookie = lightCookies[index];
}