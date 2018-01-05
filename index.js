"use strict";

const id = "_DAEMONIZE_PROCESS";
const defaults = {
  // spawn options
  env: process.env,
  cwd: process.cwd(),
  stdio: "ignore",
  detached: true,
  // custom options
  node: process.execPath,
  script: process.argv[1],
  arguments: process.argv.slice(2),
  exitCode: 0,
};

module.exports = function(opts) {
  if (id in process.env) {
    // We are in the child, just clean up the env variable
    delete process.env[id];
  } else {
    // We are in the parent, fork a child and exit
    opts = Object.assign(defaults, opts);
    process.env[id] = true;
    require("child_process").spawn(opts.node, [opts.script].concat(opts.arguments), opts).unref();
    process.exit(opts.exitCode);
  }
};
