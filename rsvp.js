const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5FANZMMUL0JVonBTizYUpDYfgAQ5S7hnU2JXRDb35oD71jhdDyKSud2mXzyNhBS_q5A/exec";

const skjema = document.getElementById('rsvp-skjema');
const sendKnapp = document.getElementById('send-knapp');
const ekstraBeholder = document.getElementById('ekstra-gjester-input-beholder');

document.querySelectorAll('input[name="ekstra-antall-gjester"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const antall = parseInt(e.target.value);
        if (ekstraBeholder) {
            ekstraBeholder.innerHTML = '';
            for (let i = 1; i <= antall; i++) {
                const feltGruppe = document.createElement('div');
                feltGruppe.className = 'skjema-seksjon ekstra-gjest-seksjon';
                feltGruppe.style.marginTop = '20px';
                feltGruppe.innerHTML = `
                    <hr class="skjema-skille">
                    <p class="skjema-instruksjon"><strong>Ekstra gjest ${i}</strong></p>
                    <div class="skjema-gruppe">
                        <input type="text" class="ekstra-gjest-navn" placeholder="Navn på gjest ${i}" required>
                    </div>
                    <div class="skjema-gruppe" style="margin-top: 10px;">
                        <input type="text" class="ekstra-gjest-allergi" placeholder="Allergier/mathensyn for gjest ${i}">
                    </div>
                `;
                ekstraBeholder.appendChild(feltGruppe);
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

        const valgteDeltakelser = Array.from(
            document.querySelectorAll('input[name="deltakelse-1"]:checked, .kan-ikke-sjekkboks:checked')
        ).map(cb => cb.parentElement.querySelector('.kort-tekst').innerText.trim());

        const ekstraGjesterRadio = document.querySelector('input[name="ekstra-antall-gjester"]:checked');
        const antallEkstra = ekstraGjesterRadio ? parseInt(ekstraGjesterRadio.value) : 0;
        
        let ekstraGjesterVerdi = "Nei";

        if (antallEkstra > 0) {
            const ekstraNavn = Array.from(document.querySelectorAll('.ekstra-gjest-navn')).map(input => input.value.trim());
            const ekstraAllergier = Array.from(document.querySelectorAll('.ekstra-gjest-allergi')).map(input => input.value.trim());

            let detaljer = [];
            for (let i = 0; i < ekstraNavn.length; i++) {
                if (ekstraNavn[i]) {
                    let info = ekstraNavn[i];
                    if (ekstraAllergier[i]) {
                        info += ` (Allergi: ${ekstraAllergier[i]})`;
                    }
                    detaljer.push(info);
                }
            }

            const valgtEtikett = ekstraGjesterRadio.parentElement.querySelector('.kort-tekst').innerText.trim();
            ekstraGjesterVerdi = `${valgtEtikett}: ${detaljer.join(' | ')}`;
        }

        const skjemaData = {
            navn: document.getElementById('gjest-navn-1').value,
            deltakelse: valgteDeltakelser.length > 0 ? valgteDeltakelser.join(', ') : 'Ingen valgt',
            allergier: document.getElementById('gjest-allergi-1').value,
            ekstraGjester: ekstraGjesterVerdi,
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
            statusMelding.style.color = 'green';
            statusMelding.innerText = "Takk for svaret! Påmeldingen er registrert.";
            skjema.reset();
            if (ekstraBeholder) ekstraBeholder.innerHTML = '';
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