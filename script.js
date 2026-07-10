// ==========================================
// 1. LOGIK UNTUK LAMAN PIN (index.html)
// ==========================================
const pinScreen = document.getElementById('pinScreen');

if (pinScreen) {
    let currentPin = "";
    const correctPin = "140700"; // <-- TUKAR PIN DI SINI

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

if (giftScreen) {
    
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }

    window.openGift = function() {
        const giftWrapper = document.getElementById('giftWrapper');
        const giftUI = document.getElementById('giftScreen');
        const mainContent = document.getElementById('mainScrollContent');
        
        giftWrapper.classList.add('opened');
        
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

    // Fungsi Mesej Bunga dengan Efek Slide-Up
    let msgTimeout;
    window.showFlowerMsg = function(msg) {
        const msgBox = document.getElementById('flowerMessageContainer');
        
        // Animasi turun dan hilang sikit
        msgBox.style.opacity = '0';
        msgBox.style.transform = 'translateY(10px)';
        
        clearTimeout(msgTimeout); // Elak text bertindih kalau tekan laju-laju
        
        msgTimeout = setTimeout(() => {
            msgBox.innerText = msg;
            
            // Animasi naik dan muncul
            msgBox.style.opacity = '1';
            msgBox.style.transform = 'translateY(0)';
        }, 300);
    };
    
    // --- FUNGSI BUNGA BERTERBANGAN (BACKGROUND) ---
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

        setTimeout(() => {
            flower.remove();
        }, duration * 1000);
    }

    setInterval(spawnFloatingFlower, 800);
}