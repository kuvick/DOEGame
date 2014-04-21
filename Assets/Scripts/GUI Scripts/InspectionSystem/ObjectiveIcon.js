#pragma strict

public class ObjectiveIcon extends InspectionComponent
{
	private var position : Transform;

	private var iconWidthScale: float = .05; 	//The percent of the screens width that the Upgrade texture is wide. 
	private var iconWidth: float; 				//The actual width in pixels of the Upgrade image
	
	private var floatPercent: float = .10; 			//The percent of the screens height that the Upgrade GUI floats above the object
	private var floatHeight: float; 				//The actual height the Upgrade appears to float
	
	private var screenPosition:Vector3;

	private var iconOpacity:float = .50; 		//The opacity of the upgrade 1 = Normal, 0 = Invisible
	private var colorOpacity: Color;				//The color to convert to before drawing the Upgrade. Value of (1.0, 1.0, 1.0, .25) results in 25% opacity
	
	private var iconObject : GameObject;
	
	private var turnMesh : TextMesh;
	
	private var isPrimary : boolean = true;
	
	public var texture : Texture;
	
	private var resolvedTexture : Texture2D;
	private var unresolvedTexture : Texture2D;
	private var dataPickedUpTexture : Texture2D;
	private var isResolved : boolean = false;
	
	//Added to adjust icon scaling (GPC 8/16/13)
	private var iconScale : Vector3 = Vector3(7,7,7);
	
	private var eventID:int;
	
	private var objAnimation: InGameAnimation = new InGameAnimation();
	
	public function setID(num:int)
	{
		eventID = num;
	}
	
	public function getID():int
	{
		return eventID;
	}
	
	public function getIsPrimary():boolean
	{
		return isPrimary;
	}
	
	public function Initialize(pos : Transform, icon : Texture2D, inspIcon : Texture2D, resIcon : Texture2D, disp : Tooltip,
								type : BuildingEventType, turns : int)
	{
		// set icon textures
		normalTexture = icon;
		selectedTexture = inspIcon;
		renderer.material.mainTexture = normalTexture;
		texture = normalTexture;
		unresolvedTexture = texture;
		resolvedTexture = resIcon;
		// flip texture so not upside-down
		renderer.material.mainTextureScale = Vector2(-1,-1);
		renderer.material.mainTextureOffset = Vector2(1,1);
		
		position = pos;
		
		// set icon height above the terrain
		//transform.position.y = 50;
		
		//Modified local and world coordinates so they don't overlap over resource icons (GPC 8/16/13)
		transform.position.y += 80;
		transform.localPosition.y += 75;
		transform.position += Utils.ConvertToRotated(Vector3(0,0, -25));
		
		gameObject.transform.localScale = iconScale;
		
		gameObject.layer = 10;
		
		// set-up turn timer object
		var temp : GameObject = Instantiate(Resources.Load("ObjectiveTurnText") as GameObject, transform.position, Quaternion.Euler(90, 0, 0));
		
		//Tweaking icon position and scale (GPC 8/16/13)
		temp.transform.localPosition += Vector3(-25,5,-5);
		temp.transform.localScale = Vector3(1.25,1.25,1.25);
		temp.layer = 10;
		
		turnMesh = temp.GetComponent(TextMesh);
		if (type == BuildingEventType.Secondary)
		{
			turnMesh.active = false;
			isPrimary = false;
			dataPickedUpTexture = Resources.Load("dataSecondaryUnInspectedDATA") as Texture2D;
		}
		else
		{
			turnMesh.text = String.Empty + turns;
			dataPickedUpTexture = Resources.Load("dataPrimaryUnInspectedDATA") as Texture2D;
		}
		
		
		//Added by GPC 8/16/13
		temp.transform.parent = gameObject.transform;
		
		//Moved here so timer and text both have the same angle (GPC 8/16/13)
		gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
				
		Initialize(disp);
	}

