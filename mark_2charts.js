const socket = new WebSocket("ws://localhost:8081");

// charts set up
const createChartConfig = (label, color) => ({
    type: "line",
    data: {
        labels: Array(50).fill(""),
        datasets: [{ label: label, data: [], borderColor: color, pointRadius: 0 }]
    },
    options: { animation: false, scales: { y: { min: 0, max: 4100 } } }
});

const L_COLOR = getComputedStyle(document.documentElement).getPropertyValue("--l-color");
const R_COLOR = getComputedStyle(document.documentElement).getPropertyValue("--r-color");

const leftChart = new Chart(document.getElementById("leftChart").getContext("2d"), createChartConfig("Left EMG", L_COLOR));
const rightChart = new Chart(document.getElementById("rightChart").getContext("2d"), createChartConfig("Right EMG", R_COLOR));


socket.onmessage = function(event) {
    // "num1,num2" num1: left, num2: right
    const parts = event.data.trim().split(",");

    const leftVal = parseInt(parts[0]);
    const rightVal = parseInt(parts[1]);
    
    // left chart
    if (!isNaN(leftVal)) {
        document.getElementById("l-val").innerText = leftVal;
        leftChart.data.datasets[0].data.push(leftVal);
        if (leftChart.data.datasets[0].data.length > 50) {
            leftChart.data.datasets[0].data.shift();
        };
        leftChart.update();
    }
    // right chart
    if (!isNaN(rightVal)) {
        document.getElementById("r-val").innerText = rightVal;
        rightChart.data.datasets[0].data.push(rightVal);
        if (rightChart.data.datasets[0].data.length > 50) {
            rightChart.data.datasets[0].data.shift();
        };
        rightChart.update();
    }
}