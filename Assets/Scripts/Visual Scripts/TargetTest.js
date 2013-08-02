#pragma strict

// Recommended: 0.005
public var speed : float = 0.005;

function Update ()
{
	gameObject.transform.RotateAround(Vector3.up, speed);
}