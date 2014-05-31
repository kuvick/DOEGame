
// Unlit alpha-blended shader.
// - no lighting
// - no lightmap support
// - no per-material color

Shader "Custom/Unlit-Transparency" {
Properties {
	_Color ("Tint (A = Opacity)", Color) = (1,1,1,1) 
	_MainTex ("Base (RGB) Trans (A)", 2D) = "white" {}
}

SubShader {
	Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
	LOD 100
	
	ZWrite Off
	Blend SrcAlpha OneMinusSrcAlpha     
	//Blend One OneMinusSrcAlpha 

	Pass {
		Lighting Off
		SetTexture [_MainTex] {
			ConstantColor [_Color]
			Combine texture * constant
		} 
	}
}
}