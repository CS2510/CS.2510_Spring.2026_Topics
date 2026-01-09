Here's what changed in the code:
```diff
renamed Day20.html to Day23.html with the following changes:
 <html>
 <head>
-    <title>Day 20 Game</title>
+    <title>Galaxy Guardians Space Shooter Game</title>
     <style>
         *{
             margin: 0;

added file game/data.json

updated game/components/ScoreController.js
     score = 0
     update(){
         this.gameObject.getComponent(Text).text = "Score: " + this.score
-        if(GameGlobals.highScore < this.score)
+        if(GameGlobals.highScore < this.score){
             GameGlobals.highScore = this.score
+            document.cookie = GameGlobals.highScore
         }
     }
+}

updated game/components/StartSceneController.js
 class StartSceneController extends Component{
     start(){
         this.time = 0
+        //Example of how to use cookies to persist data across sessions
+        if(document.cookie){
+            const score = parseInt(document.cookie)
+            if(score > GameGlobals.highScore)
+                GameGlobals.highScore = score
         }
+        document.cookie = "" + GameGlobals.highScore
+        //Example of how to read data from an external file
+        fetch("./game/data.json")
+        .then(result=>result.json())
+        .then(json=>console.log(json))
+    }
     update(){
         this.time += Time.deltaTime
```