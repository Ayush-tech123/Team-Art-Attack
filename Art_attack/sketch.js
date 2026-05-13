function setup() {
  createCanvas(600, 500);
}

function draw() {
  background(219,243,251);
  drawScene2()
}

function drawScene2() {
  
  drawHouse();

  push();
  translate(width, 0); 
  scale(-1, 1);        
  drawHouse();
  pop();
}

function drawHouse() {

  push();

  fill("burlywood");

  rect(500,385,100,115);
  rect(300,385,100,115);

  fill("grey");
  rect(400,385,100,115);

  fill("wheat");
  rect(375,285,200,100);

  push();
  fill("grey");
  noStroke();
  ellipse(450,385,100,50);
  pop();

  fill("black");
  line(325,385, 325,500);
  line(350,385, 350,500);
  line(375,385, 375,500);
  line(525,385, 525,500);
  line(550,385, 550,500);
  line(575,385, 575,500);

  circle(485,450,10);

  fill("wheat");
  beginShape();
  vertex(325,385);
  vertex(325,285);
  vertex(350,225);
  vertex(375,285);
  vertex(375,385);
  endShape(CLOSE);

  fill("grey");
  beginShape();
  vertex(350,225);
  vertex(550,225);
  vertex(575,285);
  vertex(375,285);
  endShape(CLOSE);

  fill("white");
  rect(515,315,40,70);
  rect(400,315,40,30);

  fill("black");
  circle(520,350,5);

  line(420,315,420,345);
  line(400,330,440,330);

  pop();
}