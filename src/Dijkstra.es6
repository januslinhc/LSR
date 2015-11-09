/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 01:21:20
 * @version 1.0
 */

'use strict';

function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

class Dijkstra {
  constructor(graph) {
    this[graph] = graph;

    this.init();
  }

  init() {
    this.result = {};
    for (let key in this[graph]) {
      this.result[key] = {
        distance: Number.MAX_VALUE,
        path: []
      };
    }
  }

  setGraph(graph) {
    this[graph] = graph;
  }

  getGraph(graph) {
    return this[graph];
  }

  setSource(source) {
    this[source] = source;
  }

  getSource(source) {
    return this[source];
  }

  printResult() {
    for (let entry of objectEntries(this.result)) {
      let node = entry[0];
      let distance = entry[1].distance;
      let path = entry[1].path;

      if (node === source) continue;

      let pathStr = '';
      for (let pathNode of path) {
        pathStr += (pathNode + ' > ');
      }
      pathStr += node;
      console.log(`${node}: ${pathStr}, ${distance}`);
    }
  }

  solve() {
    this.result[source].distance = 0;
    let visitedNodes = [source];
    while (visitedNodes.length !== 0) {
      let node = visitedNodes.shift();

      for (let target in graph[node]) {
        visitedNodes.push(target);

        if (graph[node][target] + this.result[node].distance < this.result[target].distance) {
          this.result[target].distance = graph[node][target] + this.result[node].distance; // 更新距离
          this.result[target].path = this.result[node].path.concat(node);
        }

        delete graph[target][node];
      }
    }
    this.printResult();
  }
}
