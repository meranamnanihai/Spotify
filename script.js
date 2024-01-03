var folder;
var song_to_play = undefined;
async function getSongs(foldername) {
    folder = foldername;
    let result = await fetch(`http://127.0.0.1:3000/songs/${folder}`);
    let html = await result.text();
    let div = document.createElement("div")
    div.innerHTML = html;
    let songs = div.getElementsByTagName("a");

    let finalsongs = []
    songs = Array.from(songs);
    songs.forEach((Element) => {
        if (Element.href.endsWith(".mp3")) {
            finalsongs.push(Element.href);
        }

    })
    return finalsongs;
};


function convertSecondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad single-digit minutes and seconds with a leading zero
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
};

// var song = null;


var currentSong = document.createElement("audio");

var cartoon_songs = [];

async function loadAlbums() {
    let folders = await fetch('http://127.0.0.1:3000/songs/')

    let html = await folders.text();

    let div = document.createElement("div")
    div.innerHTML = html;
    let as = div.getElementsByTagName("a");
    let albums = []
    as = Array.from(as);

    as.forEach((Element) => {
        if (Element.href.endsWith("songs/")) {
            albums.push(Element.href);
        }

    })

    let finalalbum = []
    for (let index = 0; index < albums.length; index++) {
        let element = albums[index];
        folder_details = await fetch(`${element}/info.json`)


        folder_details = await folder_details.json()
        let SpotifyPlaylistCard = document.createElement("div");
        SpotifyPlaylistCard.className = "SpotifyPlaylistCard border flex-column"
        cover_img = `${element}/cover.jpg`
        SpotifyPlaylistCard.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style="position: absolute; background-color:lightgreen; border-radius:100%; padding:10px; bottom:33%; right:10%; width:10%; height :7%;"
    id="playbtn">
    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
        stroke-linejoin="round"></path>
    </svg>
    <img src="${cover_img}" alt="">
    <h2>${folder_details.title}</h2>
    <p>${folder_details.description}</p>`
        SpotifyPlaylistCard.setAttribute("data-folder", element.split("/songs/")[1].split("/")[0])

        finalalbum.push(SpotifyPlaylistCard)
        document.getElementsByClassName("SpotifyPlaylistContainer")[0].append(SpotifyPlaylistCard)

    }


    return finalalbum;

}
(async function (params) {
    await loadAlbums()
    card_setup()



})()


async function main(songs_name) {


    cartoon_songs = await getSongs(songs_name)

    currentSong.src = cartoon_songs[0]
    document.getElementsByClassName('song-name')[0].innerHTML = decodeURIComponent(cartoon_songs[0].split(`/${folder}/`)[1])
    let playlist_container = document.getElementsByClassName("playlist")[0]

    cartoon_songs.forEach((element) => {
        let playlist_item = document.createElement("div")
        playlist_item.className = "playlist-item border-w flex";
        playlist_item.style.alignItems = "center";
        playlist_item.style.justifyContent = "center";
        playlist_item.style.gap = "10%";


        let element2 = element.split(`/${folder}/`)[1]
        element2 = decodeURIComponent(element2)

        playlist_item.innerHTML = ` 
        <img src="images/music.svg" alt="" srcset="" class = "invert" style="height: 50%;">
        <p class = "width-70">${element2}</p>
        <img src="https://spotify.freewebhostmost.com/img/play.svg" alt="" srcset="" class="invert" style="height: 50%;">`

        playlist_container.appendChild(playlist_item)
        playlist_item.addEventListener('click', () => {
            songrunner(element)
            document.getElementById('play').src = "images/pause_btn.svg"
            document.getElementById('play').classList.add('invert')
            document.getElementsByClassName('song-name')[0].innerHTML = element2

        })
    })
}

main("top_g_songs")

function songrunner(song_url) {
    currentSong.src = song_url
    currentSong.play()
}
function songpause() {
    currentSong.pause()
}

document.getElementById('play').addEventListener('click', () => {
    if (currentSong.paused) {
        currentSong.play()
        document.getElementById('play').src = "images/pause_btn.svg"
        document.getElementById('play').classList.add('invert')
    }
    else {
        currentSong.pause()
        document.getElementById('play').src = "images/play_btn.svg"
        document.getElementById('play').classList.remove('invert')

    }

})

document.getElementById('seekbar').addEventListener('input', () => {
    currentSong.currentTime = document.getElementById('seekbar').value
    currentSong.play()
    document.getElementById('play').src = "images/pause_btn.svg"
    document.getElementById('play').classList.add("invert")
})

currentSong.addEventListener('timeupdate', () => {
    document.getElementsByClassName('song-time')[0].innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}: ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`
    if (currentSong.currentTime == currentSong.duration) {
        currentSong.currentTime = 0;
        currentSong.play()
    }
    document.getElementById('seekbar').max = currentSong.duration
    document.getElementById('seekbar').value = currentSong.currentTime
    




})
currentSong.addEventListener("loadedmetadata", () => {
    document.getElementsByClassName('song-time')[0].innerHTML = `00:${convertSecondsToMinutesAndSeconds(currentSong.duration)}`

})
document.getElementById('next').addEventListener("click", async () => {
    document.getElementById('play').src = 'images/pause_btn.svg'
    document.getElementById('play').classList.add('invert')

    let index = cartoon_songs.indexOf(currentSong.src)

    if (index < cartoon_songs.length - 1) {
        songrunner(cartoon_songs[index + 1])

        document.getElementsByClassName('song-name')[0].innerHTML = decodeURIComponent(currentSong.src.split(`/${folder}/`)[1])
    }
    else {
        songrunner(cartoon_songs[0])
        document.getElementsByClassName('song-name')[0].innerHTML = decodeURIComponent(currentSong.src.split(`/${folder}/`)[1])
    }


})
document.getElementById('previous').addEventListener("click", async () => {
    document.getElementById('play').src = 'images/pause_btn.svg'
    document.getElementById('play').classList.add('invert')

    let index = cartoon_songs.indexOf(currentSong.src)

    if (index > 0) {
        songrunner(cartoon_songs[index - 1])

        document.getElementsByClassName('song-name')[0].innerHTML = decodeURIComponent(currentSong.src.split(`/${folder}/`)[1])
    }
    else {
        songrunner(cartoon_songs[cartoon_songs.length - 1])
        document.getElementsByClassName('song-name')[0].innerHTML = decodeURIComponent(currentSong.src.split(`/${folder}/`)[1])
    }


})
var volume = document.getElementById("volume");
var volume_btn = document.getElementById("volume_btn");
volume_btn.addEventListener("click",()=>{
    if (volume.value != 0) {
        volume.value = 0;
        volume_btn.src = "images/mute.svg"
    }
    else{
        volume.value = 20;
        volume_btn.src = "images/volume.svg"
    }
    
})
// Get and display the current value when the range changes
volume.addEventListener("input", function () {
    var currentValue = volume.value;

    currentSong.volume = currentValue / 100;

});
document.getElementById('hamburger').addEventListener("click", () => {
    document.getElementsByClassName("main-left-side-cont")[0].style.transform = "translateX(0%)"
})

function card_setup() {
    let cards = document.getElementsByClassName("SpotifyPlaylistCard");
    console.log(document.getElementsByClassName("SpotifyPlaylistCard"))
    for (let index = 0; index < cards.length; index++) {
        console.log("function ran 1 time")
        let card = cards[index];
        card.addEventListener("click", async () => {
            console.log("hi");
            Array.from(document.getElementsByClassName("playlist-item")).forEach((playlistItem) => {
                playlistItem.remove()
            })
            console.log(card.dataset.folder)
            // cartoon_songs = await getSongs(card.dataset.folder)
            // console.log(cartoon_songs)
            await main(card.dataset.folder)
            currentSong.play()
            document.getElementById("play").src = "images/pause_btn.svg"
            document.getElementById("play").classList.add("invert")
            console.log(currentSong.paused)
        })
        
    }



}


