Here's what changed in the code:
```diff
deleted file engine/Component.js

deleted file engine/GameObject.js

deleted file engine/Scene.js

deleted file engine/Vector2.js

deleted file game/MainScene.js

deleted file game/TriangleController.js

deleted file game/TriangleGameObject.js

added file Day02.Vector2.js

added file Day03.Component.js

added file Day03.Fireworks.html

added file Day03.FishTank.html

added file Day03.GameObject.js

added file Day03.Scene.js

added file README.md

updated Day03.html
 <html>
 <head>
-    <title>Day 02 Game</title>
+  <title>Day 01 Game</title>
 </head>
 <body>
   <canvas id="canv"></canvas>
-    <!-- Engine-specific Code -->
-    <script src="./engine/Vector2.js"></script>
-    <script src="./engine/Scene.js"></script>
-    <script src="./engine/GameObject.js"></script>
-    <script src="./engine/Component.js"></script>
-    <!-- Game-specific Code -->
-    <script src="./game/MainScene.js"></script>
-    <script src="./game/TriangleGameObject.js"></script>
-    <script src="./game/TriangleController.js"></script>
+  <script src="Day02.Vector2.js"></script>
+  <script src="Day03.Scene.js"></script>
+  <script src="Day03.GameObject.js"></script>
+  <script src="Day03.Component.js"></script>
   <script>
-        //Engine-specific code
+    class MainScene extends Scene {
+      constructor() {
+        super()
+        this.gameObjects.push(new TriangleGameObject())
+        this.gameObjects.push(new TriangleGameObject())
+      }
+    }
+    class TriangleGameObject extends GameObject {
+      constructor() {
+        super()
+        this.components.push(new TriangleController())
+      }
+    }
+    class TriangleController extends Component {
+      start() {
+        this.vertex = new Vector2(Math.random()*canvas.width, Math.random()*canvas.height)
+        this.velocity = new Vector2(1, 1)
+      }
+      update() {
+        this.vertex.plusEquals(this.velocity)
+        if (this.vertex.x > canvas.width || this.vertex.x < 0) {
+          this.velocity.x *= -1
+        }
+        if (this.vertex.y > canvas.height || this.vertex.y < 0) {
+          this.velocity.y *= -1
+        }
+      }
+      draw(ctx) {
+        ctx.fillStyle = "white"
+        ctx.beginPath()
+        ctx.lineTo(this.vertex.x, this.vertex.y)
+        ctx.lineTo(this.vertex.x + 50, this.vertex.y + 50)
+        ctx.lineTo(this.vertex.x + 0, this.vertex.y + 50)
+        ctx.fill()
+      }
+    }
     const canvas = document.querySelector("#canv")
     const ctx = canvas.getContext("2d")
+    let currentScene = new MainScene()
-        const currentScene = new MainScene()
-        //Engine-specific
     function start() {
-            //Game-specific
       currentScene.start()
       gameLoop()
     }
-        //Engine-specific code
     function gameLoop() {
       update()
       draw()
-            requestAnimationFrame(gameLoop)
     }
-        //Engine-specific
     function update() {
       currentScene.update()
     }
-        //Engine-specific
     function draw() {
-            //Game-specific
       ctx.fillStyle = "green"
       ctx.beginPath()
       ctx.rect(0, 0, canvas.width, canvas.height)
...
       currentScene.draw(ctx)
+      requestAnimationFrame(gameLoop)
     }
-        //Engine-specific
     requestAnimationFrame(start)
   </script>
```