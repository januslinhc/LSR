/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:42:55
 * @version $Id$
 */

'use strict';

// Input - for testing
var graph = {};
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
var source = 'A';
