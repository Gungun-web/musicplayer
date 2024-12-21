
var audio = document.querySelector("audio");
var play = document.querySelector(".play");
var pause = document.querySelector(".pause");
var previous = document.querySelector(".previous");
var next = document.querySelector(".next");
var volumeControl = document.querySelector("#volume");
var volumeDown = document.querySelector("#volume-down");
var volumeUp = document.querySelector("#volume-up");
var seek = document.querySelector("#seek");
var currentTimeElement = document.querySelector(".current-time");
var durationElement = document.querySelector(".duration");
var albumArt = document.querySelector("#album-art");
var trackTitle = document.querySelector("#track-title");
var trackArtist = document.querySelector("#track-artist");
var addMusic = document.querySelector("#add-music");
var musicListElement = document.querySelector("#music-list");

var musicList = [];
var currentTrackIndex = 0;

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function loadTrack(index) {
    var track = musicList[index];
    if (!track) return;
    audio.src = URL.createObjectURL(track.file);
    trackTitle.textContent = track.name;
    trackArtist.textContent = "Unknown Artist";
    albumArt.style.backgroundImage = "url('https://via.placeholder.com/150')";
    audio.load();
}

function updateMusicList() {
    musicListElement.innerHTML = "";
    musicList.forEach((song, index) => {
        var listItem = document.createElement("li");
        listItem.className = "flex justify-between items-center bg-gray-200 p-2 rounded";
        listItem.innerHTML = `
            <span>${song.name}</span>
            <button class="play-song text-blue-500" data-index="${index}">Play</button>
        `;
        musicListElement.appendChild(listItem);
    });

    document.querySelectorAll(".play-song").forEach(button => {
        button.addEventListener("click", function () {
            currentTrackIndex = parseInt(this.dataset.index);
            loadTrack(currentTrackIndex);
            audio.play();
        });
    });
}

addMusic.addEventListener("change", function (event) {
    var files = event.target.files;
    for (let file of files) {
        musicList.push({ name: file.name, file: file });
    }
    updateMusicList();
});

play.addEventListener("click", function () {
    audio.play();
    play.classList.add("hidden");
    pause.classList.remove("hidden");
});

pause.addEventListener("click", function () {
    audio.pause();
    play.classList.remove("hidden");
    pause.classList.add("hidden");
});

audio.addEventListener("timeupdate", function () {
    var currentTime = audio.currentTime;
    var duration = audio.duration;
    seek.value = (currentTime / duration) * 100;
    currentTimeElement.textContent = formatTime(currentTime);
    durationElement.textContent = formatTime(duration);
});

seek.addEventListener("input", function () {
    var seekTime = audio.duration * (seek.value / 100);
    audio.currentTime = seekTime;
});

volumeControl.addEventListener("input", function () {
    audio.volume = volumeControl.value;
});

volumeDown.addEventListener("click", function () {
    audio.volume = Math.max(0, audio.volume - 0.1);
    volumeControl.value = audio.volume;
});

volumeUp.addEventListener("click", function () {
    audio.volume = Math.min(1, audio.volume + 0.1);
    volumeControl.value = audio.volume;
});

// Load the first track if available
if (musicList.length > 0) loadTrack(currentTrackIndex);