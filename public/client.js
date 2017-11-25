// Wait for HTML page to load and ask the browser to tell when it's ready
document.addEventListener("DOMContentLoaded", () => {
  var mouse = {
    click: false,
    move: false,
    pos: {
      x: 0,
      y: 0
    },
    pos_prev: false
  };

  // get canvas element
  var canvas = document.getElementById("drawing");

  // create a 2D drawing context to draw
  var context = canvas.getContext("2d");

  // tell socket to connect to server
  var socket = io.connect();

  // socket.emit("getOriginalDimension");
  // window dimensions
  width = window.innerWidth;
  height = window.innerHeight;
  // sets the canvas width and height properties to the browser width and height
  canvas.width = width;
  canvas.height = height;

  // mouse.click is true whenever we keep mouse button clicked
  canvas.onmousedown = e => {
    mouse.click = true;
  };
  canvas.onmouseup = e => {
    mouse.click = false;
  };

  // mouse.pos.x and mouse.pos.y is updated whenever mouse is moved
  canvas.onmousemove = e => {
    mouse.pos.x = e.clientX / width;
    mouse.pos.y = e.clientY / height;
    // set mouse.move to true, so we can check if the mouse moved or not
    mouse.move = true;
  };

  // get random color for player marker
  let x = Math.floor(Math.random() * 256);
  let y = Math.floor(Math.random() * 256);
  let z = Math.floor(Math.random() * 256);
  var myColor = "rgb(" + x + "," + y + "," + z + ")";

  socket.on("draw_line", data => {
    var line = data.newLine;
    context.strokeStyle = line[2];

    // start a new path
    context.beginPath();
    context.lineWidth = 2;

    // move to the first point
    context.moveTo(line[0].x * width, line[0].y * height);

    // draw the line to the second received point
    context.lineTo(line[1].x * width, line[1].y * height);

    // actually draw the line
    context.stroke();
  });

  function mainLoop() {
    if (mouse.click && mouse.move && mouse.pos_prev) {
      console.log(context.strokeStyle);
      socket.emit("draw_line", {
        line: [mouse.pos, mouse.pos_prev, myColor]
      });
      mouse.move = false;
    }
    mouse.pos_prev = {
      x: mouse.pos.x,
      y: mouse.pos.y
    };
    setTimeout(mainLoop, 25);
  }
  mainLoop();

  var clearButton = document.getElementById("clear");
  clearButton.addEventListener("click", e => {
    socket.emit("clear");
  });
  socket.on("clearRect", () => {
    context.clearRect(0, 0, width, height);
  });
});
