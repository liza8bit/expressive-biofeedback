var delta, theta, alpha, beta, gamma


function connectToMuse() {
  socket = io.connect();
  socket.emit('connectmuse');

  socket.on('muse_connected', function() {
    swirling();
    var canvas = document.getElementById('swirl1_surface');
    var context = canvas.getContext('2d');
    context.beginPath();
    context.clearRect(0,0,600,600);
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
var myconfig =
{ count:                     seconds%2 * 200,
  shape:                     "lines",
  radiusInnerMax:            "0%",
  radiusInnerMin:            "0%",
  radiusOuterMax:            "50%",
  radiusOuterMin:            "50%",
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
  lightnessMin:              30,
  lightnessMax:              70,
  hueMin:                    0,
  hueMax:                    200,
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
  distanceJitterMin:         -10,
  distanceJitterMax:         0,
  rotationJitterMin:         0,
  rotationJitterMax:         0};
var empty_config =
{ count:                     0,
  shape:                     "lines",
  radiusInnerMax:            "0%",
  radiusInnerMin:            "0%",
  radiusOuterMax:            "50%",
  radiusOuterMin:            "50%",
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
  lightnessMin:              30,
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
  distanceJitterMin:         -seconds/10,
  distanceJitterMax:         seconds/10,
  rotationJitterMin:         0,
  rotationJitterMax:         0};

// CanvasSwirl 0.8 by Andrew Stibbard: http://xhva.net  http://jsswirl.com
function swirling() {
    console.log("HELLO")
    var canvas = document.getElementById('swirl1_surface');
    var context = canvas.getContext('2d');
    swirl1 = new CanvasSwirl(
      document.getElementById('swirl1_surface'), empty_config
      /*{
        "count": 400,
        "shape": "lines",
        "radiusInnerMax": "0%",
        "radiusInnerMin": "0%",
        "radiusOuterMax": "50%",
        "radiusOuterMin": "50%",
        "thicknessMin": 1,
        "thicknessMax": 1,
        "fadeTime": 0.25,
        "rotationVelMin": 0.2,
        "rotationVelMax": 0.4,
        "originX": "center",
        "originY": "center",
        "originXOffsetMin": 0,
        "originXOffsetMax": 0,
        "originYOffsetMin": 0,
        "originYOffsetMax": 0,
        "distanceVelMin": 0.25,
        "distanceVelMax": 0.6,
        "saturationMin": 35,
        "saturationMax": 75,
        "lightnessMin": 30,
        "lightnessMax": 70,
        "hueMin": 0,
        "hueMax": 360,
        "hueIncrement": 1,
        "opacityMin": 1,
        "opacityMax": 1,
        "opacityScaleAtCenter": 1,
        "opacityScaleAtEdge": 1,
        "opacityScaleIsRelative": true,
        "lightnessScaleAtCenter": 1,
        "lightnessScaleAtEdge": 1,
        "lightnessScaleIsRelative": true,
        "saturationScaleAtCenter": 1,
        "saturationScaleAtEdge": 1,
        "saturationScaleIsRelative": true,
        "distanceJitterMin": 0,
        "distanceJitterMax": 0,
        "rotationJitterMin": 0,
        "rotationJitterMax": 0
      }*/
    );
    setInterval(function() {seconds = ((new Date().getTime()/1000)%10)*100; console.log(seconds%2*500); myconfig.count = seconds %2 * 500; swirl1.applyConfig(myconfig);},750);
    console.log("BYE");
    return;
}
