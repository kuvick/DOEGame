#pragma strict

private var pSystem : ParticleSystem;
private var paused : boolean = false;
private var mat : Material;

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
		mat.color = Color.Lerp(Color.white, Color.black, Time.time);
		yield WaitForSeconds(.1f);
	}
}