import { Tree } from './tree.js';
import { gridPlacer, randomPlacer, randomSpreadPlacer} from './placer.js';
import './style.css';

import g1 from './assets/part-Slice 1.svg';
import g2 from './assets/part-Slice 2.svg';	
import g3 from './assets/part-Slice 3.svg'; 
import t1 from './assets/tree-1.svg';	
import t2 from './assets/tree-2.svg';
import t3 from './assets/tree-3.svg';
import s1 from './assets/tree-shadow-1.svg';
import s2 from './assets/tree-shadow-2.svg';
import s3 from './assets/tree-shadow-3.svg';

let algorithm = 'grid';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let treeDensity = 4;
let grassDensity = 50;
var lastUpate = Date.now();
let dialingTimer;  
let doneDialingInterval = 300; 

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.randomalgorithm) {
            algorithm = properties.randomalgorithm.value;
            drawStuff();
        }
        
        if (properties.density) {
            treeDensity = properties.density.value;
            clearTimeout(dialingTimer);
            dialingTimer = setTimeout(drawStuff, doneDialingInterval);
        }
    },
};





var img_tree_1 = document.createElement('img');	
var img_shadow_1 = document.createElement('img');
var img_tree_2 = document.createElement('img');	
var img_shadow_2 = document.createElement('img');
var img_tree_3 = document.createElement('img');	
var img_shadow_3 = document.createElement('img');

var img_grass_1 = document.createElement('img');
var img_grass_2 = document.createElement('img');
var img_grass_3 = document.createElement('img');


img_grass_1.src = g1;
img_grass_2.src = g2;
img_grass_3.src = g3;

img_tree_1.src = t1;
img_shadow_1.src = s1;
img_tree_2.src = t2;
img_shadow_2.src = s2;
img_tree_3.src = t3;
img_shadow_3.src = s3;



// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);



let loaded = {
    grass1: false, grass2: false, grass3: false,
    tree1: false, tree2: false, tree3: false,
    shadow1: false, shadow2: false, shadow3: false
}

function grassLocations(treeLocations) {
    var gassArray = [];
    const treeRadious = 35;
    var n_grass = 0;
    let fails = 0;
    while (n_grass <(canvas.width / 200) * (canvas.height / 200) * grassDensity && fails < 1000) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        if (treeLocations.some(function(tree) {
            if (Math.sqrt(Math.pow(x - tree[0], 2) + Math.pow(y - tree[1], 2)) < treeRadious) {
                return true;
            }
        }) == false) {
            gassArray.push([x,y]);
            n_grass++;
        } else {
            fails++;
        }
    }
    gassArray.sort(function(a, b) {
        return a[1] - b[1];
    });
    return gassArray;
}



function spawnGrass(grassArray, debug = false) {
    
    grassArray.forEach(function(grass) {
        var grassType = Math.floor(Math.random() * 3) + 1;
        if (grassType === 1) {
            ctx.drawImage(img_grass_1, grass[0] - 16, grass[1] - 20, 32, 32);
        } else if (grassType === 2) {
            ctx.drawImage(img_grass_2, grass[0] - 16, grass[1] - 20, 32, 32);
        } else if (grassType === 3) {
            ctx.drawImage(img_grass_3, grass[0] - 16, grass[1] - 20, 32, 32);
        }
        if (debug) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(grass[0], grass[1], 5, 5);
        }
    });
}


// Loading check
img_grass_1.onload = function() {
    loaded.grass1 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}
img_grass_2.onload = function() {
    loaded.grass2 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}
img_grass_3.onload = function() {
    loaded.grass3 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}
img_tree_1.onload = function() {
    loaded.tree1 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}
img_shadow_1.onload = function() {
    loaded.shadow1 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}
img_tree_2.onload = function() {
    loaded.tree2 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}
img_shadow_2.onload = function() {
    loaded.shadow2 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}
img_tree_3.onload = function() {
    loaded.tree3 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}
img_shadow_3.onload = function() {
    loaded.shadow3 = true;
    if(Object.values(loaded).every(value => value)) drawStuff();
}

        
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
                
    /**
     * Your drawings need to be inside this function otherwise they will be reset when 
     * you resize the browser window and the canvas goes will be cleared.
     */
    drawStuff(); 
}
        
resizeCanvas();

function drawStuff() {
    // do your drawing stuff here
    ctx.fillStyle = '#BF9310';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let treeArray = [];
    if (algorithm === 'grid') {
        const gridSize = 200 / Math.sqrt(treeDensity);
        treeArray = gridPlacer(canvas.width, canvas.height, gridSize, gridSize, 55);
    } else if (algorithm === 'random') {
        treeArray = randomPlacer(canvas.width, canvas.height, treeDensity);
    } else if (algorithm === 'random spread') {
        treeArray = randomSpreadPlacer(canvas.width, canvas.height, treeDensity, 45);
    } else { // default for now
        treeArray = randomSpreadPlacer(canvas.width, canvas.height, treeDensity, 45);
    }

    let trees = Tree.createTrees(treeArray, [img_tree_1, img_tree_2, img_tree_3], [img_shadow_1, img_shadow_2, img_shadow_3]);
    trees = trees.sort((tree1 , tree2) => tree1.y - tree2.y);

    trees.forEach(function(tree) {
        tree.draw_shadow(ctx);
    });


    let grassArray = grassLocations(treeArray);
    spawnGrass(grassArray);

    trees.forEach(function(tree) {
        tree.draw_tree(ctx);
    });

    
    

}