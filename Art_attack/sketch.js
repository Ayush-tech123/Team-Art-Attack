// =====================
// GLOBAL STATE
// =====================
let sceneState = "intro";

// =====================
// SCENE 1 - INTRO VARS
// =====================
let sceneX = 0, sceneY = 0;
let keyX = 240, keyY = 245;
let fishX = 75, fishDir = 1, swimSpeed = 0.5;
let swing, dir = 1;
let hoveringKey = false, falling = false;
let keyFallY = 0, fallVelocity = 0;
let gravity = 0.1, maxFallSpeed = 2.2;
let shakeAmt = 0;
let currentText = "", textAlpha = 0, textPhase = 0;
let showGrabText = true;

// =====================
// SCENE 2 - HOUSE VARS
// =====================
let petrolCarX = 750, evCarX = 950;
let carsStopped = false;
let petrolStopX = 80, evStopX = 360;
let chooseTextAlpha = 255, chooseTextFading = false;

// =====================
// SCENE 2.5 - STATION VARS
// =====================
let stationCarX = 760;
let stationCarParked = false;
let stationCarTargetX = 180;
let stationPumpGlow = 0;
let stationPumpGlowDir = 1;
let stationClickReady = false;
let stationClickAlpha = 0;
let stationNozzleAngle = 0;
let stationNozzleTarget = 0;
let stationRefuelling = false;
let stationFuelProgress = 0;
let stationDone = false;

// EV station vars (mirrored)
let evStationCarX = 760;
let evStationCarParked = false;
let evStationCarTargetX = 200;
let evChargePulse = 0;
let evStationClickReady = false;
let evStationClickAlpha = 0;
let evCharging = false;
let evChargeProgress = 0;
let evStationDone = false;

// =====================
// SCENE 3 - DRIVE VARS
// =====================
let selectedCar = "";
let roadOffset = 0, treeOffset = 0;
let speed = 0;
let maxSpeedPetrol = 160, maxSpeedEV = 130;
let accelPetrol = 0.7, accelEV = 0.4;
let brakeStrength = 2.0, friction = 0.18;
let fuel = 100, battery = 100;
let fuelDrain = 0.025, batteryDrain = 0.015;
let accelPressed = false, brakePressed = false;
let distanceTravelled = 0;

let newsPetrol = [
  "India imports 85% of its crude oil",
  "Petrol hit Rs.106/L in Mumbai 2023",
  "CO2 from transport: 13% of India's emissions",
  "Fossil fuel subsidies cost Rs.2.5L crore/yr"
];
let newsEV = [
  "India targets 30% EV by 2030",
  "EV sales up 49% in India FY2024",
  "Lithium: only 0.002% of Earth's crust",
  "One EV battery lasts 15-20 years"
];
let newsX = 370, newsIndex = 0;

// =====================
// SCENE 4 - FACTS VARS
// =====================
let factIndex = 0, factAlpha = 0;
// More facts
let factsPetrol = [
  { big: "5,000,000", small: "Barrels of oil India burns every single day" },
  { big: "2.3 kg",    small: "CO2 released per litre of petrol burned" },
  { big: "Rs.80-110", small: "Petrol price swings seen in just 5 years" },
  { big: "85%",       small: "Of India's oil is imported. Zero energy security." },
  { big: "13%",       small: "Of India's CO2 comes from road transport" },
  { big: "₹2.5L Cr",  small: "Fossil fuel subsidies India pays every year" }
];
let factsEV = [
  { big: "0.002%",    small: "Of Earth's crust is Lithium. Rarer than you think." },
  { big: "3 nations", small: "Chile, Australia, Argentina hold 80% of Lithium" },
  { big: "15-20 yrs", small: "Lifespan of a single EV battery pack" },
  { big: "30%",       small: "India's EV target share by 2030. Already moving." },
  { big: "₹8/kWh",   small: "Cost to charge an EV vs ₹106 per litre of petrol" },
  { big: "49%",       small: "Growth in EV sales in India in FY2024 alone" }
];

// Both-path experience
let secondPath = false;
let firstCarChosen = "";

// F1: guard so drawFacts never calls goToScene more than once per transition
let factsTransitioning = false;

// P1: second-path intro card
let secondPathCardAlpha = 0;
let secondPathCardTimer = 0;
let showSecondPathCard = false;

// =====================
// ENDING VARS
// =====================
let endingAlpha = 0, endCarX = -50;

// =====================
// FADE TRANSITION
// =====================
let fadeAlpha = 0, fadingOut = false, fadeTargetScene = "";

// =====================
// SETUP
// =====================
function setup() {
  createCanvas(600, 500);
  swing = radians(45);
  textFont("Georgia");
}

// =====================
// DRAW ROUTER
// =====================
function draw() {
  if      (sceneState === "intro")           drawIntro();
  else if (sceneState === "house")           drawHouseScene();
  else if (sceneState === "station_petrol")  drawPetrolStation();
  else if (sceneState === "station_ev")      drawEVStation();
  else if (sceneState === "drive_petrol")    drawDriveScene("petrol");
  else if (sceneState === "drive_ev")        drawDriveScene("ev");
  else if (sceneState === "facts_petrol")    drawFacts(factsPetrol);
  else if (sceneState === "facts_ev")        drawFacts(factsEV);
  else if (sceneState === "ending")          drawEnding();
  drawFadeOverlay();
}

// =====================
// TRANSITION
// =====================
function goToScene(name) {
  fadeTargetScene = name;
  fadingOut = true;
  fadeAlpha = 0;
  factIndex = 0;
  factAlpha = 0;
}

function drawFadeOverlay() {
  if (!fadingOut) return;
  fadeAlpha += 8;
  noStroke();
  fill(0, fadeAlpha);
  rect(0, 0, width, height);
  if (fadeAlpha >= 255) {
    sceneState = fadeTargetScene;
    fadingOut  = false;
    fadeAlpha  = 0;

    // Reset station vars on entry
    if (sceneState === "house") {
      petrolCarX = 750; evCarX = 950;
      carsStopped = false;
      chooseTextAlpha = 255; chooseTextFading = false;
    }
    if (sceneState === "station_petrol") {
      stationCarX = 760; stationCarParked = false; stationClickReady = false;
      stationClickAlpha = 0; stationRefuelling = false; stationFuelProgress = 0;
      stationDone = false; stationNozzleAngle = 0; stationNozzleTarget = 0;
    }
    if (sceneState === "station_ev") {
      evStationCarX = 760; evStationCarParked = false; evStationClickReady = false;
      evStationClickAlpha = 0; evCharging = false; evChargeProgress = 0;
      evStationDone = false;
    }
    if (sceneState === "drive_petrol" || sceneState === "drive_ev") {
      speed = 0; fuel = 100; battery = 100;
      distanceTravelled = 0;
      roadOffset = 0; treeOffset = 0;
      newsX = 370; newsIndex = 0;
      factsTransitioning = false;
      // P1: show second-path intro card when entering second drive
      if (secondPath) {
        showSecondPathCard = true;
        secondPathCardAlpha = 0;
        secondPathCardTimer = 0;
      }
    }
    if (sceneState === "ending") { endingAlpha = 0; endCarX = -50; factsTransitioning = false; }
  }
}

// =====================
// SCENE 1 - INTRO
// =====================
function drawIntro() {
  background(217, 175, 182);
  updateIntroLogic();
  renderScene();
  if (showGrabText) {
    fill(0); textAlign(RIGHT); textSize(26); textStyle(BOLD);
    text("Grab Your Keys", width / 2 - 20, 60);
    textStyle(NORMAL);
  }
  renderCinematic();
}

