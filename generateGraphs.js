function collision(b1, b2, space) {
    return (distance(b1, b2) <= space)
}

function globalCollision(node, space) {
    for (let x = 0; x < Graph.length; x++) {
        if (collision(node, Graph[x], space) && node !== Graph[x])
            return [node, Graph[x]];
    }
    return undefined;
};

function generateGridGraph() {
    console.log("Grid Graph");
    Graph = [];
    let space = 3 * radius;

    let column = (canvas.width / (2 * radius + space));
    let row = (canvas.height / (2 * radius + space));

    let k = undefined;
    for (let y = 0; y < row * (1 / 3 + 1); y++) {
        for (let x = 0; x < column * (1 / 2 + 1); x++) {
            k = new Node(x * space + space, y * space + space);
            Graph.push(k);
        }
    }
};

function generateClusterGraph() {
    console.log("Cluster Graph")
}


function generateRandomGraph() {
    Graph = [];
    let ballsFit = Math.floor(((canvas.height * canvas.width) / (Math.pow(2 * radius, 2))) * (20 / 100));

    let k = undefined;
    let space = 3 * radius;
    for (let x = 0; x < ballsFit; x++) {

        k =
            (new Node(floatRand(radius, canvas.width - radius), floatRand(radius, canvas.height - radius)));
        /*new Node(canvas.width/2 + Math.random()*10, canvas.height/2 + Math.random()*10);*/

        while (true) {
            let points = globalCollision(k, space);
            if (points !== undefined) {
                let a = (points[0].x - points[1].x)
                let b = (points[0].y - points[1].y)
                let c = Math.sqrt(a * a + b * b);

                k.x = (k.x + space * (a / c));
                k.y = (k.y + space * (b / c));
            } else {
                break;
            }
        }

        Graph.push(k);
    }

    for (let x = 0; x < Graph.length; x++) {
        if (Graph[x].x > canvas.clientWidth - radius || Graph[x].x < radius ||
            Graph[x].y < radius || Graph[x].y > canvas.clientHeight - radius) {
            let pos = Graph.indexOf(Graph[x]);
            Graph.splice(pos, 1);
        }
    }
}

function deviation() {
    let space = 5 * radius;

    Q = []

    for (let x = 0; x < Graph.length; x++) {
        for (let i = 0; i < Graph.length; i++) {
            let dis = distance(Graph[i], Graph[x]);
            if (dis <= space) {
                Q.push(dis);
            }
        }
    }

    // let Q = [17, 15, 23, 7, 9, 13]

    let mean = (function () { let sum = 0; for (let x = 0; x < Q.length; x++) { sum += Q[x] } /*console.log(`sum: ${sum}\n`);*/ return sum / Q.length; })();

    // console.log(`mean: ${mean}`);

    return Math.sqrt((function () {
        let sum = 0;
        // let sum1 = 0;
        for (let x = 0; x < Q.length; x++) {
            sum += Math.pow((Q[x] - mean), 2);
            // sum1 += Q[x] - mean;
        }

        // console.log(`basic sum: ${sum1}\nadvance sum: ${sum}`);
        return sum / (Q.length - 1);
    })());
}

function s_curve(devi){
    let min = -2.70805020110221, max = 2.425483229317202, base = 28.799;
    if(devi < base) return (0.30);
    return ((Math.log((41 - devi)/(devi - 25)) * (-1)) - min)/ (max - min)
}

function generateRandomEdges() {
    let devi = deviation();

    for (let x = 0; x < Graph.length; x++) {
        for (let k = 0; k < Graph.length; k++) {
            if (distance(Graph[x], Graph[k]) <= radius * 5 && probability(s_curve(devi)))
                connectNodes(Graph[x], Graph[k]);
        }
    }
}
