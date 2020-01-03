class Line {  // y = ax + b
  constructor(ctx, GAME_WIDTH, GAME_HEIGHT, color) {
    this.ctx = ctx
    this.color = color
    this.GAME_WIDTH = GAME_WIDTH
  }
  setPar(a, b) {
    this.a = a
    this.b = b
  }
  draw(){
    this.x0 = parseInt(0)
    this.x1 = this.GAME_WIDTH
    this.y0 = this.a*this.x0 + this.b
    this.y1 = this.a*this.x1+this.b

    this.ctx.beginPath();
    this.ctx.moveTo(this.x0, this.y0);
    this.ctx.lineTo(this.x1, this.y1);
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }
}

class Point {
  constructor(ctx, x, y){
    this.ctx = ctx;
    this.correct = true
    this.set = false            // two sets which will be dividid by line false or true
    this.x = x
    this.y = y
    this.r = 8;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    if(this.correct){
      this.ctx.fillStyle = 'green';
    }else{
      this.ctx.fillStyle = 'red';
    }
    this.ctx.fill();
    this.ctx.lineWidth = 3;
    if(this.set) {
      this.ctx.strokeStyle = '#3366ff';
    } else {
      this.ctx.strokeStyle = '#ffcc00';
    }
    this.ctx.stroke();
  }
  setCorrect(isCorrect) {
    this.correct = isCorrect
  }
  setSet(setOne) {
    this.set = setOne
  }
  getPosition() {
    return [this.x, this.y]
  }
}

class PointsField {
  constructor(ctx, GAME_WIDTH, GAME_HEIGHT){
    this.ctx = ctx
    this.GAME_WIDTH = GAME_WIDTH;
    this.GAME_HEIGHT = GAME_HEIGHT;
    this.nPoints = 100;
    this.Points = []
    this.a = 0;
    this.b = 0;
    this.initPoints()
  }
  setNPoints(nPoints){
    this.nPoints = nPoints;
    this.initPoints()
  }
  initPoints(){
    for (let i=0; i<this.nPoints; i++){
      let x = Math.floor(Math.random()*this.GAME_WIDTH)
      let y = Math.floor(Math.random()*this.GAME_HEIGHT)
      let P = new Point(this.ctx, x, y)
      this.Points.push(P)
    }
  }
  drawPoints(){
    for (let i=0; i<this.nPoints; i++) {
      this.Points[i].draw()
    }
  }
  divideToSets(a, b) {
    this.a = a;
    this.b = b;
    for(let i=0; i<this.nPoints; i++) {
      let coordinates = this.Points[i].getPosition()
      this.Points[i].setSet(coordinates[1] > this.a*coordinates[0]+this.b)
    }
  }
  setCorrectness(aGuess, bGuess) {
    for(let i=0; i<this.nPoints; i++) {
      let coordinates = this.Points[i].getPosition()
      // is correct.. point is abowe both lines
      let isAbowe = coordinates[1] > this.a*coordinates[0]+this.b && coordinates[1] > aGuess*coordinates[0]+bGuess
      // is correct.. point is below both lines
      let isBelowe = coordinates[1] < this.a*coordinates[0]+this.b && coordinates[1] < aGuess*coordinates[0]+bGuess
      let isCorrect = isAbowe || isBelowe
      this.Points[i].setCorrect(isCorrect)
    }
  }
}

class Perceptron {
  constructor(learningRate) {
    this.w0 = Math.random()*2-1;
    this.w1 = Math.random()*2-1;
    this.wb = Math.random()*2-1;
    this.b = 50; // bias
    this.lr = 0.0001
  }
  setLR(learningRate) { // for changing learningRate
    this.lr = learningRate
  }
  getValues() {
    let a = -(this.w0/this.w1)
    let b = -(this.wb/this.w1*this.b)
    return [a, b]
  }
  guess(x0, x1) {
    let sum = x0 * this.w0 + x1 * this.w1 + this.b * this.wb
    return sign(sum)
  }
  train(POINT) {
    let x0 = POINT.x
    let x1 = POINT.y
    let target = 0    // set one
    if(POINT.set){target = 1}   // set two
    let guess = this.guess(x0, x1)
    let error = target-guess
    this.w0 += error * x0 * this.lr
    this.w1 += error * x1 * this.lr
    this.wb += error * this.b * this.lr
    if (error != 0) {
      return 1
    } else {
      return 0
    }
  }
}

function controllPerceptronSimulation(canvas, sliderA, sliderB, sliderLR, sliderPoints, BTN) {
  const GAME_WIDTH = 500;
  const GAME_HEIGHT = 500;
  var N_POINTS = 1000;
  const TRAIN_STEPS = 50;
  canvas.width = GAME_WIDTH
  canvas.height = GAME_HEIGHT
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const POINTS = new PointsField(ctx, GAME_WIDTH, GAME_HEIGHT, N_POINTS)
  const LINE = new Line(ctx, GAME_WIDTH, GAME_HEIGHT, "red")
  const PERCEPTRON = new Perceptron()
  const PERCEPTRON_LINE = new Line(ctx, GAME_WIDTH, GAME_HEIGHT, "black")

  function readSliders(sliderA, sliderB, sliderLR, sliderPoints) {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    let A = (parseInt(sliderA.value)-50)/50
    let B = parseInt(sliderB.value)
    let LR = parseInt(sliderLR.value)/1000000
    let nPoints = parseInt(sliderPoints.value)
    LINE.setPar(A, B)
    LINE.draw()
    POINTS.setNPoints(nPoints)
    POINTS.divideToSets(A, B)
    POINTS.drawPoints()
    PERCEPTRON.setLR(LR)
  }
  readSliders(sliderA, sliderB, sliderLR, sliderPoints)

  // event listeners on slider change
  sliderA.addEventListener("mouseup", function(){readSliders(sliderA, sliderB, sliderLR, sliderPoints)})
  sliderB.addEventListener("mouseup", function(){readSliders(sliderA, sliderB, sliderLR, sliderPoints)})
  sliderLR.addEventListener("mouseup", function(){readSliders(sliderA, sliderB, sliderLR, sliderPoints)})
  sliderPoints.addEventListener("mouseup", function(){readSliders(sliderA, sliderB, sliderLR, sliderPoints)})

  let perceptronValues = PERCEPTRON.getValues()
  PERCEPTRON_LINE.setPar(perceptronValues[0], perceptronValues[1])
  PERCEPTRON_LINE.draw()

  function train(){
    let E = 0
    for(let j=0; j<POINTS.nPoints; j++) {
      let e = PERCEPTRON.train(POINTS.Points[j])
      E += e
    }
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    LINE.draw()
    let perceptronValues = PERCEPTRON.getValues()
    POINTS.setCorrectness(perceptronValues[0], perceptronValues[1])
    POINTS.drawPoints()
    PERCEPTRON_LINE.setPar(perceptronValues[0], perceptronValues[1])
    PERCEPTRON_LINE.draw()
  }

  BTN.addEventListener("click", function(){
    let i = 0;
    let interval = 100;

    var simulation = setInterval(function(){
      train()
      if(++i > TRAIN_STEPS){
        clearInterval(simulation)
      }
    }, interval);
  })
}
