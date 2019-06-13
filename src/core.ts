import { regex } from "./constants";
import { assertType } from "./utils";

export function normalizeUrl(url: string) {
  assertType(url, "url", "string");

  return url
    .replace(regex.sequenceOfSlashes, "/")
    .replace(regex.trailingSlash, "");
}

function replaceForParam(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.paramDefinition, ":$1");
}

function replaceForString(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.stringAnnotation, regex.string.source);
}

function replaceForInt(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.intAnnotation, regex.int.source);
}

function replaceForUnsignedInt(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.uintAnnotation, regex.uint.source);
}

function replaceForFloat(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.floatAnnotation, regex.float.source);
}

function replaceForUuid(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.uuidAnnotation, regex.uuid.source);
}

function stripAnnotations(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.annotation, "").replace(regex.paramDelimiters, ":");
}

export function applyParams(arg: string, params: object = {}) {
  assertType(arg, "arg", "string");
  assertType(params, "params", "object");

  const paramNames = Object.keys(params);

  let out = stripAnnotations(arg);

  paramNames.forEach(function(paramName) {
    const valueAsString = String(params[paramName]);
    out = out.replace(":" + paramName, valueAsString);
  });

  return out;
}

export function createRoutePath(arg: string) {
  assertType(arg, "arg", "string");

  let out = normalizeUrl(arg);

  /**
   * We don't have any params to replace, so exit immediatelly.
   */
  if (!regex.paramDelimiters.test(out)) {
    return out;
  }

  out = replaceForParam(out);
  out = replaceForString(out);
  out = replaceForInt(out);
  out = replaceForUnsignedInt(out);
  out = replaceForFloat(out);
  out = replaceForUuid(out);

  return out;
}
