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

function highlightPath(node) {
    let ed = undefined;
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

function erasePath(node) {
    for (let x = 0; x < Graph.length; x++) {
        for (let i = 0; i < Graph[x].Edges.length; i++) {
            let ed = Graph[x].Edges[i].selected = false;
        }
    }
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
                if (GOLD !== undefined) erasePath(temp);
            } else {
                temp.selected = true;
                if (GOLD !== undefined) highlightPath(temp);
            }

        } else {
            Graph.push(new Node(p.x, p.y));
        }
    }
});

function minUnvisited(queue) {
    let temp = queue.reduce((prev, curr) => prev.path.dist < curr.path.dist ? prev : curr);
    queue.splice(queue.indexOf(temp), 1);
    return temp;
}

function shortestPath(src) {
    let Q = [];
    let S = [];
    for (let k = 0; k < Graph.length; k++) {
        Graph[k].path = { dist: Infinity, last: undefined };
        Q.push(Graph[k]);
    }
    src.path = { dist: 0, last: src };

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
    for (let k = 0; k < Graph.length; k++) { console.log(Graph.indexOf(Graph[k]) + "---->" + Graph.indexOf(Graph[k].path.last)) }
}

document.addEventListener("dblclick", function (ev) {
    let pos = getMousePos(canvas, ev);

    let node = nodeAt(pos.x, pos.y);
    for (let k = 0; k < Graph.length; k++) {
        Graph[k].start = false;
        GOLD = undefined;
    }

    GOLD = node;
    node.start = true;
    shortestPath(GOLD);
})



setInterval(draw, 1000 / 60); 