function updateIntroLogic() {
  hoveringKey = dist(mouseX, mouseY, keyX, keyY) < 20;

  if (!falling) {
    swing += 0.01 * dir;
    if (swing >= radians(135)) dir = -1;
    if (swing <= radians(45))  dir =  1;
  }

  if (falling) {
    showGrabText = false;
    fallVelocity += gravity;
    fallVelocity = constrain(fallVelocity, 0, maxFallSpeed);
    keyFallY += fallVelocity;
    sceneY -= fallVelocity * 0.5;

    if (keyFallY > 400  && textPhase === 0) { currentText = "The Roads Remember The Noise";                              textPhase = 1; }
    if (keyFallY > 1100 && textPhase === 1) { currentText = "The Sky Remembers The Damage";                              textPhase = 2; textAlpha = 0; }
    if (keyFallY > 1800 && textPhase === 2) { currentText = "But The Next Journey Is Different\nThe Future Is Electric"; textPhase = 3; textAlpha = 0; }
    if (keyFallY > 2400) {
      falling = false;
      shakeAmt = 0;
      currentText = "";
      goToScene("house");
    }
  }

  shakeAmt *= 0.9;
  fishX += swimSpeed * fishDir;
  if (fishX > 100 || fishX < 50) fishDir *= -1;
}

function renderScene() {
  let sx = random(-shakeAmt, shakeAmt);
  let sy = random(-shakeAmt, shakeAmt);
  push();
  translate(sceneX + sx, sceneY + sy);
  drawRoom(0, 0);
  drawDoor(0, 0);
  drawKeyHanger(0, 0);
  drawKey(keyX, keyY);
  drawTable(-10, 410, 180, 80);
  drawFishTank(25, 350);
  pop();
}

// =====================
// SCENE 2 - HOUSE
// =====================
function drawHouseScene() {
  background(219, 243, 251);
  drawClouds();

  // P2: draw ground BEFORE houses so road doesn't overdraw house bases
  noStroke(); fill(100, 180, 80);
  rect(0, 440, width, 60);
  fill(80, 80, 80);
  rect(0, 455, width, 45);
  stroke(255, 220, 0); strokeWeight(3);
  for (let x = 0; x < width; x += 80) line(x, 478, x + 40, 478);
  noStroke();

  drawScene2();

  if (petrolCarX > petrolStopX) petrolCarX -= 2;
  if (evCarX     > evStopX)     evCarX     -= 2;

  // Cars sit on road: y=430 so wheels touch road at y=430+60=490 ≈ road surface
  drawPetrolCarNoSmoke(petrolCarX, 430);
  drawEVCar(evCarX, 430);

  if (petrolCarX <= petrolStopX && evCarX <= evStopX) carsStopped = true;

  if (carsStopped) {
    let pulse = map(sin(frameCount * 0.08), -1, 1, 80, 200);
    noFill();
    stroke(200, 80, 80, pulse); strokeWeight(3);
    rect(petrolCarX - 5, 395, 155, 80, 8);
    stroke(50, 200, 120, pulse);
    rect(evCarX - 5, 395, 155, 80, 8);
    noStroke();

    if (chooseTextFading) chooseTextAlpha = max(0, chooseTextAlpha - 8);
    if (chooseTextAlpha > 0) {
      fill(20, 20, 20, chooseTextAlpha);
      textAlign(CENTER, CENTER);
      textSize(16); textStyle(BOLD);
      text("Choose a car", width / 2, 375);
      textStyle(NORMAL);
    }
  }
}

// =====================
// SCENE 2.5a - PETROL STATION
// Adapted from student's sketch.js petrol pump drawing
// =====================
function drawPetrolStation() {
  // Sky gradient feel
  background(200, 220, 255);

  // Ground
  noStroke(); fill(100, 180, 80);
  rect(0, 440, width, 60);
  fill(80, 80, 80);
  rect(0, 455, width, 45);
  stroke(255, 220, 0); strokeWeight(3);
  for (let x = 0; x < width; x += 80) line(x, 478, x + 40, 478);
  noStroke();

  // --- Station building (student's design, adapted) ---
  // Long roof
  fill("brown"); noStroke();
  rect(130, 200, 300, 22);

  // Big house body
  stroke("black"); strokeWeight(1.5); fill(240, 235, 210);
  rect(150, 222, 260, 220);

  // Chimney
  rect(375, 148, 20, 74);

  // Landscape strip on top (canopy)
  fill(180, 40, 40); rect(100, 165, 380, 55);
  fill(255, 255, 255, 80); rect(100, 165, 380, 15); // shine

  // Canopy pillars
  fill(140, 30, 30); noStroke();
  rect(118, 220, 14, 222);
  rect(468, 220, 14, 222);

  // Windows
  stroke("black"); strokeWeight(1.5); fill("white");
  rect(165, 242, 55, 50);
  line(193, 242, 193, 292);
  line(165, 267, 220, 267);
  rect(350, 242, 55, 50);
  line(377, 242, 377, 292);
  line(350, 267, 405, 267);

  // Door
  fill("gray"); rect(270, 315, 70, 127);
  fill("black"); circle(330, 382, 10);
  stroke("black"); line(270, 315, 340, 315);

  // "PETROL PUMP" sign
  fill(255, 0, 0); noStroke();
  rect(150, 157, 200, 35, 5);
  fill("white"); textSize(17); textAlign(CENTER, CENTER); textStyle(BOLD);
  text("PETROL PUMP", 250, 176);
  textStyle(NORMAL);

  // --- Petrol Pump Machine (student's design) ---
  // Pump body
  fill(200, 40, 40); noStroke();
  rect(400, 240, 100, 180, 10);
  // Screen
  fill("white"); rect(418, 268, 62, 32);
  fill(0, 200, 50); textSize(9); textAlign(CENTER, CENTER);
  text("Rs. 106.2/L", 449, 284);
  // Buttons row
  fill(40, 40, 40); noStroke();
  ellipse(428, 320, 12); ellipse(450, 320, 12); ellipse(472, 320, 12);
  // Pump label
  fill(255); textSize(9); textAlign(CENTER, CENTER); textStyle(BOLD);
  text("HP PETROL", 450, 350);
  textStyle(NORMAL);

  // Nozzle hose: from pump left side drooping down toward car fuel cap area
  let nozzleBaseX = 400, nozzleBaseY = 360;
  let nozzleTipX = 390 - stationNozzleAngle;  // swings left toward car when refuelling
  let nozzleTipY = nozzleBaseY + 90;
  stationNozzleAngle = lerp(stationNozzleAngle, stationNozzleTarget, 0.05);
  stroke(60, 60, 60); strokeWeight(5); noFill();
  bezier(nozzleBaseX, nozzleBaseY,
         nozzleBaseX - 20, nozzleBaseY + 40,
         nozzleTipX + 20, nozzleTipY - 30,
         nozzleTipX, nozzleTipY);

  // Nozzle tip
  push();
  translate(nozzleTipX, nozzleTipY);
  rotate(PI * 0.15);
  fill(80); noStroke();
  rect(-4, -14, 8, 18, 2);
  rect(-7, -16, 14, 6, 2);
  pop();

  // Oil drop symbol (student's design, centred on pump)
  fill(255, 200, 0);
  beginShape();
  vertex(450, 365);
  bezierVertex(425, 390, 430, 418, 450, 423);
  bezierVertex(470, 418, 475, 390, 450, 365);
  endShape(CLOSE);

  // --- Refuelling progress ---
  if (stationRefuelling) {
    stationFuelProgress += 0.8;
    stationNozzleTarget = 40;
    // Fuel bar
    fill(255); noStroke(); rect(160, 200, 200, 20, 5);
    fill(255, 140, 0); rect(160, 200, map(stationFuelProgress, 0, 100, 0, 200), 20, 5);
    fill(20); textSize(12); textAlign(CENTER, CENTER);
    text("Fuelling... " + int(stationFuelProgress) + "%", 260, 210);
    if (stationFuelProgress >= 100) {
      stationDone = true; stationRefuelling = false;
    }
  }

  // Car drives in from RIGHT, parks LEFT of pump (pump at x=400, car right edge at ~395)
  if (!stationCarParked) {
    stationCarX = max(stationCarX - 2, stationCarTargetX);
    if (stationCarX <= stationCarTargetX) {
      stationCarParked = true;
      stationClickReady = true;
      stationNozzleTarget = 40;
    }
  }

  // Draw car AFTER pump so it appears in front
  // Flipped: translate to right edge of car, scale(-1,1) so car body goes left
  // stationCarTargetX=180 → car spans x=180 to x=180+140=320, pump starts at 400 ✓
  push();
  translate(stationCarX + 140, 430);
  scale(-1, 1);
  // inline no-smoke petrol car body
  fill(180,40,40); noStroke(); rect(0,20,140,40,10);
  beginShape(); vertex(25,20);vertex(50,-10);vertex(100,-10);vertex(120,20); endShape(CLOSE);
  fill(180); quad(38,18,55,-5,75,-5,75,18); quad(82,18,82,-5,97,-5,112,18);
  fill(40); rect(128,40,15,5,3);
  fill(30); circle(30,60,35); circle(110,60,35);
  fill(120); circle(30,60,15); circle(110,60,15);
  fill(255,220,120); ellipse(0,25,10,10);
  pop();

  // Glow pulse on pump when ready
  if (stationClickReady && !stationRefuelling && !stationDone) {
    stationPumpGlow += stationPumpGlowDir * 4;
    if (stationPumpGlow > 200 || stationPumpGlow < 0) stationPumpGlowDir *= -1;
    noFill(); stroke(255, 160, 0, stationPumpGlow); strokeWeight(3);
    rect(398, 238, 104, 184, 12);
    noStroke();
  }

  // Prompt text
  stationClickAlpha = stationClickReady ? min(stationClickAlpha + 4, 255) : 0;
  fill(20, stationClickAlpha); noStroke(); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
  if (!stationRefuelling && !stationDone) text("Click pump to fuel up", width / 2, 145);
  textStyle(NORMAL);

  // Done — proceed button
  if (stationDone) {
    stationNozzleTarget = 0;
    fill(0, 0, 0, 200); noStroke(); rect(160, 135, 200, 35, 8);
    fill(255); textSize(14); textAlign(CENTER, CENTER); textStyle(BOLD);
    text("Fuelled up! ▶ Drive", 260, 153);
    textStyle(NORMAL);
  }
}

