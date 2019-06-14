# Pathy

A small library that will help you with writing paths with dynamic parameters validation.\
And I hope you will love how easy it is 😍.

## 0.1.0 release checklist

- [ ] Allow user-defined annotations (no core annotations overwriting possible)
- [ ] Add API for parsing path values

## Syntax

To define a dynamic parameter in your URL, like post ID for single post view, use this syntax: `{name:type}`.

- **name** is just the name of your parameter and it has to be unique across the path
- **type** is one of:
  - **bool** - for boolean values (accepts `true` and `false`),
  - **int** - for integer values, both negative and positive,
  - **uint** - for non-negative integers (`0` included),
  - **uuid** - for strings in UUID format,
  - **float** - for float values, both negative and positive,
  - **str** - for any non-empty string.

## Example

```ts
import { applyParams, createRoute } from "pathy";

const url = applyParams("/posts/{postId:int}/edit", { postId: 123 });
// url: "/posts/123/edit"

const route = createRoute("/posts/{postId:int}");
// Creates path-to-regexp compatible paths, so you can use them with React Router.
// route: "/posts/:postId((0|-?[1-9]\\d{0,128}))"
```
