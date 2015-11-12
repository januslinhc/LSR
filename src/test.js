// only node.js

'use strict';

var x = require('./update.js')(console.log)
var assert = require('assert');

var g = {};

x.addNode(g, 'A', {});
x.addNode(g, 'B', {'A' : 1});
assert(g['A']['B'] == 1 && g['B']['A'] == 1);


x.updateEdge(g, 'A', 'B', 2);
assert(g['A']['B'] == 2 && g['B']['A'] == 2);

x.updateEdge(g, 'A', 'C', 3);
assert(g['A']['C'] == 3 && g['C']['A'] == 3);

x.deleteNode(g, 'A');

assert(!g['A'] && !g['C']['A'] && !g['B']['A']);

x.deleteNode(g, 'B');

console.log(g);

