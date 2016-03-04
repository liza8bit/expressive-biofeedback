var delta, theta, alpha, beta, gamma

var myconfig =
{ count:                     200,
  shape:                     "lines",
  radiusInnerMax:            "0%",
  radiusInnerMin:            "0%",
  radiusOuterMax:            "48%",
  radiusOuterMin:            "48%",
  thicknessMin:              1,
  thicknessMax:              1,
  fadeTime:                  0.25,
  rotationVelMin:            0.2,
  rotationVelMax:            0.4,
  originX:                   "center",
  originY:                   "center",
  originXOffsetMin:          0,
  originXOffsetMax:          0,
  originYOffsetMin:          0,
  originYOffsetMax:          0,
  distanceVelMin:            0.25,
  distanceVelMax:            0.6,
  saturationMin:             35,
  saturationMax:             75,
  lightnessMin:              35,
  lightnessMax:              70,
  hueMin:                    0,
  hueMax:                    360,
  hueIncrement:              1,
  opacityMin:                1,
  opacityMax:                1,
  opacityScaleAtCenter:      1,
  opacityScaleAtEdge:        1,
  opacityScaleIsRelative:    true,
  lightnessScaleAtCenter:    1,
  lightnessScaleAtEdge:      1,
  lightnessScaleIsRelative:  true,
  saturationScaleAtCenter:   1,
  saturationScaleAtEdge:     1,
  saturationScaleIsRelative: true,
  distanceJitterMin:         0,
  distanceJitterMax:         0,
  rotationJitterMin:         0,
  rotationJitterMax:         0};

function connectToMuse() {
  socket = io.connect();
  socket.emit('connectmuse');

  socket.on('muse_connected', function() {
    start_swirl();
    $('#musestatus').text('Muse successfully connected!');
  });

  socket.on('muse_uncertain', function() {
    $('#musestatus').text('Something is wrong with the Muse. Waiting for new signals...');
  });

  socket.on('muse_unintended_disconnect', function() {
    $('#musestatus').text('You were disconnected from the Muse! Try reconnecting.');
  })
}

function disconnectFromMuse() {
  socket.emit('disconnectmuse');

  socket.on('muse_disconnect', function() {
    $('#musestatus').text('Muse has been disconnected. Outputting csv files.');
  });
}

var seconds = ((new Date().getTime() / 1000)%10)*100;

function start_swirl() {
  swirling();
  socket.on('delta_relative', function(data) {
    delta = data;
  });
  socket.on('theta_relative', function(data) {
    theta = data;
  });
  socket.on('alpha_relative', function(data) {
    alpha = data;
  });
  socket.on('beta_relative', function(data) {
    beta = data;
  });
  socket.on('gamma_relative', function(data) {
    gamma = data;
  });
  console.log("OKAY");
};

// CanvasSwirl 0.8 by Andrew Stibbard: http://xhva.net  http://jsswirl.com
function swirling() {
  myconfig.count = 0;
  swirl1 = new CanvasSwirl(
      document.getElementById('swirl1_surface'), myconfig);
  setInterval(
      function() {
        console.log(delta);
        console.log(theta);
        console.log(alpha);
        console.log(beta);
        console.log(gamma);
        console.log("----------"); 
        myconfig.count = beta*300+100; 
        myconfig.rotationVelMax = .25+.75*(1-alpha);
        myconfig.distanceJitterMax = gamma*20;
        myconfig.hueMax = 60+(300*theta);
        myconfig.lightnessMax = 35+(delta*65);
        swirl1.applyConfig(myconfig);},3000);
};
