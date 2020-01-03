class GaussSet{
  constructor(ctx, GAME_HEIGHT, color){
    this.mu = 0;
    this.sigma = 0;
    this.nPoints = 0;
    this.points = []
    this.drawDistroPoints = []  // len of GAME_WIDTH
    this.maxY = 0;
    this.ctx = ctx;
    this.color = color;
    this.maxX = 1000;
    this.minX = -1000;
    this.rangeX = this.maxX - this.minX
    this.GAME_HEIGHT = GAME_HEIGHT;
  }

  // clear() resets all point arrays
  clear(){
    this.points = []
    this.drawDistroPoints = []
    this.maxX = 1000;
    this.minX = -1000;
    this.maxY = 0
    this.rangeX = this.maxX - this.minX
  }

  // setGaussParam() allows to change gaussian parameters and number of points to generate
  setGaussParam(mu, sigma, nPoints) {
    this.mu = mu;
    this.sigma = sigma;
    this.nPoints = nPoints;
    this.clear()
  }

  // setDistributionPixels() takes a properties of canvas and for each pixel (x) creates a value (y) for Df assign Hf
  setDistributionPixels() {
    let maxY = 0;
    let minX = 0;
    let maxX = 0;
    let isMinX = false;
    let isMaxX = false;

    for(let i = 0; i<this.rangeX; i++) {
      let x = i+this.minX
      let yValue = Math.floor(yOfGauss(x, this.mu, this.sigma, this.GAME_HEIGHT-20))
      if(!isMinX && yValue > 0) { // first non zero value will be (start of gaussian function)
        minX = x
        isMinX = true
      }
      if(!isMaxX && isMinX && yValue == 0) {  // first zero value (end of gaussian function)
        maxX = x
        isMaxX = true
      }
      if(isMinX && !isMaxX) { // Im in range of non null values
        this.drawDistroPoints = [...this.drawDistroPoints, yValue]
        if(yValue > maxY){maxY=yValue};
      }
    }

    this.maxY = maxY;
    this.minX = minX;
    this.maxX = maxX;
    this.rangeX = maxX - minX;
  }

  // drawDistroLine() takes Hf values of all Df (y of x) and draw all of these points
  drawDistroLine() {
    this.ctx.fillStyle = this.color
    for(let i=0; i<this.rangeX; i++) {
      this.ctx.fillRect(i + this.minX, this.GAME_HEIGHT-50-this.drawDistroPoints[i], 3, 3);
    }
  }

  // getNewPoint() generate new point and if it fits Gaussian distribution it add it to set
  getNewPoint(drawPoints, drawLines) {
    let x = Math.floor(Math.random()*this.rangeX);
    let y = Math.floor(Math.random()*this.maxY);

    if( y < this.drawDistroPoints[x] ) {  // belongs to gaussian distribution
      if(drawPoints){
        this.drawPoint(x+this.minX, this.GAME_HEIGHT-y-50, false)
      }
      if(drawLines){
        this.drawPointLine(x+this.minX, y)
      }
      this.points = [...this.points, [x, y]]
      return true
    } else {                    // dont belongs to gaussian distribution
      if(drawPoints){
        this.drawPoint(x+this.minX, this.GAME_HEIGHT-y-50, true)
      }
      return false
    }
  }

  drawPoint(x, y, accepted) {
    // y = this.GAME_HEIGHT - y -40
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
    if(accepted) {
      this.ctx.fillStyle = 'red';
      this.ctx.fill();
    } else {
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
  }

  drawPointLine(x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, this.GAME_HEIGHT-10);
    this.ctx.lineTo(x, this.GAME_HEIGHT-35);
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }

  generatePoints(interval, drawPoints, drawLines) {
    let i = 0;
    var simulation = setInterval((function() {
      if(this.getNewPoint(drawPoints, drawLines)) {
        i++
      }
      if(i>this.nPoints) {
       clearInterval(simulation);
      }
    }).bind(this), parseInt(interval));
  }
}

class EM{
  constructor(ctx, GAME_WIDTH, GAME_HEIGHT) {
    this.ctx = ctx;
    this.GAME_WIDTH = GAME_WIDTH;
    this.GAME_HEIGHT = GAME_HEIGHT;
    // DRAW DISTRIBUTIONS OF FIRST GUESS
  }
  newSET(SET1, SET2, SET3){
    this.givenSET1 = SET1
    this.givenSET2 = SET2
    this.givenSET3 = SET3
    this.pointsSet = [...SET1.points, ...SET2.points, ...SET3.points]
    this.findMinMax()
    this.firstGuess()
    this.initSets()
  }

