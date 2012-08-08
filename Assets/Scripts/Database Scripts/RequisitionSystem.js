/*
RequisitionSystem.js
By Katharine Uvick

This script contains the information pertaining to the requisition
system, as well as storms and pollution since they are tied into
the requisition system. The functions are to be called by other
scripts as they are needed. This script is also to be used to check
for a fail state, as well as to check for win states after
a requisition is spent. It also contains some relevant information
for the scoring system.


Requisition System:

"Requisition is a point system that represents financial resources,
time, and turns within the game. A player begins with 10 Requisition
points, and each action they take (making a link or placing a building)
deducts from this amount."

	Requisition is spent by:
	
	- Creating a link (1 point, called by Database, linkBuildings function)
	- Removing a building (1 point, called by...?)
	- Placing a building (varies in points, called by Database, addBuildingToGrid function)
	
	Can regain requisition points by:
	
	- completing secondary objectives (should use addRequisition function)
	- keeping pollution levels low, see "Pay Day" in pollution system.


Pollution System:

Pollution ranges between 0 and 100, and adds to the level whenever a requisition point is spent
the pollution output of all the buildings on the grid.

Pay Day:

After every 10 turns (use var turnsBetweenPayDay to change this), the player recieves additional
requisition points (default 10, use var requisitionPayDay to change), but -1 for each 10 points of pollution
(use var pollutionPenaltyPercent to change this). (Change pollutionPenalty to change the -1)


Storm System:

Use var turnsBetweenStorm to set how many turns pass before a storm (varies by mission, 5 to 12),
and the storm will last until a specified amount of requisition points are spent (3 default, use
var lengthOfStorm to change this amount). When a storm starts, it will reduce the pollutionLevel
by var pollutionReductionByStorm (33 default), and continue to reduce the requisition by one
for each day the storm lasts.

Since storms do not occur at identical intervals, use the array stormIntervals to set the
amounts they occur at (will loop through the array when it reaches the end).


The value of certain variables are set to public so they can be changed
for balancing testing.

Attach to a blank GameObject
*/
#pragma strict

static private var database : Database;

// Requisition System Variables
static public var startingRequisitionPoints : int = 20;
static public var currentRequisitionPoints : int;

// Storm System Variables
static public var lengthOfStorm : int = 3;
static private var daysLeftOfStorm : int;
static public var isStorming : boolean;
static public var turnsTilStorm : int;
static public var turnsBetweenStorm : int = 2;		//change this per mission
static public var pollutionReductionByStorm : int = 33;

static public var stormIntervals : Array = new Array();
static private var spotInStormArray : int;

// Pollution Variables
static public var pollutionLevel : int;

// Pay Day Variables
static public var turnsBetweenPayDay : int = 10;
static private var turnsTilPayDay : int;
static public var requisitionPayDay : int = 10;
static public var pollutionPenaltyPercent : int = 10;
static public var pollutionPenalty : int = 1;

// Score Specific Variables
static public var numberOfUndos : int;		// seperate from the one in the Database script if we want to limit the number of undos remembered.
static private var totalRequisitionSpent : int;

function Awake ()
{
	currentRequisitionPoints = startingRequisitionPoints;
	spotInStormArray = 0;
	daysLeftOfStorm = lengthOfStorm;
	turnsTilStorm = turnsBetweenStorm;
	
	isStorming = false;
	
	turnsTilPayDay = turnsBetweenPayDay;
	
	pollutionLevel = 0;
	numberOfUndos = 0;
	totalRequisitionSpent = 0;
	
	database = GameObject.Find("Database").GetComponent("Database");
	
}// end of Awake


// This function is to be used by other scripts to add requisition points.
static public function addRequisition( pointsToAdd : int )
{
	currentRequisitionPoints += pointsToAdd;
}// end of addRequisition


// This function is to be used by other scripts to spend requisition points.
// the script returns true if the transaction is successful, and false
// if there is not enough requisition to spend.
static public function spendRequisition( cost : int )
{	
	if( cost <= currentRequisitionPoints )
	{
		currentRequisitionPoints -= cost;
		totalRequisitionSpent += cost;
		checkStorm( cost );
		addPollution();
		checkPayDay( cost );
		
		checkState();
	
		return true;
	}
	else
	{
		checkState();		
		return false;
	}
	

	
}// end of spendRequisition


