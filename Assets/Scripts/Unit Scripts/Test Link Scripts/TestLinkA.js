#pragma strict

function Start () {
	var test : BuildingOnGrid = Database.getBuildingOnGridAtIndex(0);
	var testb : LinkUI = gameObject.GetComponent(LinkUI);
	
	test.outputLinkedTo.Add(1);//linkedTo.Add(1);
	test.outputLinkedTo.Add(4);//linkedTo.Add(4);
	test = Database.getBuildingOnGridAtIndex(1);
	test.heldUpgrade = UpgradeType.Blue;
	test.inputLinkedTo.Add(0);//linkedTo.Add(0);
	testb.linkReference[0,1] = testb.linkReference[1,0] = true;
	Database.toggleActiveness(0);
	Database.toggleActiveness(1);
	testb.linkReference[0,4] = testb.linkReference[4,0] = true;
	
	test.outputLinkedTo.Add(2);//linkedTo.Add(2);
	test = Database.getBuildingOnGridAtIndex(2);
	test.inputLinkedTo.Add(1);//linkedTo.Add(1);
	testb.linkReference[2,1] = testb.linkReference[1,2] = true;
	Database.toggleActiveness(2);
	
	test.outputLinkedTo.Add(3);//linkedTo.Add(3);
	test = Database.getBuildingOnGridAtIndex(3);
	test.inputLinkedTo.Add(2);//linkedTo.Add(2);
	testb.linkReference[2,3] = testb.linkReference[3,2] = true;
	Database.toggleActiveness(3);
	
	test.outputLinkedTo.Add(4);//linkedTo.Add(4);
	test = Database.getBuildingOnGridAtIndex(4);
	test.inputLinkedTo.Add(3);//linkedTo.Add(3);
	testb.linkReference[4,3] = testb.linkReference[3,4] = true;
	Database.toggleActiveness(4);
	test.inputLinkedTo.Add(0);//linkedTo.Add(0);
}

function Update () {

}