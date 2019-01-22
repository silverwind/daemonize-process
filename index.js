"use strict";

const id = "_DAEMONIZE_PROCESS";

module.exports = function(opts) {
  if (id in process.env) {
    // In the child, clean up the tracking environment variable
    delete process.env[id];
  } else {
    // In the parent, set the tracking environment variable, fork the child and exit
    opts = opts || {};
    const o = Object.assign({
      // spawn options
      env: Object.assign(process.env, opts.env, {[id]: "1"}),
      cwd: process.cwd(),
      stdio: "ignore",
      detached: true,
      // custom options
      node: process.execPath,
      script: process.argv[1],
      arguments: process.argv.slice(2),
      exitCode: 0,
    }, opts);
    require("child_process").spawn(o.node, [o.script].concat(o.arguments), o).unref();
    process.exit(o.exitCode);
  }
};
