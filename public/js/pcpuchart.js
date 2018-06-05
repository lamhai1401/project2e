 // Connecting to socket.io
var socket = io();

/** Creata a timeseries chart */
var pcpu = new TimeSeries();
var pmem = new TimeSeries();

// receive system states data from server
socket.on('chart_system_cpu', function(data) {
  
  // add data for pcpu and pmem
  pcpu.append(new Date().getTime(), data.pcpu);
  pmem.append(new Date().getTime(), data.pmem);
  
  // view real time system info
  document.getElementById("ram").innerText = `RAM : ${data.pmem}`
  document.getElementById("cpu").innerText = `CPU : ${data.pcpu}`
  document.getElementById("process").innerText = `PROCESS : ${data.total_proc}`
})


// draw a pcpu chart
var smoothie = new SmoothieChart({ grid: { strokeStyle: 'rgb(125, 0, 0)', fillStyle: 'rgb(60, 0, 0)', lineWidth: 1, millisPerLine: 250, verticalSections: 6 }, maxValue:100, minValue:0, timestampFormatter:SmoothieChart.timeFormatter});
smoothie.addTimeSeries(pcpu, { strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 });
smoothie.streamTo(document.getElementById("pcpu"), 500);

