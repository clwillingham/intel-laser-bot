/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
Pulse Width Modulation, or PWM, is a technique for getting analog results with digital means.

A simple node.js application intended to read and write analog values to fade a LED from Digital pins on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/
var express = require("express"),
    app = express(),
    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    io = require('socket.io')(server),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 4567,
    publicDir = process.argv[2] || __dirname + '/public';
var mraa = require("mraa"); //require mraa
//Initialize PWM on Digital Pin #3 (D3) and enable the pwm pin
var xServo = new mraa.Pwm(3);
var yServo = new mraa.Pwm(5);
var laser = new mraa.Gpio(4);

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

//var yServo = new mraa.Pwm(5);
xServo.enable(true);
yServo.enable(true);

xServo.period_us(20000);
yServo.period_us(20000);

io.on('connection', function(socket){
    console.log('new connection', socket);
    socket.on('set', function(x, y){
        
    });
});

laser.dir(mraa.DIR_OUT);
var active = false;
setInterval(function(){
    laser.write(active? 1:0);
    active = !active;
    console.log('laser active:', active);
}, 1000);

process.on('SIGINT', function()
{
    xServo.enable(0);
    yServo.enable(0);
});

server.listen(port);