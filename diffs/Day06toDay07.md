Here's what changed in the code:
```diff
rename from Day06.html
rename to beforeClass2.0/Day06.html

rename from game/components/LaserController.js
rename to beforeClass2.0/game/components/LaserController.js

rename from game/components/SquareController.js
rename to beforeClass2.0/game/components/SquareController.js

rename from game/components/TriangleController.js
rename to beforeClass2.0/game/components/TriangleController.js

rename from game/prefabs/LaserGameObject.js
rename to beforeClass2.0/game/prefabs/LaserGameObject.js

rename from game/prefabs/SquareGameObject.js
rename to beforeClass2.0/game/prefabs/SquareGameObject.js

rename from game/prefabs/TriangleGameObject.js
rename to beforeClass2.0/game/prefabs/TriangleGameObject.js

renamed Day06.html to Day07.html with the following changes:
 <html>
 <head>
-    <title>Day 06 Game</title>
+    <title>Day 07 Game</title>
     <style>
         *{
             margin: 0;
...
     <script src="./engine/Component.js"></script>
     <script src="./engine/Input.js"></script>
     <script src="./engine/Engine.js"></script>
+    <script src="./engine/Time.js"></script>
     <script src="./engine/components/Transform.js"></script>
     <script src="./engine/components/Polygon.js"></script>

added file 2048.html

added file beforeClass/Day07.html

added file beforeClass/engine/Collisions.js

added file beforeClass/engine/Component.js

added file beforeClass/engine/components/Collider.js

added file beforeClass/engine/components/Polygon.js

added file beforeClass/engine/components/Transform.js

added file beforeClass/engine/Engine.js

added file beforeClass/engine/GameObject.js

added file beforeClass/engine/Input.js

added file beforeClass/engine/Scene.js

added file beforeClass/engine/Vector2.js

added file beforeClass/game/components/EnemyShipController.js

added file beforeClass/game/components/LaserController.js

added file beforeClass/game/components/PlayerShipController.js

added file beforeClass/game/prefabs/EnemyShipGameObject.js

added file beforeClass/game/prefabs/LaserGameObject.js

added file beforeClass/game/prefabs/PlayerShipGameObject.js

added file beforeClass/game/scenes/MainScene.js

added file beforeClass/gameCollision.html

added file beforeClass2.0/engine/Component.js

added file beforeClass2.0/engine/components/Polygon.js

added file beforeClass2.0/engine/components/Text.js

added file beforeClass2.0/engine/components/Transform.js

added file beforeClass2.0/engine/Engine.js

added file beforeClass2.0/engine/GameObject.js

added file beforeClass2.0/engine/Input.js

added file beforeClass2.0/engine/Scene.js

added file beforeClass2.0/engine/Vector2.js

added file beforeClass2.0/game/scenes/MainScene.js

added file beforeClass2.0/Timer.html

added file beforeClass2.0/Whack-a-mole.html

added file engine/Time.js

updated engine/components/Polygon.js
 class Polygon extends Component {
     fillStyle = "magenta"
+    points = [new Vector2(0, -1), new Vector2(1, 1), new Vector2(-1, 1)]
     draw(ctx) {
         ctx.fillStyle = this.fillStyle
         ctx.beginPath()
-        ctx.lineTo(this.transform.position.x, this.transform.position.y)
-        ctx.lineTo(this.transform.position.x + 1*this.transform.scale.x, this.transform.position.y + 1*this.transform.scale.y)
-        ctx.lineTo(this.transform.position.x + 0, this.transform.position.y + 1*this.transform.scale.y)
+        for(const point of this.points){
+            ctx.lineTo(this.transform.position.x + point.x*this.transform.scale.x, this.transform.position.y + point.y * this.transform.scale.y)
+        }
+        // ctx.lineTo(this.transform.position.x, this.transform.position.y)
+        // ctx.lineTo(this.transform.position.x + 1*this.transform.scale.x, this.transform.position.y + 1*this.transform.scale.y)
+        // ctx.lineTo(this.transform.position.x + 0, this.transform.position.y + 1*this.transform.scale.y)
         ctx.fill()
     }
 }

updated engine/Engine.js
         Engine.canvas.height = window.innerHeight
         //Game-specific
-        Engine.ctx.fillStyle = "green"
+        Engine.ctx.fillStyle = "black"
         Engine.ctx.beginPath()
         Engine.ctx.rect(0, 0, Engine.canvas.width, Engine.canvas.height)
         Engine.ctx.fill()

updated engine/GameObject.js
 class GameObject {
     components = []
-    constructor(){
+    hasStarted = false
+    markForDelete = false
+    name = "[NO NAME]"
+    constructor(name) {
         this.addComponent(new Transform())
+        this.name = name
     }
     start() {
         for (const component of this.components) {
...
             component.draw(ctx)
         }
     }
-    addComponent(component, values){
+    addComponent(component, values) {
         this.components.push(component)
         component.gameObject = this
         Object.assign(component, values)
     }
-    get transform(){
+    get transform() {
         return this.components[0]
     }
+    destroy() {
+        this.markForDelete = true
     }
+    getComponent(type) {
+        return this.components.find(go => go instanceof type)
+    }
+}

updated engine/Scene.js
 class Scene {
     gameObjects = []
     start() {
-        for (const gameObject of this.gameObjects) {
-            gameObject.start()
+        // for (const gameObject of this.gameObjects) {
+        //     gameObject.start()
+        // }
     }
-    }
     update() {
+        //Start everything
+        const notStarted = this.gameObjects.filter(go=>!go.hasStarted)
+        for(const gameObject of notStarted){
+            gameObject.start()
+            gameObject.hasStarted = true
+        }
+        //Update everything
         for (const gameObject of this.gameObjects) {
             gameObject.update()
         }
+        //Delete what needs to be removed
+        this.gameObjects = this.gameObjects.filter(go=>!go.markForDelete)
     }
     draw(ctx) {
         for (const gameObject of this.gameObjects) {
...
         this.gameObjects.push(gameObject)
         if(position)
             gameObject.transform.position = position
+        gameObject.start()
     }
 }

updated engine/Vector2.js
         this.y += other.y
     }
+    plus(other){
+        return new Vector2(this.x+other.x, this.y+other.y)
+    }
     clone(){
         return new Vector2(this.x, this.y)
     }
+    times(scalar){
+        return new Vector2(this.x*scalar, this.y*scalar)
     }
+    scale(other){
+        return new Vector2(this.x*other.x, this.y*other.y)
+    }
+    dot(other){
+        return this.x*other.x+this.y*other.y
+    }
+}
```