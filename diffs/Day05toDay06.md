Here's what changed in the code:
```diff
renamed Day05.html to Day06.html with the following changes:
 <html>
 <head>
-    <title>Day 05 Game</title>
+    <title>Day 06 Game</title>
     <style>
         *{
             margin: 0;
...
     <script src="./engine/GameObject.js"></script>
     <script src="./engine/Component.js"></script>
     <script src="./engine/Input.js"></script>
+    <script src="./engine/Engine.js"></script>
     <script src="./engine/components/Transform.js"></script>
     <script src="./engine/components/Polygon.js"></script>
...
     <script src="./game/prefabs/TriangleGameObject.js"></script>
     <script src="./game/prefabs/SquareGameObject.js"></script>
+    <script src="./game/prefabs/LaserGameObject.js"></script>
     <script src="./game/components/TriangleController.js"></script>
     <script src="./game/components/SquareController.js"></script>
+    <script src="./game/components/LaserController.js"></script>
     <script>
-        //Engine-specific code
-        const canvas = document.querySelector("#canv")
-        const ctx = canvas.getContext("2d")
-        const currentScene = new MainScene()
-        //Engine-specific
-        function start() {
-            //Game-specific
-            currentScene.start()
-            gameLoop()
-        }
-        //Engine-specific code
-        function gameLoop() {
-            update()
-            draw()
-            requestAnimationFrame(gameLoop)
-        }
-        //Engine-specific
-        function update() {
-            currentScene.update()            
-        }
-        //Engine-specific
-        function draw() {
-            canvas.width = window.innerWidth
-            canvas.height = window.innerHeight
-            //Game-specific
-            ctx.fillStyle = "green"
-            ctx.beginPath()
-            ctx.rect(0, 0, canvas.width, canvas.height)
-            ctx.fill()
-            currentScene.draw(ctx)
-        }
-        //Engine-specific
-        requestAnimationFrame(start)
-        addEventListener("keydown", Input.keydown)
-        addEventListener("keyup", Input.keyup)
+        Engine.currentScene = new MainScene()
+        Engine.start()
     </script>
 </body>

deleted file BeforeClass/Day05.html

deleted file BeforeClass/engine/Component.js

deleted file BeforeClass/engine/components/Polygon.js

deleted file BeforeClass/engine/components/Transform.js

deleted file BeforeClass/engine/GameObject.js

deleted file BeforeClass/engine/Input.js

deleted file BeforeClass/engine/Scene.js

deleted file BeforeClass/engine/Vector2.js

deleted file BeforeClass/game/components/SquareController.js

deleted file BeforeClass/game/components/TriangleController.js

deleted file BeforeClass/game/prefabs/FastTriangleGameObject.js

deleted file BeforeClass/game/prefabs/SquareGameObject.js

deleted file BeforeClass/game/prefabs/TriangleGameObject.js

deleted file BeforeClass/game/scenes/MainScene.js

added file engine/Engine.js

added file game/components/LaserController.js

added file game/prefabs/LaserGameObject.js

updated engine/Vector2.js
         this.x += other.x
         this.y += other.y
     }
+    clone(){
+        return new Vector2(this.x, this.y)
     }
+}

updated game/components/SquareController.js
         // this.transform.position = new Vector2(100, 100)
         this.velocity = new Vector2(1, 1)
+        this.nextFireFrame = 10
+        this.frame = 0
     }
     update() {
+        this.frame++
         console.log(Input.keysDown)
...
         }
         this.transform.position.plusEquals(proposedChange)
+        if(this.frame >= this.nextFireFrame){
+            Engine.currentScene.instantiate(new LaserGameObject(), this.transform.position.clone())
+            this.nextFireFrame = this.frame + 10
         }
     }
+}

updated game/components/TriangleController.js
     update() {
         this.transform.position.plusEquals(this.velocity)
-        if (this.transform.position.x > canvas.width || this.transform.position.x < 0) {
+        if (this.transform.position.x > Engine.canvas.width || this.transform.position.x < 0) {
             this.velocity.x *= -1
         }
-        if (this.transform.position.y > canvas.height || this.transform.position.y < 0) {
+        if (this.transform.position.y > Engine.canvas.height || this.transform.position.y < 0) {
             this.velocity.y *= -1
         }
     }
```