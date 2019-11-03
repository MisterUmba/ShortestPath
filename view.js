let canvas = document.getElementById("Shortest_Path_Canvas_Screen");
let pen = canvas.getContext("2d");
let radius = 5;


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
    for(let x = 0; x < Graph.length; x++){
        pen.beginPath();
        pen.moveTo(Graph[x].x , Graph[x].y);
        pen.arc(Graph[x].x , Graph[x].y, radius,0,2*Math.PI,false);
        pen.fill();
    }

    pen.restore();
}