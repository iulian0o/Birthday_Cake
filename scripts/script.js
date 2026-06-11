document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  let candles = [];
  let lastCandleTime = 0;
  const COOLDOWN_MS = 2000;
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

    const lowFreqBins = Math.floor(bufferLength * 0.1);
    const lowFreqData = dataArray.slice(0, lowFreqBins);

    const lowFreqAverage =
      lowFreqData.reduce((sum, val) => sum + val, 0) / lowFreqBins;

    const highFreqData = dataArray.slice(lowFreqBins);
    const highFreqAverage =
      highFreqData.reduce((sum, val) => sum + val, 0) / highFreqData.length;

    return lowFreqAverage > 100 && highFreqAverage < 60;
  }

  function showBirthdayMessage() {
    const cakeRect = cake.getBoundingClientRect();
    const midY = cakeRect.top / 2;

    const msg = document.createElement("div");
    msg.textContent = "Buon Compleano, Chiara!";
    msg.style.cssText = `
    position: fixed;
    left: 50%;
    top: ${midY}px;
    transform: translateX(-50%);
    font-size: 2rem;
    font-weight: bold;
    font-family: 'Pacifico', cursive;
    color: #c80e74;
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

      const allOut =
        candles.length > 0 && candles.every((c) => c.classList.contains("out"));

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
        analyser.fftSize = 8192;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to acess micrphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your borwser");
  }
});
