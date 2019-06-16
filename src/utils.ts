export function getPreciseTypeOf(arg: any) {
  const argTypeOf = typeof arg;
  let gotType: string = argTypeOf;

  if (arg === null) {
    gotType = "null";
  } else if (Array.isArray(arg)) {
    gotType = "array";
  }

  return gotType;
}

export function assertBoolean(arg: any, argName: string): void {
  const argTypeOf = getPreciseTypeOf(arg);

  if (argTypeOf !== "boolean") {
    throw new TypeError(`Expected '${argName}' to be a boolean, but got ${argTypeOf}`);
  }
}

export function assertString(arg: any, argName: string): void {
  const argTypeOf = getPreciseTypeOf(arg);

  if (argTypeOf !== "string") {
    throw new TypeError(`Expected '${argName}' to be a string, but got ${argTypeOf}`);
  }
}

export function assertObject(arg: any, argName: string): void {
  const argTypeOf = getPreciseTypeOf(arg);

  if (argTypeOf !== "object") {
    throw new TypeError(`Expected '${argName}' to be an object, but got ${argTypeOf}`);
  }
}

export function assertRegExp(arg: any, argName: string): void {
  const argTypeOf = getPreciseTypeOf(arg);

  if (!(arg instanceof RegExp)) {
    throw new TypeError(`Expected '${argName}' to be a RegExp instance, but got ${argTypeOf}`);
  }
}
