import { PathyParamStruct, PathyOptions, PathyParamType, PathyParamTypes } from "./types";

export const coreTypes: PathyParamTypes = {
  bool: {
    parse: (value: string): boolean => value === "true",
    regex: /(true|false)/,
  },
  float: {
    parse: (value: string): number => parseFloat(value),
    regex: /(0|-?[1-9]\d{0,128}|-?0\.\d{0,128}[1-9]\d{0,128}|-?[1-9]\d{0,128}\.\d{1,128})/,
  },
  int: {
    parse: (value: string): number => parseInt(value, 10),
    regex: /(0|-?[1-9]\d{0,128})/,
  },
  str: /([^\/]+)/,
  uint: /(0|[1-9]\d{0,128})/,
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

export function replaceParameterTypeWithRegExp(
  path: string,
  match: RegExp,
  replace: RegExp,
  keepName: boolean = true,
) {
  const replaceWith = keepName ? `:$1${replace.source}` : replace.source;
  return path.replace(match, replaceWith);
}

export function removeParameterTypes(path: string) {
  return path.replace(/\{([a-z\d_-]+)\:[a-z\d_-]+\}/gi, ":$1");
}

export function applyParams(path: string, params: object) {
  const paramNames = Object.keys(params);
  let pathWithParamsApplied = removeParameterTypes(path);

  for (const paramName of paramNames) {
    const paramValue = params[paramName];
    pathWithParamsApplied = pathWithParamsApplied.replace(`:${paramName}`, paramValue);
  }

  return pathWithParamsApplied;
}

export function createParameterTypeRegExp(type: string): RegExp {
  const regExpSource = `\\{([a-zA-Z\\d_-]{1,128})\\:${type}\\}`;
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

  if (valuesOfParams === null) {
    return [];
  }

  return valuesOfParams.slice(1);
}

export function pathy(options: PathyOptions = {}) {
  const customTypes = options.types || {};
  const overwriteTypes = options.overwriteTypes || false;

  const processedCustomTypes = {};

  for (const customTypeName in customTypes) {
    if (!overwriteTypes && coreTypes.hasOwnProperty(customTypeName)) {
      throw new Error(`You have to set 'overwriteTypes: true' to overwrite built-in types`);
    }

    const customType = customTypes[customTypeName];
    const customTypeRegexp: RegExp = extractRegExpForParamType(customType);

    let regexpSource = customTypeRegexp.source
      .replace(/^\s+/, "")
      .replace(/\s+$/, "")
      .replace(/^\^+/, "")
      .replace(/\$+$/, "");

    if (!regexpSource.match(/^\(.+\)$/)) {
      regexpSource = `(${regexpSource})`;
    }

    processedCustomTypes[customTypeName] = new RegExp(regexpSource);
  }

  const pathyTypes: PathyParamTypes = overwriteTypes
    ? { ...coreTypes, ...processedCustomTypes }
    : { ...processedCustomTypes, ...coreTypes };

  function createRoute(path: string, keepNames: boolean = true) {
    let out = normalizePath(path);

    /**
     * Test if there is any possibility we have any dynamic parameteres definitions in 'path'.
     * If not, there is nothing to do (either we have already route ready or this 'path' is not
     * really dynamic).
     */
    if (!/[{}]/g.test(out)) {
      return out;
    }

    for (const type in pathyTypes) {
      const matchRegExp: RegExp = createParameterTypeRegExp(type);
      const replaceRegExp: RegExp = extractRegExpForParamType(pathyTypes[type]);

      out = replaceParameterTypeWithRegExp(out, matchRegExp, replaceRegExp, keepNames);
    }

    return out;
  }

  function extractParams(url: string, path: string): object {
    /**
     * Get all dynamic parameters definitions inside specified 'path'.
     * Example:
     *  Input: "/posts/{postId:uuid}-{postSlug:string}"
     *  Output: ["{postId:uuid}", "{postSlug:string}"]
     */
    const matchedDynamicParameters: string[] = extractParamsDefinitions(path);

    /**
     * If no parameters definitions found in specified 'path',
     * then we have no way to extract dynamic parameters values -
     * so exit immediatelly with empty values set.
     */
    if (matchedDynamicParameters.length === 0) {
      return {};
    }

    const dynamicParameterStructs = matchedDynamicParameters.map(getParamDefinitionStruct);
    const route = createRoute(path, false);
    const matchedUrlParameterVals = extractValuesOfUrlParams(url, route);

    console.log(dynamicParameterStructs, route, matchedUrlParameterVals);

    if (
      matchedUrlParameterVals.length === 0 ||
      matchedUrlParameterVals.length !== dynamicParameterStructs.length
    ) {
      return {};
    }

    const params = {};

    matchedUrlParameterVals.forEach((match: string, index: number) => {
      const { name, type } = dynamicParameterStructs[index];
      const x = pathyTypes[type];
      const parse = x instanceof RegExp ? null : x.parse;
      let value: string | number | boolean = match;

      if (typeof parse === "function") {
        value = parse(value);
      }

      params[name] = value;
    });

    return params;
  }

  return {
    applyParams,
    createRoute,
    extractParams,
  };
}
