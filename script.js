/* --- script.js (KOSONGKAN FAIL ASAL & TAMPAL KOD PENUH INI) --- */

// --- 1. SET TARIKH COUNTDOWN (Sila tukar ke tarikh anniversary korang) ---
// Format: Tahun, Bulan (0 = Jan, 1 = Feb, etc.), Hari, Jam, Minit, Saat
const tarikhAnniversary = new Date(2026, 5, 2, 0, 0, 0).getTime();

//================= A. MULA & ANIMASI PASSPORT (KLIK PERTAMA) =================//
function bukaWebsite() {
    // 1. Mula mainkan lagu
    document.getElementById('bg-music').play();
    
    // 2. Tambah class 'buka' kat Lock Screen & Main Content
    document.getElementById('lock-screen').classList.add('buka');
    document.getElementById('main-content').classList.add('buka');
    
    // 3. Bila Lock Screen dah selesai slide (sekitar 1.2s), sorok terus
    setTimeout(() => {
        document.getElementById('lock-screen').style.display = 'none';
    }, 1200); // 1.2s padan dengan CSS transition
    
    // 4. Hidupkan galeri swipe
    initSwiper();
    
    // 5. Mula hidupkan countdown
    mulaCountdown();
}

//================= B. FUNGSI MODALS (POPUPS) =================//
function showModal(modalId) {
    document.getElementById(modalId).classList.add('tunjuk');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('tunjuk');
}

//================= C. FUNGSI SWIPER (GALERI JALAN) =================//
//================= C. FUNGSI SWIPER (GALERI AUTO SLIDE) =================//
function initSwiper() {
    const swiper = new Swiper('.mySwiper', {
        slidesPerView: 1, 
        spaceBetween: 10, 
        loop: true, 
        
        // --- INI KOD BARU UNTUK AUTO SLIDE ---
        autoplay: {
            delay: 3000, // Gambar akan tukar setiap 3 saat
            disableOnInteraction: false, // PENTING: Supaya auto-slide TAK BERHENTI walaupun kita dah tekan butang manual
        },
        // -------------------------------------

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

//================= D. FUNGSI COUNTDOWN (TIMER HIDUP) =================//
function mulaCountdown() {
    
    // Fungsi ni akan run setiap saat
    const interval = setInterval(function() {
        
        // Dapatkan tarikh sekarang dalam milisaat
        const sekarang = new Date().getTime();
        
        // Jarak dalam milisaat antara sekarang & anniversary
        const jarakMilisaat = tarikhAnniversary - sekarang;
        
        // Kalau anniversary dah lepas, matikan countdown
        if (jarakMilisaat < 0) {
            clearInterval(interval);
            document.getElementById('days').innerHTML = "00";
            document.getElementById('hours').innerHTML = "00";
            document.getElementById('minutes').innerHTML = "00";
            return;
        }
        
        // Kiraan matematik untuk tukar milisaat ke hari, jam, etc.
        const kiraHari = Math.floor(jarakMilisaat / (1000 * 60 * 60 * 24));
        const kiraJam = Math.floor((jarakMilisaat % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const kiraMinit = Math.floor((jarakMilisaat % (1000 * 60 * 60)) / (1000 * 60));
        
        // Update dalam fail HTML
        document.getElementById('days').innerHTML = formatNombor(kiraHari);
        document.getElementById('hours').innerHTML = formatNombor(kiraJam);
        document.getElementById('minutes').innerHTML = formatNombor(kiraMinit);
        
    }, 1000); // 1000ms = 1s
}

// Fungsi tambahan untuk pastikan nombor tu ada dua digit (contoh: 05, 12)
function formatNombor(nombor) {
    return nombor < 10 ? "0" + nombor : nombor;
}

//================= E. FUNGSI HANTAR BORANG & POP-UP SUKSES =================//
const form = document.getElementById("rsvp-form");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async function(event) {
    event.preventDefault(); // Halang form dari buka page baru
    
    submitBtn.innerHTML = "Tunggu kejap babyyy... ⏳"; // Tukar tulisan butang
    submitBtn.disabled = true; // Kunci butang elak spam
    
    const data = new FormData(event.target);
    
    try {
        const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            // Kalau berjaya hantar, tunjuk Pop-up!
            document.getElementById("success-popup").classList.add('tunjuk');
            form.reset(); // Kosongkan borang
            submitBtn.innerHTML = "Hantar Jawapan ❤️";
            submitBtn.disabled = false;
        } else {
            alert("Alamak, ada masalah sikit. Cuba tekan hantar lagi sekali baby.");
            submitBtn.innerHTML = "Hantar Jawapan ❤️";
            submitBtn.disabled = false;
        }
    } catch (error) {
        alert("Alamak, internet lambat sikit rasanya. Cuba lagi.");
        submitBtn.innerHTML = "Hantar Jawapan ❤️";
        submitBtn.disabled = false;
    }
});