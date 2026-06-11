document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  let candles = [];
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

  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
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
