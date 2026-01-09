Here's what changed in the code:
```diff
renamed Day03.html to Day04.html with the following changes:
 <html>
 <head>
-  <title>Day 01 Game</title>
+    <title>Day 04 Game</title>
 </head>
 <body>
     <canvas id="canv"></canvas>
-  <script src="Day02.Vector2.js"></script>
-  <script src="Day03.Scene.js"></script>
-  <script src="Day03.GameObject.js"></script>
-  <script src="Day03.Component.js"></script>
+    <!-- Engine-specific Code -->
+    <script src="./engine/Vector2.js"></script>
+    <script src="./engine/Scene.js"></script>
+    <script src="./engine/GameObject.js"></script>
+    <script src="./engine/Component.js"></script>
+    <script src="./engine/Input.js"></script>
+    <!-- Game-specific Code -->
+    <script src="./game/MainScene.js"></script>
+    <script src="./game/TriangleGameObject.js"></script>
+    <script src="./game/TriangleController.js"></script>
+    <script src="./game/SquareGameObject.js"></script>
+    <script src="./game/SquareController.js"></script>
     <script>
-    class MainScene extends Scene {
-      constructor() {
-        super()
-        this.gameObjects.push(new TriangleGameObject())
-        this.gameObjects.push(new TriangleGameObject())
-      }
-    }
-    class TriangleGameObject extends GameObject {
-      constructor() {
-        super()
-        this.components.push(new TriangleController())
-      }
-    }
-    class TriangleController extends Component {
-      start() {
-        this.vertex = new Vector2(Math.random()*canvas.width, Math.random()*canvas.height)
-        this.velocity = new Vector2(1, 1)
-      }
-      update() {
-        this.vertex.plusEquals(this.velocity)
-        if (this.vertex.x > canvas.width || this.vertex.x < 0) {
-          this.velocity.x *= -1
-        }
-        if (this.vertex.y > canvas.height || this.vertex.y < 0) {
-          this.velocity.y *= -1
-        }
-      }
-      draw(ctx) {
-        ctx.fillStyle = "white"
-        ctx.beginPath()
-        ctx.lineTo(this.vertex.x, this.vertex.y)
-        ctx.lineTo(this.vertex.x + 50, this.vertex.y + 50)
-        ctx.lineTo(this.vertex.x + 0, this.vertex.y + 50)
-        ctx.fill()
-      }
-    }
+        //Engine-specific code
         const canvas = document.querySelector("#canv")
         const ctx = canvas.getContext("2d")
-    let currentScene = new MainScene()
+        const currentScene = new MainScene()
+        //Engine-specific
         function start() {
+            //Game-specific
             currentScene.start()
             gameLoop()
         }
+        //Engine-specific code
         function gameLoop() {
             update()
             draw()
+            requestAnimationFrame(gameLoop)
         }
+        //Engine-specific
         function update() {
             currentScene.update()            
         }
+        //Engine-specific
         function draw() {
+            //Game-specific
             ctx.fillStyle = "green"
             ctx.beginPath()
             ctx.rect(0, 0, canvas.width, canvas.height)
...
             currentScene.draw(ctx)
-      requestAnimationFrame(gameLoop)
         }
+        //Engine-specific
         requestAnimationFrame(start)
+        addEventListener("keydown", Input.keydown)
+        addEventListener("keyup", Input.keyup)
     </script>
 </body>

deleted file Day02.Vector2.js

deleted file Day03.Component.js

deleted file Day03.Fireworks.html

deleted file Day03.FishTank.html

deleted file Day03.GameObject.js

deleted file Day03.Scene.js

deleted file README.md

added file BeforeClass/Day04.html

added file BeforeClass/engine/Component.js

added file BeforeClass/engine/GameObject.js

added file BeforeClass/engine/Input.js

added file BeforeClass/engine/Scene.js

added file BeforeClass/engine/Vector2.js

added file BeforeClass/game/MainScene.js

added file BeforeClass/game/SquareController.js

added file BeforeClass/game/SquareGameObject.js

added file BeforeClass/game/TriangleController.js

added file BeforeClass/game/TriangleGameObject.js

added file engine/Component.js

added file engine/GameObject.js

added file engine/Input.js

added file engine/Scene.js

added file engine/Vector2.js

added file game/MainScene.js

added file game/SquareController.js

added file game/SquareGameObject.js

added file game/TriangleController.js

added file game/TriangleGameObject.js

added file TODO.md
```