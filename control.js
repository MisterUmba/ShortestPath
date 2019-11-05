"use strict";

let EDGINGNODE = undefined;
let GOLD = undefined;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function nodeAt(x, y) {
    for (let i = Graph.length - 1; i >= 0; i--) {
        let n = Graph[i];
        let d = Math.pow(x - n.x, 2) + Math.pow(y - n.y, 2);

        if (d <= (Math.pow(radius, 2))) {
            return n;
        }
    }

    return undefined;
}

function deleteEdgesToMe(node) {
    let index = undefined;
    for (let i = 0; i < node.Edges.length; i++) {
        let other = node.Edges[i].e;
        for (let j = 0; j < other.Edges.length; j++) {
            if (other.Edges[j].e === node) {
                other.Edges.splice(j, 1);
            }
        }
    }
}

function removeAllSelected() {
    let selected = [];
    for (let i = 0; i < Graph.length; i++) {
        if (Graph[i].selected)
            selected.push(Graph[i]);
    }

    for (let i = 0; i < selected.length; i++) {
        deleteEdgesToMe(selected[i]);
        selected[i].Edges = [];
        let pos = Graph.indexOf(selected[i]);
        Graph.splice(pos, 1);
    }
}

document.addEventListener("keydown", function (ev) {
    if (ev.code === "Delete") {
        removeAllSelected();
    }
});

function connectNodes(node1, node2) {
    let ed = new Edge(node1, node2);
    let a = Math.abs(node1.x - node2.x);
    let b = Math.abs(node1.y - node2.y);

    let cost = Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
    ed.cost = cost;
    node1.addEdge(ed);

    let ed1 = new Edge(node2, node1);
    ed1.cost = cost;
    node2.addEdge(ed1);
}

document.addEventListener("mousedown", function (ev) {
    let pos = getMousePos(canvas, ev);
    EDGINGNODE = nodeAt(pos.x, pos.y);
});

function highlightPath(node){
    while(node.path.last !== node){
        
        let temp = undefined;
        for(let k = 0; k < node.Edges.length; k ++){
            if(node.Edges[k].e === node.path.last){
                node.Edges[k].selected = true;
                console.log(node.Edges[k].cost +""+node.Edges[k].selected);
                temp = node.Edges[k].e;
                
            }
        }
        if(temp !== undefined)
            node = temp;
    }
}

function erasePath(node){
    console.log("erase");
}

document.addEventListener("mouseup", function (ev) {
    if (ev.target === canvas && ev.which === 1) {
        let p = getMousePos(canvas, ev);

        let temp = nodeAt(p.x, p.y);
        if (EDGINGNODE !== undefined && temp != undefined && EDGINGNODE !== temp) {
            connectNodes(EDGINGNODE, temp);
        } else if (temp !== undefined) {
            if (temp.selected) {
                temp.selected = false;
                if(GOLD !== undefined) erasePath(temp);
            } else {
                if(GOLD !== undefined) highlightPath(temp);
                temp.selected = true;
            }

        } else {
            Graph.push(new Node(p.x, p.y));
        }
    }
});

function minUnvisited(node){
    let endNodes = [];
    for(let k = 0; k < node.Edges.length; k++)
        endNodes.push(node.Edges[k].e);
    for(let k = 0; k < node.Edges.length; k++)
        if(node.Edges[k].e.path.visited){
            endNodes.splice(endNodes.indexOf(node.Edges[k].e), 1);
        }

    if(endNodes.length == 0) return undefined;
    let min = Infinity;
    let ans = undefined;
    for(let k = 0; k < endNodes.length; k++){
        if(endNodes[k].path.distance < min){
            min = endNodes[k].path.distance;
            ans = endNodes[k];
        }
    }

    return ans;
}

function shortestPath(src) {
    if (src.Edges.length === 0)
        return;

    for (let k = 0; k < Graph.length; k++) {
        Graph[k].visited = false;
        if (Graph[k] === src) {
            Graph[k].path = { distance: 0, last: src };
        } else {
            Graph[k].path = { distance: Infinity, last: undefined };
        }
    }

    while (src !== undefined) {
        for (let k = 0; k < src.Edges.length; k++) {
            if(src.Edges[k].cost + src.path.distance <=
                src.Edges[k].e.path.distance){
                    src.Edges[k].e.path.distance = src.Edges[k].cost 
                    + src.path.distance;
                    src.Edges[k].e.path.last = src;
                }
        }

        src.path.visited = true;

        src = minUnvisited(src);
    }

}

document.addEventListener("dblclick", function(ev){
    let pos = getMousePos(canvas, ev);
    
    let node = nodeAt(pos.x, pos.y);
    for(let k = 0; k < Graph.length; k ++)
        Graph[k].start = false;
    
    if(GOLD === node){
        GOLD = undefined;
        return;
    }
    
    node.start = true;

    shortestPath(node);
    GOLD = node;
})


setInterval(draw, 1000 / 15); 