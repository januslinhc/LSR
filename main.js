/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:03:20
 * @version 1.2
 */

$(document).ready(function() {
    var graph = {};
    var sourceName;

    // Page elements
    var sourceInput = document.getElementById("source");
    var fileInput = document.getElementById('input');
    var graphContetOutput = document.getElementById('graph-content');
    var feedbackOutput = document.getElementById('feedback');

    $('#input').change(function (event) {
        if (this.files.length > 0) {
            readFile(this, function (text) {
                graphContetOutput.innerText = text; // 显示文件
                graph = parseGraph(text);
                console.log(graph);
            });

            $('#source').attr('disabled', false); // 允许输入source
        } else {
            display("Input is empty");
        }
    });

    // Compute
    $('#compute-all-btn').click(function (event) {
        event.preventDefault();

        compute();
    });

    // Single Step
    $('#single-step-btn').click(function (event) {
        event.preventDefault();

        singleStep();
    });

    // Add / Update Edge
    $('#update-edge-btn').click(function (event) {
        event.preventDefault();

        updateEdge();
    });

    // Add New Node
    $('#add-new-node-btn').click(function (event) {
        event.preventDefault();

        addNewNode();
    });

    // Delete Old Node
    $('#delete-node-btn').click(function (event) {
        event.preventDefault();

        deleteNode();
    });

    // Delete Edge
    $('#delete-edge-btn').click(function (event) {
        event.preventDefault();

        deleteEdge();
    });

    function singleStep() {

    }

    function compute() {
        if (fileInput.files.length > 0 && sourceInput.value !== "") {
            readFile(fileInput, function(text) {
                graph = parseGraph(text);
                graphContetOutput.innerText = prettyPrint(graph);
                var source = sourceInput.value;
                console.log(source, graph);
                render(graph, source);
            });
        } else {
            display("Input is empty");
        }
    }

    function display(text) {
        feedbackOutput.innerText = text;
    }

    function getResultStr(result) {
        var retulrStr = '';

        for (var key in result) {
            var node = key;
            var distance = result[key].distance;
            var path = result[key].path;

            if (distance === Number.MAX_VALUE || distance === 1.7976931348623157e+308) continue; // 不输出无法到达的点

            var pathStr = '';
            for (var i = 0; i < path.length; i++) {
            pathStr += (path[i] + ' > ');
            }
            pathStr += node;
            retulrStr += (node + ': ' + pathStr + ', ' + distance + '\n');
        }

        return retulrStr;
    }

    function render(graph, source) {
        var problem = new Dijkstra(graph, source);
        var result = problem.solve();

        var resultStr = getResultStr(result);
        graphContetOutput.innerText = prettyPrint(graph);
        display(resultStr);
    }

    // Example of using update.js
    // load update.js before this

    var update = updateExport(display);

    // Re-export
    function updateEdge() {
        var src = document.getElementById('update-edge-src').value;
        var dest = document.getElementById('update-edge-dest').value;
        var weight = document.getElementById('update-edge-weight').value;
        var source = document.getElementById("source").value;

        if(src.length && dest.length && weight.length && source.length) {
            update.updateEdge(graph, src, dest, parseInt(weight));
            render(graph, source);
        } else {
            display("error: you don't enter everything!");
        }
    }

    function addNewNode() {
        var nodeId = document.getElementById('add-new-node-id').value;
        var source = document.getElementById("source").value;

        if(nodeId.length && source.length) {
            update.addNode(graph, nodeId, {});
            render(graph, source);
        } else {
            display("error: you don't enter everything!");
        }
    }

    function deleteNode() {
        var nodeId = document.getElementById('delete-node-id').value;
        var source = document.getElementById("source").value;

        if(nodeId.length && source.length) {
            update.deleteNode(graph, nodeId);
            render(graph, source);
        } else {
            display("error: you don't enter everything!");
        }
    }

    function deleteEdge() {
        var src = document.getElementById('delete-edge-src').value;
        var dest = document.getElementById('delete-edge-dest').value;
        var source = document.getElementById("source").value;

        if(src.length && dest.length && source.length) {
            update.deleteEdge(graph, src, dest);
            render(graph, source);
        } else {
            display("error: you don't enter everything!");
        }
    }

    function prettyPrint(graph) {
        var str = "";
        for(var v in graph) {
            str += (v + ": ");
            for(var u in graph[v]) {
                if(u == v) continue;
                str += (u + ":" + graph[v][u] + " ");
            }
            str += "\n";
        }
        return str;
    }
});
