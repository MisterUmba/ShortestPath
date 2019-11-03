"use strict";


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


document.addEventListener("mousedown", function(ev){
    if(ev.target === canvas){
        let p = getMousePos(canvas, ev);
        Graph.push(new Node(p.x, p.y));
    }
});


setInterval(draw, 1000/15); 