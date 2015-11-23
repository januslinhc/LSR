function renderVis(graph, svg) {
  var width = 960, height = 500;
  var color = d3.scale.category20();
  var force = d3.layout.force()
              .charge(-120)
              .linkDistance(30)
              .size([width, height]);

  var nodes = [], links = [];

  for(var u in graph) {
    nodes.push(u);
    for(var v in graph[u]) {
      links.push({ "source": { "name": u, "links": [] },
                   "target": { "name": v, "links": [] },
                   "value" : graph[u][v] });
    }
  }

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", 1);

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", "grey")
      .call(force.drag);

  link.each(function(d) {
      d.source.links.push(d);
      d.selection = d3.select(this);
  });

  node.each(function(d) {
      d.selection = d3.select(this);
  });


  node.append("title")
      .text(function(d) { return d.name; });

  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + d.value + " mi" });
  
  
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  var color = d3.scale.linear()
    .domain([0, 1000, 2500])
    .range(["green", "yellow", "red"]);
 };