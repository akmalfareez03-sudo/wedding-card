// ==========================================
// 1. LOGIK UNTUK LAMAN PIN (index.html)
// ==========================================
const pinScreen = document.getElementById('pinScreen');
if (pinScreen) {
    let currentPin = "";
    const correctPin = "140700"; // PIN korang

    window.addNumber = function(num) {
        if (currentPin.length < 6) {
            currentPin += num;
            updateDots();
        }
        if (currentPin.length === 6) setTimeout(checkPin, 300);
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
            if (index < currentPin.length) dot.classList.add('filled');
            else dot.classList.remove('filled', 'error');
        });
    }

    function checkPin() {
        if (currentPin === correctPin) {
            sessionStorage.setItem('isLoggedIn', 'true');
            pinScreen.style.display = 'none';
            document.getElementById('loadingScreen').style.display = 'flex';
            setTimeout(() => { window.location.href = 'main.html'; }, 3000);
        } else {
            document.querySelectorAll('.dot').forEach(dot => dot.classList.add('error'));
            setTimeout(() => { currentPin = ""; updateDots(); }, 800);
        }
    }
}

// ==========================================
// 2. LOGIK UNTUK MAIN PAGE (main.html)
// ==========================================
const giftScreen = document.getElementById('giftScreen');

// Deklarasi pemboleh ubah muzik
let isPlaying = false; 
let currentSongIdx = 1;
const playlist = [
    { id: 1, title: 'Until I Found You', artist: 'Stephen Sanchez' },
    { id: 2, title: 'Just The Way You Are', artist: 'Bruno Mars' },
    { id: 3, title: 'Lover', artist: 'Taylor Swift' }
];

