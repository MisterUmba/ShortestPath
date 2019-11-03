"use strict";


/*
Edges
 - b: Begining Node
 - e: End Node
*/

class Edge{
    constructor(begin, end){
        this.b = begin;
        this.e = end;
        this.cost = 0;
    }

    setCost(cost){
        this.cost = cost;
    }
}

/*
Nodes
 - x: x axis location
   y: y axis location
*/

class Node{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.Edges = [];
    }

    addEdge(edge){
        this.Edges.push(edge);
    }
}



// List of Nodes

let Graph = [];

function random(min, max){
    let d = max - min;
    return Math.floor(Math.random()*d) + min;
}