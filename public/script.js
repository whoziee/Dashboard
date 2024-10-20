document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("login-container").style.display = 'none';
    document.getElementById("dashboard-container").style.display = 'block';
    startDashboard();
});

function startDashboard() {
    const socket = io("https://data.gdscnsut.com");

    socket.on('random_number', (data) => {
        const number = data.value || data.number || data;
        document.getElementById("number-display").innerText = `Latest Random Number: ${number}`;
        updateCharts(number);
    });

    const lineCtx = document.getElementById("lineChart").getContext("2d");
    const barCtx = document.getElementById("barChart").getContext("2d");
    const pieCtx = document.getElementById("pieChart").getContext("2d");
    const radarCtx = document.getElementById("radarChart").getContext("2d");
    const doughnutCtx = document.getElementById("doughnutChart").getContext("2d");

    const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Random Number (Line)', data: [] }] },
        options: { scales: { y: { beginAtZero: true, suggestedMax: 10 } } }
    });

    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Random Number (Bar)', data: [] }] },
        options: { scales: { y: { beginAtZero: true, suggestedMax: 10 } } }
    });

    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{ data: [0, 0, 0], backgroundColor: ['red', 'blue', 'yellow'] }]
        }
    });

    const radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4', 'Metric 5'],
            datasets: [{
                label: 'Radar Visualization',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)'
            }]
        }
    });

    const doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{ data: [0, 0, 0], backgroundColor: ['green', 'orange', 'red'] }]
        }
    });

    function updateCharts(number) {
        const timestamp = new Date().toISOString();

        lineChart.data.labels.push(timestamp);
        lineChart.data.datasets[0].data.push(number);

        barChart.data.labels.push(timestamp);
        barChart.data.datasets[0].data.push(number);

        if (number < 3) pieChart.data.datasets[0].data[0]++;
        else if (number < 6) pieChart.data.datasets[0].data[1]++;
        else pieChart.data.datasets[0].data[2]++;

        radarChart.data.datasets[0].data = radarChart.data.datasets[0].data.map(
            (val, idx) => val + Math.floor(Math.random() * 10)
        );

        if (number < 3) doughnutChart.data.datasets[0].data[0]++;
        else if (number < 6) doughnutChart.data.datasets[0].data[1]++;
        else doughnutChart.data.datasets[0].data[2]++;

        lineChart.update();
        barChart.update();
        pieChart.update();
        radarChart.update();
        doughnutChart.update();
    }
}
