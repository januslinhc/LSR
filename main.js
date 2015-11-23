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
