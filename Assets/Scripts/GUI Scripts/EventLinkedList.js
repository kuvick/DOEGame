#pragma strict

class EventNode
{
	var data : BuildingEvent;
	var next : EventNode;
}

class EventLinkedList
{
	//Variables
	var head : EventNode;
	
	//Functions
	function InsertNode(be : BuildingEvent)
	{
		var en : EventNode = new EventNode();
		en.data = be;
		en.next = null;
		
		if(head == null)
		{
			head = en;
		}
		else
		{
			var currNode : EventNode = head;
			var prevNode : EventNode = null;
			while(currNode != null)
			{
				if(be.time > currNode.data.time)
				{
					break;
				}
				prevNode = currNode;
				currNode = currNode.next;
			}
			
			if(prevNode == null) //currNode is the head
			{
				var oldHead : EventNode = head;
				head = en;
				en.next = oldHead;
			}
			else
			{
				prevNode.next = en;
				en.next = currNode;
			}
		}
	}
	
	function DeleteNode(be : BuildingEvent)
	{
		if(head != null)
		{
			var currNode : EventNode = head;
			var prevNode : EventNode = null;
			while(currNode != null)
			{
				if(be == currNode.data)
				{
					break;
				}
				prevNode = currNode;
				currNode = currNode.next;
			}
			
			if(prevNode == null) //currNode is the head
			{
				head = head.next;
			}
			else
			{
				prevNode.next = currNode;
			}
		}
	}
	
	function Clear()
	{
		head = null;
	}
	
	function GetSize() : int
	{
		var currNode : EventNode = head;
		var size : int = 0;
		while(currNode != null)
		{
			++size;
			currNode = currNode.next;
		}
		
		return size;
	}
}