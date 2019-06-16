import { PARAM_DEFINITION_OPENING_REGEXP } from "./constants";
import { applyParams, replaceAnnotation, normalizePath } from "./core";
import { assertType } from "./utils";

const coreAnnotations = {
  bool: /(true|false)/,
  float: /(0|-?[1-9]\d{0,128}|-?0\.\d{0,128}[1-9]\d{0,128}|-?[1-9]\d{0,128}\.\d{1,128})/,
  int: /(0|-?[1-9]\d{0,128})/,
  str: /([^\/]+)/,
  uint: /(0|[1-9]\d{0,128})/,
  uuid: /([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/
};

export type PathyAnnotations = {
  [k: string]: RegExp;
};

export type PathyOptions = {
  annotations?: PathyAnnotations;
};

export function pathy(options: PathyOptions = {}) {
  const userDefinedAnnotations = options.annotations || {};

  const additionalAnnotations = {};

  for (const userDefinedType in userDefinedAnnotations) {
    if (coreAnnotations.hasOwnProperty(userDefinedType)) {
      throw new Error(`You cannot overwrite ${userDefinedType} annotation`);
    }

    const userDefinedRegexp = userDefinedAnnotations[userDefinedType];
    let src = userDefinedRegexp.source;

    src = src.replace(/^\s*(.*)\s*$/, "$1");

    if (src.startsWith("^")) {
      src = src.slice(1);
    }

    if (src.endsWith("$")) {
      src = src.slice(0, src.length - 1);
    }

    if (!src.startsWith("(") || !src.endsWith(")")) {
      src = `(${src})`;
    }

    additionalAnnotations[userDefinedType] = new RegExp(src);
  }

  const annotations = {
    ...additionalAnnotations,
    ...coreAnnotations
  };

  function createRoute(path: string, keepNames: boolean = true) {
    assertType(path, "path", "string");

    let out = normalizePath(path);

    /**
     * We HAVE TO create a new RegExp instance every time, because we are using global flag
     * and it keeps tracks of 'lastIndex' property which results in different behaviour
     * ('test' method returns false even is should return true).
     * For more see the accepted answer on Stack Overflow.
     * @see https://stackoverflow.com/a/6891667
     */
    const re = new RegExp(PARAM_DEFINITION_OPENING_REGEXP);

    if (!re.test(out)) {
      return out;
    }

    for (const type in annotations) {
      const re0 = new RegExp(`\\{([\\da-zA-Z_]{1,128})\\:${type}\\}`, "g");
      const re1 = annotations[type];

      out = replaceAnnotation(out, re0, re1, keepNames);
    }

    return out;
  }

  function parsePathParams(path: string, url: string): object | null {
    assertType(path, "path", "string");
    assertType(url, "url", "string");

    const annotations = path.match(/\{[a-zA-Z\d_-]+\:[a-zA-Z\d_-]+\}/g);

    if (annotations === null) {
      return {};
    }

    const parsed = annotations.map((annotation: string) => {
      const annotationMatch = annotation.match(
        /\{([a-zA-Z\d_-]+)\:([a-zA-Z\d_-]+)\}/
      );

      if (annotationMatch === null) {
        throw new Error("Couldn't parse annotation");
      }

      const [_, name, type] = annotationMatch;

      return { annotation, name, type };
    });

    const route = createRoute(path, false);
    const matched = url.match(new RegExp(route));

    if (matched === null) {
      return null;
    }

    const matches = matched.slice(1);

    if (matches.length !== parsed.length) {
      return null;
    }

    const params = {};

    matches.forEach((match, index) => {
      const { name, type } = parsed[index];
      let value: string | number | boolean = match;

      if (type === "int" || type === "uint") {
        value = parseInt(value, 10);
      } else if (type === "bool") {
        value = value === "true";
      } else if (type === "float") {
        value = parseFloat(value);
      }

      params[name] = value;
    });

    return params;
  }

  return {
    applyParams,
    createRoute,
    parsePathParams
  };
}
