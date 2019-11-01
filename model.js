"use strict";

/*
Nodes
 - x: x axis location
   y: y axis location
*/

class Node{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

/*
Edges
 - b: Begining Node
 - e: End Node
*/

class Edge{
    constructor(begin, end){
        this.b = begin;
        this.e = end;
    }
}

// List of Nodes

let Nodes = [];

// List of Edges
let Edges = [];


function random(min, max){
    let d = max - min;
    return Math.floor(Math.random()*d) + min;
}