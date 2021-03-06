'use strict';

var assert = require('assert');
var util = require('util');

var pipeline = require('../../pipeline');

function Block(opcode) {
  pipeline.Pipeline.Node.call(this, opcode || 'region');
  this.blockIndex = 0;

  this.predecessors = [];
  this.successors = [];
  this.nodes = [];
}
util.inherits(Block, pipeline.Pipeline.Node);
module.exports = Block;

Block.create = function create(opcode) {
  return new Block(opcode);
};

Block.prototype.prepend = function prepend(node) {
  this.nodes.unshift(node);
  node.block = this;
};

Block.prototype.insert = function insert(index, node) {
  this.nodes.splice(index, 0, node);
  node.block = this;
};

Block.prototype.add = function add(node) {
  this.nodes.push(node);
  node.block = this;
};

Block.prototype.remove = function remove(index) {
  var node = this.nodes[index];
  this.nodes.splice(index, 1);

  node.block = null;
};

Block.prototype.jump = function jump(other) {
  this.successors.push(other);
  other.predecessors.push(this);
};

Block.prototype.getLastControl = function getLastControl() {
  if (this.nodes.length === 0)
    return null;

  var node = this.nodes[this.nodes.length - 1];
  if (node.control.length === 0 || node.control[0] !== this)
    return null;

  return node;
};
