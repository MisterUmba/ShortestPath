"use strict";

let EDGINGNODE = undefined;
let GOLD = undefined;
let ANIMATE = false;

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

function connectNodes(node1, node2) {

    // Stop recreating graph which already exist.
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
                if (GOLD !== undefined){
                    if(document.getElementById("Algorithms").value === "A star") {
                        astar(GOLD, temp);
                        highlightPath(temp);
                    }else if(document.getElementById("Algorithms").value === "Dijkstra SPF"){
                        dijkstra(GOLD);
                        highlightPath(temp);
                    }else if(document.getElementById("Algorithms").value === "Bellman-Ford"){
                        bellmanford(GOLD);
                        highlightPath(temp);
                    }
                } 
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
        
        
        let algoType = document.getElementById("Algorithms");
        switch (algoType.value) {
            case "Dijkstra SPF":
                dijkstra(GOLD)
                break;
            case "A star":
                astar(GOLD)
                break;
            case "Bellman-Ford":
                bellmanford(GOLD);
                break;
            case "Prim's MST":
                prim(GOLD);
                break;
            case "Kruskel's MST":
                kruskal(GOLD);
                highlightTree()
                break;
            default:
                console.log("Something's Wrong. Getting option which shouldn't be there ");
                break;
        }
    }
})


// Animation

function toggleAnimmation(){
    ANIMATE = document.getElementById("animationMode").checked;
    console.log(ANIMATE);
}

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
}