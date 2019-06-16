import { PathyAnnotations } from "./types";

export const ANNOTATION_REGEXP = /\:[a-zA-Z\d_-]+\}/g;
export const PARAM_DEFINITION_OPENING_REGEXP = /\{/g;
export const LEADING_SLASHES_REPLACE_REGEXP = /^\/{2,}/;
export const LEADING_SPACES_REPLACE_REGEXP = /^\s+/;
export const TRAILING_SPACES_REPLACE_REGEXP = /\s+$/;
export const MULTI_SLASHES_REPLACE_REGEXP = /([^\:])\/{2,}/g;
export const PROTOCOL_SLASHES_REPLACE_REGEXP = /\:\/{3,}/;
export const TRAILING_SLASHES_REPLACE_REGEXP = /\/\s*$/;

export const coreAnnotations: PathyAnnotations = {
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
