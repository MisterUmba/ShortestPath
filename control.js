"use strict";

let EDGINGNODE = undefined;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function nodeAt(x, y){
    for(let i = Graph.length-1; i >= 0; i --){
        let n = Graph[i];
        let d = Math.pow(x-n.x, 2) + Math.pow(y-n.y, 2);
        
        if(d <= (Math.pow(radius,2))){
            return n;
        }
    }

    return undefined;
}

function deleteEdgesToMe(node){
    console.log("magic");
}

function removeAllSelected(){
    let selected = [];
    for(let i = 0; i < Graph.length; i ++){
        if(Graph[i].selected)
            selected.push(Graph[i]);
    }

    for(let i = 0; i < selected.length; i ++){
        deleteEdgesToMe(selected[i]);
        selected[i].Edges = [];
        let pos = Graph.indexOf(selected[i]);
        Graph.splice(pos, 1);
    }
}

document.addEventListener("keydown", function(ev){
    if(ev.code === "Delete"){
        removeAllSelected();
    }
});

function connectNodes(node1, node2){
    node1.addEdge(new Edge(node1,node2));
    node2.addEdge(new Edge(node2,node1));
}

document.addEventListener("mousedown", function(ev){
    let pos = getMousePos(canvas, ev);
    EDGINGNODE = nodeAt(pos.x, pos.y);
});

document.addEventListener("mouseup", function(ev){
    if(ev.target === canvas && ev.which === 1){
        let p = getMousePos(canvas, ev);
        
        let temp = nodeAt(p.x, p.y);
        if(EDGINGNODE !== undefined && temp != undefined && EDGINGNODE !== temp){
            connectNodes(EDGINGNODE, temp);
        }else if(temp !== undefined){
            if(temp.selected){
                temp.selected = false;
            }else{
                temp.selected = true;
            }
            
        }else{
            Graph.push(new Node(p.x, p.y));
        }
    }
});


setInterval(draw, 1000/15); 