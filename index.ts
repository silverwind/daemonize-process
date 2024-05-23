import {spawn} from "node:child_process";
import {env, cwd, execPath, argv, exit} from "node:process";
import type {SpawnOptions} from "node:child_process";

const id = "_DAEMONIZE_PROCESS";

type DaemonizeProcessOpts = {
  /** The path to the script to be executed. Default: The current script. */
  script?: string,
  /** The command line arguments to be used. Default: The current arguments. */
  arguments?: string[],
  /** The path to the Node.js binary to be used. Default: The current Node.js binary. */
  node?: string,
  /** The exit code to be used when exiting the parent process. Default: `0`. */
  exitCode?: number,
} & SpawnOptions;

export function daemonizeProcess(opts: DaemonizeProcessOpts = {}) {
  if (id in env) {
    // In the child, clean up the tracking environment variable
    delete env[id];
  } else {
    // In the parent, set the tracking environment variable, fork the child and exit
    const o: DaemonizeProcessOpts = {
      // spawn options
      env: Object.assign(env, opts.env, {[id]: "1"}),
      cwd: cwd(),
      stdio: "ignore",
      detached: true,
      // custom options
      node: execPath,
      script: argv[1],
      arguments: argv.slice(2),
      exitCode: 0,
      ...opts,
    };

    const args: string[] = [o.script as string, ...(o.arguments as string[])];
    const proc: any = spawn(o.node as string, args, o);
    proc?.unref?.();
    exit(o.exitCode);
  }
}
