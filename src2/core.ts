/**
 * Replaces weird -0 (negative 0) with 0 (positive zero).
 */
export function unsignedZero(value: number): number {
  return value === -0 ? 0 : value;
}

/**
 * Converts arg0 to a signed float.
 * Returns NaN for argument, that is not a valid number or cannot be converted to a float.
 */
export function toFloat(value: string | number): number {
  if (typeof value === "number") {
    return unsignedZero(value);
  }

  // We don't have to use 'unsignedZero' here, because 'parseFloat' will take care of it.
  return parseFloat(value);
}

/**
 * Converts arg0 to a signed integer.
 * Returns NaN for argument, that is not a valid number or cannot be converted to an integer.
 */
export function toInt(value: string | number): number {
  const int = parseInt(value.toString(), 10);
  return unsignedZero(int);
}

/**
 * Converts arg0 to a boolean.
 */
export function toBoolean(value: string | boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return value === "true";
}
