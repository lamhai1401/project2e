// draw a pmem chart
var pmemChart = new SmoothieChart({ grid: { strokeStyle: 'rgb(125, 0, 0)', fillStyle: 'rgb(60, 0, 0)', lineWidth: 1, millisPerLine: 250, verticalSections: 6 }, maxValue:100, minValue:0, timestampFormatter:SmoothieChart.timeFormatter});
pmemChart.addTimeSeries(pmem, { strokeStyle: '#05fae1', fillStyle: 'rgba(255, 0, 255, 0.3)', lineWidth: 3 });
pmemChart.streamTo(document.getElementById("pmem"), 500);