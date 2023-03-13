const colours = {

    "1": "#000000", // Black
    "2": "#ffffff", // White
    "3": "#ff66cc", // Salmon
    "4": "#0080ff", // Blue
    "5": "#a6a6a6", // Grey
    "6": "#ff3333", // Red
    "7": "#a6ff4d", // Lime
    "8": "#ffc14d", // Orange
    "9": "#ffff00" // Yellow
};

const backgroundColor = "#4d004d"; // dark purple
const borderColor = "#000000"; // Black

var points, hs, vs, resetButtonBbox;
var lineButtons = Array(15);

// 19 points are numbered 0-18 left-to-right and top-bottom.
// Lines start where their button should be.
const lines = [
    { points: [0,2,5], numbers: [3,4,8] },
    { points: [1,4,7,10], numbers: [3,4,8] },
    { points: [3,6,9,12,15], numbers: [3,4,8] },
    { points: [8,11,14,17], numbers: [3,4,8] },
    { points: [13,16,18], numbers: [3,4,8] },
    { points: [0,1,3], numbers: [2,6,7] },
    { points: [2,4,6,8], numbers: [2,6,7] },
    { points: [5,7,9,11,13], numbers: [2,6,7] },
    { points: [10,12,14,16], numbers: [2,6,7] },
    { points: [15,17,18], numbers: [2,6,7] },
    { points: [13,8,3], numbers: [1,5,9] },
    { points: [16,11,6,1], numbers: [1,5,9] },
    { points: [18,14,9,4,0], numbers: [1,5,9] },
    { points: [17,12,7,2], numbers: [1,5,9] },
    { points: [15,10,5], numbers: [1,5,9] }
];

function calculateGeometry(left, top, right, bottom) {
    var width = right - left;
    var height = bottom - top;
    const root3 = Math.sqrt(3);
    // Divide up the width and height into horizontal and vertical spacing
    vs = height / 13.5;
    hs = width / 11 * 1.5;
    // console.log("raw, width=", width, "height=", height, "hs=", hs, "vs=", vs);
    // Now fix the aspect ratio using the smaller dimension
    if(hs / root3 > vs) {
        hs = vs * root3;
    } else {
        vs = hs / root3;
    }
    var cx = (left + right)/2;
    var cy = (top + bottom)/2 - vs/2;
    // console.log("adjusted, hs=", hs, "vs=", vs);

    // 19 points are numbered 0-18 left-to-right and top-bottom
    points = [
                               [ cx +0, cy -4 * vs], // 0
                   [cx -1 * hs, cy -3 * vs], [cx +1 * hs, cy -3 * vs], // 1,2
        [cx -2 * hs, cy -2 * vs], [ cx +0 * hs, cy -2 * vs], [cx +2 * hs, cy -2 * vs], // 3,4,5
                   [cx -1 * hs, cy -1 * vs], [cx +1 * hs, cy -1 * vs], // 6,7
        [cx -2 * hs,  cy +0 * vs], [ cx +0 * hs, cy +0 * vs], [cx +2 * hs, cy +0 * vs], // 8,9,10
                   [cx -1 * hs, cy +1 * vs], [cx +1 * hs, cy +1 * vs], // 11,12
        [cx -2 * hs, cy +2 * vs], [ cx +0 * hs, cy +2 * vs], [cx +2 * hs, cy +2 * vs], //13,14,15
                   [cx -1 * hs, cy +3 * vs], [cx +1 * hs, cy +3 * vs], // 16,17
                               [ cx +0, cy +4 * vs] // 18
    ];

    for(var i = 0; i < 15; ++i) {
        var selection = lineButtons[i] ? lineButtons[i].selection : 0;
        var line = lines[i];
        var p0 = points[line.points[0]];
        var p1 = points[line.points[1]];
        // console.log("line=", line, "p0=", p0, "p1=", p1);
        var point = [2 * p0[0] - p1[0], 2 * p0[1] - p1[1]];
        var angle = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
        lineButtons[i] = {
            line: i,
            point: point,
            angle: angle,
            selection: selection 
        };
    }
}

