#pragma strict

function Start () {
	var test : BuildingOnGrid = Database.getBuildingOnGridAtIndex(0);
	var testb : LinkUI = gameObject.GetComponent(LinkUI);
	
	test.linkedTo.Add(1);
	test.linkedTo.Add(4);
	test = Database.getBuildingOnGridAtIndex(1);
	test.heldUpgrade = UpgradeType.BLUE;
	test.linkedTo.Add(0);
	testb.linkReference[0,1] = testb.linkReference[1,0] = true;
	Database.toggleActiveness(0);
	Database.toggleActiveness(1);
	testb.linkReference[0,4] = testb.linkReference[4,0] = true;
	
	test.linkedTo.Add(2);
	test = Database.getBuildingOnGridAtIndex(2);
	test.neededUpgrade = UpgradeType.BLUE;
	test.linkedTo.Add(1);
	testb.linkReference[2,1] = testb.linkReference[1,2] = true;
	Database.toggleActiveness(2);
	
	test.linkedTo.Add(3);
	test = Database.getBuildingOnGridAtIndex(3);
	test.linkedTo.Add(2);
	testb.linkReference[2,3] = testb.linkReference[3,2] = true;
	Database.toggleActiveness(3);
	
	test.linkedTo.Add(4);
	test = Database.getBuildingOnGridAtIndex(4);
	test.linkedTo.Add(3);
	testb.linkReference[4,3] = testb.linkReference[3,4] = true;
	Database.toggleActiveness(4);
	test.linkedTo.Add(0);
}

function Update () {

}