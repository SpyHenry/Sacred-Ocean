// Mobile
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Gallery Image Swap
function initGallery() {
    const galleryThumbs = document.querySelectorAll('.gallery-thumbs img');
    
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const mainImg = thumb.closest('.ong-gallery').querySelector('.gallery-main img');
            if (mainImg) {
                const tempSrc = mainImg.src;
                mainImg.src = thumb.src;
                thumb.src = tempSrc;
            }
        });
    });
}

// Education Tabs
function initEducationTabs() {
    const eduTabs = document.querySelectorAll('.edu-tab');
    const eduContents = document.querySelectorAll('.edu-content');

    eduTabs.forEach(tab => {
        tab.addEventListener('click', () => {

            eduTabs.forEach(t => t.classList.remove('active'));
            eduContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
    
            const targetContent = document.getElementById(tab.dataset.tab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ONG Links
function initONGLinks() {
    const learnMoreButtons = document.querySelectorAll('.btn-learn-more[data-url]');
    
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}

// Sons do Oceano - Áudio Player
function initOceanSounds() {
    const playButtons = document.querySelectorAll('.play-btn');
    let currentAudio = null;
    let currentBtn = null;

    playButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const audioId = 'audio-' + btn.dataset.audio;
            const audio = document.getElementById(audioId);
            if (!audio) return;

            // Pausa o áudio anterior se houver
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentBtn) currentBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            }

            if (audio.paused) {
                audio.play();
                btn.querySelector('i').classList.replace('fa-play', 'fa-pause');
                currentAudio = audio;
                currentBtn = btn;
            } else {
                audio.pause();
                btn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            }
        });
    });

    // Atualiza barra de progresso
    document.querySelectorAll('audio').forEach(audio => {
        const progressBar = audio.parentElement.querySelector('.progress-bar');
        audio.addEventListener('timeupdate', () => {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percent + '%';
        });
        audio.addEventListener('ended', () => {
            progressBar.style.width = '0%';
            if (currentBtn) currentBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
        });
    });
}

// Initialize

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initGallery();
    initEducationTabs();
    initONGLinks();
    initOceanSounds();
});