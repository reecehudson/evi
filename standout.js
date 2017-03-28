#! /usr/bin/env node
'use strict';

const styles = require('colors').styles;
const Duplex = require('stream').Duplex;
const inherits = require('util').inherits;
const assert = require('assert');

module.exports = Standout;

inherits(Standout, Duplex);
function Standout(opts = {}) {
  Duplex.apply(this, arguments);
  this.color = opts.color || "bold";
  this.firstWrite = true;
  this.pushCloseCalled = false;

  this.init();
}

Standout.prototype.init = function () {
  // FIXME: atm stdin never emits "end"
  this.once("end", this.pushClose.bind(this));
  process.once("exit", this.pushClose.bind(this));
}

Standout.prototype._write = function (chunk, enc, cb) {
  // TODO: adhere to backpressure, keep a buffer
  // TODO: make sure encoding of ANSI escape is same as through put
  if (this.firstWrite === true)
    this.push(styles[this.color].open, "utf8"), this.firstWrite = false;
  assert.notStrictEqual(true, this.firstWrite);
  // FIXME: enc is "buffer", Readable doesn' support it
  this.push(chunk, "utf8");
};

Standout.prototype.pushClose = function pushClose() {
  // TODO: remove either "end" or "exit" event, chiever wsn't called
  if (this.pushCloseCalled) return;
  this.pushCloseCalled = true;
  this.push(styles[this.color].close, "utf8");
  this.push(null);
}

Standout.prototype._read = function () {
  // no-op atm
}