// =====================
// SCENE 2.5b - EV CHARGING STATION
// =====================
function drawEVStation() {
  background(210, 235, 255);

  // Ground
  noStroke(); fill(100, 180, 80);
  rect(0, 440, width, 60);
  fill(80, 80, 80);
  rect(0, 455, width, 45);
  stroke(255, 220, 0); strokeWeight(3);
  for (let x = 0; x < width; x += 80) line(x, 478, x + 40, 478);
  noStroke();

  // Station building
  fill(235, 245, 255); stroke(100, 150, 200); strokeWeight(1.5);
  rect(130, 222, 260, 220);

  // Canopy
  fill(30, 120, 200); noStroke();
  rect(100, 165, 380, 55);
  fill(255, 255, 255, 80); rect(100, 165, 380, 15);

  // Canopy pillars
  fill(20, 90, 160); noStroke();
  rect(118, 220, 14, 222);
  rect(468, 220, 14, 222);

  // Roof strip
  fill(50, 160, 230); noStroke();
  rect(130, 200, 260, 22);

  // Windows
  stroke(100, 150, 200); strokeWeight(1.5); fill("white");
  rect(165, 242, 55, 50);
  line(193, 242, 193, 292); line(165, 267, 220, 267);
  rect(350, 242, 55, 50);
  line(377, 242, 377, 292); line(350, 267, 405, 267);

  // Door
  fill(180, 210, 240); rect(270, 315, 70, 127);
  fill(30, 120, 200); circle(330, 382, 10);

  // Sign
  fill(30, 120, 200); noStroke();
  rect(150, 157, 240, 35, 5);
  fill("white"); textSize(17); textAlign(CENTER, CENTER); textStyle(BOLD);
  text("⚡ EV CHARGE POINT", 270, 176);
  textStyle(NORMAL);

  // --- Charging dock ---
  // Post
  fill(50, 60, 70); noStroke();
  rect(395, 265, 14, 155);

  // Dock unit
  fill(35, 50, 65); noStroke();
  rect(380, 240, 100, 140, 12);
  // Screen
  fill(0, 30, 50); rect(395, 255, 70, 40);
  fill(50, 220, 120); textSize(9); textAlign(CENTER, CENTER);
  text("22 kW  AC", 430, 268);
  fill(100, 200, 255); textSize(8);
  text("Rs. 8 / kWh", 430, 280);

  // Charge button
  fill(50, 220, 120); noStroke(); ellipse(430, 315, 28);
  fill(255); textSize(14); textAlign(CENTER, CENTER); textStyle(BOLD);
  text("⚡", 430, 316);
  textStyle(NORMAL);

  // Cable
  stroke(30, 200, 100); strokeWeight(5); noFill();
  bezier(380, 340, 340, 370, 310, 390, evStationCarParked ? 345 : 280, 425);
  // Connector
  fill(50, 220, 120); noStroke();
  ellipse(evStationCarParked ? 345 : 280, 425, 16, 16);

  // Ambient charge glow when charging
  if (evCharging) {
    evChargePulse = (evChargePulse + 0.07) % TWO_PI;
    let glow = map(sin(evChargePulse), -1, 1, 30, 120);
    noFill(); stroke(50, 220, 120, glow); strokeWeight(8);
    ellipse(430, 315, 46);
    noStroke();
  }

  // Solar panels on roof (EV station flavour)
  fill(30, 60, 120); noStroke();
  for (let px = 155; px < 380; px += 45) {
    rect(px, 168, 38, 48, 3);
    stroke(50, 80, 160); strokeWeight(0.5);
    line(px, 192, px + 38, 192);
    line(px + 19, 168, px + 19, 216);
    noStroke();
  }

  // Charge progress
  if (evCharging) {
    evChargeProgress += 0.6;
    fill(255); noStroke(); rect(160, 200, 200, 20, 5);
    fill(50, 220, 120); rect(160, 200, map(evChargeProgress, 0, 100, 0, 200), 20, 5);
    fill(20); textSize(12); textAlign(CENTER, CENTER);
    text("Charging... " + int(evChargeProgress) + "%", 260, 210);
    if (evChargeProgress >= 100) { evStationDone = true; evCharging = false; }
  }

  // Car drives in from RIGHT, faces LEFT toward charger
  if (!evStationCarParked) {
    evStationCarX = max(evStationCarX - 2, evStationCarTargetX);
    if (evStationCarX <= evStationCarTargetX) {
      evStationCarParked = true;
      evStationClickReady = true;
    }
  }
  push();
  translate(evStationCarX + 140, 430);
  scale(-1, 1);
  drawEVCar(0, 0);
  pop();

  // Glow on dock when ready
  if (evStationClickReady && !evCharging && !evStationDone) {
    let pg = map(sin(frameCount * 0.08), -1, 1, 60, 200);
    noFill(); stroke(50, 220, 120, pg); strokeWeight(3);
    rect(378, 238, 104, 144, 14);
    noStroke();
  }

  // Prompt text
  evStationClickAlpha = evStationClickReady ? min(evStationClickAlpha + 4, 255) : 0;
  fill(20, evStationClickAlpha); noStroke(); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
  if (!evCharging && !evStationDone) text("Click charger to plug in", width / 2, 145);
  textStyle(NORMAL);

  if (evStationDone) {
    fill(0, 0, 0, 200); noStroke(); rect(160, 135, 220, 35, 8);
    fill(255); textSize(14); textAlign(CENTER, CENTER); textStyle(BOLD);
    text("Charged up! ⚡ Drive", 270, 153);
    textStyle(NORMAL);
  }
}

