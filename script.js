    // lista in care se plaseaza videurile care pot fi vazute de utilizator in pagina
    var mediaSource = [
        "Media/DanDiaconescu.mp4",
        "Media/DoomerMotivation.mp4",
        "Media/OldCartoons.mp4",
        "Media/SigmaMale.mp4",
        "Media/ZyzzMotivation.mp4"];
    
    var titluVideo = document.getElementById("titluVideo");
    titluVideo.textContent = mediaSource[0].slice(mediaSource[0].lastIndexOf("/") + 1, mediaSource[0].lastIndexOf("."));
    
    var preview = false;                                // variabila care specifica daca cursorul este deasupra barei de progresie
    var previewMousePos = 0;                            // variabila care specifica pozitia cursorului de pe bara de progresie
    var progressSize = 3;                               // variabila care specifica cat de mare este progress bar-ul
    var dragHighlightElement = false;                   // variabila care stocheaza daca drag and dropul se efectueaza pe elementul evidentiat
    var dropLast = true;                                // variabila care stocheaza daca elementul care a participat in actiunea de drag & drop a fost mutat pe ultima pozitie din lista de videouri
    var dragOverIndex = -1;                             // variabila care specifica deasupra carui element din lista de videouri este actiunea de drag
    var dragElementIndex = -1;                          // variabila care specifica ce element din lista de videouri participa in actiune drag & drop
    var onElement = true;
    var index = 0;                                      // variabila care specifica ce element din lista de videouri trebuie evidentiat
    var muted = true;                                   // variabila care retine daca sunetul este redat sau nu
    var autoPlay = true;                                // variabila care retine daca setarea de autoPlay este activa
    var videoContainer;                                 // obiect care contine elementul video si informatiile asociate

    var canvas = document.getElementById("myCanvas");   // preia elementul canvas din pagina
    var ctx = canvas.getContext("2d");

    var videoPreview = document.createElement('video');
    
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
    function readyToPlayVideo(e) {      // this is a referance to the video
        // the video may not match the canvas size so find a scale to fit
        videoContainer.scale = Math.min(
                    canvas.width / this.videoWidth,
                    canvas.height / this.videoHeight);

        videoContainer.ready = true;

        // the video can be played so hand it off to the display function
        requestAnimationFrame(updateCanvas);
    }

    function updateCanvas() {

        if(videoContainer.video.ended == true && autoPlay == true) {    // daca videoul s-a terminat si butonul de autoplay este on, se trece la videoul urmator
            
            preview = false;
            let x = mediaSource.indexOf(videoContainer.video.src.slice(videoContainer.video.src.indexOf("Media")));
            console.log(x);
            if(x != undefined && x != null && x != -1) {
                if(x < mediaSource.length - 1) {
                    changeVideo(x + 1);
                    desenarePlaylist();
                }
                else {
                    changeVideo(0);
                    desenarePlaylist();
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

            if(preview == true) {
                console.log(preview);
                drawPreview();
            }

            if(videoContainer.video.paused) {       // if not playing show the paused screen
                drawCenterIcon();
                drawPlayIcon();                     //deseneaza controlul de play
            }else {
                drawPauseIcon();                    //deseneaza controlul de pause
            }

            if(muted != true) {
                drawMuteIcon();                     //deseneaza controlul de mute
            }else {
                drawUnmuteIcon();                   //deseneaza controlul de unmute
            }

            if(autoPlay == true) {
                drawAutoPlayOn();                   //deseneaza controlul de autoplay on
            }else {
                drawAutoPlayOff();                  //deseneaza controlul de autoplay off
            }

            drawPreviousIcon();                     //deseneaza controlul de previous
            drawNextIcon();                         //deseneaza controlul de next
            drawProgressBar(progressSize);          //deseneaza bara de progres
            let progress = canvas.width * (videoContainer.video.currentTime / videoContainer.video.duration);
            drawProgress(progress, progressSize);   //deseneaza progresia
        }
        // all done for display

        // request the next frame in 1/60th of a second
        requestAnimationFrame(updateCanvas);
    }

    // lista de obiecte care contin delimitarile zonei de controale
    var canvasX = canvas.getBoundingClientRect().x;
    var canvasY = canvas.getBoundingClientRect().y;
    var canvasH = canvas.height;
    var canvasW = canvas.width;
    var scaleH = canvas.getBoundingClientRect().height / canvas.height;
    var scaleW = canvas.getBoundingClientRect().width / canvas.width;

    var pozControale = [
        {x1:20 * scaleW, x2:35 * scaleW, y1: (canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},                           // prev
        {x1:60 * scaleW, x2:75 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},                            // play/pause
        {x1:100 * scaleW, x2:115 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},                          // next
        {x1:140 * scaleW, x2:160 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},                          // sound
        {x1:0, x2:canvasW * scaleW, y1:(canvasH - 50) * scaleH, y2:(canvasH - 35) * scaleH},                                // progress bar
        {x1:(canvasW - 50) * scaleW, x2:(canvasW - 13) * scaleW, y1: (canvasH - 27) * scaleH, y2:(canvasH - 7) * scaleH},   // autoplay
        {x1:0, x2:canvasW * scaleW, y1:0, y2:(canvasH - 50) * scaleH}                                                       // orice de deasupra progress bar
    ];

    function canvasClick(e) {

        if(videoContainer !== undefined && videoContainer.ready) {

            var ctrl = -1;
            var mousepos = {x:e.clientX - canvasX, y:e.clientY - canvasY};

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
                            desenarePlaylist();
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
                            desenarePlaylist();
                        }
                        else {
                            if(mediaSource.length != 1){
                                changeVideo(0);
                                desenarePlaylist();
                            }
                        }
                    }
                    break;
                }
                case 3: {
                    muted = !muted;
                    break;
                }
                case 4: {
                    var currTime = mousepos.x / scaleW * videoContainer.video.duration / canvas.width;
                    console.log(currTime);
                    videoContainer.video.currentTime = currTime;
                    break;
                }
                case 5: {
                    autoPlay = !autoPlay;
                    break;
                }
                case 6: {
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

    // register the event
    canvas.addEventListener("click", canvasClick);

    function changeVideo(i) {
        videoContainer.video.src = mediaSource[i];
        titluVideo.textContent = mediaSource[i].slice(mediaSource[i].lastIndexOf("/") + 1, mediaSource[i].lastIndexOf("."));
        index = i;
    }

    // functie care adauga un div in divul parinte
    function adaugaDivInDiv(div, text, id) {
        div.innerHTML += "<div class='listElement' draggable='true'>" +
            "<div class='listDrag'>" + id + "</div>" +
            "<div class='listImgText'><p>" + text + "</p></div><button class='listDeleteVideo'>x</button></div>";
    }

    var playlist = document.getElementById("playlist");

    playlist.addEventListener("dragover", (e) => {
        document.body.style.cursor = "grabbing";
        e.preventDefault();
    });

    playlist.addEventListener("drop", (e) => {
        e.preventDefault();
        console.log("drop " + dragElementIndex + " " + dragOverIndex);

        if(dropLast) {
            var modeVideo = mediaSource[dragElementIndex];
            mediaSource.splice(dragElementIndex, 1);
            mediaSource.splice(mediaSource.length, 0, modeVideo);
        }
        else {
            var modeVideo = mediaSource[dragElementIndex];
            mediaSource.splice(dragElementIndex, 1);
            mediaSource.splice(dragOverIndex, 0, modeVideo);
        }

        index = mediaSource.indexOf(videoContainer.video.src.slice(videoContainer.video.src.indexOf("Media")));
        document.body.style.cursor = "default";
    });

    playlist.style.height = canvas.getBoundingClientRect().height + "px";

    // functie care deseneaza playlistul si creaza eventurile pentru toate controalelele
    function desenarePlaylist() { // creare lista playlist cu videouri vizionabile
        console.log({index , dragElementIndex , dragOverIndex, dragHighlightElement});

        // golire elemente playlist si adaugare header
        playlist.innerHTML = "<h3>Playlist video</h3><br>";

        for(let i = 0; i < mediaSource.length; i++) {           // pentru fiecare video se creaza un div cu videourile din playlist
            
            if(dragElementIndex != i) {
                let vidName = mediaSource[i].slice(mediaSource[i].lastIndexOf("/") + 1, mediaSource[i].lastIndexOf("."))
                adaugaDivInDiv(playlist, vidName, i + 1);       // se apeleaza functia de adaugare div
            }
        }
        playlist.innerHTML += "<div id='lastElement'></div>";
        
        document.getElementById("lastElement").addEventListener("dragenter", (e) => {
            e.preventDefault();
            onElement = false;
            dropLast = true;
            desenarePlaylist();
        }, false);

        // preluare lista de elemente ce trebuie evidentiate
        var listaElemente = document.getElementsByClassName("listElement");
        
        // creare contexte video pentru toate divurile din playlist
        var videoContexts = document.getElementsByClassName("listImgText");

        // creare contexte pentru butoanele de delete video pentru toate divurile din playlist
        var deleteVideoContexts = document.getElementsByClassName("listDeleteVideo");

        // creare contexte pentru butoanele de drag video pentru toate divurile din playlist
        var dragVideoContexts = document.getElementsByClassName("listDrag");
        
        if(index != -1 && !dragHighlightElement) {

            for(let i = 0; i < listaElemente.length; i++) {
                listaElemente[i].classList.remove("active");    // stergerea clasei care evidentiaza celelalte videouri neselectate
            }
            listaElemente[index].classList.add("active");       // adaugarea clasei care evidentiaza videoul curent
            
            dragVideoContexts[index].innerHTML = "&#8883;";
            dragVideoContexts[index].style.fontSize = "30px";
        }

        if(dragOverIndex != -1 && dragOverIndex + 1 < mediaSource.length) {

            if(onElement == true) {
                listaElemente[dragOverIndex].style.marginTop = "84px";
            }
            else {
                listaElemente[dragOverIndex].style.marginTop = "0px";
            }
        }

        // creare event listener pentru trecerea mouse-ului peste un element din lista
        for(let i = 0; i < listaElemente.length; i++) {
            
            listaElemente[i].addEventListener('mouseover', () => {
                deleteVideoContexts[i].style.color = "white";
                dragVideoContexts[i].innerHTML = "&#8801;";
                dragVideoContexts[i].style.fontSize = "30px";
            });

            listaElemente[i].addEventListener('mouseleave', () => {
                deleteVideoContexts[i].style.color = "transparent";
                if(index == i) {
                    dragVideoContexts[i].innerHTML = "&#8883;";
                    dragVideoContexts[i].style.fontSize = "30px";
                }
                else {
                    dragVideoContexts[i].textContent = i + 1;
                    dragVideoContexts[i].style.fontSize = "12px";
                }
            });

            listaElemente[i].addEventListener("dragstart", (e) => {
                console.log("dragstart");
                dragElementIndex = i;

                if(index == dragElementIndex) {
                    dragHighlightElement = true;
                }
                if(index > dragElementIndex) {
                    index--;
                }

                document.body.style.cursor = "grabbing";
            });

            listaElemente[i].addEventListener("dragenter", (e) => {
                e.preventDefault();
                dragOverIndex = i;
                onElement = true;
                dropLast = false;
                desenarePlaylist();
            }, false);

            listaElemente[i].addEventListener("dragend", (e) => {
                console.log("dragend");
                dragElementIndex = -1;
                dragOverIndex = -1;
                onElement = false;
                dragHighlightElement = false;
                desenarePlaylist();
            });

            listaElemente[i].addEventListener("drop", (e) => {
                e.preventDefault();
                console.log("drop " + dragElementIndex + " " + dragOverIndex);
                
                if(dropLast) {
                    var modeVideo = mediaSource[dragElementIndex];
                    mediaSource.splice(dragElementIndex, 1);
                    mediaSource.splice(mediaSource.length, 0, modeVideo);
                }
                else {
                    var modeVideo = mediaSource[dragElementIndex];
                    mediaSource.splice(dragElementIndex, 1);
                    mediaSource.splice(dragOverIndex, 0, modeVideo);
                }

                index = mediaSource.indexOf(videoContainer.video.src.slice(videoContainer.video.src.indexOf("Media")));
                document.body.style.cursor = "default";

            });
        }
        // creare event listener pentru apasarea click pe contextele video
        for(let i = 0; i < videoContexts.length; i++) {
            
            videoContexts[i].addEventListener('click', () => {
                changeVideo(i);
                desenarePlaylist();
            });
        }

        // creare event listener pentru apasarea click pe contextele de delete video
        for(let i = 0; i < deleteVideoContexts.length; i++) {
            
            deleteVideoContexts[i].addEventListener('click', () => {
                mediaSource.splice(i, 1);                   // se sterge videoul pe care s-a dat click sa fie sters
                
                if(i == index) {
                    
                    if(i < mediaSource.length) {            // daca videoul sters nu este ultimul din lista de videouri
                        changeVideo(i);                     // schimba videoul cu videoul urmator
                        
                        dragVideoContexts[i].innerHTML = "&#8883;";
                
                        dragVideoContexts[index].textContent = i + 1;
                        dragVideoContexts[index].style.fontSize = "12px";
                    }
                    else {                                  // daca videoul ce urmeaza sa fie sters este ultimul video
                        if(mediaSource.length == 0) {       // verificam daca acesta este singurul video ramas
                            videoContainer.video.src = null;// daca da, in conatinerul video trecem source-ul videoului ca fiind null
                            index = -1;
                        }
                        else {                              // daca nu este singurul video ramas
                            changeVideo(i - 1);             // videoul se schimba in videoul precedent celui sters
                            
                            dragVideoContexts[i - 1].innerHTML = "&#8883;";
                    
                            dragVideoContexts[index].textContent = i + 1;
                            dragVideoContexts[index].style.fontSize = "12px";
                        }
                    }
                }
                else{
                    if(index > i) {
                        index--;
                    }
                }
                desenarePlaylist();
            });
        }
    }

    window.addEventListener("resize", () => {
        playlist.style.height = canvas.getBoundingClientRect().height + "px";
        
        // lista de obiecte care contin delimitarile zonei de controale
        canvasX = canvas.getBoundingClientRect().x;
        canvasY = canvas.getBoundingClientRect().y;
        canvasH = canvas.height;
        canvasW = canvas.width;
        scaleH = canvas.getBoundingClientRect().height / canvas.height;
        scaleW = canvas.getBoundingClientRect().width / canvas.width;

        pozControale = [
            {x1:20 * scaleW, x2:35 * scaleW, y1: (canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},                           // prev
            {x1:60 * scaleW, x2:75 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},                            // play/pause
            {x1:100 * scaleW, x2:115 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},                          // next
            {x1:140 * scaleW, x2:160 * scaleW, y1:(canvasH - 25) * scaleH, y2:(canvasH - 5) * scaleH},                          // sound
            {x1:0, x2:canvasW * scaleW, y1:(canvasH - 50) * scaleH, y2:(canvasH - 35) * scaleH},                                // progress bar
            {x1:(canvasW - 50) * scaleW, x2:(canvasW - 13) * scaleW, y1: (canvasH - 27) * scaleH, y2:(canvasH - 7) * scaleH},   // autoplay
            {x1:0, x2:canvasW * scaleW, y1:0, y2:(canvasH - 50) * scaleH}                                                       // orice de deasupra progress bar
        ];
    });

    // controalele desenate peste canvas
    function drawCenterIcon() {
       
        ctx.fillStyle = "black";                                // darken display
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#DDD";                                 // colour of play icon
        ctx.globalAlpha = 0.75;                                 // partly transparent
    
        ctx.beginPath();                                        // create the path for the icon
        var size = (canvas.height / 2) * 0.25;                  // the size of the icon
        ctx.moveTo(canvas.width/2 + size, canvas.height / 2);   // start at the pointy end
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
        ctx.moveTo(marginLeft + 1.5 * size, canvas.height - size / 2 - marginBottom);
        ctx.lineTo(marginLeft, canvas.height - marginBottom + 0.5 * size);
        ctx.lineTo(marginLeft, canvas.height - marginBottom - 1.5 * size);
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
    
    function drawProgressBar(size) {
        
        ctx.fillStyle = "#DDD";
        ctx.globalAlpha = 0.75;
        // (0, canvas.height - 35) -> (canvas.width, canvas.height - 50)
        var marginBottom = 35;
    
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - marginBottom);
        ctx.lineTo(canvas.width, canvas.height - marginBottom);
        ctx.lineTo(canvas.width, canvas.height - marginBottom - size);
        ctx.lineTo(0, canvas.height - marginBottom - size);
        ctx.closePath();
        ctx.fill();
    }

    function drawProgress(x, size) {
        
        ctx.fillStyle = "#F00";
        ctx.globalAlpha = 0.75;
        // (0, canvas.height - 35) -> (x, canvas.height - 50)
        var marginBottom = 35;
    
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - marginBottom);
        ctx.lineTo(x, canvas.height - marginBottom);
        ctx.lineTo(x, canvas.height - marginBottom - size);
        ctx.lineTo(0, canvas.height - marginBottom - size);
        ctx.closePath();
        ctx.fill();
    }

    function drawMuteIcon() {
        
        var mute = document.createElement("img");
        mute.src = "./Media/Mute.png";
        var size = 20;
        marginBottom = 10;
        marginLeft = 140;
        ctx.drawImage(mute, marginLeft, canvas.height - marginBottom / 2 - size, size, size);
    }

    function drawUnmuteIcon() {
        
        var unmute = document.createElement("img");
        unmute.src = "./Media/Unmute.png";
        var size = 20;
        marginBottom = 10;
        marginLeft = 140;
        ctx.drawImage(unmute, marginLeft, canvas.height - marginBottom / 2 - size, size, size);
    }

    function drawAutoPlayOn() {
        
        var autoPlay = document.createElement("img");
        autoPlay.src = "./Media/switch-on.png";
        var size = 20;
        marginBottom = 10;
        marginRight = 50;
        ctx.drawImage(autoPlay, canvas.width - marginRight, canvas.height - marginBottom / 2 - 1.6 * size, 1.85 * size, 2 * size);
    }

    function drawAutoPlayOff() {
        
        var autoPlay = document.createElement("img");
        autoPlay.src = "./Media/switch-off.png";
        var size = 20;
        marginBottom = 10;
        marginRight = 50;
        ctx.drawImage(autoPlay, canvas.width - marginRight, canvas.height - marginBottom / 2 - 1.6 * size, 1.85 * size, 2 * size);
    }

    // drag & drop file
    let dropbox = document.getElementById("dropbox");
    
    dropbox.addEventListener("dragenter", (e) => {
        dropbox.style.borderColor = "gray";
        dropbox.textContent = "...Drop here...";
        e.stopPropagation();
        e.preventDefault();
    }, false);

    dropbox.addEventListener("dragover", (e) => {
        e.stopPropagation();
        e.preventDefault();
    }, false);

    dropbox.addEventListener("dragleave", (e) => {
        e.stopPropagation();
        e.preventDefault();

        dropbox.style.borderColor = "transparent";
        dropbox.textContent = "";
    }, false);

    dropbox.addEventListener("drop", (e) => {
        e.stopPropagation();
        e.preventDefault();

        var dt = e.dataTransfer;
        var files = [...dt.files];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file.type.startsWith('video/')){ continue }

            const video = document.createElement("video");
            video.classList.add("obj");
            video.file = file;
            canvas.appendChild(video); // Assuming that "preview" is the div output where the content will be displayed.

            const reader = new FileReader();
            reader.onload = (e) => { video.src = e.target.result; };
            reader.readAsDataURL(file);

            mediaSource.unshift(path.substring(0,path.lastIndexOf("/")) + "/Media/" + files[i].name);
            desenarePlaylist();
        }

        dropbox.style.borderColor = "transparent";
        dropbox.textContent = "";
    }, false);

    var inputVideo = document.getElementById("inputVideo");

    inputVideo.addEventListener("change", () => {
        var files  = inputVideo.files;

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                localStorage.setItem(files[i].name, reader.result);
            });

            reader.readAsDataURL(files[i]);

            const videoUrl = localStorage.getItem(files[i].name);
            mediaSource.unshift("Media/" + videoUrl);

            desenarePlaylist();
        }
    });

    function drawPreview() {
        var width = canvasW / 8;
        var height = canvasH / 8;
        
        var left = previewMousePos - width / 2;
        var top = canvasH - 50 - height;

        ctx.drawImage(videoPreview, left / scaleW, top , width, height);
    }

    videoPreview.addEventListener("seeked", () => {
        preview = true;
    });

    canvas.addEventListener("mousemove", (e) => {
        var ctrl = -1;
        var mousepos = {x:e.clientX - canvasX, y:e.clientY - canvasY};

        for(let i = 0; i < pozControale.length - 1; i++) {
            if(pozControale[i].x1 <= mousepos.x && mousepos.x <= pozControale[i].x2 &&
                pozControale[i].y1 <= mousepos.y && mousepos.y <= pozControale[i].y2) {

                ctrl = i;
            }
        }
        if(ctrl != -1) {
            canvas.style.cursor = "pointer";

            if(ctrl == 4) {
                
                progressSize = 5;
                previewMousePos = mousepos.x;
                videoPreview.src = mediaSource[index];
                videoPreview.currentTime = mousepos.x / scaleW * videoContainer.video.duration / canvas.width;

            }
            else {
                progressSize = 3;
                preview = false;
            }
        }
        else {
            canvas.style.cursor = "default";
            progressSize = 3;
            preview = false;
        }
    })

    desenarePlaylist(); // desenare lista de videouri vizualizabile