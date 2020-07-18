import {
  coreTypes,
  createParamDefinitionRegExp,
  extractParamsDefinitions,
  extractRegExpForParamType,
  extractValuesOfUrlParams,
  getParamDefinitionStruct,
  normalizePath,
  replaceParamTypeWithRegExp,
  validateParams,
  validatePath,
} from "./core";
import { PathyOptions, PathyParamTypes } from "./types";

export function pathy(options: PathyOptions = {}) {
  const customTypes = options.types || {};
  const overwriteTypes = options.overwriteTypes || false;

  const processedCustomTypes: Record<string, any> = {};

  for (const customTypeName in customTypes) {
    if (Object.prototype.hasOwnProperty.call(customTypes, customTypeName)) {
      if (!overwriteTypes && customTypeName in coreTypes) {
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
  }

  const pathyTypes: PathyParamTypes = overwriteTypes
    ? { ...coreTypes, ...processedCustomTypes }
    : { ...processedCustomTypes, ...coreTypes };

  function applyParams(path: string, params: Record<string, any>): string {
    const paramNames = Object.keys(params);
    let pathWithParamsApplied = path;

    validateParams(path, params, pathyTypes);

    for (const paramName of paramNames) {
      const paramValue = params[paramName];
      const regExpForParamName = new RegExp(`\\{${paramName}\\:[a-zA-Z\\d_-]+\\}`);

      pathWithParamsApplied = pathWithParamsApplied.replace(regExpForParamName, paramValue);
    }

    return pathWithParamsApplied;
  }

  function createRoute(path: string, keepNames: boolean = true) {
    /**
     * Check, if specified path is correct.
     * It will throw if something is not right.
     */
    validatePath(path, pathyTypes);

    let out = normalizePath(path);

    /**
     * Test if there is any possibility we have any dynamic parameteres definitions in 'path'.
     * If not, there is nothing to do (either we have already route ready or this 'path' is not
     * really dynamic).
     */
    if (!/[{}]/g.test(out)) {
      return out;
    }

    for (const typeKey in pathyTypes) {
      if (Object.prototype.hasOwnProperty.call(pathyTypes, typeKey)) {
        const matchRegExp: RegExp = createParamDefinitionRegExp(typeKey);
        const replaceRegExp: RegExp = extractRegExpForParamType(pathyTypes[typeKey]);

        out = replaceParamTypeWithRegExp(out, matchRegExp, replaceRegExp, keepNames);
      }
    }

    return out;
  }

  function extractParams(path: string, url: string): Record<string, any> {
    /**
     * Check, if specified path is correct.
     * It will throw if something is not right.
     */
    validatePath(path, pathyTypes);

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

    if (
      matchedUrlParameterVals.length === 0 ||
      matchedUrlParameterVals.length !== dynamicParameterStructs.length
    ) {
      return {};
    }

    const params: Record<string, any> = {};

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
