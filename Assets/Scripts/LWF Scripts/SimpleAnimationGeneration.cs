/*
 * Script from the Unity tutorial:
 * https://github.com/gree/lwf/wiki/ForUnity
 * 
 * 
 * Added in public variable so you don't have to edit
 * the script to change the asset it is loading.
 *
 * Attach this to a GameObject to generate animation.
 *
 */

using UnityEngine;
using System.Collections;

public class SimpleAnimationGeneration : LWFObject
{
	// Note: do NOT put in ".lwfdata" into the asset name
	public string assetName;
	
	void Start()
	{
		setLoader();
		// #1 Show popup lwf/textures
		//Load("twoShapes.lwfdata/twoShapes", "twoShapes.lwfdata/");
		Load(assetName + ".lwfdata/" + assetName, assetName + ".lwfdata/");
	}


	void setLoader()
	{
		LWFObject.SetLoader(
			lwfDataLoader:(name) => {
				TextAsset asset = Resources.Load(name) as TextAsset;
				if (asset == null) {
					return null;
				}
				return asset.bytes;
			},
			textureLoader:(name) => {
				Texture2D texture = Resources.Load(name) as Texture2D;
				if (texture == null) {
					return null;
				}
				return texture;
			}
		);
	}
}