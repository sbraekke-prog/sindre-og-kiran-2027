const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5FANZMMUL0JVonBTizYUpDYfgAQ5S7hnU2JXRDb35oD71jhdDyKSud2mXzyNhBS_q5A/exec";

const skjema = document.getElementById('rsvp-skjema');
const sendKnapp = document.getElementById('send-knapp');

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
            document.querySelectorAll('input[name="deltakelse-1"]:checked')
        ).map(cb => cb.parentElement.querySelector('.kort-tekst').innerText.trim());


        const ekstraGjesterValg = document.querySelector('input[name="ekstra-antall-gjester"]:checked');
        const ekstraGjester = ekstraGjesterValg ? ekstraGjesterValg.value : "0";


        const skjemaData = {
            navn: document.getElementById('gjest-navn-1').value,
            deltakelse: valgteDeltakelser.length > 0 ? valgteDeltakelser.join(', ') : 'Ingen valgt',
            allergier: document.getElementById('gjest-allergi-1').value,
            ekstraGjester: ekstraGjester,
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