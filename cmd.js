const
    _ = require('lodash'),
    childProcess = require('child_process'),
    DEFAULT_MAXBUFFER_SIZE = 20 * 1024 * 1024

function exec(cmd, options) {
    const result = childProcess.spawnSync(cmd, Object.assign({
        cwd: process.cwd(),
        env: process.env,
        maxBuffer: DEFAULT_MAXBUFFER_SIZE,
        encoding: 'utf8',
        shell: true
    }, options))

    let code

    if (result.error) {
        code = (typeof result.error.code === 'number' ? result.error.code : 1)
    } else {
        code = result.status || 0
    }

    if (code !== 0 && !options.ignoreErrors) {
        if (options.stdio === 'pipe') {
            if (result.stdout) {
                console.log('stdout:', result.stdout)
            }

            if (result.stderr) {
                console.error('stderr:', result.stderr)
            }
        }

        throw new Error(`Command "${cmd}" failed with status code: ${code}`)
    }

    return {
        code,
        stdout: result.stdout
    }
}

module.exports = {
    debug: false,

    exec(cmd, options) {
        if (this.debug) {
            console.log('Running', cmd, options)
        }

        return exec(cmd, Object.assign({}, options, {
            stdio: 'inherit'
        })).code
    },

    eval(cmd, options) {
        const type = ((options && options.type) || 'string')

        if (this.debug) {
            console.log('Running', cmd, options)
        }

        let result = exec(cmd, Object.assign({}, options, {
            stdio: 'pipe'
        })).stdout

        switch (type) {
            case 'string':
                return result
            case 'lines':
                return _.chain(result)
                    .split(/\r?\n/)
                    .map((line) => {
                        return line.trim()
                    })
                    .filter((line) => {
                        return line.length > 0
                    })
                    .value()
            case 'json':
                return JSON.parse(result)
            case 'number':
                return parseInt(result.trim(), 10)
        }
    }
}
