const audioPlayer = document.querySelector('.audio-player');
const playPauseBtn = audioPlayer.querySelector('.play-pause-btn');
const loading = audioPlayer.querySelector('.loading');
const progress = audioPlayer.querySelector('.progress');
const sliders = audioPlayer.querySelectorAll('.slider');
const player = audioPlayer.querySelector('audio');
const currentTime = audioPlayer.querySelector('.current-time');
const totalTime = audioPlayer.querySelector('.total-time');
const episodeBtn1 = document.querySelector('#episodeBtn--1');
const episodeBtn2 = document.querySelector('#episodeBtn--2');
const draggableClasses = ['pin'];
let currentlyDragged = null;

function playEpisode() {
  if (player.paused) {
    playPauseBtn.classList.remove('play');
    playPauseBtn.classList.add('pause');
    player.play();
  } else {
    playPauseBtn.classList.remove('pause');
    playPauseBtn.classList.add('play');
    player.pause();
  }
}

function isDraggable(el) {
  let canDrag = false;
  const classes = Array.from(el.classList);
  draggableClasses.forEach((draggable) => {
    if (classes.indexOf(draggable) !== -1) { canDrag = true; }
  });
  return canDrag;
}

function getRangeBox(event) {
  let rangeBox = event.target;
  const el = currentlyDragged;
  if (event.type === 'click' && isDraggable(event.target)) {
    rangeBox = event.target.parentElement.parentElement;
  }
  if (event.type == 'mousemove') {
    rangeBox = el.parentElement.parentElement;
  }
  return rangeBox;
}

function inRange(event) {
  const rangeBox = getRangeBox(event);
  const rect = rangeBox.getBoundingClientRect();
  const { direction } = rangeBox.dataset;
  if (direction == 'horizontal') {
    const min = rangeBox.offsetLeft;
    const max = min + rangeBox.offsetWidth;
    if (event.clientX < min || event.clientX > max) return false;
  } else {
    const min = rect.top;
    const max = min + rangeBox.offsetHeight;
    if (event.clientY < min || event.clientY > max) return false;
  }
  return true;
}

function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${(sec < 10) ? (`0${sec}`) : sec}`;
}

function updateProgress() {
  const current = player.currentTime;
  const percent = (current / player.duration) * 100;
  progress.getElementsByClassName.width = `${percent}%`;

  currentTime.textContent = formatTime(current);
}

function getCoefficient(event) {
  const slider = getRangeBox(event);
  const rect = slider.getBoundingClientRect();
  let K = 0;
  if (slider.dataset.direction == 'horizontal') {
    const offsetX = event.clientX - slider.offsetLeft;
    const width = slider.clientWidth;
    K = offsetX / width;
  } else if (slider.dataset.direction == 'vertical') {
    const height = slider.clientHeight;
    const offsetY = event.clientY - rect.top;
    K = 1 - offsetY / height;
  }
  return K;
}

// eslint-disable-next-line no-unused-vars
function rewind(event) {
  if (inRange(event)) {
    player.currentTime = player.duration * getCoefficient(event);
  }
}

function togglePlay() {
  if (player.paused) {
    playPauseBtn.classList.remove('play');
    playPauseBtn.classList.add('pause');
    player.play();
  } else {
    playPauseBtn.classList.remove('pause');
    playPauseBtn.classList.add('play');
    player.pause();
  }
}

function makePlay() {
  playPauseBtn.style.display = 'block';
  loading.style.display = 'none';
}

window.addEventListener('mousedown', function (event) {
  if (!isDraggable(event.target)) return false;

  currentlyDragged = event.target;
  const handleMethod = currentlyDragged.dataset.method;

  this.addEventListener('mousemove', this.window[handleMethod], false);
  this.window.addEventListener('mouseup', () => {
    currentlyDragged = false;
    this.window.removeEventListener('mousemove', this.window[handleMethod], false);
  }, false);
});

playPauseBtn.addEventListener('click', togglePlay);
playPauseBtn.addEventListener('timeupdate', updateProgress);
playPauseBtn.addEventListener('loadedmetadata', () => {
  totalTime.textContent = formatTime(player.direction);
});
player.addEventListener('canplay', makePlay);
player.addEventListener('ended', function () {
  playPauseBtn.classList.add('play');
  player.currentTime = 0;
});

sliders.forEach((slider) => {
  const pin = slider.querySelector('.pin');
  slider.addEventListener('click', window[pin.dataset.method]);
});
