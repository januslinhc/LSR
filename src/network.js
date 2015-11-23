/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-24 04:13:03
 * @version 1.0
 */

(function (_window) {
  var nodes = [];
  var links = [];
  var visited = [];
  var minDistance = Infinity;
  var maxDistance = 0;
  var svg;

  var _graph;
  var _cycleNodes;

  _window.removeGraphVisulazation = function () {
    svg.remove();
    minDistance = Infinity;
    maxDistance = 0;
    nodes = [];
    links = [];
    visited = [];
  };

  _window.updateGraphVisulazation = function (result) {
    for (var v in result) {
      var dist = result[v].distance;
      if (dist === Infinity) continue;

      minDistance = Math.min(minDistance, dist);
      maxDistance = Math.max(maxDistance, dist);
    }

     var color = d3.scale.linear()
      .domain([minDistance, (minDistance + maxDistance) / 2, maxDistance])
      .range(["green", "yellow", "red"]);

    _cycleNodes.style("fill", function(d) {
      var dist = result[d.name].distance;
      if (dist !== Infinity) {
        return color(dist);
      }
      return "gray";
    });
  };

  _window.createGraphVisulazation = function (graph, width, height) {
    if (svg) removeGraphVisulazation();

    _graph = graph;
    svg = d3.select("#network-visulization").append("svg")
                .attr("width", width)
                .attr("height", height);

    var nodeIndex = {};
    var i = 0;
    for (var vertex in graph) {
      nodeIndex[vertex] = i++;
    }

    var force = d3.layout.force()
                  .charge(-120)
                  .linkDistance(100)
                  .size([width, height]);

    for (var v in graph) {
      visited[v] = true;
      var node = {
        'name': v,
        'links': []
      };
      nodes.push(node);
      for (var u in graph[v]) {
        if (u in visited) continue;

        links.push({
          'source': nodeIndex[u],
          'target': nodeIndex[v],
          'value': graph[u][v]
        });
      }
    }

    force.nodes(nodes)
         .links(links)
         .start();

    var link = svg.selectAll(".link")
                  .data(links)
                  .enter()
                  .append("line")
                  .attr("class", "link")
                  .style("stroke-width", 1);

    var node = svg.selectAll(".node")
                  .data(nodes)
                  .enter()
                  .append("g")
                  .attr("class", "node")
                  .call(force.drag);

    _cycleNodes = node.append("circle")
        .attr("r", 14)
        .style("fill", "gray");

    node.append('text')
        .style("text-anchor", "middle")
        .text(function (d) {
          return d.name;
        });

    link.each(function (d) {
        d.source.links.push(d);
        d.selection = d3.select(this);
    });

    node.each(function (d) {
        d.selection = d3.select(this);
    });

    link.append("title")
        .text(function (d) {
          return d.source.name + " → " + d.target.name + ": " + d.value;
        });

    force.on("tick", function () {
      link.attr("x1", function (d) { return d.source.x; })
          .attr("y1", function (d) { return d.source.y; })
          .attr("x2", function (d) { return d.target.x; })
          .attr("y2", function (d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });

    node.on("mouseover", function (d) {
        d3.select(this)
          .selectAll('circle')
          .attr("r", 18);

        d.links.forEach(function (l) {
          l.selection
           .style("stroke-width", 10);
          l.target.selection
           .attr("r", 16);
        });
    });

    node.on("mouseout", function (d) {
        node.selectAll('circle').attr("r", 14);
        link.style("stroke-width", 1);
    });

    link.on("mouseover", function () {
        d3.select(this)
          .style("stroke-width", 1);
    });

    link.on("mouseout", function () {
        d3.select(this)
          .style("stroke-width", 1);
    });
  };
})(window);
