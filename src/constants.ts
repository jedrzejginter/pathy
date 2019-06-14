export const regex = {
  annotation: /\:[^\}]*\}/g,
  paramDelimiters: /(\{|\})/g,
  sequenceOfSlashes: /\/{2,}/g,
  trailingSlash: /\/\s*$/,
  /** */
  bool: /(true|false)/,
  float: /(0|-?[1-9]\d{0,128}|-?0\.\d{0,128}[1-9]\d{0,128}|-?[1-9]\d{0,128}\.\d{1,128})/,
  int: /(0|-?[1-9]\d{0,128})/,
  string: /([^\/]+)/,
  uint: /(0|[1-9]\d{0,128})/,
  uuid: /([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/i,
  /** */
  paramDefinition: /\{([a-z][a-z\d]{0,127}(_[a-z\d]{1,128}){0,16})/gi,
  /** */
  boolAnnotation: /\:(bool|boolean)\}/g,
  floatAnnotation: /\:float\}/g,
  intAnnotation: /\:int\}/g,
  stringAnnotation: /\:(str|string)\}/g,
  uintAnnotation: /\:uint\}/g,
  uuidAnnotation: /\:(id|uuid)\}/g
};
