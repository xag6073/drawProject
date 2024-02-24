//file manager

let fileSystem = [
    {
        name: "something",
        data: "none"
    }
]

function create() {
    let fileName = prompt("Enter file name: ", "newCanvas");
    if(fileName !== null || fileName === "") {
        fileSystem.push({name: fileName, data: "none"});
        showFiles();
    }

}

function showFiles() {
    hideCanvas();
    let fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    for(const file in fileSystem) {
        let div = document.createElement("div");
        div.title = fileSystem[file].name;

        let fileButton = createFileButton(file);

        div.appendChild(fileButton);
        fileList.appendChild(div);
    }
}

function createFileButton(file) {
    var button = document.createElement("button");
    button.value = file;
    button.className = "icon-button";
    button.innerHTML = fileSystem[file].name; 
    button.addEventListener("click", function() {
        showCanvas(file);
    });
    button.addEventListener("contextmenu", function(e) {
        showContextMenu(e, file);
    });
    return button;

}

function showContextMenu(e, file) {
    var cm = document.getElementById("contextMenu");
    var ren = document.getElementById("cmRename");
    var del = document.getElementById("cmDelete");

    var renameHandler = function() {
        renameFile(file);
        cm.style.display = "none";
    }

    var deleteHandler = function() {
        deleteFile(file);
        cm.style.display = "none";
    }

    e.preventDefault();
    cm.style.display = "block";
    cm.style.left = e.clientX + "px";
    cm.style.top = e.clientY + "px";

    ren.addEventListener("click", renameHandler);
    del.addEventListener("click", deleteHandler);
    window.addEventListener("click", function cmHandler(e) {
        ren.removeEventListener("click", renameHandler);
        del.removeEventListener("click", deleteHandler);
        cm.style.display = "none";
        this.window.removeEventListener("click", cmHandler);
    });
}

function renameFile(input) {
    let newName = prompt("Enter new file name: ");
    if(newName !== null || newName === "") {
        fileSystem[input].name = newName;
        showFiles();
        return;
    }
    alert("Invalid new file name.");
}

function deleteFile(input) {
    fileSystem.splice(input, 1);
    showFiles();
}

function showCanvas(file) {
    let fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    drawCanvas.start(file);

}

function hideCanvas() {
    if(document.body.contains(drawCanvas.canvas)) {
        drawCanvas.canvas.removeEventListener("mousemove", draw);
        drawCanvas.canvas.removeEventListener("mousedown", mouseControls);
        window.removeEventListener("keydown", keyControls); 

        document.body.removeChild(drawCanvas.canvas);
        drawCanvas.toolbar.remove();
    }
}

//drawCanvas

let canvasWidth = 600;
let canvasHeight = 600;

let color = ["#ff0000", "#ffffff", "#FFFF00", "#000000"];

let pos = {x: 0, y: 0};
var startLine = true;
let mode = 0;

let drawCanvas = {
    canvas: document.createElement("canvas"),
    start: function(file) {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.style.border = "5px solid black";
        this.canvas.style.cursor = "crosshair";

        document.body.appendChild(this.canvas);

        //manage file data
        this.file = file;
        if(fileSystem[file].data !== "none") {
            this.ctx.putImageData(fileSystem[file].data, 0, 0);
        }
        
        //toolbar
        this.toolbar = document.createElement("footer");
        this.toolbar.className = "toolbar";
        this.toolbar.zIndex = 100;

        startControls();
    }
}

function drawLine(x, y, tx, ty, color, width) {

    drawCanvas.ctx.beginPath();
    drawCanvas.ctx.lineWidth = width;
    drawCanvas.ctx.strokeStyle = color;
    drawCanvas.ctx.lineCap = "round";
    
    drawCanvas.ctx.moveTo(x, y);
    drawCanvas.ctx.lineTo(tx, ty);

    drawCanvas.ctx.closePath();
    drawCanvas.ctx.stroke();
}

