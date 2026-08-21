const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkiHcAkOfidBnoms6UNut5zRNhncZ4_Q7O5AxOsQqnn8AGYpBqoNzzvButveP4XOeEug/exec";

const skjema = document.getElementById('rsvp-skjema');
const statusMelding = document.getElementById('skjema-status');
const sendKnapp = document.getElementById('send-knapp');

skjema.addEventListener('submit', (e) => {
    e.preventDefault(); // Forhindrer at siden laster på nytt
    
    sendKnapp.disabled = true;
    sendKnapp.innerText = "Sender...";

    const skjemaData = {
        navn: document.getElementById('navn').value,
        epost: document.getElementById('epost').value,
        kommer: document.getElementById('kommer').value,
        allergier: document.getElementById('allergier').value
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Viktig for å unngå CORS-blokkering fra Google Apps Script
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(skjemaData)
    })
    .then(() => {
        statusMelding.style.display = 'block';
        statusMelding.innerText = "Takk for svaret! Påmeldingen er registrert.";
        skjema.reset();
        sendKnapp.disabled = false;
        sendKnapp.innerText = "Send svar";
    })
    .catch(error => {
        console.error('Feil:', error);
        statusMelding.style.display = 'block';
        statusMelding.innerText = "Noe gikk galt. Prøv igjen senere.";
        sendKnapp.disabled = false;
        sendKnapp.innerText = "Send svar";
    });
});