function drawHexagon(ctx, cx, cy, background, border) {
    ctx.fillStyle = background;
    ctx.strokeStyle = border;
    ctx.lineWidth = vs*0.05;
    ctx.beginPath();
    ctx.moveTo(cx + hs / 1.5, cy + 0);
    ctx.lineTo(cx + hs / 3, cy + vs);
    ctx.lineTo(cx - hs / 3, cy + vs);
    ctx.lineTo(cx - hs / 1.5, cy + 0);
    ctx.lineTo(cx - hs / 3, cy - vs);
    ctx.lineTo(cx + hs / 3, cy - vs);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawArrow(ctx, button) {
    ctx.fillStyle = '#000000';
    //ctx.strokeStyle = border;
    ctx.lineWidth = vs*0.05;
    ctx.beginPath();
    ctx.moveTo(button.point[0] + vs * Math.cos(button.angle), 
        button.point[1] + vs * Math.sin(button.angle));
    var short = 0.8;
    var angle = Math.PI/6;
    ctx.lineTo(button.point[0] + short * vs * Math.cos(button.angle+angle), 
        button.point[1] + short * vs * Math.sin(button.angle+angle));
    ctx.lineTo(button.point[0] + short * vs * Math.cos(button.angle-angle), 
        button.point[1] + short * vs * Math.sin(button.angle-angle));    
    ctx.closePath();
    ctx.fill();
}

function drawLineButton(ctx, button) {
    drawHexagon(ctx, button.point[0], button.point[1], '#EEEEEE', borderColor);
    drawArrow(ctx, button);
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.font = vs + "px Arial";
    // console.log(ctx.font);
    var number = button.selection > 0 ? lines[button.line].numbers[button.selection - 1] : "";
    ctx.fillText(number, button.point[0], button.point[1]);
}

function drawResetButton(ctx, width, height) {
    ctx.textAlign = "right";
    ctx.textBaseline = 'top';
    ctx.font = vs + "px Arial";
    var text = "Reset";
    ctx.fillText(text, width, 0);
    var size = ctx.measureText(text);
    // console.log("size=", size);
    resetButtonBbox = [width-size.width, 0, width, size.fontBoundingBoxAscent + size.fontBoundingBoxDescent];
}

function drawLine(ctx, button) {
    var line = lines[button.line]
    var number = line.numbers[button.selection - 1];
    var p0 = points[line.points[0]];
    var p1 = points[line.points[1]];
    var pn = points[line.points[line.points.length - 1]]
    var dx = (p1[0] - p0[0])/2;
    var dy = (p1[1] - p0[1])/2;

    //console.log("button=", button, "line=", line, "number=", number, "dx=", dx, "dy=", dy, "colour=", colours[number]);

    ctx.beginPath();
    ctx.lineWidth = vs*0.5;
    ctx.strokeStyle = colours[number];
    ctx.moveTo(p0[0] - dx, p0[1] - dy);
    ctx.lineTo(pn[0] + dx, pn[1] + dy);
    ctx.closePath();
    ctx.stroke();
}

function drawScore(ctx) {
    var score = 0;
    for(var button of lineButtons) {
        if(button.selection > 0) {
            var line = lines[button.line];
            score += line.points.length * line.numbers[button.selection - 1];
        }
    }

    ctx.textAlign = "left";
    ctx.textBaseline = 'top';
    ctx.font = vs + "px Arial";
    ctx.fillText(score, 0, 0);
}

function update() {
    var score = 0;
    var canvas = document.getElementById("board");

    var width = canvas.width = document.body.clientWidth;
    var height = canvas.height = document.body.clientHeight;
    calculateGeometry(0, 0, width, height);
    var thickness = Math.min(width, height) / 20;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    for(point of points) {
        drawHexagon(ctx, point[0], point[1], backgroundColor, borderColor);
    }

    var selectedButtons = new Array();
    for(button of lineButtons) {
        // console.log("Button: ", button);
        if(button.selection > 0) {
            selectedButtons.push(button);
        }
    }
    // The game tiles always sort lines with higher numbers on top.
    selectedButtons.sort((a,b) => { 
        var result = lines[a.line].numbers[a.selection - 1] - lines[b.line].numbers[b.selection - 1];
        return result; });
    for(button of selectedButtons) {
        drawLine(ctx, button);
    }
    for(button of lineButtons) {
        // console.log("Button: ", button);
        drawLineButton(ctx, button);
    } 
    drawScore(ctx, selectedButtons);
    drawResetButton(ctx, width, height);
}

function reset() {
    for(button of lineButtons) {
        button.selection = 0;
    }
    update();
}

function findLineButton(x, y) {
    for(button of lineButtons) {
        var d = Math.sqrt((button.point[0] - x) ** 2 + (button.point[1] - y) ** 2);
        if(d < vs) {
            return  button;
        }
    }
    return null;
}

function pointInBbox(bbox, x, y) {
    var result = x >= bbox[0] && x < bbox[2] && y >= bbox[1] && y < bbox[3];
    console.log(result);
    return result;
}

function handleClick(event) {
    // console.log("event=", event);
    var button = findLineButton(event.clientX, event.clientY);
    //console.log(button);
    // console.log("x=", event.clientX, "y=", event.clientY, "bbox=", resetButtonBbox, "button=", button);
    if(button) {
        button.selection = (button.selection + 1) % 4;
    } else if(pointInBbox(resetButtonBbox, event.clientX, event.clientY)) {
        reset();
    }
    update();
}

function handleResize() {
    update();
}

function init() {
    var canvas = document.getElementById("board");
    canvas.addEventListener('click', handleClick, false);
    window.onresize = handleResize;
    update();
}