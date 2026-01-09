Here's what changed in the code:
```diff
added file jsconfig.json

updated engine/CameraGameObject.js
+/**
+ * The camera game object that should be in every scene
+ */
 class CameraGameObject extends GameObject{
     constructor(){
         super("Camera Game Object")

updated engine/Collisions.js
+/**
+ * The class that does collision detection in a scene.
+ * This should not be called directly by any game components.
+ * Instead, components should listen for OnCollisionEnter()
+ */
 class Collisions {
   static inCollision(a, b) {
     //Get the points in the polygons on each game object
...
     const originalPointsB = b.getComponent(Polygon).points
     //Apply the scale and positional transformational attributes to the points
-    const worldPointsA = originalPointsA.map(p => p.rotate(a.transform.rotation).scale(a.transform.scale).plus(a.transform.position))
-    const worldPointsB = originalPointsB.map(p => p.rotate(b.transform.rotation).scale(b.transform.scale).plus(b.transform.position))
+    const worldPointsA = originalPointsA.map(p => Vector2.fromDOMPoint(a.transform.getWorldMatrix().transformPoint(p.toDOMPoint())))
+    const worldPointsB = originalPointsB.map(p => Vector2.fromDOMPoint(b.transform.getWorldMatrix().transformPoint(p.toDOMPoint())))
     //Where each line formed by the polygons is stored
     const lines = []

updated engine/Component.js
 /**
- * A component class. All the custom code for a game is contained in components
+ * A component class. All the custom code for a game is contained in components.
+ * Unlike Unity, we inherit directly from Component. When working in Unity, all game-specific code will inherit from MonoBehavior.
  * 
  * See: https://docs.unity3d.com/ScriptReference/Component.html
  */
 class Component{
+    /**
+     * @type {GameObject} The parent of this component
+     * See https://docs.unity3d.com/ScriptReference/Component-gameObject.html
+     */
+    gameObject
+    /**
+     * Start the game object. Called once before a game object is updated the first time
+     */
     start(){
     }
+    /**
+     * Update the game object. Called after start is called. Should be called once a frame before rendering.
+     */
     update(){
     }
-    draw(){
+    /**
+     * Draw to the screen
+     * 
+     * @param {CanvasRenderingContext2D} ctx The context to which we are rendering
+     */
+    draw(ctx){
     }
+    /**
+     * Get the transform of the parent game object.
+     * See https://docs.unity3d.com/ScriptReference/Component-transform.html
+     */
     get transform(){
         return this.gameObject.transform
     }

updated engine/components/Camera.js
+/**
+ * Camera component class.
+ * Each scene should have a camera game object with this component attached.
+ * 
+ * See https://docs.unity3d.com/ScriptReference/Camera.html
+ */
 class Camera extends Component{
+    /**
+     * The background color of the scene
+     * See https://docs.unity3d.com/ScriptReference/Camera-backgroundColor.html
+     * @type {string}
+     */
     backgroundColor = "magenta"
+    /**
+     * Get the main camera game object in the scene
+     * See https://docs.unity3d.com/ScriptReference/Camera-main.html
+     * @type {CameraGameObject}
+     */
     static get main(){
         return GameObject.find("Camera Game Object")
     }
+    /**
+     * Convert a screen space point to a world space point.
+     * Compare to https://docs.unity3d.com/ScriptReference/Camera.ScreenToWorldPoint.html
+     * 
+     * @param {Vector2} screenSpace The screen space point to convert
+     * @returns {Vector2} The world space point
+     */
     static screenToWorldSpace(screenSpace){
         let screen  = new DOMPoint(screenSpace.x, screenSpace.y)
         let matrix = new DOMMatrix()

updated engine/components/Collider.js
+/**
+ * Collider component.
+ * In order for collisions for a game object to be calculated, it must have this collider attached to it.
+ * 
+ * See https://docs.unity3d.com/6000.2/Documentation/ScriptReference/Collider.html
+ */
 class Collider extends Component{
 }

updated engine/components/Polygon.js
+/**
+ * Polygon component.
+ * This is main class for drawing in our engine (other that Text).
+ * 
+ * In order for a polygon to be drawn, it needs a fillStyle color and a list of Vector2 point.
+ */
 class Polygon extends Component {
+    /**
+     * The fill style of the polygon
+     * @type {string}
+     */
     fillStyle = "magenta"
+    /**
+     * The points that make up the polygon
+     * @type {Vector2[]}
+     */
     points = [new Vector2(0, -1), new Vector2(1, 1), new Vector2(-1, 1)]
+    /**
+     * Draw the polygon to the screen
+     * 
+     * @param {CanvasRenderingContext2D} ctx 
+     */
     draw(ctx) {
         ctx.fillStyle = this.fillStyle
         ctx.beginPath()
         for (const point of this.points) {
             ctx.lineTo(point.x, point.y)

updated engine/components/RigidBody.js
+/**
+ * Rigid Body component.
+ * Any game object with a rigid body attached will respond to collisions by preventing collisions.
+ * 
+ * See https://docs.unity3d.com/ScriptReference/Rigidbody.html
+ */
 class RigidBody extends Component{
+    /**
+     * @type {Vector2} The instantaneous velocity of the game object
+     */
     velocity = Vector2.zero
+    /**
+     * @type {Vector2} The instantaneous acceleration of the game object
+     */
     acceleration = Vector2.zero
+    /**
+     * @type {Vector2} The gravity that will be applied every frame to this game object
+     */
     gravity = Vector2.zero
     update(){
         this.velocity.plusEquals(this.acceleration.times(Time.deltaTime))
         this.velocity.plusEquals(this.gravity.times(Time.deltaTime))

updated engine/components/Text.js
+/**
+ * Text component.
+ * The main drawing component other than Polygon
+ * 
+ * To be drawn, this component need to have a fillStyle color, a string text, and a font in CSS font format.
+ * Note: There is a naming conflict with the DOM Text interface, hence the @ts-ignore below
+ * TODO: In a future semester it might help to given this a different name so there isn't a conflict with the Text DOM class
+ */
+//@ts-ignore
 class Text extends Component {
+    /**
+     * @type {string} The color of the text
+     */
     fillStyle = "magenta"
+    /**
+     * @type {string} The value of the text itself
+     */
     text = "[NO TEXT]"
+    /**
+     * @type{string} The font to use
+     */
     font = "24px 'Comic Sans MS'"
+    /**
+     * Draw the text ot the screen
+     * @param {CanvasRenderingContext2D} ctx The context we are drawing to
+     */
     draw(ctx) {
         ctx.fillStyle = this.fillStyle
         ctx.font = this.font
-        // ctx.save()
-        // ctx.translate(this.transform.position.x, this.transform.position.y)
-        // ctx.scale(this.transform.scale.x, this.transform.scale.y)
-        // ctx.rotate(this.transform.rotation)
         ctx.fillText(this.text, 0, 0)
-        // ctx.restore()
     }
 }

updated engine/components/Transform.js
+/**
+ * Transform component.
+ * Each game object is required to have a transform. The transform should be added automatically at game object creation time by the engine.
+ * 
+ * This stores information about a game object's world space attributes and its position in the game object hierarchy.
+ * 
+ * See https://docs.unity3d.com/6000.2/Documentation/ScriptReference/Transform.html
+ */
 class Transform extends Component{
+    /**
+     * The local position of the game object
+     * Unlike Unity, this stores the local position of the game object
+     * See https://docs.unity3d.com/6000.2/Documentation/ScriptReference/Transform-position.html
+     * @type {Vector2} 
+     */
     position = new Vector2(0,0)
+    /**
+     * The local rotation of the game object
+     * Unlike Unity, this stores the local rotation of the game object.
+     * Also, we store rotation as a number, not as a quaternion.
+     * See https://docs.unity3d.com/6000.2/Documentation/ScriptReference/Transform-rotation.html
+     * @type {Number} 
+     */
     rotation = 0
+    /**
+     * The local scale of the game object
+     * See https://docs.unity3d.com/6000.2/Documentation/ScriptReference/Transform-localScale.html
+     * @type {Vector2} 
+     */
     scale = new Vector2(1,1)
+    /**
+     * The transform of the game object that is our parent.
+     * If this is falsey, then the game object is at the top level of the game object hierarchy in the scene.
+     * See https://docs.unity3d.com/6000.2/Documentation/ScriptReference/Transform-parent.html
+     * @type {Transform}
+     */
+    parent = undefined 
+    /**
+     * Set the parent of the game object transform.
+     * Note that this must be the transform of a game object, not the game object itself.
+     * https://docs.unity3d.com/6000.2/Documentation/ScriptReference/Transform.SetParent.html
+     * @param {Transform} parentTransform 
+     */
+    setParent(parentTransform){
+        this.parent = parentTransform
     }
+    /**
+     * Get the local transform of the game object as a matrix.
+     * @returns {DOMMatrix}
+     */
+    getLocalMatrix(){
+        const matrix = new DOMMatrix()
+        matrix.translateSelf(this.position.x, this.position.y)
+        matrix.scaleSelf(this.scale.x, this.scale.y)
+        matrix.rotateSelf(this.rotation * (180/Math.PI))
+        return matrix
+    }
+    /**
+     * Get the world transform of the game object as a matrix.
+     * @returns {DOMMatrix}
+     */
+    getWorldMatrix(){
+        if(!this.parent) return this.getLocalMatrix()
+        return this.parent.getWorldMatrix().multiply(this.getLocalMatrix())
+    }
+}

updated engine/Engine.js
+/**
+ * The main engine class of our engine. It starts the game and runs the game loop.
+ */
 class Engine {
+    /**
+     * The list of default layers in our engine.
+     * @type {string[]} 
+     */
     static layers = ["", "UI"]
-    //Engine-specific
+    /**
+     * The canvas element we will draw to
+     * @type {HTMLCanvasElement}
+     */
+    static canvas
+    /**
+     * The 2D context we will draw to
+     * @type {CanvasRenderingContext2D}
+     */
+    static ctx
+    /**
+     * Start the game
+     * @param {GameProperties} gameProperties Optional argument for specific game-specific properties
+     */
     static start(gameProperties) {
+        if(gameProperties)
         Engine.layers.push(...gameProperties.layers)
         Engine.canvas = document.querySelector("#canv")
         Engine.ctx = Engine.canvas.getContext("2d")
...
         addEventListener("mousedown", Input.mousedown)
         addEventListener("mouseup", Input.mouseup)
         addEventListener("mousemove", Input.mousemove)
-        //Game-specific
         SceneManager.update()
         SceneManager.getActiveScene().start()
         Engine.gameLoop()
     }
-    //Engine-specific code
+    /**
+     * Run the game loop. This update the various static classes, then updates the game objects and draw them.
+     */
     static gameLoop() {
         SceneManager.update()
         Engine.update()
...
         requestAnimationFrame(Engine.gameLoop)
     }
-    //Engine-specific
+    /**
+     * Update all the game objects in the scene
+     */
     static update() {
         SceneManager.getActiveScene().update()
     }
-    //Engine-specific
+    /**
+     * Draw all the game objects in the scene
+     */
     static draw() {
         Engine.canvas.width = window.innerWidth
         Engine.canvas.height = window.innerHeight
-        //Game-specific
+        //@ts-ignore Since this call results in a Camera component, we can set backgroundColor
         Engine.ctx.fillStyle = Camera.main.getComponent(Camera).backgroundColor
         Engine.ctx.beginPath()
         Engine.ctx.rect(0, 0, Engine.canvas.width, Engine.canvas.height)
         Engine.ctx.fill()
         SceneManager.getActiveScene().draw(Engine.ctx)
     }
 }

updated engine/GameObject.js
  */
 class GameObject {
+    /**
+     * The components inside this game object
+     * See https://docs.unity3d.com/ScriptReference/GameObject.GetComponents.html
+     * @type {Component[]}
+     */
     components = []
+    /**
+     * Flag that tracks of this game object has started
+     * @type {boolean}
+     */
     hasStarted = false
+    /**
+     * Flag that tracks if this game object has been marked for deletion
+     * Game objects that have been marked for delete are removed before the next update
+     * You should not edit this directly. Instead call destroy()
+     */
     markForDelete = false
+    /**
+     * The name of the game object
+     * See https://docs.unity3d.com/ScriptReference/Object-name.html
+     * @type {string}
+     */
     name = "[NO NAME]"
+    /**
+     * The layer this game object is assigned to.
+     * Unlike Unity, we reference layers by their string name, not their integer index
+     * See https://docs.unity3d.com/ScriptReference/GameObject-layer.html
+     * @type {string}
+     */
     layer = ""
+    /**
+     * 
+     * @param {string} name The name of the game object
+     * @param {object} options Option set of values to assign to this game object
+     */
     constructor(name, options) {
         Object.assign(this, options)
         this.addComponent(new Transform())
         this.name = name
     }
+    /**
+     * 
+     * @param {string} name Name of the message to broadcast
+     * @param {object[]} args A list of arguments to pass to the component function if it is found 
+     * See https://docs.unity3d.com/ScriptReference/GameObject.BroadcastMessage.html
+     */
     broadcastMessage(name, args){
         for(const component of this.components){
             if(component[name]){
...
             }
         }
     }
+    /**
+     * Start the game object.
+     * You should not call this function. It is only used by the engine.
+     */
     start() {
-        // for (const component of this.components) {
-        //     component.start()
-        // }
         this.broadcastMessage("start", [])
     }
+    /**
+     * Update the game object.
+     * You should not call this function. It is only used by the engine.
+     */
     update() {
         if (!this.hasStarted) {
             this.hasStarted = true
             this.start()
         }
-        // for (const component of this.components) {
-        //     component.update()
-        // }
         this.broadcastMessage("update", [])
     }
+    /**
+     * Draw the game object.
+     * You should not call this function. It is only used by the engine.
+     * @param {CanvasRenderingContext2D} ctx The context to which we are rendering
+     */
     draw(ctx) {
         for (const component of this.components) {
             ctx.save()
-            ctx.translate(this.transform.position.x, this.transform.position.y)
-            ctx.scale(this.transform.scale.x, this.transform.scale.y)
-            ctx.rotate(this.transform.rotation)
+            const worldMatrix = this.transform.getWorldMatrix()
+            ctx.setTransform(ctx.getTransform().multiply(worldMatrix))
             component.draw(ctx)
             ctx.restore()
         }
     }
+    /**
+     * Add a component to this game object and set any parameters
+     * Note: Parameter type includes `|*` to allow Text component despite naming conflict with DOM Text interface
+     * @param {Component|*} component The component to add to the game object
+     * @param {object} values Any values to assign to this component
+     */
     addComponent(component, values) {
         this.components.push(component)
         component.gameObject = this
         Object.assign(component, values)
     }
+    /**
+     * The transform of the game object
+     * See https://docs.unity3d.com/ScriptReference/GameObject-transform.html
+     * @type {Transform}
+     */
     get transform() {
+        //@ts-ignore The first component is always a transform
         return this.components[0]
     }
+    /**
+     * Destroy this game object.
+     * Unlike Unity, this is not a state function
+     * See https://docs.unity3d.com/ScriptReference/Object.Destroy.html
+     */
     destroy() {
         this.markForDelete = true
     }
+    /**
+     * Get a component of a certain type
+     * See https://docs.unity3d.com/ScriptReference/GameObject.GetComponent.html
+     * Note: Parameter and return types use `*` to allow Text component despite naming conflict with DOM Text interface
+     * @template  {Component} T
+     * @param {(new()=>T)|*} type 
+     * @returns {*} The first component found on the game object that matches the given type
+     */
     getComponent(type) {
         return this.components.find(go => go instanceof type)
     }
+    /**
+     * Find a game object of a certain name
+     * @param {string} name 
+     * @returns {GameObject} The first game object with a given name found in the current scene. 
+     */
     static find(name) {
         return SceneManager.getActiveScene().gameObjects.find(go => go.name == name)
     }

updated engine/Input.js
+/**
+ * Static class that manages keyboard and mouse input in our engine.
+ * 
+ * See https://docs.unity3d.com/ScriptReference/Input.html
+ */
 class Input {
+    /**
+     * The keys that are currently down
+     * @type {string[]}
+     */
     static keysDown = []
+    /**
+     * The keys that went down this frame
+     * @type {string[]}
+     */
     static keysDownThisFrame = []
+    /**
+     * The keys that went up this frame
+     * @type {string[]}
+     */
     static keysUpThisFrame = []
-    static buttonsDown = [] //Mouse
+    /**
+     * The mouse buttons that are currently down
+     * @type {number[]}
+     */
+    static buttonsDown = []
+    /**
+     * The mouse buttons that went down this frame
+     * @type {number[]}
+     */
     static buttonsDownThisFrame = []
+    /**
+     * The mouse buttons that went up this frame
+     * @type {number[]}
+     */
     static buttonsUpThisFrame = []
+    /**
+     * The position of the mouse in screen space
+     * @type {Vector2}
+     */
     static mousePosition
+    /**
+     * Event called when a keyboard key goes down
+     * @param {KeyboardEvent} event 
+     */
     static keydown(event) {
-        if (!Input.keysDown.includes(event.code))
-        {
+        if (!Input.keysDown.includes(event.code)) {
             Input.keysDown.push(event.code)
             Input.keysDownThisFrame.push(event.code)
         }
     }
+    /**
+     * Event called when a keyboard key goes up
+     * @param {KeyboardEvent} event 
+     */
     static keyup(event) {
         Input.keysDown = Input.keysDown.filter(k => k != event.code)
         Input.keysUpThisFrame.push(event.code)
     }
+    /**
+     * Event called when a mouse button goes down
+     * @param {MouseEvent} event 
+     */
     static mousedown(event) {
         if (!Input.buttonsDown.includes(event.button)) {
             Input.buttonsDown.push(event.button)
             Input.buttonsDownThisFrame.push(event.button)
         }
-        //Check to see if I clicked on anyone
-        //Call a certain function on all those game objects
     }
+    /**
+     * Event called when a mouse button goes up
+     * @param {MouseEvent} event 
+     */
     static mouseup(event) {
         Input.buttonsDown = Input.buttonsDown.filter(b => b != event.button)
         Input.buttonsUpThisFrame.push(event.button)
     }
-    static mousemove(event){
+    /**
+     * Event called when the mouse position changes
+     * @param {MouseEvent} event 
+     */
+    static mousemove(event) {
         Input.mousePosition = new Vector2(event.clientX, event.clientY)
     }
-    static update(){
+    /**
+     * Updates the state of the input class
+     * Used to clear the state of this-frame lists
+     */
+    static update() {
         Input.keysDownThisFrame = []
         Input.keysUpThisFrame = []
         Input.buttonsDownThisFrame = []

updated engine/Scene.js
 /**
  * Base class for all scenes
  * 
+ * See https://docs.unity3d.com/ScriptReference/SceneManagement.Scene.html
  */
 class Scene {
+    /**
+     * List of game objects in the scene
+     * See https://docs.unity3d.com/ScriptReference/SceneManagement.Scene.GetRootGameObjects.html
+     * @type {GameObject[]}
+     */
     gameObjects = []
+    /**
+     * Start the game objects in the scene
+     */
     start() {
         for (const gameObject of this.gameObjects) {
             gameObject.start()
             gameObject.hasStarted = true
         }
     }
+    /**
+     * Update the game objects in the scene
+     * This includes handling physics and removing game objects
+     */
     update() {
         //Update everything
...
                     for (const component of a.components) {
+                        //@ts-ignore The optional chaining operator takes care of this potential error
                         component.onCollisionEnter?.(b)
                     }
                     for (const component of b.components) {
+                        //@ts-ignore The optional chaining operator takes care of this potential error
                         component.onCollisionEnter?.(a)
                     }
                 }
...
         //Delete what needs to be removed
         this.gameObjects = this.gameObjects.filter(go => !go.markForDelete)
     }
-    draw(ctx) {
+    /**
+     * Draw all the game objects to the screen
+     * @param {CanvasRenderingContext2D} ctx The context to which we are drawing
+     */
+    draw(ctx) {
         ctx.save()
+        //Handle the camera transforms
         ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
         ctx.translate(-Camera.main.transform.position.x, -Camera.main.transform.position.y)
+        //Draw everything that is not part of the UI
         for (const layer of Engine.layers.filter(l => l != "UI")) {
             const gameObjects = this.gameObjects.filter(go => go.layer == layer)
             for (const gameObject of gameObjects) {
...
             }
         }
         ctx.restore()
+        //Handle the UI
         const gameObjects = this.gameObjects.filter(go => go.layer == "UI")
         for (const gameObject of gameObjects) {
             gameObject.draw(ctx)
         }
     }
+    /**
+     * Instantiate a new game object in the scene.
+     * This function should only be called in the constructor of classes that descend from the Scene class.
+     * When creating new game objects in components, call the static version
+     * 
+     * @param {GameObject} gameObject The game object to instantiate
+     * @param {Vector2} [position] The position of the game object to instantiate
+     * @returns {GameObject} The created game object
+     */
     instantiate(gameObject, position) {
         this.gameObjects.push(gameObject)
         if (position)
             gameObject.transform.position = position
+        return gameObject
     }
 }
+/**
+ * Instantiate a new game object in the current scene.
+ * 
+ * See https://docs.unity3d.com/6000.2/Documentation/ScriptReference/Object.Instantiate.html
+ * 
+ * @param {GameObject} gameObject The game object to add to the current scene
+ * @param {Vector2} position The position of the game object
+ * @returns {GameObject} The created game object
+ */
 function instantiate(gameObject, position){
-    SceneManager.getActiveScene().instantiate(gameObject, position)
+    return SceneManager.getActiveScene().instantiate(gameObject, position)
 }

updated engine/SceneManager.js
+/**
+ * Class that manages scenes and the current scenes in our engine.
+ * 
+ * See https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.html
+ */
 class SceneManager{
+    /**
+     * The current scene in the game.
+     * See https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.GetActiveScene.html
+     * @type {Scene}
+     */
     static currentScene
+    /**
+     * If set, the scene that should be loaded on the next frame.
+     * @type {Scene}
+     */
     static nextScene
+    /**
+     * Update the active scene
+     */
     static update(){
         if(SceneManager.nextScene){
             SceneManager.currentScene = SceneManager.nextScene
             SceneManager.nextScene = undefined
         }
     }
+    /**
+     * Load a new scene when we are done updating and drawing this frame
+     * 
+     * See https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.LoadScene.html
+     * 
+     * @param {Scene} scene The scene to load on the next frame
+     */
     static loadScene(scene){
         SceneManager.nextScene = scene
     }
+    /**
+     * Get the active scene.
+     * 
+     * See https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.GetActiveScene.html
+     * 
+     * @returns {Scene} The active scene
+     */
     static getActiveScene(){
         return SceneManager.currentScene
     }

updated engine/Time.js
+/**
+ * Class that manages time in our engine.
+ * 
+ * See https://docs.unity3d.com/ScriptReference/Time.html
+ */
 class Time{
+    /**
+     * The time that has elapsed since our last frame started
+     * See https://docs.unity3d.com/ScriptReference/Time-deltaTime.html
+     * @type {number}
+     */
     static deltaTime = 1/60
 }

updated engine/Vector2.js
  * Represents a 2D vector (direction) or 2D position
  * 
  * See https://docs.unity3d.com/6000.1/Documentation/ScriptReference/Vector2.html
- * 
- * 
  */
 class Vector2 {
...
    * 
    * See https://docs.unity3d.com/6000.1/Documentation/ScriptReference/Vector2-x.html
    *
-   * @type {Number}
+   * @type {number}
    */
     x
...
    * 
    * See https://docs.unity3d.com/6000.1/Documentation/ScriptReference/Vector2-y.html
    *
-   * @type {Number}
+   * @type {number}
    */
     y
...
    * 
    * See https://docs.unity3d.com/6000.1/Documentation/ScriptReference/Vector2-ctor.html
    * 
-   * @param {Number} x The x coordinate of the vector
-   * @param {Number} y The y coordinate of the vector
+   * @param {number} x The x coordinate of the vector
+   * @param {number} y The y coordinate of the vector
    */
     constructor(x, y) {
         this.x = x
         this.y = y
     }
+    /**
+     * Get a new Vector2 with value 0,0
+     * @type {Vector2}
+     */
     static get zero() { return new Vector2(0, 0) }
+    /**
+     * Get a new Vector2 with value -1,0
+     * @type {Vector2}
+     */
     static get left() { return new Vector2(-1, 0) }
+    /**
+     * Get a new Vector2 with value 1,0
+     * @type {Vector2}
+     */
     static get right() { return new Vector2(1, 0) }
+    /**
+     * Get a new Vector2 with value 0,-1
+     * @type {Vector2}
+     */
     static get up() { return new Vector2(0, -1) }
+    /**
+     * Get a new Vector2 with value 0,1
+     * @type {Vector2}
+     */
     static get down() { return new Vector2(0, 1) }
+    /**
+     * Convert from a DOMPoint to a Vector2
+     * @param {DOMPoint} DOMPoint The DOMPoint we are converting from
+     * @returns {Vector2} A new Vector2 with the same x and y as the input DOMPoint
+     */
+    static fromDOMPoint(DOMPoint){
+        return new Vector2(DOMPoint.x, DOMPoint.y)
+    }
+    /**
+     * Convert from a Vector2 to a DOMPoint
+     * @returns {DOMPoint}
+     */
+    toDOMPoint(){
+        return new DOMPoint(this.x, this.y)
+    }
+    /**
+     * Mutate ourself by adding another Vector2
+     * @param {Vector2} other The Vector2 that we are adding to ourself
+     */
     plusEquals(other) {
         this.x += other.x
         this.y += other.y
     }
+    /**
+     * Create a new vector that is the sum of this and the other vector
+     * @param {Vector2} other The vector to which we are being added
+     * @returns {Vector2} The result of the addition
+     */
     plus(other){
         return new Vector2(this.x+other.x, this.y+other.y)
     }
+    /**
+     * Create a new vector that is the subtraction of this and the other vector
+     * @param {Vector2} other The other vector
+     * @returns {Vector2} The result of the subtraction
+     */
     minus(other){
         return new Vector2(this.x - other.x, this.y - other.y)
     }
+    /**
+     * Create a new Vector2 that has the same x and y as this
+     * @returns {Vector2} The new vector
+     */
     clone(){
         return new Vector2(this.x, this.y)
     }
+    /**
+     * Create a new vector that is the result of multiplying each component of this by the scalar
+     * @param {number} scalar The scalar
+     * @returns {Vector2} The new vector
+     */
     times(scalar){
         return new Vector2(this.x*scalar, this.y*scalar)
     }
+    /**
+     * Create a new vector that is the result of the component-wise multiplication of this and the other vector
+     * @param {Vector2} other The other vector
+     * @returns {Vector2} The new vector
+     */
     scale(other){
         return new Vector2(this.x*other.x, this.y*other.y)
     }
+    /**
+     * Do the dot product between this and the other vector
+     * @param {Vector2} other The other vector
+     * @returns {number} The dot product
+     */
     dot(other){
         return this.x*other.x+this.y*other.y
     }
+    /**
+     * Create a new Vector2 that is orthogonal to this.
+     * Note that if this is (0,0), then the returned value is (0,0)
+     * @returns {Vector2} An orthogonal vector
+     */
     orthogonal(){
         return new Vector2(-this.y, this.x)
     }
+    /**
+     * Get the magnitude of the current vector
+     * @type {number}
+     */
     get magnitude(){
         return Math.sqrt(this.x**2+this.y**2)
     }
+    /**
+     * Create a new vector of length 1 in the same direction as this vector.
+     * Note that if the vector has 0 length, this vector is cloned and returned.
+     * @returns {Vector2} The normalized vector
+     */
     normalize(){
+        if(this.magnitude == 0) return this.clone()
         return new Vector2(this.x/this.magnitude, this.y/this.magnitude)
     }
+    /**
+     * Create a new vector that is rotated around the origin by the given number of radians
+     * @param {number} radians The radians to rotate by
+     * @returns {Vector2} The rotated vector
+     */
     rotate(radians){
         const newAngle = radians + Math.atan2(this.y, this.x)
         return new Vector2(Math.cos(newAngle)*this.magnitude, Math.sin(newAngle)*this.magnitude)

updated Whack-a-mole.html
   <script src="./engine/Time.js"></script>
   <script src="./engine/Collisions.js"></script>
   <script src="./engine/CameraGameObject.js"></script>
+  <script src="./engine/SceneManager.js"></script>
   <script src="./engine/components/Transform.js"></script>
   <script src="./engine/components/Polygon.js"></script>
...
         const cameraGameObject = new CameraGameObject()
         cameraGameObject.getComponent(Camera).backgroundColor = "white"
         this.instantiate(cameraGameObject)
-        this.instantiate(new MoleGameObject(), new Vector2(100, 100))
-        this.instantiate(new PointsGameObject(), new Vector2(20, 100))
+        const parent = this.instantiate(new MoleGameObject(), new Vector2(100, 100))
+        const child = this.instantiate(new MoleChildGameObject(), new Vector2(100/25, 100/25))
+        child.transform.setParent(parent.transform)
+        const grandchild = this.instantiate(new MoleChildGameObject(), new Vector2(100/25, 100/25))
+        grandchild.transform.setParent(child.transform)
+        const points = this.instantiate(new PointsGameObject(), new Vector2(20, 0))
+        const uiContainer = this.instantiate(new GameObject("UI Container Game Object"), new Vector2(0, 100))
+        const title = this.instantiate(new GameObject("Title Game Object", {layer: "UI"}), new Vector2(300, 0))
+        title.addComponent(new Text(), {text: "Click the squares to earn points", fillStyle: "black"})
+        title.transform.setParent(uiContainer.transform)
+        points.transform.setParent(uiContainer.transform)
         this.instantiate(new ClickGameObject())
       }
     }
...
       }
     }
+    class MoleChildGameObject extends GameObject {
+      constructor() {
+        super("Mole Child Game Object")
+        this.addComponent(new Polygon(), { fillStyle: "cyan", points: [new Vector2(-1, -1), new Vector2(-1, 1), new Vector2(1, 1), new Vector2(1, -1)] })
+        this.transform.scale = new Vector2(1, 1)
+        this.addComponent(new Collider())
+        this.addComponent(new MoleChildController())
+      }
+    }
+    class MoleChildController extends Component {
+      update() {
+        this.transform.rotation += -Time.deltaTime
+      }
+    }
     class PointsGameObject extends GameObject {
       constructor() {
-        super("Points Game Object")
+        super("Points Game Object", {layer: "UI"})
         this.addComponent(new Text(), { fillStyle: "gray", text: "Points: ", font: "10px Arial" })
         this.addComponent(new PointsController())
         this.transform.scale = new Vector2(2, 2)
...
-    Engine.currentScene = new MainScene()
+    SceneManager.loadScene(new MainScene())
     Engine.start({ layers: [] })
   </script>
 </body>
```