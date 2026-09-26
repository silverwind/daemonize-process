import {daemonizeProcess} from "./index.ts";
import {appendFileSync, writeFileSync} from "node:fs";
import {argv, env, ppid} from "node:process";

const name = argv[2];
appendFileSync(new URL(`${name}-starts`, import.meta.url), "x");
daemonizeProcess(name === "custom-env" ? {env: Object.create({...env, DAEMONIZE_TEST: "1"})} : undefined);
writeFileSync(new URL(`${name}-output`, import.meta.url), `${ppid},${"_DAEMONIZE_PROCESS" in env},${env.DAEMONIZE_TEST}`);
