window.onload = function() {

  // PERCEPTRON
  const canvasPerceptron = document.getElementById("canvasPerceptron");
  var sliderA = document.getElementById("a");
  var sliderB = document.getElementById("b");
  var sliderLR = document.getElementById("lr");
  var sliderPoints = document.getElementById("p");
  var BtnPerceptron = document.getElementById("trainStep");
  controllPerceptronSimulation(canvasPerceptron, sliderA, sliderB, sliderLR, sliderPoints, BtnPerceptron);

  // GENERATE GAUSSIAN DISTRIBUTION
  const canvasGauss = document.getElementById("canvasGauss");
  var nGaussPoints = document.getElementById("gaussPoints");
  var sliderMu = document.getElementById("mu");
  var sliderSigma = document.getElementById("sigma");
  var BtnGuss = document.getElementById("startGeneration");
  controllGaussSimulation(canvasGauss, nGaussPoints, sliderMu, sliderSigma, BtnGuss);

  // EM
  const canvasEM = document.getElementById("canvasEM");
  var nGaussPoints1 = document.getElementById("gaussPoints1");
  var nGaussPoints2 = document.getElementById("gaussPoints2");
  var nGaussPoints3 = document.getElementById("gaussPoints3");
  var sliderMu1 = document.getElementById("mu1");
  var sliderMu2 = document.getElementById("mu2");
  var sliderMu3 = document.getElementById("mu3");
  var sliderSigma1 = document.getElementById("sigma1");
  var sliderSigma2 = document.getElementById("sigma2");
  var sliderSigma3 = document.getElementById("sigma3");
  var BtnEM = document.getElementById("startEM");
  controllEmSimulation(canvasEM, nGaussPoints1, nGaussPoints2, nGaussPoints3, sliderMu1, sliderMu2, sliderMu3, sliderSigma1, sliderSigma2, sliderSigma3, BtnEM);

}
