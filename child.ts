import {daemonizeProcess} from "./index.ts";
import {appendFileSync} from "node:fs";
import process, {argv, env} from "node:process";
import {setTimeout as sleep} from "node:timers/promises";

const name = argv[2];
appendFileSync(new URL(`${name}-starts`, import.meta.url), "x");
daemonizeProcess(name === "custom-env" ?
  {env: Object.create({...env, DAEMONIZE_TEST: "1"})} :
  {node: undefined, script: undefined, arguments: undefined});
for (let i = 0; i < 200 && process.platform !== "win32" && process.ppid > 1; i++) await sleep(10);
appendFileSync(new URL(`${name}-output`, import.meta.url), `${process.ppid},${"_DAEMONIZE_PROCESS" in env},${env.DAEMONIZE_TEST}`);