function draw(e) {

    if(e.buttons !== 1) return;

    switch(mode) {
        case 0:
            drawLine(pos.x, pos.y, e.offsetX, e.offsetY, color[0], 5);
            pos.x = e.offsetX;
            pos.y = e.offsetY;
            break;
        case 1:
            drawLine(pos.x, pos.y, e.offsetX, e.offsetY, "white", 5);
            pos.x = e.offsetX;
            pos.y = e.offsetY;
            break;
        case 2:
            drawCanvas.ctx.globalAlpha = 0.15;
            drawLine(pos.x, pos.y, e.offsetX, e.offsetY, color[2], 5);
            drawCanvas.ctx.globalAlpha = 1;
            pos.x = e.offsetX;
            pos.y = e.offsetY;
            break;
    }
}

function mouseControls(e) {
    if(mode === 3) {
        if(startLine) {
            pos.x = e.offsetX;
            pos.y = e.offsetY;
            startLine = false;
        } else {
            drawLine(pos.x, pos.y, e.offsetX, e.offsetY, color[3], 5);
            startLine = true;
        }
    }
    pos.x = e.offsetX;
    pos.y = e.offsetY;
}

function setMode(num) {
    mode = num;
    colorInput = document.querySelector("input[type='color']");
    switch(mode) {
        case 0:
            colorInput.value = color[mode];
            //TODO cchange cursor
            //document.body.style.cursor = "url('./assets/pencursor.png'), auto";
            break;
        case 1:
            colorInput.value = color[mode];
            //document.body.style.cursor = "url('pencursor.jpg'), auto";
            break;
        case 2:
            colorInput.value = color[mode];
            //document.body.style.cursor = "url('pencursor.jpg'), auto";
            break;
        case 3:
            colorInput.value = color[mode];
            startLine = true;
            break;
    }
}

function keyControls(e) {
    switch(e.key) {
        case 'p':
            setMode(0);
            break;
        case 'e':
            setMode(1);
            break;
        case 'h':
            setMode(2);
            break;
        case 'l':
            setMode(3);
            break;
        case 's':
            save();
            break;
        case 'c':
            drawCanvas.ctx.clearRect(0, 0, canvasHeight, canvasWidth);
            break;
    }
}

function startControls() {
    drawCanvas.canvas.addEventListener("mousemove", draw);
    drawCanvas.canvas.addEventListener("mousedown", mouseControls);
    window.addEventListener("keydown", keyControls);
    
    //manage toolbar
    var penBtn = document.createElement("button");
    var eraserBtn = document.createElement("button");
    var highlighterBtn = document.createElement("button");
    var lineBtn = document.createElement("button");
    var colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = color[mode];

    penBtn.innerHTML = "<img src='./assets/pen.png' width=\"25\" height=\"25\">";
    penBtn.className = "tool-button";
    eraserBtn.innerHTML = "<img src='./assets/eraser.png' width=\"25\" height=\"25\">";
    eraserBtn.className = "tool-button";
    highlighterBtn.innerHTML = "<img src='./assets/highlighter.png' width=\"25\" height=\"25\">";
    highlighterBtn.className = "tool-button";   
    lineBtn.innerHTML = "<img src='./assets/line.png' width=\"25\" height=\"25\">";
    lineBtn.className = "tool-button";
    colorInput.className = "tool-button";

    //make color input a bit more symetrical
    colorInput.style.padding = "3px 3px";
    colorInput.style.transform = "translateY(-4px)";

    penBtn.addEventListener("click", function() {
        setMode(0);
    });
    eraserBtn.addEventListener("click", function() {
        setMode(1);
    });
    highlighterBtn.addEventListener("click", function() {
        setMode(2);
    });
    lineBtn.addEventListener("click", function() {
        setMode(3);
    });
    colorInput.addEventListener("change", function() {
        color[mode] = colorInput.value;
    });
    
    drawCanvas.toolbar.appendChild(penBtn);
    drawCanvas.toolbar.appendChild(eraserBtn);
    drawCanvas.toolbar.appendChild(highlighterBtn);
    drawCanvas.toolbar.appendChild(lineBtn);
    drawCanvas.toolbar.appendChild(colorInput);
    document.body.insertBefore(drawCanvas.toolbar, drawCanvas.canvas);

}

function save() {
    let imageData = drawCanvas.ctx.getImageData(0, 0, canvasHeight, canvasWidth);
    fileSystem[drawCanvas.file].data = imageData;
}


