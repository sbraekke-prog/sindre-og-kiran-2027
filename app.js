const container = document.querySelector('.karusell-container');
const indikatorContainer = document.getElementById('karusell-indikatorer');
const totaltAntallKort = container.children.length;
for (let i = 0; i < totaltAntallKort; i++) {
    const prikk = document.createElement('div');
    prikk.classList.add('prikk');
    if (i === 0) prikk.classList.add('aktiv'); // Det første kortet starter som aktivt
    indikatorContainer.appendChild(prikk);
}
const prikker = document.querySelectorAll('.prikk');
container.addEventListener('scroll', () => {
    const kortBredde = container.children[0].offsetWidth + 25; // Bredde + gap
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
function apneModal(faneId) {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
    
    byttFane(faneId);
}

function lukkModal() {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'none';
    document.body.style.overflow = ''; 
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

    const valgtInnhold = document.getElementById(`fane-innhold-${faneId}`);
    const valgtKnapp = document.getElementById(`tab-btn-${faneId}`);

    if (valgtInnhold && valgtKnapp) {
        valgtInnhold.classList.add('aktiv');
        valgtKnapp.classList.add('aktiv');
    }
}

window.addEventListener('click', (event) => {
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