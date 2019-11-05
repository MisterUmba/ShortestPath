let canvas = document.getElementById("Shortest_Path_Canvas_Screen");
let pen = canvas.getContext("2d");
let radius = 10;


// Set the size of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function clear(){
    pen.fillStyle = "#000000";
    pen.fillRect(0,0, canvas.width, canvas.height);
}

function draw(){
    clear();
    pen.save();
    pen.fillStyle = "white";
    pen.lineWidth = 10;
    
    // Drawing all Edges
    for(let x = 0; x < Graph.length; x++){
        for(let i = 0; i < Graph[x].Edges.length; i ++){
            let ed = Graph[x].Edges[i];
            pen.strokeStyle = "white";
            if(ed.selected)
                pen.strokeStyle = "gold";
            pen.beginPath();
            pen.moveTo(ed.b.x, ed.b.y);
            pen.lineTo(ed.e.x, ed.e.y);
            pen.stroke();
        }
    }

    // Drawing edge codes
    for(let x = 0; x < Graph.length; x++){
        for(let i = 0; i < Graph[x].Edges.length; i ++){
            let ed = Graph[x].Edges[i];
            pen.fillStyle = "red";
            pen.textAlign = "center";
            let pos = {
                x: Math.floor(Math.abs(ed.b.x + ed.e.x)/2),
                y: Math.floor(Math.abs(ed.b.y + ed.e.y)/2)
            }
            pen.fillText(ed.cost, pos.x, pos.y);
        }
    }

    // Drawing all Nodes
    pen.strokeStyle = "red";
    pen.fillStyle = "white";
    for(let x = 0; x < Graph.length; x++){
        pen.beginPath();
        pen.moveTo(Graph[x].x , Graph[x].y);
        pen.arc(Graph[x].x , Graph[x].y, radius,0,2*Math.PI,false);
        if(Graph[x].selected)
            pen.stroke();
        if(Graph[x].start){
            pen.strokeStyle = "Gold"; 
            pen.stroke()
            pen.strokeStyle = "red";
        }
        pen.fill();
    }

    

    pen.restore();
}