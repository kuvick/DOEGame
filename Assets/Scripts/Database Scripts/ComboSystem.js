#pragma strict

//Basic Class for the Combo System
public class ComboSystem
{
	private var comboCount : int = 0;
	private var comboScore : int = 0;
	public var comboScoreBasePoints : int = 100;
	private var highestCombo : int = 0;
	
	public function ComboSystem()
	{
		comboCount = 0;
	}
	
	public function getComboCount() : int
	{
		return comboCount;
	}
	
	public function incrementComboCount()
	{
		//Debug.Log("Combo Incremented. Combo = " + comboCount);
		comboCount++;
		comboScore += comboScoreBasePoints;
		if(comboCount > highestCombo)
			highestCombo = comboCount;
	}
	
	public function resetComboCount()
	{
		//Debug.Log("Combo About To Reset. Combo = " + comboCount);
		comboCount = 0;
		//Debug.Log("Combo Reset. Combo = " + comboCount);		
	}
	
	public function getComboScore() : int
	{
		return comboScore;
	}	
	
	public function getHighestCombo() : int
	{
		return highestCombo;
	}
}