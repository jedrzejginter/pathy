module.exports.regex = {
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
