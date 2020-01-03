function sign(n){
  if (n >= 0){
    return 1
  } else {
    return 0
  }
}

function drawAxes(ctx, GAME_WIDTH, GAME_HEIGHT) {
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(20, parseInt(GAME_HEIGHT));
  ctx.strokeStyle = "black";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, GAME_HEIGHT-50);
  ctx.lineTo(GAME_WIDTH, GAME_HEIGHT-50);
  ctx.strokeStyle = "black";
  ctx.stroke();
}

// yOfGauss find an y value for given x and gauss parrameters sigma and mu
function yOfGauss(x, mu, sigma, maxY) {
  return 1/(sigma*Math.sqrt(2*Math.PI)) * Math.pow(Math.E, -0.5*(Math.pow((x-mu)/sigma,2)))*maxY*100
}
