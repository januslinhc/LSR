/**
 *
 * @authors Tom Hu (h1994st@gmail.com)
 * @date    2015-11-09 12:03:20
 * @version 1.0
 */

var problem = new Dijkstra(graph);
problem.setSource(source);
problem.solve();
problem.printResult();
