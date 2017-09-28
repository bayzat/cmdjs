# cmdjs

Simple replacement for `shelljs.exec`.

It provides just two methods:
- `exec`: run a command while stdin/stdout/stderr is inherited from the main process (can be used also for interactive processes); just exit code is returned
- `eval`: run a command and wait for the result from stdout (cannot be used for interactive processes)

## Installing

Via npm:

```bash
$ npm install --save cmdjs
```

## Examples

```javascript
var cmd = require('cmdjs');

// interactive process
cmd.exec('npm init');

// check exit code
if (cmd.exec('ls package.json') === 0) {
    console.log('file exists');
}

// evaluate command and return lines in an array
var files = cmd.eval('ls -l .', { type: 'lines' });
console.log(files.length);
```

## Method reference

All methods run synchronously.

### exec(cmd, [options])
Available options:

+ `ignoreErrors`: don't throw an error when exit code is non-zero (optional; default `false`)

Returns an exit code.

### eval(cmd, [options])
Available options:

+ `ignoreErrors`: don't throw an error when exit code is non-zero (optional; default `false`)
+ `type`: either `string`, `lines`, `json` or `number` (optional; default `string`)

Returns standard output parsed according to provided `type`: `string`, `array`, `plain object` or `number` respectively.
