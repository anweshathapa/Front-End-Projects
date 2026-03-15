const params = new URLSearchParams(window.location.search);
// const name = params.get("name") || "Friend";
const name = "Archit";
let candleCount = parseInt(params.get("candles")) || 4;
candleCount = Math.min(Math.max(candleCount, 1), 30);

// 2. Initialize Text & Glow Variable
const birthdayText = document.getElementById("birthdayText");
birthdayText.innerHTML = `
    <div id="mainTitle">Happy Birthday, ${name}!</div>
    <div id="subTitle">Make a wish and blow candles.</div>
`;

const cake = document.getElementById("cake");
const glow = document.getElementById('cursorGlow'); 

const colors = ["green-candle", "purple-candle", "blue-candle", "yellow-candle"];
const CAKE_VISUAL_WIDTH = 35;

// 3. Create Candles logic
function createCandles(count) {
    cake.innerHTML = "";
    const CANDLE_VISUAL_WIDTH = 2;
    const availableWidth = CAKE_VISUAL_WIDTH;
    const candlesPerRow = 6;

    for (let i = 0; i < count; i++) {
        const candle = document.createElement("div");
        candle.classList.add("candle");
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        candle.classList.add(colorClass);

        const row = Math.floor(i / candlesPerRow);
        const col = i % candlesPerRow;
        const totalCandlesInRow = Math.min(candlesPerRow, count - row * candlesPerRow);
        const rowSpacing = availableWidth / (totalCandlesInRow + 1);

        const leftBase = rowSpacing * (col + 1) - CANDLE_VISUAL_WIDTH / 2 + 5;
        const rowShift = row % 2 === 0 ? 0 : 4;

        candle.style.position = "absolute";
        candle.style.top = `${10 + row * 3}px`;
        candle.style.left = `${leftBase - rowShift + 4}px`;

        cake.appendChild(candle);
    }
}
createCandles(candleCount);

// 4. Microphone / Blow Detection
async function startMicDetection() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let blown = false;

        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            let highFreqSum = 0;
            let lowFreqSum = 0;
            const midpoint = dataArray.length / 2;

            for (let i = 0; i < dataArray.length; i++) {
                if (i < midpoint) lowFreqSum += dataArray[i];
                else highFreqSum += dataArray[i];
            }

            const ratio = (highFreqSum / (dataArray.length / 2)) / ((lowFreqSum / (dataArray.length / 2)) + 1);

            if (ratio > 0.5 && !blown) {
                blown = true;
                blowOutCandles();
            }
            requestAnimationFrame(detectBlow);
        }
        detectBlow();
    } catch (err) {
        console.error("Mic access error:", err);
    }
}

// 5. Blow Out Sequence
function blowOutCandles() {
    const candles = document.querySelectorAll(".candle");
    candles.forEach((candle) => {
        const delay = Math.random() * 1000;
        setTimeout(() => {
            candle.classList.add("blown");
        }, delay);
    });

    setTimeout(() => {
        const subTitle = document.getElementById("subTitle");
        subTitle.textContent = `Yayy! Wishing you the happiest birthday ever!! 🎉`;
    }, 1200);
}

startMicDetection();

// 6. CURSOR & TOUCH EFFECTS (DESKTOP & MOBILE)
window.addEventListener('mousemove', (e) => {
    handleSparkles(e.clientX, e.clientY);
    if(glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }
});

window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    handleSparkles(touch.clientX, touch.clientY);
    if(glow) {
        glow.style.left = touch.clientX + 'px';
        glow.style.top = touch.clientY + 'px';
    }
}, { passive: false });

function handleSparkles(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail'; 
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';

    const trailColors = ['#FFD700', '#FF69B4', '#00FFFF', '#ADFF2F'];
    sparkle.style.background = trailColors[Math.floor(Math.random() * trailColors.length)];

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}