// Used by PlaceBuilding to know if its possible beforehand
// to create the building
static public function canSpendRequisition( buildingName : String ) : boolean
{
	for (var defaultBuilding : Building in database.buildings)
	{
		if(buildingName == defaultBuilding.buildingName )
		{
			if( defaultBuilding.requisitionCost <= currentRequisitionPoints )
				return true;
			else
				return false;
		}
    }
	
	return false;

}// end of canSpendRequisition


// Used to check whether or not to enact a storm
// If it is time, it will enact the effects (described above)
static private function checkStorm( daysPassed : int )
{
	if(!isStorming && turnsTilStorm > 0)
	{
		turnsTilStorm -= daysPassed;
	}
	else if(!isStorming && turnsTilStorm <= 0)
	{
		isStorming = true;
		
	}
	else
	{
		Debug.Log("Storming, " + daysLeftOfStorm + " days left...");
	
		// First day of storm, reduces pollution by the specified amount,
		// spends first point of requisition and reduces the amount of days left.
		if (daysLeftOfStorm == lengthOfStorm)
		{
			pollutionLevel -= pollutionReductionByStorm;
			correctPollution();
			currentRequisitionPoints--;
			daysLeftOfStorm -= daysPassed;
		}
		// For each day of the storm, spends requisition and reduces the amount of days left.
		else if(daysLeftOfStorm > 0)
		{
			currentRequisitionPoints--;
			daysLeftOfStorm -= daysPassed;
		}
		// If 3 requisition points have been spent, the storm ends, everything resets.
		else
		{
			isStorming = false;
			
			if(spotInStormArray < stormIntervals.length - 1)
			{
				spotInStormArray++;
			}
			else
			{
				spotInStormArray = 0;
			}
			
			daysLeftOfStorm = lengthOfStorm;
			turnsBetweenStorm = stormIntervals[spotInStormArray];
			turnsTilStorm = turnsBetweenStorm;
		}
	}
}// end of checkStorm()

// Function used to add the pollution
// based on number of buildings in the level
// per requisition point spent (see spendRequisition function)
static private function addPollution()
{

	if(pollutionLevel < 100)
	{
		pollutionLevel += database.totalPollution();
	}
	
	
	correctPollution();

}//end of addPollution

// Function keeps pollution between 100 and 0
static private function correctPollution()
{
	if(pollutionLevel >= 100)
	{
		pollutionLevel = 100;
	}
	else if(pollutionLevel <= 0)
	{
		pollutionLevel = 0;
	}
	
}// end of correctPollution


// If a storm needs to be triggered in some other way than
// the normal waiting period, use this function.
static public function causeStorm()
{
	if(!isStorming)
	{
		isStorming = true;
		turnsTilStorm = 0;
		pollutionLevel -= pollutionReductionByStorm;
		correctPollution();
		spendRequisition(1);
		daysLeftOfStorm--;	
	}
}// end of causeStorm


// Checks for a pay day. If the number of turns have passed, 
// it will calculate and reward the player with more requisition.
static private function checkPayDay( daysPassed : int)
{
	
	if(turnsTilPayDay > 0)
	{
		turnsTilPayDay -= daysPassed;
	}
	else
	{
		turnsTilPayDay = turnsBetweenPayDay;
		
		var pollutionDamage : int = pollutionLevel / 10;
		pollutionDamage = pollutionDamage * (pollutionPenalty * -1);
		currentRequisitionPoints += requisitionPayDay - pollutionDamage;
		
		Debug.Log("Pay Day, pollution damage: " + pollutionDamage);
	}
	
}// end of checkPayDay

// Checks for win states, fail states, and completion of objectives
static public function checkState()
{
	// use this function to perhaps call another function that checks certain
	// objectives, etc.
	
	if( currentRequisitionPoints <= 0 )
	{
		// insert here to trigger a failure message and reloading the level
		Debug.Log("Loss State! At this point the game would probably pop up a message and then restart.");
	}
}// end of checkState

// Will be eventually used to calculate score, at the moment just prints the total number of req. spent,
// and the pollution level.
static public function calculateScore()
{
	Debug.Log("Requisition Spent: " + totalRequisitionSpent);
	Debug.Log("Pollution Level: " + pollutionLevel);
}// end of calculateScore