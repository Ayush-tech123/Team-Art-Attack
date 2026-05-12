function setup() {
  createCanvas(600,500);
}

function draw() {
  background("Pink");
  
  //Gate
  fill("brown");
  rect(400,260,160,300);
  
  fill("lightblue");
  rect(250, 280, 100, 30);

  strokeWeight(3);
  ellipse(320,295, 20, 20);
  
  fill("chocolate");
  rect(20,350,180,200);
  
  //Door Box
  line(20,400,200,400);
  circle(110,380,20);
  
  line(20,450,200,450);
  circle(110,430,20);
  
  circle(110,480,20);
  
  fill("skyblue")
  ellipse(100,300,150,100);
  fill("orange");

  // Fish 
  ellipse(100,330,40,20);
  triangle(120,330,135,320,135,340);

  fill("black");
  ellipse(90,327,3,3);
  
}