// =====================
// SCENE 3 - DRIVE
// =====================
function drawDriveScene(carType) {
  let maxSpd = carType === "petrol" ? maxSpeedPetrol : maxSpeedEV;
  let accel  = carType === "petrol" ? accelPetrol    : accelEV;

  if (accelPressed)      speed = min(speed + accel, maxSpd);
  else if (brakePressed) speed = max(speed - brakeStrength, 0);
  else                   speed = max(speed - friction, 0);

  if (speed > 1) {
    if (carType === "petrol") fuel    = max(fuel    - fuelDrain    * (speed / maxSpd), 0);
    else                      battery = max(battery - batteryDrain * (speed / maxSpd), 0);
    distanceTravelled += speed * 0.01;
  }

  roadOffset  = (roadOffset  + speed * 0.5) % 80;
  treeOffset  = (treeOffset  + speed * 0.3) % 1000;

  drawRoad(carType);
  // Trees drawn before interior, clipped to windshield
  drawTreesClipped();
  drawCarInterior(carType);
  drawDashboard(carType);
  drawNewsLED(carType);
  // Pedal visual feedback replaces GO/STOP buttons
  drawPedals(carType);

  fill(180, 180); noStroke(); textAlign(CENTER); textSize(10);
  text("Press pedals to drive   |   tap upper area for facts", width / 2, 195);

  // P1: second-path intro card overlay
  if (showSecondPathCard) {
    secondPathCardTimer++;
    if (secondPathCardTimer < 120) {
      secondPathCardAlpha = min(secondPathCardAlpha + 6, 220);
    } else {
      secondPathCardAlpha = max(secondPathCardAlpha - 5, 0);
    }
    if (secondPathCardAlpha <= 0 && secondPathCardTimer > 120) {
      showSecondPathCard = false;
    } else {
      let label = carType === "ev" ? "⚡ Now experience the EV" : "⛽ Now experience the petrol car";
      noStroke(); fill(0, secondPathCardAlpha);
      rect(110, 210, 380, 60, 10);
      fill(255, secondPathCardAlpha); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(16);
      text(label, width / 2, 235);
      textStyle(NORMAL); fill(180, secondPathCardAlpha); textSize(11);
      text("See how the other side drives", width / 2, 255);
    }
  }
}

function drawRoad(carType) {
  let skyR = carType === "petrol" ? int(map(speed, 0, maxSpeedPetrol, 135, 160)) : 135;
  let skyG = carType === "petrol" ? int(map(speed, 0, maxSpeedPetrol, 195, 165)) : 195;
  background(skyR, skyG, 235);

  if (carType === "petrol" && speed > 20) {
    let smog = map(speed, 20, maxSpeedPetrol, 0, 80);
    noStroke(); fill(160, 140, 100, smog);
    rect(0, 0, width, 310);
  }

  fill(80, 80, 80); noStroke(); rect(0, 310, width, 190);

  stroke(255, 220, 0); strokeWeight(3);
  for (let x = -roadOffset; x < width + 80; x += 80) {
    line(x, 400, x + 40, 400);
  }
  noStroke();
  fill(255); rect(0, 310, width, 7);
}

// Trees clipped to windshield, perspective-correct
function drawTreesClipped() {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.moveTo(95, 190);
  drawingContext.lineTo(250, 0);
  drawingContext.lineTo(350, 0);
  drawingContext.lineTo(505, 190);
  drawingContext.closePath();
  drawingContext.clip();

  // Trees travel from horizon (t=0, small, near centre) to sides (t=1, large)
  // treeOffset 0→1000, each tree has phase offset so 6 are staggered
  let numTrees = 6;
  for (let i = 0; i < numTrees; i++) {
    let phase = i / numTrees;
    let t = ((phase + treeOffset / 1000) % 1.0);
    if (t < 0.04) continue; // hide pop-in at horizon

    // Vanishing point x=300 (road centre), horizon y=192
    // Left tree: starts at (280,192), travels to (60, 188)
    // Right tree: mirror
    let lx = lerp(280, 50, t);
    let ly = lerp(192, 185, t);
    let rx = lerp(320, 550, t);
    let ry = lerp(192, 185, t);

    let s = map(t, 0.04, 1.0, 0.05, 1.0);
    let trunkW  = max(2, 9 * s);
    let trunkH  = max(3, 42 * s);
    let leafW   = max(3, 48 * s);
    let leafH   = max(4, 55 * s);
    let bright  = int(map(t, 0.04, 1.0, 55, 140));
    let tbright = int(map(t, 0.04, 1.0, 40, 100));

    // Left tree
    fill(tbright, int(tbright * 0.55), 10); noStroke();
    rect(lx - trunkW/2, ly - trunkH, trunkW, trunkH);
    fill(18, bright, 30);
    ellipse(lx, ly - trunkH - leafH*0.28, leafW, leafH);
    ellipse(lx - leafW*0.32, ly - trunkH + leafH*0.1, leafW*0.6, leafH*0.5);
    ellipse(lx + leafW*0.32, ly - trunkH + leafH*0.1, leafW*0.6, leafH*0.5);

    // Right tree
    fill(tbright, int(tbright * 0.55), 10); noStroke();
    rect(rx - trunkW/2, ry - trunkH, trunkW, trunkH);
    fill(18, bright, 30);
    ellipse(rx, ry - trunkH - leafH*0.28, leafW, leafH);
    ellipse(rx - leafW*0.32, ry - trunkH + leafH*0.1, leafW*0.6, leafH*0.5);
    ellipse(rx + leafW*0.32, ry - trunkH + leafH*0.1, leafW*0.6, leafH*0.5);
  }

  drawingContext.restore();
}

function drawCarInterior(carType) {
  fill(84, 82, 82); noStroke();
  beginShape();
  vertex(0,500); vertex(0,205); vertex(60,190);
  vertex(0,50); vertex(0,0); vertex(5,0); vertex(100,190);
  endShape(CLOSE);
  beginShape();
  vertex(0,500); vertex(100,190); vertex(500,190); vertex(600,500);
  endShape(CLOSE);
  beginShape();
  vertex(600,500); vertex(600,205); vertex(540,190);
  vertex(600,50); vertex(600,0); vertex(595,0); vertex(500,190);
  endShape(CLOSE);

  fill(carType === "ev" ? color(35,50,65) : color(58,52,52));
  rect(50, 191, 500, 125, 10);

  fill(carType === "ev" ? color(45,62,80) : color(68,62,62));
  rect(250, 316, 100, 184, 10);

  fill(carType === "ev" ? color(95,115,185,160) : color(90,105,65,160));
  beginShape();
  vertex(95,190); vertex(250,0); vertex(350,0); vertex(505,190);
  endShape(CLOSE);

  fill(210,210,210);
  circle(460, 250, 150);
  fill(carType === "ev" ? color(35,50,65) : color(58,52,52));
  circle(460, 250, 120);
  fill(0);
  rect(420, 200, 80, 50, 15, 15, 0, 0);

  fill(210,210,210);
  beginShape();
  vertex(400,240); vertex(520,240); vertex(520,260);
  vertex(470,260); vertex(470,310); vertex(450,310);
  vertex(450,260); vertex(400,260);
  endShape(CLOSE);

  fill(112,108,108); noStroke();
  rect(60, 250, 150, 50, 5);
  fill(0); rect(110, 280, 50, 10, 5);
  fill(112,108,108);
  circle(90, 220, 30); circle(150, 220, 30);
  fill(0); circle(90, 220, 22); circle(150, 220, 22);
  stroke("grey"); strokeWeight(1);
  line(84,212,96,212); line(80,215,100,215); line(80,218,100,218);
  line(80,221,100,221); line(80,224,100,224); line(84,227,96,227);
  line(144,212,156,212); line(140,215,160,215); line(140,218,160,218);
  line(140,221,160,221); line(140,224,160,224); line(144,227,156,227);

  fill(112,108,108); noStroke();
  beginShape(); vertex(460,316);vertex(470,316);vertex(470,320);vertex(480,320);vertex(480,360);vertex(455,360);vertex(455,320);vertex(460,320); endShape(CLOSE);
  beginShape(); vertex(500,316);vertex(510,316);vertex(510,320);vertex(520,320);vertex(520,350);vertex(495,350);vertex(495,320);vertex(500,320); endShape(CLOSE);
  stroke(80); strokeWeight(1);
  line(500,330,515,330); line(500,340,515,340);
  line(460,330,475,330); line(460,340,475,340); line(460,350,475,350);

  fill(112,108,108); noStroke();
  rect(60,430,170,70,15,15,5,5);
  rect(370,430,170,70,15,15,5,5);

  fill(255); noStroke();
  rect(290,10,20,20); rect(290,50,20,40); rect(290,110,20,80);
}

