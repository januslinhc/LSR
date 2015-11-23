module.exports = bellmanFord;

function bellmanFord(graph, source) {
    var distance = {};
    var vertices = [];
    var predecessor = {};

    for (var v in graph) {
        distance[v] = Number.POSITIVE_INFINITY;
        vertices.push(v);
    }
    
    distance[source] = 0;

    
    for(var i = 1; i < vertices.length; i++) {
        for(var u in graph) {
            for(var v in graph) {
                var w = graph[u][v];
                if(distance[u] + w < distance[v]) {
                    distance[v] = distance[u] + w;
                    predecessor[v] = u;
                }
            }
        }
    }

    return {
        distance: distance,
        predecessor: predecessor
    };
}

