#!/usr/bin/env node
var program = require('../index.js');


program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
