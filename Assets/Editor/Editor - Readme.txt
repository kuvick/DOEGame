This folder should be used for any custom windows to be used for editing.

Be sure to read this page:
http://docs.unity3d.com/Documentation/Components/gui-ExtendingEditor.html


Note that if we're doing these in javascript, in the Init() function add "window.Show();" to the end of that function.


Other helpful Links:
http://docs.unity3d.com/Documentation/ScriptReference/EditorGUI.html
http://docs.unity3d.com/Documentation/ScriptReference/EditorGUILayout.html
http://docs.unity3d.com/Documentation/ScriptReference/20_class_hierarchy.Editor_Classes.html
docs.unity3d.com/Documentation/ScriptReference/ScriptableObject.html

http://docs.unity3d.com/Documentation/ScriptReference/MenuItem.html
http://docs.unity3d.com/Documentation/ScriptReference/EditorWindow.html





ALSO, must use this to save values:
http://docs.unity3d.com/Documentation/ScriptReference/EditorPrefs.html

Load them in OnEnable and write them in OnDisable and you're done.





Also, might want to look into this for data based scripts:
http://docs.unity3d.com/Documentation/ScriptReference/ScriptableObject.html