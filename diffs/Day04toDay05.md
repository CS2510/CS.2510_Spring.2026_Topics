Here's what changed in the code:
```diff
renamed Day04.html to Day05.html with the following changes:
 <html>
 <head>
-    <title>Day 04 Game</title>
+    <title>Day 05 Game</title>
+    <style>
+        *{
+            margin: 0;
+            overflow: hidden;
+        }
+    </style>
 </head>
...
     <script src="./engine/Component.js"></script>
     <script src="./engine/Input.js"></script>
+    <script src="./engine/components/Transform.js"></script>
+    <script src="./engine/components/Polygon.js"></script>
     <!-- Game-specific Code -->
-    <script src="./game/MainScene.js"></script>
-    <script src="./game/TriangleGameObject.js"></script>
-    <script src="./game/TriangleController.js"></script>
-    <script src="./game/SquareGameObject.js"></script>
-    <script src="./game/SquareController.js"></script>
+    <script src="./game/scenes/MainScene.js"></script>
+    <script src="./game/prefabs/TriangleGameObject.js"></script>
+    <script src="./game/prefabs/SquareGameObject.js"></script>
+    <script src="./game/components/TriangleController.js"></script>
+    <script src="./game/components/SquareController.js"></script>
     <script>
         //Engine-specific code
...
         //Engine-specific
         function draw() {
+            canvas.width = window.innerWidth
+            canvas.height = window.innerHeight
             //Game-specific
             ctx.fillStyle = "green"
             ctx.beginPath()

deleted file BeforeClass/Day04.html

deleted file BeforeClass/game/MainScene.js

deleted file BeforeClass/game/SquareController.js

deleted file BeforeClass/game/SquareGameObject.js

deleted file BeforeClass/game/TriangleController.js

deleted file BeforeClass/game/TriangleGameObject.js

deleted file game/MainScene.js

deleted file game/SquareController.js

deleted file game/SquareGameObject.js

deleted file game/TriangleController.js

deleted file game/TriangleGameObject.js

deleted file TODO.md

added file BeforeClass/Day05.html

added file BeforeClass/engine/components/Polygon.js

added file BeforeClass/engine/components/Transform.js

added file BeforeClass/game/components/SquareController.js

added file BeforeClass/game/components/TriangleController.js

added file BeforeClass/game/prefabs/FastTriangleGameObject.js

added file BeforeClass/game/prefabs/SquareGameObject.js

added file BeforeClass/game/prefabs/TriangleGameObject.js

added file BeforeClass/game/scenes/MainScene.js

added file engine/components/Polygon.js

added file engine/components/Transform.js

added file game/components/SquareController.js

added file game/components/TriangleController.js

added file game/prefabs/SquareGameObject.js

added file game/prefabs/TriangleGameObject.js

added file game/scenes/MainScene.js

updated BeforeClass/engine/Component.js
 class Component{
+    gameObject //The parent of the component
+    get transform(){
+        return this.gameObject.transform
+    }
     start(){
     }
     update(){
     }
     draw(){
     }

updated BeforeClass/engine/GameObject.js
 class GameObject {
     components = []
+    constructor(){
+        this.addComponent(Transform)
+    }
     start() {
         for (const component of this.components) {
             component.start()
         }
     }
     update() {
         for (const component of this.components) {
             component.update()
         }
     }
     draw(ctx) {
         for (const component of this.components) {
             component.draw(ctx)
         }
     }
+    addComponent(componentReference, values){
+        let component = new componentReference()
+        Object.assign(component, values)
+        this.components.push(component)
+        component.gameObject = this
     }
+    get transform(){
+        return this.components[0]
+    }
+}

updated BeforeClass/engine/Input.js
 class Input {
-  static keysdown = []
+    static keysDown = []
-  static buttonsdown = []
-  static  mousePosition
     static keydown(event) {
-    if (!Input.keysdown.includes(event.code))
-      Input.keysdown.push(event.code)
+        if (!Input.keysDown.includes(event.code))
+            Input.keysDown.push(event.code)
     }
     static keyup(event) {
-    Input.keysdown = Input.keysdown.filter(k => k != event.code)
+        Input.keysDown = Input.keysDown.filter(k => k != event.code)
     }
-  static mousemove(event){
-    Input.mousePosition = new Vector2(event.clientX, event.clientY)
 }
-  static mousedown(event){
-    if(!Input.buttonsdown.includes(event.button))
-        Input.buttonsdown.push(event.button)
-  }
-  static mouseup(event){
-    Input.buttonsdown = Input.buttonsdown.filter(b=>b!=event.button)
-  }
-}

updated BeforeClass/engine/Scene.js
             gameObject.draw(ctx)
         }
     }
+    instantiate(gameObject, position, rotation){
+        if(position) gameObject.transform.position = position
+        if(rotation) gameObject.transform.position = rotation
+        this.gameObjects.push(gameObject)
     }
+}

updated BeforeClass/engine/Vector2.js
         this.y = y
     }
-    static zero = new Vector2(0,0)
+    static get zero() { return new Vector2(0, 0) }
+    static get left() { return new Vector2(-1, 0) }
+    static get right() { return new Vector2(1, 0) }
+    static get up() { return new Vector2(0, -1) }
+    static get down() { return new Vector2(0, 1) }
+    static get one() { return new Vector2(1, 1) }
-    static left = new Vector2(-1, 0)
-    static right = new Vector2(1, 0)
-    static up = new Vector2(0, -1)
-    static down = new Vector2(0, 1)
     plusEquals(other) {
         this.x += other.x
         this.y += other.y
+        return this
     }
+    scaledEquals(scalar){
+        this.x *= scalar
+        this.y *= scalar
+        return this
     }
+}

updated engine/Component.js
     draw(){
     }
+    get transform(){
+        return this.gameObject.transform
     }
+}

updated engine/GameObject.js
 class GameObject {
     components = []
+    constructor(){
+        this.addComponent(new Transform())
+    }
     start() {
         for (const component of this.components) {
             component.start()
...
             component.draw(ctx)
         }
     }
+    addComponent(component, values){
+        this.components.push(component)
+        component.gameObject = this
+        Object.assign(component, values)
     }
+    get transform(){
+        return this.components[0]
+    }
+}

updated engine/Scene.js
             gameObject.draw(ctx)
         }
     }
+    instantiate(gameObject, position){
+        this.gameObjects.push(gameObject)
+        if(position)
+            gameObject.transform.position = position
     }
+}

updated engine/Vector2.js
         this.y = y
     }
-    static zero = new Vector2(0, 0)
-    static left = new Vector2(-1, 0)
-    static right = new Vector2(1, 0)
-    static up = new Vector2(0, -1)
-    static down = new Vector2(0, 1)
+    static get zero() { return new Vector2(0, 0) }
+    static get left() { return new Vector2(-1, 0) }
+    static get right() { return new Vector2(1, 0) }
+    static get up() { return new Vector2(0, -1) }
+    static get down() { return new Vector2(0, 1) }
     plusEquals(other) {
         this.x += other.x
         this.y += other.y
```