export function gridPlacer(width, height, gridWidth, gridHeight, radious, debug = false, ctx = null) {
    let coords = [];
    const hCells = Math.floor(width / gridWidth) + 1;
    const vCells = Math.floor(height / gridHeight) + 1;
    const offsetH = Math.floor(width - gridWidth * hCells) / 2;
    const offsetV = Math.floor(height - gridHeight * vCells) / 2;
    for (var i = 0; i < hCells; i++) {
        for (var j = 0; j < vCells; j++) {
            var x = i * gridWidth + offsetH + (gridWidth / 2);
            var y = j * gridHeight + offsetV + (gridHeight / 2);
            
            if (debug) {
                ctx.beginPath();
                ctx.arc(x, y, radious, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.moveTo( i * gridWidth, j * gridHeight);
                ctx.lineTo(i * gridWidth + offsetH, j * gridHeight + offsetV);
                ctx.lineTo(x, y);
            }
            if (debug) {
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(x - 5, y - 5, 10, 10);
            }
            
            // offset x and y by a random amount inside the radious
            let offset = Math.sqrt(Math.random()) * radious;
            let angle = Math.random() * 2 * Math.PI;
            x += offset * Math.cos(angle);
            y += offset * Math.sin(angle);
            if (debug) {
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            coords.push([x, y]);
        }
    }
    coords.sort(function(a, b) {
        return a[1] - b[1];
    });
    return coords;
}

export function randomPlacer(width, height, density, debug = false, ctx = null) {
    var coords = [];
    for (var i = 0; i < (width / 200) * (height / 200) * density; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        if (debug) {
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(x - 5, y - 5, 10, 10);
        }

        coords.push([x,y]);
    }
    coords.sort(function(a, b) {
        return a[1] - b[1];
    });
    return coords;
}

export function randomSpreadPlacer(width, height, density, radious, debug = false, ctx = null) {
    var buckets = [];
    for (var i = 0; i < (width / (radious)); i++) {
        buckets.push([]);
        for (var j = 0; j < (height / (radious)); j++) {
            buckets[i].push([]);
        }
    }
    var coords = [];
    let fails = 0;
    for (var i = 0; i < (width / 200) * (height / 200) * density && fails < 1000; i++) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        if (checkBucket(x, y, radious, buckets)) {
            coords.push([x,y]);
            if (debug) {
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(x - 5, y - 5, 10, 10);
            }
            if (debug) {
                ctx.beginPath();
                ctx.arc(x, y, radious, 0, 2 * Math.PI);
                ctx.stroke();
            }
            buckets[Math.floor(x / (radious))][Math.floor(y / (radious))].push([x,y]);
        } else {
            fails++;
        }
    }
    if (debug) {
        drawBuckets(buckets, radious, ctx);
        console.log(buckets);
    }
    return coords;
}

function checkBucket(x, y, radious, buckets) {
    var xBucket = Math.floor(x / (radious));
    var yBucket = Math.floor(y / (radious));
    let clean = true
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (xBucket + i >= 0 && xBucket + i < buckets.length && yBucket + j >= 0 && yBucket + j < buckets[0].length) {
                buckets[xBucket + i][yBucket + j].forEach(pos => {
                    if (Math.sqrt(Math.pow(pos[0] - x, 2) + Math.pow(pos[1] - y, 2)) < radious) {
                        clean = false;
                    }
                });
                if (!clean) {
                    return clean;
                }
            }
        }
    }
    return clean;
}

function drawBuckets(buckets, radious, ctx ) {
    for (var i = 0; i < buckets.length; i++) {
        for (var j = 0; j < buckets[0].length; j++) {
            ctx.beginPath();
            ctx.rect(i * (radious), j * (radious), (radious), (radious));
            ctx.stroke();
        }
    }
    
}