  firstGuess() {
    let minSigma = 43, maxSigma = 100, rangeSigma = maxSigma-minSigma
    this.mu1 = Math.random()*this.rangeX+this.minX
    this.sigma1 = 50
    this.sigma2 = 50
    this.sigma3 = 50
    // this.sigma1 = Math.random()*rangeSigma + minSigma
    this.mu2 = Math.random()*this.rangeX+this.minX
    // this.sigma2 = Math.random()*rangeSigma + minSigma
    this.mu3 = Math.random()*this.rangeX+this.minX
    // this.sigma3 = Math.random()*rangeSigma + minSigma
  }

  initSets() {
    this.SET1 = new GaussSet(this.ctx, this.GAME_HEIGHT, "black")
    this.SET2 = new GaussSet(this.ctx, this.GAME_HEIGHT, "black")
    this.SET3 = new GaussSet(this.ctx, this.GAME_HEIGHT, "black")

    this.SET1.setGaussParam(this.mu1, this.sigma1, 0)
    this.SET2.setGaussParam(this.mu2, this.sigma2, 0)
    this.SET3.setGaussParam(this.mu3, this.sigma3, 0)

    this.SET1.setDistributionPixels()
    this.SET2.setDistributionPixels()
    this.SET3.setDistributionPixels()

    this.SET1.drawDistroLine()
    this.SET2.drawDistroLine()
    this.SET3.drawDistroLine()
  }

  findMinMax() {
    let minX = 100000
    let maxX = -100000, minY = 0, maxY = 0;
    for(let i=0; i<this.pointsSet.length; i++) {
      let x = this.pointsSet[i][0]
      let y = this.pointsSet[i][1]
      if (x < minX) {minX = x}
      if (x > maxX) {maxX = x}
      if (y < minY) {minY = y}
      if (y > maxY) {maxY = y}
    }
    this.minX = minX
    this.maxX = maxX
    this.minY = minY
    this.maxY = maxY
    this.rangeX = maxX - minX
    this.rangeY = maxY - minY
  }

  step() {
    // probability that point belongs to distribution with mu and sigma
    let P_XS = []   // P(X|S1), P(X|S2), P(X|S3)
    let P_SX = []   // P(S1|X), P(S2|X), P(S3|X)
    //
    for(let i=0; i<this.pointsSet.length; i++) {
      // P1 is probability that point belongs to gaussian 1 (mu1, sigma1)
      let P1 = 1/(this.sigma1*Math.sqrt(2*Math.PI)) * Math.pow(Math.E, -0.5*(Math.pow((this.pointsSet[i][0]-this.mu1)/this.sigma1,2))) // P(point from S | distribution mu1 sigma1)
      let P2 = 1/(this.sigma2*Math.sqrt(2*Math.PI)) * Math.pow(Math.E, -0.5*(Math.pow((this.pointsSet[i][0]-this.mu2)/this.sigma2,2))) // P(point from S | distribution mu2 sigma2)
      let P3 = 1/(this.sigma3*Math.sqrt(2*Math.PI)) * Math.pow(Math.E, -0.5*(Math.pow((this.pointsSet[i][0]-this.mu3)/this.sigma3,2))) // P(point from S | distribution mu3 sigma3)

      let P_ratio = P1+P2+P3  // P(X|S1)*P(S1) + P(X|S2)*P(S2) + P(X|S3)*P(S3)
      P_XS.push([P1, P2, P3])
      P_SX.push([P1/P_ratio, P2/P_ratio, P3/P_ratio])
    }

    // calculate posterior with bayes rule (is x more likeli to be from 1, 2 or 3 set?)
    let S1X = 0   // Set1 belongs to point
    let SS1 = 0   // Sum of Set1
    let S2X = 0
    let SS2 = 0
    let S3X = 0
    let SS3 = 0

    // mu_S1 = SUM(P_SXi*Xi)

    for (let i=0; i<P_SX.length; i++) {
      S1X = S1X + P_SX[i][0]*this.pointsSet[i][0]
      SS1 = SS1 + P_SX[i][0]
      S2X = S2X + P_SX[i][1]*this.pointsSet[i][0]
      SS2 = SS2 + P_SX[i][1]
      S3X = S3X + P_SX[i][2]*this.pointsSet[i][0]
      SS3 = SS3 + P_SX[i][2]
    }

    this.mu1 = S1X/SS1
    this.mu2 = S2X/SS2
    this.mu3 = S3X/SS3

    let S1Xmu = 0
    let S2Xmu = 0
    let S3Xmu = 0

    for(let i=0; i<P_SX.length; i++) {
      S1Xmu = S1Xmu + P_SX[i][0] * Math.pow((this.pointsSet[i][0]-this.mu1),2)
      S2Xmu = S2Xmu + P_SX[i][1] * Math.pow((this.pointsSet[i][0]-this.mu2),2)
      S3Xmu = S3Xmu + P_SX[i][2] * Math.pow((this.pointsSet[i][0]-this.mu3),2)
    }


    // this.sigma1 = Math.sqrt(S1Xmu / SS1)
    // this.sigma2 = Math.sqrt(S2Xmu / SS2)
    // this.sigma3 = Math.sqrt(S3Xmu / SS3)
  }

