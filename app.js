const container = document.querySelector('.karusell-container');
const indikatorContainer = document.getElementById('karusell-indikatorer');
const totaltAntallKort = container.children.length;
for (let i = 0; i < totaltAntallKort; i++) {
    const prikk = document.createElement('div');
    prikk.classList.add('prikk');
    if (i === 0) prikk.classList.add('aktiv');
    indikatorContainer.appendChild(prikk);
}
const prikker = document.querySelectorAll('.prikk');
container.addEventListener('scroll', () => {
    const kortBredde = container.children[0].offsetWidth + 25;
    const gjeldendeKort = Math.round(container.scrollLeft / kortBredde);
    const tryggIndex = Math.min(Math.max(gjeldendeKort, 0), totaltAntallKort - 1);
    prikker.forEach((prikk, index) => {
        if (index === tryggIndex) {
            prikk.classList.add('aktiv');
        } else {
            prikk.classList.remove('aktiv');
        }
    });
});

let touchStartX = 0;
let touchEndX = 0;

window.addEventListener('touchstart', (event) => {
    const modal = document.getElementById('info-modal');
    if (modal && (event.target === modal || modal.contains(event.target))) {
        touchStartX = event.changedTouches[0].screenX;
    }
}, { passive: true });

window.addEventListener('touchend', (event) => {
    const modal = document.getElementById('info-modal');
    if (modal && (event.target === modal || modal.contains(event.target))) {
        touchEndX = event.changedTouches[0].screenX;
        
        const sveipDistanse = touchStartX - touchEndX;
        const sensitivitet = 80; 

        if (Math.abs(sveipDistanse) > sensitivitet) {
            if (sveipDistanse > 0) {
                visNesteFane(); 
            } else {
                visForrigeFane(); 
            }
        }
    }
}, { passive: true });

window.addEventListener('pointerdown', (event) => {
    const modal = document.getElementById('info-modal');
    if (event.target === modal) {
        lukkModal();
    }
});

function apneFraMeny(faneId) {
    const menyCheckbox = document.querySelector('.meny-checkbox');
    if (menyCheckbox) {
        menyCheckbox.checked = false;
    }
    apneModal(faneId);
}

function apneModal(faneId) {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
        byttFane(faneId);
    }
}

function lukkModal() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; 
    }
}

function byttFane(faneId) {
    const alleInnhold = document.querySelectorAll('.fane-innhold');
    alleInnhold.forEach(innhold => {
        innhold.classList.remove('aktiv');
    });

    const alleKnapper = document.querySelectorAll('.tab-knapp');
    alleKnapper.forEach(knapp => {
        knapp.classList.remove('aktiv');
    });

    const renId = faneId.replace('fane-innhold-', '');
    
    const valgtInnhold = document.getElementById(`fane-innhold-${renId}`);
    const valgtKnapp = document.getElementById(`tab-btn-${renId}`);

    if (valgtInnhold) {
        valgtInnhold.classList.add('aktiv');
    }
    if (valgtKnapp) {
        valgtKnapp.classList.add('aktiv');
        
        valgtKnapp.scrollIntoView({
            behavior: 'smooth', 
            block: 'nearest',   
            inline: 'center'    
        });
    }
}

function visNesteFane() {
    const faner = Array.from(document.querySelectorAll('.fane-innhold')); 
    const aktivFane = faner.find(fane => fane.classList.contains('aktiv')); 
    
    if (aktivFane && faner.length > 0) {
        const gjeldendeIndex = faner.indexOf(aktivFane);
        if (gjeldendeIndex !== -1 && gjeldendeIndex < faner.length - 1) {
            const nesteFaneId = faner[gjeldendeIndex + 1].id;
            byttFane(nesteFaneId); 
        }
    }
}

function visForrigeFane() {
    const faner = Array.from(document.querySelectorAll('.fane-innhold'));
    const aktivFane = faner.find(fane => fane.classList.contains('aktiv')); 
    
    if (aktivFane && faner.length > 0) {
        const gjeldendeIndex = faner.indexOf(aktivFane);
        if (gjeldendeIndex > 0) {
            const forrigeFaneId = faner[gjeldendeIndex - 1].id;
            byttFane(forrigeFaneId); 
        }
    }
}
