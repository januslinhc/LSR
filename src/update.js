'use strict';

// If src is not defined, feedback error
// If such edge doesn't exist, new edge will be created, feedback log

// //// for node.js //////
// var display = undefined;
// module.exports = updateExport;
// //// for node.js //////

function updateExport (display) {

    function updateEdge(graph, src, dest, weight) {
        if(graph[src]){
            if(!graph[src][dest]) {
                display("log: new edge is added");
            }
            if(!graph[dest]) {
                graph[dest] = {};
            }
            graph[src][dest] = weight;
            graph[dest][src] = weight;
        } else {
            display("error: invalid source point " + src);
        }
    }

    // If node exists, or any to-node in map is not defined, feedback error
    function addNode(graph, node, map) {
        if(graph[node]) {
            display("error: node exists");
        } else {
            var everyKeyExists = Object.keys(map).every(function(x) {
                return graph[x] !== undefined;
            });

            if(everyKeyExists){
                graph[node] = map;
                for (var k in map) {
                    var weight = map[k];
                    graph[k][node] = weight;
                }
            } else {
                display("error: Some to-node doesn't exists");
            }
        }
    }

    // If such node doesn't exist, feedback warning
    function deleteNode(graph, node) {
        if(graph[node]) {
            delete graph[node];
            for (var u in graph) {
                delete graph[u][node];
            }
        } else {
            display("warning: doesn't delete since it doesn't exist at all");
        }
    }


    return {
        updateEdge : updateEdge,
        addNode    : addNode,
        deleteNode : deleteNode
    };
}
