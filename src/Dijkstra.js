/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:17:39
 * @version 1.2
 */

'use strict';

// Logger
function logger(type, text) {
  if (type === 'error') console.error('[error] ' + text);
  else if (type === 'info') console.log('[info] ' + text);
}

// Dijkstra
function Dijkstra(graph, source) {
  var _graph = graph;
  var _source = source;
  var _solver;

  // 有可能的话，初始化solver
  if (graph && source) {
    logger('info', 'Initializing solver.');
    initSolver();
  }

  // Setter and Getter
  this.setGraph = function (graph) {
    _graph = graph;
    _source = ''; // 清空source
  };
  this.getGraph = function () {
    return _graph;
  };
  this.setSource = function (source) {
    if (!_graph) { // 图为空
      logger('error', 'Empty graph. Please set graph first.');
      return false;
    }
    if (!(source in _graph)) { // source不在图中
      logger('error', 'Unknown source.');
      return false;
    }
    logger('info', 'source: ' + source);
    _source = source; // 设置source

    logger('info', 'Initializing solver.');
    initSolver(); // 初始化solver
    return true;
  };
  this.getSource = function () {
    return _source;
  };
  this.getResult = function () {
    if (!_solver) { // solver未初始化
      logger('error', 'Uninitialized solver.');
      return;
    }
    return _solver.getResult();
  };

  function initSolver() {
    if (!_graph) { // graph没有设置
      logger('error', 'Cannot init solver. Empty graph.');
      return false;
    }
    if (!_source) { // source没有设置
      logger('error', 'Cannot init solver. Empty source.');
      return false;
    }
    if (!(_source in _graph)) { // source不在图中
      logger('error', 'Unknown source. Please set a valid source.');
      return false;
    }

    _solver = new Solver(_graph, _source); // 创建solver
    logger('info', 'Solver initialized.');

    return true;
  }

  this.singleStepSolve = function () {
    if (!_solver) { // solver未初始化
      logger('error', 'Uninitialized solver.');
      return false;
    }

    return _solver.next();
  };

  this.solve = function () {
    if (!_solver) { // solver未初始化
      logger('error', 'Uninitialized solver.');
      return false;
    }

    return _solver.solve();
  };
}

// Dijkstra Solver
function Solver(graph, source) {
  if (!graph || !source) {
    logger('error', 'Empty graph or soruce.');
    return;
  }

  var __done = false;
  var __queue = [];
  var __queueIndex = 0;
  var __source = source;
  var __graph = graph;
  var __result = {};
  __queue.push(__source);

  init();

  // 初始化result标记
  function init() {
    for (var key in __graph) {
      __result[key] = {
        distance: Number.MAX_VALUE ? Number.MAX_VALUE : 1.7976931348623157e+308,
        path: []
      };
    }

    // source的距离
    __result[__source].distance = 0;
  }

  // 重置
  this.reset = function () {
    __done = false;
    __queue = [];
    __queueIndex = 0;
    __result = {};
    __queue.push(__source);

    init();
  };

  this.next = function () {
    if (__done) return true; // 已完成

    var node = __queue[__queueIndex++];
    for (var target in __graph[node]) {
      if (__queue.indexOf(target) === -1) __queue.push(target); // 未遍历，且还不在queue中
      else if (__queue.indexOf(target) < __queueIndex) continue; // 遍历过了

      if (__graph[node][target] + __result[node].distance < __result[target].distance) {
        __result[target].distance = __graph[node][target] + __result[node].distance;
        __result[target].path = __result[node].path.concat(node);
      }
    }

    if (__queue.length === __queueIndex) __done = true; // 刚完成

    return __done;
  };

  this.getResult = function () {
    return __result;
  };

  this.solve = function () {
    if (__done) return __result; // 已完成
    while (!this.next()) ; // 单步到底
    return __result;
  };
}
