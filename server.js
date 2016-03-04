var express = require("express")
var nodeMuse = require("node-muse");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var csv = require('fast-csv');

app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.use('/lib', express.static(__dirname + '/lib/'));

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var deltaarr = [];
var deltaarr_sec = [];
var thetaarr = [];
var thetaarr_sec = [];
var alphaarr = [];
var alphaarr_sec = [];
var betaarr = [];
var betaarr_sec = [];
var gammaarr = [];
var gammaarr_sec = [];

io.on('connection', function(socket) {
    console.log('connected');

    socket.on('connectmuse', function() {
        // send fake data
        socket.emit('muse_connected');
        setInterval(function(){
            var fakedelta = getRandom(0, 1);
            var faketheta = getRandom(0, 1);
            var fakealpha = getRandom(0, 1);
            var fakebeta = getRandom(0, 1);
            var fakegamma = getRandom(0, 1);
            socket.emit('delta_relative', fakedelta);
            socket.emit('theta_relative', faketheta);
            socket.emit('alpha_relative', fakealpha);
            socket.emit('beta_relative', fakebeta);
            socket.emit('gamma_relative', fakegamma);
            deltaarr.push([fakedelta]);
            thetaarr.push([faketheta]);
            alphaarr.push([fakealpha]);
            betaarr.push([fakebeta]);
            gammaarr.push([fakegamma]);

        }, 1000);

        // send muse data
        // TODO: note any channels that aren't sending data...
        /*
        var muse = nodeMuse.connect().Muse;

        muse.on('connected', function() {
            socket.emit('muse_connected');
        });

        muse.on('uncertain', function(){
            // for some reason muse can't be detected
            // waiting for new signals to arrive
            socket.emit('muse_uncertain');
        });

        muse.on('disconnected', function() {
            socket.emit('muse_unintended_disconnect');
        });

        // only send once every second
        var deltanow = Date.now();
        var deltalast = Date.now();
        var thetanow = Date.now();
        var thetalast = Date.now();
        var alphanow = Date.now();
        var alphalast = Date.now();
        var betanow = Date.now();
        var betalast = Date.now();
        var gammanow = Date.now();
        var gammalast = Date.now();

        // get relative data from muse, these values will be between 0 and 1
        // see: http://developer.choosemuse.com/research-tools/available-data#Relative_Band_Powers
        muse.on('/muse/elements/delta_relative', function(data){
            deltanow = Date.now();
            var deltadata = averageChannelData(data);
            // save raw data from all 4 channels for later analysis
            deltaarr.push(data.values);
            if (checkTime(deltanow, deltalast)) {
                deltalast = deltanow;
                // save data that's visualized
                deltaarr_sec.push([deltadata])
                socket.emit('delta_relative', deltadata);
            }
        });

        muse.on('/muse/elements/theta_relative', function(data){
            thetanow = Date.now();
            var thetadata = averageChannelData(data);
            thetaarr.push(data.values);
            if (checkTime(thetanow, thetalast)) {
                thetalast = thetanow;
                thetaarr_sec.push([thetadata]);
                socket.emit('theta_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/alpha_relative', function(data){
            alphanow = Date.now();
            var alphadata = averageChannelData(data);
            alphaarr.push(data.values);
            if (checkTime(alphanow, alphalast)) {
                alphalast = alphanow;
                alphaarr_sec.push([alphadata]);
                socket.emit('alpha_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/beta_relative', function(data){
            betanow = Date.now();
            var betadata = averageChannelData(data);
            betaarr.push(data.values);
            if (checkTime(betanow, betalast)) {
                betalast = betanow;
                betaarr_sec.push([betadata]);
                socket.emit('beta_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/gamma_relative', function(data){
            gammanow = Date.now();
            var gammadata = averageChannelData(data);
            gammaarr.push(data.values);
            if (checkTime(gammanow, gammalast)) {
                gammalast = gammanow;
                gammaarr_sec.push([gammadata]);
                socket.emit('gamma_relative', averageChannelData(data));
            }
        });*/
    });

    socket.on('disconnectmuse', function() {
        nodeMuse.disconnect();
        socket.emit('muse_disconnect');

        // save all data to csv file
        downloadData(deltaarr, 'delta');
        downloadData(thetaarr, 'theta');
        downloadData(alphaarr, 'alpha');
        downloadData(betaarr, 'beta');
        downloadData(gammaarr, 'gamma');
        downloadData(deltaarr_sec, 'delta_sec');
        downloadData(thetaarr_sec, 'theta_sec');
        downloadData(alphaarr_sec, 'alpha_sec');
        downloadData(betaarr_sec, 'beta_sec');
        downloadData(gammaarr_sec, 'gamma_sec');
    });
});

// This function averages the EEG values we get across the four channels that Muse has
// Note that this can be noisy as a result, as it does not consider the spatial information
// see: http://forum.choosemuse.com/forum/developer-forum/6219-filtering-fft-alpha-beta-theta-values-using-muse-player
function averageChannelData(data) {
    var sum = 0;
    var numValidChannels = 0;
    if (!isNaN(data.values[0])) {
        sum += data.values[0];
        numValidChannels++;
    }
    if (!isNaN(data.values[1])) {
        sum += data.values[1];
        numValidChannels++;
    }
    if (!isNaN(data.values[2])) {
        sum += data.values[2];
        numValidChannels++;
    }
    if (!isNaN(data.values[3])) {
        sum += data.values[3];
        numValidChannels++;
    }
    var average = sum / numValidChannels;
    return average;
}

function checkTime(currentTime, lastTime) {
    if ((currentTime - lastTime >= 1000) || (lastTime - currentTime >= 1000)) {
        return true;
    }
    return false;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function downloadData(data, filename) {
    csv
       .writeToPath(filename + ".csv", data, {headers: true})
       .on("finish", function(){
           console.log("done!");
       });
}

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port %d in %s mode', this.address().port, app.settings.env);
});
