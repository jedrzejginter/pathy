import { applyParams, createRoute } from "./core";
import { coreAnnotations } from "./constants";

export type PathyAnnotations = {
  [k: string]: RegExp;
};

export type PathyOptions = {
  annotations?: PathyAnnotations;
};

export function pathy(options: PathyOptions = {}) {
  const userDefinedAnnotations = options.annotations || {};

  for (const userDefinedType in userDefinedAnnotations) {
    if (coreAnnotations.hasOwnProperty(userDefinedType)) {
      throw new Error(`You cannot overwrite ${userDefinedType} annotation`);
    }
  }

  return {
    applyParams,
    createRoute
  };
}
