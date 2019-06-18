import { PathyOptions, PathyParamTypes } from "./types";
import {
  applyParams,
  coreTypes,
  createParamDefinitionRegExp,
  extractParamsDefinitions,
  extractRegExpForParamType,
  extractValuesOfUrlParams,
  getParamDefinitionStruct,
  normalizePath,
  replaceParamTypeWithRegExp,
} from "./core";

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
      const matchRegExp: RegExp = createParamDefinitionRegExp(type);
      const replaceRegExp: RegExp = extractRegExpForParamType(pathyTypes[type]);

      out = replaceParamTypeWithRegExp(out, matchRegExp, replaceRegExp, keepNames);
    }

    return out;
  }

  function extractParams(path: string, url: string): object {
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
