# simple-path

A small library for writing your app URL's with joyful validation.

### Syntax

To define a dynamic parameter in your URL, like post ID for single post view, use this syntax:

```
{name:type}
```

- `name` is just the name of your parameter and it has to be unique across whole url
- `type` is one of: `int`, `uint` (positive integer), `float`, `str` (alias: `string`), `uuid`.

### Example

```ts
import { applyUrlParams, createRoutePath } from "simple-path";

const url = applyUrlParams("/posts/{postId:int}/edit", { postId: 123 });
// url: "/posts/123/edit"

const route = createRoutePath("/posts/{postId:int}");
// Creates path-to-regexp compatible paths, so you can use them with React Router.
// route: "/posts/:postId((0|-?[1-9]\\d{0,128}))"
```
