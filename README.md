# simple-path

A small library for writing your app URL's with joyful validation.

### Example

```ts
import { applyUrlParams, createRoutePath } from "simple-path";

const url = applyUrlParams("/posts/{postId:int}/edit", { postId: 123 });
// url: "/posts/123/edit"

const route = createRoutePath("/posts/{postId:int}");
// Creates path-to-regexp compatible paths, so you can use them with React Router.
// route: "/posts/:postId((0|-?[1-9]\\d{0,128}))"
```
