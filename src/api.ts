import { PARAM_DEFINITION_OPENING_REGEXP } from "./constants";
import { applyParams, replaceAnnotation, normalizePath } from "./core";
import { assertType } from "./utils";

const CORE_BOOL_REGEXP = /(true|false)/;
const CORE_FLOAT_REGEXP = /(0|-?[1-9]\d{0,128}|-?0\.\d{0,128}[1-9]\d{0,128}|-?[1-9]\d{0,128}\.\d{1,128})/;
const CORE_INT_REGEXP = /(0|-?[1-9]\d{0,128})/;
const CORE_STR_REGEXP = /([^\/]+)/;
const CORE_UINT_REGEXP = /(0|[1-9]\d{0,128})/;
const CORE_UUID_REGEXP = /([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/;

const coreAnnotations = {
  bool: CORE_BOOL_REGEXP,
  float: CORE_FLOAT_REGEXP,
  int: CORE_INT_REGEXP,
  str: CORE_STR_REGEXP,
  uint: CORE_UINT_REGEXP,
  uuid: CORE_UUID_REGEXP
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

  function createRoute(path: string) {
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

      out = replaceAnnotation(out, re0, re1);
    }

    return out;
  }

  return {
    applyParams,
    createRoute
  };
}
