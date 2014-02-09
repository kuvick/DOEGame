#pragma strict

private var pSystem : ParticleSystem;
private var paused : boolean = false;
private var mat : Material;
private var transColor : Color = Color(1,1,1,0);

function Start () {

}

function Update () {

}

function Awake()
{
	pSystem = gameObject.GetComponent(ParticleSystem);
	mat = gameObject.renderer.material;
}

function Play()
{
	paused = false;
	pSystem.Play();
}

function Pause()
{
	paused = true;
	pSystem.Pause();
	StartCoroutine(Blink());
}

private function Blink()
{
	while(paused)
	{
		mat.color = Color.Lerp(transColor, Color.white, LinkUI.fadeTimer);
		yield;
	}
	// reset to full color when pause is over
	mat.color = Color.white;
}