var colours = {
    "1": "#808080",
    "2": "#ffcccc",
    "3": "#ff66cc",
    "4": "#0099ff",
    "5": "#00cc99",
    "6": "#ff0000",
    "7": "#99cc00",
    "8": "#ff9900",
    "9": "#ffff00" 
};

// 19 points are numbered 0-18 left-to-right and top-bottom
points = [
                  [ 0.5, 0 ], // 0
        [ 0.25, 0.125 ], [ 0.75, 0.125 ], // 1,2
    [ 0, 0.25 ], [ 0.5, 0.25 ], [ 1, 0.25 ], // 3,4,5
        [ 0.25, 0.375 ], [ 0.75, 0.375 ], // 6,7
     [ 0, 0.5 ], [ 0.5, 0.5 ], [ 1, 0.5 ], // 8,9,10
        [ 0.25, 0.625 ], [ 0.75, 0.625 ], // 11,12
    [ 0, 0.75 ], [ 0.5, 0.75 ], [ 1, 0.75 ], // 13,14,15
        [ 0.25, 0.875 ], [ 0.75, 0.875 ], // 16,17
                  [ 0.5, 1 ] // 18
];

function update() {
    var score = 0;
    var canvas = document.getElementById("board");
    var width = canvas.width;
    var height = canvas.height;
    var thickness = Math.min(width, height) / 20;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    document.querySelectorAll('select').forEach(item => {
        score += Number(item.value);
        if(item.value != "0" && item.hasAttribute('data-line')) {
            ctx.beginPath();
            var number = item.options[item.selectedIndex].text;
            line = JSON.parse(item.getAttribute('data-line'));
            from = points[line[0]];
            to = points[line[1]];
            ctx.moveTo((from[0] + 0.1) * width * 0.8, (from[1] + 0.1) * height * 0.8);
            ctx.lineTo((to[0] + 0.1) * width * 0.8, (to[1] + 0.1) * height * 0.8);
            ctx.lineWidth = thickness;
            ctx.lineCap = "round";
            ctx.strokeStyle = colours[number];
            ctx.stroke();
            ctx.closePath();
        }
    });
    for(var point of points) {
        ctx.beginPath();
        ctx.moveTo((point[0] + 0.1) * width * 0.8, (point[1] + 0.1) * height * 0.8);
        ctx.arc((point[0] + 0.1) * width * 0.8, (point[1] + 0.1) * height * 0.8, thickness/2, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    document.getElementById('score').textContent = score;
}

function reset() {
    document.querySelectorAll('select').forEach(item => {
        item.value=0;
    });
    update();
}