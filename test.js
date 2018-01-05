"use strict";

const fs = require("fs");
const fork = require("child_process").fork;
const assert = require("assert");

// This tests whether the parent pid of the daemonized process is 1 which is
// true on Linux and macOS at least.

fork("test-child.js").on("exit", function() {
  setTimeout(function() {
    assert.equal(fs.readFileSync("ppid", "utf8"), "1");
    fs.unlinkSync("ppid");
  }, 100);
});
