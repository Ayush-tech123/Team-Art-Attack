let swing;
let direction = 1;
let swim_speed = 0.5;
let fishX = 75;
let fishDirection = 1;

function setup() {
  createCanvas(600,500);
  swing = radians(45);
}

function draw() {
  background(217,175,182);
  
  //For Room 
  line(300,0,300,400);
  fill("gray");
  triangle(300,400,0,500,600,500);
  
  //Gate
  fill("burlywood")
  beginShape();
  vertex(340,185);
  vertex(340,412);
  vertex(470,456);
  vertex(470,217);
  
  endShape(CLOSE);
  
  //DoorKnob
  fill("black");
  circle(460,340,10); 
  
  //Key Hanger
  fill("wheat");
  beginShape();
  vertex(200,218);
  vertex(200,238);
  vertex(250,228);
  vertex(250,208)
  endShape(CLOSE);
  
  line(240,225,240,240);
  
//---------------------------------------------
  drawKey()
  
  swing +=0.01 * direction;
  
  if(swing >=radians(135)) {
    direction = -1;
  }
  if (swing <= radians(45)) {
    direction = 1;
  }
  drawTable(-10, 410, 180, 80);
  drawFishTank(25, 350);
  
  //Swimming logic
  fishX += swim_speed * fishDirection;

if (fishX > 100 || fishX < 50) {
  fishDirection *= -1;
   }
}

function drawKey(){
   push();
  
   translate(240,245);
   rotate(swing);
 
    stroke(0);
    strokeWeight(2);
    fill("grey");
  
  // key ring
  circle(0,0,10);

  fill(217,175,182);
  circle(0,0,5);

  noFill();
  circle(5,0,5);

  // key body
  fill(150);
  stroke(50);
  strokeWeight(1);

  beginShape();
  vertex(7, -2);
  vertex(15, -2);
  vertex(15, -1);
  vertex(18, -1);
  vertex(18, 1);
  vertex(16, 1);
  vertex(16, 3);
  vertex(13, 3);
  vertex(13, 1);
  vertex(7, 1);
  endShape(CLOSE);

  pop();
}
//---------------------------------------
function drawTable(x,y,w,h){
  
  push();
  
  fill("saddlebrown");
  stroke(60);
  strokeWeight(2);

  //tabletop
  beginShape();
  vertex(x, y);
  vertex(x + w, y - 50);
  vertex(x + w + 40, y - 20);
  vertex(x + 40, y + 30);
  endShape(CLOSE);
  
  //front side
  fill("peru");
  beginShape();
  vertex(x + 40, y + 30);
  vertex(x + w + 40, y - 20);
  vertex(x + w + 40, y + h - 40);
  vertex(x + 40, y + h + 10);
  endShape(CLOSE);
  
  //left side 
  fill("sienna");
  beginShape();
  vertex(x, y);
  vertex(x + 40, y + 30);
  vertex(x + 40, y + h + 20);
  vertex(x, y + h);
  endShape(CLOSE);
  
  //Drawers
  line(x + 40, y + 50, x + w + 40, y )
  circle(x + (w/2) + 40, y + 15, 5)
  circle(x + (w/2) + 40, y + 35, 5)
  circle(x + (w/2) + 40, y + 55, 5)
  line(x + 40, y + 70, x + w + 40, y + 20)

  pop();   
}
//-----------------------------------------------------
function drawFishTank(x,y){
  
  push();
  
  stroke(40);
  strokeWeight(2);

  //glass
  fill(120, 180, 220, 120);

  beginShape();
  vertex(x, y);
  vertex(x + 90, y - 25);
  vertex(x + 120, y - 5);
  vertex(x + 30, y + 20);
  endShape(CLOSE);

  // front glass
  fill(100, 170, 210, 100);

  beginShape();
  vertex(x + 30, y + 20);
  vertex(x + 120, y - 5);
  vertex(x + 120, y + 50);
  vertex(x + 30, y + 75);
  endShape(CLOSE);

  fill(80, 150, 200, 90);

  beginShape();
  vertex(x, y);
  vertex(x + 30, y + 20);
  vertex(x + 30, y + 75);
  vertex(x, y + 55);
  endShape(CLOSE);

  // gravel
  noStroke();
  fill("tan");

  ellipse(x + 20, y + 52, 8);
  ellipse(x + 40, y + 58, 8);
  ellipse(x + 60, y + 54, 8);

  // seaweed
  stroke("green");
  noFill();

  beginShape();
  vertex(x + 35, y + 50);
  bezierVertex(x + 30, y + 35,x + 45, y + 30,x + 38, y + 15);
  endShape();

  beginShape();
  vertex(x + 70, y + 55);
  bezierVertex(x + 65, y + 40,x + 78, y + 30, x + 72, y + 12);
  
  endShape();

  push();

translate(x + fishX, y + 30);

if (fishDirection < 0) {
  scale(-1, 1);
}

noStroke();
fill("orange");

// fish
ellipse(0, 0, 18, 10);

// tail 
triangle(-8, 0,-17, -5,-17, 5);

// eye
fill(0);
circle(5, -2, 2);

pop();
  pop();
  
}