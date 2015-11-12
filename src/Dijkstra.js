/**
 * 
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:17:39
 * @version 1.0
 */

'use strict';

function Dijkstra(graph) {
  var _graph = graph;
  var _source;
  var _result = {};

  this.setGraph = function (graph) {
    _graph = graph;
  };
  this.getGraph = function (graph) {
    return _graph;
  };
  this.setSource = function (source) {
    _source = source;
  };
  this.getSource = function (source) {
    return _source;
  };

  function init() {
    _result = {};
    for (var key in _graph) {
      _result[key] = {
        distance: Number.MAX_VALUE ? Number.MAX_VALUE : 1.7976931348623157e+308,
        path: []
      };
    }
  };

  this.printResult = function () {
    var ret = ""

    for (var key in _result) {
      var node = key;
      var distance = _result[key].distance;
      var path = _result[key].path;

      if (node === _source) continue; // 不输出source

      var pathStr = '';
      for (var i = 0; i < path.length; i++) {
        pathStr += (path[i] + ' > ');
      }
      pathStr += node;
      ret = ret + node + ': ' + pathStr + ', ' + distance;
    }

    return ret;
  };

  this.solve = function () {
    // 初始化标记
    init();

    _result[_source].distance = 0;
    var queue = [source];
    while (queue.length !== 0) {
      var node = queue.shift();

      for (var target in _graph[node]) {
        queue.push(target);

        if (_graph[node][target] + _result[node].distance < _result[target].distance) {
          _result[target].distance = _graph[node][target] + _result[node].distance;
          _result[target].path = _result[node].path.concat(node);
        };

        delete _graph[target][node];
      }
    }
  };
};
