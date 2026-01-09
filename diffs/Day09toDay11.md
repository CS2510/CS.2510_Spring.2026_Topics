Here's what changed in the code:
```diff
deleted file beforeClass/2048.html

deleted file beforeClass/Day07.html

deleted file beforeClass/engine/Collisions.js

deleted file beforeClass/engine/Component.js

deleted file beforeClass/engine/components/Collider.js

deleted file beforeClass/engine/components/Polygon.js

deleted file beforeClass/engine/components/Transform.js

deleted file beforeClass/engine/Engine.js

deleted file beforeClass/engine/GameObject.js

deleted file beforeClass/engine/Input.js

deleted file beforeClass/engine/Scene.js

deleted file beforeClass/engine/Time.js

deleted file beforeClass/engine/Vector2.js

deleted file beforeClass/game/components/LaserController.js

deleted file beforeClass/game/components/SquareController.js

deleted file beforeClass/game/components/TriangleController.js

deleted file beforeClass/game/prefabs/LaserGameObject.js

deleted file beforeClass/game/prefabs/SquareGameObject.js

deleted file beforeClass/game/prefabs/TriangleGameObject.js

deleted file beforeClass/game/scenes/MainScene.js

deleted file beforeClass/gameCollision.html

deleted file beforeClass/separateAxisTheorem.html

added file ballDrop.html

added file beforeClass.html/ballDrop.html

added file beforeClass.html/clicker.html

added file beforeClass.html/Day11.html

added file beforeClass.html/engine/Assets.js

added file beforeClass.html/engine/Collisions.js

added file beforeClass.html/engine/Component.js

added file beforeClass.html/engine/components/Collider.js

added file beforeClass.html/engine/components/Polygon.js

added file beforeClass.html/engine/components/RigidBody.js

added file beforeClass.html/engine/components/Text.js

added file beforeClass.html/engine/components/Transform.js

added file beforeClass.html/engine/Engine.js

added file beforeClass.html/engine/GameObject.js

added file beforeClass.html/engine/Input.js

added file beforeClass.html/engine/Scene.js

added file beforeClass.html/engine/Time.js

added file beforeClass.html/engine/Vector2.js

added file beforeClass.html/game/components/LaserController.js

added file beforeClass.html/game/components/SquareController.js

added file beforeClass.html/game/components/TriangleController.js

added file beforeClass.html/game/prefabs/LaserGameObject.js

added file beforeClass.html/game/prefabs/SquareGameObject.js

added file beforeClass.html/game/prefabs/TriangleGameObject.js

added file beforeClass.html/game/scenes/MainScene.js

added file beforeClass.html/platformer.html

added file beforeClass.html/wallSliding.html

added file engine/components/RigidBody.js

added file platformer.html

added file setup/ballDrop.html

added file setup/platformer.html

added file setup/wallSliding.html

updated Day09.html
     <script src="./engine/Input.js"></script>
     <script src="./engine/Engine.js"></script>
     <script src="./engine/Time.js"></script>
+    <script src="./engine/Collisions.js"></script>
     <script src="./engine/components/Transform.js"></script>
     <script src="./engine/components/Polygon.js"></script>
+    <script src="./engine/components/Collider.js"></script>
     <!-- Game-specific Code -->
     <script src="./game/scenes/MainScene.js"></script>

updated engine/Collisions.js
       for (let i = 0; i < polygonPoints.length; i++) {
         const a = polygonPoints[i]
         const b = polygonPoints[(i+1)%polygonPoints.length]
-        lines.push(a.minus(b).orthogonal())
+        lines.push(a.minus(b).orthogonal().normalize())
       }
     }
     //For each line...
+    const diffs = []
     for (const line of lines) {
       //...Find the dot product of all points in both polygons...
       const oneDots = worldPointsA.map(p => p.dot(line))
       const twoDots = worldPointsB.map(p => p.dot(line))
       //...and if there is a gap, they are not in collision
-      if (Math.max(...oneDots) < Math.min(...twoDots) || Math.max(...twoDots) < Math.min(...oneDots)) return false
+      const diffA = Math.max(...oneDots) - Math.min(...twoDots)
+      const diffB = Math.max(...twoDots) - Math.min(...oneDots)
+      if ( diffA < 0 || diffB < 0 ) return false
+      const minDiff = Math.min(diffA, diffB)
+      diffs.push(minDiff)
     }
     //If we get here, then the polygons were always overlapping, so we know they are in collision
+    const minDiff = Math.min(...diffs)
+    const minDiffIndex = diffs.indexOf(minDiff)
+    const mtvLine = lines[minDiffIndex]
+    return mtvLine.times(minDiff)
     return true
   }
 }

updated engine/Scene.js
             gameObject.update()
         }
+        //Do Collision Detection
+        const gameObjectsWithColliders = this.gameObjects.filter(go=>go.getComponent(Collider))
+        for(let i = 0; i < gameObjectsWithColliders.length; i++){
+            for(let j = i+1; j < gameObjectsWithColliders.length; j++){
+                let a = gameObjectsWithColliders[i]
+                let b = gameObjectsWithColliders[j]
+                let response = Collisions.inCollision(a,b)
+                if(response){
+                    const aHasRigidBody = a.getComponent(RigidBody)
+                    const bHasRigidBody = b.getComponent(RigidBody)
+                    if(aHasRigidBody){
+                        if(a.transform.position.minus(b.transform.position).dot(response) < 0)
+                            response = response.times(-1)
+                        a.transform.position.plusEquals(response)
+                    }
+                    if(bHasRigidBody){
+                        if(b.transform.position.minus(a.transform.position).dot(response) < 0)
+                            response = response.times(-1)
+                        b.transform.position.plusEquals(response)
+                    }
+                    for(const component of a.components){
+                        component.onCollisionEnter?.(b)
+                    }
+                    for(const component of b.components){
+                        component.onCollisionEnter?.(a)
+                    }
+                }
+            }
+        }
         //Delete what needs to be removed
         this.gameObjects = this.gameObjects.filter(go => !go.markForDelete)
     }

updated engine/Vector2.js
     get magnitude(){
         return Math.sqrt(this.x**2+this.y**2)
     }
+    normalize(){
+        return new Vector2(this.x/this.magnitude, this.y/this.magnitude)
     }
+}

updated game/components/TriangleController.js
             this.velocity.y *= -1
         }
     }
+    onCollisionEnter(other) {
+        if (other.name == "Laser Game Object")
+            this.gameObject.destroy()
     }
+}

updated game/prefabs/LaserGameObject.js
         super("Laser Game Object")
         this.addComponent(new Polygon(), {fillStyle: "green", points:[new Vector2(-1, -1), new Vector2(-1, 1), new Vector2(1, 1), new Vector2(1, -1)]})
         this.addComponent(new LaserController())
+        this.addComponent(new Collider())
         this.transform.scale = new Vector2(2, 5)
     }
 }

updated game/prefabs/TriangleGameObject.js
         super('Enemy Game Object')
         this.addComponent(new TriangleController())
         this.addComponent(new Polygon(), {fillStyle: "blue"})
+        this.addComponent(new Collider())
         this.transform.scale = new Vector2(15, 15)
     }
 }

updated game/scenes/MainScene.js
         this.instantiate(new TriangleGameObject(), new Vector2(50, 50))
         this.instantiate(new TriangleGameObject(), new Vector2(30, 30))
         this.instantiate(new TriangleGameObject(), new Vector2(40, 70))
-        this.instantiate(new SquareGameObject(), new Vector2(100, 100))
+        this.instantiate(new SquareGameObject(), new Vector2(100, 300))
     }
 }
```