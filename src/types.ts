export type PathyParamValueParser<T> = (value: string) => T;

export type PathyParamType = {
  parse?: PathyParamValueParser<any>;
  regex: RegExp;
};

export type PathyParamTypes = {
  [T: string]: RegExp | PathyParamType;
};

export type PathyParamStruct = {
  name: string;
  type: string;
};

export type PathyOptions = {
  overwriteTypes?: boolean;
  types?: PathyParamTypes;
};
