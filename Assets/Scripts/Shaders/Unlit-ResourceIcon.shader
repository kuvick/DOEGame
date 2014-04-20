
// Unlit alpha-blended shader.
// - no lighting
// - no lightmap support
// - no per-material color


Shader "Custom/Unlit-ResourceIcon" {
Properties {
	_Color1 ("Tint (A = Opacity)", Color) = (1,1,1,1)
	_Color2 ("Tint (A = Opacity)", Color) = (1,1,1,1) 
	_Color3 ("Tint (A = Opacity)", Color) = (1,1,1,1) 
	_IconTex ("Base (RGB) Trans (A)", 2D) = "white" {}
	_TopBGTex ("Base (RGB) Trans (A)", 2D) = "white" {}
	_BottomBGTex ("Base (RGB) Trans (A)", 2D) = "white" {}
}

SubShader {
	Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
	LOD 100
	
	ZWrite Off
	Blend SrcAlpha OneMinusSrcAlpha 


	Pass {
		Lighting Off
		SetTexture [_BottomBGTex] {
			ConstantColor [_Color3]
			Combine texture * constant
		} 
	}
	Pass {
		Lighting Off
		SetTexture [_TopBGTex] {
			ConstantColor [_Color2]
			Combine texture * constant
		} 
	}	
	Pass {
		Lighting Off
		SetTexture [_IconTex] {
			ConstantColor [_Color1]
			Combine texture * constant
		} 
	}
	
	
}
}
