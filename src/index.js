const { regex } = require("./constants.js");
const { assertType } = require("./utils.js");

module.exports.normalizeUrl = function(url) {
  assertType(url, "url", "string");

  return url
    .replace(regex.sequenceOfSlashes, "/")
    .replace(regex.trailingSlash, "");
};

module.exports.replaceForParam = function(arg) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.paramDefinition, ":$1");
};

module.exports.replaceForString = function(arg) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.stringAnnotation, regex.string.source);
};

module.exports.replaceForInt = function(arg) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.intAnnotation, regex.int.source);
};

module.exports.replaceForUnsignedInt = function(arg) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.uintAnnotation, regex.uint.source);
};

module.exports.replaceForFloat = function(arg) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.floatAnnotation, regex.float.source);
};

module.exports.replaceForUuid = function(arg) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.uuidAnnotation, regex.uuid.source);
};

module.exports.stripAnnotations = function(arg) {
  assertType(arg, "arg", "string");

  return arg.replace(regex.annotation, "").replace(regex.paramDelimiters, ":");
};

module.exports.applyParams = function(arg, params = {}) {
  assertType(arg, "arg", "string");
  assertType(params, "params", "object");

  const paramNames = Object.keys(params);
  let out = arg;

  paramNames.forEach(function(paramName) {
    const valueAsString = String(params[paramName]);
    out = out.replace(":" + paramName, valueAsString);
  });

  return out;
};

module.exports.createRoute = function(arg) {
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
};
