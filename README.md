# Pathy

![Travis (.com) branch](https://img.shields.io/travis/com/jedrzejginter/pathy/master.svg?style=flat-square)
![David](https://img.shields.io/david/jedrzejginter/pathy.svg?style=flat-square)

A small library that will help you with writing paths with dynamic parameters validation.\
And I hope you will love how easy it is 😍.

## 0.1.0 release checklist

- [x] Allow user-defined annotations (no core annotations overwriting possible)
- [x] Add API for parsing path values
- [ ] Provide verbose documentation
- [ ] Write more tests

## Installation

```bash
# If you are using Yarn:
yarn add pathy

# If you are using npm:
npm install pathy
```

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

Apart from built-in types, you can define your own - see Examples section for more.

## Examples

**Basic usage**

```ts
import { applyParams, createRoute } from "pathy";

/**
 * Replace dynamic parameters definitions with actual data passed as second parameter.
 * Here, 'url' will be '/posts/123/edit'.
 */
const url = applyParams("/posts/{postId:int}/edit", { postId: 123 });
// url: "/posts/123/edit"

/**
 * You can also use this for external urls.
 */
const url0 = applyParams("https://someapi.com/api/v{apiVersion:int}", {
  apiVersion: 2
});
// url0: "https://someapi.com/api/v2"

/**
 * Create a route that is compatible with another great package, 'path-to-regexp',
 * which is used for example React Router.
 * Here `{postId:int}` will be replace with named parameter and regular expression
 * to allow only path started with '/posts/' and followed by integer.
 */
const route = createRoute("/posts/{postId:int}");
```

**Customizing library features**

```ts
import pathy from "pathy";

/**
 * As default export we have a 'pathy' function, that can take an object of options
 * as an argument.
 * To add custom annotations see below example.
 */
const { applyParams, createRoute } = pathy({
  /**
   * We define an object of custom annotations.
   * Key it the annotation type (here: category) and the value is a RegExp that matches
   * dynamic parameter for routes.
   * Important note is that the whole regex should we wrapped in brackets. Also,
   * don't use ^ and $ in your regex, because they will be ignored anyway.
   *
   * We don't allow overwriting built-in annotations (for now), so if you would for example
   * try to pass custom 'int' annotation, an error will be thrown.
   */
  annotations: {
    category: /(apple|banana|orange)/
  }
});

const url = applyParams("/categories/{fruit:category}", { fruit: "apple" });
// url: "/categories/apple"

const route = createRoute("/categories/{fruit:category}");
// route: "/categories/:fruit(apple|banana|orange)"
```

**Extract URL params for given path**

```ts
import { parsePathParams } from "pathy";

/**
 * Get params for url based on specified path.
 * If a parameter can be parsed to anything other than string, it will be.
 */
const params = parsePathParams(
  "/posts/{category:str}/{postId:int}",
  "/posts/fruits/9001"
);
// params: { category: "fruits", postId: 9001 }
```
