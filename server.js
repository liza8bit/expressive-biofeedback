var express = require("express")
var nodeMuse = require("node-muse");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.use('/lib', express.static(__dirname + '/lib/'));

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
    console.log('connected');

    socket.on('connectmuse', function() {
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

        // send muse data
        // TODO: note any channels that aren't sending data...

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
            if (checkTime(deltanow, deltalast)) {
                deltalast = deltanow;
                socket.emit('delta_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/theta_relative', function(data){
            thetanow = Date.now();
            if (checkTime(thetanow, thetalast)) {
                thetalast = thetanow;
                socket.emit('theta_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/alpha_relative', function(data){
            alphanow = Date.now();
            if (checkTime(alphanow, alphalast)) {
                alphalast = alphanow;
                socket.emit('alpha_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/beta_relative', function(data){
            betanow = Date.now();
            if (checkTime(betanow, betalast)) {
                betalast = betanow;
                socket.emit('beta_relative', averageChannelData(data));
            }
        });

        muse.on('/muse/elements/gamma_relative', function(data){
            gammanow = Date.now();
            if (checkTime(gammanow, gammalast)) {
                gammalast = gammanow;
                socket.emit('gamma_relative', averageChannelData(data));
            }
        });
    });

    socket.on('disconnectmuse', function() {
        nodeMuse.disconnect();
        socket.emit('muse_disconnect');
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

http.listen(process.env.PORT || 3000, function(){
    console.log('listening on port %d in %s mode', this.address().port, app.settings.env);
});