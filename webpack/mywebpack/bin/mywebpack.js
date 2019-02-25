#! /usr/bin/env node

let path = require('path');

let config = require(path.resolve('webpack.config.js'))

let Compiler = require('../lib/Compiler')
let compiler = new Compiler(config)
compiler.hooks.entryOption.call() //生命周期钩子

compiler.run()