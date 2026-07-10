// ==========================================
// 1. LOGIK UNTUK LAMAN LOGIN (index.html)
// ==========================================
const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('passwordInput');

if (loginBtn && passwordInput) {
    function attemptLogin() {
        const errorMsg = document.getElementById('errorMsg');
        const betulPassword = "sayang"; // <-- TUKAR PASSWORD DI SINI JIKA PERLU

        if (passwordInput.value === betulPassword) {
            sessionStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'surprise.html';
        } else {
            errorMsg.style.opacity = '1';
            setTimeout(() => {
                errorMsg.style.opacity = '0';
            }, 2000);
        }
    }

    loginBtn.addEventListener('click', attemptLogin);

    passwordInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            attemptLogin();
        }
    });
}

// ==========================================
// 2. LOGIK UNTUK LAMAN SURPRISE (surprise.html)
// ==========================================
const matrixCanvas = document.getElementById('matrixCanvas');

if (matrixCanvas) {
    
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html'; 
    } else {
        startSurprise(); 
    }

    function startSurprise() {
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const nums = '0123456789';
        const fontSize = 16;
        const columns = matrixCanvas.width / fontSize;
        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = '#ff66b2'; 
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = nums.charAt(Math.floor(Math.random() * nums.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        }
        const matrixInterval = setInterval(drawMatrix, 30);

        const textContainer = document.getElementById('textContainer');
        const mainCard = document.getElementById('mainCard');
        let count = 3;
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                textContainer.innerText = count;
            } else if (count === 0) {
                textContainer.innerText = "HAPPY\nBIRTHDAY\nSAYANG";
            } else if (count === -2) {
                textContainer.style.opacity = '0';
                matrixCanvas.style.opacity = '0';
            } else if (count === -3) {
                clearInterval(countdownInterval);
                clearInterval(matrixInterval);
                mainCard.style.opacity = '1';
                mainCard.style.pointerEvents = 'auto'; 
                
                setupPhase3();
            }
        }, 1000); 

        window.addEventListener('resize', () => {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        });
    }

    // ==========================================
    // 3. FUNGSI UNTUK FASA BINTANG & SAMPUL SURAT
    // ==========================================
    function setupPhase3() {
        const starsContainer = document.getElementById('starsContainer');
        if(starsContainer) {
            for (let i = 0; i < 150; i++) {
                let star = document.createElement('div');
                star.className = 'star';
                star.style.width = Math.random() * 3 + 'px';
                star.style.height = star.style.width;
                star.style.left = Math.random() * 100 + 'vw';
                star.style.top = Math.random() * 100 + 'vh';
                star.style.animationDuration = (Math.random() * 3 + 1) + 's';
                starsContainer.appendChild(star);
            }
        }

        setTimeout(() => {
            const content = document.getElementById('surpriseContent');
            if(content) content.style.opacity = '1';
        }, 800); 
    }

    window.openEnvelope = function() {
        const envelope = document.getElementById('myEnvelope');
        const hintText = document.querySelector('.hint');
        
        if (envelope) {
            envelope.classList.toggle('open');
            
            if (hintText) {
                if (envelope.classList.contains('open')) {
                    hintText.innerText = "Tap again to close";
                } else {
                    hintText.innerText = "Tap the heart to open";
                }
            }
        }
    };

    // ==========================================
    // 4. FUNGSI SELAK BUKU REAL-TIME (SWIPE 3D)
    // ==========================================
    let currentPageIdx = 1;
    const maxPages = 3; 
    let startX = 0;
    let isDragging = false;
    let activePage = null;
    let initialAngle = 0;

    const flipbook = document.getElementById('flipbook');

    if (flipbook) {
        flipbook.addEventListener('touchstart', handleStart, {passive: false});
        flipbook.addEventListener('touchmove', handleMove, {passive: false});
        flipbook.addEventListener('touchend', handleEnd);
        
        flipbook.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove); 
        window.addEventListener('mouseup', handleEnd);
    }

    function handleStart(e) {
        e.stopPropagation(); 
        
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        activePage = null; 
    }

    function handleMove(e) {
        if (!isDragging) return;
        
        let currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        let deltaX = currentX - startX;

        if (!activePage) {
            if (deltaX < 0 && currentPageIdx <= maxPages) { 
                activePage = document.getElementById('page' + currentPageIdx);
                initialAngle = 0;
            } else if (deltaX > 0 && currentPageIdx > 1) { 
                activePage = document.getElementById('page' + (currentPageIdx - 1));
                initialAngle = -180;
            } else {
                return; 
            }
            if(activePage) activePage.classList.remove('animating'); 
        }

        e.preventDefault(); 

        let containerWidth = flipbook.offsetWidth;
        let swipePercent = deltaX / containerWidth; 
        
        let degrees = initialAngle + (swipePercent * 180);
        
        if (degrees > 0) degrees = 0;
        if (degrees < -180) degrees = -180;
        
        activePage.style.transform = `rotateY(${degrees}deg)`;
    }

    function handleEnd(e) {
        if (!isDragging || !activePage) {
            isDragging = false;
            return;
        }
        isDragging = false;
        
        activePage.classList.add('animating');
        
        let currentTransform = activePage.style.transform;
        let currentDeg = parseFloat(currentTransform.replace('rotateY(', '').replace('deg)', ''));
        
        if (initialAngle === 0) {
            if (currentDeg < -45) { 
                activePage.style.transform = `rotateY(-180deg)`;
                currentPageIdx++;
            } else { 
                activePage.style.transform = `rotateY(0deg)`;
            }
        } else {
            if (currentDeg > -135) { 
                activePage.style.transform = `rotateY(0deg)`;
                currentPageIdx--;
            } else { 
                activePage.style.transform = `rotateY(-180deg)`;
            }
        }
        activePage = null; 
    }
}