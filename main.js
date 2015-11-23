/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:03:20
 * @version 1.2
 */

'use strict';

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
    $('input.graph-related').on('graphEmpty', function (event) {
        $(this).attr('disabled', true);
    });
    $('button.graph-related').on('graphEmpty', function (event) {
        $(this).addClass('disabled');
    });
    $('button.source-related').on('source', function (event) {
        $(this).removeClass('disabled');
    });
    $('button.source-related').on('sourceEmpty', function (event) {
        $(this).addClass('disabled');
        needUpdate = false;
    });
    $('#graph-content.graph-related').on('graph', function (event) {
        this.innerText = prettyPrint(graph);
    });
    $('#graph-content.graph-related').on('graphUpdate', function (event) {
        needUpdate = true;

        // 清空现有的feedback输出
        feedbackOutput.innerText = '(Empty)';

        // 更新graph输出
        var graphStr = prettyPrint(graph);
        if (graphStr) {
            this.innerText = prettyPrint(graph);
        } else {
            $('.graph-related').trigger('graphEmpty');
        }
    });
    $('#graph-content.graph-related').on('graphEmpty', function (event) {
        this.innerText = '(Empty graph)';
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

    // Reset
    $('#reset-btn').click(function (event) {
        event.preventDefault();

        reset();
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

    function reset() {
        // 清空所有
        // 清空文件输入
        $('#input').val('');
        $('.graph-related').trigger('graphEmpty');

        // 清空source输入
        $('#source').val('');
        $('.source-related').trigger('sourceEmpty');

        // 清空feedback
        feedbackOutput.innerText = '(Empty)';

        // init
        graph = {};
        sourceName = '';
        problem = undefined;
        needUpdate = false;
    }

    function singleStep() {
        if (!problem.singleStep()) {
            // Done
            console.log('Done!');
            alert('Done!');
        }

        var result = problem.getResult();
        var resultStr = getResultStr(result);
        display(resultStr);
    }

    function compute() {
        var result = problem.solve();

        var resultStr = getResultStr(result);
        graphContetOutput.innerText = prettyPrint(graph);
        display(resultStr);
    }

    function display(text) {
        feedbackOutput.innerText = text;
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
            if (update.updateEdge(graph, srcVal, destVal, parseInt(weightVal))) {
                $('.graph-related').trigger('graphUpdate'); // 触发graph update事件
            }
        } else {
            display("error: you don't enter everything!");
        }

        // 清空输入
        $('#update-edge-src').val('');
        $('#update-edge-dest').val('');
        $('#update-edge-weight').val('');
    }

    function addNewNode() {
        var nodeIdVal = $('#add-new-node-id').val();

        if(nodeIdVal.length) {
            if (update.addNode(graph, nodeIdVal, {})) {
                $('.graph-related').trigger('graphUpdate');
            }
        } else {
            display("error: you don't enter everything!");
        }

        // 清空输入
        $('#add-new-node-id').val('');
    }

    function deleteNode() {
        var nodeIdVal = $('#delete-node-id').val();

        if (nodeIdVal.length) {
            if (update.deleteNode(graph, nodeIdVal)) { // 成功update
                $('.graph-related').trigger('graphUpdate');
                if (nodeIdVal === sourceName) {
                    // 清空source input
                    $('#source').val('');
                    $('.source-related').trigger('sourceEmpty');
                }
            }
        } else {
            display("error: you don't enter everything!");
        }

        // 清空输入
        $('#delete-node-id').val('');
    }

    function deleteEdge() {
        var srcVal = $('#delete-edge-src').val();
        var destVal = $('#delete-edge-dest').val();

        if(srcVal.length && destVal.length) {
            if (update.deleteEdge(graph, srcVal, destVal)) {
                $('.graph-related').trigger('graphUpdate');
                if (srcVal === sourceName || destVal == sourceName) {
                    // 清空source input
                    $('#source').val('');
                    $('.source-related').trigger('sourceEmpty');
                }
            }
        } else {
            display("error: you don't enter everything!");
        }

        // 清空输入
        $('#delete-edge-src').val('');
        $('#delete-edge-dest').val('');
    }

    // Helpers
    function prettyPrint(graph) {
        var str = "";
        for (var v in graph) {
            str += (v + ": ");
            for (var u in graph[v]) {
                if(u == v) continue;
                str += (u + ":" + graph[v][u] + " ");
            }
            str += "\n";
        }
        return str;
    }

    function getResultStr(result) {
        var retulrStr = '';

        for (var key in result) {
            var node = key;
            var distance = result[key].distance;
            var path = result[key].path;

            if (distance === Infinity) continue; // 不输出无法到达的点

            var pathStr = '';
            for (var i = 0; i < path.length; i++) {
                pathStr += (path[i] + ' > ');
            }
            pathStr += node;
            retulrStr += (node + ': ' + pathStr + ', ' + distance + '\n');
        }

        return retulrStr;
    }

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }
});
