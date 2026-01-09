Here's what changed in the code:
```diff
added file engine/SceneManager.js

added file game/components/StartSceneController.js

added file game/GameAssets.js

added file game/scenes/StartScene.js

updated Day15.html
     <script src="./engine/Time.js"></script>
     <script src="./engine/Collisions.js"></script>
     <script src="./engine/CameraGameObject.js"></script>
+    <script src="./engine/SceneManager.js"></script>
     <script src="./engine/components/Transform.js"></script>
     <script src="./engine/components/Polygon.js"></script>
...
     <!-- Game-specific Code -->
     <script src="./game/scenes/MainScene.js"></script>
+    <script src="./game/scenes/StartScene.js"></script>
     <script src="./game/prefabs/EnemyGameObject.js"></script>
     <script src="./game/prefabs/PlayerGameObject.js"></script>
...
     <script src="./game/components/ScoreController.js"></script>
     <script src="./game/components/MainController.js"></script>
     <script src="./game/components/StarController.js"></script>
+    <script src="./game/components/StartSceneController.js"></script>
     <script src="./game/GameProperties.js"></script>
+    <script src="./game/GameAssets.js"></script>
     <script>
-        Engine.currentScene = new MainScene()
+        SceneManager.loadScene(new StartScene())
         Engine.start(new GameProperties())
     </script>
 </body>

updated engine/components/Camera.js
     static get main(){
         return GameObject.find("Camera Game Object")
     }
+    static screenToWorldSpace(screenSpace){
+        let screen  = new DOMPoint(screenSpace.x, screenSpace.y)
+        let matrix = new DOMMatrix()
+        matrix.translateSelf(window.innerWidth / 2, window.innerHeight / 2)
+        matrix.translateSelf(-Camera.main.transform.position.x, -Camera.main.transform.position.y)
+        let screenMatrix = matrix.inverse()
+        let worldPoint = screenMatrix.transformPoint(screen)
+        return new Vector2(worldPoint.x, worldPoint.y)
     }
+}

updated engine/Engine.js
         addEventListener("mouseup", Input.mouseup)
         addEventListener("mousemove", Input.mousemove)
         //Game-specific
-        Engine.currentScene.start()
+        SceneManager.getActiveScene().start()
         Engine.gameLoop()
     }
...
     //Engine-specific
     static update() {
-        Engine.currentScene.update()
+        SceneManager.getActiveScene().update()
     }
     //Engine-specific
...
         Engine.ctx.rect(0, 0, Engine.canvas.width, Engine.canvas.height)
         Engine.ctx.fill()
-        Engine.currentScene.draw(Engine.ctx)
+        SceneManager.getActiveScene().draw(Engine.ctx)
     }
 }

updated engine/GameObject.js
         this.addComponent(new Transform())
         this.name = name
     }
-    start() {
-        for (const component of this.components) {
-            component.start()
+    broadcastMessage(name, args){
+        for(const component of this.components){
+            if(component[name]){
+                component[name](...args)
             }
         }
+    }
+    start() {
+        // for (const component of this.components) {
+        //     component.start()
+        // }
+        this.broadcastMessage("start", [])
+    }
     update() {
         if (!this.hasStarted) {
             this.hasStarted = true
             this.start()
         }
-        for (const component of this.components) {
+        // for (const component of this.components) {
-            component.update()
+        //     component.update()
+        // }
+        this.broadcastMessage("update", [])
     }
-    }
     draw(ctx) {
         for (const component of this.components) {
             ctx.save()
...
     }
     static find(name) {
-        return Engine.currentScene.gameObjects.find(go => go.name == name)
+        return SceneManager.getActiveScene().gameObjects.find(go => go.name == name)
     }
 }

updated engine/Input.js
             Input.buttonsDown.push(event.button)
             Input.buttonsDownThisFrame.push(event.button)
         }
+        //Check to see if I clicked on anyone
+        //Call a certain function on all those game objects
     }
     static mouseup(event) {

updated engine/Scene.js
             gameObject.transform.position = position
     }
 }
+function instantiate(gameObject, position){
+    SceneManager.getActiveScene().instantiate(gameObject, position)
+}

updated game/components/MainController.js
     //Create a star field
     // console.log("Hi")
     for(let i = 0; i < 100; i++){
-      Engine.currentScene.instantiate(new StarGameObject(), new Vector2((Math.random()*2-1)*1500, (Math.random()*2-1)*1000))
+      instantiate(new StarGameObject(), new Vector2((Math.random()*2-1)*1500, (Math.random()*2-1)*1000))
     }
   }
   update(){
     if(!GameObject.find("Enemy Game Object")){
       this.wave++
       for(let i = 0; i < this.wave; i++){
-        Engine.currentScene.instantiate(new EnemyGameObject(), new Vector2(i*20, i*20))
+        instantiate(new EnemyGameObject(), new Vector2(i*20, i*20))
       }
     }
   }

updated game/components/PlayerController.js
         if (this.frame >= this.nextFireFrame) {
             if (this.nextRight) {
-                Engine.currentScene.instantiate(new LaserGameObject(), this.transform.position.plus(Vector2.right.times(10)))
+                instantiate(new LaserGameObject(), this.transform.position.plus(Vector2.right.times(10)))
             }
             else {
-                Engine.currentScene.instantiate(new LaserGameObject(), this.transform.position.plus(Vector2.left.times(10)))
+                instantiate(new LaserGameObject(), this.transform.position.plus(Vector2.left.times(10)))
             }
             this.nextRight = !this.nextRight
             this.nextFireFrame = this.frame + 10

updated Whack-a-mole.html
     class MainScene extends Scene {
       constructor() {
         super()
-        this.instantiate(new CameraGameObject())
+        const cameraGameObject = new CameraGameObject()
+        cameraGameObject.getComponent(Camera).backgroundColor = "white"
+        this.instantiate(cameraGameObject)
         this.instantiate(new MoleGameObject(), new Vector2(100, 100))
         this.instantiate(new PointsGameObject(), new Vector2(20, 100))
         this.instantiate(new ClickGameObject())
...
     class ClickController extends Component {
       update() {
         console.log(Input.buttonsDown, Input.mousePosition)
-        if (Input.mousePosition)
-          this.transform.position = Input.mousePosition.clone()
+        if (Input.mousePosition) {
+          this.transform.position = Camera.screenToWorldSpace(Input.mousePosition.clone())
         }
+      }
       onCollisionEnter(other) {
         if (Input.buttonsUpThisFrame.includes(0))
           GameObject.find("Points Game Object").getComponent(PointsController).points++
...
     Engine.currentScene = new MainScene()
-    Engine.start({layers:[]})
+    Engine.start({ layers: [] })
   </script>
 </body>
```