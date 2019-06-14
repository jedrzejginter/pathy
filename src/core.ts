import { regex } from "./constants";
import { assertType } from "./utils";

export function normalizeUrl(url: string) {
  assertType(url, "url", "string");

  return url
    .replace(regex.protocolSlashesReplace, "://")
    .replace(regex.slashesReplace, "$1/")
    .replace(regex.trailingSlash, "");
}

export function replaceForString(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.strAnnotation, `:$1${regex.str.source}`);
}

export function replaceForInt(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.intAnnotation, `:$1${regex.int.source}`);
}

export function replaceForUnsignedInt(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.uintAnnotation, `:$1${regex.uint.source}`);
}

export function replaceForFloat(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.floatAnnotation, `:$1${regex.float.source}`);
}

export function replaceForBool(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.boolAnnotation, `:$1${regex.bool.source}`);
}

export function replaceForUuid(arg: string) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.uuidAnnotation, `:$1${regex.uuid.source}`);
}

export function stripAnnotations(arg: string) {
  assertType(arg, "arg", "string");

  return arg
    .replace(regex.annotation, "")
    .replace(regex.paramDefinitionOpening, ":");
}

export function applyParams(arg: string, params: object) {
  assertType(arg, "arg", "string");
  assertType(params, "params", "object");

  const paramNames = Object.keys(params);

  let out = stripAnnotations(arg);

  paramNames.forEach(paramName => {
    const valueAsString = String(params[paramName]);
    out = out.replace(":" + paramName, valueAsString);
  });

  return out;
}

export function createRoutePath(arg: string) {
  assertType(arg, "arg", "string");

  let out = normalizeUrl(arg);

  /**
   * We HAVE TO create a new RegExp instance every time, because we are using global flag
   * and it keeps tracks of 'lastIndex' property which results in different behaviour
   * ('test' method returns false even is should return true).
   * For more see the accepted answer on Stack Overflow.
   * @see https://bit.ly/2wSg1Po
   */
  const re = new RegExp(regex.paramDefinitionOpening);

  if (!re.test(out)) {
    return out;
  }

  out = replaceForBool(out);
  out = replaceForFloat(out);
  out = replaceForInt(out);
  out = replaceForUnsignedInt(out);
  out = replaceForString(out);
  out = replaceForUuid(out);

  return out;
}
