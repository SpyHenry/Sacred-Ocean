// Mobile
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        // Acessibilidade
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        hamburger.tabIndex = 0;

        const toggle = () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            hamburger.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu de navegação');
        };

        // Click
        hamburger.addEventListener('click', toggle);

        // Teclado
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });

        // Fecha ao clicar fora
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
            }
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

// Modal de Imagem - Ampliação Simples
function initSimpleLightbox() {
    // cria overlay se não existir
    let overlay = document.querySelector('.lb-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'lb-overlay';
        overlay.innerHTML = `
            <div class="lb-container" role="dialog" aria-modal="true" aria-label="Visualizador de imagens">
                <button class="lb-nav lb-prev" aria-label="Imagem anterior">&#10094;</button>
                <img class="lb-img" alt="Imagem ampliada" />
                <button class="lb-nav lb-next" aria-label="Próxima imagem">&#10095;</button>
                <button class="lb-close" aria-label="Fechar">&times;</button>
                <div class="lb-counter" aria-live="polite"></div>
            </div>`;
        document.body.appendChild(overlay);
    }

    const lbImg = overlay.querySelector('.lb-img');
    const btnPrev = overlay.querySelector('.lb-prev');
    const btnNext = overlay.querySelector('.lb-next');
    const btnClose = overlay.querySelector('.lb-close');
    const counter = overlay.querySelector('.lb-counter');

    let list = [];
    let index = 0;

    function open(images, start) {
        list = images;
        index = start;
        show();
        overlay.classList.add('active');
        btnClose.focus();
        document.addEventListener('keydown', onKey);
    }

    function close() {
        overlay.classList.remove('active');
        document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    }

    function show() {
        lbImg.src = list[index];
        counter.textContent = `${index + 1} / ${list.length}`;
    }

    function prev() { index = (index - 1 + list.length) % list.length; show(); }
    function next() { index = (index + 1) % list.length; show(); }

    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);
    btnClose.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    // adicionar botão lupa a cada galeria
    document.querySelectorAll('.gallery-main').forEach(main => {
        if (!main.querySelector('.zoom-btn')) {
            const btn = document.createElement('button');
            btn.className = 'zoom-btn';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Ampliar galeria');
            btn.innerHTML = '<i class="fas fa-search-plus"></i>';
            main.appendChild(btn);
            btn.addEventListener('click', () => open(getSources(main), 0));
        }
        const img = main.querySelector('img');
        if (img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => open(getSources(main), 0));
        }
    });

    function getSources(main) {
        const gallery = main.closest('.ong-gallery');
        const arr = [];
        const mainImg = gallery.querySelector('.gallery-main img');
        if (mainImg) arr.push(mainImg.src);
        gallery.querySelectorAll('.gallery-thumbs img').forEach(t => arr.push(t.src));
        return arr;
    }
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
    initSimpleLightbox();
});