"use strict";

const path = require("path");
const fs = require("fs");

require(".")();

fs.writeFileSync(path.join(__dirname, "ppid"), String(process.ppid));
