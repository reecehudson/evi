#! /usr/bin/env node
'use strict';

const Standout = require('./standout');

process.stdin.pipe(new Standout).pipe(process.stdout);
