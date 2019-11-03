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
    pen.strokeStyle = "red";
    pen.lineWidth = 10;
    for(let x = 0; x < Graph.length; x++){
        pen.beginPath();
        pen.moveTo(Graph[x].x , Graph[x].y);
        pen.arc(Graph[x].x , Graph[x].y, radius,0,2*Math.PI,false);
        if(Graph[x].selected){pen.stroke();}
        pen.fill();
    }

    for(let x = 0; x < Graph.length; x++){
        for(let i = 0; i < Graph[x].Edges.length; i ++){
            let ed = Graph[x].Edges[i];
            pen.strokeStyle = "white";
            pen.beginPath();
            pen.moveTo(ed.b.x, ed.b.y);
            pen.lineTo(ed.e.x, ed.e.y);
            pen.stroke();
        }
    }

    pen.restore();
}