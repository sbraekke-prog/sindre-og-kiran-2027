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
/*Sveipe-funksjon*/
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
        const sensitivitet = 50; // Antall piksler man må sveipe for å bytte fane

        if (Math.abs(sveipDistanse) > sensitivitet) {
            if (sveipDistanse > 0) {
                // Sveipet fra høyre mot venstre -> Gå til neste fane
                if (typeof visNesteFane === 'function') {
                    visNesteFane();
                }
            } else {
                // Sveipet fra venstre mot høyre -> Gå til forrige fane
                if (typeof visForrigeFane === 'function') {
                    visForrigeFane();
                }
            }
        }
    }
}, { passive: true });
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

/* RSVP-skjema logikk */
document.addEventListener('DOMContentLoaded', () => {
    const kanIkkeSjekkboks = document.querySelector('.kan-ikke-sjekkboks');
    const deltakelseSjekkbokser = document.querySelectorAll('.deltakelse-sjekkboks');
    const seksjonAntallGjester = document.getElementById('seksjon-antall-gjester');
    const allergiGruppe1 = document.getElementById('allergi-gruppe-1');
    const ekstraGjesterBeholder = document.getElementById('ekstra-gjester-input-beholder');
    const antallGjesterRadionknapper = document.querySelectorAll('input[name="ekstra-antall-gjester"]');

    kanIkkeSjekkboks.addEventListener('change', (e) => {
    if (e.target.checked) {
        deltakelseSjekkbokser.forEach(cb => cb.checked = false);
        if (allergiGruppe1) {
            allergiGruppe1.style.display = 'none';
        }
        if (seksjonAntallGjester) {
            seksjonAntallGjester.style.display = 'none';
        }
        if (ekstraGjesterBeholder) {
            ekstraGjesterBeholder.innerHTML = '';
        }
        antallGjesterRadionknapper.forEach(radio => radio.value === "0" ? radio.checked = true : radio.checked = false);
    } else {
        if (allergiGruppe1) {
            allergiGruppe1.style.display = 'block';
        }
        if (seksjonAntallGjester) {
            seksjonAntallGjester.style.display = 'block';
        }
    }
});

    deltakelseSjekkbokser.forEach(sjekkboks => {
        sjekkboks.addEventListener('change', () => {
            if (sjekkboks.checked) {
                kanIkkeSjekkboks.checked = false;
                if (allergiGruppe1) {
                    allergiGruppe1.style.display = 'block';
                }
                if (seksjonAntallGjester) {
                    seksjonAntallGjester.style.display = 'block';
                }
            } else {
                allergiGruppe1.style.display = 'block';
                seksjonAntallGjester.style.display = 'block';
            }
        });
    });

    antallGjesterRadionknapper.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const antallEkstra = parseInt(e.target.value);
            ekstraGjesterBeholder.innerHTML = '';

            for (let i = 1; i <= antallEkstra; i++) {
                const gjestSeksjon = document.createElement('div');
                gjestSeksjon.classList.add('skjema-seksjon');
                gjestSeksjon.style.marginTop = '35px';
                
                gjestSeksjon.innerHTML = `
                    <hr class="skjema-skille">
                    <h3 style="font-size: 1.6em; margin-bottom: 15px;">Gjest #${i + 1}</h3>
                    
                    <div class="skjema-gruppe">
                        <input type="text" id="gjest-navn-${i + 1}" required placeholder="Fullt navn på gjest #${i + 1} *">
                    </div>

                    <p class="skjema-instruksjon" style="margin-top: 15px;">Hva ønsker gjest #${i + 1} å delta på? *</p>
                    <div class="valg-kort-container">
                        <label class="valg-kort">
                            <input type="checkbox" name="deltakelse-${i + 1}" value="vielse-middag">
                            <div class="kort-innhold">
                                <span class="kort-ikon">⛪</span>
                                <span class="kort-tekst">Vielse & middag</span>
                            </div>
                        </label>
                        <label class="valg-kort">
                            <input type="checkbox" name="deltakelse-${i + 1}" value="fest-kaker">
                            <div class="kort-innhold">
                                <span class="kort-ikon">🎉</span>
                                <span class="kort-tekst">Fest & kaker</span>
                            </div>
                        </label>
                    </div>

                    <div class="skjema-gruppe" style="margin-top: 15px;">
                        <input type="text" id="gjest-allergi-${i + 1}" placeholder="Allergier eller dietthensyn for gjest #${i + 1}">
                    </div>
                `;
                
                ekstraGjesterBeholder.appendChild(gjestSeksjon);
            }
        });
    });
});