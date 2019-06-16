import { PARAM_DEFINITION_OPENING_REGEXP, coreAnnotations } from "./constants";
import {
  applyParams,
  replaceAnnotation,
  normalizePath,
  createRegExpForType,
  getRegExpForAnnotation,
  removeBegginingQuantifier,
  removeEndingQuantifier,
  removeLeadingSpaces,
  removeTrailingSpaces,
  ensureRegExpCaptureGroup,
  getParamAnnotationMeta,
} from "./core";
import { PathyOptions, PathyAnnotations } from "./types";
import { assertString } from "./utils";

export function pathy(options: PathyOptions = {}) {
  const userDefinedAnnotations = options.annotations || {};
  const overwriteTypes = options.overwriteTypes || false;

  const additionalAnnotations = {};

  for (const userDefinedType in userDefinedAnnotations) {
    if (!overwriteTypes && coreAnnotations.hasOwnProperty(userDefinedType)) {
      throw new Error(`You cannot overwrite ${userDefinedType} annotation`);
    }

    const customTypeAnnotation = userDefinedAnnotations[userDefinedType];
    const customTypeRegexp: RegExp = getRegExpForAnnotation(customTypeAnnotation);

    let regexpSource = customTypeRegexp.source;

    regexpSource = removeLeadingSpaces(regexpSource);
    regexpSource = removeTrailingSpaces(regexpSource);
    regexpSource = removeBegginingQuantifier(regexpSource);
    regexpSource = removeEndingQuantifier(regexpSource);
    regexpSource = ensureRegExpCaptureGroup(regexpSource);

    additionalAnnotations[userDefinedType] = new RegExp(regexpSource);
  }

  const annotations: PathyAnnotations = overwriteTypes
    ? { ...coreAnnotations, ...additionalAnnotations }
    : { ...additionalAnnotations, ...coreAnnotations };

  function createRoute(path: string, keepNames: boolean = true) {
    assertString(path, "path");

    let out = normalizePath(path);

    /**
     * We HAVE TO create a new RegExp instance every time, because we are using global flag
     * and it keeps tracks of 'lastIndex' property which results in different behaviour
     * ('test' method returns false even is should return true).
     * For more see the accepted answer on Stack Overflow.
     * @see https://stackoverflow.com/a/6891667
     */
    const re = new RegExp(PARAM_DEFINITION_OPENING_REGEXP);

    if (!re.test(out)) {
      return out;
    }

    for (const type in annotations) {
      const matchRegExp: RegExp = createRegExpForType(type);
      const replaceRegExp: RegExp = getRegExpForAnnotation(annotations[type]);

      out = replaceAnnotation(out, matchRegExp, replaceRegExp, keepNames);
    }

    return out;
  }

  function parsePathParams(path: string, url: string): object {
    assertString(path, "path");
    assertString(url, "url");

    const matchedAnnotations = path.match(/\{[a-zA-Z\d_-]+\:[a-zA-Z\d_-]+\}/g);

    if (matchedAnnotations === null) {
      return {};
    }

    const pathParamsMetadata = matchedAnnotations.map(getParamAnnotationMeta);
    const pathRoute = createRoute(path, false);
    const urlMatchedParams = url.match(new RegExp(pathRoute));

    if (urlMatchedParams === null) {
      return {};
    }

    const matches = urlMatchedParams.slice(1);

    if (matches.length !== pathParamsMetadata.length) {
      return {};
    }

    const params = {};

    matches.forEach((match, index) => {
      const { name, type } = pathParamsMetadata[index];
      const x = annotations[type];
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
    parsePathParams,
  };
}
