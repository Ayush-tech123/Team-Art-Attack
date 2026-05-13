let swing;
let direction = 1;

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
//------------------
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