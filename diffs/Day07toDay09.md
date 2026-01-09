Here's what changed in the code:
```diff
rename from 2048.html
rename to beforeClass/2048.html

rename from Day07.html
rename to beforeClass/Day07.html

renamed Day07.html to Day09.html with the following changes:
 <html>
 <head>
-    <title>Day 07 Game</title>
+    <title>Day 09 Game</title>
     <style>
         *{
             margin: 0;

deleted file beforeClass/game/components/EnemyShipController.js

deleted file beforeClass/game/components/PlayerShipController.js

deleted file beforeClass/game/prefabs/EnemyShipGameObject.js

deleted file beforeClass/game/prefabs/PlayerShipGameObject.js

deleted file beforeClass2.0/Day06.html

deleted file beforeClass2.0/engine/Component.js

deleted file beforeClass2.0/engine/components/Polygon.js

deleted file beforeClass2.0/engine/components/Text.js

deleted file beforeClass2.0/engine/components/Transform.js

deleted file beforeClass2.0/engine/Engine.js

deleted file beforeClass2.0/engine/GameObject.js

deleted file beforeClass2.0/engine/Input.js

deleted file beforeClass2.0/engine/Scene.js

deleted file beforeClass2.0/engine/Vector2.js

deleted file beforeClass2.0/game/components/LaserController.js

deleted file beforeClass2.0/game/components/SquareController.js

deleted file beforeClass2.0/game/components/TriangleController.js

deleted file beforeClass2.0/game/prefabs/LaserGameObject.js

deleted file beforeClass2.0/game/prefabs/SquareGameObject.js

deleted file beforeClass2.0/game/prefabs/TriangleGameObject.js

deleted file beforeClass2.0/game/scenes/MainScene.js

deleted file beforeClass2.0/Timer.html

deleted file beforeClass2.0/Whack-a-mole.html

added file beforeClass/engine/Time.js

added file beforeClass/game/components/SquareController.js

added file beforeClass/game/components/TriangleController.js

added file beforeClass/game/prefabs/SquareGameObject.js

added file beforeClass/game/prefabs/TriangleGameObject.js

added file beforeClass/separateAxisTheorem.html

added file engine/Collisions.js

added file engine/components/Collider.js

added file gameCollision.html

added file separateAxisTheorem.html

updated beforeClass/engine/Collisions.js
 class Collisions {
-  static inCollision(gameObjectOne, gameObjectTwo) {
-    const points1 = Collisions.getPoints(gameObjectOne)
-    const points2 = Collisions.getPoints(gameObjectTwo)
+  static inCollision(one, two) {
+    //Get the points in the polygons on each game object
+    const onePointsRaw = one.getComponent(Polygon).points
+    const twoPointsRaw = two.getComponent(Polygon).points
-    const diffs = []
-    for (let i = 0; i < points1.length; i++) {
-      const other = i != 0 ? points1[i-1] : points1.at(-1)
-      diffs.push(points1[i].minus(other))
-    }
-    for (let i = 0; i < points2.length; i++) {
-      const other = i != 0 ? points2[i-1] : points2.at(-1)
-      diffs.push(points2[i].minus(other))
-    }
+    //Apply the scale and positional transformational attributes to the points
+    const onePoints = onePointsRaw.map(p => p.scale(one.transform.scale).plus(one.transform.position))
+    const twoPoints = twoPointsRaw.map(p => p.scale(two.transform.scale).plus(two.transform.position))
-    for (const diff of diffs) {
-      const dots1 = points1.map(p => diff.orthogonal().dot(p))
-      const dots2 = points2.map(p => diff.orthogonal().dot(p))
+    //Where each line formed by the polygons is stored
+    const lines = []
-      const oneMin = Math.min(...dots1)
-      const oneMax = Math.max(...dots1)
-      const twoMin = Math.min(...dots2)
-      const twoMax = Math.max(...dots2)
-      if (oneMax < twoMin || twoMax < oneMin)
-        return false
+    //For all point pairs in both arrays, find the orthogonal line and add it to lines
+    for (const polygonPoints of [onePoints, twoPoints]) {
+      for (let i = 0; i < polygonPoints.length; i++) {
+        const a = polygonPoints[i]
+        const b = polygonPoints[(i+1)%polygonPoints.length]
+        lines.push(a.minus(b).orthogonal())
       }
-    return true
     }
-  static getPoints(gameObject) {
-    const polygon = gameObject.getComponent(Polygon)
-    const points = polygon.points
-    const newPoints = points.map(v => v.scale(gameObject.transform.scale).plus(gameObject.transform.position))
-    return newPoints
+    //For each line...
+    for (const line of lines) {
+      //...Find the dot product of all points in both polygons...
+      const oneDots = onePoints.map(p => p.dot(line))
+      const twoDots = twoPoints.map(p => p.dot(line))
+      //...and if there is a gap, they are not in collision
+      if (Math.max(...oneDots) < Math.min(...twoDots) || Math.max(...twoDots) < Math.min(...oneDots)) return false
     }
+    //If we get here, then the polygons were always overlapping, so we know they are in collision
+    return true
   }
+}

updated beforeClass/engine/components/Polygon.js
 class Polygon extends Component {
     fillStyle = "magenta"
-    points = [new Vector2(0,0), new Vector2(1, 1), new Vector2(0, 1)]
+    points = [new Vector2(0, -1), new Vector2(1, 1), new Vector2(-1, 1)]
     draw(ctx) {
         ctx.fillStyle = this.fillStyle
         ctx.beginPath()
         for(const point of this.points){
-            ctx.lineTo(this.transform.position.x + point.x*this.transform.scale.x, this.transform.position.y + point.y*this.transform.scale.y)
+            ctx.lineTo(this.transform.position.x + point.x*this.transform.scale.x, this.transform.position.y + point.y * this.transform.scale.y)
         }
+        // ctx.lineTo(this.transform.position.x, this.transform.position.y)
+        // ctx.lineTo(this.transform.position.x + 1*this.transform.scale.x, this.transform.position.y + 1*this.transform.scale.y)
+        // ctx.lineTo(this.transform.position.x + 0, this.transform.position.y + 1*this.transform.scale.y)
         ctx.fill()
     }
 }

updated beforeClass/engine/Engine.js
 class Engine {
-  static canvas = document.querySelector("#canv")
-  static ctx = Engine.canvas.getContext("2d")
     //Engine-specific
     static start() {
-    //Engine-specific
+        Engine.canvas = document.querySelector("#canv")
+        Engine.ctx = Engine.canvas.getContext("2d")
         addEventListener("keydown", Input.keydown)
         addEventListener("keyup", Input.keyup)
         //Game-specific

updated beforeClass/engine/GameObject.js
 /**
- * Base class for all objects in a scene.
+ * Base class for all objects ín a scene.
  * 
  * See: https://docs.unity3d.com/ScriptReference/GameObject.html
  */
 class GameObject {
     components = []
+    hasStarted = false
     markForDelete = false
-    constructor(){
+    name = "[NO NAME]"
+    constructor(name) {
         this.addComponent(new Transform())
+        this.name = name
     }
     start() {
         for (const component of this.components) {
...
         }
     }
     update() {
+        if(!this.hasStarted){
+            this.hasStarted = true
+            this.start()
+        }
         for (const component of this.components) {
             component.update()
         }
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
-    destroy(){
+    get transform() {
+        return this.components[0]
+    }
+    destroy() {
         this.markForDelete = true
     }
-    getComponent(type){
-        return this.components.find(c=>c instanceof type)
+    getComponent(type) {
+        return this.components.find(go => go instanceof type)
     }
-    sendMessage(string, args){
-        for(const component of this.components){
-            if(component[string]){
-                component[string](...args)
 }
-        }
-    }
-    get transform(){
-        return this.components[0]
-    }
-}

updated beforeClass/engine/Scene.js
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
-        //Look for collidable objects
-        const collidable = Engine.currentScene.gameObjects.filter(go=>go.getComponent(Collider))
-        for(let i = 0; i < collidable.length; i++){
-            for(let j = i+1; j < collidable.length; j++){
-                if(Collisions.inCollision(collidable[i], collidable[j])){
-                    collidable[i].sendMessage("onCollision", [collidable[j]])
-                    collidable[j].sendMessage("onCollision", [collidable[i]])
+        //Start everything
+        const notStarted = this.gameObjects.filter(go=>!go.hasStarted)
+        for(const gameObject of notStarted){
+            gameObject.start()
+            gameObject.hasStarted = true
         }
-            }
-        }
+        //Update everything
         for (const gameObject of this.gameObjects) {
             gameObject.update()
         }
-        //Remove game objects that have been marked for delete
+        //Delete what needs to be removed
         this.gameObjects = this.gameObjects.filter(go=>!go.markForDelete)
     }
     draw(ctx) {
...
         this.gameObjects.push(gameObject)
         if(position)
             gameObject.transform.position = position
+        //gameObject.start()
     }
 }

updated beforeClass/engine/Vector2.js
         this.x += other.x
         this.y += other.y
     }
-    plus(other) {
-        return new Vector2(this.x + other.x, this.y += other.y)
+    plus(other){
+        return new Vector2(this.x+other.x, this.y+other.y)
     }
+    minus(other){
+        return new Vector2(this.x - other.x, this.y - other.y)
+    }
+    clone(){
+        return new Vector2(this.x, this.y)
+    }
     times(scalar){
-        return new Vector2(this.x * scalar, this.y * scalar)
+        return new Vector2(this.x*scalar, this.y*scalar)
     }
     scale(other){
-        return new Vector2(this.x * other.x, this.y * other.y)
+        return new Vector2(this.x*other.x, this.y*other.y)
     }
-    orthogonal(){
-        return new Vector2(this.y, -this.x)
-    }
-    minus(other){
-        return new Vector2(this.x - other.x, this.y - other.y)
-    }
     dot(other){
         return this.x*other.x+this.y*other.y
     }
+    orthogonal(){
+        return new Vector2(-this.y, this.x)
     }
+    get magnitude(){
+        return Math.sqrt(this.x**2+this.y**2)
+    }
+}

updated beforeClass/game/components/LaserController.js
 class LaserController extends Component{
     start(){
+        this.speed = -500
     }
     update(){
-    this.transform.position.y -= 10
+        this.transform.position.y += this.speed * Time.deltaTime
         if(this.transform.position.y < -10){
             this.gameObject.destroy()
         }
     }
 }

updated beforeClass/game/prefabs/LaserGameObject.js
 class LaserGameObject extends GameObject{
     constructor(){
-        super()
+        super("Laser Game Object")
+        this.addComponent(new Polygon(), {fillStyle: "green", points:[new Vector2(-1, -1), new Vector2(-1, 1), new Vector2(1, 1), new Vector2(1, -1)]})
         this.addComponent(new LaserController())
-        this.addComponent(new Polygon(), {fillStyle:"lightgreen", points:[new Vector2(-1, -1), new Vector2(1, -1), new Vector2(1, 1), new Vector2(-1, 1)]})
-        this.addComponent(new Collider())
         this.transform.scale = new Vector2(2, 5)
     }
 }

updated beforeClass/game/scenes/MainScene.js
     constructor(){
         super()
         //Game-specific code
-        this.instantiate(new EnemyShipGameObject(), new Vector2(0,0))
-        this.instantiate(new EnemyShipGameObject(), new Vector2(50, 50))
-        this.instantiate(new EnemyShipGameObject(), new Vector2(30, 30))
-        this.instantiate(new EnemyShipGameObject(), new Vector2(40, 70))
-        this.instantiate(new PlayerShipGameObject(), new Vector2(50, 300))
+        this.instantiate(new TriangleGameObject(), new Vector2(0,0))
+        this.instantiate(new TriangleGameObject(), new Vector2(50, 50))
+        this.instantiate(new TriangleGameObject(), new Vector2(30, 30))
+        this.instantiate(new TriangleGameObject(), new Vector2(40, 70))
+        this.instantiate(new SquareGameObject(), new Vector2(100, 100))
     }
 }

updated beforeClass/gameCollision.html
   <script src="./engine/components/Transform.js"></script>
   <script src="./engine/components/Polygon.js"></script>
+  <script src="./engine/components/Collider.js"></script>
   <!-- Game-specific Code -->
...
     class SquareGameObject extends GameObject {
       constructor() {
         super()
-        this.addComponent(new Polygon, { fillStyle: "red", points: [new Vector2(-1, -1), new Vector2(1, -1), new Vector2(1, 1), new Vector2(-1, 1)] })
+        this.addComponent(new Polygon, { fillStyle: "rgba(255, 0, 0, .75)", points: [new Vector2(-1, -1), new Vector2(1, -1), new Vector2(1, 1), new Vector2(-1, 1)] })
+        this.addComponent(new LabelerComponent())
         this.transform.scale = new Vector2(50, 50)
       }
     }
-    class TriangleUpGameObject extends GameObject{
-      constructor(){
+    class TriangleUpGameObject extends GameObject {
+      constructor() {
         super()
-        this.addComponent(new Polygon, {fillStyle: "green", points: [new Vector2(0, -1), new Vector2(-.5, .5), new Vector2(.5, .5)]})
+        this.addComponent(new Polygon, { fillStyle: "rgba(0, 255, 0, .75)", points: [new Vector2(0, -1), new Vector2(-.5, .5), new Vector2(.5, .5)] })
+        this.addComponent(new LabelerComponent())
         this.transform.scale = new Vector2(50, 50)
       }
     }
-    class TriangleDownGameObject extends GameObject{
-      constructor(){
+    class TriangleDownGameObject extends GameObject {
+      constructor() {
         super()
-        this.addComponent(new Polygon, {fillStyle: "blue", points: [new Vector2(0, 1), new Vector2(-.5, -.5), new Vector2(.5, -.5)]})
+        this.addComponent(new Polygon, { fillStyle: "rgba(0, 0, 255, .5)", points: [new Vector2(0, 1), new Vector2(-.5, -.5), new Vector2(.5, -.5)] })
+        this.addComponent(new LabelerComponent())
         this.transform.scale = new Vector2(50, 50)
       }
     }
...
       }
     }
-    class CollisionChecker extends Component{
-      start(){
+    class CollisionChecker extends Component {
+      start() {
         const gameObjects = Engine.currentScene.gameObjects
-        for(let i = 0; i < gameObjects.length; i++){
-          for(let j = i + 1; j < gameObjects.length-1; j++){
-            console.log(`${i} ${j} ${Collisions.inCollision(gameObjects[i], gameObjects[j])}`)
+        for (let i = 0; i < gameObjects.length; i++) {
+          for (let j = i + 1; j < gameObjects.length - 1; j++) {
+            const colliding = Collisions.inCollision(gameObjects[i], gameObjects[j])
+            if (colliding)
+              console.log(`${i} ${j} ${colliding}`)
           }
         }
       }
     }
+    class LabelerComponent extends Component {
+      draw(ctx) {
+        ctx.fillStyle = "white"
+        ctx.fillText(Engine.currentScene.gameObjects.indexOf(this.gameObject), this.transform.position.x, this.transform.position.y)
+      }
+    }
     Engine.currentScene = new MainScene()
     Engine.start()

updated engine/GameObject.js
 /**
- * Base class for all objects in a scene.
+ * Base class for all objects ín a scene.
  * 
  * See: https://docs.unity3d.com/ScriptReference/GameObject.html
  */
...
         }
     }
     update() {
+        if(!this.hasStarted){
+            this.hasStarted = true
+            this.start()
+        }
         for (const component of this.components) {
             component.update()
         }

updated engine/Scene.js
 class Scene {
     gameObjects = []
     start() {
-        // for (const gameObject of this.gameObjects) {
-        //     gameObject.start()
-        // }
-    }
-    update() {
-        //Start everything
-        const notStarted = this.gameObjects.filter(go=>!go.hasStarted)
-        for(const gameObject of notStarted){
+        for (const gameObject of this.gameObjects) {
             gameObject.start()
             gameObject.hasStarted = true
         }
+    }
+    update() {
         //Update everything
         for (const gameObject of this.gameObjects) {
+            //Start if the gameObject hasn't started yet
+            if (!gameObject.hasStarted) {
+                gameObject.start()
+                gameObject.hasStarted = true
+            }
             gameObject.update()
         }
         //Delete what needs to be removed
-        this.gameObjects = this.gameObjects.filter(go=>!go.markForDelete)
+        this.gameObjects = this.gameObjects.filter(go => !go.markForDelete)
     }
     draw(ctx) {
         for (const gameObject of this.gameObjects) {
             gameObject.draw(ctx)
         }
     }
-    instantiate(gameObject, position){
+    instantiate(gameObject, position) {
         this.gameObjects.push(gameObject)
-        if(position)
+        if (position)
             gameObject.transform.position = position
-        gameObject.start()
     }
 }

updated engine/Vector2.js
         return new Vector2(this.x+other.x, this.y+other.y)
     }
+    minus(other){
+        return new Vector2(this.x - other.x, this.y - other.y)
+    }
     clone(){
         return new Vector2(this.x, this.y)
     }
...
     dot(other){
         return this.x*other.x+this.y*other.y
     }
+    orthogonal(){
+        return new Vector2(-this.y, this.x)
     }
+    get magnitude(){
+        return Math.sqrt(this.x**2+this.y**2)
+    }
+}
```