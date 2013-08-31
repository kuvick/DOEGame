#pragma strict

public class TimedControl {
	public var displayTime : int = 10;
	
	public function Render(){} // to be overloaded by children

	public function Update() : boolean {
		displayTime -= Time.deltaTime;
		if (displayTime < 0){
			return (true);
		}
		return (false);
	} 
}