  simulation(interval, steps) {
    let i = 0;
    var simulation = setInterval((function() {
      this.step()

      this.ctx.clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
      drawAxes(this.ctx, this.GAME_WIDTH, this.GAME_HEIGHT)

      this.givenSET1.drawDistroLine()
      this.givenSET2.drawDistroLine()
      this.givenSET3.drawDistroLine()

      this.SET1.setGaussParam(this.mu1, this.sigma1, 0)
      this.SET2.setGaussParam(this.mu2, this.sigma2, 0)
      this.SET3.setGaussParam(this.mu3, this.sigma3, 0)

      this.SET1.setDistributionPixels()
      this.SET2.setDistributionPixels()
      this.SET3.setDistributionPixels()

      this.SET1.drawDistroLine()
      this.SET2.drawDistroLine()
      this.SET3.drawDistroLine()
      if(i > steps) {
       clearInterval(simulation);
      }
      i++
    }).bind(this), parseInt(interval));
  }
}

function controllGaussSimulation(canvas, nGaussPoints, sliderMu, sliderSigma, BtnGauss){
  const GAME_WIDTH = 500;
  const GAME_HEIGHT = 500;
  canvas.width = GAME_WIDTH
  canvas.height = GAME_HEIGHT
  const ctx = canvas.getContext("2d");

  SET = new GaussSet(ctx, GAME_WIDTH, "blue")

  function readSliders(sliderMu, sliderSigma, nGaussPoints) {
    let mu = parseInt(sliderMu.value)
    let sigma = parseInt(sliderSigma.value)
    let nPoints = parseInt(nGaussPoints.value)
    SET.setGaussParam(mu, sigma, nPoints)
    SET.setDistributionPixels()

    // draw
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawAxes(ctx, GAME_WIDTH, GAME_HEIGHT)
    SET.drawDistroLine()
  }
  readSliders(sliderMu, sliderSigma, nGaussPoints)

  sliderMu.addEventListener("mouseup", function(){readSliders(sliderMu, sliderSigma, nGaussPoints)})
  sliderSigma.addEventListener("mouseup", function(){readSliders(sliderMu, sliderSigma, nGaussPoints)})
  nGaussPoints.addEventListener("mouseup", function(){readSliders(sliderMu, sliderSigma, nGaussPoints)})

  BtnGauss.addEventListener("click", function(){
    let interval = 50;
    SET.generatePoints(interval, true, true)
  })
}

function controllEmSimulation(canvas, nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3, BtnEM){
  const GAME_WIDTH = 500;
  const GAME_HEIGHT = 500;
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  const ctx = canvas.getContext("2d");

  SET1 = new GaussSet(ctx, GAME_HEIGHT, "blue")
  SET2 = new GaussSet(ctx, GAME_HEIGHT, "green")
  SET3 = new GaussSet(ctx, GAME_HEIGHT, "red")

  function readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3) {
    let mu1 = parseInt(sliderMu1.value)
    let mu2 = parseInt(sliderMu2.value)
    let mu3 = parseInt(sliderMu3.value)

    let sigma1 = parseInt(sliderSigma1.value)
    let sigma2 = parseInt(sliderSigma2.value)
    let sigma3 = parseInt(sliderSigma3.value)

    let nPoints1 = parseInt(nGaussPoints1.value)
    let nPoints2 = parseInt(nGaussPoints2.value)
    let nPoints3 = parseInt(nGaussPoints3.value)

    SET1.setGaussParam(mu1, sigma1, nPoints1)
    SET2.setGaussParam(mu2, sigma2, nPoints2)
    SET3.setGaussParam(mu3, sigma3, nPoints3)

    SET1.setDistributionPixels()
    SET2.setDistributionPixels()
    SET3.setDistributionPixels()

    // draw
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawAxes(ctx, GAME_WIDTH, GAME_HEIGHT)
    SET1.drawDistroLine()
    SET2.drawDistroLine()
    SET3.drawDistroLine()

    SET1.generatePoints(0, false, true)
    SET2.generatePoints(0, false, true)
    SET3.generatePoints(0, false, true)
  }
  readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)

  sliderMu1.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})
  sliderMu2.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})
  sliderMu3.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})
  sliderSigma1.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})
  sliderSigma2.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})
  sliderSigma3.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})
  nGaussPoints1.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})
  nGaussPoints2.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})
  nGaussPoints3.addEventListener("mouseup", function(){readSliders(nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3)})

  EM = new EM(ctx, GAME_WIDTH, GAME_HEIGHT)
  BtnEM.addEventListener("click", function() {
    EM.newSET(SET1, SET2, SET3)
    EM.simulation(1000, 10)
  })
};