// Pedals replacing GO/STOP buttons
function drawPedals(carType) {
  // ---- Accelerator pedal (right floor) ----
  let aPressed = accelPressed;
  push();
  translate(470, 455);
  if (aPressed) scale(0.90);
  fill(aPressed ? (carType === "ev" ? color(30,200,100) : color(200,140,30)) : color(80,80,80));
  stroke(40); strokeWeight(2);
  // Pedal plate shape
  beginShape();
  vertex(-28, -22); vertex(28, -22);
  vertex(32, 22);   vertex(-32, 22);
  endShape(CLOSE);
  // Ribbing
  stroke(aPressed ? 255 : 120); strokeWeight(1.5);
  for (let rx = -18; rx <= 18; rx += 9) {
    line(rx, -18, rx, 18);
  }
  // Label
  fill(aPressed ? 30 : 200); noStroke(); textAlign(CENTER, CENTER); textSize(8); textStyle(BOLD);
  text("GAS", 0, 0);
  textStyle(NORMAL);
  pop();

  // Pedal stem
  fill(60); noStroke();
  rect(462, 478, 16, 22, 2);

  // ---- Brake pedal (left floor) ----
  let bPressed = brakePressed;
  push();
  translate(130, 455);
  if (bPressed) scale(0.90);
  fill(bPressed ? color(200,40,40) : color(80,80,80));
  stroke(40); strokeWeight(2);
  beginShape();
  vertex(-32, -22); vertex(32, -22);
  vertex(36, 22);   vertex(-36, 22);
  endShape(CLOSE);
  stroke(bPressed ? 255 : 120); strokeWeight(1.5);
  for (let rx = -22; rx <= 22; rx += 9) line(rx, -18, rx, 18);
  fill(bPressed ? 30 : 200); noStroke(); textAlign(CENTER, CENTER); textSize(8); textStyle(BOLD);
  text("BRAKE", 0, 0);
  textStyle(NORMAL);
  pop();

  fill(60); noStroke();
  rect(122, 478, 16, 22, 2);

  // Subtle labels below
  fill(140); noStroke(); textAlign(CENTER); textSize(9);
  text("ACCELERATE", 470, 493);
  text("BRAKE", 130, 493);
}

function drawDashboard(carType) {
  let maxSpd = carType === "petrol" ? maxSpeedPetrol : maxSpeedEV;
  let resource = carType === "petrol" ? fuel : battery;
  let accentCol = carType === "ev" ? color(50,220,120) : color(255,130,30);

  // ── Instrument cluster panel ──
  fill(carType === "ev" ? color(20,32,45) : color(28,24,24)); noStroke();
  rect(55, 198, 340, 108, 8);
  // inner bevel
  stroke(carType === "ev" ? color(40,65,90) : color(60,50,50)); strokeWeight(1); noFill();
  rect(58, 201, 334, 102, 6);
  noStroke();

  // ═══ SPEEDOMETER (large, left) ═══
  let scx = 128, scy = 252, sr = 44;
  // dial background
  fill(0); noStroke(); circle(scx, scy, sr*2+4);
  // arc track
  stroke(50); strokeWeight(3); noFill();
  arc(scx, scy, sr*2, sr*2, -PI*0.8, PI*0.8);
  // coloured speed arc
  let needleA = map(speed, 0, maxSpd, -PI*0.8, PI*0.8);
  stroke(accentCol); strokeWeight(3); noFill();
  arc(scx, scy, sr*2, sr*2, -PI*0.8, needleA);
  // tick marks
  for (let i = 0; i <= 10; i++) {
    let a = map(i, 0, 10, -PI*0.8, PI*0.8);
    let isMajor = (i % 2 === 0);
    stroke(isMajor ? 200 : 80); strokeWeight(isMajor ? 1.5 : 0.8);
    let inner = isMajor ? sr - 9 : sr - 5;
    line(scx + cos(a)*inner, scy + sin(a)*inner, scx + cos(a)*sr, scy + sin(a)*sr);
    if (isMajor) {
      fill(140); noStroke(); textAlign(CENTER,CENTER); textSize(5.5);
      text(int(map(i, 0, 10, 0, maxSpd)), scx + cos(a)*(sr-15), scy + sin(a)*(sr-15));
    }
  }
  // needle
  stroke(255,60,60); strokeWeight(2);
  line(scx, scy, scx + cos(needleA)*(sr-6), scy + sin(needleA)*(sr-6));
  fill(200); noStroke(); circle(scx, scy, 7);
  // speed readout
  fill(255); textAlign(CENTER,CENTER); textSize(13); textStyle(BOLD);
  text(int(speed), scx, scy + 4);
  textStyle(NORMAL);
  fill(accentCol); textSize(6);
  text("km/h", scx, scy + 17);
  // label
  fill(100); textSize(6); textAlign(CENTER);
  text("SPEED", scx, scy + 45);

  // ═══ FUEL / BATTERY gauge (centre-right) ═══
  let gx = 232, gy = 220, gw = 58, gh = 12;
  // label
  fill(accentCol); textSize(7); textAlign(LEFT); noStroke();
  text(carType === "ev" ? "BATTERY" : "FUEL", gx, gy - 2);
  // track
  fill(25); noStroke(); rect(gx, gy + 2, gw, gh, 3);
  // fill
  let barCol = resource > 40 ? accentCol : resource > 20 ? color(255,180,0) : color(255,40,40);
  fill(barCol); rect(gx, gy + 2, map(resource, 0, 100, 0, gw), gh, 3);
  // value
  fill(220); textSize(8); textAlign(LEFT);
  text(int(resource) + "%", gx + gw + 4, gy + 11);
  // warning
  if (resource < 20) {
    let warn = map(sin(frameCount * 0.15), -1, 1, 80, 255);
    fill(255, 40, 40, warn); textSize(8); textAlign(LEFT);
    text("LOW!", gx + gw + 4, gy + 22);
  }

  // ═══ ODO ═══
  let ox = gx, oy = gy + 26;
  fill(0); noStroke(); rect(ox, oy, gw, 13, 3);
  fill(0,220,80); textSize(8); textAlign(CENTER,CENTER);
  text(distanceTravelled.toFixed(1) + " km", ox + gw/2, oy + 6);
  fill(100); textSize(6); textAlign(LEFT);
  text("ODO", ox, oy + 20);

  // ═══ RPM arc (petrol) / EFF indicator (EV) ═══
  if (carType === "petrol") {
    let rx = 232, ry = 278, rr = 26;
    fill(0); noStroke(); circle(rx, ry, rr*2+4);
    stroke(50); strokeWeight(2); noFill();
    arc(rx, ry, rr*2, rr*2, -PI*0.8, PI*0.8);
    let ra = map(speed, 0, maxSpeedPetrol, -PI*0.8, PI*0.8);
    stroke(255,120,0); strokeWeight(2);
    arc(rx, ry, rr*2, rr*2, -PI*0.8, ra);
    stroke(255,180,80); strokeWeight(1.5);
    line(rx, ry, rx + cos(ra)*(rr-5), ry + sin(ra)*(rr-5));
    fill(180); noStroke(); circle(rx, ry, 5);
    fill(150); textSize(6); textAlign(CENTER,CENTER);
    text("RPM", rx, ry + rr + 6);
    let rpmVal = int(map(speed, 0, maxSpeedPetrol, 800, 6500));
    fill(200); textSize(7);
    text(rpmVal, rx, ry + 2);
  }

  if (carType === "ev") {
    let ex = 232, ey = 264;
    // Power flow indicator
    fill(0); noStroke(); rect(ex - 30, ey - 12, 60, 44, 5);
    let pwrLabel = speed < 3 ? "IDLE" : accelPressed ? "DRIVE" : brakePressed ? "REGEN" : "COAST";
    let pwrCol   = speed < 3 ? color(100) : accelPressed ? color(50,220,120) : brakePressed ? color(100,180,255) : color(180);
    fill(pwrCol); textSize(8); textAlign(CENTER,CENTER); textStyle(BOLD);
    text(pwrLabel, ex, ey + 2);
    textStyle(NORMAL);
    // Efficiency dot ring
    let effRings = 3;
    for (let r = 0; r < effRings; r++) {
      let ringAlpha = speed > 5 && accelPressed ? map(sin(frameCount*0.1 + r*1.2), -1,1, 40, 140) : 30;
      stroke(50,220,120,ringAlpha); strokeWeight(1); noFill();
      circle(ex, ey + 2, 24 + r*8);
    }
    noStroke(); fill(150); textSize(6); textAlign(CENTER);
    text("POWER MODE", ex, ey + 26);
  }

  // ═══ Gear / status indicator ═══
  let stx = 296, sty = 220;
  fill(0); noStroke(); rect(stx, sty, 88, 80, 5);
  // gear P/D/R
  let gearLabel = speed < 1 ? "P" : "D";
  fill(accentCol); textSize(18); textAlign(CENTER,CENTER); textStyle(BOLD);
  text(gearLabel, stx + 20, sty + 24);
  textStyle(NORMAL);
  // temp (petrol) or range (ev)
  if (carType === "petrol") {
    let temp = int(map(speed, 0, maxSpeedPetrol, 75, 102));
    fill(temp > 95 ? color(255,80,80) : color(180)); textSize(7); textAlign(CENTER,CENTER);
    text("ENG", stx + 60, sty + 14);
    fill(temp > 95 ? color(255,80,80) : color(220)); textSize(10);
    text(temp + "°C", stx + 60, sty + 27);
  } else {
    let range = int((battery / 100) * 280);
    fill(accentCol); textSize(7); textAlign(CENTER,CENTER);
    text("RANGE", stx + 60, sty + 14);
    fill(220); textSize(10);
    text(range + " km", stx + 60, sty + 27);
  }
  // speed limit sign
  fill(255); noStroke(); circle(stx + 44, sty + 58, 18);
  stroke(255,0,0); strokeWeight(2); noFill(); circle(stx + 44, sty + 58, 18);
  fill(20); noStroke(); textSize(7); textAlign(CENTER,CENTER); textStyle(BOLD);
  text("80", stx + 44, sty + 59);
  textStyle(NORMAL);
}

