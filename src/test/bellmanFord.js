// Credit: https://github.com/devenbhooshan/graph.js/blob/master/src/algorithms/shortest_path.js

module.exports = bellman_ford;

function bellman_ford(graph,source,destination){
    this.previousNode=[];
    this.distance=new Array();              
    this.distance[source.name]=0;
    var nodes=graph.getAllNodes();
    length=nodes.length;
    for(var i=0;i<length;i++){
        if(nodes[i]!=source){
            this.distance[nodes[i].name]=Number.POSITIVE_INFINITY;
        }
    }
    
    for(var k=0;k<length;k++){
        for(var j=0;j<length;j++){
            u=nodes[j];
            adjList=u.adjList;
            for (var i = 0; i < adjList.length; i++) {
                v=adjList[i];
                if(this.distance[u.name]!=Number.POSITIVE_INFINITY){    
                    alt=this.distance[u.name]+u.weight[i];
                    if(alt<this.distance[v.name]){

                        this.previousNode[v.name]=u.name;
                        this.distance[v.name]=alt;
                    }
                }
            }
        }
    }

    for(var j=0;j<length;j++){
        u=nodes[j];
        adjList=u.adjList;
        for (var i = 0; i < adjList.length; i++) {
            v=adjList[i];
            if(this.distance[u.name]!=Number.POSITIVE_INFINITY){    
                alt=this.distance[u.name]+u.weight[i];
                if(alt<this.distance[v.name]){
                    return null;
                }
            }
        }
    }
    
    return this.distance[destination.name]; 

}

