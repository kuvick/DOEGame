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




AUG 15 UPDATE, IMPORTANT:
Yes, EditorPrefs can create persistent data, but the problem is that the scripts within the editor only run WHILE THE EDITOR IS OPEN. Thus to load the data into the game,
you must include it within a script that runs while the game is playing (for example, for the requisistion system and the database, there is now a loadData function to actually
load the data within the game; we might want to have a seperate script that we can just add this to that just loads all the editor data into the game at once.