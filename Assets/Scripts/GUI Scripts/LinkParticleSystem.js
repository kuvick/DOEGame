#pragma strict

private var pSystem : ParticleSystem;
private var paused : boolean = false;
private var mat : Material;
private var transColor : Color = Color(1,1,1,0);
private var isSelected:boolean = false;

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
	while(paused || isSelected)
	{
		mat.color = Color.Lerp(transColor, Color.white, LinkUI.fadeTimer);
		yield;
	}
	// reset to full color when pause is over
	mat.color = Color.white;
}

public function SelectLink(isThisLineCurrentlySelected:boolean)
{
	isSelected = isThisLineCurrentlySelected;
	if(isSelected && !paused)
	{
		isSelected = true;
		pSystem.Pause();
		StartCoroutine(Blink());
	}
	else if(!paused)
	{
		isSelected = false;
		pSystem.Play();
	}
}