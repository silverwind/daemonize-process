import {daemonizeProcess} from "./index.js";
import {writeFileSync} from "node:fs";
import {env, ppid} from "node:process";

daemonizeProcess();
const output = [String(ppid), "_DAEMONIZE_PROCESS" in env].join(",");
writeFileSync(new URL("test-output", import.meta.url), output);
