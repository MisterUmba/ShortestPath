function collision(b1, b2, space){
    return (distance(b1, b2) <= space)
}

function globalCollision(node, space){
    for(let x = 0; x < Graph.length; x ++){
        if(collision(node, Graph[x], space) && node !== Graph[x])
            return [node, Graph[x]];
    }
    return undefined;
}

function moveNode(){

}

function generateRandomGraph(){
    Graph = [];
    let ballsFit = Math.floor(((canvas.height*canvas.width)/(Math.pow(2*radius, 2)))*(20/100));

    let k = undefined;
    let space = 3*radius;
    for(let x = 0; x < ballsFit; x++){
        
        k = (new Node(floatRand(radius, canvas.width - radius),
        floatRand(radius, canvas.height - radius))); /*new Node(canvas.width/2 + Math.random()*10, canvas.height/2 + Math.random()*10);*/
        
        while(true){
            let points = globalCollision(k, space);
            if(points !== undefined){
                let a = (points[0].x - points[1].x)
                let b = (points[0].y - points[1].y)
                let c = Math.sqrt(a*a + b*b);

                k.x = Math.floor(k.x + space * (a/c));
                k.y = Math.floor(k.y + space * (b/c));
            }else{
                break;
            }
        }
        
        Graph.push(k);
    }

    for(let x = 0; x < Graph.length; x ++){
        if(Graph[x].x > canvas.width - radius|| Graph[x].x < radius ||
             Graph[x].y < radius || Graph[x].y > canvas.height - radius){
                let pos = Graph.indexOf(Graph[x]);
                Graph.splice(pos, 1);
             }
    }
}

// function minNum(queue) {
//     let temp = queue.reduce((prev, curr) => prev < curr ? prev : curr);
//     queue.splice(queue.indexOf(temp), 1);
//     return temp;
// }

// function maxNum(queue) {
//     let temp = queue.reduce((prev, curr) => prev > curr ? prev : curr);
//     queue.splice(queue.indexOf(temp), 1);
//     return temp;
// }

// function intersection(ed1, ed2){
//     let x1 = ed1.b.x, y1 = ed1.b.y, x2 = ed1.e.x, y2 = ed1.e.y;
//     let x3 = ed2.b.x, y3 = ed2.b.y, x4 = ed2.e.x, y4 = ed2.e.y;

//     let t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/
//     ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

//     let minX = minNum([x1,x2,x3,x4]); 
//     let maxX = maxNum([x1,x2,x3,x4]);
//     let minY = minNum([y1,y2,y3,y4]);
//     let maxY = maxNum([y1,y2,y3,y4]);

//     let crossX = x1 + t*(x2 - x1);
//     let crossY = y1 + t*(y2 - y1);
    
//     if((crossX >= minX) && (crossX <= maxX) && (crossY >= minY) && (crossY <= maxY))
//         return [crossX, crossY];
//     return undefined;
// }

// function globalIntersection(ed1){
//     for(let x = 0; x < Graph.length; x++){
//         for(let k = 0; k < Graph[x].Edges.length; k++){
//             if(intersection(ed1, Graph[x].Edges[k]))
//                 return true;
//         }
//     }
//     return false;
// }

// function generateRandomEdges(){
//     for(let x = 0; x < Graph.length; x++){
//         for(let k = 0; k < Graph.length; k++){
//             if(distance(Graph[x], Graph[k]) <= radius * 5)
//                 connectNodes(Graph[x], Graph[k]);
//         }
//     }
// }

// function generateCompleteEdges(){

//     let ed = undefined;
//     for(let x = 0; x < Graph.length; x++){
//         for(let k = 0; k < Graph.length; k++){
//             ed = new Edge(Graph[x],Graph[k]);
//             if(!globalIntersection(ed))
//                 connectNodes(Graph[x], Graph[k]);
//         }
//     }
    
// }
