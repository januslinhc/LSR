/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:17:39
 * @version 1.2
 */

'use strict';

// 前方高能 node.js only
// var window = {}; // Fake window
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
    var _result = {};
    var _unvisited = [];
    var _current;

    // Constructor
    var _source = source;
    var _graph = graph;
    _current = _source;

    init();

    // 初始化result标记
    function init() {
      for (var key in _graph) {
        if (key !== _source) _unvisited.push(key);

        _result[key] = {
          distance: Infinity,
          path: []
        };
      }

      // source的距离
      _result[_source].distance = 0;
    }

    // 重置
    this.reset = function () {
      _done = false;
      _result = {};
      _unvisited = [];
      _current = _source;

      init();
    };

    // 返回值表示是否可以继续下一步
    this.next = function () {
      if (_done) return false; // 已完成

      for (var target in _graph[_current]) {
        var alt = _graph[_current][target] + _result[_current].distance;
        if (alt < _result[target].distance) {
          _result[target].distance = alt;
          _result[target].path = _result[_current].path.concat(_current);
        }
      }

      _unvisited.sort(function (a, b) {
        return _result[b].distance - _result[a].distance;
      });

      if (_unvisited.length === 0 || _result[_current].distance === Infinity) {
        _done = true; // 刚完成
        return false;
      }

      _current = _unvisited.pop();

      return true;
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
// module.exports = window.Dijkstra;
// 前方高能 node.js only
