#pragma strict

public class ContactUnlocked extends TimedControl{
	private var contactUnlocked : Contact;
	private var portraitRect : Rect;
	private var textRect : Rect;

	public function ContactUnlocked(contact : Contact){
		contactUnlocked = contact;
		portraitRect = RectFactory.NewRect(0,0);
	}
	
	public function Render(){
		GUI.Box(portraitRect, contactUnlocked.portrait);
	}
}