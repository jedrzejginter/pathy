# Pathy

![npm](https://img.shields.io/npm/v/pathy.svg?style=flat-square)
![npm](https://img.shields.io/npm/dm/pathy.svg?style=flat-square)

A small library that will help you with interpolation of dynamic parameters in URLs or files paths as well as extracting them. Supports types validation and values casting.

## Installation

```bash
# If you are using Yarn:
yarn add pathy

# If you are using npm:
npm install --save pathy
```

## API Reference

### `pathy([options: object]): object`

```ts
import { applyParams, createRoute, extractParams } from "pathy";

const url = applyParams("/blog/posts/{postId:int}", { postId: 123 });
// url: "/blog/posts/123"

const route = createRoute("/blog/posts/{postId:int}");
// route: "/blog/posts/:postId(\\d+)"

const params = extractParams("/api/v1/{resource:str}/{postId:int}", "/api/v1/posts/123");
// params: { resource: "posts", postId: 123 }

```

And with custom types definitions (validation and casting):

```ts
import pathy from "pathy";

/**
 * You can now use customized methods instead of core ones.
 */
const { applyParams, extractParams } = pathy({
  types: {
    customId: {
      parse: (value) => "id-" + value,
      regex: /(\d+)/,
    },
  },
});

const url = applyParams("/blog/posts/{id:customId}", { id: 123 });
// url: "/blog/posts/123"

const params = extractParams("/blog/posts/{id:customId}", "/blog/posts/123");
// params: { id: "id-123" }

```

**Available options**

```ts
{
  /**
   * (optional, default: false)
   *
   * Allow overwriting core types when 'types' option is specified (see below).
   * If this is not set or is set to false and you will provide a custom type with the same name
   * as built-in type, an error will be thrown.
   */
  overwriteTypes: boolean,

  /**
   * (optional, default: {})
   *
   * Extend library API with your own types.
   * This parameter accepts an object - each key in this object is a type name and the value can be:
   *  a) RegExp instance
   *  b) an object (use it only, if you want to specify 'parse' function):
   *      {
   *        // (required)
   *        // RegExp instance.
   *        regex: RegExp,
   *
   *        // (optional)
   *        // A function that will transform a raw parameter value to something else.
   *        parse: (string) => any
   *      }
   */
  types: {
    [string]: RegExp or { regex: RegExp } or { regex: RegExp, parse: (string) => any }
  }
}
```

### `applyParams(path: string, params: object): string`

_Replace parameters with values._

```ts
import { applyParams } from "pathy";

const url = applyParams("/blog/posts/{postId:int}", { postId: 123 });
// url: "/blog/posts/123"

/**
 * Works also for external urls.
 */
const url = applyParams("http://someapi.com/api/v1/posts/{postId:int}", { postId: 123 });
// url: "http://someapi.com/api/v1/posts/123"
```

### `createRoute(path: string): string`

_Replace parameters with regular expressions and creates a pattern you can use for matching routes, for example in [`express`](https://npmjs.com/package/express) (compatible with [`path-to-regexp`](https://npmjs.com/package/path-to-regexp))._

**How to use it?**

```ts
import { createRoute } from "pathy";

/**
 * For purpose of this example, let's agree that regular expression for integer is just (\d+).
 * The built-in regexp for 'int' is way more strict.
 */
const route = createRoute("/blog/posts/{postId:int}");
// route: "/blog/posts/:postId(\\d+)"

/**
 * You can make this method ignore names of the parameters in the output by providing 'false' as the second argument.
 * Useful if you want to use 'createRoute' to make a RegExp instance: `new RegExp(createRoute(...))`
 */
const route = createRoute("/blog/posts/{postId:int}", false);
// route: "/blog/posts/(\\d+)"
```

### `extractParams(path: string, url: string): object`

_Extract values for specified parameters. Each value can be mapped to some other type or value via `parse` method, so for example parameters annotated as `int` are transformed to number type._

```ts
import { extractParams } from "pathy";

const params = extractParams("/api/v1/{resource:str}/{postId:int}", "/api/v1/posts/123");
// params: { resource: "posts", postId: 123 }
// Notice, that postId is converted to a number.

/**
 * Params object will be empty, if at least one parameter cannot be matched.
 */
const params = extractParams("/api/v1/{resource:str}/{postId:int}", "/api/v1/posts/not-an-integer");
// params: {}
```

## Parameters Syntax

For defining dynamic parameter, the **`{name:type}`** syntax is used.

All parameters are forced to have a **name**.\
My recommendation is to use camel-case naming convention, but anyway you are not limited as long as the parameter name matches `/^[a-zA-Z0-9-_]+$/`.

Each parameter must have also a **type** assigned to it. Type annotations are preceded by a colon (`:`) and are used for validating the value of the parameter.\
This library provides a couple of most common types, but you can define your own. The core types are:

- **bool** (boolean values): `true`, `false`
- **int** (integer values): `-100`, `0`, `123`
- **uint** (non-negative integers): `0`, `123`
- **float** (numbers with decimals): `-100.23`, `-100`, `0.0`, `1.0`, `123.0`
- **uuid** (strings in uuid format): `a6715b7f-9f77-4166-bb55-f872735a22e6`
- **str** (everything else): `abc`, `two words`, `kebab-case`

## Typescript

Out-of-the-box Typescript support.

## Live Demo

You can see the [live demo here](https://codesandbox.io/s/pathy-live-demo-hzucl). Don't hesitate to have some fun with it.

### Thanks to

A big shout-out to [Richard Hoffman](https://www.npmjs.com/~coverslide) for letting me owning this package name ❤️
