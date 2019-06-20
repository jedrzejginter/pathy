/**
 * Replaces weird -0 (negative 0) with 0 (positive zero).
 */
export function unsignedZero(value: number): number {
  return value === -0 ? 0 : value;
}

/**
 * Strips decimal part of passed argument.
 * Keeps sign of the input value.
 */
export function getInt(value: number): number {
  const sgn: number = Math.sign(value);
  const abs: number = Math.abs(value);

  return Math.floor(abs) * sgn;
}

/**
 * Converts passed string to a signed number.
 * Returns NaN for arguments, that are not valid numbers or cannot be converted to a number.
 */
export function toNumber(value: string | number): number {
  if (value === "") {
    return NaN;
  }

  const num: number = Number(value);

  if (isNaN(num)) {
    return NaN;
  }

  return num;
}

/**
 * Converts passed string to a signed float.
 * Returns NaN for arguments, that are not valid numbers or cannot be converted to a float.
 */
export function toFloat(value: string | number): number {
  const num: number = toNumber(value);
  return unsignedZero(num);
}

/**
 * Converts passed string to a signed integer.
 * Returns NaN for arguments, that are not valid numbers or cannot be converted to integer.
 */
export function toInt(value: string | number): number {
  const num: number = toNumber(value);
  const int: number = getInt(num);
  return unsignedZero(int);
}

/**
 * Converts passed string to a boolean.
 */
export function toBoolean(value: string | boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return value === "true";
}
