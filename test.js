"use strict";

const fs = require("fs");
const fork = require("child_process").fork;
const assert = require("assert");

// This tests whether the parent pid of the daemonized process is 0 or 1 which
// indicates the process was correctly orphaned. Also, it verifies the the
// internal tracking environment variable is not leaked in the child.

fork("test-child.js").on("exit", () => {
  setTimeout(() => {
    const [ppid, envVar] = fs.readFileSync("test-output", "utf8").split(",");
    fs.unlinkSync("test-output");
    assert(["0", "1"].includes(ppid));
    assert(envVar === "false");
  }, 100);
});
