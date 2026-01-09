Here's what changed in the code:
```diff
renamed Day15.html to Day17.html with the following changes:
 <html>
 <head>
-    <title>Day 15 Game</title>
+    <title>Day 17 Game</title>
     <style>
         *{
             margin: 0;

updated engine/Engine.js
         addEventListener("mouseup", Input.mouseup)
         addEventListener("mousemove", Input.mousemove)
         //Game-specific
+        SceneManager.update()
         SceneManager.getActiveScene().start()
         Engine.gameLoop()
     }
     //Engine-specific code
     static gameLoop() {
+        SceneManager.update()
         Engine.update()
         Engine.draw()
         Input.update()

updated engine/SceneManager.js
 class SceneManager{
     static currentScene
+    static nextScene
+    static update(){
+        if(SceneManager.nextScene){
+            SceneManager.currentScene = SceneManager.nextScene
+            SceneManager.nextScene = undefined
+        }
+    }
     static loadScene(scene){
-        SceneManager.currentScene = scene
+        SceneManager.nextScene = scene
     }
-    static getActiveScene(scene){
+    static getActiveScene(){
         return SceneManager.currentScene
     }
 }
```