    // lista in care se plaseaza videurile care pot fi vazute de utilizator in pagina
    var mediaSource = [
        "Media/DoomerMotivation.mp4",
        "Media/OldCartoons.mp4",
        "Media/SigmaMale.mp4",
        "Media/ZyzzMotivation.mp4"];

    var muted = true;
    var videoContainer;                                 // obiect care contine elementul video si informatiile asociate

    var canvas = document.getElementById("myCanvas");   // preia elementul canvas din pagina
    var ctx = canvas.getContext("2d");
    
    var video = document.createElement("video");        // creare element video
    video.src = mediaSource[0];                         // videoul va incepe sa se incarce
    video.autoPlay = false;                             // asigurare ca videoul nu va incepe sa ruleze automat
    video.loop = true;                                  // setare care face videoul sa reia de la capat odata cu terminarea acestuia
    video.muted = muted;
    
    videoContainer = {                                  // containerul videoului
        video : video,
        ready : false,   
    };

    // To handle errors. This is not part of the example at the moment. Just fixing for Edge that did not like the ogv format video
    video.onerror = function(e) {
        document.body.removeChild(canvas);
        document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
        document.body.innerHTML += "Users of IE9+ , the browser does not support WebM videos used by this demo";
        document.body.innerHTML += "<br><a href='https://tools.google.com/dlpage/webmmf/'> Download IE9+ WebM support</a> from tools.google.com<br> this includes Edge and Windows 10";
    }

    desenarePlaylist();                                                         // desenare lista de videouri vizualizabile
    document.getElementsByClassName("listElement")[0].classList.add("active");  // evidentiere video curent

    video.oncanplay = readyToPlayVideo; // set the event to the play function that
                        // can be found below
    function readyToPlayVideo(e) { // this is a referance to the video
        // the video may not match the canvas size so find a scale to fit
        videoContainer.scale = Math.min(
                    canvas.width / this.videoWidth,
                    canvas.height / this.videoHeight);
        videoContainer.ready = true;
        // the video can be played so hand it off to the display function
        requestAnimationFrame(updateCanvas);
        // add instruction
        document.querySelector(".mute").textContent = "Mute";
    }

    function updateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // only draw if loaded and ready
        if(videoContainer !== undefined && videoContainer.ready) {

            video.muted = muted;
            var scale = videoContainer.scale;
            var vidH = videoContainer.video.videoHeight;
            var vidW = videoContainer.video.videoWidth;
            // find the top left of the video on the canvas
            var top = canvas.height / 2 - (vidH /2 ) * scale;
            var left = canvas.width / 2 - (vidW /2 ) * scale;

            // now just draw the video the correct size
            ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);

            if(videoContainer.video.paused){ // if not playing show the paused screen
                drawCenterIcon();
            }
        }
        // all done for display
        // request the next frame in 1/60th of a second
        requestAnimationFrame(updateCanvas);
    }

    function playPauseClick() {
        if(videoContainer !== undefined && videoContainer.ready) {
            if(videoContainer.video.paused) {                                 
                videoContainer.video.play();
            }else {
                videoContainer.video.pause();
            }
        }
    }
    function videoMute() {
        muted = !muted;
        if(muted) {
            document.querySelector(".mute").textContent = "Mute";
        }else {
            document.querySelector(".mute").textContent= "Sound on";
        }
    }
    // register the event
    canvas.addEventListener("click", playPauseClick);
    document.querySelector(".mute").addEventListener("click", videoMute);

    // functie care adauga un div in divul parinte
    function adaugaDivInDiv(div, text) {
        div.innerHTML += "<br><div class='listElement'>" +
            "<div class='listDrag'>=</div>" +
            "<div class='listImgText'><p>" + text + "</p></div><button class='listDeleteVideo'>x</button></div>";
    }
    // functie care deseneaza playlistul si creaza eventurile pentru toate controalelele
    function desenarePlaylist() { // creare lista playlist cu videouri vizionabile
        var playlist = document.getElementById("playlist");
        // golire elemente playlist si adaugare header
        playlist.innerHTML = "<h3>Playlist video</h3>";

        for(let i = 0; i < mediaSource.length; i++) {       // pentru fiecare video se creaza un div cu videourile din playlist
            adaugaDivInDiv(playlist, mediaSource[i]);    // se apeleaza functia de adaugare div
        }
        // creare contexte video pentru toate divurile din playlist
        var videoContexts = document.getElementsByClassName("listImgText");

        // creare contexte pentru butoanele de delete video pentru toate divurile din playlist
        var deleteVideoContexts = document.getElementsByClassName("listDeleteVideo");

        // creare contexte pentru butoanele de drag video pentru toate divurile din playlist
        var dragVideoContexts = document.getElementsByClassName("listDrag");

        

        // creare event listener pentru apasarea click pe contextele video
        for(let i = 0; i < videoContexts.length; i++) {
            videoContexts[i].addEventListener('click', () => {
                video.src = mediaSource[i];

                // evidentiere video curent
                var listaElemente = document.getElementsByClassName("listElement"); // preluare lista de elemente ce trebuie evidentiate
                for(let j = 0; j < listaElemente.length; j++) {
                    listaElemente[j].classList.remove("active");                    // stergerea clasei care evidentiaza celelalte videouri neselectate
                }
                listaElemente[i].classList.add("active");                           // adaugarea clasei care evidentiaza videoul curent
            });
        }
        
        // creare event listener pentru apasarea click pe contextele de delete video
        for(let i = 0; i < deleteVideoContexts.length; i++) {
            deleteVideoContexts[i].addEventListener('click', () => {
                mediaSource.splice(i, 1);
                desenarePlaylist();
            });
        }
    }

    // controalele desenate peste canvas
    function drawCenterIcon() {
        ctx.fillStyle = "black";  // darken display
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#DDD"; // colour of play icon
        ctx.globalAlpha = 0.75; // partly transparent
    
        ctx.beginPath(); // create the path for the icon
        var size = (canvas.height / 2) * 0.25;  // the size of the icon
        ctx.moveTo(canvas.width/2 + size, canvas.height / 2); // start at the pointy end
        ctx.lineTo(canvas.width/2 - size/2, canvas.height / 2 + size);
        ctx.lineTo(canvas.width/2 - size/2, canvas.height / 2 - size);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1; // restore alpha
    }
    
    function drawPreviousIcon() {
        ctx.fillStyle = "#DDD";
        ctx.globalAlpha = 0.75;
        // (20, canvas.height - 25) -> (35, canvas.height - 5)
        var size = 10;
        var marginLeft = 20;
        var marginBottom = 10;
        ctx.beginPath();
        ctx.moveTo(marginLeft, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + size / 3, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + size / 3, canvas.height - marginBottom - 1.5 * size);
        ctx.lineTo(marginLeft, canvas.height - marginBottom - 1.5 * size);
        ctx.closePath();
        ctx.fill();
    
        ctx.beginPath();
        ctx.moveTo(marginLeft + size  / 2, canvas.height - size / 2 - marginBottom);
        ctx.lineTo(marginLeft + 1.5 * size, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + 1.5 * size, canvas.height - marginBottom - 1.5 * size);
        ctx.closePath();
        ctx.fill();
    }
    
    function drawPlayIcon() {
        ctx.fillStyle = "#DDD";
        ctx.globalAlpha = 0.75;
        // (60, canvas.height - 25) -> (75, canvas.height - 5)
        var size = 10;
        var marginLeft = 60;
        var marginBottom = 10;
    
        ctx.beginPath();
        ctx.moveTo(marginLeft, canvas.height - size / 2 - marginBottom);
        ctx.lineTo(marginLeft + 1.5 * size, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + 1.5 * size, canvas.height - marginBottom - 1.5 * size);
        ctx.closePath();
        ctx.fill();
    }
    
    function drawPauseIcon() {
        ctx.fillStyle = "#DDD";
        ctx.globalAlpha = 0.75;
        // (60, canvas.height - 25) -> (75, canvas.height - 5)
        var size = 10;
        var marginLeft = 60;
        var marginBottom = 10;
        
        ctx.beginPath();
        ctx.moveTo(marginLeft, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + size / 3, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + size / 3, canvas.height - marginBottom - 1.5 * size);
        ctx.lineTo(marginLeft, canvas.height - marginBottom - 1.5 * size);
        ctx.closePath();
        ctx.fill();
    
        ctx.beginPath();
        ctx.moveTo(marginLeft + 1.5 * size, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + 1.5 * size - size / 3, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + 1.5 * size - size / 3, canvas.height - marginBottom - 1.5 * size);
        ctx.lineTo(marginLeft + 1.5 * size, canvas.height - marginBottom - 1.5 * size);
        ctx.closePath();
        ctx.fill();
    }
    
    function drawNextIcon() {
        ctx.fillStyle = "#DDD";
        ctx.globalAlpha = 0.75;
        // (100, canvas.height - 25) -> (75, canvas.height - 5)
        var size = 10;
        var marginLeft = 100;
        var marginBottom = 10;
    
        ctx.beginPath();
        ctx.moveTo(marginLeft + size, canvas.height - size / 2 - marginBottom);
        ctx.lineTo(marginLeft, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft, canvas.height - marginBottom - 1.5 * size);
        ctx.closePath();
        ctx.fill();
    
        ctx.beginPath();
        ctx.moveTo(marginLeft + size + size / 6, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + size + size / 2, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft + size + size / 2, canvas.height - marginBottom - 1.5 * size);
        ctx.lineTo(marginLeft + size + size / 6, canvas.height - marginBottom - 1.5 * size);
        ctx.closePath();
        ctx.fill();
    }
    
    function drawProgressBar() {
        ctx.fillStyle = "#DDD";
        ctx.globalAlpha = 0.75;
        // (0, canvas.height - 33) -> (canvas.width, canvas.height - 30)
        var size = 3;
        var marginBottom = 30;
    
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - marginBottom);
        ctx.lineTo(canvas.width, canvas.height - marginBottom);
        ctx.lineTo(canvas.width, canvas.height - marginBottom - size);
        ctx.lineTo(0, canvas.height - marginBottom - size);
        ctx.closePath();
        ctx.fill();
    }