"use strict";

const fs = require("fs");
const fork = require("child_process").fork;
const assert = require("assert");

// This tests whether the parent pid of the daemonized process is 0 or 1 which
// indicates the process was correctly orphaned.

fork("test-child.js").on("exit", function() {
  setTimeout(function() {
    assert(["0", "1"].includes(fs.readFileSync("ppid", "utf8")));
    fs.unlinkSync("ppid");
  }, 100);
});
