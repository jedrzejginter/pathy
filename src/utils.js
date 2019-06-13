module.exports.assertType = function(arg, argName, expectedType) {
  const argType = typeof arg;

  if (argType !== expectedType) {
    throw new TypeError(
      "Expected `" +
        argName +
        "` to be " +
        (expectedType === "object" ? "an " : "a ") +
        expectedType +
        ", but got " +
        argType
    );
  }
};
