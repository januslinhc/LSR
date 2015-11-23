/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:03:20
 * @version 1.2
 */

$(document).ready(function() {
    var graph = {};
    var sourceName;
    var problem;
    var needUpdate = false;

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

                needUpdate = true;

                $('#source').val('');
                $('.source-related').trigger('sourceEmpty');

                $('.graph-related').trigger('graph'); // Trigger event
            });
        } else {
            display("Input is empty");

            $('.graph-related').trigger('graphEmpty');
        }
    });

    $('#source').bind("propertychange change click keyup input paste", function (event) {
      // If value has changed...
      if ($(this).data('oldVal') != $(this).val()) {
       // Updated stored value
       $(this).data('oldVal', $(this).val());

       $(this).trigger('myChange');
     }
   });

    $('#source').on('myChange', function (event) {
        var content = this.value;
        console.log(content);

        sourceName = content;

        if (content) {
            needUpdate = true;

            $('.source-related').trigger('source');
        } else {
            needUpdate = false;

            $('.source-related').trigger('sourceEmpty');
        }
    });

    // Add event listeners
    $('input.graph-related').on('graph', function (event) {
        $(this).attr('disabled', false);
    });
    $('button.graph-related').on('graph', function (event) {
        $(this).removeClass('disabled');
    });
    $('input.graph-related').on('graphEmpth', function (event) {
        $(this).attr('disabled', true);
    });
    $('button.graph-related').on('graphEmpth', function (event) {
        $(this).addClass('disabled');
    });
    $('button.source-related').on('source', function (event) {
        $(this).removeClass('disabled');
    });
    $('button.source-related').on('sourceEmpty', function (event) {
        $(this).addClass('disabled');
    });

    // Compute
    $('#compute-all-btn').click(function (event) {
        event.preventDefault();

        initDijkstraProblem();

        compute();
    });

    // Single Step
    $('#single-step-btn').click(function (event) {
        event.preventDefault();

        initDijkstraProblem();

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

    function initDijkstraProblem() {
        if (needUpdate) {
            problem = new Dijkstra(graph, sourceName);
            needUpdate = false;
        }
    }

    function singleStep() {
        if (!problem.singleStep()) {
            // Done
            console.log('Done!');
        }

        var result = problem.getResult();
        var resultStr = getResultStr(result);
        display(resultStr);
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
