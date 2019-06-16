import {
  ANNOTATION_REGEXP,
  PARAM_DEFINITION_OPENING_REGEXP,
  LEADING_SLASHES_REPLACE_REGEXP,
  LEADING_SPACES_REPLACE_REGEXP,
  TRAILING_SPACES_REPLACE_REGEXP,
  MULTI_SLASHES_REPLACE_REGEXP,
  PROTOCOL_SLASHES_REPLACE_REGEXP,
  TRAILING_SLASHES_REPLACE_REGEXP,
} from "./constants";
import { assertBoolean, assertObject, assertRegExp, assertString } from "./utils";

export function normalizePath(path: string) {
  assertString(path, "path");

  return path
    .replace(PROTOCOL_SLASHES_REPLACE_REGEXP, "://")
    .replace(MULTI_SLASHES_REPLACE_REGEXP, "$1/")
    .replace(LEADING_SLASHES_REPLACE_REGEXP, "/")
    .replace(TRAILING_SLASHES_REPLACE_REGEXP, "")
    .replace(LEADING_SPACES_REPLACE_REGEXP, "")
    .replace(TRAILING_SPACES_REPLACE_REGEXP, "");
}

export function replaceAnnotation(
  path: string,
  match: RegExp,
  replace: RegExp,
  keepName: boolean = true,
) {
  assertString(path, "path");
  assertRegExp(match, "match");
  assertRegExp(replace, "replace");
  assertBoolean(keepName, "keepName");

  const replaceWith = keepName ? `:$1${replace.source}` : replace.source;
  return path.replace(match, replaceWith);
}

export function stripAnnotations(path: string) {
  assertString(path, "path");
  return path.replace(ANNOTATION_REGEXP, "").replace(PARAM_DEFINITION_OPENING_REGEXP, ":");
}

export function applyParams(path: string, params: object) {
  assertString(path, "path");
  assertObject(params, "params");

  const paramNames = Object.keys(params);
  let out = stripAnnotations(path);

  for (const paramName of paramNames) {
    const paramValue = params[paramName];
    out = out.replace(`:${paramName}`, paramValue);
  }

  return out;
}

export function createRegExpForType(type: string): RegExp {
  const regExpSource = `\\{([\\da-zA-Z_]{1,128})\\:${type}\\}`;
  return new RegExp(regExpSource, "g");
}

export function getRegExpForAnnotation(x: RegExp | { regex: RegExp }): RegExp {
  return x instanceof RegExp ? x : x.regex;
}

export function removeLeadingSpaces(str: string): string {
  return str.replace(/^\s+/, "");
}

export function removeTrailingSpaces(str: string): string {
  return str.replace(/\s+$/, "");
}

export function removeBegginingQuantifier(regExpSource: string): string {
  if (regExpSource.startsWith("^")) {
    return regExpSource.slice(1);
  }

  return regExpSource;
}

export function removeEndingQuantifier(regExpSource: string): string {
  if (regExpSource.endsWith("$")) {
    return regExpSource.slice(0, regExpSource.length - 1);
  }

  return regExpSource;
}

export function ensureRegExpCaptureGroup(regExpSource: string): string {
  if (!regExpSource.startsWith("(") || !regExpSource.endsWith(")")) {
    return `(${regExpSource})`;
  }

  return regExpSource;
}

export function getParamAnnotationMeta(x: string): { name: string; type: string } {
  const annotationMatch = x.match(/\{([a-zA-Z\d_-]+)\:([a-zA-Z\d_-]+)\}/);

  if (annotationMatch === null) {
    throw new Error("Couldn't parse annotation");
  }

  const [_, name, type] = annotationMatch;

  return { name, type };
}
