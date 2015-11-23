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
        if(isEmpty(graph)) {
            var fileInput = document.getElementById('input');

            if (fileInput.files.length > 0) {
                readFile(fileInput, function(text) {
                    graph = parseGraph(text);
                    document.getElementById('graph-content').innerText = prettyPrint(graph);
                    console.log(graph);
                    render(graph);
                });
            } else {
                display("Input is empty");
            }
        } else {
            render(graph);
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

    function render(graph) {
        var source = $('#source').val();
        if(source.length) {
            var problem = new Dijkstra(graph, source);
            var result = problem.solve();
    
            var resultStr = getResultStr(result);
            graphContetOutput.innerText = prettyPrint(graph)
            display(resultStr);
        } else {
            display("error: source is empty");
        }
    }

    // Example of using update.js
    // load update.js before this

    var update = updateExport(display);

    // Re-export
    function updateEdge() {
        var srcVal = $('#update-edge-src').val();
        var destVal = $('#update-edge-dest').val();
        var weightVal = $('#update-edge-weight').val();

        if(srcVal.length && destVal.length && weightVal.length) {
            update.updateEdge(graph, srcVal, destVal, parseInt(weightVal));
            render(graph);
        } else {
            display("error: you don't enter everything!");
        }
        $('#update-edge-src').val('');
        $('#update-edge-dest').val('');
        $('#update-edge-weight').val('');
    }

    function addNewNode() {
        var nodeIdVal = $('#add-new-node-id').val();

        if(nodeIdVal.length) {
            update.addNode(graph, nodeIdVal, {});
            render(graph);
        } else {
            display("error: you don't enter everything!");
        }

        $('#add-new-node-id').val('');
    }

    function deleteNode() {
        var nodeIdVal = $('#delete-node-id').val();

        if(nodeIdVal.length) {
            update.deleteNode(graph, nodeIdVal);
            render(graph);
        } else {
            display("error: you don't enter everything!");
        }

        $('#delete-node-id').val('');
    }

    function deleteEdge() {
        var srcVal = $('#delete-edge-src').val();
        var destVal = $('#delete-edge-dest').val();

        if(srcVal.length && destVal.length) {
            update.deleteEdge(graph, srcVal, destVal);
            render(graph);
        } else {
            display("error: you don't enter everything!");
        }
        $('#delete-edge-src').val('');
        $('#delete-edge-dest').val('');
    }

    // Helpers

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

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }
});
