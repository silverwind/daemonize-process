import {fork} from "node:child_process";
import {platform, tmpdir} from "node:os";
import {mkdtempSync} from "node:fs";
import {readFile, copyFile, rm} from "node:fs/promises";
import {join} from "node:path";

const testDir = mkdtempSync(join(tmpdir(), "daemonize-process-"));
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(async () => {
  await copyFile(new URL("index.ts", import.meta.url), join(testDir, "index.ts"));
  await copyFile(new URL("child.ts", import.meta.url), join(testDir, "child.ts"));
  await copyFile(new URL("package.json", import.meta.url), join(testDir, "package.json"));
});

afterAll(async () => {
  await rm(testDir, {recursive: true});
});

test("simple", () => {
  return new Promise(resolve => {
    const child = fork(join(testDir, "child.ts"));

    child.on("exit", async () => {
      await sleep(1000); // give the child some time to exit
      const [ppid, envVar] = (await readFile(join(testDir, "test-output"), "utf8")).split(",");

      // check if process was correctly orphaned. on unix, this should generally mean that
      // pid 1 picked up the child, but it'll be different on other platforms.
      if (platform() === "win32") {
        expect(ppid).toMatch(/[0-9]+/);
      } else {
        expect(["0", "1"].includes(ppid)).toEqual(true);
      }

      // verify that internal tracking variable is not leaked to the child
      expect(envVar).toEqual("false");
      resolve(undefined);
    });
  });
});
