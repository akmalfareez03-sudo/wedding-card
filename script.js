// ==========================================
// 1. LOGIK UNTUK LAMAN PIN (index.html)
// ==========================================
const pinScreen = document.getElementById('pinScreen');

if (pinScreen) {
    let currentPin = "";
    const correctPin = "140700"; // PIN BARU DITETAPKAN DI SINI

    window.addNumber = function(num) {
        if (currentPin.length < 6) {
            currentPin += num;
            updateDots();
        }
        if (currentPin.length === 6) {
            setTimeout(checkPin, 300); 
        }
    };

    window.deleteNumber = function() {
        if (currentPin.length > 0) {
            currentPin = currentPin.slice(0, -1);
            updateDots();
        }
    };

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index < currentPin.length) {
                dot.classList.add('filled');
                dot.classList.remove('error');
            } else {
                dot.classList.remove('filled');
                dot.classList.remove('error');
            }
        });
    }

    function checkPin() {
        if (currentPin === correctPin) {
            sessionStorage.setItem('isLoggedIn', 'true');
            pinScreen.style.display = 'none';
            document.getElementById('loadingScreen').style.display = 'flex';
            setTimeout(() => {
                window.location.href = 'main.html'; 
            }, 3000);
        } else {
            const dots = document.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.add('error'));
            if (navigator.vibrate) navigator.vibrate(200);
            setTimeout(() => {
                currentPin = "";
                updateDots();
            }, 800);
        }
    }
}

// ==========================================
// 2. LOGIK UNTUK MAIN PAGE (main.html)
// ==========================================
const giftScreen = document.getElementById('giftScreen');

// Deklarasi pemboleh ubah muzik supaya mudah diakses oleh fungsi-fungsi lain
let isPlaying = false;
let currentSongIdx = 1;
const songFiles = {
    1: "lagu/lagu1.mp3",
    2: "lagu/lagu2.mp3",
    3: "lagu/lagu3.mp3"
};

if (giftScreen) {
    
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }

    // --- BUKA HADIAH & AUTOPLAY MUZIK ---
    window.openGift = function() {
        const giftWrapper = document.getElementById('giftWrapper');
        const giftUI = document.getElementById('giftScreen');
        const mainContent = document.getElementById('mainScrollContent');
        
        giftWrapper.classList.add('opened');

        // Memicu (trigger) musik secara otomatis setelah user berinteraksi (klik)
        selectSong(1, 'Shape Of My Heart', 'Backstreet Boys');
        
        setTimeout(() => {
            giftUI.style.opacity = '0';
            setTimeout(() => {
                giftUI.style.display = 'none';
                mainContent.style.display = 'block';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                }, 50); 
            }, 1000); 
        }, 500); 
    };

    let msgTimeout;
    window.showFlowerMsg = function(msg) {
        const msgBox = document.getElementById('flowerMessageContainer');
        msgBox.style.opacity = '0';
        msgBox.style.transform = 'translateY(10px)';
        clearTimeout(msgTimeout);
        msgTimeout = setTimeout(() => {
            msgBox.innerText = msg;
            msgBox.style.opacity = '1';
            msgBox.style.transform = 'translateY(0)';
        }, 300);
    };
    
    window.openModal = function(imageSrc) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('enlargedImg');
        modalImg.src = imageSrc;
        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('show'); }, 10);
    };

    window.closeModal = function() {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300); 
    };

    // --- PEMAIN MUZIK BERAUDIO ---
    window.togglePlay = function() {
        const vinyl = document.getElementById('vinyl');
        const playBtn = document.getElementById('playBtn');
        const bgMusic = document.getElementById('bgMusic');
        
        if (!bgMusic) return;

        if(!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                if(vinyl) vinyl.classList.add('playing');
                if(playBtn) playBtn.innerText = '⏸️'; 
            }).catch(e => console.log("Gagal mainkan audio:", e));
        } else {
            bgMusic.pause();
            isPlaying = false;
            if(vinyl) vinyl.classList.remove('playing');
            if(playBtn) playBtn.innerText = '▶️'; 
        }
    };

    window.selectSong = function(id, title, artist) {
        document.querySelectorAll('.song-item').forEach(el => el.classList.remove('active'));
        const activeElem = document.getElementById('song' + id);
        if(activeElem) activeElem.classList.add('active');
        
        document.getElementById('songTitle').innerText = title;
        document.getElementById('songArtist').innerText = artist;
        
        currentSongIdx = id;
        const bgMusic = document.getElementById('bgMusic');
        const vinyl = document.getElementById('vinyl');
        const playBtn = document.getElementById('playBtn');
        
        if (bgMusic) {
            bgMusic.src = songFiles[id];
            
            // Cuba mainkan lagu secara terus
            bgMusic.play().then(() => {
                isPlaying = true;
                if(vinyl) vinyl.classList.add('playing');
                if(playBtn) playBtn.innerText = '⏸️';
            }).catch(e => {
                console.log("Autoplay mungkin diblokir oleh browser.", e);
                isPlaying = false;
            });
        }
    };

    window.nextSong = function() {
        let nextIdx = currentSongIdx + 1;
        if(nextIdx > 3) nextIdx = 1; 
        document.getElementById('song' + nextIdx).click();
    };

    window.prevSong = function() {
        let prevIdx = currentSongIdx - 1;
        if(prevIdx < 1) prevIdx = 3;
        document.getElementById('song' + prevIdx).click();
    };

    document.getElementById('bgMusic')?.addEventListener('ended', function() {
        window.nextSong();
    });

    const jarMessages = [
        "Your presence alone is enough to make any room feel warmer. 🤍",
        "Your spirit in the face of challenges inspires me every single day. ✨",
        "I love the way your eyes crinkle when you laugh. 🌸",
        "Thank you for always being my safe space to fall back to. 💌",
        "You always know how to make me smile, even when I don't want to. 🌻"
    ];

    window.shakeJar = function() {
        const jar = document.getElementById('jar');
        const msgBox = document.getElementById('jarMessage');
        const msgs = [
            "Your presence alone is enough to make any room feel warmer. 🤍",
            "Your spirit in the face of challenges inspires me every single day. ✨",
            "I love the way your eyes crinkle when you laugh. 🌸",
            "Thank you for always being my safe space to fall back to. 💌",
            "You always know how to make me smile, even when I don't want to. 🌻"
        ];
        
        jar.classList.add('shaking');
        msgBox.style.opacity = '0';
        msgBox.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            jar.classList.remove('shaking');
            msgBox.style.display = 'flex';
            
            // Pilih mesej rawak
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            msgBox.innerText = randomMsg;
            
            // Animasi 'Pop' untuk mesej
            setTimeout(() => {
                msgBox.style.opacity = '1';
                msgBox.style.transform = 'scale(1)';
            }, 100);
        }, 500);
    };

    function spawnFloatingFlower() {
        const container = document.getElementById('floatingFlowersContainer');
        if (!container) return;

        const flower = document.createElement('div');
        flower.classList.add('floating-flower');
        const flowerTypes = ['🌸', '🌺', '🌼', '🌷', '💮', '✨'];
        flower.innerText = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.fontSize = (Math.random() * 15 + 10) + 'px';
        const duration = Math.random() * 6 + 6;
        flower.style.animationDuration = duration + 's';
        container.appendChild(flower);

        setTimeout(() => { flower.remove(); }, duration * 1000);
    }
    setInterval(spawnFloatingFlower, 800);
}