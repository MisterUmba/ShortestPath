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
        this.selected = false;
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
        this.selected = false;
        this.start = false;
    }

    addEdge(edge){
        this.Edges.push(edge);
    }
}



// List of Nodes

let Graph = [];

function rand(min, max){
    let d = max - min;
    return Math.floor(Math.random()*d) + min;
}

function floatRand(min , max){
    let d = max - min;
    return Math.random()*d + min;
}

function distance(node1, node2) {
    let a = Math.abs(node1.x - node2.x);
    let b = Math.abs(node1.y - node2.y);

    return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
}

function probability(k){
    if(k > 1 || k < 0)
        return -1;
    return (Math.random() < k);
}