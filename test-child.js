"use strict";

const path = require("path");
const fs = require("fs");

require(".")();

const output = [String(process.ppid), "_DAEMONIZE_PROCESS" in process.env].join(",");
fs.writeFileSync(path.join(__dirname, "test-output"), output);
