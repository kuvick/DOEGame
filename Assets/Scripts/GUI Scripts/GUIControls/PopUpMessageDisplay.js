#pragma strict

public class PopUpMessageDisplay extends GUIControl{
	private var timedMessages:List.<TimedControl>;
	private var messagesToRemove:List.<TimedControl>;
	
	public function Initialize(){
		super.Initialize();
		timedMessages = new List.<TimedControl>();
		messagesToRemove = new List.<TimedControl>();
	}
	
	public function AddMessage(timedControlToAdd : TimedControl){
		messagesToRemove.Add(timedControlToAdd);
	}
	
	public function Render(){		
		for (var timedControl : TimedControl in timedMessages){
			timedControl.Render();
		}
	}
	
	public function Update(){
		for (var timedControl : TimedControl in timedMessages){
			if (timedControl.Update()){
				messagesToRemove.Add(timedControl);
			}
		}
		CleanUpMessages();
	}
	
	private function CleanUpMessages(){
		for (var timedControl : TimedControl in messagesToRemove){
			timedMessages.Remove(timedControl);
		}
		messagesToRemove.Clear();
	}
}