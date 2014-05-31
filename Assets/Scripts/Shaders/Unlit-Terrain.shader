
// Unlit alpha-blended shader.
// - no lighting
// - no lightmap support
// - no per-material color

Shader "Custom/Unlit-Terrain" {
Properties {
	_Color ("Tint (A = Opacity)", Color) = (1,1,1,1) 
	_MainTex ("Base (RGB) Trans (A)", 2D) = "white" {}
}

SubShader {
Tags { "RenderType"="Opaque" "IgnoreProjector"="True" }
	LOD 100
	
	ZWrite Off

	Pass {
		Lighting Off
		SetTexture [_MainTex] {
			ConstantColor [_Color]
			Combine texture * constant
		} 
	}
}
}