	public function Initialize(pos : Transform, icon : Texture2D, text : String, pic : Texture2D,
								type : BuildingEventType, turns : int)
	{
		// slant icon slightly forward towards the camera
		//Moved this elsewhere so text and icon have same rotation (see below) (GPC 8/16/13)
		//gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
		
		// set icon textures
		normalTexture = icon;
		selectedTexture = icon;
		renderer.material.mainTexture = normalTexture;
		// flip texture so not upside-down
		renderer.material.mainTextureScale = Vector2(-1,-1);
		renderer.material.mainTextureOffset = Vector2(1,1);
		
		position = pos;
		
		// set icon height above the terrain
		//transform.position.y = 50;
		
		//Modified local and world coordinates so they don't overlap over resource icons (GPC 8/16/13)
		transform.position.y += 80;
		transform.localPosition.y += 75;
		
		gameObject.transform.localScale = iconScale;
		
		//Removing this so text can overlap over icon (GPC 8/16/13)
		//gameObject.layer = 10;
		
		// set-up turn timer object
		var temp : GameObject = Instantiate(Resources.Load("ObjectiveTurnText") as GameObject, transform.position, Quaternion.Euler(90, 0, 0));
		
		//Tweaking icon position and scale (GPC 8/16/13)
		temp.transform.localPosition += Vector3(-25,5,-5);
		temp.transform.localScale = Vector3(1.25,1.25,1.25);
		
		turnMesh = temp.GetComponent(TextMesh);
		if (type == BuildingEventType.Secondary)
		{
			turnMesh.active = false;
			isPrimary = false;
		}
		else
			turnMesh.text = String.Empty + turns;
		
		
		//Added by GPC 8/16/13
		temp.transform.parent = gameObject.transform;
		
		//Moved here so timer and text both have the same angle (GPC 8/16/13)
		gameObject.transform.rotation = Quaternion.EulerRotation(-Mathf.PI / 6, Mathf.PI / 4, 0);
				
		Initialize(text, pic);
	}
	
	public function OnSelected()
	{
		SendToDisplay();
	}
	
	// See ActivateAndDeactivate(disp : Tooltip) in InspectionDisplay
	public function OnSelectedFromHUD()
	{
		SendToDisplayFromHUD();
	}
	
	public function SetSelected(selected : boolean)
	{
		super(selected);
		renderer.material.mainTexture = currentTexture;
	}
	
	public function SetActive(active : boolean)
	{
		super(active);
		renderer.enabled = isActive;
		if (isPrimary)
			turnMesh.active = isActive;
	}
	
	public function SetResolved(res : boolean)
	{
		isResolved = res;
		var mainMenu : MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
		if (isResolved)
		{
			turnMesh.active = false;
			//normalTexture = resolvedTexture;
			resolvedObj = true;
			firstLoop = true;
			mainMenu.triggerObjIconChange(eventID, resolvedTexture);
			objAnimation.setVariablesForAnimation(this.gameObject.renderer.material, this.gameObject, unresolvedTexture, resolvedTexture, 0.05);
		}
		else
		{
			if(isPrimary)
				turnMesh.active = true;
			normalTexture = unresolvedTexture;
			
			if(resolvedObj)
			{
				//color1.a = 1.0f;
				resolvedObj = false;
				objAnimation.ResetTexture();
				//firstLoop = true;
				//switchScale = false;
				//this.gameObject.renderer.material = originalMaterial;
				//renderer.material.mainTexture = unresolvedTexture;
				//transform.localScale = originalScale;
			}
			mainMenu.triggerObjIconChange(eventID, unresolvedTexture);
		}
		currentTexture = normalTexture;
		renderer.material.mainTexture = currentTexture;
	}
	
	public function Draw()
	{
		super();
	}
	
	public function DrawTime(turnsLeft : String)
	{
		turnMesh.text = turnsLeft;
	}
	
	private var resolvedObj:boolean = false;
	private var firstLoop:boolean = true;
	private var originalMaterial:Material;
	private var blueMaterial : Material;
	private var color1:Color;
	private var color2:Color;
	private var speed:float = 0.05;
	private var originalScale:Vector3;
	
	private var switchScale:boolean;
	public var pickedUpData:boolean = false;
	
	public function isAnimating():boolean
	{
		return resolvedObj;
	}
	
