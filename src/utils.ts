export function assertType(arg: any, argName: string, expectedType: string) {
  const argType = typeof arg;

  if (argType !== expectedType) {
    throw new TypeError(
      `Expected '${argName}' to be a ${expectedType}, but got ${argType}`
    );
  }
}
