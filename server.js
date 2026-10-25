const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Path to data file
const dataPath = path.join(__dirname, 'schedules.json');

// Helper to get schedules data
function getSchedules() {
    try {
        if (fs.existsSync(dataPath)) {
            return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }
    } catch (e) {
        console.error("Error reading JSON file:", e);
    }
    return { routes: [] };
}

// Helper to save schedules data
function saveSchedules(data) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing JSON file:", e);
    }
}

// Serve static single page application files
app.use(express.static(__dirname));

// Live API Endpoint for polling tracking telemetry
app.get('/api/schedules', (req, res) => {
    res.json(getSchedules());
});

// Dynamic Python-like background daemon simulated in Node.js
// Randomizes traffic telemetry updates every 5 seconds to mock dynamic traffic changes
setInterval(() => {
    let data = getSchedules();
    if (data.routes && data.routes.length > 0) {
        data.routes = data.routes.map(route => {
            const roll = Math.random();
            if (roll < 0.15) {
                // 15% chance route hits Prince George's County traffic delay
                const delay = Math.floor(Math.random() * 25) + 5;
                route.status = `Delayed (${delay}m)`;
                route.delay_mins = delay;
            } else if (roll < 0.30) {
                // 15% chance back to schedule rhythm
                route.status = "On Time";
                route.delay_mins = 0;
            }
            return route;
        });
        saveSchedules(data);
    }
}, 5000);

// Root layout routing fallback
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`AXIOM BSU Cloud Platform Live on port ${PORT}`);
    console.log(`Telemetry Dynamic Traffic Simulation engine running...`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
