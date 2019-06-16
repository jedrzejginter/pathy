import {
  ANNOTATION_REGEXP,
  PARAM_DEFINITION_OPENING_REGEXP,
  LEADING_SLASHES_REPLACE_REGEXP,
  LEADING_SPACES_REPLACE_REGEXP,
  TRAILING_SPACES_REPLACE_REGEXP,
  MULTI_SLASHES_REPLACE_REGEXP,
  PROTOCOL_SLASHES_REPLACE_REGEXP,
  TRAILING_SLASHES_REPLACE_REGEXP
} from "./constants";
import { assertType } from "./utils";

export function normalizePath(path: string) {
  assertType(path, "path", "string");

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
  keepName: boolean = true
) {
  assertType(path, "path", "string");

  const replaceWith = keepName ? `:$1${replace.source}` : replace.source;

  return path.replace(match, replaceWith);
}

export function stripAnnotations(path: string) {
  assertType(path, "path", "string");

  return path
    .replace(ANNOTATION_REGEXP, "")
    .replace(PARAM_DEFINITION_OPENING_REGEXP, ":");
}

export function applyParams(path: string, params: object) {
  assertType(path, "arg", "string");
  assertType(params, "params", "object");

  const paramNames = Object.keys(params);
  let out = stripAnnotations(path);

  for (const paramName of paramNames) {
    out = out.replace(`:${paramName}`, params[paramName]);
  }

  return out;
}
