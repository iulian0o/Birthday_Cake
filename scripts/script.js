document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  let candles = [];
  let lastCandleTime = 0;
  const COOLDOWN_MS = 1500;
  let analyser;
  let audioContext;
  let microphone;

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
  }

 cake.addEventListener("click", function (event) {
  const now = Date.now();
  const icing = document.querySelector(".icing");
  const icingRect = icing.getBoundingClientRect();
  const cakeRect = cake.getBoundingClientRect();

  const clickX = event.clientX;
  const clickY = event.clientY;

  if (
    clickX < icingRect.left ||
    clickX > icingRect.right ||
    clickY < icingRect.top ||
    clickY > icingRect.bottom
  ) {
    return;
  }

  if (now - lastCandleTime < COOLDOWN_MS) {
    return;
  }

  lastCandleTime = now;

  const left = clickX - cakeRect.left;
  const top = clickY - cakeRect.top;

  addCandle(left, top);
});
  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }

    let average = sum / bufferLength;
    return average > 40;
  }

  function showBirthdayMessage() {
  const cakeRect = cake.getBoundingClientRect();
  const midY = cakeRect.top / 2;

  const msg = document.createElement("div");
  msg.textContent = "Happy Birthday, Chiara!";
  msg.style.cssText = `
    position: fixed;
    left: 50%;
    top: ${midY}px;
    transform: translateX(-50%);
    font-size: 2rem;
    font-weight: bold;
    color: #e91e8c;
    pointer-events: none;
    transition: opacity 0.5s;
    opacity: 1;
  `;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 500);
  }, 5000);
}

  function blowOutCandles() {
  if (isBlowing()) {
    candles.forEach((candle) => {
      if (!candle.classList.contains("out") && Math.random() > 0.5) {
        candle.classList.add("out");
      }
    });

    const allOut = candles.length > 0 && candles.every((c) => c.classList.contains("out"));

    if (allOut) {
      showBirthdayMessage();
    }
  }
}

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to acess micrphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your borwser");
  }
});
