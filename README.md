# daemonize-process
[![](https://img.shields.io/npm/v/daemonize-process.svg?style=flat)](https://www.npmjs.org/package/daemonize-process) [![](https://img.shields.io/npm/dm/daemonize-process.svg)](https://www.npmjs.org/package/daemonize-process) [![](https://api.travis-ci.org/silverwind/daemonize-process.svg?style=flat)](https://travis-ci.org/silverwind/daemonize-process)

> Daemonize the current Node.js process

The module re-spawns the current process and then exits, which will lead to the new child process being adopted by `init` or similar mechanisms, effectively putting the current process into the background. Differences to the popular `daemon` module include:

- Fully configurable, exposes all options of `child_process.spawn`.
- Cleans up `process.env` after itself.
- Works on Node.js >= 8.

## Install

```console
$ npm install --save daemonize-process
```

## Example

```js
require('daemonize-process')();
```

## API

### daemonizeProcess([options])

The `options` object can contain any valid [`child_process.spawn` option](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) as well as these properties:

- `script` *string* - The path to the script to be executed. Default: The current script.
- `arguments` *Array* - The command line arguments to be used. Default: The current arguments.
- `node` *string* - The path to the Node.js binary to be used. Default: The current Node.js binary.
- `exitCode` *number* - The exit code to be used when exiting the parent process. Default: `0`.

By default the standard streams of the child are ignored (e.g. attached to `/dev/null` or equivalent). If you need these streams, adjust the `stdio` option.

## License

© [silverwind](https://github.com/silverwind), distributed under BSD licence
