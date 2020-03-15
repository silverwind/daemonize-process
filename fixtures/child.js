"use strict";

const daemonizeProcess = require("."); // eslint-disable-line
const {join} = require("path");
const {writeFileSync} = require("fs");

daemonizeProcess();
const output = [String(process.ppid), "_DAEMONIZE_PROCESS" in process.env].join(",");
writeFileSync(join(__dirname, "test-output"), output);
