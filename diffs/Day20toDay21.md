Here's what changed in the code:
```diff
updated engine/Engine.js
     static ctx
     /**
+     * @type {number} The timestamp in milliseconds the last time we got a requestAnimationFrame callback
+     */
+    static lastTimestamp = performance.now()
+    /**
      * Start the game
      * @param {GameProperties} gameProperties Optional argument for specific game-specific properties
      */
...
         SceneManager.update()
         SceneManager.getActiveScene().start()
-        Engine.gameLoop()
+        requestAnimationFrame(Engine.gameLoop)
     }
     /**
      * Run the game loop. This update the various static classes, then updates the game objects and draw them.
      */
-    static gameLoop() {
+    static gameLoop(timestamp) {
+        //Update Time.deltaTime based on the timestamp
+        Time.deltaTime = (timestamp - Engine.lastTimestamp)/1000
+        Engine.lastTimestamp = timestamp
         SceneManager.update()
         Engine.update()
         Engine.draw()
```