/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:17:39
 * @version 1.2
 */

'use strict';

// 前方高能 node.js only
var window = {}; // Fake window
// 前方高能 node.js only


(function (_window) {
  // Logger
  function logger(type, text) {
    if (type === 'error') console.error('[error] ' + text);
    else if (type === 'info') console.log('[info] ' + text);
  }

  // Dijkstra
  _window.Dijkstra = function (graph, source) {
    var _graph = graph;
    var _source = source;
    var _solver;

    // Setter and Getter
    this.setGraph = function (graph) {
      if (!_graph) { // 图为空
        logger('error', 'Empty argument.');
        return false;
      }
      _graph = graph;
      _source = ''; // 清空source
      _solver = undefined; // 清除老的solver
      return true;
    };
    this.getGraph = function () {
      return _graph;
    };
    this.setSource = function (source) {
      if (!_graph) { // 图为空
        logger('error', 'Empty graph. Please set graph first.');
        return false;
      }
      if (!source) {
        logger('error', 'Empty argument.');
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

    // 有可能的话，设置source
    if (graph && source) {
      this.setSource(source); // 其中有handle error的部分
    }

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

      _solver = new DijkstraSolver(_graph, _source); // 创建solver
      logger('info', 'Solver initialized.');

      return true;
    }

    this.singleStep = function () {
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
  };

  // Dijkstra Solver
  function DijkstraSolver(graph, source) {
    if (!graph || !source) {
      logger('error', 'Empty graph or soruce.');
      return;
    }

    // Default Values
    var _done = false;
    var _queue = [];
    var _queueIndex = 0;
    var _result = {};

    // Constructor
    var _source = source;
    var _graph = graph;
    _queue.push(_source);

    init();

    // 初始化result标记
    function init() {
      for (var key in _graph) {
        _result[key] = {
          distance: Number.MAX_VALUE ? Number.MAX_VALUE : 1.7976931348623157e+308,
          path: []
        };
      }

      // source的距离
      _result[_source].distance = 0;
    }

    // 重置
    this.reset = function () {
      _done = false;
      _queue = [];
      _queueIndex = 0;
      _result = {};
      _queue.push(_source);

      init();
    };

    // 返回值表示是否可以继续下一步
    this.next = function () {
      if (_done) return false; // 已完成

      var node = _queue[_queueIndex++];
      for (var target in _graph[node]) {
        if (_queue.indexOf(target) === -1) _queue.push(target); // 未遍历，且还不在queue中
        else if (_queue.indexOf(target) < _queueIndex) continue; // 遍历过了

        if (_graph[node][target] + _result[node].distance < _result[target].distance) {
          _result[target].distance = _graph[node][target] + _result[node].distance;
          _result[target].path = _result[node].path.concat(node);
        }
      }

      if (_queue.length === _queueIndex) _done = true; // 刚完成

      return !_done;
    };

    this.getResult = function () {
      return _result;
    };

    this.solve = function () {
      if (_done) return _result; // 已完成
      while (this.next()) ; // 单步到底
      return _result;
    };
  }
})(window);

// 前方高能 node.js only
module.exports = window.Dijkstra;
// 前方高能 node.js only
