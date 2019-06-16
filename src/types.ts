export type PathyTypeAnnotation = {
  parse?: (value: string) => any;
  regex: RegExp;
};

export type PathyAnnotations = {
  [k: string]: RegExp | PathyTypeAnnotation;
};

export type PathyOptions = {
  annotations?: PathyAnnotations;
  overwriteTypes?: boolean;
};
