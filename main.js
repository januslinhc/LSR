/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:03:20
 * @version 1.0
 */

function compute() {
    var sourceInput = document.getElementById("source");
    var fileInput = document.getElementById('input');
    var feedback = document.getElementById('feedback');

    if (fileInput.files.length > 0 && sourceInput.value != "") {
        readFile(fileInput, function(text) {
            var graph = parseGraph(text);
            var source = sourceInput.value;
            console.log(source, graph);
            var problem = new Dijkstra(graph);
            problem.setSource(source);
            problem.solve();
            var result = problem.printResult();
            feedback.innerText = result;
        });
    } else {
        feedback.innerText = "Input is empty"
    }
}