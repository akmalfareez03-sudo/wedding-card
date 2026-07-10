// PIN LOGIC
const pinScreen = document.getElementById('pinScreen');
if (pinScreen) {
    let currentPin = "";
    const correctPin = "140700";

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

// MAIN PAGE LOGIC
const giftScreen = document.getElementById('giftScreen');
if (giftScreen) {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') window.location.href = 'index.html';

    window.openGift = function() {
        const giftWrapper = document.getElementById('giftWrapper');
        const giftUI = document.getElementById('giftScreen');
        const mainContent = document.getElementById('mainScrollContent');
        const bgMusic = document.getElementById('bgMusic');

        giftWrapper.classList.add('opened');
        
        // Autoplay lagu 1
        if(bgMusic) bgMusic.play().catch(e => console.log("Audio block"));

        setTimeout(() => {
            giftUI.style.opacity = '0';
            setTimeout(() => {
                giftUI.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Mula hidupkan animation scroll reveal bila hadiah dah dibuka
                initScrollAnimations();

                setTimeout(() => { mainContent.style.opacity = '1'; }, 50);
            }, 1000);
        }, 500);
    };

    // --- FUNGSI SCROLL REVEAL ---
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1, // Berapa banyak elemen masuk skrin sebelum animasi mula (10%)
            rootMargin: "0px 0px -50px 0px" // Trigger sikit awal sebelum cecah bawah
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Buang komen di bawah kalau nak elemen tu stay, dan tak animate balik bila scroll atas bawah
                    // observer.unobserve(entry.target); 
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

    // MUSIC PLAYER
    let isPlaying = true; // Set asal true sebab dia auto-play
    window.togglePlay = function() {
        const bgMusic = document.getElementById('bgMusic');
        const vinyl = document.getElementById('vinyl');
        const playBtn = document.getElementById('playBtn');
        
        if (isPlaying) {
            bgMusic.pause();
            vinyl.classList.remove('playing');
            playBtn.innerText = '▶️';
        } else {
            bgMusic.play();
            vinyl.classList.add('playing');
            playBtn.innerText = '⏸️';
        }
        isPlaying = !isPlaying;
    };

    window.selectSong = function(id, title, artist) {
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.src = `lagu/lagu${id}.mp3`;
        document.getElementById('songTitle').innerText = title;
        document.getElementById('songArtist').innerText = artist;
        isPlaying = false; // Reset sebelum trigger play balik
        togglePlay();
    };

    // JAR LOGIC
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
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            msgBox.innerText = randomMsg;
            
            setTimeout(() => {
                msgBox.style.opacity = '1';
                msgBox.style.transform = 'scale(1)';
            }, 100);
        }, 500);
    };

    // BUNGA BACKGROUND
    setInterval(() => {
        const flower = document.createElement('div');
        flower.className = 'floating-flower';
        flower.innerText = ['🌸', '✨'][Math.floor(Math.random()*2)];
        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.animationDuration = (Math.random()*6+6) + 's';
        document.getElementById('floatingFlowersContainer').appendChild(flower);
        setTimeout(() => flower.remove(), 10000);
    }, 1000);
}