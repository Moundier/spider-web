class Todo {
  // ANSI escape codes for colors
  static ANSI_RESET = "\x1B[0m";
  static ANSI_BLUEY = "\x1B[34m";
  static ANSI_REDDY = "\x1B[31m";
  static ANSI_YELLY = "\x1B[33m";
  static ANSI_GREEN = "\x1B[32m";
  static ANSI_PURPY = "\x1B[35m";
  static ANSI_CYANY = "\x1B[36m";
  static ANSI_WHITE = "\x1B[37m";
  static ANSI_BLACK = "\x1B[30m";

  static io = console; // TODOs: You can customize the output stream

  static io(color, prefix, message) {
    Todo.io.log(color + prefix + " " + message + Todo.ANSI_RESET);
  }

  static info(message) {
    Todo.io(Todo.ANSI_BLUEY, "INFO", message);
  }

  static fail(message) {
    Todo.io(Todo.ANSI_REDDY, "FAIL", message);
  }

  static warn(message) {
    Todo.io(Todo.ANSI_YELLY, "WARN", message);
  }

  static done(message) {
    Todo.io(Todo.ANSI_GREEN, "DONE", message);
  }

  static look(message) {
    Todo.io(Todo.ANSI_PURPY, "LOOK", message);
  }

  static cyan(message) {
    Todo.io(Todo.ANSI_CYANY, "CYAN", message);
  }

  static buny(message) {
    Todo.io(Todo.ANSI_WHITE, "WHITE", message);
  }

  static time(message) {
    Todo.io(Todo.ANSI_BLACK, "TIME", message);
  }
}

// Example Usage:
Todo.info("This is an informational message");
Todo.fail("This is a failure message");
Todo.warn("This is a warning message");
Todo.done("This is a success message");
Todo.look("This is a look message");
Todo.cyan("This is a cyan message");
Todo.buny("This is a white message");
Todo.time("This is a time message");
