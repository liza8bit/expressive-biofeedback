// functions for creating line graph for eeg data

var deltaline, thetaline, alphaline, betaline, gammaline;
var linegraph, socket;

function connectToMuse() {
    socket = io.connect();
    socket.emit('connectmuse');

    socket.on('muse_connected', function() {
        startGraphing();
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
        $('#musestatus').text('Muse has been disconnected.');
    });
}

function startGraphing() {
    linegraph = createGraph();

    socket.on('delta_relative', function(data) {
        addData(data, deltaline);
    });
    socket.on('theta_relative', function(data) {
        addData(data, thetaline);
    });
    socket.on('alpha_relative', function(data) {
        addData(data, alphaline);
    });
    socket.on('beta_relative', function(data) {
        addData(data, betaline);
    });
    socket.on('gamma_relative', function(data) {
        addData(data, gammaline);
    });
}

var linemap = {
    'delta': {
        'normal': 'rgba(15,198,0,1)',
        'fade': 'rgba(15,198,0,0.20)',
        'description': ''
    },
    'theta': {
        'normal': 'rgba(218,198,0,1)',
        'fade': 'rgba(218,198,0,0.20)',
        'description': ''
    },
    'alpha': {
        'normal': 'rgba(246,130,0,1)',
        'fade': 'rgba(246,130,0,0.20)',
        'description': ''
    },
    'beta': {
        'normal': 'rgba(247,43,0,1)',
        'fade': 'rgba(247,43,0,0.20)',
        'description': ''
    },
    'gamma': {
        'normal': 'rgba(3,55,244,1)',
        'fade': 'rgba(3,55,244,0.20)',
        'description': ''
    }
}

function addLine(graph, line, linetype) {
    graph.addTimeSeries(line, {
        lineWidth: 3,
        strokeStyle: linemap[linetype]['normal']
    });
    return line;
}

function removeLine(graph, line) {
    graph.removeTimeSeries(line);
}

function toggleFade(line, linetype, fade) {
    var smoothie = linegraph;
    var seriesOptions;
    for (var i = 0; i < smoothie.seriesSet.length; i++) {
        if (smoothie.seriesSet[i].timeSeries === line) {
            seriesOptions = smoothie.seriesSet[i].options;
            break;
        }
    }
    seriesOptions.strokeStyle = linemap[linetype][fade];
}

function removeAllButOneLine(lineToStay) {
    if (lineToStay != 'delta') {
        toggleFade(deltaline, 'delta', 'fade')
    }
    if (lineToStay != 'theta') {
        toggleFade(thetaline, 'theta', 'fade')
    }
    if (lineToStay != 'alpha') {
        toggleFade(alphaline, 'alpha', 'fade')
    }
    if (lineToStay != 'beta') {
        toggleFade(betaline, 'beta', 'fade')
    }
    if (lineToStay != 'gamma') {
        toggleFade(gammaline, 'gamma', 'fade')
    }
}

function addAllLines() {
    toggleFade(deltaline, 'delta', 'normal');
    toggleFade(thetaline, 'theta', 'normal');
    toggleFade(alphaline, 'alpha', 'normal');
    toggleFade(betaline, 'beta', 'normal');
    toggleFade(gammaline, 'gamma', 'normal');
}

function createGraph() {
    var smoothie = new SmoothieChart({
        maxValue: 1,
        minValue: 0,
        grid: {
            fillStyle:'rgba(0,0,0,0)',
            strokeStyle:'#79b133',
            verticalSections: 10
        }
    });
    smoothie.streamTo(document.getElementById("graph"), 1000);

    $('#graphlabels').css("display", "inline-block");

    // data
    deltaline = new TimeSeries();
    addLine(smoothie, deltaline, 'delta');

    thetaline = new TimeSeries();
    addLine(smoothie, thetaline, 'theta');

    alphaline = new TimeSeries();
    addLine(smoothie, alphaline, 'alpha');

    betaline = new TimeSeries();
    addLine(smoothie, betaline, 'beta');

    gammaline = new TimeSeries();
    addLine(smoothie, gammaline, 'gamma');

    return smoothie;
}

function addData(data, line) {
    line.append(new Date().getTime(), data);
}