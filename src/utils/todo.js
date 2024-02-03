const color = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

export function coloredPrint(colorCode, message) {
  console.log(colorCode + message + color.reset);
}

export function fail(message) {
  coloredPrint(color.red, `[FAIL] ${message}`);
}

export function done(message) {
  coloredPrint(color.green, `[DONE] ${message}`);
}

export function info(message) {
  coloredPrint(color.blue, `[INFO] ${message}`);
}

export function warn(message) {
  coloredPrint(color.yellow, `[WARN] ${message}`);
}

// Example usage
fail("Something went wrong!");
done("Task completed successfully.");
info("This is an informational message.");
warn("Be cautious, there is a warning.");
