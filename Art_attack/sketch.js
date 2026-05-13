let sceneX = 0;
let sceneY = 0;

let introVoice;
let voiceStarted = false;

let keyX = 240;
let keyY = 245;

let fishX = 75;
let fishDir = 1;
let swimSpeed = 0.5;

let swing;
let dir = 1;

let hoveringKey = false;
let falling = false;

let keyFallY = 0;

let fallVelocity = 0;
let gravity = 0.1;
let maxFallSpeed = 2.2;

let shakeAmt = 0;

let sceneState = "scene1";

let currentText = "";
let textAlpha = 0;
let textPhase = 0;

function preload(){

  soundFormats('aac', 'mp3');

  introVoice = loadSound("./voice.aac");

}

function setup() {

  createCanvas(600, 500);

  swing = radians(45);

  textFont("Georgia");
}

function draw() {

  background(217,175,182);

  updateLogic();

  if(sceneState === "scene1"){

    renderScene();

    renderCinematic();

    if(!voiceStarted){

      introVoice.play();

      voiceStarted = true;
    }
  }

  if(sceneState === "scene1End"){

    background(0);

    fill(255);

    textAlign(CENTER, CENTER);

    textSize(42);

    text("Scene 1 Complete", width/2, height/2);

    textSize(18);

    fill(180);

    text("Directed by Ayush and Sanya. With due credit to ChatGPT.", width/2, height/2 + 50);
  }
}

function updateLogic(){

  hoveringKey = dist(
    mouseX - sceneX,
    mouseY - sceneY,
    keyX,
    keyY + keyFallY
  ) < 20;

  if(!falling){

    swing += 0.01 * dir;

    if(swing >= radians(135)){
      dir = -1;
    }

    if(swing <= radians(45)){
      dir = 1;
    }
  }

  if(falling){

    fallVelocity += gravity;

    fallVelocity = constrain(
      fallVelocity,
      0,
      maxFallSpeed
    );

    keyFallY += fallVelocity;

    sceneY -= fallVelocity * 0.9;

    if(keyFallY > 400 && textPhase === 0){

      currentText = "The Roads Remember The Noise";

      textPhase = 1;

      playTextTone(220);
    }

    if(keyFallY > 1100 && textPhase === 1){

      currentText = "The Sky Remember The Damage";

      textPhase = 2;

      playTextTone(140);
    }

    if(keyFallY > 1800 && textPhase === 2){

      currentText = "But The Next Journey Is Different \n The Future Is Electric";

      textPhase = 3;

      playTextTone(90);
    }

    if(keyFallY > 2400){

      falling = false;

      shakeAmt = 30;

      sceneState = "scene1End";

      playImpactSound();
    }
  }

  shakeAmt *= 0.9;

  fishX += swimSpeed * fishDir;

  if(fishX > 100 || fishX < 50){
    fishDir *= -1;
  }
}

function renderScene(){

  let sx = random(-shakeAmt, shakeAmt);

  let sy = random(-shakeAmt, shakeAmt);

  push();

  translate(sceneX + sx, sceneY + sy);

  Scene1(0,0);

  pop();
}

function Scene1(x, y){

  push();

  translate(x, y);

  drawRoom(0,0);

  drawDoor(0,0);

  drawKeyHanger(0,0);

  drawKey(keyX,keyY);

  drawTable(-10, 410, 180, 80);

  drawFishTank(25, 350);

  pop();
}

function drawRoom(x,y){

  push();

  translate(x,y);

  stroke(0);

  strokeWeight(2);

  line(300,0,300,400);

  fill("grey");

  triangle(300,400,0,500,600,500);

  pop();
}

function drawDoor(x,y){

  push();

  translate(x,y);

  stroke(0);

  strokeWeight(2);

  fill("burlywood");

  beginShape();

  vertex(340,185);
  vertex(340,412);
  vertex(470,456);
  vertex(470,217);

  endShape(CLOSE);

  fill("black");

  circle(460,340,10);

  pop();
}

function drawKeyHanger(x,y){

  push();

  translate(x,y);

  stroke(0);

  strokeWeight(2);

  fill("wheat");

  beginShape();

  vertex(200,218);
  vertex(200,238);
  vertex(250,228);
  vertex(250,208);

  endShape(CLOSE);

  line(240,225,240,240);

  pop();
}