	private var failBlink:boolean = false;
	function Update()
	{
		if (failBlink)
		{
			if (LinkUI.fadeTimer >= 0)
				this.gameObject.renderer.material.color = Color.Lerp(Color(1,1,1,0), Color(1,1,1,1), LinkUI.fadeTimer);
		}
		
		if(resolvedObj)
		{
		
			if(!objAnimation.Animate())
				resolvedObj = false;
		
		/*
			pickedUpData = false;
			if(firstLoop)
			{			
				originalScale = transform.localScale;
				switchScale = false;
				
				originalMaterial = this.gameObject.renderer.material;
				blueMaterial = Resources.Load("BuildingSite/BuildingAppear") as Material;
				
				this.gameObject.renderer.material = blueMaterial;
				
				blueMaterial.SetTexture("_MainTex", resolvedTexture);
				blueMaterial.SetTexture("_SubTex", unresolvedTexture);
				
				blueMaterial.mainTextureScale = Vector2(-1,-1);
				blueMaterial.mainTextureOffset = Vector2(1,1);
				
				
				blueMaterial.SetTextureOffset("_SubTex", Vector2(1,1));
				blueMaterial.SetTextureScale("_SubTex", Vector2(-1,-1));
				
				color1 = Color.white;
				color2 = Color.white;
				color1.a = 0f;
				color2.a = 1f;
				
				blueMaterial.SetColor("_Color1", color1);
				blueMaterial.SetColor("_Color2", color2);
				
				firstLoop = false;
			}
			
			color1.a += speed;
			color2.a = 1.0 - color1.a;
			
			if(!switchScale)
			{
				transform.localScale += Vector3((originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed);
				
				if(color1.a >= 0.5)
					switchScale = true;
			}
			else
			{
				transform.localScale -= Vector3((originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed);
			}
			
			if(color1.a >= 1.0)
			{
				color1.a = 1.0f;
				resolvedObj = false;
				firstLoop = true;
				switchScale = false;
				this.gameObject.renderer.material = originalMaterial;
				renderer.material.mainTexture = resolvedTexture;
				transform.localScale = originalScale;
			}
			blueMaterial.SetColor("_Color1", color1);
			blueMaterial.SetColor("_Color2", color2);
			
			*/
		}
	
		if(!resolvedObj && pickedUpData)
		{
		
			if(!objAnimation.Animate())
				pickedUpData = false;
				
				
			/*		
			if(firstLoop)
			{
				originalScale = transform.localScale;
				switchScale = false;
				
				originalMaterial = this.gameObject.renderer.material;
				blueMaterial = Resources.Load("BuildingSite/BuildingAppear") as Material;
				
				this.gameObject.renderer.material = blueMaterial;
				
				if(resolvedObj)
					blueMaterial.SetTexture("_MainTex", resolvedTexture);
				else
					blueMaterial.SetTexture("_MainTex", dataPickedUpTexture);
				blueMaterial.SetTexture("_SubTex", unresolvedTexture);
				
				blueMaterial.mainTextureScale = Vector2(-1,-1);
				blueMaterial.mainTextureOffset = Vector2(1,1);
				
				
				blueMaterial.SetTextureOffset("_SubTex", Vector2(1,1));
				blueMaterial.SetTextureScale("_SubTex", Vector2(-1,-1));
				
				color1 = Color.white;
				color2 = Color.white;
				color1.a = 0f;
				color2.a = 1f;
				
				blueMaterial.SetColor("_Color1", color1);
				blueMaterial.SetColor("_Color2", color2);
				
				firstLoop = false;
			}
			
			color1.a += speed;
			color2.a = 1.0 - color1.a;
			
			if(!switchScale)
			{
				transform.localScale += Vector3((originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed);
				
				if(color1.a >= 0.5)
					switchScale = true;
			}
			else
			{
				transform.localScale -= Vector3((originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed);
			}
			
			if(color1.a >= 1.0)
			{
				color1.a = 1.0f;
				pickedUpData = false;
				firstLoop = true;
				switchScale = false;
				this.gameObject.renderer.material = originalMaterial;
				if(resolvedObj)
					renderer.material.mainTexture = resolvedTexture;
				else
					renderer.material.mainTexture = dataPickedUpTexture;
				transform.localScale = originalScale;
			}
			blueMaterial.SetColor("_Color1", color1);
			blueMaterial.SetColor("_Color2", color2);
			*/
		}
	}
	
	public var animatePickup:boolean = false;
	public function pickedUpDataSetTrue()
	{
		objAnimation.setVariablesForAnimation(this.gameObject.renderer.material, this.gameObject, unresolvedTexture, dataPickedUpTexture, 0.05);
		pickedUpData = true;
		var mainMenu : MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
		mainMenu.triggerObjIconChange(eventID, dataPickedUpTexture);
		Debug.Log("ID IS " + eventID);
	}
	
	public function pickedUpDataSetFalse()
	{
		objAnimation.setVariablesForAnimation(this.gameObject.renderer.material, this.gameObject, dataPickedUpTexture, unresolvedTexture, 0.05);
		pickedUpData = true;
		var mainMenu : MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
		mainMenu.triggerObjIconChange(eventID, unresolvedTexture);
		Debug.Log("ID IS " + eventID);
	}
	
	public function resetTexture()
	{
		Debug.Log("called"); // I don't think this function is being used??
		/*
		var mainMenu : MainMenu = GameObject.Find("GUI System").GetComponent(MainMenu);
		mainMenu.triggerObjIconChange(eventID, unresolvedTexture);
		pickedUpData = false;
		color1.a = 1.0f;
		pickedUpData = false;

		this.gameObject.renderer.material = originalMaterial;
		renderer.material.mainTexture = unresolvedTexture;
		transform.localScale = originalScale;
		blueMaterial.SetColor("_Color1", color1);
		*/
	}
	
	public function TriggerLoss()
	{
		failBlink = true;
	}
	
}