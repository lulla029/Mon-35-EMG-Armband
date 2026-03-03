// Connect local server ( sending EMG values )
const socket = new WebSocket('ws://localhost:8081');

// ctx: drawing tool for the canvas
// find the canvas on the page (leftChart)
const ctx = document.getElementById('leftChart').getContext('2d');


// use paintbrush (ctx) to drwa a  line graph
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        
        labels: Array(50).fill(''), // 50 empty labels
        datasets: [{ 
            label: 'EMG Signal', 
            data: [], // incoming EMG values are pushed here
            borderColor: '#00f2ff',  // line color
            backgroundColor: 'rgba(0, 242, 255, 0.1)',
            pointRadius: 0,
            fill: true
        }]
    },
    options: { 
        animation: false, 
        scales: { y: { min: 0, max: 4095 } } // y axis range
    }
});

// message arrives from Websocet( expected to be a number)
socket.onmessage = function(event) {
    const val = parseInt(event.data); // convert text to number
    if (!isNaN(val)) {
        document.getElementById('l-val').innerText = val;
        chart.data.datasets[0].data.push(val); // add latest data point the chart
        if (chart.data.datasets[0].data.length > 50) chart.data.datasets[0].data.shift(); // keep only latest 50 points
        chart.update(); // redraw graph
    }
};