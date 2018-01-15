"use strict";

const id = "_DAEMONIZE_PROCESS";

module.exports = function(opts) {
  if (id in process.env) {
    // In the child, clean up the tracking environment variable
    delete process.env[id];
  } else {
    // In the parent, set the tracking environment variable, fork the child and exit
    opts = Object.assign({}, {
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
    }, opts);
    opts.env = Object.assign({}, opts.env, {[id]: "1"});
    require("child_process").spawn(opts.node, [opts.script].concat(opts.arguments), opts).unref();
    process.exit(opts.exitCode);
  }
};