function drawNewsLED(carType) {
  let news = carType === "petrol" ? newsPetrol : newsEV;

  // LED screen below instrument cluster
  fill(0, 28, 0); noStroke();
  rect(55, 310, 340, 24, 4);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(57, 312, 336, 20);
  drawingContext.clip();

  newsX -= 1.2 + speed * 0.008;
  textAlign(LEFT, CENTER); textSize(8);
  fill(0, 255, 80); noStroke();
  text(">> " + news[newsIndex], newsX, 322);

  if (newsX < 57 - textWidth(">> " + news[newsIndex]) - 10) {
    newsX = 400;
    newsIndex = (newsIndex + 1) % news.length;
  }

  drawingContext.restore();

  stroke(0, 160, 40); strokeWeight(1); noFill();
  rect(55, 310, 340, 24, 4);
  noStroke();
}

// =====================
// SCENE 4 - FACTS
// =====================
function drawFacts(factsArray) {
  // Deep space background
  background(6, 4, 18);
  // Subtle star field
  randomSeed(42);
  noStroke(); fill(255, 60);
  for (let i = 0; i < 80; i++) {
    let sx = random(width), sy = random(height * 0.85);
    let ss = random(0.5, 2);
    circle(sx, sy, ss);
  }
  randomSeed(0);

  let isEV = (sceneState === "facts_ev");
  let accentCol = isEV ? color(50, 220, 120) : color(255, 130, 40);
  let accentDim  = isEV ? color(20, 80, 45)  : color(100, 50, 10);

  if (factIndex >= factsArray.length) {
    if (!factsTransitioning) {
      factsTransitioning = true;
      if (!secondPath) {
        secondPath = true;
        goToScene(firstCarChosen === "petrol" ? "drive_ev" : "drive_petrol");
      } else {
        secondPath = false;
        goToScene("ending");
      }
    }
    return;
  }

  let f = factsArray[factIndex];
  factAlpha = lerp(factAlpha, 255, 0.05);

  // Progress bar at top
  let barW = map(factIndex, 0, factsArray.length, 0, width);
  fill(accentDim); noStroke(); rect(0, 0, width, 4);
  fill(accentCol); rect(0, 0, barW, 4);

  // Category tag
  let tag = isEV ? "⚡  ELECTRIC VEHICLE" : "⛽  PETROL";
  fill(accentCol, factAlpha * 0.7); noStroke(); textSize(10); textAlign(CENTER, TOP); textStyle(BOLD);
  text(tag, width/2, 18);
  textStyle(NORMAL);

  // Horizontal accent lines flanking number
  let lineAlpha = factAlpha;
  let lineW = map(factAlpha, 0, 255, 0, 110);
  stroke(accentCol, lineAlpha); strokeWeight(1.5);
  line(width/2 - lineW - 20, height/2 - 68, width/2 - 20, height/2 - 68);
  line(width/2 + 20, height/2 - 68, width/2 + lineW + 20, height/2 - 68);
  noStroke();

  // Big number — with glow effect
  textAlign(CENTER, CENTER); textStyle(BOLD);
  // glow pass
  fill(accentCol, factAlpha * 0.12); textSize(72);
  for (let d = 6; d >= 1; d--) {
    text(f.big, width/2 + d, height/2 - 22);
    text(f.big, width/2 - d, height/2 - 22);
  }
  // crisp pass
  fill(255, factAlpha); textSize(68);
  text(f.big, width/2, height/2 - 22);
  textStyle(NORMAL);

  // Accent divider dot
  fill(accentCol, factAlpha); noStroke(); circle(width/2, height/2 + 28, 7);

  // Description
  fill(210, factAlpha); textSize(15); textAlign(CENTER, CENTER);
  text(f.small, width/2, height/2 + 58);

  // Fact number badge
  fill(accentDim, factAlpha * 0.8); noStroke();
  rect(width/2 - 28, height/2 + 85, 56, 18, 9);
  fill(accentCol, factAlpha); textSize(8); textAlign(CENTER, CENTER);
  text("FACT " + (factIndex+1) + " of " + factsArray.length, width/2, height/2 + 94);

  // Progress dots (larger, spaced)
  for (let i = 0; i < factsArray.length; i++) {
    let dotX = width/2 - (factsArray.length - 1) * 14 + i * 28;
    if (i === factIndex) {
      fill(accentCol); circle(dotX, 450, 10);
    } else if (i < factIndex) {
      fill(accentDim); circle(dotX, 450, 8);
    } else {
      fill(40); circle(dotX, 450, 6);
    }
  }

  // Click hint — gentle pulse
  let hint = map(sin(frameCount * 0.05), -1, 1, 90, 200);
  fill(130, hint * (factAlpha / 255)); noStroke();
  textSize(11); textAlign(CENTER, CENTER);
  text("tap to continue  →", width/2, 477);
}

