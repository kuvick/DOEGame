#pragma strict

private var pSystem : ParticleSystem;
private var paused : boolean = false;
private var mat : Material;
private var blinkIncrement : float = 0.1f;
private var colorScale : float = 0f;
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
	// reset variables
	colorScale = 0f;
	blinkIncrement = 0.05f;
	while(paused)
	{
		colorScale += blinkIncrement;
		if (colorScale <= 0f || colorScale >= 1f)
			blinkIncrement *= -1f;
		mat.color = Color.Lerp(Color.white, transColor, colorScale);
		yield WaitForSeconds(Mathf.Abs(blinkIncrement));
	}
	// reset to full color when pause is over
	mat.color = Color.white;
}