function setup() {
  createCanvas(600,500);
}

function draw() {
  background("Pink");
  
  strokeWeight(2);
  
  //Room
  line(300,0,300,400);
  fill("grey")
  triangle(300,400,0,500,600,500);
  
  //Gate
  fill("burlywood")
  beginShape();
  vertex(340,185)
  vertex(340,412)
  vertex(470,456)
  vertex(470,217)
  endShape(CLOSE);
  
  //DoorKnob
  fill("black")
  circle(460,340,10)
}