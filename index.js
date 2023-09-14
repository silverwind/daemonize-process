import {spawn} from "node:child_process";
import {env, cwd, execPath, argv, exit} from "node:process";

const id = "_DAEMONIZE_PROCESS";

export function daemonizeProcess(opts = {}) {
  if (id in env) {
    // In the child, clean up the tracking environment variable
    delete env[id];
  } else {
    // In the parent, set the tracking environment variable, fork the child and exit
    const o = {
      // spawn options
      env: Object.assign(env, opts.env, {[id]: "1"}),
      cwd: cwd(),
      stdio: "ignore",
      detached: true,
      // custom options
      node: execPath,
      script: argv[1],
      arguments: argv.slice(2),
      exitCode: 0, ...opts
    };

    spawn(o.node, [o.script].concat(o.arguments), o).unref();
    exit(o.exitCode);
  }
}
