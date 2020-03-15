"use strict";

const del = require("del");
const tempy = require("tempy");
const {fork} = require("child_process");
const {join} = require("path");
const {platform} = require("os");
const {test, expect, beforeAll, afterAll} = global;
const {readFile, copyFile} = require("fs").promises;

const testDir = tempy.directory();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

beforeAll(async () => {
  await copyFile(join(__dirname, "index.js"), join(testDir, "index.js"));
  await copyFile(join(__dirname, "fixtures/child.js"), join(testDir, "child.js"));
});

afterAll(async () => {
  await del(testDir, {force: true});
});

test("simple", done => {
  const child = fork(join(testDir, "child.js"));

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
    done();
  });
});