function drawKey(x,y){

  push();

  translate(x, y + keyFallY);

  if(falling){
    rotate(swing + keyFallY * 0.03);
  }
  else{
    rotate(swing);
  }

  if(hoveringKey && !falling){

    stroke("green");

    strokeWeight(4);

    fill(220);
  }
  else{

    stroke(0);

    strokeWeight(2);

    fill("grey");
  }

  circle(0,0,10);

  fill(217,175,182);

  circle(0,0,5);

  noFill();

  circle(5,0,5);

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

function drawTable(x, y, w, h) {

  push();

  translate(x,y);

  stroke(0);

  strokeWeight(2);

  fill("saddlebrown");

  beginShape();

  vertex(0, 0);
  vertex(w, -50);
  vertex(w + 40, -20);
  vertex(40, 30);

  endShape(CLOSE);

  fill("peru");

  beginShape();

  vertex(40, 30);
  vertex(w + 40, -20);
  vertex(w + 40, h - 40);
  vertex(40, h + 10);

  endShape(CLOSE);

  fill("sienna");

  beginShape();

  vertex(0, 0);
  vertex(40, 30);
  vertex(40, h + 10);
  vertex(0, h-10);

  endShape(CLOSE);

  line(40, 50, w + 40, 0);

  circle((w/2) + 40, 15, 5);
  circle((w/2) + 40, 35, 5);
  circle((w/2) + 40, 55, 5);

  line(40, 70, w + 40, 20);

  pop();
}

function drawFishTank(x, y) {

  push();

  translate(x,y);

  stroke(40);

  strokeWeight(2);

  fill(120, 180, 220, 120);

  beginShape();

  vertex(0, 0);
  vertex(90, -25);
  vertex(120, -5);
  vertex(30, 20);

  endShape(CLOSE);

  fill(100, 170, 210, 100);

  beginShape();

  vertex(30, 20);
  vertex(120, -5);
  vertex(120, 50);
  vertex(30, 75);

  endShape(CLOSE);

  fill(80, 150, 200, 90);

  beginShape();

  vertex(0, 0);
  vertex(30, 20);
  vertex(30, 75);
  vertex(0, 55);

  endShape(CLOSE);

  noStroke();

  fill("tan");

  ellipse(20, 52, 8);
  ellipse(40, 58, 8);
  ellipse(60, 54, 8);

  stroke("green");

  noFill();

  beginShape();

  vertex(35, 50);

  bezierVertex(
    30, 35,
    45, 30,
    38, 15
  );

  endShape();

  beginShape();

  vertex(70, 55);

  bezierVertex(
    65, 40,
    78, 30,
    72, 12
  );

  endShape();

  push();

  translate(fishX,30);

  if(fishDir < 0){
    scale(-1,1);
  }

  noStroke();

  fill("orange");

  ellipse(0, 0, 18, 10);

  triangle(-8, 0, -17, -5, -17, 5);

  fill(0);

  circle(5, -2, 2);

  pop();

  pop();
}

function renderCinematic(){

  if(!falling && shakeAmt < 0.5){
    return;
  }

  let darkness = map(
    keyFallY,
    0,
    2400,
    0,
    220
  );

  noStroke();

  fill(0, darkness);

  rect(0,0,width,height);

  let barHeight = map(
    keyFallY,
    0,
    2400,
    0,
    80
  );

  fill(0);

  rect(0,0,width,barHeight);

  rect(0,height-barHeight,width,barHeight);

  textAlpha = lerp(textAlpha, 255, 0.03);

  fill(255, textAlpha);

  textAlign(CENTER, CENTER);

  textStyle(BOLD);

  textSize(34);

  text(currentText, width/2, height/2);
}

function playTextTone(freq){

  let osc = new p5.Oscillator();

  osc.setType('sine');

  osc.freq(freq);

  osc.amp(0.2, 0.2);

  osc.start();

  osc.amp(0, 1);

  osc.stop(1.2);
}

function playImpactSound(){

  let osc = new p5.Oscillator();

  osc.setType('triangle');

  osc.freq(60);

  osc.amp(0.5, 0.05);

  osc.start();

  osc.freq(25, 0.6);

  osc.amp(0, 1.5);

  osc.stop(2);
}

function mousePressed() {

  userStartAudio();

  if(falling){
    return;
  }

  let d = dist(
    mouseX - sceneX,
    mouseY - sceneY,
    keyX,
    keyY + keyFallY
  );

  if(d < 15){

    falling = true;
  }
}