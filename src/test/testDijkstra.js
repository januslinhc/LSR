// node.js only
var testUtil = require('./testUtil.js');
var bellmanFord = require('./bellmanFord.js');
var Dijkstra = require('../Dijkstra.js');

function main() {
    test();
}

function test() {
    var gns = generateGraphWithSource();
    var problem = new Dijkstra(gns.graph, gns.source);
    var map = problem.solve();

    console.log(gns);

    console.log(map);

    console.log(bellmanFord(gns.graph, gns.source));

    // return result;
}

function generateGraphWithSource() {
    var graph = {};

    var numVertices = 10;
    var MAX_WEIGHT = 10;
    var vertices = [];

    // Generate 100 vertices
    for(var i = 0; i < numVertices; i++) {
        var v = testUtil.randomString(3);
        graph[v] = {};
        vertices.push(v);
    }

    numVertices = vertices.length;
    var numEdges = 30;
    // Connect them randomly
    for(var i = 0; i < numEdges; i++){
        var v = vertices[testUtil.randomInt(0, numVertices)];
        var u = vertices[testUtil.randomInt(0, numVertices)];
        if(v != u) {
            var weight = testUtil.randomInt(0, MAX_WEIGHT);
            graph[v][u] = weight;
            graph[u][v] = weight;
        }
    }

    return {
        graph: graph,
        source: vertices[testUtil.randomInt(0, numVertices)]
    }
}

main();

