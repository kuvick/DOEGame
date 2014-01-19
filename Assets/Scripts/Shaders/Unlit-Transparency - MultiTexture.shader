
// Unlit alpha-blended shader.
// - no lighting
// - no lightmap support
// - no per-material color

Shader "Custom/Unlit-Transparency-Multi" {
Properties {
	_Color1 ("Tint (A = Opacity)", Color) = (1,1,1,1)
	_Color2 ("Tint (A = Opacity)", Color) = (1,1,1,1) 
	_MainTex ("Base (RGB) Trans (A)", 2D) = "white" {}
	_SubTex ("Base (RGB) Trans (A)", 2D) = "white" {}
}

SubShader {
	Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
	LOD 100
	
	ZWrite Off
	Blend SrcAlpha OneMinusSrcAlpha 

	Pass {
		Lighting Off
		SetTexture [_MainTex] {
			ConstantColor [_Color1]
			Combine texture * constant
		} 
	}
	Pass {
		Lighting Off
		SetTexture [_SubTex] {
			ConstantColor [_Color2]
			Combine texture * constant
		} 
	}
}
}