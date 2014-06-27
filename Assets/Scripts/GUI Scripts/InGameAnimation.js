#pragma strict

public class InGameAnimation
{
	private var firstLoop:boolean = true;
	private var originalMaterial:Material;
	private var newMaterial : Material;
	private var color1:Color;
	private var color2:Color;
	private var speed:float = 0.05;
	private var originalScale:Vector3;
	private var switchScale:boolean;
	private var animatedObject : GameObject = null;
	private var startTexture : Texture;
	private var endTexture : Texture;
	
	public function getEndTexture():Texture
	{
		return endTexture;
	}
	
	public function setVariablesForAnimation(origMat:Material, gameObj:GameObject, oldTexture:Texture, newTexture:Texture, spd: float)
	{
		firstLoop = true;
		switchScale = false;
		originalMaterial = origMat;
		speed = spd;
		animatedObject = gameObj;
		startTexture = oldTexture;
		endTexture = newTexture;
		originalScale = gameObj.transform.localScale;
		color1 = Color.white;
		color2 = Color.white;
	}
	
	public function setVariablesForAnimation(origMat:Material, gameObj:GameObject, oldTexture:Texture, newTexture:Texture, spd: float, oScale:Vector3)
	{
		firstLoop = true;
		switchScale = false;
		originalMaterial = origMat;
		speed = spd;
		animatedObject = gameObj;
		startTexture = oldTexture;
		endTexture = newTexture;
		originalScale = oScale;
		color1 = Color.white;
		color2 = Color.white;
	}
	
	
	public function setVariablesForAnimation(origMat:Material, gameObj:GameObject, oldTexture:Texture, newTexture:Texture, spd: float, c1:Color, c2: Color)
	{
		firstLoop = true;
		switchScale = false;
		originalMaterial = origMat;
		speed = spd;
		animatedObject = gameObj;
		startTexture = oldTexture;
		endTexture = newTexture;
		originalScale = gameObj.transform.localScale;
		color1 = c1;
		color2 = c2;
	}

