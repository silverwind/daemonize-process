import {fork} from "node:child_process";
import {once} from "node:events";
import {platform, tmpdir} from "node:os";
import {mkdtempSync} from "node:fs";
import {readFile, copyFile, rm} from "node:fs/promises";
import {join} from "node:path";
import {setTimeout as sleep} from "node:timers/promises";

const testDir = mkdtempSync(join(tmpdir(), "daemonize-process-"));

beforeAll(async () => {
  await Promise.all(["index.ts", "child.ts", "package.json"].map(file => {
    return copyFile(new URL(file, import.meta.url), join(testDir, file));
  }));
});

afterAll(async () => {
  await rm(testDir, {recursive: true});
});

test("daemonized child is orphaned and does not inherit the tracking variable", async () => {
  await once(fork(join(testDir, "child.ts")), "exit");
  await sleep(1000);
  const [ppid, envVar] = (await readFile(join(testDir, "test-output"), "utf8")).split(",");
  if (platform() === "win32") {
    expect(ppid).toMatch(/[0-9]+/);
  } else {
    expect(["0", "1"]).toContain(ppid);
  }
  expect(envVar).toEqual("false");
});
