# Pathy

![Travis (.com) branch](https://img.shields.io/travis/com/jedrzejginter/pathy/master.svg?style=flat-square)
![David](https://img.shields.io/david/jedrzejginter/pathy.svg?style=flat-square)

A small library that will help you with writing url paths and assigning a validation pattern to each of them.\
See 'Examples' section to see how it works.

### Thanks to

A big shout-out to [username] who gave back the package name to me ❤️

## Installation

```bash
# If you are using Yarn:
yarn add pathy

# If you are using npm:
npm install --save pathy
```

## API Reference

### `pathy([options])`

**What is does?**

_Creates a customized instance of library.\
You can add your own types or even overwite built-in ones, if they don't feel like doing their job for you._

**How to use it?**

```ts
import pathy from "pathy";

/**
 * Options can be defined, but are not required.
 */
const pathy = pathy({
  overwriteTypes: false,
  types: {
    myNumber: {
      parse: (value) => Number(value),
      regex: /(\\d+)/,
    },
  },
});

/**
 * You can now use customized methods instead of core ones.
 */
const { applyParams, createRoute, extractParams } = myPathy;
```

**What are the available options?**

```ts
{
  /**
   * (optional, default: false)
   *
   * Allow overwriting core types when 'types' option is specified (see below).
   * It this is not set or is set to false and you will provide a custom type with the same name
   * as built-in type, an error will be thrown.
   */
  overwriteTypes: boolean,

  /**
   * (optional, default: {})
   *
   * Extend library API with your custom types.
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

### `applyParams(path: string, params: object)`

**What it does?**

_Replaces parameters definitions in your specified path with real values.\
Handy if creating a url that you want navigate a user to._

**How to use it?**

```ts
import { applyParams } from "pathy";

const url = applyParams("/blog/posts/{postId:int}", { postId: 123 });
// url: "/blog/posts/123"

/**
 * Work also for external urls.
 */
const url = applyParams("http://someapi.com/api/v1/posts/{postId:int}", { postId: 123 });
// url: "http://someapi.com/api/v1/posts/123"
```

### `createRoute(path: string)`

**What it does?**

_Replaces parameters definitions in the path with regular expressions that validates a specific url.\
This function is compatible with great `path-to-regexp` package._

**How to use it?**

```ts
import { createRoute } from "pathy";

/**
 * For purpose of this example, let's agree that regexp for integer is just (\d+).
 * The built-in validator for int is way more strict though.
 */
const route = createRoute("/blog/posts/{postId:int}");
// route: "/blog/posts/:postId(\\d+)"

/**
 * You can tell this method to ignore parameter names in the output.
 * Handy if you want to use it to create a RegExp instance.
 */
const route = createRoute("/blog/posts/{postId:int}", false);
// route: "/blog/posts/(\\d+)"
// Now you can do: new RegExp(route)
```

### `extractParams(url: string, path: string)`

**What it does?**

_Well, get parameter values from specific url for given path.\
If a parameter can be transformed to something else than string (like `:int` does), it will be._

**How to use it?**

```ts
import { extractParams } from "pathy";

const params = extractParams("/api/v1/{resource:str}/{postId:int}", "/api/v1/posts/123");
// params: { resource: "posts", postId: 123 }
// Notice, that postId is converted to number.

/**
 * Params object will be empty, if at least one parameter cannot be matched.
 */
const params = extractParams("/api/v1/{resource:str}/{postId:int}", "/api/v1/posts/not-an-integer");
// params: {}
```

## Parameters Syntax

To define a dynamic parameter in your url (like post ID) use this really simple syntax: `{name:type}`.\
All parameters are forced to have a **name**. Our recommendation is to use pascal case naming convention, but anyway we don't limit you as long as the parameter name matches `/[a-zA-Z0-9-_]+/`.\
Each parameter must have also a **type** assigned to it. Type annotations are inspired by Typescript and are preceeded by a colon (`:`). Types are used for validation of the url that specific path refers to. This library provides a couple of most common types:

- **bool** - for boolean values (accepts `true` and `false`),
- **int** - for integer values, both negative and positive,
- **uint** - for non-negative integers (`0` included),
- **uuid** - for strings in UUID format,
- **float** - for float values, both negative and positive,
- **str** - for any non-empty string.

Apart from built-in types, you can define your own - see 'Examples' and 'API Reference' sections for more information on this.

## Typescript

Yes, it does.
