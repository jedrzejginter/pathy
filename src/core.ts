import { regex } from "./constants";
import { assertType } from "./utils";

export function normalizeUrl(url: string) {
  assertType(url, "url", "string");

  return url
    .replace(regex.protocolSlashesReplace, "://")
    .replace(regex.multiSlashesReplace, "$1/")
    .replace(regex.leadingSlashesReplace, "/")
    .replace(regex.trailingSlashesReplace, "")
    .replace(regex.leadingSpacesReplace, "")
    .replace(regex.trailingSpacesReplace, "");
}

function replaceAnnotation(path: string, match: RegExp, replace: RegExp) {
  assertType(path, "path", "string");
  return path.replace(match, `:$1${replace.source}`);
}

export function replaceForString(path: string) {
  return replaceAnnotation(path, regex.strAnnotation, regex.str);
}

export function replaceForInt(path: string) {
  return replaceAnnotation(path, regex.intAnnotation, regex.int);
}

export function replaceForUnsignedInt(path: string) {
  return replaceAnnotation(path, regex.uintAnnotation, regex.uint);
}

export function replaceForFloat(path: string) {
  return replaceAnnotation(path, regex.floatAnnotation, regex.float);
}

export function replaceForBool(path: string) {
  return replaceAnnotation(path, regex.boolAnnotation, regex.bool);
}

export function replaceForUuid(path: string) {
  return replaceAnnotation(path, regex.uuidAnnotation, regex.uuid);
}

export function stripAnnotations(arg: string) {
  assertType(arg, "arg", "string");

  return arg
    .replace(regex.annotation, "")
    .replace(regex.paramDefinitionOpening, ":");
}

export function applyParams(path: string, params: object) {
  assertType(path, "arg", "string");
  assertType(params, "params", "object");

  const paramNames = Object.keys(params);

  let out = stripAnnotations(path);

  paramNames.forEach(paramName => {
    const valueAsString = String(params[paramName]);
    out = out.replace(":" + paramName, valueAsString);
  });

  return out;
}

export function createRoutePath(path: string) {
  assertType(path, "path", "string");

  let out = normalizeUrl(path);

  /**
   * We HAVE TO create a new RegExp instance every time, because we are using global flag
   * and it keeps tracks of 'lastIndex' property which results in different behaviour
   * ('test' method returns false even is should return true).
   * For more see the accepted answer on Stack Overflow.
   * @see https://stackoverflow.com/a/6891667
   */
  const re = new RegExp(regex.paramDefinitionOpening);

  if (!re.test(out)) {
    return out;
  }

  out = replaceForBool(out);
  out = replaceForFloat(out);
  out = replaceForInt(out);
  out = replaceForString(out);
  out = replaceForUnsignedInt(out);
  out = replaceForUuid(out);

  return out;
}
