// JavaScript example:
// Taken from the Unity website, use to see how an editor window is implemented with EditorPrefs.


class MyWindow extends EditorWindow
{
    var myString = "Hello World";
    var groupEnabled = false;
    var myBool = true;
    var myFloat = 1.23;
    
    // Add menu named "My Window" to the Window menu
    @MenuItem ("Window/Test Window for Editor")
    static function Init ()
    {
        // Get existing open window or if none, make a new one:        
        var window = ScriptableObject.CreateInstance.<MyWindow>();
        
        window.Show();
    }
    
    function OnGUI ()
    {
        GUILayout.Label ("Base Settings", EditorStyles.boldLabel);
            myString = EditorGUILayout.TextField ("Text Field", myString);
        
        groupEnabled = EditorGUILayout.BeginToggleGroup ("Optional Settings", groupEnabled);
            myBool = EditorGUILayout.Toggle ("Toggle", myBool);
            myFloat = EditorGUILayout.Slider ("Slider", myFloat, -3, 3);
        EditorGUILayout.EndToggleGroup ();
    }
    
    function OnEnable()
    {
		if(EditorPrefs.HasKey("myString"))
			myString = EditorPrefs.GetString("myString");
		if(EditorPrefs.HasKey("myString"))
			groupEnabled = EditorPrefs.GetBool("groupEnabled");
		if(EditorPrefs.HasKey("myString"))
			myBool = EditorPrefs.GetBool("myBool");
		if(EditorPrefs.HasKey("myString"))
			myFloat = EditorPrefs.GetFloat("myFloat");

	}
	
	function OnDisable()
	{
    	EditorPrefs.SetString("myString", myString);
   		EditorPrefs.SetBool("groupEnabled", groupEnabled);
   		EditorPrefs.SetBool("myBool", myBool);
   		EditorPrefs.SetFloat("myFloat", myFloat);
	}
	
	function OnDestroy()
	{
    	OnDisable();
	}
	
}