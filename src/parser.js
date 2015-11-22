'use strict';

function readFile(fileInput, cb) {
    var file = fileInput.files[0];
    if (file) {
      if (file.name.endsWith('.lsa')) {
        var reader = new FileReader();

        reader.onload = function(e) {
          cb(reader.result);
        };

        reader.readAsText(file);
      } else {
        alert("File format not supported!");
      }
  }
}


function parseGraph(fileText) {
  var graph = {};
  var lines = fileText.split('\n');

  lines.forEach(function (line) {
    var segments = line.split(' ');
    if(segments.length > 0) {
      var thisNode = segments[0].match(/\S/g);
      if(thisNode) {
        var thisNodeName = thisNode[0];
        graph[thisNodeName] = {};
        segments.slice(1).forEach(function (seg) {
          var matched = seg.match(/\S:\d/g);
          if(matched) {
            var pair = matched[0].split(":");
            var anotherNodeName = pair[0];
            var weight = parseInt(pair[1]);
            graph[thisNodeName][anotherNodeName] = weight;
          }
        });
      }
    }
  });

  return graph;
}


