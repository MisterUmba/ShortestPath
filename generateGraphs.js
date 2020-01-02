function collision(b1, b2, space){
    return (distance(b1, b2) <= space)
}

function globalCollision(node, space){
    for(let x = 0; x < Graph.length; x ++){
        if(collision(node, Graph[x], space))
            return [node, Graph];
    }
    return undefined;
}

function generateRandomGraph(){
    Graph = [];
    let ballsFit = Math.floor(((canvas.height*canvas.width)/(Math.pow(2*radius, 2)))*(30/100));

    let k = undefined;
    let space = 3*radius;
    for(let x = 0; x < ballsFit; x++){
        
        k = (new Node(rand(radius, canvas.width - radius),
        rand(radius, canvas.height - radius)));
        
        while(true){
            let points = globalCollision(k, space);
            if(points !== undefined){
                let slop = Math.floor((Math.abs(points[0].y - points[1].y)/
                (Math.abs(points[0].x - points[1].x))));

                k.x = k.x + space*(-slop);
                k.y = k.y + space*(-slop);
            }else{
                break;
            }
        }
        
        Graph.push(k);
    }

    console.log("Balls which fit: "+ballsFit)
}
