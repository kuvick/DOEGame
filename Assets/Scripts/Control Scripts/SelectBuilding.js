/**********************************************************
SelectBuilding.js

Description: Script to select a gameobject (building)
Status: incomplete, this code needs to be integrated/ code can 
be used in other script.

Note: 

Author: Ajinkya Waghulde
**********************************************************/



function Start () {

}

function Update () {

//on left click
if ( Input.GetMouseButtonDown(0) )
   {

      var hit : RaycastHit;
      var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
      
      if (Physics.Raycast (ray, hit, 1000.0))
      {
         //Debug.Log(hit.collider.gameObject.name);
         
      }
   }
   /*else
   {
   		Debug.Log("not selected");   
   }*/
   
}