// =====================
// SCENE 5 - ENDING
// =====================
function drawEnding() {
  // Sunrise gradient
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c;
    if (t < 0.4) c = lerpColor(color(8,8,35), color(60,20,80), t/0.4);
    else if (t < 0.7) c = lerpColor(color(60,20,80), color(200,80,30), (t-0.4)/0.3);
    else c = lerpColor(color(200,80,30), color(255,160,60), (t-0.7)/0.3);
    stroke(c); line(0, y, width, y);
  }
  noStroke();

  endingAlpha = min(endingAlpha + 1.2, 255);
  // Looping EV car
  endCarX += 1.2;
  if (endCarX > width + 160) endCarX = -160;

  // Road strip at bottom
  fill(50,50,50); noStroke(); rect(0, 390, width, 110);
  fill(255); rect(0, 390, width, 4);
  stroke(255,220,0); strokeWeight(3);
  for (let x = (endCarX * 0.3) % 80 - 80; x < width + 80; x += 80) line(x, 430, x+40, 430);
  noStroke();

  drawEVCar(endCarX, 360);

  // Main headline
  fill(255, endingAlpha); textAlign(CENTER, CENTER); textStyle(BOLD); textSize(30);
  text("The Future Is Electric.", width/2, 60);
  textStyle(NORMAL);

  if (endingAlpha < 80) return; // stagger reveals

  // ── Comparison card ──
  let ca = constrain(endingAlpha - 80, 0, 255);
  fill(0, 0, 0, ca * 0.7); noStroke(); rect(30, 85, 540, 128, 10);
  stroke(255, ca * 0.2); strokeWeight(1); noFill(); rect(30, 85, 540, 128, 10); noStroke();

  // Divider line
  fill(80, ca); noStroke(); rect(298, 95, 2, 108);

  // — Petrol column —
  fill(255,130,40, ca); textSize(11); textAlign(CENTER, CENTER); textStyle(BOLD);
  text("⛽  PETROL", 162, 103);
  textStyle(NORMAL);
  let pRows = [
    ["CO2 per litre", "2.3 kg"],
    ["Import dependency", "85%"],
    ["Price volatility", "HIGH"],
    ["Cost per 100km", "~₹550"],
    ["Emissions", "HIGH"]
  ];
  for (let i = 0; i < pRows.length; i++) {
    fill(160, ca); textSize(8.5); textAlign(RIGHT, CENTER);
    text(pRows[i][0], 228, 122 + i*18);
    fill(255,180,80, ca); textSize(9); textAlign(LEFT, CENTER); textStyle(BOLD);
    text(pRows[i][1], 236, 122 + i*18);
    textStyle(NORMAL);
  }

  // — EV column —
  fill(50,220,120, ca); textSize(11); textAlign(CENTER, CENTER); textStyle(BOLD);
  text("⚡  ELECTRIC", 438, 103);
  textStyle(NORMAL);
  let eRows = [
    ["CO2 per km", "0 kg"],
    ["Energy source", "GRID / SOLAR"],
    ["Price stability", "LOW"],
    ["Cost per 100km", "~₹80"],
    ["Emissions", "ZERO"]
  ];
  for (let i = 0; i < eRows.length; i++) {
    fill(160, ca); textSize(8.5); textAlign(RIGHT, CENTER);
    text(eRows[i][0], 404, 122 + i*18);
    fill(100,255,160, ca); textSize(9); textAlign(LEFT, CENTER); textStyle(BOLD);
    text(eRows[i][1], 412, 122 + i*18);
    textStyle(NORMAL);
  }

  // Tagline
  if (endingAlpha > 180) {
    let ta = constrain(endingAlpha - 180, 0, 255);
    fill(220, ta); textSize(13); textAlign(CENTER, CENTER);
    text("The choice was always yours.", width/2, 230);
    // Small India context note
    fill(150, ta); textSize(9);
    text("India is the world's 3rd largest oil importer. Every EV matters.", width/2, 252);
  }

  // Restart hint
  if (endingAlpha > 220) {
    let ra = constrain(endingAlpha - 220, 0, 255);
    let pulse = map(sin(frameCount * 0.05), -1, 1, 80, 200);
    fill(120, pulse * ra / 255); noStroke(); textSize(10); textAlign(CENTER, CENTER);
    text("↩  click anywhere to restart", width/2, 478);
  }
}

// =====================
// MOUSE PRESSED
// =====================
function mousePressed() {

  if (sceneState === "intro") {
    if (falling) return;
    if (dist(mouseX, mouseY, keyX, keyY) < 30) falling = true;
    return;
  }

  if (sceneState === "house" && carsStopped) {
    chooseTextFading = true;
    if (mouseX > petrolCarX && mouseX < petrolCarX+145 && mouseY > 395 && mouseY < 490) {
      selectedCar = "petrol";
      firstCarChosen = "petrol";
      secondPath = false;
      goToScene("station_petrol");
      return;
    }
    if (mouseX > evCarX && mouseX < evCarX+145 && mouseY > 395 && mouseY < 490) {
      selectedCar = "ev";
      firstCarChosen = "ev";
      secondPath = false;
      goToScene("station_ev");
      return;
    }
  }

  if (sceneState === "station_petrol") {
    // Click pump body to start fuelling
    if (stationClickReady && !stationRefuelling && !stationDone) {
      if (mouseX > 400 && mouseX < 500 && mouseY > 240 && mouseY < 420) {
        stationRefuelling = true;
      }
    }
    // Click proceed banner when done
    if (stationDone) {
      if (mouseX > 160 && mouseX < 360 && mouseY > 135 && mouseY < 170) {
        goToScene("drive_petrol");
      }
    }
    return;
  }

  if (sceneState === "station_ev") {
    if (evStationClickReady && !evCharging && !evStationDone) {
      if (mouseX > 380 && mouseX < 480 && mouseY > 240 && mouseY < 380) {
        evCharging = true;
      }
    }
    if (evStationDone) {
      if (mouseX > 160 && mouseX < 380 && mouseY > 135 && mouseY < 170) {
        goToScene("drive_ev");
      }
    }
    return;
  }

  if (sceneState === "drive_petrol" || sceneState === "drive_ev") {
    // Accelerator pedal — right floor
    if (mouseX > 438 && mouseX < 502 && mouseY > 433 && mouseY < 477) {
      accelPressed = true; return;
    }
    // Brake pedal — left floor
    if (mouseX > 94 && mouseX < 166 && mouseY > 433 && mouseY < 477) {
      brakePressed = true; return;
    }
    // Upper area → go to facts
    if (mouseY < 200) {
      accelPressed = false; brakePressed = false;
      goToScene(sceneState === "drive_petrol" ? "facts_petrol" : "facts_ev");
    }
    return;
  }

  if (sceneState === "facts_petrol" || sceneState === "facts_ev") {
    factIndex++; factAlpha = 0; return;
  }

  if (sceneState === "ending" && endingAlpha > 220) {
    // Full restart
    sceneState = "intro";
    falling = false; keyFallY = 0; fallVelocity = 0; shakeAmt = 0;
    textPhase = 0; currentText = ""; textAlpha = 0; showGrabText = true;
    sceneY = 0; swing = radians(45);
    secondPath = false; firstCarChosen = ""; factsTransitioning = false;
    return;
  }
}

function mouseReleased() {
  accelPressed = false;
  brakePressed = false;
}

// =====================
// ORIGINAL DRAW HELPERS
// =====================
function drawRoom(x, y) {
  push(); translate(x,y);
  stroke(0); strokeWeight(2);
  line(300,0,300,400);
  fill("grey"); triangle(300,400,0,500,600,500);
  pop();
}

function drawDoor(x, y) {
  push(); translate(x,y);
  stroke(0); strokeWeight(2); fill("burlywood");
  beginShape(); vertex(340,185);vertex(340,412);vertex(470,456);vertex(470,217); endShape(CLOSE);
  fill("black"); circle(460,340,10);
  pop();
}

function drawKeyHanger(x, y) {
  push(); translate(x,y);
  stroke(0); strokeWeight(2); fill("wheat");
  beginShape(); vertex(200,218);vertex(200,238);vertex(250,228);vertex(250,208); endShape(CLOSE);
  line(240,225,240,240);
  pop();
}

