document.addEventListener('DOMContentLoaded', () => {
  const audioInput = document.getElementById('audioInput');
  const audioElement = document.getElementById('audioElement');
  const visualizerCanvas = document.getElementById('visualizer');
  const visualizerContext = visualizerCanvas.getContext('2d');


//to do list (fix grid and barwidth)

  let audioContext, analyser, source, dataArray;

  audioInput.addEventListener('change', handleFileSelect);
  audioElement.addEventListener('play', playAudio);
  audioElement.addEventListener('pause', pauseAudio);

  function handleFileSelect(event) {
    const file = event.target.files[0];

    if (file) {
      const objectURL = URL.createObjectURL(file);
      audioElement.src = objectURL;
      initAudio();
    }
  }

  function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audioElement);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    visualizerContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    drawVisualizer();
  }

  function drawVisualizer() {
    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      visualizerContext.fillStyle = 'rgb(255, 255, 255)';
      visualizerContext.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

      const barWidth = (visualizerCanvas.width) / dataArray.length;
      let barHeight;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i] / 2;

        visualizerContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        visualizerContext.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 10;
      }

      drawGrid();
      requestAnimationFrame(draw);
    };

    draw();
  }

  function drawGrid() {
    const gridSize = 40;
    const cellSize = visualizerCanvas.width / gridSize;

    visualizerContext.strokeStyle = '#ccc';

    for (let i = 1; i < gridSize; i++) {
      const x = i * cellSize;
      visualizerContext.beginPath();
      visualizerContext.moveTo(x, 0);
      visualizerContext.lineTo(x, visualizerCanvas.height);
      visualizerContext.stroke();
    }

    for (let j = 1; j < gridSize; j++) {
      const y = j * cellSize;
      visualizerContext.beginPath();
      visualizerContext.moveTo(0, y);
      visualizerContext.lineTo(visualizerCanvas.width, y);
      visualizerContext.stroke();
    }
  }

  function playAudio() {
    audioContext.resume().then(() => {
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    });
  }

  function pauseAudio() {
    source.disconnect(analyser);
    analyser.disconnect(audioContext.destination);
  }
});

