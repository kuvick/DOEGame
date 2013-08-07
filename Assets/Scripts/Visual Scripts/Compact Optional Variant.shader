// Credit for all code goes to Arthur B. (Pvloon)
// Released to the Unify Community Wiki as part of a contest, for free or commercial use;
// HOWEVER, THIS NOTICE MUST BE RETAINED IF ANY OF THE FOLLOWING CODE IS USED.

// Upgrade NOTE: replaced 'V2F_POS_FOG' with 'float4 pos : SV_POSITION'

Shader "Terrain/Four Layer Toon Compat Optional" {
	Properties {
		_Color ("Main Color", Color) = (1,1,1,1)
		_MainTex ("Color 1 (RGB)", 2D) = "white" {}
		_MainTex2 ("Color 2 (RGB)", 2D) = "white" {}
		_MainTex3 ("Color 3 (RGB)", 2D) = "white" {}
		_MainTex4 ("Color 4 (RGB)", 2D) = "white" {}
		_Mask ("Mixing Mask (RGBA)", 2D) = "gray" {}
		_Ramp ("Toon Ramp (RGB)", 2D) = "gray" {} 
		_Base ("Base Color (RGB)", 2D) = "white" {}
		_LightCutoff("Light Cutoff", Range(0, 0.5)) = 0.05
	}

	Category {
		Lighting On
		Cull Back
		Fog { Color [_AddFog] }
		Subshader 
		{
			CGPROGRAM
			#pragma surface surf ToonRamp
				
			sampler2D _Ramp;
			float _LightCutoff;
			
			inline half4 LightingToonRamp (SurfaceOutput s, half3 lightDir, half atten)
			{
				#ifndef USING_DIRECTIONAL_LIGHT
				lightDir = normalize(lightDir);
				#endif
	
				half d = dot (s.Normal, lightDir)*0.5 + 0.5;

				half3 ramp = tex2D (_Ramp, float2(d,d)).rgb;
	
				half4 c;

				if (atten > (1.0 - _LightCutoff))
					atten = 1.0;
				else if (atten < _LightCutoff)
					atten = 0;

				c.rgb = s.Albedo * _LightColor0.rgb * ramp * (atten * 2);
				c.a = 0;
				return c;
			}

			sampler2D _MainTex;
			sampler2D _MainTex2;

			sampler2D _Mask;
			float4 _Color;

			struct Input {			
				float4 pos : SV_POSITION;
				float2 uv_MainTex;
				float2 uv_MainTex2;

				float2 uv_Mask;
				float2 uv_Base;


				float4 diffuse : COLOR;
			};


			void surf (Input IN, inout SurfaceOutput o) {
			
				// get the first three layer colors
				half4 color1 = tex2D( _MainTex, IN.uv_MainTex);
				half4 color2 = tex2D( _MainTex2, IN.uv_MainTex2);


				// get the mixing mask texture
				half4 mask = tex2D( _Mask, IN.uv_Mask.xy);
				// mix the three layers
				
				half4 color = color1 * mask.r + color2 * mask.g;

				o.Albedo = color.rgb;
				o.Alpha = color.a;
			}
			
			ENDCG 

			Blend one one

			CGPROGRAM
			#pragma surface surf ToonRamp
				
			sampler2D _Ramp;
			float _LightCutoff;
			
			inline half4 LightingToonRamp (SurfaceOutput s, half3 lightDir, half atten)
			{
				#ifndef USING_DIRECTIONAL_LIGHT
				lightDir = normalize(lightDir);
				#endif
	
				half d = dot (s.Normal, lightDir)*0.5 + 0.5;

				half3 ramp = tex2D (_Ramp, float2(d,d)).rgb;
	
				half4 c;

				if (atten > (1.0 - _LightCutoff))
					atten = 1.0;
				else if (atten < _LightCutoff)
					atten = 0;

				c.rgb = s.Albedo * _LightColor0.rgb * ramp * (atten * 2);
				c.a = 0;
				return c;
			}


			sampler2D _MainTex3;
			sampler2D _MainTex4;
			sampler2D _Mask;
			float4 _Color;

			struct Input {			
				float4 pos : SV_POSITION;

				float2 uv_MainTex3;
				float2 uv_MainTex4;
				float2 uv_Mask;
				float2 uv_Base;


				float4 diffuse : COLOR;
			};



			void surf (Input IN, inout SurfaceOutput o) {
			
				// get the first three layer colors

				half4 color3 = tex2D( _MainTex3, IN.uv_MainTex3);
				half4 color4 = tex2D( _MainTex4, IN.uv_MainTex4);

				// get the mixing mask texture
				half4 mask = tex2D( _Mask, IN.uv_Mask.xy);


				// mix the three layers
				half4 color = color3 * mask.b + color4 * mask.a;

				o.Albedo = color.rgb;
				o.Alpha = color.a;
			}
			
			ENDCG 
		}
	}

    // ------------------------------------------------------------------
    // Radeon 7000 / 9000
    SubShader {
        Pass {
            Material {
                Diffuse [_Color]
                Ambient [_Color]
            } 
            Lighting On
            SetTexture [_Base] {
                Combine texture * primary DOUBLE, texture * primary
            }
        }
    }
}