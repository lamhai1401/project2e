var data = [];
var t = new Date();
for (var i = 10; i >= 0; i--) {
    var x = new Date(t.getTime() - i * 1000);
    data.push([x, Math.random(), Math.random()]);
}

var g = new Dygraph(
    document.getElementById("div_g"),
    data,
    {
        drawPoints: true,
        showRoller: true,
        // valueRange: [0.0, 1.2],
        stackedGraph: true,
        labels: ['Time', 'CPU', 'RAM'],
        highlightSeriesOpts: {
            strokeWidth: 6,
            strokeBorderWidth: 1,
            highlightCircleSize: 5
        }
    });

// Connecting to socket.io
var socket = io();

// receive system states data from server
socket.on('chart_system_cpu', function (d) {
    console.log(d);
    var time = new Date();
    var cpu = Math.random(),
        ram = Math.random();
    // if (data.length > 50) data.shift();
    data.push([time, cpu, ram]);
    g.updateOptions({'file': data});
});