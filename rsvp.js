document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwwJFLHxP4MXItt5iLjg3NnTZntj3g7sQpZFE2p3c2a0lHkIvLmtcfGpOiF9HU17r7vMA/exec";

    const skjema = document.getElementById('rsvp-skjema');
    const sendKnapp = document.getElementById('send-knapp');
    const kanIkkeSjekkboks = document.querySelector('.kan-ikke-sjekkboks');
    const deltakelseSjekkbokser = document.querySelectorAll('.deltakelse-sjekkboks');
    const seksjonAntallGjester = document.getElementById('seksjon-antall-gjester');
    const allergiGruppe1 = document.getElementById('allergi-gruppe-1');
    const ekstraGjesterBeholder = document.getElementById('ekstra-gjester-input-beholder');
    const antallGjesterRadionknapper = document.querySelectorAll('input[name="ekstra-antall-gjester"]');

    if (kanIkkeSjekkboks) {
        kanIkkeSjekkboks.addEventListener('change', (e) => {
            if (e.target.checked) {
                deltakelseSjekkbokser.forEach(cb => cb.checked = false);
                if (allergiGruppe1) allergiGruppe1.style.display = 'none';
                if (seksjonAntallGjester) seksjonAntallGjester.style.display = 'none';
                if (ekstraGjesterBeholder) ekstraGjesterBeholder.innerHTML = '';
                antallGjesterRadionknapper.forEach(radio => radio.value === "0" ? radio.checked = true : radio.checked = false);
            } else {
                if (allergiGruppe1) allergiGruppe1.style.display = 'block';
                if (seksjonAntallGjester) seksjonAntallGjester.style.display = 'block';
            }
        });
    }

    deltakelseSjekkbokser.forEach(sjekkboks => {
        sjekkboks.addEventListener('change', () => {
            if (sjekkboks.checked && kanIkkeSjekkboks) {
                kanIkkeSjekkboks.checked = false;
                if (allergiGruppe1) allergiGruppe1.style.display = 'block';
                if (seksjonAntallGjester) seksjonAntallGjester.style.display = 'block';
            }
        });
    });

    antallGjesterRadionknapper.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const antallEkstra = parseInt(e.target.value);
            if (ekstraGjesterBeholder) {
                ekstraGjesterBeholder.innerHTML = '';

                for (let i = 1; i <= antallEkstra; i++) {
                    const gjestNummer = i + 1;
                    const gjestSeksjon = document.createElement('div');
                    gjestSeksjon.classList.add('skjema-seksjon');
                    gjestSeksjon.style.marginTop = '35px';
                    
                    gjestSeksjon.innerHTML = `
                        <hr class="skjema-skille">
                        <h3 style="font-size: 1.6em; margin-bottom: 15px;">Gjest #${gjestNummer}</h3>
                        
                        <div class="skjema-gruppe">
                            <input type="text" id="gjest-navn-${gjestNummer}" class="ekstra-gjest-navn" required placeholder="Fullt navn på gjest #${gjestNummer} *">
                        </div>

                        <p class="skjema-instruksjon" style="margin-top: 15px;">Hva ønsker gjest #${gjestNummer} å delta på? *</p>
                        <div class="valg-kort-container">
                            <label class="valg-kort">
                                <input type="checkbox" name="deltakelse-${gjestNummer}" value="vielse-middag">
                                <div class="kort-innhold">
                                    <span class="kort-ikon">⛪</span>
                                    <span class="kort-tekst">Vielse & middag</span>
                                </div>
                            </label>
                            <label class="valg-kort">
                                <input type="checkbox" name="deltakelse-${gjestNummer}" value="fest-kaker">
                                <div class="kort-innhold">
                                    <span class="kort-ikon">🎉</span>
                                    <span class="kort-tekst">Fest & kaker</span>
                                </div>
                            </label>
                        </div>

                        <div class="skjema-gruppe" style="margin-top: 15px;">
                            <input type="text" id="gjest-allergi-${gjestNummer}" placeholder="Allergier eller dietthensyn for gjest #${gjestNummer}">
                        </div>
                    `;
                    
                    ekstraGjesterBeholder.appendChild(gjestSeksjon);
                }
            }
        });
    });

    let statusMelding = document.getElementById('skjema-status');
    if (!statusMelding && skjema) {
        statusMelding = document.createElement('div');
        statusMelding.id = 'skjema-status';
        statusMelding.style.marginTop = '15px';
        statusMelding.style.textAlign = 'center';
        skjema.appendChild(statusMelding);
    }

    if (skjema) {
        skjema.addEventListener('submit', (e) => {
            e.preventDefault();
            
            sendKnapp.disabled = true;
            sendKnapp.innerText = "Sender...";
            statusMelding.style.display = 'none';

            const valgteDeltakelserHovedgjest = Array.from(
                document.querySelectorAll('input[name="deltakelse-1"]:checked, .kan-ikke-sjekkboks:checked')
            ).map(cb => cb.parentElement.querySelector('.kort-tekst').innerText.trim());

            const valgtRadio = document.querySelector('input[name="ekstra-antall-gjester"]:checked');
            const antallEkstra = valgtRadio ? parseInt(valgtRadio.value) : 0;
            
            let ekstraGjesterListe = [];

            for (let i = 1; i <= antallEkstra; i++) {
                const gjestNummer = i + 1;
                const navnFelt = document.getElementById(`gjest-navn-${gjestNummer}`);
                const allergiFelt = document.getElementById(`gjest-allergi-${gjestNummer}`);
                
                const valgteDeltakelser = Array.from(
                    document.querySelectorAll(`input[name="deltakelse-${gjestNummer}"]:checked`)
                ).map(cb => cb.parentElement.querySelector('.kort-tekst').innerText.trim());

                if (navnFelt && navnFelt.value.trim() !== '') {
                    let gjestInfo = `${navnFelt.value.trim()}`;
                    
                    if (valgteDeltakelser.length > 0) {
                        gjestInfo += ` (Deltar på: ${valgteDeltakelser.join(', ')})`;
                    }
                    if (allergiFelt && allergiFelt.value.trim() !== '') {
                        gjestInfo += ` (Allergi: ${allergiFelt.value.trim()})`;
                    }

                    ekstraGjesterListe.push(gjestInfo);
                }
            }

            const skjemaData = {
                navn: document.getElementById('gjest-navn-1').value,
                deltakelse: valgteDeltakelserHovedgjest.length > 0 ? valgteDeltakelserHovedgjest.join(', ') : 'Ingen valgt',
                allergier: document.getElementById('gjest-allergi-1').value,
                ekstraGjester: ekstraGjesterListe.length > 0 ? ekstraGjesterListe.join(' | ') : 'Ingen',
                epost: document.getElementById('kontakt-epost').value,
                telefon: document.getElementById('kontakt-telefon').value
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(skjemaData)
            })
            .then(() => {
                statusMelding.style.display = 'block';
                stussMelding.style.textAlign = 'center';
                statusMelding.style.color = 'white';
                statusMelding.innerText = "Takk for svaret! Påmeldingen er registrert.";
                skjema.reset();
                if (ekstraGjesterBeholder) ekstraGjesterBeholder.innerHTML = '';
            })
            .catch(error => {
                console.error('Feil ved sending:', error);
                statusMelding.style.display = 'block';
                statusMelding.style.color = 'red';
                statusMelding.innerText = "Noe gikk galt. Vennligst prøv igjen.";
            })
            .finally(() => {
                sendKnapp.disabled = false;
                sendKnapp.innerText = "Send svar";
            });
        });
    }
});