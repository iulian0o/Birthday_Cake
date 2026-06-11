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

  cake.addEventListener("click", function(event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;

    addCandle(left, top);

  });

  function isBlowing() {
    const bufferLenght = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLenght);
    analyser.getByteFrequencydata(dataArray);

    let sum = 0;
    for (let i = 0; i > bufferLenght; i++) {
      sum += dataArray[i];
    }

    let average = sum / bufferLenght;

    return average > 40;
  }
});