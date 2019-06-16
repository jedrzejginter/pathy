import { PathyParamStruct, PathyOptions, PathyParamType, PathyParamTypes } from "./types";

export const coreTypes: PathyParamTypes = {
  bool: {
    parse: (value: string): boolean => value === "true",
    regex: /(true|false)/,
  },
  float: {
    parse: (value: string): number => parseFloat(value),
    regex: /(0|-?[1-9]\d*|-?0\.\d*[1-9]\d*|-?[1-9]\d*\.\d+)/,
  },
  int: {
    parse: (value: string): number => parseInt(value, 10),
    regex: /(0|-?[1-9]\d*)/,
  },
  str: /([^\/]+)/,
  uint: /(0|[1-9]\d*)/,
  uuid: /([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/,
};

export function normalizePath(path: string): string {
  /**
   * Remove leading and trailing white spaces at first.
   */
  const transformedPath = path.replace(/^\s+/, "").replace(/\s+$/, "");

  if (transformedPath === "/") {
    return transformedPath;
  }

  return transformedPath
    .replace(/\:\/{3,}/, "://")
    .replace(/([^\:])\/{2,}/g, "$1/")
    .replace(/^\/{2,}/, "/")
    .replace(/\/\s*$/, "");
}

export function replaceParamTypeWithRegExp(
  path: string,
  match: RegExp,
  replace: RegExp,
  keepName: boolean = true,
): string {
  const replaceWith = keepName ? `:$1${replace.source}` : replace.source;
  return path.replace(match, replaceWith);
}

export function createParamDefinitionRegExp(type: string): RegExp {
  const regExpSource = `\\{([a-zA-Z\\d_-]+)\\:${type}\\}`;
  return new RegExp(regExpSource, "g");
}

export function extractRegExpForParamType(regExpOrObj: RegExp | PathyParamType): RegExp {
  return regExpOrObj instanceof RegExp ? regExpOrObj : regExpOrObj.regex;
}

export function getParamDefinitionStruct(paramDef: string): PathyParamStruct {
  const paramDefinitionMatch = paramDef.match(/\{([a-zA-Z\d_-]+)\:([a-zA-Z\d_-]+)\}/);

  if (paramDefinitionMatch === null) {
    throw new Error("Couldn't parse parameter definition");
  }

  const [_, name, type] = paramDefinitionMatch;
  return { name, type };
}

export function applyParams(path: string, params: object): string {
  const paramNames = Object.keys(params);
  let pathWithParamsApplied = path;

  for (const paramName of paramNames) {
    const paramValue = params[paramName];
    const regExpForParamName = new RegExp(`\\{${paramName}\\:[a-zA-Z\\d_-]+\\}`);

    pathWithParamsApplied = pathWithParamsApplied.replace(regExpForParamName, paramValue);
  }

  return pathWithParamsApplied;
}

export function extractParamsDefinitions(path: string): string[] {
  /**
   * The global flag is very important here.
   * We used 'g' flag in RegExp, so we MUST NOT slice returned array, because what we get here
   * is the actual array of all matches only.
   * It would not be the case, if global flag is not set.
   */
  const matchedParamDefinitions = path.match(/(\{[a-zA-Z\d_-]+\:[a-zA-Z\d_-]+\})/g);
  return matchedParamDefinitions || [];
}

export function extractValuesOfUrlParams(url: string, route: string): string[] {
  const valuesOfParams = url.match(new RegExp(route));
  return valuesOfParams ? valuesOfParams.slice(1) : [];
}
