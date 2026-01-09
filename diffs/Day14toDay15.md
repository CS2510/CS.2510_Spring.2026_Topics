Here's what changed in the code:
```diff
renamed Day13.html to Day15.html with the following changes:
 <html>
 <head>
-    <title>Day 13 Game</title>
+    <title>Day 15 Game</title>
     <style>
         *{
             margin: 0;
...
     <script src="./engine/Engine.js"></script>
     <script src="./engine/Time.js"></script>
     <script src="./engine/Collisions.js"></script>
+    <script src="./engine/CameraGameObject.js"></script>
     <script src="./engine/components/Transform.js"></script>
     <script src="./engine/components/Polygon.js"></script>
     <script src="./engine/components/Collider.js"></script>
     <script src="./engine/components/RigidBody.js"></script>
     <script src="./engine/components/Text.js"></script>
+    <script src="./engine/components/Camera.js"></script>
     <!-- Game-specific Code -->
     <script src="./game/scenes/MainScene.js"></script>
-    <script src="./game/prefabs/TriangleGameObject.js"></script>
-    <script src="./game/prefabs/SquareGameObject.js"></script>
+    <script src="./game/prefabs/EnemyGameObject.js"></script>
+    <script src="./game/prefabs/PlayerGameObject.js"></script>
     <script src="./game/prefabs/LaserGameObject.js"></script>
     <script src="./game/prefabs/ScoreGameObject.js"></script>
+    <script src="./game/prefabs/MainControllerGameObject.js"></script>
+    <script src="./game/prefabs/StarGameObject.js"></script>
-    <script src="./game/components/TriangleController.js"></script>
-    <script src="./game/components/SquareController.js"></script>
+    <script src="./game/components/EnemyController.js"></script>
+    <script src="./game/components/PlayerController.js"></script>
     <script src="./game/components/LaserController.js"></script>
     <script src="./game/components/ScoreController.js"></script>
+    <script src="./game/components/MainController.js"></script>
+    <script src="./game/components/StarController.js"></script>
+    <script src="./game/GameProperties.js"></script>
     <script>
         Engine.currentScene = new MainScene()
-        Engine.start()
+        Engine.start(new GameProperties())
     </script>
 </body>

deleted file game/components/SquareController.js

deleted file game/components/TriangleController.js

deleted file game/prefabs/SquareGameObject.js

deleted file game/prefabs/TriangleGameObject.js

added file engine/CameraGameObject.js

added file engine/components/Camera.js

added file game/components/EnemyController.js

added file game/components/MainController.js

added file game/components/PlayerController.js

added file game/components/StarController.js

added file game/GameProperties.js

added file game/prefabs/EnemyGameObject.js

added file game/prefabs/MainControllerGameObject.js

added file game/prefabs/PlayerGameObject.js

added file game/prefabs/StarGameObject.js

updated engine/Engine.js
 class Engine {
+    static layers = ["", "UI"]
     //Engine-specific
-    static start() {
+    static start(gameProperties) {
+        Engine.layers.push(...gameProperties.layers)
         Engine.canvas = document.querySelector("#canv")
         Engine.ctx = Engine.canvas.getContext("2d")
...
         Engine.canvas.height = window.innerHeight
         //Game-specific
-        Engine.ctx.fillStyle = "black"
+        Engine.ctx.fillStyle = Camera.main.getComponent(Camera).backgroundColor
         Engine.ctx.beginPath()
         Engine.ctx.rect(0, 0, Engine.canvas.width, Engine.canvas.height)
         Engine.ctx.fill()

updated engine/GameObject.js
     hasStarted = false
     markForDelete = false
     name = "[NO NAME]"
-    constructor(name) {
+    layer = ""
+    constructor(name, options) {
+        Object.assign(this, options)
         this.addComponent(new Transform())
         this.name = name
     }

updated engine/Scene.js
         }
         //Do Collision Detection
-        const gameObjectsWithColliders = this.gameObjects.filter(go=>go.getComponent(Collider))
-        for(let i = 0; i < gameObjectsWithColliders.length; i++){
-            for(let j = i+1; j < gameObjectsWithColliders.length; j++){
+        const gameObjectsWithColliders = this.gameObjects.filter(go => go.getComponent(Collider))
+        for (let i = 0; i < gameObjectsWithColliders.length; i++) {
+            for (let j = i + 1; j < gameObjectsWithColliders.length; j++) {
                 let a = gameObjectsWithColliders[i]
                 let b = gameObjectsWithColliders[j]
-                let response = Collisions.inCollision(a,b)
-                if(response){
+                let response = Collisions.inCollision(a, b)
+                if (response) {
                     const aHasRigidBody = a.getComponent(RigidBody)
                     const bHasRigidBody = b.getComponent(RigidBody)
-                    if(aHasRigidBody){
-                        if(a.transform.position.minus(b.transform.position).dot(response) < 0)
+                    if (aHasRigidBody) {
+                        if (a.transform.position.minus(b.transform.position).dot(response) < 0)
                             response = response.times(-1)
                         a.transform.position.plusEquals(response)
                     }
-                    if(bHasRigidBody){
-                        if(b.transform.position.minus(a.transform.position).dot(response) < 0)
+                    if (bHasRigidBody) {
+                        if (b.transform.position.minus(a.transform.position).dot(response) < 0)
                             response = response.times(-1)
                         b.transform.position.plusEquals(response)
                     }
-                    for(const component of a.components){
+                    for (const component of a.components) {
                         component.onCollisionEnter?.(b)
                     }
-                    for(const component of b.components){
+                    for (const component of b.components) {
                         component.onCollisionEnter?.(a)
                     }
                 }
...
         this.gameObjects = this.gameObjects.filter(go => !go.markForDelete)
     }
     draw(ctx) {
-        for (const gameObject of this.gameObjects) {
+        ctx.save()
+        ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
+        ctx.translate(-Camera.main.transform.position.x, -Camera.main.transform.position.y)
+        for (const layer of Engine.layers.filter(l => l != "UI")) {
+            const gameObjects = this.gameObjects.filter(go => go.layer == layer)
+            for (const gameObject of gameObjects) {
                 gameObject.draw(ctx)
             }
         }
+        ctx.restore()
+        const gameObjects = this.gameObjects.filter(go => go.layer == "UI")
+        for (const gameObject of gameObjects) {
+            gameObject.draw(ctx)
+        }
+    }
     instantiate(gameObject, position) {
         this.gameObjects.push(gameObject)
         if (position)

updated game/prefabs/ScoreGameObject.js
 class ScoreGameObject extends GameObject{
     constructor(){
-        super("Score Game Object")
+        super("Score Game Object", {layer: "UI"})
         this.addComponent(new Text())
         this.addComponent(new ScoreController())
     }

updated game/scenes/MainScene.js
 class MainScene extends Scene{
     constructor(){
         super()
-        //Game-specific code
-        this.instantiate(new TriangleGameObject(), new Vector2(0,0))
-        this.instantiate(new TriangleGameObject(), new Vector2(50, 50))
-        this.instantiate(new TriangleGameObject(), new Vector2(30, 30))
-        this.instantiate(new TriangleGameObject(), new Vector2(40, 70))
-        this.instantiate(new SquareGameObject(), new Vector2(100, 300))
+        const cameraGameObject = new CameraGameObject()
+        cameraGameObject.getComponent(Camera).backgroundColor = "black"
+        this.instantiate(cameraGameObject)
+        this.instantiate(new MainControllerGameObject())
+        this.instantiate(new EnemyGameObject(), new Vector2(0,0))
+        this.instantiate(new EnemyGameObject(), new Vector2(50, 50))
+        this.instantiate(new EnemyGameObject(), new Vector2(30, 30))
+        this.instantiate(new EnemyGameObject(), new Vector2(40, 70))
+        this.instantiate(new PlayerGameObject(), new Vector2(100, 300))
+        //UI Game Objects
         this.instantiate(new ScoreGameObject(), new Vector2(100, 30))
     }
 }

updated gameCollision.html
     class MainScene extends Scene {
       constructor() {
         super()
-        this.instantiate(new SquareGameObject, new Vector2(100, 100))
-        this.instantiate(new SquareGameObject, new Vector2(125, 110))
-        this.instantiate(new SquareGameObject, new Vector2(325, 125))
+        this.instantiate(new PlayerGameObject, new Vector2(100, 100))
+        this.instantiate(new PlayerGameObject, new Vector2(125, 110))
+        this.instantiate(new PlayerGameObject, new Vector2(325, 125))
         this.instantiate(new TriangleUpGameObject, new Vector2(325, 224))
         this.instantiate(new TriangleDownGameObject, new Vector2(375, 224))
         this.instantiate(new TriangleDownGameObject, new Vector2(175, 50))
...
       }
     }
-    class SquareGameObject extends GameObject {
+    class PlayerGameObject extends GameObject {
       constructor() {
         super()
         this.addComponent(new Polygon, { fillStyle: "rgba(255, 0, 0, .75)", points: [new Vector2(-1, -1), new Vector2(1, -1), new Vector2(1, 1), new Vector2(-1, 1)] })

updated separateAxisTheorem.html
     class MainScene extends Scene {
       constructor() {
         super()
-        this.instantiate(new SquareGameObject, new Vector2(300, 300))
+        this.instantiate(new PlayerGameObject, new Vector2(300, 300))
         this.instantiate(new SquareGameObject2, new Vector2(425, 310))
         this.instantiate(new DemonstrationLineGameObject(), new Vector2(300, 600))
       }
...
     }
-    class SquareGameObject extends GameObject {
+    class PlayerGameObject extends GameObject {
       constructor() {
         super()
         this.addComponent(new Polygon, { fillStyle: "rgba(200, 200, 200, .75)", points: [new Vector2(-1, -1), new Vector2(1, -1), new Vector2(1, 1), new Vector2(-1, 1)] })

updated Whack-a-mole.html
     <script src="./engine/Engine.js"></script>
     <script src="./engine/Time.js"></script>
     <script src="./engine/Collisions.js"></script>
+    <script src="./engine/CameraGameObject.js"></script>
     <script src="./engine/components/Transform.js"></script>
     <script src="./engine/components/Polygon.js"></script>
     <script src="./engine/components/Collider.js"></script>
     <script src="./engine/components/RigidBody.js"></script>
     <script src="./engine/components/Text.js"></script>
+    <script src="./engine/components/Camera.js"></script>
   <script>
     class MainScene extends Scene {
       constructor() {
         super()
+        this.instantiate(new CameraGameObject())
         this.instantiate(new MoleGameObject(), new Vector2(100, 100))
         this.instantiate(new PointsGameObject(), new Vector2(20, 100))
         this.instantiate(new ClickGameObject())
...
     class ClickGameObject extends GameObject {
       constructor() {
         super("Click Game Object")
-        this.addComponent(new Polygon(), { fillStyle: "magenta", points: [new Vector2(-1, -1), new Vector2(0, 1), new Vector2(1, -1)] })
+        this.addComponent(new Polygon(), { fillStyle: "black", points: [new Vector2(-1, -1), new Vector2(0, 1), new Vector2(1, -1)] })
         this.addComponent(new ClickController())
         this.addComponent(new Collider())
       }
...
     Engine.currentScene = new MainScene()
-    Engine.start()
+    Engine.start({layers:[]})
   </script>
 </body>
```