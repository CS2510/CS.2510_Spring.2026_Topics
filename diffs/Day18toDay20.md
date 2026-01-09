Here's what changed in the code:
```diff
renamed Day17.html to Day20.html with the following changes:
 <html>
 <head>
-    <title>Day 17 Game</title>
+    <title>Day 20 Game</title>
     <style>
         *{
             margin: 0;
...
     <script src="./game/prefabs/ScoreGameObject.js"></script>
     <script src="./game/prefabs/MainControllerGameObject.js"></script>
     <script src="./game/prefabs/StarGameObject.js"></script>
+    <script src="./game/prefabs/HighScoreGameObject.js"></script>
+    <script src="./game/prefabs/EnemyCountGameObject.js"></script>
     <script src="./game/components/EnemyController.js"></script>
     <script src="./game/components/PlayerController.js"></script>
...
     <script src="./game/components/MainController.js"></script>
     <script src="./game/components/StarController.js"></script>
     <script src="./game/components/StartSceneController.js"></script>
+    <script src="./game/components/ButtonController.js"></script>
+    <script src="./game/components/HighScoreTextController.js"></script>
+    <script src="./game/components/EnemyCountController.js"></script>
     <script src="./game/GameProperties.js"></script>
     <script src="./game/GameAssets.js"></script>
+    <script src="./game/GameGlobals.js"></script>
     <script>

deleted file ballDrop.html

deleted file gameCollision.html

deleted file platformer.html

deleted file separateAxisTheorem.html

deleted file Whack-a-mole.html

added file game/components/ButtonController.js

added file game/components/EnemyCountController.js

added file game/components/HighScoreTextController.js

added file game/GameGlobals.js

added file game/prefabs/EnemyCountGameObject.js

added file game/prefabs/HighScoreGameObject.js

updated engine/Collisions.js
  * The class that does collision detection in a scene.
  * This should not be called directly by any game components.
  * Instead, components should listen for OnCollisionEnter()
+ * 
  */
 class Collisions {
+  /**
+   * @param {GameObject} a
+   * @param {GameObject} b
+   * 
+   * @returns {Vector2|false}
+   */
   static inCollision(a, b) {
     //Get the points in the polygons on each game object
     const originalPointsA = a.getComponent(Polygon).points
...
     for (const polygonPoints of [worldPointsA, worldPointsB]) {
       for (let i = 0; i < polygonPoints.length; i++) {
         const a = polygonPoints[i]
-        const b = polygonPoints[(i+1)%polygonPoints.length]
+        const b = polygonPoints[(i + 1) % polygonPoints.length]
         lines.push(a.minus(b).orthogonal().normalize())
       }
     }
...
       //...and if there is a gap, they are not in collision
       const diffA = Math.max(...oneDots) - Math.min(...twoDots)
       const diffB = Math.max(...twoDots) - Math.min(...oneDots)
-      if ( diffA < 0 || diffB < 0 ) return false
+      if (diffA < 0 || diffB < 0) return false
       const minDiff = Math.min(diffA, diffB)
       diffs.push(minDiff)
...
     const minDiffIndex = diffs.indexOf(minDiff)
     const mtvLine = lines[minDiffIndex]
     return mtvLine.times(minDiff)
+  }
+  static inCollisionPointGameObject(a, b) {
+    //Get the points in the polygons on each game object
+    const originalPointsB = b.getComponent(Polygon).points
+    //Apply the scale and positional transformational attributes to the points
+    const worldPointsB = originalPointsB.map(p => Vector2.fromDOMPoint(b.transform.getWorldMatrix().transformPoint(p.toDOMPoint())))
+    //Where each line formed by the polygons is stored
+    const lines = []
+    //For all point pairs in both arrays, find the orthogonal line and add it to lines
+    for (const polygonPoints of [worldPointsB]) {
+      for (let i = 0; i < polygonPoints.length; i++) {
+        const a = polygonPoints[i]
+        const b = polygonPoints[(i + 1) % polygonPoints.length]
+        lines.push(a.minus(b).orthogonal().normalize())
+      }
+    }
+    //For each line...
+    const diffs = []
+    for (const line of lines) {
+      //...Find the dot product of all points in both polygons...
+      const oneDots = [a].map(p => p.dot(line))
+      const twoDots = worldPointsB.map(p => p.dot(line))
+      //...and if there is a gap, they are not in collision
+      const diffA = Math.max(...oneDots) - Math.min(...twoDots)
+      const diffB = Math.max(...twoDots) - Math.min(...oneDots)
+      if (diffA < 0 || diffB < 0) return false
+    }
+    //If we get here, then the polygons were always overlapping, so we know they are in collision
     return true
   }
+  static raycast(point){
+    for(const gameObject of SceneManager.getActiveScene().gameObjects.filter(go=>go.layer == "UI" && go.getComponent(Collider))){
+      if(Collisions.inCollisionPointGameObject(point, gameObject)){
+        return gameObject
       }
+    }
+  }
+}

updated engine/components/Text.js
      */
     font = "24px 'Comic Sans MS'"
+    textAlign = "left"
+    textBaseline = "alphabetic"
     /**
      * Draw the text ot the screen
      * @param {CanvasRenderingContext2D} ctx The context we are drawing to
...
     draw(ctx) {
         ctx.fillStyle = this.fillStyle
         ctx.font = this.font
+        ctx.textAlign = this.textAlign
+        ctx.textBaseline = this.textBaseline
         ctx.fillText(this.text, 0, 0)
     }
 }

updated engine/Engine.js
      */
     static layers = ["", "UI"]
+    static collisionLayers = [["", ""]]
     /**
      * The canvas element we will draw to
...
      * @param {GameProperties} gameProperties Optional argument for specific game-specific properties
      */
     static start(gameProperties) {
-        if(gameProperties)
+        if (gameProperties){
             Engine.layers.push(...gameProperties.layers)
+            if(gameProperties.collisionLayers){
+                Engine.collisionLayers = gameProperties.collisionLayers
+            }
+        }
         Engine.canvas = document.querySelector("#canv")
         Engine.ctx = Engine.canvas.getContext("2d")
...
         Engine.update()
         Engine.draw()
         Input.update()
+        Time.update()
         requestAnimationFrame(Engine.gameLoop)
     }

updated engine/GameObject.js
      */
     layer = ""
+    tag = ""
     /**
      * 
      * @param {string} name The name of the game object
...
     static find(name) {
         return SceneManager.getActiveScene().gameObjects.find(go => go.name == name)
     }
+    static findByTag(tag){
+        return SceneManager.getActiveScene().gameObjects.filter(go => go.tag == tag)
     }
+}

updated engine/Scene.js
         }
         //Do Collision Detection
-        const gameObjectsWithColliders = this.gameObjects.filter(go => go.getComponent(Collider))
-        for (let i = 0; i < gameObjectsWithColliders.length; i++) {
-            for (let j = i + 1; j < gameObjectsWithColliders.length; j++) {
-                let a = gameObjectsWithColliders[i]
-                let b = gameObjectsWithColliders[j]
+        for (const collisionLayer of Engine.collisionLayers) {
+            const gameObjectsWithCollidersA = this.gameObjects.filter(go => go.getComponent(Collider) && go.layer == collisionLayer[0])
+            const gameObjectsWithCollidersB = this.gameObjects.filter(go => go.getComponent(Collider) && go.layer == collisionLayer[1])
+            for (let i = 0; i < gameObjectsWithCollidersA.length; i++) {
+                for (let j = 0; j < gameObjectsWithCollidersB.length; j++) {
+                    let a = gameObjectsWithCollidersA[i]
+                    let b = gameObjectsWithCollidersB[j]
+                    if(a == b) continue
                     let response = Collisions.inCollision(a, b)
                     if (response) {
...
                     }
                 }
             }
+        }
         //Delete what needs to be removed
         this.gameObjects = this.gameObjects.filter(go => !go.markForDelete)
...
  * @param {Vector2} position The position of the game object
  * @returns {GameObject} The created game object
  */
-function instantiate(gameObject, position){
+function instantiate(gameObject, position) {
     return SceneManager.getActiveScene().instantiate(gameObject, position)
 }

updated engine/Time.js
      * @type {number}
      */
     static deltaTime = 1/60
+    static time = 0
+    static frames = 0
+    static update(){
+        Time.time += Time.deltaTime
+        Time.frames++
     }
+}

updated game/components/MainController.js
         instantiate(new EnemyGameObject(), new Vector2(i*20, i*20))
       }
     }
+    //Cheat codes
+    console.log(Input.keysDownThisFrame)
+    if(Input.keysDownThisFrame.includes("Delete"))
+    {
+      SceneManager.loadScene(new StartScene())
     }
   }
+}

updated game/components/PlayerController.js
 class PlayerController extends Component {
     start() {
-        this.frame = 0 // Which frame are we on?
-        this.nextFireFrame = 10 //The frame when we are going to fire next
+        // this.frame = 0 // Which frame are we on?
+        this.nextFireFrame = Time.frames + 10 //The frame when we are going to fire next
         this.nextRight = true //Tracks which side we are going to fire on
         this.speed = 200 //The speed our ship can travel
         this.boundsX = 1000
...
     }
     update() {
-        this.frame++
+        // this.frame++
         let proposedChange = Vector2.zero
...
         if (this.transform.position.y > this.boundsY) this.transform.position.y = this.boundsY
-        if (this.frame >= this.nextFireFrame) {
+        if (Time.frames >= this.nextFireFrame) {
             if (this.nextRight) {
                 instantiate(new LaserGameObject(), this.transform.position.plus(Vector2.right.times(10)))
             }
...
                 instantiate(new LaserGameObject(), this.transform.position.plus(Vector2.left.times(10)))
             }
             this.nextRight = !this.nextRight
-            this.nextFireFrame = this.frame + 10
+            this.nextFireFrame = Time.frames + 10
         }
     }
+    onCollisionEnter(){
+        SceneManager.loadScene(new StartScene())
     }
+}

updated game/components/ScoreController.js
+//@ts-nocheck
 class ScoreController extends Component{
     score = 0
     update(){
         this.gameObject.getComponent(Text).text = "Score: " + this.score
+        if(GameGlobals.highScore < this.score)
+            GameGlobals.highScore = this.score
     }
 }

updated game/components/StartSceneController.js
     }
     update(){
         this.time += Time.deltaTime
-        // if(this.time > 3){
-        if(Input.keysDown.length > 0){
-            SceneManager.loadScene(new MainScene())
+        // if(Input.keysDown.length > 0){
+        //     SceneManager.loadScene(new MainScene())
+        // }
     }
 }
-}

updated game/GameProperties.js
 class GameProperties{
-    layers = ["foreground"]
+    layers = ["foreground", "enemy", "laser", "player"]
+    collisionLayers = [["player", "enemy"], ["laser", "enemy"]]
 }

updated game/prefabs/EnemyGameObject.js
 class EnemyGameObject extends GameObject{
     constructor(){
-        super('Enemy Game Object')
+        super('Enemy Game Object', {layer: "enemy", tag:"enemy"})
         this.addComponent(new EnemyController())
         this.addComponent(new Polygon(), {fillStyle: "blue"})
         this.addComponent(new Collider())

updated game/prefabs/LaserGameObject.js
 class LaserGameObject extends GameObject{
     constructor(){
-        super("Laser Game Object")
+        super("Laser Game Object", {layer:"laser"})
         this.addComponent(new Polygon(), {fillStyle: "green", points:[new Vector2(-1, -1), new Vector2(-1, 1), new Vector2(1, 1), new Vector2(1, -1)]})
         this.addComponent(new LaserController())
         this.addComponent(new Collider())

updated game/prefabs/PlayerGameObject.js
 class PlayerGameObject extends GameObject{
     constructor(){
-        super("Player Game Object", {layer:"foreground"})
+        super("Player Game Object", {layer:"player", tag:"player"})
         this.addComponent(new PlayerController())
         this.addComponent(new Polygon(), {fillStyle:"red"})
+        this.addComponent(new Collider())
         this.transform.scale = new Vector2(20, 20)
     }
 }

updated game/scenes/MainScene.js
         this.instantiate(new PlayerGameObject(), new Vector2(100, 300))
         //UI Game Objects
-        this.instantiate(new ScoreGameObject(), new Vector2(100, 30))
+        const textParent = new GameObject("Text Parent Game Object", {layer: "UI"})
+        this.instantiate(textParent, new Vector2(100, 100))
+        const score = this.instantiate(new ScoreGameObject(), new Vector2(0, 0))
+        score.transform.setParent(textParent.transform)
+        const highScore = this.instantiate(new HighScoreGameObject(), new Vector2(0, 30))
+        highScore.transform.setParent(textParent.transform)
+        const enemyCount = this.instantiate(new EnemyCountGameObject(), new Vector2(0, 60))
+        enemyCount.transform.setParent(textParent.transform)
     }
 }

updated game/scenes/StartScene.js
     constructor(){
         super()
+        /* The camera */
         const camera = new CameraGameObject()
         camera.getComponent(Camera).backgroundColor = "orange"
         this.instantiate(camera)
+        /* The main text */
+        const textParent = new GameObject("Text Parent Game Object")
+        this.instantiate(textParent, new Vector2(100, 100))
         const titleText = new GameObject("Title Text Game Object", {layer: "UI"})
-        titleText.addComponent(new Text(), {fillStyle: "black", text: "Galaxy Guardians"})
-        this.instantiate(titleText, new Vector2(100, 100))
+        titleText.addComponent(new Text(), {fillStyle: "white", text: "Galaxy Guardians"})
+        this.instantiate(titleText, new Vector2(0, 0))
+        titleText.transform.setParent(textParent.transform)
+        const highScoreText = new HighScoreGameObject()
+        this.instantiate(highScoreText, new Vector2(0, 50))
+        highScoreText.transform.setParent(textParent.transform)
+        /* The button */
+        const buttonParent = new GameObject("Button Parent Game Object")
+        this.instantiate(buttonParent, new Vector2(200,200))
         const button = new GameObject("Start Button Game Object", {layer:"UI"})
         button.addComponent(new Polygon, {fillStyle: "blue", points:GameAssets.square})
+        button.addComponent(new ButtonController())
+        button.addComponent(new Collider())
         button.transform.scale = new Vector2(100, 20)
-        this.instantiate(button, new Vector2(200, 200))
+        this.instantiate(button, new Vector2(0, 0))
+        button.transform.setParent(buttonParent.transform)
+        const startText = new GameObject("Start Text Game Object", {layer:"UI"})
+        startText.addComponent(new Text(), {text: "Start Game", fillStyle:"white", textAlign: "center", textBaseline:"middle"})
+        this.instantiate(startText, new Vector2(0, 0))
+        startText.transform.setParent(buttonParent.transform)
+        /* The controller */
         const startSceneControllerGameObject = new GameObject("Start Scene Controller Game Object")
         startSceneControllerGameObject.addComponent(new StartSceneController())
         this.instantiate(startSceneControllerGameObject)

updated jsconfig.json
     "checkJs": true,
     "lib":["esnext", "dom"],
   },
+  "exclude":[
+    "before"
+  ]
 }
```