	public function Animate():boolean // returns true if animating, false if not
	{
		if(firstLoop)
		{			
			switchScale = false;
			
			newMaterial = Resources.Load("InGameAnimation") as Material;
			
			animatedObject.renderer.material = newMaterial;
			
			newMaterial.SetTexture("_MainTex", endTexture);
			newMaterial.SetTexture("_SubTex", startTexture);
			
			newMaterial.mainTextureScale = Vector2(-1,-1);
			newMaterial.mainTextureOffset = Vector2(1,1);
			
			
			newMaterial.SetTextureOffset("_SubTex", Vector2(1,1));
			newMaterial.SetTextureScale("_SubTex", Vector2(-1,-1));
			
			color1.a = 0f;
			color2.a = 1f;
			
			newMaterial.SetColor("_Color1", color1);
			newMaterial.SetColor("_Color2", color2);
			
			firstLoop = false;
		}
		
		color1.a += speed;
		color2.a = 1.0 - color1.a;
		
		if(!switchScale)
		{
			animatedObject.transform.localScale += Vector3((originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed);
			
			if(color1.a >= 0.5)
				switchScale = true;
		}
		else
		{
			animatedObject.transform.localScale -= Vector3((originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed, (originalScale.x * 2) *  speed);
		}
		
		if(color1.a >= 1.0)
		{
			color1.a = 1.0f;
			//resolvedObj = false;
			firstLoop = true;
			switchScale = false;
			animatedObject.renderer.material = originalMaterial;
			animatedObject.renderer.material.mainTexture = endTexture;
			animatedObject.transform.localScale = originalScale;
			return false;
		}

		
		newMaterial.SetColor("_Color1", color1);
		newMaterial.SetColor("_Color2", color2);
		return true;
	}//end of animate
	
	public function AnimateRing():boolean // returns true if animating, false if not
	{
		if(firstLoop)
		{			
			switchScale = false;
			
			newMaterial = Resources.Load("SwapTextures") as Material;
			
			animatedObject.renderer.material = newMaterial;
			
			newMaterial.SetTexture("_MainTex", endTexture);
			newMaterial.SetTexture("_SubTex", startTexture);
			
			newMaterial.mainTextureScale = Vector2(-1,-1);
			newMaterial.mainTextureOffset = Vector2(1,1);
			
			
			newMaterial.SetTextureOffset("_SubTex", Vector2(1,1));
			newMaterial.SetTextureScale("_SubTex", Vector2(-1,-1));
			
			color1.a = 0f;
			color2.a = 1f;
			
			newMaterial.SetColor("_Color1", color1);
			newMaterial.SetColor("_Color2", color2);
			
			firstLoop = false;
		}
		
		color1.a += speed;
		color2.a = 1.0 - color1.a;
		
		if(!switchScale)
		{
			animatedObject.transform.localScale += Vector3((originalScale.x * 1.5) *  speed, (originalScale.x * 1.5) *  speed, (originalScale.x * 1.5) *  speed);
			
			if(color1.a >= 0.5)
				switchScale = true;
		}
		else
		{
			animatedObject.transform.localScale -= Vector3((originalScale.x * 1.5) *  speed, (originalScale.x * 1.5) *  speed, (originalScale.x * 1.5) *  speed);
		}
		
		if(color1.a >= 1.0)
		{
			color1.a = 1.0f;
			//resolvedObj = false;
			firstLoop = true;
			switchScale = false;
			animatedObject.renderer.material = originalMaterial;
			animatedObject.renderer.material.mainTexture = endTexture;
			animatedObject.transform.localScale = originalScale;
			return false;
		}

		
		newMaterial.SetColor("_Color1", color1);
		newMaterial.SetColor("_Color2", color2);
		return true;
	}//end of animate	
	
	public function ResetTexture()
	{
		animatedObject.renderer.material = originalMaterial;
		animatedObject.transform.localScale = originalScale;
		animatedObject.renderer.material.mainTexture = startTexture;
	}
	//*****************************************************************************************************
	
	
	
	private var ringColor:Color;
	private var backColor:Color;
	private var iconColor:Color;
	private var iconIsGrowingTransparent:boolean;
	private var ringIsGrowingTransparent:boolean;
	private var stopColorChange:boolean = false;
	private var twiceScale:Vector3;
	private var newScale:float;
	private var hasCompletedRingAnimation:boolean;
	private var ringImages:Object[];
	private var currentIndex:int = 0;
	private var savedTexture:Texture;
	
	public function AnimateResource(obj:GameObject, defaultScale:Vector3, ringColorStart:Color, ringColorEnd:Color, iconColorStart:Color, iconColorEnd:Color, type: IOType, changeImage:boolean, hold:boolean, sizeDiff:float, isFixed:boolean):boolean // returns true if animating, false if not
	{
		if(isFixed)
			type = IOType.Out;
		if(firstLoop)
		{
			currentIndex = 0;
			hasCompletedRingAnimation = false;
			switchScale = false;
			speed = 0.05;
			stopColorChange = false;
			animatedObject = obj;
			animatedObject.transform.localScale = defaultScale;
			twiceScale = new Vector3(defaultScale.x * sizeDiff, defaultScale.y * sizeDiff, defaultScale.z * sizeDiff);
			
			var allocatedBottomBGTex : Texture2D = Resources.Load("ResourceIcons/allocatedbottom_out") as Texture2D;
			animatedObject.renderer.material.SetTexture("_BottomBGTex", allocatedBottomBGTex);
		
		
			animatedObject.renderer.material.SetTextureScale("_IconTex", Vector2(-1,-1));
			animatedObject.renderer.material.SetTextureScale("_TopBGTex", Vector2(-1,-1));
			animatedObject.renderer.material.SetTextureScale("_BottomBGTex", Vector2(-1,-1));
			
			animatedObject.renderer.material.SetTextureOffset("_IconTex", Vector2(1,1));
			animatedObject.renderer.material.SetTextureOffset("_TopBGTex", Vector2(1,1));
			animatedObject.renderer.material.SetTextureOffset("_BottomBGTex", Vector2(1,1));
			
			animatedObject.renderer.material.SetColor("_Color2", ringColorStart);
			animatedObject.renderer.material.SetColor("_Color3", ringColorStart);	
			animatedObject.renderer.material.SetColor("_Color1", Color.white); 	//UNALLOCATED SET
			
			ringColor = ringColorStart;
			backColor = Color(132f / 255f, 149f / 255f, 159f / 255f);		
			iconColor = iconColorStart;
			
			newScale = 1.0f;
			
			firstLoop = false;
			
			var path : String;
			
			savedTexture = animatedObject.renderer.material.GetTexture("_TopBGTex");
			
			if (type == IOType.In)
			{
				//savedTexture = animatedObject.renderer.material.GetTexture("_BottomBGTex");
				path = "ResourceIcons/Input";
				
				var tempArray:Object[] = Resources.LoadAll(path, Texture);
				ringImages = new Object[tempArray.Length * 3];
				
				for(var g:int = 0; g < tempArray.Length; g++)
				{
					ringImages[g] = tempArray[g];
					ringImages[g + tempArray.length] = tempArray[g];
					ringImages[g + tempArray.length + tempArray.length] = tempArray[g];
				}				
			}
			else if(type == IOType.OptOut) // *****
			{
				path = "ResourceIcons/OptOutput";
				ringImages = Resources.LoadAll(path, Texture);
			}
			else
			{
				//savedTexture = animatedObject.renderer.material.GetTexture("_TopBGTex");
				path = "ResourceIcons/Output";
				ringImages = Resources.LoadAll(path, Texture);
			}
				
			if(changeImage)
				selectCurrentFrame(type, ringImages.Length, 0.6);
		}
		
		ringColor = Color.Lerp(ringColor, ringColorEnd, 0.05);
		iconColor = Color.Lerp(iconColor, iconColorEnd, 0.05);
		
		if (type == IOType.In)
			backColor = Color.Lerp(backColor, Color.black, 0.05);
		//else
			//backColor = Color.Lerp(backColor, Color.white, 0.05);
		
		
		if(!switchScale)
		{
			animatedObject.transform.localScale += Vector3((defaultScale.x * sizeDiff) *  speed, (defaultScale.x * sizeDiff) *  speed, (defaultScale.x * sizeDiff) *  speed);
			
			newScale -= speed;
			animatedObject.renderer.material.SetTextureScale("_IconTex", Vector2(-newScale,-newScale));
			animatedObject.renderer.material.SetTextureScale("_TopBGTex", Vector2(-1,-1));	
			animatedObject.renderer.material.SetTextureScale("_BottomBGTex", Vector2(-1,-1));
			
			animatedObject.renderer.material.SetTextureOffset("_IconTex", Vector2((1 + newScale) / 2, (1 + newScale) / 2));
			animatedObject.renderer.material.SetTextureOffset("_TopBGTex", Vector2(1,1));
			animatedObject.renderer.material.SetTextureOffset("_BottomBGTex", Vector2(1,1));
				
			if(animatedObject.transform.localScale.x >= twiceScale.x)
				switchScale = true;
				
		}
		else if(!hold)
		{
			animatedObject.transform.localScale -= Vector3((defaultScale.x * sizeDiff) *  speed, (defaultScale.x * sizeDiff) *  speed, (defaultScale.x * sizeDiff) *  speed);
			
			newScale += speed;
			animatedObject.renderer.material.SetTextureScale("_IconTex", Vector2(-newScale,-newScale));
			animatedObject.renderer.material.SetTextureScale("_TopBGTex", Vector2(-1,-1));	
			animatedObject.renderer.material.SetTextureScale("_BottomBGTex", Vector2(-1,-1));
			
			animatedObject.renderer.material.SetTextureOffset("_IconTex", Vector2((1 + newScale) / 2, (1 + newScale) / 2));
			animatedObject.renderer.material.SetTextureOffset("_TopBGTex", Vector2(1,1));
			animatedObject.renderer.material.SetTextureOffset("_BottomBGTex", Vector2(1,1));
		}		
		
		if(animatedObject.transform.localScale.x <= defaultScale.x)
		{
			//resolvedObj = false;
			firstLoop = true;
			switchScale = false;
			animatedObject.transform.localScale = defaultScale;
			animatedObject.renderer.material.SetColor("_Color2", ringColorEnd);
			if (type == IOType.In)
				animatedObject.renderer.material.SetColor("_Color3", Color.black);	
			//else
				//animatedObject.renderer.material.SetColor("_Color3", Color.white);
				
			animatedObject.renderer.material.SetColor("_Color1", Color.white); 	//UNALLOCATED SET
			
			
				//animatedObject.renderer.material.SetTexture("_BottomBGTex", savedTexture);
			if (type == IOType.In)
				animatedObject.renderer.material.SetTexture("_TopBGTex", savedTexture);
						
			return false;
		}
		else if(currentIndex < ringImages.Length && changeImage)
		{
			selectCurrentFrame(type, ringImages.Length, 0.6);
		}
		
		animatedObject.renderer.material.SetColor("_Color2", ringColor);
		//animatedObject.renderer.material.SetColor("_Color3", ringColor);
		if (type != IOType.In)
			animatedObject.renderer.material.SetColor("_Color3", ringColor);	
		else
			animatedObject.renderer.material.SetColor("_Color3", backColor);
			
			
		animatedObject.renderer.material.SetColor("_Color1", Color.white); 	//UNALLOCATED SET
		return true;
	}//end of animate
	

	private var previousTime:int = 0;
	
	public function selectCurrentFrame(type: IOType, numOfSlides:int, lengthOfAnimation:float)
	{
		//if(previousTime < 2)
			//previousTime ++;
		//else if(previousTime > (lengthOfAnimation / numOfSlides))
		//else if(currentIndex < ringImages.Length)
		if(currentIndex < ringImages.Length)
		{
			var newTexture:Texture = ringImages[currentIndex];
			//
			//	animatedObject.renderer.material.SetTexture("_BottomBGTex", newTexture);
			//else
			animatedObject.renderer.material.SetTexture("_TopBGTex", newTexture);
				
				
			currentIndex++;
			
			//previousTime = 0;
		}	
			
			
		
	}
}