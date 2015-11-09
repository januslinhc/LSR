/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 11:41:08
 * @version 1.0
 */

'use strict';

// Input - for testing
let graph = {};
graph['A'] = {
  'B': 4,
  'C': 1
};
graph['B'] = {
  'A': 4,
  'C': 4,
  'D': 6
};
graph['C'] = {
  'A': 1,
  'B': 4,
  'D': 2,
  'E': 7
};
graph['D'] = {
  'B': 6,
  'C': 2,
  'F': 12
};
graph['E'] = {
  'C': 7,
  'F': 1
};
graph['F'] = {
  'D': 12,
  'E': 1
};
let source = 'A';

export {graph, source};
