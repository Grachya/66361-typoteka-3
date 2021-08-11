'use strict';

const packageJsonFile = require('../../../package.json');

module.exports = {
    name: `--version`,
    run() {
        const version = packageJsonFile.packageJsonFile;
        console.info(version);
    }
}