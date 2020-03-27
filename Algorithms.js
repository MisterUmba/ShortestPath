
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
function resetGraph(src, Q){
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
    
    resetGraph(src, Q);

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


// A* shortest path algorithm
function astar(src, goal) {
    console.log(src);
    if(goal === undefined) return;
    let open_list = []
    let close_list = []
    
    for (let k = 0; k < Graph.length; k++) {
        Graph[k].path = {gScore: Infinity, dist: Infinity, last: undefined };
    }
    src.path = {gScore: 0, dist: 0, last: src };

    open_list.push(src);

    while(open_list.length !== 0 ){
        let curr_node = minUnvisited(open_list);
        console.log(curr_node, Graph.indexOf(curr_node));
        close_list.push(curr_node);
        
        if(curr_node === goal){
            break;
        }
        
        for(let x = 0; x < curr_node.Edges.length; x++){
            let score = curr_node.path.gScore + curr_node.Edges[x].cost;
            if(score < curr_node.Edges[x].e.path.gScore){
                curr_node.Edges[x].e.path.last = curr_node;
                curr_node.Edges[x].e.path.gScore = score;
                curr_node.Edges[x].e.path.dist = score + distance(curr_node, goal);
                
                if(!close_list.includes(curr_node.Edges[x].e)){
                    open_list.push(curr_node.Edges[x].e);
                }
            }
        }

    }

    let temp = "";
    for(let x = 0; x < Graph.length; x++) temp += `${x} --> ${Graph.indexOf(Graph[x].path.last)} \n`;
    //console.log(temp);
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
