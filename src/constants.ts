export const regex = {
  annotation: /\:[^\}]+\}/g,
  paramDefinitionOpening: /\{/g,
  leadingSlashesReplace: /^\/{2,}/,
  leadingSpacesReplace: /^\s+/,
  trailingSpacesReplace: /\s+$/,
  multiSlashesReplace: /([^\:])\/{2,}/g,
  protocolSlashesReplace: /\:\/{3,}/,
  trailingSlashesReplace: /\/\s*$/,
  /** */
  bool: /(true|false)/,
  float: /(0|-?[1-9]\d{0,128}|-?0\.\d{0,128}[1-9]\d{0,128}|-?[1-9]\d{0,128}\.\d{1,128})/,
  int: /(0|-?[1-9]\d{0,128})/,
  str: /([^\/]+)/,
  uint: /(0|[1-9]\d{0,128})/,
  uuid: /([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/i,
  /** */
  boolAnnotation: /\{([\d\_a-z]{1,128})\:bool\}/g,
  floatAnnotation: /\{([\d\_a-z]{1,128})\:float\}/g,
  intAnnotation: /\{([\d\_a-z]{1,128})\:int\}/g,
  strAnnotation: /\{([\d\_a-z]{1,128})\:str\}/g,
  uintAnnotation: /\{([\d\_a-z]{1,128})\:uint\}/g,
  uuidAnnotation: /\{([\d\_a-z]{1,128})\:uuid\}/g
};
