
// Highlight the edges from the node to the source node
function highlightPath(node) {
    let ed = undefined;
    if(node.path.dist === Infinity){
        alert("There is no path to that node");
        return;
    }
    while (node !== GOLD) {
        for (let k = 0; k < node.Edges.length; k++) {
            if (node.Edges[k].e === node.path.last) {
                ed = node.Edges[k];
                ed.selected = true;


                for (let j = 0; j < ed.e.Edges.length; j++) {
                    if (ed.e.Edges[j].e === node) {
                        node.Edges[k].e.Edges[j].selected = true;
                    }
                }

                node = node.Edges[k].e;
            }


        }
    }
}

// Clears all the highlited path.
function erasePath(node) {
    for (let x = 0; x < Graph.length; x++) {
        for (let i = 0; i < Graph[x].Edges.length; i++) {
            let ed = Graph[x].Edges[i].selected = false;
        }
    }
}

// Find the node with the least cost/dist
function minUnvisited(queue) {
    let temp = queue.reduce((prev, curr) => prev.path.dist < curr.path.dist ? prev : curr);
    queue.splice(queue.indexOf(temp), 1);
    return temp;
}

// Resets the graph's weighs 
function resetGraph(src){
    for (let k = 0; k < Graph.length; k++) {
        Graph[k].path = { dist: Infinity, last: undefined };
        Q.push(Graph[k]);
    }
    src.path = { dist: 0, last: src };
}

// Dijkstra's shortest path algorithm
function dijkstra(src) {
    let Q = [];
    let S = [];
    
    resetGraph(src);

    while (Q.length !== 0) {
        let curr = minUnvisited(Q);
        S.push(curr);

        for (let k = 0; k < curr.Edges.length; k++) {
            if (curr.path.dist + curr.Edges[k].cost
                < curr.Edges[k].e.path.dist) {
                curr.Edges[k].e.path.dist
                    = curr.path.dist + curr.Edges[k].cost;
                curr.Edges[k].e.path.last = curr;
            }
        }
    }
    let temp = "";
    for (let k = 0; k < Graph.length; k++) { temp += (Graph.indexOf(Graph[k]) + "---->" + Graph.indexOf(Graph[k].path.last)) + "\n" }
    //console.log(temp);
}

function heuristics(k, m){
    return distance(k, m);
}

// A* shortest path algorithm
function astar(src, goal) {
    let open_list = []
    let close_list = []

    resetGraph(src);

    open_list.push(src);
    let curr_node = undefined;

    while(curr_node !== goal){
        curr_node = minUnvisited(open_list);
        close_list.push(curr_node);
        if(curr_node === goal){
            break;
        }else{
            close_list.push(curr_node);
            
        }
            
    }
}

// Bellman-ford algorithm 
function bellmanford(src){

}


// Prim's MST algorithm 
function prim(src){
    
}


// kruskel's MST algorithm 
function kruskel(src){
    
}