function drawKey(x, y) {
  push();
  translate(x, y + keyFallY);
  if (falling) rotate(swing + keyFallY * 0.03);
  else         rotate(swing);
  if (hoveringKey && !falling) { stroke("green"); strokeWeight(4); fill(220); }
  else                          { stroke(0);       strokeWeight(2); fill("grey"); }
  circle(0,0,10); fill(217,175,182); circle(0,0,5);
  noFill(); circle(5,0,5);
  fill(150); stroke(50); strokeWeight(1);
  beginShape();
  vertex(7,-2);vertex(15,-2);vertex(15,-1);vertex(18,-1);
  vertex(18,1);vertex(16,1);vertex(16,3);vertex(13,3);vertex(13,1);vertex(7,1);
  endShape(CLOSE);
  pop();
}

function drawTable(x, y, w, h) {
  push(); translate(x,y); stroke(0); strokeWeight(2);
  fill("saddlebrown"); beginShape(); vertex(0,0);vertex(w,-50);vertex(w+40,-20);vertex(40,30); endShape(CLOSE);
  fill("peru");        beginShape(); vertex(40,30);vertex(w+40,-20);vertex(w+40,h-40);vertex(40,h+10); endShape(CLOSE);
  fill("sienna");      beginShape(); vertex(0,0);vertex(40,30);vertex(40,h+10);vertex(0,h-10); endShape(CLOSE);
  line(40,50,w+40,0);
  circle((w/2)+40,15,5); circle((w/2)+40,35,5); circle((w/2)+40,55,5);
  line(40,70,w+40,20);
  pop();
}

function drawFishTank(x, y) {
  push(); stroke(40); strokeWeight(2);
  fill(120,180,220,120); beginShape(); vertex(x,y);vertex(x+90,y-25);vertex(x+120,y-5);vertex(x+30,y+20); endShape(CLOSE);
  fill(100,170,210,100); beginShape(); vertex(x+30,y+20);vertex(x+120,y-5);vertex(x+120,y+50);vertex(x+30,y+75); endShape(CLOSE);
  fill(80,150,200,90);   beginShape(); vertex(x,y);vertex(x+30,y+20);vertex(x+30,y+75);vertex(x,y+55); endShape(CLOSE);
  noStroke(); fill("tan");
  ellipse(x+20,y+52,8); ellipse(x+40,y+58,8); ellipse(x+60,y+54,8);
  stroke("green"); noFill();
  bezier(x+35,y+50,x+30,y+35,x+45,y+30,x+38,y+15);
  bezier(x+70,y+55,x+65,y+40,x+78,y+30,x+72,y+12);
  push();
  translate(x+fishX,y+30);
  if (fishDir < 0) scale(-1,1);
  noStroke(); fill("orange"); ellipse(0,0,18,10); triangle(-8,0,-17,-5,-17,5);
  fill(0); circle(5,-2,2);
  pop(); pop();
}

function renderCinematic() {
  if (!falling && shakeAmt < 0.5) return;
  let darkness = map(keyFallY, 0, 2400, 0, 220);
  noStroke(); fill(0, darkness);
  rect(0, 0, width, height);
  let barH = map(keyFallY, 0, 2400, 0, 80);
  fill(0);
  rect(0, 0, width, barH);
  rect(0, height - barH, width, barH);
  if (currentText !== "") {
    textAlpha = lerp(textAlpha, 255, 0.03);
    fill(255, textAlpha);
    textAlign(CENTER, CENTER);
    textStyle(BOLD); textSize(34);
    text(currentText, width / 2, height / 2);
    textStyle(NORMAL);
  }
}

function drawScene2() {
  drawHouse2();
  push(); translate(width,0); scale(-1,1); drawHouse2(); pop();
}

function drawHouse2() {
  push(); fill("burlywood"); stroke(0); strokeWeight(1);
  rect(500,385,100,115); rect(300,385,100,115);
  fill("grey"); rect(400,385,100,115);
  fill("wheat"); rect(375,285,200,100);
  push(); fill("grey"); noStroke(); ellipse(450,385,100,50); pop();
  fill("black"); stroke(0); strokeWeight(1);
  line(325,385,325,500); line(350,385,350,500); line(375,385,375,500);
  line(525,385,525,500); line(550,385,550,500); line(575,385,575,500);
  circle(485,450,10);
  fill("wheat");
  beginShape(); vertex(325,385);vertex(325,285);vertex(350,225);vertex(375,285);vertex(375,385); endShape(CLOSE);
  fill("grey");
  beginShape(); vertex(350,225);vertex(550,225);vertex(575,285);vertex(375,285); endShape(CLOSE);
  fill("white"); rect(515,315,40,70); rect(400,315,40,30);
  fill("black"); circle(520,350,5);
  line(420,315,420,345); line(400,330,440,330);
  pop();
}

function drawPetrolCar(x, y) {
  push(); translate(x,y);
  // Exhaust smoke only when moving
  if (speed > 5) {
    noStroke(); fill(80,80,80,140);
    ellipse(150+random(-1,1),35,20,20); ellipse(170+random(-1,1),30,28,28); ellipse(190+random(-1,1),25,35,35);
  }
  fill(180,40,40); rect(0,20,140,40,10);
  beginShape(); vertex(25,20);vertex(50,-10);vertex(100,-10);vertex(120,20); endShape(CLOSE);
  fill(180); quad(38,18,55,-5,75,-5,75,18); quad(82,18,82,-5,97,-5,112,18);
  fill(40); rect(128,40,15,5,3);
  fill(30); circle(30,60,35); circle(110,60,35);
  fill(120); circle(30,60,15); circle(110,60,15);
  fill(255,220,120); ellipse(0,25,10,10);
  pop();
}

// No-smoke version for parked scenes (house, station)
function drawPetrolCarNoSmoke(x, y) {
  push(); translate(x,y);
  fill(180,40,40); noStroke(); rect(0,20,140,40,10);
  beginShape(); vertex(25,20);vertex(50,-10);vertex(100,-10);vertex(120,20); endShape(CLOSE);
  fill(180); quad(38,18,55,-5,75,-5,75,18); quad(82,18,82,-5,97,-5,112,18);
  fill(40); rect(128,40,15,5,3);
  fill(30); circle(30,60,35); circle(110,60,35);
  fill(120); circle(30,60,15); circle(110,60,15);
  fill(255,220,120); ellipse(0,25,10,10);
  pop();
}

function drawEVCar(x, y) {
  push(); translate(x,y);
  fill(235); noStroke(); rect(0,20,140,40,10);
  beginShape(); vertex(25,20);vertex(50,-10);vertex(100,-10);vertex(120,20); endShape(CLOSE);
  fill(180); quad(38,18,55,-5,75,-5,75,18); quad(82,18,82,-5,97,-5,112,18);
  fill(50,220,120); rect(10,35,120,6,5);
  fill(30); circle(30,60,35); circle(110,60,35);
  fill(120); circle(30,60,15); circle(110,60,15);
  fill(180,255,200); ellipse(0,25,10,10);
  pop();
}

function drawClouds() {
  push(); noStroke(); fill(255,240);
  ellipse(100,80,70,50);ellipse(140,80,80,60);ellipse(180,80,70,50);
  ellipse(420,100,60,45);ellipse(460,100,75,55);ellipse(500,100,60,45);
  ellipse(260,60,50,40);ellipse(295,60,65,50);ellipse(330,60,50,40);
  pop();
}

function playTextTone(freq) {
  let osc = new p5.Oscillator();
  osc.setType('sine'); osc.freq(freq); osc.amp(0.2,0.2); osc.start(); osc.amp(0,1); osc.stop(1.2);
}

function playImpactSound() {
  let osc = new p5.Oscillator();
  osc.setType('triangle'); osc.freq(60); osc.amp(0.5,0.05); osc.start(); osc.freq(25,0.6); osc.amp(0,1.5); osc.stop(2);
}