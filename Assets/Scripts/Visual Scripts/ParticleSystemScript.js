/* 
ParticleSystemScript.js
Initially by Katharine

Use this for a simple particle system...well, probably
will need to be simplified further later. Scripted in a way
to hopefully accomidate for the two modes to view game.
*/

#pragma strict

// The particles the system is supposed to use:
public var particles : GameObject[];
public var numOfParticles : int = 3;
public var speed : int = 25;

// Generated particles by the system:
var generatedParticles: List.<Particle>;
var mainCamera : GameObject;
var particlesToDestory : List.<Particle>;

function Start ()
{
	// Generate first particle:
	var particle : Particle = new Particle(particles, transform);
	generatedParticles.Add(particle);
	
	mainCamera = GameObject.Find("Main Camera");
	Debug.Log(mainCamera.name);
}

// Following two functions disables the particle generating system
// when the generator is not visible on the 
function OnBecameVisible()
{
    enabled = true;
}

function OnBecameInvisible()
{
    enabled = false;
}

function Update ()
{
	for(var particle : Particle in generatedParticles)
	{
		// So the particle is always facing the camera, a way to deal with
		// the different views, although still figuring out the best way to
		// freeze them so they don't rotate as much as they do at the moment.
		particle.gameObject.transform.rotation = Quaternion.LookRotation(mainCamera.transform.position - particle.gameObject.transform.position);
		
		// Moving the particle at the random direction at the specified speed:
		particle.gameObject.transform.Translate(particle.direction * Time.deltaTime * speed, Space.World);
		
		// Reducing the opacity:
		particle.gameObject.renderer.material.color.a -= .01;
		
		// If a particle becomes completely transparent, delete it.
		if(particle.gameObject.renderer.material.color.a <= 0)
		{
			particlesToDestory.Add(particle);
		}
	}
	
	// Delete particles that have been marked for deletion.
	if(particlesToDestory.Count > 0)
	{
		for(var particle : Particle in particlesToDestory)
		{
			generatedParticles.Remove(particle);
			GameObject.Destroy(particle.gameObject);
		}
		particlesToDestory.Clear();
	}

	// If the number of particles present is less than the number of specified
	// particles, generate a new particle
	if(generatedParticles.Count < numOfParticles)
	{
		var particle : Particle = new Particle(particles, transform);
		generatedParticles.Add(particle);
	}
	
}

// Particle Class
// It instantiates a particle at the specified location using
// one of the particles in the array, in a random direction
// upwards.
class Particle
{
	var gameObject : GameObject;
	var direction : Vector3;
	
	function Particle(particles : GameObject[], transform : Transform)
	{
		var index : int = Random.Range(0,particles.Length);
		
		this.gameObject = GameObject.Instantiate(particles[index], transform.position, transform.rotation);
		this.direction = Vector3.ClampMagnitude(transform.position + new Vector3(Random.Range(-1000,1000), Random.Range(0,2000), Random.Range(-1000,1000)), 1);
		this.gameObject.renderer.material.color.a = Random.Range(0.6,1.0);
	}
	
}