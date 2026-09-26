import {daemonizeProcess} from "./index.ts";
import {writeFileSync} from "node:fs";
import {env, ppid} from "node:process";

daemonizeProcess();
writeFileSync(new URL("test-output", import.meta.url), `${ppid},${"_DAEMONIZE_PROCESS" in env}`);
