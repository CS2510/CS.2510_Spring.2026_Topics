# JavaScript Teaching Prerequisites by Milestone

For each milestone, the topics listed are **new JavaScript concepts** introduced
in that branch's code that students must understand before attempting it.

---

## Milestone 01 — Drawing *(baseline)*

> Starting point. Students need only basic familiarity with the browser console.
> No prerequisite JS beyond what is taught in the very first session.

**Concepts used (teach before Day 1):**
- [Variables (`const`, `let`)](https://javascript.info/variables)
- [Basic operators (`+`, `-`, `*`)](https://javascript.info/operators)
- [Functions](https://javascript.info/function-basics)
- [Conditional branching (`if`)](https://javascript.info/ifelse)

---

## Milestone 02 — Animation

**New syntax introduced:** `class` with field declarations, `new`, `function`
declarations called across each other, `++` increment, `requestAnimationFrame`
callback pattern.

**Teach before Milestone 02:**
- [Class basic syntax (class body, fields, `new`)](https://javascript.info/class)
- [Constructor, operator `new`](https://javascript.info/constructor-new)
- [Basic operators (`++`, `--`)](https://javascript.info/operators)
- [Function basics (declarations, calling)](https://javascript.info/function-basics)

---

## Milestone 03 — Standard Architecture

**New syntax introduced:** `extends`, `super()`, `static` properties and
methods, `for...of` loop, `Array.push()`, optional chaining `?.()`.

**Teach before Milestone 03:**
- [Class inheritance (`extends`, `super`)](https://javascript.info/class-inheritance)
- [Static properties and methods](https://javascript.info/static-properties-methods)
- [Arrays](https://javascript.info/array)
- [Loops: `for...of`](https://javascript.info/iterable)
- [Optional chaining `?.`](https://javascript.info/optional-chaining)

---

## Milestone 04 — Keyboard Input

**New syntax introduced:** getter (`get` keyword), `addEventListener`,
`Array.filter()` with a callback function, `Array.includes()`, `if/else`.

**Teach before Milestone 04:**
- [Conditional branching: `if`, `else`](https://javascript.info/ifelse)
- [Property getters and setters](https://javascript.info/property-accessors)
- [Array methods (`filter`, `includes`, `push`)](https://javascript.info/array-methods)
- [Function expressions (callback functions)](https://javascript.info/function-expressions)

---

## Milestone 05 — JS Config

**New syntax introduced:** Constructor with parameters (`constructor(x, y)`),
`this.x = x` assignment in constructor.

**Teach before Milestone 05:**
- [Constructor, operator `new` (constructor parameters)](https://javascript.info/constructor-new)

---

## Milestone 06 — Text

**New syntax introduced:** `Object.assign()`, JSDoc comments (`/** */`,
`@type`, `@param`, `@returns`), `Time.deltaTime` usage pattern (multiplication
with `*=` / `+=`).

**Teach before Milestone 06:**
- [Object references and copying (`Object.assign`)](https://javascript.info/object-copy)
- [Code comments (JSDoc style)](https://javascript.info/comments)
- [Basic operators (compound assignment `+=`, `*=`)](https://javascript.info/operators)

---

## Milestone 08 — Lifecycle

**New syntax introduced:** `Array.filter().forEach()` chaining, `instanceof`,
`Array.find()`, logical NOT `!`, standalone functions outside classes,
optional chaining with arguments `component.start?.()`.

**Teach before Milestone 08:**
- [Array methods (`find`, `filter`, `forEach`)](https://javascript.info/array-methods)
- [Class checking: `instanceof`](https://javascript.info/instanceof)
- [Logical operators (`!`, `&&`, `||`)](https://javascript.info/logical-operators)

---

## Milestone 09 — Communication

**New syntax introduced:** `GameObject.find()` pattern (calling a static method
to look up a named object); string argument passed to constructor; accessing a
component method on the result of `find()`.

**Teach before Milestone 09:**
- [Static properties and methods (using static methods as lookup)](https://javascript.info/static-properties-methods)
- [Object methods, `this`](https://javascript.info/object-methods)

---

## Milestone 10 — Point Overlap

**New syntax introduced:** Spread operator in function calls (`Math.min(...array)`),
traditional `for` loop with index, modulo `%`, exponentiation `**`,
`Math.sqrt()` / `Math.min()` / `Math.max()`, `event.clientX` / `event.clientY`.

**Teach before Milestone 10:**
- [Rest parameters and spread syntax (`...`)](https://javascript.info/rest-parameters-spread)
- [Loops: `while` and `for` (index-based `for` loop)](https://javascript.info/while-for)
- [Basic operators (modulo `%`, exponentiation `**`)](https://javascript.info/operators)
- [Numbers (`Math` object — `Math.sqrt`, `Math.min`, `Math.max`)](https://javascript.info/number)

---

## Milestone 11 — Advanced Input

**New syntax introduced:** Arrow functions (`=>`), `Array.map()`, shorthand
property names in object literals (`{message, listeningClass}`), `delete`
keyword.

**Teach before Milestone 11:**
- [Arrow functions, the basics](https://javascript.info/arrow-functions-basics)
- [Array methods (`map`)](https://javascript.info/array-methods)
- [Objects (shorthand property names, `delete`)](https://javascript.info/object)

---

## Milestone 12 — Mouse Events

**New syntax introduced:** `Set`, spread into array literal
(`[...new Set([...a, ...b])]`), `Array.some()`, `Number.POSITIVE_INFINITY`,
`Math.sign()`.

**Teach before Milestone 12:**
- [Map and Set](https://javascript.info/map-set)
- [Rest parameters and spread syntax (spread into array literal)](https://javascript.info/rest-parameters-spread)
- [Array methods (`some`)](https://javascript.info/array-methods)
- [Numbers (`Number.POSITIVE_INFINITY`, `Math.sign`)](https://javascript.info/number)

---

## Milestone 13 — Events

**New syntax introduced:** Static class constants (`static SUCCEEDED = 0`),
pub/sub listener pattern using a static array.

**Teach before Milestone 13:**
- [Static properties and methods (static fields as constants)](https://javascript.info/static-properties-methods)

---

## Milestone 14 — Collision Resolution

**New syntax introduced:** Auto-incrementing static ID counter, ternary
operator `condition ? a : b`, `Math.floor()`, `Math.random()`, `Array.find()`
(already seen, but now used with complex predicates).

**Teach before Milestone 14:**
- [Conditional branching: ternary operator `?`](https://javascript.info/ifelse)
- [Numbers (`Math.floor`, `Math.random`)](https://javascript.info/number)

---

## Milestone 17 — Time

**New syntax introduced:** Nothing structurally new — `Time.time` and
`Time.frameCount` accumulate values each frame using `+=` and `++`.

**Teach before Milestone 17:**
- *(No new syntax — review basic operators if needed)*

---

## Milestone 18 — Platformer

**New syntax introduced:** `typeof` operator used for feature detection
(`typeof Camera != "undefined"`), `Math.min()` used for value clamping.

**Teach before Milestone 18:**
- [Data types (`typeof` operator)](https://javascript.info/types)

---

## Milestone 19 — Scene Manager

**New syntax introduced:** Default parameter values in functions
(`additive = false`), instantiating a class stored in a variable
(`new SceneManager.nextScene()`), `undefined` as a sentinel value.

**Teach before Milestone 19:**
- [Function basics (default parameter values)](https://javascript.info/function-basics)
- [Variables (`undefined`)](https://javascript.info/variables)

---

## Milestone 21 — Scene Tracking

**New syntax introduced:** No new JS syntax; the engine is reorganized and
receives JSDoc documentation. A multi-file viewer HTML page is added using
`fetch()`, `Promise.then()`, and `iframe` manipulation.

**Teach before Milestone 21:**
- *(No new syntax — optional: introduce `fetch` / Promises if students will
  read the test harness code)*
- [Promises, async/await (optional)](https://javascript.info/async)

---

## Milestone 22 — Cameras

**New syntax introduced:** Default object parameter in constructor
(`constructor(name, options = {})`), `static get main()` — a static getter,
`DOMMatrix` browser API.

**Teach before Milestone 22:**
- [Class basic syntax (getters inside a class)](https://javascript.info/class)
- [Property getters and setters](https://javascript.info/property-accessors)
- [Destructuring assignment (default values in function params)](https://javascript.info/destructuring-assignment)

---

## Milestone 23 — Collision Layers

**New syntax introduced:** Multi-dimensional array lookup in `Array.find()`
predicate; `||` used to allow two-way collision layer matching. No
fundamentally new syntax.

**Teach before Milestone 23:**
- *(No new syntax — review logical operators and `Array.find` if needed)*

---

## Milestone 26 — Letter Boxes

**New syntax introduced:** Nullish coalescing operator `??`
(`options.cameraWidth ?? 2000`).

**Teach before Milestone 26:**
- [Nullish coalescing operator `??`](https://javascript.info/nullish-coalescing-operator)

---

## Milestone 28 — Behavior Trees

**New syntax introduced:** No new syntax. All patterns (classes, static
constants, `for...of`, `delete`, object constructors) were introduced in
earlier milestones. The milestone demonstrates using those primitives to
implement a behavior tree design pattern.

**Teach before Milestone 28:**
- *(No new syntax — this milestone is about design patterns, not new JS)*