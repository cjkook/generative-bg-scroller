let palette = [];
let canvas;
let pos = 0;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent("canvas");
  colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);
  while (palette.length < 5) {
    palette = shuffle(chromotome.get().colors);
  }


  canvas.position(0, 0);
  blendMode(BLEND);
  background(random(palette));
  // blendMode(MULTIPLY);
  background(0, 0, 0, 30);
  blendMode(BLEND);

  stroke(0, 0, 0, 50);

  let offset = 0;
  let xMin = offset;
  let xMax = width - offset;
  let yMin = offset;
  let yMax = height - offset;

  //   drawingContext.shadowColor = color(0, 0, 0, 33);
  // drawingContext.shadowBlur = offset;

  push();
  translate(width / 2, height / 2);
  // rotate((int(random(4)) * 360) / 4);
  scale(random() > 0.5 ? -1 : 1, random() > 0.5 ? -1 : 1);
  translate(-width / 2, -height / 2);
  drawXYPattern(xMin, yMin, xMax, yMax);
  pop();

  var canvas2 = document.getElementById("canvas").firstElementChild,
  context = canvas2.getContext("2d"),
        doomslayer = canvas2.toDataURL();

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("imgCanvas", doomslayer);
  } else {
    document.getElementById("save").innerHTML.dataURL =
      "Local Storage not supported";
  }

  loadCanvas()
}

function loadCanvas() {

    var image = localStorage.getItem('imgCanvas');

    document.getElementById('imgCanvas1').src = image;
    document.getElementById('imgCanvas2').src = image;
    document.getElementById('imgCanvas3').src = image;
}

function draw() {
  let bg1 = document.getElementById("imgCanvas1")
  let bg2 = document.getElementById("imgCanvas2")
  let bg3 = document.getElementById("imgCanvas3")
  if(pos > window.innerWidth) pos = 0;
  pos++
  bg1.style.cssText = `transform: translate(${pos}px, 0px);`
  bg2.style.cssText = `transform: translate(${pos-window.innerWidth}px, 0px);`
  bg3.style.cssText = `transform: translate(${pos+window.innerWidth}px, 0px);`
  
}

function drawXYPattern(xMin, yMin, xMax, yMax) {
  let xStep, yStep;
  let minStep = width / 50;
  let grid = [];
  let yLength = int(random(5, 10));
  let ySum = 0;

  for (let i = 0; i < yLength; i++) {
    let yNum = random();
    ySum += yNum;
    let xArr = [];
    let obj = {
      y: yNum,
      x: [],
    };
    grid.push(obj);
  }
  for (let i = 0; i < grid.length; i++) {
    grid[i].y = (grid[i].y / ySum) * (yMax - yMin);
    let xNum = (xMax - xMin) / grid[i].y;
    for (let j = 0; j < xNum; j++) {
      if (j < xNum - 1) {
        grid[i].x.push(grid[i].y);
      } else {
        grid[i].x.push(grid[i].y * (xNum % 1));
      }
    }
    grid[i].x = shuffle(grid[i].x, true);
  }

  let y = yMin;
  for (let g of grid) {
    let x = xMin;
    let gy = g.y;
    for (let gx of g.x) {
      // rect();
      push();
      translate(x + gx / 2, y + gy / 2);
      scale((max(gx, gy) - 5) / max(gx, gy));
      drawRecursiveRect(-gx / 2, -gy / 2, gx, g.y, (minD = width / 15));
      pop();
      x += gx;
    }
    y += g.y;
  }
}

function drawRecursiveRect(x, y, w, h, minD = width / 15) {
  push();

  translate(x, y);

  let nx = 0;
  let ny = 0;
  let nw = random(w) / 3;
  let nh = random(w) / 3;
  let direction = true;
  // rect(nx, ny, nw, nh);
  let stepx = 0;
  let stepy = 0;

  while (nx < w) {
    let colors = shuffle(palette.concat(), true);
    let myColor = [colors[0], colors[1]];
    if (direction) {
      nw = random(w);
      if (nx + nw > w || w - (nx + nw) < width / 100) {
        nw = w - nx;
      }
      if (min(nw, nh) > random(width) / 3) {
        drawRecursiveRect(nx, ny, nw, nh);
      } else {
        // rectMode(CENTER);
        push();
        translate(nx + nw / 2, ny + nh / 2);

        angleMode(RADIANS);
        let np = max(nw, nh);
        rectMode(CENTER);
        angleMode(DEGREES);

        fill(myColor[0]);
        if (min(nw, nh) > 5) {
          rect(0, 0, nw, nh, max(nw, nh));
        }
        pop();
      }
      nx += nw;
      if (abs(w - nx) < 0.1) {
        direction = !direction;
        nx = stepx;
        ny += nh;
        stepy = ny;
      }
    } else {
      nh = random(h);
      if (ny + nh > h || h - (ny + nh) < width / 100) {
        nh = h - ny;
      }
      if (min(nw, nh) > random(width) / 10) {
        drawRecursiveRect(nx, ny, nw, nh);
      } else {
        push();
        translate(nx + nw / 2, ny + nh / 2);
        rectMode(CENTER);
        angleMode(RADIANS);
        let np = max(nw, nh);
        angleMode(DEGREES);
        fill(myColor[1]);
        if (min(nw, nh) > 5) {
          rect(0, 0, nw, nh, max(nw, nh));
        }
        pop();
      }
      ny += nh;
      if (abs(h - ny) < 0.1) {
        direction = !direction;
        ny = stepy;
        nx += nw;
        stepx = nx;
      }
    }
  }
  pop();
}
