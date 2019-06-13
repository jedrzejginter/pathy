const regex = {
  sequenceOfSlashes: /\/{2,}/g,
  trailingSlash: /\/\s*$/,
  paramDelimiters: /(\{|\})/g,
  annotation: /\:[^\}]*\}/g,
  /** */
  string: /([^\/]+)/,
  int: /(0|-?[1-9]\d{0,128})/,
  uint: /(0|[1-9]\d{0,128})/,
  float: /(0|-?[1-9]\d{0,128}|-?0\.\d{0,128}[1-9]\d{0,128}|-?[1-9]\d{0,128}\.\d{1,128})/,
  uuid: /([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/i,
  /** */
  paramDefinition: /\{([a-z][a-z\d]{0,127}(_[a-z\d]{1,128}){0,16})/gi,
  /** */
  stringAnnotation: /\:(str|string)\}/g,
  intAnnotation: /\:int\}/g,
  uintAnnotation: /\:uint\}/g,
  floatAnnotation: /\:float\}/g,
  uuidAnnotation: /\:(id|uuid)\}/g
};

function assertType(arg, argName, expectedType) {
  const argType = typeof arg;

  if (argType !== expectedType) {
    throw new TypeError(
      "Expected `" +
        argName +
        "` to be a " +
        expectedType +
        ", but got: " +
        argType
    );
  }
}

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
