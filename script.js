    // lista in care se plaseaza videurile care pot fi vazute de utilizator in pagina
    var mediaSource = [
        "Media/DoomerMotivation.mp4",
        "Media/OldCartoons.mp4",
        "Media/SigmaMale.mp4",
        "Media/ZyzzMotivation.mp4"];

    var frameNum;                                       // reprezinta numarul de frame-uri parcurse dintr-un video
    var muted = true;                                   // variabila care retine daca sunetul este redat sau nu
    var videoContainer;                                 // obiect care contine elementul video si informatiile asociate

    var canvas = document.getElementById("myCanvas");   // preia elementul canvas din pagina
    var ctx = canvas.getContext("2d");
    
    var video = document.createElement("video");        // creare element video
    video.src = mediaSource[0];                         // videoul va incepe sa se incarce
    video.autoPlay = false;                             // asigurare ca videoul nu va incepe sa ruleze automat
    video.loop = false;
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

    video.oncanplay = readyToPlayVideo; // set the event to the play function that
                        // can be found below
    function readyToPlayVideo(e) { // this is a referance to the video
        // the video may not match the canvas size so find a scale to fit
        videoContainer.scale = Math.min(
                    canvas.width / this.videoWidth,
                    canvas.height / this.videoHeight);
        videoContainer.ready = true;

        frameNum = 0;

        console.log(videoContainer.video.duration * 60);

        // the video can be played so hand it off to the display function
        requestAnimationFrame(updateCanvas);
    }

    function updateCanvas() {

        if(videoContainer.video.duration * 600 <= frameNum) {     // daca videoul s-a terminat
                                                            // se trece la videoul urmator
            let x = mediaSource.indexOf(videoContainer.video.src.slice(videoContainer.video.src.indexOf("Media")));
            if(x != undefined && x != null) {
                if(x < mediaSource.length - 1) {
                    changeVideo(x + 1);
                }
                else {
                    if(mediaSource.x != 1){
                        changeVideo(0);
                    }
                }
            }
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // only draw if loaded and ready
        if(videoContainer !== undefined && videoContainer.ready) {

            videoContainer.video.muted = muted;
            var scale = videoContainer.scale;
            var vidH = videoContainer.video.videoHeight;
            var vidW = videoContainer.video.videoWidth;
            // find the top left of the video on the canvas
            var top = canvas.height / 2 - (vidH /2 ) * scale;
            var left = canvas.width / 2 - (vidW /2 ) * scale;

            // now just draw the video the correct size
            ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);

            if(videoContainer.video.paused) { // if not playing show the paused screen
                drawCenterIcon();
                drawPlayIcon();                 //deseneaza controlul de play
            }
            else {                
                console.log(frameNum);
                frameNum++;                     //cresterea constantei care retine la ce frame ne aflam
                drawPauseIcon();                //deseneaza controlul de pause
            }

            if(muted != true) {
                drawMuteIcon();                 //deseneaza controlul de mute
            }else {
                drawUnmuteIcon();               //deseneaza controlul de unmute
            }

            drawPreviousIcon();                 //deseneaza controlul de previous
            drawNextIcon();                     //deseneaza controlul de next
            drawProgressBar();                  //deseneaza bara de progres
        }
        // all done for display

        // request the next frame in 1/60th of a second
        requestAnimationFrame(updateCanvas);
    }

    function canvasClick(e) {

        if(videoContainer !== undefined && videoContainer.ready) {

            // lista de obiecte care contin delimitarile zonei de controale
            var canvasX = canvas.getBoundingClientRect().x;
            var canvasY = canvas.getBoundingClientRect().y;
            var canvasH = canvas.height;
            var canvasW = canvas.width;
            var scaleH = canvas.getBoundingClientRect().height / canvas.height;
            var scaleW = canvas.getBoundingClientRect().width / canvas.width;

            var pozControale = [
                {x1:20 * scaleW, x2:35 * scaleW, y1: (canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},   // prev
                {x1:60 * scaleW, x2:75 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},    // play/pause
                {x1:100 * scaleW, x2:115 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},  // next
                {x1:140 * scaleW, x2:160 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},  // sound
                {x1:0, x2:canvasW * scaleW, y1:(canvasH - 34) * scaleH, y2:(canvasH - 30) * scaleH},        // progress bar
                {x1:0, x2:canvasW * scaleW, y1:0, y2:(canvasH - 34) * scaleH}                               // orice de deasupra progress bar
            ];

            var ctrl = -1;
            var mousepos = {x:e.clientX - canvasX, y:e.clientY - canvasY};

            // DesenarePozControale(pozControale);

            for(let i = 0; i < pozControale.length; i++) {
                if(pozControale[i].x1 <= mousepos.x && mousepos.x <= pozControale[i].x2 &&
                    pozControale[i].y1 <= mousepos.y && mousepos.y <= pozControale[i].y2) {

                    ctrl = i;
                }
            }

            switch(ctrl) {
                case 0: {
                    index = mediaSource.indexOf(videoContainer.video.src.slice(videoContainer.video.src.indexOf("Media")));
                    if(index != undefined && index != null) {
                        if(index != 0) {
                            changeVideo(index - 1);
                        }
                    }
                    break;
                }
                case 1: {
                    if(videoContainer.video.paused) {                                 
                        videoContainer.video.play();
                    }else {
                        videoContainer.video.pause();
                    }
                    break;
                }
                case 2: {
                    index = mediaSource.indexOf(videoContainer.video.src.slice(videoContainer.video.src.indexOf("Media")));
                    if(index != undefined && index != null) {
                        if(index < mediaSource.length - 1) {
                            changeVideo(index + 1);
                        }
                        else {
                            if(mediaSource.length != 1){
                                changeVideo(0);
                            }
                        }
                    }
                    break;
                }
                case 3: {
                    videoMute();
                    break;
                }
                case 4: {
                    console.log("progress bar");
                    break;
                }
                case 5: {
                    if(videoContainer.video.paused) {                                 
                        videoContainer.video.play();
                    }else {
                        videoContainer.video.pause();
                    }
                    break;
                }
            }
        }
    }

    function videoMute() {
        muted = !muted;
    }

    // register the event
    canvas.addEventListener("click", canvasClick);

    desenarePlaylist(0);                                                    // desenare lista de videouri vizualizabile

    function changeVideo(i) {
        videoContainer.video.src = mediaSource[i];

        frameNum = 0;

        // evidentiere video curent
        var listaElemente = document.getElementsByClassName("listElement"); // preluare lista de elemente ce trebuie evidentiate

        for(let j = 0; j < listaElemente.length; j++) {
            listaElemente[j].classList.remove("active");                    // stergerea clasei care evidentiaza celelalte videouri neselectate
        }
        listaElemente[i].classList.add("active");                           // adaugarea clasei care evidentiaza videoul curent
    }

    // functie care adauga un div in divul parinte
    function adaugaDivInDiv(div, text) {
        div.innerHTML += "<br><div class='listElement'>" +
            "<div class='listDrag'>=</div>" +
            "<div class='listImgText'><p>" + text + "</p></div><button class='listDeleteVideo'>x</button></div>";
    }

    // functie care deseneaza playlistul si creaza eventurile pentru toate controalelele
    function desenarePlaylist(index) { // creare lista playlist cu videouri vizionabile
        var playlist = document.getElementById("playlist");
        // golire elemente playlist si adaugare header
        playlist.innerHTML = "<h3>Playlist video</h3>";

        for(let i = 0; i < mediaSource.length; i++) {       // pentru fiecare video se creaza un div cu videourile din playlist
            adaugaDivInDiv(playlist, mediaSource[i]);       // se apeleaza functia de adaugare div
        }

        if(index != -1)
            document.getElementsByClassName("listElement")[index].classList.add("active");

        // creare contexte video pentru toate divurile din playlist
        var videoContexts = document.getElementsByClassName("listImgText");

        // creare event listener pentru apasarea click pe contextele video
        for(let i = 0; i < videoContexts.length; i++) {
            videoContexts[i].addEventListener('click', () => {
                changeVideo(i);
                index = i;
            });
        }

        // creare contexte pentru butoanele de delete video pentru toate divurile din playlist
        var deleteVideoContexts = document.getElementsByClassName("listDeleteVideo");

        // creare event listener pentru apasarea click pe contextele de delete video
        for(let i = 0; i < deleteVideoContexts.length; i++) {
            deleteVideoContexts[i].addEventListener('click', () => {
                mediaSource.splice(i, 1);                   // se sterge videoul pe care s-a dat click sa fie sters
                if(i == index) {
                    if(i < mediaSource.length) {        // daca videoul sters nu este ultimul din lista de videouri
                        changeVideo(i);                 // schimba videoul cu videoul urmator
                    }
                    else {                                  // daca videoul ce urmeaza sa fie sters este ultimul video
                        if(mediaSource.length == 0) {       // verificam daca acesta este singurul video ramas
                            videoContainer.video.src = null;// daca da, in conatinerul video trecem source-ul videoului ca fiind null
                            index = -1;
                        }
                        else {                              // daca nu este singurul video ramas
                            changeVideo(i - 1);             // videoul se schimba in videoul precedent celui sters
                            index--;
                        }
                    }
                }
                else{
                    if(index > i) {
                        index--;
                    }
                }
                desenarePlaylist(index);
            });
        }

        // creare contexte pentru butoanele de drag video pentru toate divurile din playlist
        var dragVideoContexts = document.getElementsByClassName("listDrag");
    }

    // function DesenarePozControale(controale) {
    //     ctx.fillStyle = "#00F";
    //     controale.forEach(c => {
    //         ctx.fillRect(c.x1, c.y1 / canvas.height * 610 , c.x2 - c.x1, c.y2 - c.y1);
    //     });
    // }

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
        // (100, canvas.height - 25) -> (115, canvas.height - 5)
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
        var marginBottom = 35;
    
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - marginBottom);
        ctx.lineTo(canvas.width, canvas.height - marginBottom);
        ctx.lineTo(canvas.width, canvas.height - marginBottom - size);
        ctx.lineTo(0, canvas.height - marginBottom - size);
        ctx.closePath();
        ctx.fill();
    }

    function drawMuteIcon() {
        var mute = document.createElement("img");
        mute.src = "./Media/Mute.png";
        size = 20;
        marginBottom = 10;
        marginLeft = 140;
        ctx.drawImage(mute, marginLeft, canvas.height - marginBottom / 2 - size, size, size);
    }

    function drawUnmuteIcon() {
        var unmute = document.createElement("img");
        unmute.src = "./Media/Unmute.png";
        size = 20;
        marginBottom = 10;
        marginLeft = 140;
        ctx.drawImage(unmute, marginLeft, canvas.height - marginBottom / 2 - size, size, size);
    }