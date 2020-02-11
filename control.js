"use strict";

let EDGINGNODE = undefined;
let GOLD = undefined;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
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

function distance(node1, node2) {
    let a = Math.abs(node1.x - node2.x);
    let b = Math.abs(node1.y - node2.y);

    return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
}

function connectNodes(node1, node2) {
    for (let x = 0; x < node1.Edges.length; x++) {
        if (node1.Edges[x].e === node2) {
            return;
        }
    }

    let ed = new Edge(node1, node2);
    let cost = distance(node1, node2);
    ed.cost = cost;
    node1.addEdge(ed);

    let ed1 = new Edge(node2, node1);
    ed1.cost = cost;
    node2.addEdge(ed1);
}

// Clicking down for dragging and creating new node
document.addEventListener("mousedown", function (ev) {
    let pos = getMousePos(canvas, ev);
    EDGINGNODE = nodeAt(pos.x, pos.y);
});

document.addEventListener("mousemove", function (ev) {
    if (EDGINGNODE !== undefined) {
        //console.log("Moving!")
        //drawNewEdge(EDGINGNODE, getMousePos(canvas, ev));
        if (newEdge === undefined) {
            drawNewEdge(EDGINGNODE, getMousePos(canvas, ev))
        } else {
            let pos = getMousePos(canvas, ev);
            newEdge.e.x = pos.x;
            newEdge.e.y = pos.y;
        }
    }
});

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

function erasePath(node) {
    for (let x = 0; x < Graph.length; x++) {
        for (let i = 0; i < Graph[x].Edges.length; i++) {
            let ed = Graph[x].Edges[i].selected = false;
        }
    }
}

document.addEventListener("mouseup", function (ev) {

    newEdge = undefined;

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
            erasePath();

            for (let x = 0; x < Graph.length; x++) {
                if (Graph[x].start) {
                    Graph[x].start = false;
                }
            }
        }
    }

    EDGINGNODE = undefined;
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
    let temp = "";
    for (let k = 0; k < Graph.length; k++) { temp += (Graph.indexOf(Graph[k]) + "---->" + Graph.indexOf(Graph[k].path.last)) + "\n" }
    //console.log(temp);
}

document.addEventListener("dblclick", function (ev) {
    let pos = getMousePos(canvas, ev);

    let node = nodeAt(pos.x, pos.y);
    if (node !== undefined) {
        for (let k = 0; k < Graph.length; k++) {
            Graph[k].start = false;
            GOLD = undefined;
        }

        GOLD = node;
        node.start = true;
        shortestPath(GOLD);
    }
})


setInterval(draw, 1000 / 60);

// Input Buttons Controls
document.getElementById("mySidenav").style.width = "0px";
document.getElementById("mySidenav").style.margin = "0px"
function closeNav() {
    let x = document.getElementById("mySidenav");
    let b = document.getElementById("navBtn");
    if (x.style.width === "0px") {
        x.style.width = "30vw";
        x.style.margin = "10px";
        b.style.left = "30vw";
        b.innerHTML = "&times";
    } else {
        x.style.width = "0px";
        x.style.margin = "0px";
        b.style.left = "0px";
        b.innerHTML = "&#9776";
    }
}

closeNav(); // Make it so that when loaded the side part is open

function createGraph() {
    let vertexType = document.getElementById("vertices");
    switch (vertexType.value) {
        case "Randomly positioned vertices":
            generateRandomGraph();
            break;
        case "Grid positioned vertices":
            generateGridGraph();
            break;
        case "Cluster positioned vertices":
            generateClusterGraph();
        default:
            console.log("Something's Wrong. Getting option which shouldn't be there ")
    };

    let edgeType = document.getElementById("edges");
    switch (edgeType.value) {
        case "Randomly positioned Edges":
            generateRandomEdges();
            break;
        case "Grid-like Edges":
            generateGridEdges();
            break;
        case "Generated using triangulation":
            generateTriangleEdges();
            break;
        default:
            console.log("Something's Wrong. Getting option which shouldn't be there ");
            break;
    };

    let algoType = document.getElementById("Algorithms");
    switch (algoType.value) {
        case "Dijkstra SPF":
            console.log("Dijkstra");
            break;
        case "A star":
            console.log("A Star");
            break;
        case "Bellman-Ford":
            console.log("Bellman-Ford");
            break;
        case "Prim's MST":
            console.log("Prim's MST");
            break;
        case "Kruskel's MST":
            console.log("Kruskel's MST");
            break;
        default:
            console.log("Something's Wrong. Getting option which shouldn't be there ");
            break;
    }
}