if (giftScreen) {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') window.location.href = 'index.html';

    window.openGift = function() {
        const giftWrapper = document.getElementById('giftWrapper');
        const giftUI = document.getElementById('giftScreen');
        const mainContent = document.getElementById('mainScrollContent');
        const bgMusic = document.getElementById('bgMusic');

        giftWrapper.classList.add('opened');
        
        // Autoplay lagu 1 bila hadiah dibuka
        // Autoplay lagu 1 bila kotak hadiah dibuka
    selectSong(1);

        setTimeout(() => {
            giftUI.style.opacity = '0';
            setTimeout(() => {
                giftUI.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Mula hidupkan animation scroll reveal
                initScrollAnimations();

                setTimeout(() => { mainContent.style.opacity = '1'; }, 50);
            }, 1000);
        }, 500);
    };

    // --- FUNGSI SCROLL REVEAL ---
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1, 
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in-section');
        fadeElements.forEach(el => observer.observe(el));
    }

    window.showFlowerMsg = function(msg) {
        const msgBox = document.getElementById('flowerMessageContainer');
        msgBox.innerText = msg;
    };

    window.openModal = function(src) {
        const modal = document.getElementById('imageModal');
        document.getElementById('enlargedImg').src = src;
        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('show'); }, 10);
    };

    window.closeModal = function() {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    };

    // --- MUSIC PLAYER LOGIC ---
    window.togglePlay = function() {
        const bgMusic = document.getElementById('bgMusic');
        const vinyl = document.getElementById('vinyl');
        const playBtn = document.getElementById('playBtn');
        
        if (isPlaying) {
            bgMusic.pause();
            if(vinyl) vinyl.classList.remove('playing');
            if(playBtn) playBtn.innerText = '▶️';
        } else {
            bgMusic.play().then(() => {
                if(vinyl) vinyl.classList.add('playing');
                if(playBtn) playBtn.innerText = '⏸️'; 
            }).catch(e => console.log("Gagal main audio: ", e));
        }
        isPlaying = !isPlaying;
    };

    window.selectSong = function(id) {
        const song = playlist.find(s => s.id === id);
        if (!song) return;

        currentSongIdx = id;

        // Tukar sumber lagu dan teks info
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.src = `lagu/lagu${id}.mp3`;
        document.getElementById('songTitle').innerText = song.title;
        document.getElementById('songArtist').innerText = song.artist;

        // Highlight lagu aktif
        document.querySelectorAll('.song-item').forEach(el => el.classList.remove('active'));
        const activeElem = document.getElementById('song' + id);
        if (activeElem) activeElem.classList.add('active');

        // Mainkan lagu secara automatik
        const vinyl = document.getElementById('vinyl');
        const playBtn = document.getElementById('playBtn');

        bgMusic.play().then(() => {
            isPlaying = true;
            if(vinyl) vinyl.classList.add('playing');
            if(playBtn) playBtn.innerText = '⏸️';
        }).catch(e => {
            console.log("Audio block: ", e);
            isPlaying = false;
        });
    };

    window.nextSong = function() {
        let nextIdx = currentSongIdx + 1;
        if (nextIdx > playlist.length) nextIdx = 1; 
        selectSong(nextIdx);
    };

    window.prevSong = function() {
        let prevIdx = currentSongIdx - 1;
        if (prevIdx < 1) prevIdx = playlist.length;
        selectSong(prevIdx);
    };

    // Auto next bila lagu habis
    const bgMusic = document.getElementById('bgMusic');
    if(bgMusic) {
        bgMusic.addEventListener('ended', function() {
            window.nextSong();
        });
    }

    // --- JAR LOGIC (DENGAN BANYAK MESEJ BARU) ---
    window.shakeJar = function() {
        const jar = document.getElementById('jar');
        const msgBox = document.getElementById('jarMessage');
        
        // SENARAI BANYAK MESEJ ROMANTIK BARU
        const msgs = [
            "Everything is beautiful with you. ❤️",
            "Terima kasih sebab selalu ada untuk saya, sayang. ✨",
            "I Love Youuuuu. ❤️",
            "Sayang awak banyakk, Jom kawinnn. Tak sabar nak kawinnn. 💍",
            "Baby,Kalau awak rasa penat. Stop and Rest okey babyyy. 🥰",
            "Hati saya cuma untuk awak sorang. 🔒",
            "Terima kasih sebab pilih saya dalam hidup awakk. 😊",
            "Awak dah buat yang Terbaik dah. 🌸",
            "Saya bersyukur setiap hari sebab ada awak. 🌹",
            "Baby, You're all I need. 🤍",
            "saya sayang awak sampai bila bilaaa. ∞",
            "Baby saya kuatt. Sayang awak banyakkkk. 💪",
            "There is nothing i want more than to make you the happiest person in the world. ✨",
            "Baby dah besarr.Jangan nangis nangis, tunggu saya dekat dengan awak baru nangis tauu.",
            "I said, I would never fall unless it's you I fall into. ❤️"
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

    // --- BUNGA BERTERBANGAN (BACKGROUND) ---
    setInterval(() => {
        const container = document.getElementById('floatingFlowersContainer');
        if (!container) return;

        const flower = document.createElement('div');
        flower.className = 'floating-flower';
        flower.innerText = ['🌸', '✨', '🌺'][Math.floor(Math.random()*3)];
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.animationDuration = (Math.random()*6+6) + 's';
        container.appendChild(flower);

        setTimeout(() => flower.remove(), 10000);
    }, 1000);
}// --- FINAL POPUP LOGIC ---
    window.openFinalPopup = function() {
        const modal = document.getElementById('finalPopup');
        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('show'); }, 10);
        
        // Buat efek 'Love' keluar banyak-banyak bila popup dibuka
        for(let i = 0; i < 15; i++) {
            setTimeout(spawnHeart, i * 200);
        }
    };

    window.closeFinalPopup = function() {
        const modal = document.getElementById('finalPopup');
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 400);
    };

    function spawnHeart() {
        const container = document.getElementById('floatingFlowersContainer');
        if (!container) return;
        const heart = document.createElement('div');
        heart.className = 'floating-flower';
        heart.innerText = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 8000);
    }