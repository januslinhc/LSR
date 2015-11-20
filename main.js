/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:03:20
 * @version 1.2
 */

var graph = {};

function display(text) {
    document.getElementById('feedback').innerText = text;
}

function compute() {
    var sourceInput = document.getElementById("source");
    var fileInput = document.getElementById('input');

    if (fileInput.files.length > 0 && sourceInput.value != "") {
        readFile(fileInput, function(text) {
            document.getElementById('file-content').innerText = text;
            graph = parseGraph(text);
            var source = sourceInput.value;
            console.log(source, graph);
            render(graph, source);
        });
    } else {
        display("Input is empty");
    }
}


function render(graph, source) {
    var problem = new Dijkstra(graph);
    problem.setSource(source);
    problem.solve();
    problem.printResult();

    var result = problem.getResultStr();
    display(result);
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
        display("error: you don't enter everything!")
    }
}

function addNewNode() {
    var nodeId = document.getElementById('add-new-node-id').value;
    var source = document.getElementById("source").value;

    if(nodeId.length & source.length) {
        update.addNode(graph, nodeId, {})
        render(graph, source);
    } else {
        display("error: you don't enter everything!")
    }
}

function deleteNode() {
    var nodeId = document.getElementById('delete-node-id').value;
    var source = document.getElementById("source").value;

    if(nodeId.length & source.length) {
        update.deleteNode(graph, nodeId);
        render(graph, source);
    } else {
        display("error: you don't enter everything!")
    }
}

